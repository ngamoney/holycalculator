import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import AngelNumberCalculatorIsland from "@/components/AngelNumberCalculatorIsland";
import AngelNumberReferenceContent from "@/components/AngelNumberReferenceContent";
import { ANGEL_NUMBER_FAQS } from "@/lib/data/angelNumberFaqs";
import Link from "next/link";

export const metadata = {
  title: "Angel Number Calculator – Calculate Personal Angel Number & Decode Sequences | Holy Calculator",
  description:
    "Calculate your personal Angel Number by birth date or name, and decode repeating number sequences (111, 222, 333, 444, 555, 777, 888, 1111, 1212).",
  alternates: {
    canonical: "https://www.holycalculator.com/spiritual/angel-number-calculator",
  },
  openGraph: {
    title: "Angel Number Calculator – Calculate Personal Angel Number & Decode Sequences",
    description:
      "Free online Angel Number Calculator. Calculate your Birthday & Name Angel Number, and decode repeating sequences (111, 222, 333, 444, 555, 777, 888, 1111) for spiritual, love, and career guidance.",
    url: "https://www.holycalculator.com/spiritual/angel-number-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Angel Number Calculator | Holy Calculator",
    description:
      "Calculate your personal Angel Number by birth date or name, and decode repeating number sequences.",
  },
};

export default function AngelNumberCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Spiritual & Luck", href: "/#spiritual" },
    { label: "Angel Number Calculator", active: true },
  ];

  // FAQPage schema markup (JSON-LD)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ANGEL_NUMBER_FAQS.map((faq) => ({
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
    name: "Holy Calculator — Angel Number Calculator",
    url: "https://www.holycalculator.com/spiritual/angel-number-calculator",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "All",
    description:
      "Calculate your personal Angel Number by birth date or name, and decode repeating number sequences for spiritual, love, and career guidance.",
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
    name: "How to Calculate and Decode Your Angel Number",
    description:
      "Step-by-step instructions to calculate your personal Angel Number or decode repeating number sequences.",
    step: [
      {
        "@type": "HowToStep",
        name: "Choose calculation or lookup mode",
        text: "Select 'Lookup Sequence', 'Calculate by Birthday', or 'Calculate by Name'.",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Enter details or pick a quick sequence chip",
        text: "Type your birth date, name, or select sequence chips like 111, 444, 777, 1111.",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "Read spiritual, love, and career guidance",
        text: "Explore your detailed Angel Number reading across spiritual meaning, twin flame love, and career abundance.",
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
        <div className="eyebrow" style={{ color: "#3B3564" }}>
          <span className="dot" style={{ background: "#3B3564" }} />
          Spiritual &amp; Numerology Calculators
        </div>
        <h1>Angel Number Calculator</h1>
        <p className="lead">
          Calculate your personal Angel Number by birth date or name, and decode repeating sequences (111, 222, 333, 444, 555, 777, 888, 1111) for spiritual, love, and career guidance.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <AngelNumberCalculatorIsland />

        {/* Desktop Sticky Sidebar Rail */}
        <aside className="calc-sidebar">
          {/* Vertical Ad Space */}
          <div className="sidebar-box" style={{ padding: "10px", textAlign: "center" }}>
            <SidebarAd />
          </div>

          {/* Related Spiritual Tools */}
          <div className="sidebar-box">
            <h4>Spiritual &amp; Fun Tools</h4>
            <ul className="sidebar-links-list">
              <li>
                <Link href="/spiritual/life-path-number-calculator">
                  <span>Life Path Number</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/dice-roller">
                  <span>Virtual Dice Roller</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/age-calculator">
                  <span>Age Calculator</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Angel Fast Facts */}
          <div className="sidebar-box">
            <h4>Angel Number Fast Facts</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>111 / 1111:</strong> Manifestation &amp; New Portals
                </span>
              </li>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>444:</strong> Angelic Protection &amp; Safety
                </span>
              </li>
              <li>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>888:</strong> Financial Abundance &amp; Karma
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* CLS-safe Below-Calculator Ad Space */}
      <AdBanner />

      {/* Educational Reference Content & FAQs */}
      <AngelNumberReferenceContent />

      <Footer />
    </main>
  );
}
