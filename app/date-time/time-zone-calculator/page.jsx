import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import TimeZoneCalculatorIsland from "@/components/TimeZoneCalculatorIsland";
import TimeZoneReferenceContent from "@/components/TimeZoneReferenceContent";
import { TIMEZONE_FAQS } from "@/lib/data/timezoneFaqs";
import Link from "next/link";

export const metadata = {
  title: "Time Zone Calculator – Convert Time Between Time Zones & Cities | Holy Calculator",
  description:
    "Convert time across world UTC time zones and cities, compute time differences, and handle day rollover results instantly with standard offset arithmetic.",
  alternates: {
    canonical: "https://holycalculator.com/date-time/time-zone-calculator",
  },
  openGraph: {
    title: "Time Zone Calculator – Convert Time Between Time Zones & Cities",
    description:
      "Free online Time Zone Converter & World Clock Calculator. Convert time across world UTC offsets, compute time differences between cities, and handle day rollover instantly.",
    url: "https://holycalculator.com/date-time/time-zone-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Time Zone Calculator & World Time Converter | Holy Calculator",
    description:
      "Convert time across world UTC offsets, compute time differences between cities, and handle day rollover instantly.",
  },
};

export default function TimeZoneCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Date & Time", href: "/#date" },
    { label: "Time Zone Calculator", active: true },
  ];

  // FAQPage schema markup (JSON-LD)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: TIMEZONE_FAQS.map((faq) => ({
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
    name: "Holy Calculator — Time Zone Calculator",
    url: "https://holycalculator.com/date-time/time-zone-calculator",
    applicationCategory: "EducationalApplication",
    operatingSystem: "All",
    description:
      "Convert time across global UTC offsets, compute time differences, and handle day rollover instantly.",
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
    name: "How to Convert Time Between Time Zones",
    description:
      "Step-by-step instructions to convert dates and times between global UTC time zone offsets.",
    step: [
      {
        "@type": "HowToStep",
        name: "Enter the source date and time",
        text: "Input the date and 24-hour time (e.g. 15:00:00) into the input fields.",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Select the source and target UTC offsets",
        text: "Choose the 'From' time zone offset and 'To' time zone offset from the dropdown lists.",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "View instant calculated results",
        text: "The result card displays the converted 12-hour and 24-hour time, the target calendar date, any day rollover (+1/-1 day), and the net offset difference.",
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
        <h1>Time Zone Calculator</h1>
        <p className="lead">
          Convert time across global UTC time zones, compute exact offset differences, and view calendar day rollovers instantly with static standard offset arithmetic.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <TimeZoneCalculatorIsland />

        {/* Desktop Sticky Sidebar Rail */}
        <aside className="calc-sidebar">
          {/* Vertical Ad Space */}
          <div className="sidebar-box" style={{ padding: "10px", textAlign: "center" }}>
            <SidebarAd />
          </div>

          {/* Related Date & Time Tools */}
          <div className="sidebar-box">
            <h4>Date &amp; Time Tools</h4>
            <ul className="sidebar-links-list">
              <li>
                <Link href="/age-calculator">
                  <span>Age Calculator</span>
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
                <Link href="/conversion-calculator">
                  <span>Unit Converter</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Time Zone Fast Facts */}
          <div className="sidebar-box">
            <h4>Time Zone Fast Facts</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>38+ Offsets:</strong> World zones range from UTC-12:00 to UTC+14:00.
                </span>
              </li>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Half-Hour Zones:</strong> India (+5:30), Iran (+3:30), and Myanmar (+6:30).
                </span>
              </li>
              <li>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Quarter-Hour:</strong> Nepal (+5:45) and Chatham Islands (+12:45).
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* CLS-safe Below-Calculator Ad Space */}
      <AdBanner />

      {/* Educational Reference Content & FAQs */}
      <TimeZoneReferenceContent />

      <Footer />
    </main>
  );
}
