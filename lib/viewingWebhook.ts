const ALLOWED_BUILDING_TYPES = new Set([
  'Plexes',
  'Laneway Houses & Garden Suites',
  'Movable Houses',
]);

const ALLOWED_LOCATIONS = new Set([
  'Toronto',
  'Vancouver',
  'Montreal',
  'Calgary',
]);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export interface ViewingRequestResult {
  status: number;
  body: Record<string, unknown>;
}

function validateWebhookUrl(rawUrl: string): URL | null {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return null;
    }
    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === '169.254.169.254' ||
      hostname === 'metadata.google.internal'
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function processViewingRequest(
  rawBody: unknown
): Promise<ViewingRequestResult> {
  if (!rawBody || typeof rawBody !== 'object') {
    return { status: 400, body: { error: 'Invalid request payload.' } };
  }

  const body = rawBody as Record<string, unknown>;

  const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const location = typeof body.location === 'string' ? body.location.trim() : '';
  const viewingDateTime =
    typeof body.viewingDateTime === 'string' ? body.viewingDateTime.trim() : '';
  const viewingDate =
    typeof body.viewingDate === 'string' ? body.viewingDate.trim() : '';
  const viewingTime =
    typeof body.viewingTime === 'string' ? body.viewingTime.trim() : '';
  const moreRequest =
    typeof body.moreRequest === 'string' ? body.moreRequest.trim().slice(0, 1500) : '';
  const budget = Number(body.budget);

  const rawBuildingTypes = Array.isArray(body.buildingTypes) ? body.buildingTypes : [];
  const buildingTypes = rawBuildingTypes.filter(
    (item: unknown): item is string =>
      typeof item === 'string' && ALLOWED_BUILDING_TYPES.has(item)
  );

  const fieldErrors: Record<string, string> = {};

  if (fullName.length < 2 || fullName.length > 120) {
    fieldErrors.fullName = 'Please enter your full name.';
  }
  if (!EMAIL_REGEX.test(email)) {
    fieldErrors.email = 'Please provide a valid email address.';
  }
  const phoneDigits = phone.replace(/\D/g, '');
  if (phoneDigits.length < 7 || phone.length > 32) {
    fieldErrors.phone = 'Please provide a valid phone number.';
  }
  if (buildingTypes.length === 0) {
    fieldErrors.buildingTypes = 'Select at least one building type.';
  }
  if (!ALLOWED_LOCATIONS.has(location)) {
    fieldErrors.location = 'Please select Toronto, Vancouver, Montreal, or Calgary.';
  }
  if (!Number.isFinite(budget) || budget <= 0) {
    fieldErrors.budget = 'Please enter a valid positive budget.';
  }

  const parsedDate = viewingDateTime ? new Date(viewingDateTime) : null;
  if (!parsedDate || Number.isNaN(parsedDate.getTime())) {
    fieldErrors.viewingDateTime = 'Please select a valid viewing date and time.';
  } else {
    const clientToday =
      typeof body.clientToday === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.clientToday)
        ? body.clientToday
        : new Date().toISOString().slice(0, 10);
    const selectedDay = viewingDate || viewingDateTime.slice(0, 10);
    if (selectedDay < clientToday) {
      fieldErrors.viewingDateTime = 'Viewing date cannot be in the past.';
    } else if (
      typeof body.clientNowTime === 'string' &&
      /^\d{2}:\d{2}$/.test(body.clientNowTime) &&
      selectedDay === clientToday &&
      viewingTime &&
      viewingTime < body.clientNowTime
    ) {
      fieldErrors.viewingDateTime = 'Viewing time cannot be earlier than the current time.';
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: 400,
      body: {
        error: 'Please check the highlighted form fields.',
        fieldErrors,
      },
    };
  }

  const rawWebhookUrl = (process.env.N8N_WEBHOOK_URL || '').trim();
  if (!rawWebhookUrl) {
    return {
      status: 503,
      body: {
        configured: false,
        error:
          'The n8n webhook endpoint is not configured yet. Please set N8N_WEBHOOK_URL in your environment variables.',
      },
    };
  }

  const validWebhookUrl = validateWebhookUrl(rawWebhookUrl);
  if (!validWebhookUrl) {
    return {
      status: 500,
      body: {
        configured: false,
        error: 'Configured N8N_WEBHOOK_URL is not a valid HTTP/HTTPS URL.',
      },
    };
  }

  const n8nPayload = {
    fullName,
    email,
    phone,
    buildingTypes,
    viewingDateTime,
    viewingDate,
    viewingTime,
    budget,
    location,
    moreRequest,
    source: "Ramona's Home Web",
    submittedAt: new Date().toISOString(),
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const webhookResponse = await fetch(validWebhookUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain;q=0.9',
      },
      body: JSON.stringify(n8nPayload),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const contentType = webhookResponse.headers.get('content-type') || '';
    const rawText = await webhookResponse.text();

    let parsedBody: unknown = null;
    if (rawText) {
      if (
        contentType.includes('application/json') ||
        rawText.trim().startsWith('{') ||
        rawText.trim().startsWith('[')
      ) {
        try {
          parsedBody = JSON.parse(rawText);
        } catch {
          parsedBody = { message: rawText };
        }
      } else {
        parsedBody = { message: rawText };
      }
    }

    return {
      status: 200,
      body: {
        configured: true,
        webhookStatus: webhookResponse.status,
        webhookOk: webhookResponse.ok,
        data: parsedBody,
      },
    };
  } catch (err) {
    const isAbort = err instanceof Error && err.name === 'AbortError';
    return {
      status: 502,
      body: {
        configured: true,
        error: isAbort
          ? 'The n8n workflow timed out before responding. Please try again.'
          : 'Unable to reach the n8n webhook endpoint. Verify the workflow is active.',
      },
    };
  }
}
