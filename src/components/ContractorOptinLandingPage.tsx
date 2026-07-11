import React, { useEffect, useId, useMemo, useState } from 'react';
import {
  Check,
  ChevronDown,
  Globe,
  MessageSquare,
  Star,
  RefreshCw,
  FolderKanban,
  Bell,
} from 'lucide-react';

const VSL_VIDEO_SRC = '/videos/how-contractors-get-more-free-leads.mp4';
const CANONICAL_PATH = '/contractor-optin';
const CALENDAR_SECTION_ID = 'book-strategy-call';
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

const CALL_COVER = [
  'Your current website and lead process',
  'Missed-call and follow-up opportunities',
  'Google review strategy',
  'Recommended GrowthLabPro setup',
  'Questions about pricing and implementation',
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

function scrollToCalendar() {
  document.getElementById(CALENDAR_SECTION_ID)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

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

function VslVideoPlayer() {
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-black shadow-md" style={{ padding: '56.25% 0 0' }}>
      <video
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

function buildBookingUrl(base: string, fullName: string, phone: string) {
  const url = new URL(base);
  if (fullName) url.searchParams.set('full_name', fullName);
  if (phone) {
    url.searchParams.set('phone', phone);
    url.searchParams.set('phone_number', phone);
  }
  return url.toString();
}

function BookingCalendar({ src, id }: { src: string; id: string }) {
  return (
    <div className="w-full overflow-hidden">
      <iframe
        id={id}
        title="Schedule your GrowthLabPro strategy call"
        src={src}
        className="block min-h-[560px] w-full max-w-full border-0 sm:min-h-[640px]"
        style={{ height: 720 }}
        loading="eager"
      />
      <p className="mt-4 text-center text-sm text-neutral-600">
        <a href={src} target="_blank" rel="noopener noreferrer" className="font-medium text-[#0A2540] underline hover:text-[#fbba2f]">
          Open the calendar in a new tab
        </a>{' '}
        if it doesn&apos;t appear above.
      </p>
    </div>
  );
}

function HighlightedHeadline() {
  return (
    <h1
      className="font-[var(--headlinefont)] text-[28px] font-bold leading-[1.15] sm:text-4xl md:text-5xl"
      style={{ color: NAVY }}
    >
      Get More <span style={{ color: GOLD }}>Leads</span>, More{' '}
      <span style={{ color: GOLD }}>5-Star Reviews</span>,
      <br className="hidden sm:block" /> and More <span style={{ color: GOLD }}>Booked Jobs</span>
    </h1>
  );
}

export default function ContractorOptinLandingPage({ onNavigateHome: _onNavigateHome }: Props) {
  const bookingSrc = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const fullName = params.get('full_name') ?? params.get('name') ?? '';
    const phone = params.get('phone') ?? params.get('phone_number') ?? '';
    const base = import.meta.env.VITE_BOOKING_WIDGET_URL || DEFAULT_BOOKING_WIDGET;
    return buildBookingUrl(base, fullName, phone);
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
      <main className="mx-auto max-w-[1180px] px-4 pb-16 pt-8 font-[var(--contentfont)] sm:px-6 sm:pb-20 sm:pt-10 lg:px-8">
        {/* Hero */}
        <section className="mx-auto max-w-4xl text-center" aria-labelledby="hero-heading">
          <p className="text-xs font-bold tracking-[0.16em] sm:text-sm" style={{ color: GOLD }}>
            CONTRACTOR GROWTH SYSTEM
          </p>
          <div id="hero-heading" className="mt-4">
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
              STEP 1: WATCH THE 3-MINUTE DEMO
            </p>
          </div>
          <VslVideoPlayer />

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

        {/* What's included */}
        <section className="mt-14 sm:mt-16" aria-labelledby="included-heading">
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
            <CtaButton onClick={scrollToCalendar}>See How It Works</CtaButton>
          </div>
        </section>

        {/* Booking intro + calendar */}
        <section
          id={CALENDAR_SECTION_ID}
          className="mt-14 scroll-mt-6 sm:mt-16 sm:scroll-mt-8"
          aria-labelledby="booking-step-heading"
        >
          <SectionHeading
            id="booking-step-heading"
            title="STEP 2: BOOK YOUR FREE STRATEGY CALL"
            subtitle="Choose a time below and we’ll review your current setup, discuss where leads may be slipping through the cracks, and show you how the GrowthLabPro system could fit your business."
          />

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:items-start lg:gap-8">
            <aside className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
              <h3 className="font-[var(--headlinefont)] text-lg font-bold text-[#0A2540]">What We&apos;ll Cover</h3>
              <ul className="mt-4 space-y-3">
                {CALL_COVER.map((item) => (
                  <ChecklistItem key={item}>{item}</ChecklistItem>
                ))}
              </ul>
              <p className="mt-5 rounded-xl bg-[#F7F8FA] px-3 py-3 text-sm leading-relaxed text-neutral-600">
                No pressure and no obligation. The call is simply to see whether the system is a good fit.
              </p>
            </aside>

            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white p-2 shadow-sm sm:p-4">
              <BookingCalendar src={bookingSrc} id="booking-calendar" />
            </div>
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
            <CtaButton onClick={scrollToCalendar}>Book My Free Strategy Call</CtaButton>
          </div>
        </section>

        <footer className="mt-12 text-center text-sm text-neutral-500">
          © Copyright GrowthLabPro 2026 | All Rights Reserved
        </footer>
      </main>
    </div>
  );
}
