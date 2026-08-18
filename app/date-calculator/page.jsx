import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import DateCalculatorIsland from "@/components/DateCalculatorIsland";
import DateReferenceContent from "@/components/DateReferenceContent";
import { DATE_FAQS } from "@/lib/data/dateFaqs";
import Link from "next/link";

export const metadata = {
  title: "Date Calculator – Days Between Dates, Add or Subtract Time | Holy Calculator",
  description:
    "Calculate exact duration between dates or add/subtract time with US federal holiday and business-day support. Free Gregorian calendar math.",
  alternates: {
    canonical: "https://holycalculator.com/date-calculator",
  },
  openGraph: {
    title: "Date Calculator – Days Between Dates, Add or Subtract Time",
    description:
      "Free online Date Calculator. Compute exact days, weeks, months, and years between two dates, or add/subtract time with business-day and US holiday skipping.",
    url: "https://holycalculator.com/date-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Date Calculator – Days Between Dates, Add or Subtract Time | Holy Calculator",
    description:
      "Calculate exact duration between dates or add/subtract time with US federal holiday and business-day support.",
  },
};

export default function DateCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Date & Time", href: "/#date" },
    { label: "Date Calculator", active: true },
  ];

  // FAQPage schema markup (JSON-LD)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: DATE_FAQS.map((faq) => ({
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
    name: "Holy Calculator — Date Calculator",
    url: "https://holycalculator.com/date-calculator",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    description:
      "Calculate duration between two dates or add/subtract days, weeks, months, and years with business day and US federal holiday skipping.",
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
    name: "How to Calculate Days Between Dates or Add/Subtract Time",
    description:
      "Step-by-step instructions to calculate exact date differences or add/subtract working days with holiday skipping.",
    step: [
      {
        "@type": "HowToStep",
        name: "Select calculation mode",
        text: "Choose between 'Days Between Dates' mode or 'Add or Subtract Time' mode.",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Enter start date and time parameters",
        text: "Input the starting date and select the target date or enter the number of years, months, weeks, and days to add or subtract.",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "Configure business days and holiday settings",
        text: "Expand the settings drawer to toggle business-day mode and select US federal or custom company holidays to exclude.",
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
        <h1>Date Calculator</h1>
        <p className="lead">
          Calculate the exact duration between two dates in years, months, weeks, and days, or add and subtract time from any starting date. Includes full business-day counting with automatic US federal and custom holiday skipping.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <DateCalculatorIsland />

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
                <Link href="/age-calculator">
                  <span>Age Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/pregnancy-calculator">
                  <span>Pregnancy Due Date</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/#date">
                  <span>All Date Tools</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Date Fast Facts */}
          <div className="sidebar-box">
            <h4>Date Math Facts</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>365.2425 Days:</strong> Average Gregorian calendar year length
                </span>
              </li>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>11 US Holidays:</strong> Official federal business closures
                </span>
              </li>
              <li>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Leap Years:</strong> Rule 400/100/4 adds Feb 29th
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* CLS-safe Below-Calculator Ad Space */}
      <AdBanner />

      {/* Educational Reference Content & FAQs */}
      <DateReferenceContent />

      <Footer />
    </main>
  );
}
