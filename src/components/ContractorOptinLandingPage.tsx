import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import {
  Check,
  ChevronDown,
  Globe,
  MessageSquare,
  Play,
  Star,
  RefreshCw,
  FolderKanban,
  Bell,
} from 'lucide-react';
import QualificationAssessmentModal from './QualificationAssessmentModal';

const VSL_VIDEO_SRC = '/videos/how-contractors-get-more-free-leads.mp4';
const CANONICAL_PATH = '/contractor-optin';
const VIDEO_UNLOCK_STORAGE_KEY = 'glp-contractor-optin-video-unlocked';
const DEFAULT_BOOKING_WIDGET =
  'https://api.leadconnectorhq.com/widget/booking/IRUVPTnnjfSdhvBguaB7';

const GOLD = 'rgb(212, 175, 55)';
const NAVY = '#0A2540';

type Props = {
  onNavigateHome: () => void;
};

const DEMO_BENEFITS = [
  'How missed-call text back helps recover lost opportunities',
  'How automated follow-up keeps leads from going cold',
  'How contractors can request more customer reviews',
  'How one simple system keeps leads, conversations, and appointments organized',
] as const;

const FEATURES = [
  {
    title: 'Contractor Website',
    copy: 'A professional, mobile-friendly website designed to turn visitors into leads.',
    Icon: Globe,
  },
  {
    title: 'Missed-Call Text Back',
    copy: 'Automatically text missed callers so valuable opportunities do not disappear.',
    Icon: MessageSquare,
  },
  {
    title: 'Review Automation',
    copy: 'Make it easier to request customer feedback and build your online reputation.',
    Icon: Star,
  },
  {
    title: 'Lead Follow-Up',
    copy: 'Use automated text and email follow-up to stay in front of new prospects.',
    Icon: RefreshCw,
  },
  {
    title: 'Lead Management',
    copy: 'Keep contacts, conversations, opportunities, and appointments organized in one place.',
    Icon: FolderKanban,
  },
  {
    title: 'Appointment Reminders',
    copy: 'Reduce missed appointments with automated confirmations and reminders.',
    Icon: Bell,
  },
] as const;

const FAQS = [
  {
    question: 'Do I need a new website?',
    answer:
      'Not necessarily. We can review your current setup and recommend whether it makes more sense to improve what you have or replace it.',
  },
  {
    question: 'How long does setup take?',
    answer:
      'The timeline depends on the features and content required. We will explain the expected setup process during your strategy call.',
  },
  {
    question: 'Can I keep my current phone number?',
    answer:
      'In many cases, yes. The exact setup depends on your current phone system and how you want calls and messages handled.',
  },
  {
    question: 'Is this only for certain types of contractors?',
    answer:
      'GrowthLabPro is designed for local service contractors, including electricians, HVAC companies, plumbers, roofers, remodelers, landscapers, concrete companies, and similar businesses.',
  },
  {
    question: 'Is there a long-term contract?',
    answer: 'We’ll explain the current service terms clearly before you sign up.',
  },
  {
    question: 'Does GrowthLabPro guarantee more jobs?',
    answer:
      'No. GrowthLabPro provides tools and systems intended to improve lead response, follow-up, organization, and review generation, but results depend on many factors and cannot be guaranteed.',
  },
] as const;

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  id,
  align = 'center',
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  id?: string;
  align?: 'center' | 'left';
}) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';
  return (
    <div className={`max-w-3xl ${alignClass}`}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-bold tracking-[0.14em] text-[#fbba2f] sm:text-sm">{eyebrow}</p>
      ) : null}
      <h2 id={id} className="font-[var(--headlinefont)] text-2xl font-bold leading-tight text-[#0A2540] sm:text-3xl md:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 text-base leading-relaxed text-neutral-600 sm:text-lg">{subtitle}</p>
      ) : null}
    </div>
  );
}

function ChecklistItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-left">
      <span
        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#fbba2f]/15 text-[#0A2540]"
        aria-hidden
      >
        <Check className="h-3.5 w-3.5 stroke-[2.5]" />
      </span>
      <span className="text-[15px] leading-snug text-neutral-700 sm:text-base">{children}</span>
    </li>
  );
}

function FeatureCard({
  title,
  copy,
  Icon,
}: {
  title: string;
  copy: string;
  Icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
}) {
  return (
    <article className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div
        className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#fbba2f]/30 bg-[#fbba2f]/10 text-[#0A2540]"
        aria-hidden
      >
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-[var(--headlinefont)] text-lg font-bold text-[#0A2540]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600 sm:text-[15px]">{copy}</p>
    </article>
  );
}

function CtaButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
}) {
  const base =
    'inline-flex w-full items-center justify-center rounded-xl px-6 py-3.5 text-base font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:w-auto sm:px-8 sm:py-4 sm:text-lg';
  const styles =
    variant === 'primary'
      ? 'bg-[#fbba2f] text-[#0A2540] shadow-md hover:brightness-105 focus-visible:ring-[#fbba2f]'
      : 'border border-neutral-300 bg-white text-[#0A2540] hover:border-[#fbba2f] hover:bg-[#fbba2f]/10 focus-visible:ring-[#fbba2f]';

  return (
    <button type="button" onClick={onClick} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
}

function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const panelId = useId();
  const buttonId = useId();

  return (
    <div className="border-b border-neutral-200 last:border-b-0">
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-4 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fbba2f] focus-visible:ring-offset-2"
        >
          <span className="text-base font-bold text-[#0A2540] sm:text-lg">{question}</span>
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-neutral-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            aria-hidden
          />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isOpen}
        className={isOpen ? 'pb-4' : undefined}
      >
        <p className="pr-8 text-sm leading-relaxed text-neutral-600 sm:text-[15px]">{answer}</p>
      </div>
    </div>
  );
}

function FaqAccordion({ items }: { items: readonly { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white px-4 shadow-sm sm:px-6">
      {items.map((item, index) => (
        <FaqItem
          key={item.question}
          question={item.question}
          answer={item.answer}
          isOpen={openIndex === index}
          onToggle={() => setOpenIndex((current) => (current === index ? null : index))}
        />
      ))}
    </div>
  );
}

function VslVideoPlayer({
  unlocked,
  onRequestUnlock,
}: {
  unlocked: boolean;
  onRequestUnlock: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!unlocked) return;
    const video = videoRef.current;
    if (!video) return;
    void video.play().catch(() => {
      // Autoplay may be blocked until the user taps play.
    });
  }, [unlocked]);

  if (!unlocked) {
    return (
      <div
        className="relative w-full overflow-hidden rounded-xl bg-[#0A2540] shadow-md"
        style={{ padding: '56.25% 0 0' }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#0A2540] via-[#123456] to-[#0A2540] px-6 text-center">
          <button
            type="button"
            onClick={onRequestUnlock}
            className="flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:h-20 sm:w-20"
            style={{ backgroundColor: GOLD, color: NAVY, ['--tw-ring-color' as string]: GOLD }}
            aria-label="Unlock the demo video"
          >
            <Play className="ml-1 h-8 w-8 fill-current sm:h-9 sm:w-9" />
          </button>
          <div>
            <p className="text-lg font-bold text-white sm:text-xl">Watch the 3-Minute Demo</p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
              Answer a few quick questions to unlock the video.
            </p>
          </div>
          <button
            type="button"
            onClick={onRequestUnlock}
            className="rounded-xl px-6 py-3 text-sm font-bold shadow-md transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:text-base"
            style={{ backgroundColor: GOLD, color: NAVY, ['--tw-ring-color' as string]: GOLD }}
          >
            Unlock Video
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-black shadow-md" style={{ padding: '56.25% 0 0' }}>
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full"
        src={VSL_VIDEO_SRC}
        controls
        playsInline
        preload="metadata"
        title="How Contractors Get More Free Leads"
      />
    </div>
  );
}

function HighlightedHeadline() {
  return (
    <h1
      className="font-[var(--headlinefont)] text-[28px] font-bold leading-[1.05] sm:text-4xl md:text-5xl"
      style={{ color: NAVY }}
    >
      Get More <span style={{ color: GOLD }}>Leads</span>, More{' '}
      <span style={{ color: GOLD }}>5-Star Reviews</span>, and More{' '}
      <span style={{ color: GOLD }}>Booked Jobs</span>
    </h1>
  );
}

export default function ContractorOptinLandingPage({ onNavigateHome: _onNavigateHome }: Props) {
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [videoUnlocked, setVideoUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem(VIDEO_UNLOCK_STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });

  const bookingWidgetBase = import.meta.env.VITE_BOOKING_WIDGET_URL || DEFAULT_BOOKING_WIDGET;

  const openAssessment = useCallback(() => {
    setIsAssessmentOpen(true);
  }, []);

  const closeAssessment = useCallback(() => {
    setIsAssessmentOpen(false);
  }, []);

  const handleQualified = useCallback(() => {
    setVideoUnlocked(true);
    try {
      sessionStorage.setItem(VIDEO_UNLOCK_STORAGE_KEY, '1');
    } catch {
      // Ignore storage failures (private mode, etc.)
    }
  }, []);

  useEffect(() => {
    document.title = 'Contractor Growth System | GrowthLabPro';
    const meta = document.querySelector('meta[name="description"]');
    const prev = meta?.getAttribute('content') ?? null;
    meta?.setAttribute(
      'content',
      'See how GrowthLabPro helps contractors get more leads, more 5-star reviews, and more booked jobs. Book a free strategy call.',
    );

    const publicPageUrl = `${window.location.origin}${CANONICAL_PATH}`;
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', publicPageUrl);
    }

    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Poppins:wght@400;500;600;700;800&display=swap';
    link.rel = 'stylesheet';
    link.id = 'contractor-optin-fonts';
    document.head.appendChild(link);

    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://api.leadconnectorhq.com';
    document.head.appendChild(preconnect);

    const vslContentUrl = `${window.location.origin}${VSL_VIDEO_SRC}`;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'w-json-ld-vsl';
    script.text = JSON.stringify({
      '@context': 'http://schema.org/',
      '@id': vslContentUrl,
      '@type': 'VideoObject',
      name: 'How Contractors Get More Free Leads',
      description: 'Watch how GrowthLabPro helps contractors get more free leads.',
      contentUrl: vslContentUrl,
      embedUrl: publicPageUrl,
      uploadDate: '2026-07-11T00:00:00.000Z',
    });
    document.head.appendChild(script);

    return () => {
      document.getElementById('contractor-optin-fonts')?.remove();
      preconnect.remove();
      script.remove();
      if (meta && prev !== null) meta.setAttribute('content', prev);
      if (canonical) {
        canonical.setAttribute('href', `${window.location.origin}/`);
      }
    };
  }, []);

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-[#F7F8FA] text-neutral-900 antialiased"
      style={
        {
          ['--headlinefont' as string]: "'Oswald', system-ui, sans-serif",
          ['--contentfont' as string]: "'Poppins', system-ui, sans-serif",
          ['--brand-gold' as string]: GOLD,
          ['--brand-navy' as string]: NAVY,
        } as React.CSSProperties
      }
    >
      <main className="mx-auto max-w-[1180px] px-4 pb-16 pt-0 font-[var(--contentfont)] sm:px-6 sm:pb-20 lg:px-8">
        {/* Hero */}
        <section className="mx-auto -mt-2 max-w-4xl text-center sm:-mt-3" aria-labelledby="hero-heading">
          <div className="flex justify-center leading-none">
            <img
              src="/images/logo.png"
              alt="GrowthLabPro"
              className="-mt-4 block h-36 w-auto object-contain object-top sm:-mt-6 sm:h-44"
              width={440}
              height={176}
              decoding="async"
            />
          </div>
          <div id="hero-heading" className="-mt-5 sm:-mt-7">
            <HighlightedHeadline />
          </div>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
            See how GrowthLabPro helps contractors respond faster, follow up automatically, and turn more leads into
            paying customers for just $297/month.
          </p>
        </section>

        {/* Video */}
        <section className="mx-auto mt-10 max-w-[900px] sm:mt-12" aria-labelledby="demo-step-heading">
          <div className="mb-4 flex justify-center">
            <p
              id="demo-step-heading"
              className="inline-flex items-center rounded-full border border-[#fbba2f]/40 bg-white px-4 py-1.5 text-xs font-bold tracking-wide text-[#0A2540] shadow-sm sm:text-sm"
            >
              {videoUnlocked ? 'STEP 1: WATCH THE 3-MINUTE DEMO' : 'STEP 1: UNLOCK THE 3-MINUTE DEMO'}
            </p>
          </div>
          <VslVideoPlayer unlocked={videoUnlocked} onRequestUnlock={openAssessment} />

          <div className="mt-8 sm:mt-10">
            <h2 className="text-center font-[var(--headlinefont)] text-xl font-bold text-[#0A2540] sm:text-2xl">
              In This Short Demo, You&apos;ll See:
            </h2>
            <ul className="mx-auto mt-5 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              {DEMO_BENEFITS.map((item) => (
                <ChecklistItem key={item}>{item}</ChecklistItem>
              ))}
            </ul>
          </div>
        </section>

        <div className="mt-10 flex justify-center sm:mt-12">
          <CtaButton onClick={openAssessment} className="w-full max-w-md sm:w-auto">
            Book Your Free Strategy Call
          </CtaButton>
        </div>

        {/* What's included */}
        <section className="mt-10 sm:mt-12" aria-labelledby="included-heading">
          <SectionHeading
            id="included-heading"
            title="Everything Included for $297/Month"
            subtitle="A simple contractor growth system designed to help you respond faster, build trust, and book more work."
          />
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {FEATURES.map(({ title, copy, Icon }) => (
              <FeatureCard key={title} title={title} copy={copy} Icon={Icon} />
            ))}
          </div>
        </section>

        {/* Value / ROI */}
        <section
          className="mt-14 rounded-2xl border border-[#fbba2f]/35 bg-white px-5 py-8 text-center shadow-sm sm:mt-16 sm:px-10 sm:py-10"
          aria-labelledby="value-heading"
        >
          <h2 id="value-heading" className="font-[var(--headlinefont)] text-2xl font-bold text-[#0A2540] sm:text-3xl">
            One Extra Job Could More Than Cover the Monthly Cost
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-neutral-600 sm:text-lg">
            For many contractors, one additional booked job can be worth hundreds or thousands of dollars. GrowthLabPro
            is designed to help you capture more of the leads you are already generating.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed text-neutral-500 sm:text-sm">
            Results vary by company, market, offer, and lead volume. No specific results are guaranteed.
          </p>
          <div className="mt-6 flex justify-center">
            <CtaButton onClick={openAssessment}>See How It Works</CtaButton>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-14 sm:mt-16" aria-labelledby="faq-heading">
          <SectionHeading id="faq-heading" title="Frequently Asked Questions" />
          <div className="mx-auto mt-8 max-w-3xl">
            <FaqAccordion items={FAQS} />
          </div>
        </section>

        {/* Final CTA */}
        <section
          className="mt-14 rounded-2xl bg-[#0A2540] px-5 py-10 text-center sm:mt-16 sm:px-10 sm:py-12"
          aria-labelledby="final-cta-heading"
        >
          <h2 id="final-cta-heading" className="font-[var(--headlinefont)] text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            Ready to Stop Letting Good Leads Slip Away?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            Watch the demo, choose a time, and see how GrowthLabPro could help your contracting business respond faster
            and book more work.
          </p>
          <div className="mt-7 flex justify-center">
            <CtaButton onClick={openAssessment}>Book My Free Strategy Call</CtaButton>
          </div>
        </section>

        <footer className="mt-12 text-center text-sm text-neutral-500">
          © Copyright GrowthLabPro 2026 | All Rights Reserved
        </footer>
      </main>

      <QualificationAssessmentModal
        isOpen={isAssessmentOpen}
        onClose={closeAssessment}
        onQualified={handleQualified}
        bookingWidgetBase={bookingWidgetBase}
      />
    </div>
  );
}
