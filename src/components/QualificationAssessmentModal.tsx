import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import {
  getAttributionFromLocation,
  submitContractorQuiz,
  type AttributionParams,
  type QualificationAnswers,
} from '../services/qualificationLead';
import { trackMetaLead } from '../services/metaPixel';

export type { QualificationAnswers };

const GOLD = 'rgb(212, 175, 55)';
const NAVY = '#0A2540';

const EMPTY_ANSWERS: QualificationAnswers = {
  firstName: '',
  phone: '',
  timeline: '',
  monthlyRevenue: '',
};

type ChoiceStep = {
  kind: 'choice';
  key: keyof Pick<QualificationAnswers, 'timeline' | 'monthlyRevenue'>;
  question: string;
  options: readonly string[];
  required: boolean;
};

type TextStep = {
  kind: 'text';
  key: 'firstName' | 'phone';
  question: string;
  placeholder: string;
  inputType: 'text' | 'tel';
  autoComplete: string;
  required: boolean;
};

const STEPS: readonly (ChoiceStep | TextStep)[] = [
  {
    kind: 'text',
    key: 'firstName',
    question: 'First Name',
    placeholder: 'Your first name',
    inputType: 'text',
    autoComplete: 'given-name',
    required: true,
  },
  {
    kind: 'text',
    key: 'phone',
    question: 'Mobile Phone',
    placeholder: '(555) 123-4567',
    inputType: 'tel',
    autoComplete: 'tel-national',
    required: true,
  },
  {
    kind: 'choice',
    key: 'timeline',
    question: 'How soon do you want more jobs?',
    options: ['ASAP', 'Within 30 Days', '1–3 Months', 'Just Researching'],
    required: true,
  },
  {
    kind: 'choice',
    key: 'monthlyRevenue',
    question: 'Current Monthly Revenue',
    options: ['Under $10k', '$10k–25k', '$25k–100k', '$100k+'],
    required: false,
  },
] as const;

const TOTAL_STEPS = STEPS.length;

function formatUsPhone(digits: string) {
  const d = digits.replace(/\D/g, '').slice(0, 10);
  if (d.length <= 3) return d ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

function isValidPhone(phone: string) {
  return phone.replace(/\D/g, '').length === 10;
}

function buildBookingUrl(base: string, answers: QualificationAnswers) {
  const url = new URL(base);
  if (answers.firstName) url.searchParams.set('full_name', answers.firstName.trim());
  const phoneDigits = answers.phone.replace(/\D/g, '');
  if (phoneDigits) {
    const e164 = `+1${phoneDigits}`;
    url.searchParams.set('phone', e164);
    url.searchParams.set('phone_number', e164);
  }
  return url.toString();
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onQualified?: () => void;
  bookingWidgetBase: string;
};

export default function QualificationAssessmentModal({
  isOpen,
  onClose,
  onQualified,
  bookingWidgetBase,
}: Props) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<QualificationAnswers>(EMPTY_ANSWERS);
  const [attribution, setAttribution] = useState<AttributionParams | null>(null);
  const [error, setError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [completed, setCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [animKey, setAnimKey] = useState(0);

  const bookingSrc = useMemo(
    () => (completed ? buildBookingUrl(bookingWidgetBase, answers) : ''),
    [completed, bookingWidgetBase, answers],
  );

  const progress = completed ? 100 : ((stepIndex + 1) / TOTAL_STEPS) * 100;
  const currentStep = STEPS[stepIndex];

  const reset = useCallback(() => {
    setStepIndex(0);
    setAnswers(EMPTY_ANSWERS);
    setAttribution(null);
    setError('');
    setSubmitError('');
    setCompleted(false);
    setIsSubmitting(false);
    setDirection('forward');
    setAnimKey(0);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setAttribution(getAttributionFromLocation());
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const t = window.setTimeout(() => {
      const focusable = dialogRef.current?.querySelector<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      );
      focusable?.focus();
    }, 50);
    return () => window.clearTimeout(t);
  }, [isOpen, stepIndex, completed, submitError, isSubmitting]);

  const setAnswerValue = (key: keyof QualificationAnswers, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setError('');
    setSubmitError('');
  };

  const validateCurrent = (): boolean => {
    if (!currentStep) return false;

    if (currentStep.kind === 'choice') {
      if (currentStep.required && !answers[currentStep.key]) {
        setError('Please select an option to continue.');
        return false;
      }
      return true;
    }

    const value = answers[currentStep.key].trim();
    if (currentStep.required && !value) {
      setError('This field is required.');
      return false;
    }
    if (currentStep.key === 'phone' && !isValidPhone(value)) {
      setError('Please enter a valid 10-digit mobile phone number.');
      return false;
    }
    return true;
  };

  const saveAnswers = async () => {
    setIsSubmitting(true);
    setSubmitError('');
    setError('');

    const result = await submitContractorQuiz(answers, attribution ?? getAttributionFromLocation());

    setIsSubmitting(false);

    if (!result.success) {
      setSubmitError(result.error || 'We couldn’t save your information. Please try again.');
      return;
    }

    trackMetaLead({ content_name: 'contractor-optin-qualification' });
    onQualified?.();
    setCompleted(true);
  };

  const goNext = async () => {
    if (!validateCurrent()) return;

    if (stepIndex < TOTAL_STEPS - 1) {
      setDirection('forward');
      setAnimKey((k) => k + 1);
      setStepIndex((i) => i + 1);
      return;
    }

    await saveAnswers();
  };

  const goBack = () => {
    if (completed || isSubmitting) return;
    if (submitError) {
      setSubmitError('');
      return;
    }
    if (stepIndex === 0) return;
    setError('');
    setDirection('back');
    setAnimKey((k) => k + 1);
    setStepIndex((i) => i - 1);
  };

  if (!isOpen) return null;

  const headerLabel = completed
    ? 'Schedule your call'
    : isSubmitting
      ? 'Saving…'
      : submitError
        ? 'Almost there'
        : `Question ${stepIndex + 1} of ${TOTAL_STEPS}`;

  const nextLabel = isSubmitting
    ? 'Saving…'
    : stepIndex === TOTAL_STEPS - 1
      ? 'Unlock Video'
      : currentStep.kind === 'choice' && !currentStep.required && !answers[currentStep.key]
        ? 'Skip'
        : 'Next';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/55 transition-opacity"
        onClick={onClose}
        aria-label="Close qualification assessment"
        tabIndex={-1}
      />

      <div
        ref={dialogRef}
        className="qualification-modal-panel relative z-10 flex max-h-[min(92dvh,880px)] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-w-xl"
      >
        <div className="h-1.5 w-full bg-neutral-100" aria-hidden>
          <div
            className="h-full transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%`, backgroundColor: GOLD }}
          />
        </div>

        <div className="flex items-start justify-between gap-3 border-b border-neutral-100 px-4 py-3 sm:px-5">
          <div>
            <p className="text-xs font-bold tracking-[0.12em]" style={{ color: GOLD }}>
              QUICK QUESTIONS
            </p>
            <h2 id={titleId} className="mt-0.5 text-base font-bold sm:text-lg" style={{ color: NAVY }}>
              {headerLabel}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ ['--tw-ring-color' as string]: GOLD }}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          {completed ? (
            <div className="qualification-step-enter">
              <div className="text-center">
                <p className="font-[inherit] text-2xl font-bold sm:text-3xl" style={{ color: NAVY }}>
                  You&apos;re in!
                </p>
                <p className="mt-2 text-base leading-relaxed text-neutral-600 sm:text-lg">
                  The demo video is unlocked. While you&apos;re here, grab a free strategy call time.
                </p>
              </div>
              <div className="mt-5 overflow-hidden rounded-xl border border-neutral-200 bg-white">
                <iframe
                  id="qualification-booking-calendar"
                  title="Schedule your GrowthLabPro strategy call"
                  src={bookingSrc}
                  className="block min-h-[480px] w-full border-0 sm:min-h-[560px]"
                  style={{ height: 640 }}
                  loading="eager"
                />
                <p className="border-t border-neutral-100 px-3 py-3 text-center text-sm text-neutral-600">
                  <a
                    href={bookingSrc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline hover:opacity-80"
                    style={{ color: NAVY }}
                  >
                    Open the calendar in a new tab
                  </a>{' '}
                  if it doesn&apos;t appear above.
                </p>
              </div>
            </div>
          ) : isSubmitting ? (
            <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
              <p className="text-lg font-bold sm:text-xl" style={{ color: NAVY }}>
                Saving your information…
              </p>
              <p className="mt-2 text-sm text-neutral-600">Please wait a moment.</p>
            </div>
          ) : submitError ? (
            <div className="qualification-step-enter text-center">
              <p className="text-lg font-bold sm:text-xl" style={{ color: NAVY }}>
                We couldn&apos;t save your information. Please try again.
              </p>
              <p className="mt-2 text-sm text-neutral-600">Your answers are still saved on this screen.</p>
            </div>
          ) : (
            <div
              key={animKey}
              className={direction === 'forward' ? 'qualification-step-enter' : 'qualification-step-enter-back'}
            >
              <h3 className="text-xl font-bold leading-snug sm:text-2xl" style={{ color: NAVY }}>
                {currentStep.question}
                {!currentStep.required ? (
                  <span className="ml-2 text-sm font-semibold text-neutral-400">(optional)</span>
                ) : null}
              </h3>

              {currentStep.kind === 'choice' ? (
                <ul className="mt-5 space-y-2.5" role="listbox" aria-label={currentStep.question}>
                  {currentStep.options.map((option) => {
                    const selected = answers[currentStep.key] === option;
                    return (
                      <li key={option}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={selected}
                          onClick={() => setAnswerValue(currentStep.key, option)}
                          className={`w-full rounded-xl border px-4 py-3.5 text-left text-[15px] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:text-base ${
                            selected
                              ? 'border-transparent text-[#0A2540] shadow-sm'
                              : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300 hover:bg-neutral-50'
                          }`}
                          style={
                            selected
                              ? {
                                  backgroundColor: 'rgba(212, 175, 55, 0.18)',
                                  borderColor: GOLD,
                                  boxShadow: `0 0 0 1px ${GOLD}`,
                                  ['--tw-ring-color' as string]: GOLD,
                                }
                              : { ['--tw-ring-color' as string]: GOLD }
                          }
                        >
                          {option}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="mt-5">
                  <label htmlFor={`qual-${currentStep.key}`} className="sr-only">
                    {currentStep.question}
                  </label>
                  <input
                    id={`qual-${currentStep.key}`}
                    type={currentStep.inputType}
                    inputMode={currentStep.key === 'phone' ? 'numeric' : undefined}
                    autoComplete={currentStep.autoComplete}
                    placeholder={currentStep.placeholder}
                    value={answers[currentStep.key]}
                    maxLength={currentStep.key === 'phone' ? 14 : undefined}
                    onChange={(e) => {
                      const raw = e.target.value;
                      setAnswerValue(
                        currentStep.key,
                        currentStep.key === 'phone' ? formatUsPhone(raw) : raw,
                      );
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        void goNext();
                      }
                    }}
                    className="w-full rounded-xl border border-neutral-300 px-4 py-3.5 text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{ ['--tw-ring-color' as string]: GOLD }}
                  />
                </div>
              )}

              {error ? <p className="mt-3 text-sm font-semibold text-red-600">{error}</p> : null}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-neutral-100 px-4 py-3 sm:px-5">
          <button
            type="button"
            onClick={goBack}
            disabled={completed || isSubmitting || (!submitError && stepIndex === 0)}
            className="rounded-xl px-4 py-2.5 text-sm font-bold text-neutral-700 transition hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 sm:text-base"
            style={{ ['--tw-ring-color' as string]: GOLD }}
          >
            Back
          </button>

          {completed ? (
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-5 py-2.5 text-sm font-bold shadow-md transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:px-6 sm:text-base"
              style={{ backgroundColor: GOLD, color: NAVY, ['--tw-ring-color' as string]: GOLD }}
            >
              Watch Demo
            </button>
          ) : submitError ? (
            <button
              type="button"
              onClick={() => void saveAnswers()}
              disabled={isSubmitting}
              className="rounded-xl px-5 py-2.5 text-sm font-bold shadow-md transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 sm:px-6 sm:text-base"
              style={{ backgroundColor: GOLD, color: NAVY, ['--tw-ring-color' as string]: GOLD }}
            >
              Retry
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void goNext()}
              disabled={isSubmitting}
              className="rounded-xl px-5 py-2.5 text-sm font-bold shadow-md transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 sm:px-6 sm:text-base"
              style={{ backgroundColor: GOLD, color: NAVY, ['--tw-ring-color' as string]: GOLD }}
            >
              {nextLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
