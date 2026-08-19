import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import LifePathCalculatorIsland from "@/components/LifePathCalculatorIsland";
import LifePathReferenceContent from "@/components/LifePathReferenceContent";
import { LIFE_PATH_FAQS } from "@/lib/data/lifePathFaqs";
import Link from "next/link";

export const metadata = {
  title: "Life Path Number Calculator – Find Your Numerology Chart & Master Number | Holy Calculator",
  description:
    "Calculate your Life Path Number and Master Numbers (11, 22, 33) with authentic Pythagorean numerology step-by-step reduction breakdowns.",
  alternates: {
    canonical: "https://www.holycalculator.com/spiritual/life-path-number-calculator",
  },
  openGraph: {
    title: "Life Path Number Calculator – Find Your Numerology Chart & Master Number",
    description:
      "Free online Life Path Number Calculator. Discover your core numerology archetype, personality strengths, life lessons, and Master Numbers (11, 22, 33).",
    url: "https://www.holycalculator.com/spiritual/life-path-number-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Life Path Number Calculator | Holy Calculator",
    description:
      "Calculate your Life Path Number and Master Numbers (11, 22, 33) with authentic Pythagorean numerology.",
  },
};

export default function LifePathNumberCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Spiritual & Luck", href: "/#spiritual" },
    { label: "Life Path Number Calculator", active: true },
  ];

  // FAQPage schema markup (JSON-LD)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: LIFE_PATH_FAQS.map((faq) => ({
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
    name: "Holy Calculator — Life Path Number Calculator",
    url: "https://www.holycalculator.com/spiritual/life-path-number-calculator",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "All",
    description:
      "Calculate your Life Path Number and Master Numbers (11, 22, 33) using authentic Pythagorean numerology reduction.",
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
    name: "How to Calculate Your Life Path Number",
    description:
      "Step-by-step instructions to calculate your Pythagorean Life Path Number and Master Numbers from your birth date.",
    step: [
      {
        "@type": "HowToStep",
        name: "Select month, day, and year of birth",
        text: "Pick your birth month, birth day, and 4-digit birth year.",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "View step-by-step Pythagorean reduction",
        text: "The calculator reduces Month, Day, and Year separately to preserve Master Numbers (11, 22, 33).",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "Explore your complete archetype profile",
        text: "Read your Life Path title, core strengths, life lessons, ideal careers, and compatible numbers.",
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
        <h1>Life Path Number Calculator</h1>
        <p className="lead">
          Discover your core numerology archetype, Master Numbers (11, 22, 33), and personality traits using authentic Pythagorean reduction math.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <LifePathCalculatorIsland />

        {/* Desktop Sticky Sidebar Rail */}
        <aside className="calc-sidebar">
          {/* Vertical Ad Space */}
          <div className="sidebar-box" style={{ padding: "10px", textAlign: "center" }}>
            <SidebarAd />
          </div>

          {/* Related Spiritual & Fun Tools */}
          <div className="sidebar-box">
            <h4>Spiritual &amp; Fun Tools</h4>
            <ul className="sidebar-links-list">
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
              <li>
                <Link href="/date-calculator">
                  <span>Date Calculator</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Life Path Fast Facts */}
          <div className="sidebar-box">
            <h4>Life Path Fast Facts</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Method:</strong> Pythagorean 3-step reduction
                </span>
              </li>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Master Numbers:</strong> 11, 22, and 33 (unreduced)
                </span>
              </li>
              <li>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Single Digits:</strong> 1 through 9 archetypes
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* CLS-safe Below-Calculator Ad Space */}
      <AdBanner />

      {/* Educational Reference Content & FAQs */}
      <LifePathReferenceContent />

      <Footer />
    </main>
  );
}
