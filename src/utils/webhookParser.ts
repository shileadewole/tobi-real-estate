import type { DynamicTimeSlot, WebhookOutcome } from '../types/viewing';

const SLOT_ARRAY_KEYS = [
  'availableTimeslots',
  'availableTimeSlots',
  'availableSlots',
  'available_timeslots',
  'available_slots',
  'available_times',
  'timeslots',
  'timeSlots',
  'slots',
  'suggestedSlots',
  'alternativeSlots',
  'alternatives',
  'options',
];

const IGNORED_DETAIL_KEYS = new Set([
  'available',
  'isAvailable',
  'slotAvailable',
  'success',
  'ok',
  'status',
  'message',
  'msg',
  'reason',
  'error',
  'headline',
  'title',
  ...SLOT_ARRAY_KEYS,
]);

function formatKeyLabel(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function to24HourTime(rawTime: string): string | undefined {
  const trimmed = rawTime.trim();
  const match24 = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (match24) {
    const h = Number(match24[1]);
    const m = Number(match24[2]);
    if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }
  }
  const match12 = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match12) {
    let h = Number(match12[1]);
    const m = Number(match12[2]);
    const meridiem = match12[3].toUpperCase();
    if (h >= 1 && h <= 12 && m >= 0 && m <= 59) {
      if (meridiem === 'PM' && h !== 12) h += 12;
      if (meridiem === 'AM' && h === 12) h = 0;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }
  }
  return undefined;
}

function parseSlotItem(item: unknown, index: number): DynamicTimeSlot | null {
  if (typeof item === 'string') {
    const label = item.trim();
    if (!label) return null;
    const dateMatch = label.match(/(\d{4}-\d{2}-\d{2})/);
    const timeMatch = label.match(/(\d{1,2}:\d{2}(?:\s*(?:AM|PM))?)/i);
    const parsedTime = timeMatch ? to24HourTime(timeMatch[1]) : undefined;
    return {
      id: `slot-${index}-${label}`,
      label,
      date: dateMatch?.[1],
      time: parsedTime,
      dateTime: dateMatch && parsedTime ? `${dateMatch[1]}T${parsedTime}` : undefined,
      raw: item,
    };
  }

  if (item && typeof item === 'object') {
    const record = item as Record<string, unknown>;
    const rawDate =
      typeof record.date === 'string'
        ? record.date.trim()
        : typeof record.day === 'string'
          ? record.day.trim()
          : undefined;
    const rawTimeCandidate =
      typeof record.time === 'string'
        ? record.time.trim()
        : typeof record.startTime === 'string'
          ? record.startTime.trim()
          : typeof record.start === 'string'
            ? record.start.trim()
            : undefined;

    const rawIso =
      typeof record.dateTime === 'string'
        ? record.dateTime.trim()
        : typeof record.datetime === 'string'
          ? record.datetime.trim()
          : typeof record.iso === 'string'
            ? record.iso.trim()
            : typeof record.value === 'string'
              ? record.value.trim()
              : typeof record.slot === 'string'
                ? record.slot.trim()
                : undefined;

    let date = rawDate && /^\d{4}-\d{2}-\d{2}$/.test(rawDate) ? rawDate : undefined;
    let time = rawTimeCandidate ? to24HourTime(rawTimeCandidate) : undefined;

    if (rawIso) {
      const isoDateMatch = rawIso.match(/(\d{4}-\d{2}-\d{2})/);
      const isoTimeMatch = rawIso.match(/T(\d{2}:\d{2})/) || rawIso.match(/(\d{1,2}:\d{2}(?:\s*(?:AM|PM))?)/i);
      if (!date && isoDateMatch) date = isoDateMatch[1];
      if (!time && isoTimeMatch) time = to24HourTime(isoTimeMatch[1]);
    }

    const explicitLabel =
      typeof record.label === 'string'
        ? record.label.trim()
        : typeof record.display === 'string'
          ? record.display.trim()
          : typeof record.formatted === 'string'
            ? record.formatted.trim()
            : typeof record.text === 'string'
              ? record.text.trim()
              : undefined;

    const fallbackLabel =
      explicitLabel ||
      [rawDate || date, rawTimeCandidate || time].filter(Boolean).join(' · ') ||
      rawIso ||
      JSON.stringify(record);

    return {
      id: `slot-${index}-${fallbackLabel}`,
      label: fallbackLabel,
      date,
      time,
      dateTime: date && time ? `${date}T${time}` : rawIso,
      raw: item,
    };
  }

  return null;
}

function extractDetails(obj: Record<string, unknown>): Array<{ label: string; value: string }> {
  const details: Array<{ label: string; value: string }> = [];
  for (const [key, val] of Object.entries(obj)) {
    if (IGNORED_DETAIL_KEYS.has(key) || val === null || val === undefined || val === '') {
      continue;
    }
    if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
      details.push({
        label: formatKeyLabel(key),
        value: String(val),
      });
    } else if (Array.isArray(val) && val.every((v) => typeof v === 'string' || typeof v === 'number')) {
      if (val.length > 0) {
        details.push({
          label: formatKeyLabel(key),
          value: val.join(', '),
        });
      }
    }
  }
  return details;
}

export function parseN8nWebhookResponse(
  webhookOk: boolean,
  webhookStatus: number,
  rawData: unknown
): WebhookOutcome {
  let payload: unknown = rawData;

  if (Array.isArray(payload) && payload.length === 1 && payload[0] && typeof payload[0] === 'object') {
    payload = payload[0];
  }

  if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
    const obj = payload as Record<string, unknown>;
    if (obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data) && Object.keys(obj).length <= 2) {
      payload = obj.data;
    }
  }

  let slots: DynamicTimeSlot[] = [];
  let record: Record<string, unknown> = {};

  if (Array.isArray(payload)) {
    slots = payload
      .map((item, idx) => parseSlotItem(item, idx))
      .filter((s): s is DynamicTimeSlot => s !== null);
  } else if (payload && typeof payload === 'object') {
    record = payload as Record<string, unknown>;
    for (const key of SLOT_ARRAY_KEYS) {
      const candidate = record[key];
      if (Array.isArray(candidate)) {
        slots = candidate
          .map((item, idx) => parseSlotItem(item, idx))
          .filter((s): s is DynamicTimeSlot => s !== null);
        if (slots.length > 0) break;
      }
    }
  }

  const statusText = typeof record.status === 'string' ? record.status.toLowerCase() : '';
  const explicitUnavailable =
    record.available === false ||
    record.isAvailable === false ||
    record.slotAvailable === false ||
    record.success === false ||
    statusText.includes('unavail') ||
    statusText.includes('conflict') ||
    statusText.includes('taken') ||
    statusText.includes('booked') ||
    statusText.includes('busy') ||
    webhookStatus === 409 ||
    slots.length > 0;

  const responseMessage =
    (typeof record.message === 'string' && record.message.trim()) ||
    (typeof record.reason === 'string' && record.reason.trim()) ||
    (typeof record.error === 'string' && record.error.trim()) ||
    (typeof record.msg === 'string' && record.msg.trim()) ||
    (typeof rawData === 'string' && rawData.trim()) ||
    '';

  const details = extractDetails(record);

  if (explicitUnavailable) {
    return {
      kind: 'unavailable',
      headline:
        (typeof record.headline === 'string' && record.headline.trim()) ||
        'Selected Viewing Time Is Unavailable',
      message:
        responseMessage ||
        'The requested viewing slot is no longer open. Choose one of the live available timeslots returned below.',
      slots,
      details,
      rawData,
    };
  }

  if (!webhookOk) {
    return {
      kind: 'error',
      headline: 'Workflow Returned an Error',
      message:
        responseMessage || `The n8n webhook responded with status ${webhookStatus}.`,
      slots: [],
      details,
      rawData,
    };
  }

  return {
    kind: 'success',
    headline:
      (typeof record.headline === 'string' && record.headline.trim()) ||
      'Private Viewing Request Confirmed',
    message:
      responseMessage ||
      'Your request has been received and confirmed by Ramona’s Home scheduling workflow.',
    slots: [],
    details,
    rawData,
  };
}
