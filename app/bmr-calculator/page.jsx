import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import BmrCalculatorIsland from "@/components/BmrCalculatorIsland";
import BmrReferenceContent from "@/components/BmrReferenceContent";
import { BMR_FAQS } from "@/lib/data/bmrFaqs";
import Link from "next/link";

export const metadata = {
  title: "BMR Calculator – Basal Metabolic Rate (Mifflin-St Jeor, Harris-Benedict, Katch-McArdle) | Holy Calculator",
  description:
    "Calculate your Basal Metabolic Rate (BMR) using Mifflin-St Jeor, Harris-Benedict, and Katch-McArdle formulas, plus daily calorie needs by activity level.",
  alternates: {
    canonical: "https://www.holycalculator.com/bmr-calculator",
  },
  openGraph: {
    title: "BMR Calculator – Basal Metabolic Rate",
    description:
      "Calculate your baseline resting metabolic rate (BMR) with 3 clinical formulas (Mifflin-St Jeor, Harris-Benedict, Katch-McArdle) and view daily calorie needs across 6 activity levels.",
    url: "https://www.holycalculator.com/bmr-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BMR Calculator – Basal Metabolic Rate | Holy Calculator",
    description:
      "Calculate your Basal Metabolic Rate (BMR) using Mifflin-St Jeor, Harris-Benedict, and Katch-McArdle formulas, plus daily calorie needs by activity level.",
  },
};

export default function BmrCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Health", href: "/#health" },
    { label: "BMR Calculator", active: true },
  ];

  // FAQPage schema markup (JSON-LD)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: BMR_FAQS.map((faq) => ({
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
    name: "Holy Calculator — BMR Calculator",
    url: "https://www.holycalculator.com/bmr-calculator",
    applicationCategory: "HealthApplication",
    operatingSystem: "All",
    description:
      "Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor, Revised Harris-Benedict, and Katch-McArdle formulas, plus daily calorie requirements by activity level.",
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
    name: "How to Calculate Your Basal Metabolic Rate (BMR)",
    description:
      "Step-by-step guide to calculating your BMR and determining daily energy requirements across activity levels.",
    step: [
      {
        "@type": "HowToStep",
        name: "Select unit system and enter physical metrics",
        text: "Choose US Customary (ft/in, lbs) or Metric (cm, kg) units and enter your age, biological sex, height, and weight.",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Select BMR formula and settings",
        text: "Expand the formula settings drawer to choose between Mifflin-St Jeor, Revised Harris-Benedict, or Katch-McArdle (with body fat %), and select Calories vs. kJ.",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "Review baseline BMR and activity maintenance table",
        text: "View your computed BMR and consult the 6-tier activity table to see your estimated daily maintenance calories.",
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
        <div className="eyebrow" style={{ color: "var(--green)" }}>
          <span className="dot" style={{ background: "var(--green)" }} />
          Health Calculators
        </div>
        <h1>BMR Calculator</h1>
        <p className="lead">
          Calculate your Basal Metabolic Rate (BMR) — the minimum energy your body burns at complete rest. Compare results across clinical formulas (Mifflin-St Jeor, Harris-Benedict, Katch-McArdle) and view your daily calorie needs across six physical activity levels.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <BmrCalculatorIsland />

        {/* Desktop Sticky Sidebar Rail */}
        <aside className="calc-sidebar">
          {/* Vertical Ad Space */}
          <div className="sidebar-box" style={{ padding: "10px", textAlign: "center" }}>
            <SidebarAd />
          </div>

          {/* Related Health Calculators */}
          <div className="sidebar-box">
            <h4>Health &amp; Wellness Tools</h4>
            <ul className="sidebar-links-list">
              <li>
                <Link href="/calorie-calculator">
                  <span>Calorie Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/bmi-calculator">
                  <span>BMI Calculator</span>
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
                <Link href="/#health">
                  <span>All Health Tools</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Clinical Note */}
          <div className="sidebar-box">
            <h4>BMR Fast Facts</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>~60% – 75%</strong> of total daily energy burn is BMR
                </span>
              </li>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Mifflin-St Jeor:</strong> Consensus default for general population
                </span>
              </li>
              <li>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Katch-McArdle:</strong> Best for athletes using Lean Mass
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* CLS-safe Below-Calculator Ad Space */}
      <AdBanner />

      {/* Educational Reference Content & FAQs */}
      <BmrReferenceContent />

      <Footer />
    </main>
  );
}
