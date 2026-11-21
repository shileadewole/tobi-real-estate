import { useEffect, useState, type FormEvent } from 'react';
import {
  ArrowRight,
  CalendarClock,
  Check,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import type {
  BuildingType,
  CityLocation,
  DynamicTimeSlot,
  ViewingFormValues,
  WebhookOutcome,
} from '../types/viewing';
import {
  DateTimeCalendarPicker,
  getLocalNowTimeHHMM,
  getLocalTodayISO,
} from './DateTimeCalendarPicker';
import { parseN8nWebhookResponse } from '../utils/webhookParser';

const BUILDING_OPTIONS: BuildingType[] = [
  'Plexes',
  'Laneway Houses & Garden Suites',
  'Movable Houses',
];

const CITY_OPTIONS: CityLocation[] = [
  'Toronto',
  'Vancouver',
  'Montreal',
  'Calgary',
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface ViewingRequestFormProps {
  preselectedBuilding?: BuildingType;
  preselectedCity?: CityLocation;
  id?: string;
}

export function ViewingRequestForm({
  preselectedBuilding,
  preselectedCity,
  id = 'viewing-form',
}: ViewingRequestFormProps) {
  const [values, setValues] = useState<ViewingFormValues>(() => ({
    fullName: '',
    email: '',
    phone: '',
    buildingTypes: preselectedBuilding ? [preselectedBuilding] : [],
    viewingDate: getLocalTodayISO(),
    viewingTime: '11:00',
    budget: '',
    location: preselectedCity || '',
    moreRequest: '',
  }));

  const [errors, setErrors] = useState<Partial<Record<keyof ViewingFormValues | 'viewingDateTime', string>>>({});
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [outcome, setOutcome] = useState<WebhookOutcome | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedBuilding) {
      setValues((prev) =>
        prev.buildingTypes.includes(preselectedBuilding)
          ? prev
          : { ...prev, buildingTypes: [...prev.buildingTypes, preselectedBuilding] }
      );
    }
  }, [preselectedBuilding]);

  useEffect(() => {
    if (preselectedCity) {
      setValues((prev) => ({ ...prev, location: preselectedCity }));
    }
  }, [preselectedCity]);

  const validateAll = (draft: ViewingFormValues) => {
    const nextErrors: Partial<Record<keyof ViewingFormValues | 'viewingDateTime', string>> = {};
    const todayISO = getLocalTodayISO();
    const nowTime = getLocalNowTimeHHMM();

    if (draft.fullName.trim().length < 2) {
      nextErrors.fullName = 'Full name is required.';
    }

    if (!draft.email.trim()) {
      nextErrors.email = 'Email address is required.';
    } else if (!EMAIL_REGEX.test(draft.email.trim())) {
      nextErrors.email = 'Enter a valid email address (for example, name@domain.com).';
    }

    const phoneDigits = draft.phone.replace(/\D/g, '');
    if (!draft.phone.trim()) {
      nextErrors.phone = 'Phone number is required.';
    } else if (phoneDigits.length < 7) {
      nextErrors.phone = 'Enter a valid phone number with at least 7 digits.';
    }

    if (draft.buildingTypes.length === 0) {
      nextErrors.buildingTypes = 'Select at least one building type.';
    }

    if (!draft.viewingDate || !draft.viewingTime) {
      nextErrors.viewingDateTime = 'Both viewing date and time are required.';
    } else if (draft.viewingDate < todayISO) {
      nextErrors.viewingDateTime = 'Past dates cannot be selected. Choose today or an upcoming date.';
    } else if (draft.viewingDate === todayISO && draft.viewingTime < nowTime) {
      nextErrors.viewingDateTime = 'For today, select a time from the current hour forward.';
    }

    const numericBudget = Number(draft.budget);
    if (!draft.budget.trim()) {
      nextErrors.budget = 'Budget is required.';
    } else if (!Number.isFinite(numericBudget) || numericBudget <= 0) {
      nextErrors.budget = 'Enter a valid numeric budget greater than zero.';
    }

    if (!draft.location) {
      nextErrors.location = 'Please choose a city location.';
    }

    return nextErrors;
  };

  const submitToWebhook = async (draft: ViewingFormValues) => {
    const validationErrors = validateAll(draft);
    setErrors(validationErrors);
    setTouchedEmail(true);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setOutcome(null);
    setSelectedSlotId(null);

    try {
      const response = await fetch('/api/viewing-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: draft.fullName.trim(),
          email: draft.email.trim(),
          phone: draft.phone.trim(),
          buildingTypes: draft.buildingTypes,
          viewingDate: draft.viewingDate,
          viewingTime: draft.viewingTime,
          viewingDateTime: `${draft.viewingDate}T${draft.viewingTime}`,
          budget: Number(draft.budget),
          location: draft.location,
          moreRequest: draft.moreRequest.trim(),
          clientToday: getLocalTodayISO(),
          clientNowTime: getLocalNowTimeHHMM(),
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        if (json.fieldErrors && typeof json.fieldErrors === 'object') {
          setErrors(json.fieldErrors);
        }
        setOutcome({
          kind: 'error',
          headline: json.configured === false ? 'Webhook Configuration Needed' : 'Unable to Process Request',
          message: json.error || 'The viewing request could not be completed.',
          slots: [],
          details: [],
          rawData: json,
        });
        return;
      }

      const parsed = parseN8nWebhookResponse(
        Boolean(json.webhookOk),
        Number(json.webhookStatus || 200),
        json.data
      );
      setOutcome(parsed);
    } catch {
      setOutcome({
        kind: 'error',
        headline: 'Connection Interrupted',
        message: 'Could not connect to the booking service. Please verify your network connection and retry.',
        slots: [],
        details: [],
        rawData: null,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void submitToWebhook(values);
  };

  const handleToggleBuildingType = (type: BuildingType) => {
    setValues((prev) => {
      const exists = prev.buildingTypes.includes(type);
      const next = exists
        ? prev.buildingTypes.filter((item) => item !== type)
        : [...prev.buildingTypes, type];
      return { ...prev, buildingTypes: next };
    });
    setErrors((prev) => ({ ...prev, buildingTypes: undefined }));
  };

  const handleSelectDynamicSlot = (slot: DynamicTimeSlot) => {
    setSelectedSlotId(slot.id);
    const todayISO = getLocalTodayISO();
    const nextDate = slot.date && slot.date >= todayISO ? slot.date : values.viewingDate;
    const nextTime = slot.time || values.viewingTime;

    const updated: ViewingFormValues = {
      ...values,
      viewingDate: nextDate,
      viewingTime: nextTime,
    };
    setValues(updated);
    setErrors((prev) => ({ ...prev, viewingDateTime: undefined }));
  };

  const handleReset = () => {
    setOutcome(null);
    setSelectedSlotId(null);
    setErrors({});
    setTouchedEmail(false);
    setValues({
      fullName: '',
      email: '',
      phone: '',
      buildingTypes: preselectedBuilding ? [preselectedBuilding] : [],
      viewingDate: getLocalTodayISO(),
      viewingTime: '11:00',
      budget: '',
      location: preselectedCity || '',
      moreRequest: '',
    });
  };

  if (outcome?.kind === 'success') {
    return (
      <div
        id={id}
        className="bg-white border border-[#B6AF9D] p-8 sm:p-12 space-y-8"
        aria-live="polite"
      >
        <div className="flex items-start gap-4 border-b border-[#B6AF9D]/50 pb-6">
          <CheckCircle2 className="w-7 h-7 text-[#151513] shrink-0 mt-1" aria-hidden="true" />
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#534F46]">
              Private Viewing Confirmed
            </p>
            <h3 className="font-editorial text-3xl sm:text-4xl text-[#151513] leading-tight">
              {outcome.headline}
            </h3>
            <p className="text-base text-[#534F46] leading-relaxed">
              {outcome.message}
            </p>
          </div>
        </div>

        {outcome.details.length > 0 && (
          <div className="bg-[#FAF7F0] border border-[#B6AF9D]/60 p-6 space-y-4">
            <h4 className="text-xs font-medium uppercase tracking-[0.14em] text-[#534F46]">
              Scheduling Details
            </h4>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              {outcome.details.map((item) => (
                <div key={item.label} className="border-b border-[#B6AF9D]/30 pb-2">
                  <dt className="text-xs text-[#534F46]">{item.label}</dt>
                  <dd className="text-sm font-medium text-[#151513] mt-0.5 tabular-nums">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-[#534F46] pt-2">
          <div>
            <span className="block text-xs text-[#534F46]">Guest</span>
            <span className="font-medium text-[#151513]">{values.fullName}</span>
          </div>
          <div>
            <span className="block text-xs text-[#534F46]">Location & Typology</span>
            <span className="font-medium text-[#151513]">
              {values.location} · {values.buildingTypes.join(', ')}
            </span>
          </div>
          <div>
            <span className="block text-xs text-[#534F46]">Requested Date & Time</span>
            <span className="font-medium text-[#151513] tabular-nums">
              {values.viewingDate} at {values.viewingTime}
            </span>
          </div>
          <div>
            <span className="block text-xs text-[#534F46]">Budget</span>
            <span className="font-medium text-[#151513] tabular-nums">
              ${Number(values.budget).toLocaleString()} CAD
            </span>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#151513] text-sm font-medium text-[#151513] hover:bg-[#151513] hover:text-white transition-colors"
          >
            Schedule Another Viewing
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      noValidate
      className="bg-white border border-[#B6AF9D] p-6 sm:p-10 lg:p-12 space-y-8"
    >
      <div className="border-b border-[#B6AF9D]/50 pb-6">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#534F46]">
          Private Consultation & Viewing
        </p>
        <h3 className="font-editorial text-3xl sm:text-4xl text-[#151513] mt-2">
          Reserve Your Architectural Tour
        </h3>
        <p className="text-sm text-[#534F46] mt-2 leading-relaxed max-w-2xl">
          Share your preferred residence typology, city, and viewing time. Live availability is verified immediately with our concierge workflow.
        </p>
      </div>

      {/* Contact Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label
            htmlFor="full-name"
            className="block text-xs font-medium tracking-wide text-[#534F46] mb-1.5"
          >
            Full Name <span className="text-[#9A4109]">*</span>
          </label>
          <input
            id="full-name"
            type="text"
            value={values.fullName}
            onChange={(e) => {
              setValues((p) => ({ ...p, fullName: e.target.value }));
              setErrors((p) => ({ ...p, fullName: undefined }));
            }}
            placeholder="Elena Vance"
            required
            className="w-full h-11 px-3.5 bg-[#FAF7F0]/50 border border-[#B6AF9D] text-sm text-[#151513] placeholder:text-[#878276] focus:outline-none focus:border-[#151513] focus:bg-white transition-colors"
          />
          {errors.fullName && (
            <p role="alert" className="mt-1.5 text-xs font-medium text-[#9A4109]">
              {errors.fullName}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email-address"
            className="block text-xs font-medium tracking-wide text-[#534F46] mb-1.5"
          >
            Email Address <span className="text-[#9A4109]">*</span>
          </label>
          <input
            id="email-address"
            type="email"
            value={values.email}
            onBlur={() => {
              setTouchedEmail(true);
              if (values.email.trim() && !EMAIL_REGEX.test(values.email.trim())) {
                setErrors((p) => ({
                  ...p,
                  email: 'Enter a valid email address (for example, name@domain.com).',
                }));
              }
            }}
            onChange={(e) => {
              const nextEmail = e.target.value;
              setValues((p) => ({ ...p, email: nextEmail }));
              if (touchedEmail && nextEmail.trim() && !EMAIL_REGEX.test(nextEmail.trim())) {
                setErrors((p) => ({
                  ...p,
                  email: 'Enter a valid email address (for example, name@domain.com).',
                }));
              } else {
                setErrors((p) => ({ ...p, email: undefined }));
              }
            }}
            placeholder="elena@example.com"
            required
            className="w-full h-11 px-3.5 bg-[#FAF7F0]/50 border border-[#B6AF9D] text-sm text-[#151513] placeholder:text-[#878276] focus:outline-none focus:border-[#151513] focus:bg-white transition-colors"
          />
          {errors.email && (
            <p role="alert" className="mt-1.5 text-xs font-medium text-[#9A4109]">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone-number"
            className="block text-xs font-medium tracking-wide text-[#534F46] mb-1.5"
          >
            Phone Number <span className="text-[#9A4109]">*</span>
          </label>
          <input
            id="phone-number"
            type="tel"
            value={values.phone}
            onChange={(e) => {
              setValues((p) => ({ ...p, phone: e.target.value }));
              setErrors((p) => ({ ...p, phone: undefined }));
            }}
            placeholder="+1 (416) 555-0194"
            required
            className="w-full h-11 px-3.5 bg-[#FAF7F0]/50 border border-[#B6AF9D] text-sm text-[#151513] placeholder:text-[#878276] tabular-nums focus:outline-none focus:border-[#151513] focus:bg-white transition-colors"
          />
          {errors.phone && (
            <p role="alert" className="mt-1.5 text-xs font-medium text-[#9A4109]">
              {errors.phone}
            </p>
          )}
        </div>
      </div>

      {/* Building Type Checkboxes */}
      <fieldset>
        <legend className="text-xs font-medium tracking-wide text-[#534F46] mb-3">
          Building Type <span className="text-[#9A4109]">*</span>
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {BUILDING_OPTIONS.map((option) => {
            const checked = values.buildingTypes.includes(option);
            return (
              <label
                key={option}
                className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${
                  checked
                    ? 'border-[#151513] bg-[#FCF0D8]/60 text-[#151513]'
                    : 'border-[#B6AF9D] bg-white text-[#534F46] hover:border-[#151513]/60'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleToggleBuildingType(option)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`w-5 h-5 shrink-0 flex items-center justify-center border transition-colors ${
                    checked
                      ? 'bg-[#151513] border-[#151513] text-white'
                      : 'bg-white border-[#878276]'
                  }`}
                >
                  {checked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                </span>
                <span className="text-sm font-medium leading-snug text-[#151513]">
                  {option}
                </span>
              </label>
            );
          })}
        </div>
        {errors.buildingTypes && (
          <p role="alert" className="mt-2 text-xs font-medium text-[#9A4109]">
            {errors.buildingTypes}
          </p>
        )}
      </fieldset>

      {/* Location & Budget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <fieldset>
          <legend className="text-xs font-medium tracking-wide text-[#534F46] mb-2.5">
            Location <span className="text-[#9A4109]">*</span>
          </legend>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {CITY_OPTIONS.map((city) => {
              const active = values.location === city;
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    setValues((p) => ({ ...p, location: city }));
                    setErrors((p) => ({ ...p, location: undefined }));
                  }}
                  aria-pressed={active}
                  className={`h-11 px-3 border text-sm font-medium transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#151513] ${
                    active
                      ? 'bg-[#151513] text-white border-[#151513]'
                      : 'bg-white text-[#151513] border-[#B6AF9D] hover:bg-[#FCF0D8]/60'
                  }`}
                >
                  {city}
                </button>
              );
            })}
          </div>
          {errors.location && (
            <p role="alert" className="mt-2 text-xs font-medium text-[#9A4109]">
              {errors.location}
            </p>
          )}
        </fieldset>

        <div>
          <label
            htmlFor="budget-input"
            className="block text-xs font-medium tracking-wide text-[#534F46] mb-2.5"
          >
            Budget (CAD) <span className="text-[#9A4109]">*</span>
          </label>
          <div className="relative">
            <span
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#534F46] pointer-events-none"
              aria-hidden="true"
            >
              $
            </span>
            <input
              id="budget-input"
              type="number"
              min="1"
              step="any"
              inputMode="numeric"
              value={values.budget}
              onChange={(e) => {
                setValues((p) => ({ ...p, budget: e.target.value }));
                setErrors((p) => ({ ...p, budget: undefined }));
              }}
              placeholder="1250000"
              required
              className="w-full h-11 pl-8 pr-14 bg-[#FAF7F0]/50 border border-[#B6AF9D] text-sm text-[#151513] tabular-nums placeholder:text-[#878276] focus:outline-none focus:border-[#151513] focus:bg-white transition-colors"
            />
            <span
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#534F46] pointer-events-none"
              aria-hidden="true"
            >
              CAD
            </span>
          </div>
          {errors.budget && (
            <p role="alert" className="mt-2 text-xs font-medium text-[#9A4109]">
              {errors.budget}
            </p>
          )}
        </div>
      </div>

      {/* Viewing Date & Time */}
      <div>
        <div className="mb-3">
          <span className="text-xs font-medium tracking-wide text-[#534F46]">
            Viewing Date & Time <span className="text-[#9A4109]">*</span>
          </span>
        </div>
        <DateTimeCalendarPicker
          selectedDate={values.viewingDate}
          selectedTime={values.viewingTime}
          onChangeDate={(date) => {
            setValues((p) => ({ ...p, viewingDate: date }));
            setErrors((p) => ({ ...p, viewingDateTime: undefined }));
          }}
          onChangeTime={(time) => {
            setValues((p) => ({ ...p, viewingTime: time }));
            setErrors((p) => ({ ...p, viewingDateTime: undefined }));
          }}
          error={errors.viewingDateTime}
        />
      </div>

      {/* More Request (Optional) */}
      <div>
        <label
          htmlFor="more-request"
          className="block text-xs font-medium tracking-wide text-[#534F46] mb-1.5"
        >
          More Request <span className="text-[#878276] font-normal">(Optional)</span>
        </label>
        <textarea
          id="more-request"
          rows={3}
          value={values.moreRequest}
          onChange={(e) => setValues((p) => ({ ...p, moreRequest: e.target.value }))}
          placeholder="Share lot details, architectural preferences, or questions for your private tour..."
          className="w-full px-3.5 py-3 bg-[#FAF7F0]/50 border border-[#B6AF9D] text-sm text-[#151513] placeholder:text-[#878276] focus:outline-none focus:border-[#151513] focus:bg-white transition-colors"
        />
      </div>

      {/* Dynamic n8n Respond-to-Webhook Unavailable / Error Feedback */}
      {outcome?.kind === 'unavailable' && (
        <div
          role="region"
          aria-live="polite"
          className="bg-[#FCF0D8] border border-[#DB6617] p-6 space-y-5"
        >
          <div className="flex items-start gap-3">
            <CalendarClock className="w-5 h-5 text-[#9A4109] shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1">
              <h4 className="font-editorial text-2xl text-[#151513]">
                {outcome.headline}
              </h4>
              <p className="text-sm text-[#151513] leading-relaxed">
                {outcome.message}
              </p>
            </div>
          </div>

          {outcome.slots.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#534F46]">
                Available Timeslots From Concierge Schedule
              </p>
              <div className="flex flex-wrap gap-2.5">
                {outcome.slots.map((slot) => {
                  const isChosen = selectedSlotId === slot.id;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => handleSelectDynamicSlot(slot)}
                      aria-pressed={isChosen}
                      className={`px-4 py-2.5 text-sm font-medium border tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#151513] ${
                        isChosen
                          ? 'bg-[#151513] text-[#FAE04B] border-[#151513]'
                          : 'bg-white text-[#151513] border-[#B6AF9D] hover:border-[#151513] hover:bg-[#FAF7F0]'
                      }`}
                    >
                      {slot.label}
                    </button>
                  );
                })}
              </div>
              {selectedSlotId && (
                <p className="text-xs text-[#151513] font-medium">
                  Updated selection to <span className="tabular-nums">{values.viewingDate} at {values.viewingTime}</span>. Submit below to confirm this slot.
                </p>
              )}
            </div>
          )}

          {outcome.details.length > 0 && (
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#B6AF9D]/60">
              {outcome.details.map((item) => (
                <div key={item.label}>
                  <dt className="text-xs text-[#534F46]">{item.label}</dt>
                  <dd className="text-sm font-medium text-[#151513] tabular-nums">{item.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      )}

      {outcome?.kind === 'error' && (
        <div
          role="alert"
          className="bg-[#FAF7F0] border border-[#9A4109] p-5 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-[#9A4109] shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-[#151513]">{outcome.headline}</h4>
            <p className="text-sm text-[#534F46] leading-relaxed">{outcome.message}</p>
            {outcome.details.length > 0 && (
              <dl className="pt-2 border-t border-[#B6AF9D]/50 space-y-1">
                {outcome.details.map((item) => (
                  <div key={item.label} className="text-xs text-[#534F46]">
                    <span className="font-medium text-[#151513]">{item.label}: </span>
                    <span>{item.value}</span>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-[#B6AF9D]/40">
        <p className="text-xs text-[#534F46]">
          All required fields marked with <span className="text-[#9A4109]">*</span> are verified before scheduling.
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-[#151513] text-white text-sm font-medium tracking-wide hover:bg-[#2C2B27] disabled:opacity-60 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#151513]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              Checking Availability
            </>
          ) : (
            <>
              {selectedSlotId ? 'Confirm Selected Viewing' : 'Request Private Viewing'}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
