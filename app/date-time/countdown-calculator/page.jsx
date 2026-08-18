import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import CountdownCalculatorIsland from "@/components/CountdownCalculatorIsland";
import CountdownReferenceContent from "@/components/CountdownReferenceContent";
import { COUNTDOWN_FAQS } from "@/lib/data/countdownFaqs";
import Link from "next/link";

export const metadata = {
  title: "Countdown Calculator – Live Ticking Event Timer | Holy Calculator",
  description:
    "Create live ticking countdown timers for holidays, events, weddings, and vacations with total hours, minutes, and seconds breakdowns.",
  alternates: {
    canonical: "https://holycalculator.com/date-time/countdown-calculator",
  },
  openGraph: {
    title: "Countdown Calculator – Live Ticking Event Timer",
    description:
      "Free online Live Countdown Calculator. Track exact remaining days, hours, minutes, and seconds until any holiday, vacation, or custom event.",
    url: "https://holycalculator.com/date-time/countdown-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Countdown Calculator | Holy Calculator",
    description:
      "Create live ticking countdown timers for events, holidays, weddings, and vacations.",
  },
};

export default function CountdownCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Date & Time", href: "/#date" },
    { label: "Countdown Calculator", active: true },
  ];

  // FAQPage schema markup (JSON-LD)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: COUNTDOWN_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  // WebApplication schema markup
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Holy Calculator — Countdown Calculator",
    url: "https://holycalculator.com/date-time/countdown-calculator",
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    description:
      "Create live ticking countdown timers for events, holidays, and vacations with total unit breakdowns.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  // HowTo schema markup
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Create a Live Countdown Timer",
    description:
      "Step-by-step instructions to create and share a live ticking countdown clock for any future event.",
    step: [
      {
        "@type": "HowToStep",
        name: "Select event preset or enter custom title",
        text: "Choose a quick holiday preset (New Year's, Christmas, Halloween) or type your custom event title.",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Pick target date and time",
        text: "Select the target date and time for your event.",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "Watch live ticking countdown and share URL",
        text: "The digital clock ticks live every second. Click 'Share Countdown URL' to send the live clock link.",
        position: 3,
      },
    ],
  };

  return (
    <main>
      {/* Structured Data Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <Header />

      <Breadcrumbs items={breadcrumbItems} />

      {/* Page Header */}
      <header className="calc-page-header">
        <div className="eyebrow" style={{ color: "#7A6A55" }}>
          <span className="dot" style={{ background: "#7A6A55" }} />
          Date &amp; Time Calculators
        </div>
        <h1>Countdown Calculator</h1>
        <p className="lead">
          Create live ticking countdown timers for holidays, vacations, weddings, and custom events with total hours, minutes, and seconds breakdowns.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <CountdownCalculatorIsland />

        {/* Desktop Sticky Sidebar Rail */}
        <aside className="calc-sidebar">
          {/* Vertical Ad Space */}
          <div className="sidebar-box" style={{ padding: "10px", textAlign: "center" }}>
            <SidebarAd />
          </div>

          {/* Related Date Tools */}
          <div className="sidebar-box">
            <h4>Date &amp; Time Tools</h4>
            <ul className="sidebar-links-list">
              <li>
                <Link href="/date-time/time-zone-calculator">
                  <span>Time Zone Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/date-calculator">
                  <span>Date Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/age-calculator">
                  <span>Age Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/pregnancy-calculator">
                  <span>Pregnancy Calculator</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Countdown Fast Facts */}
          <div className="sidebar-box">
            <h4>Countdown Fast Facts</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>1 Day:</strong> 86,400 seconds
                </span>
              </li>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Origin:</strong> Rocket launches (1929)
                </span>
              </li>
              <li>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Live Update:</strong> 1-second interval
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* CLS-safe Below-Calculator Ad Space */}
      <AdBanner />

      {/* Educational Reference Content & FAQs */}
      <CountdownReferenceContent />

      <Footer />
    </main>
  );
}
