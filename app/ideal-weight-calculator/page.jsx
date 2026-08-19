import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import IdealWeightCalculatorIsland from "@/components/IdealWeightCalculatorIsland";
import IdealWeightReferenceContent from "@/components/IdealWeightReferenceContent";
import { IDEAL_WEIGHT_FAQS } from "@/lib/data/idealWeightFaqs";
import Link from "next/link";

export const metadata = {
  title: "Ideal Weight Calculator – Devine, Robinson, Miller & Hamwi Formulas | Holy Calculator",
  description:
    "Calculate your ideal body weight using Devine, Robinson, Miller, and Hamwi formulas alongside the WHO Healthy BMI weight range.",
  alternates: {
    canonical: "https://www.holycalculator.com/ideal-weight-calculator",
  },
  openGraph: {
    title: "Ideal Weight Calculator – Devine, Robinson, Miller & Hamwi Formulas",
    description:
      "Compare ideal body weight side-by-side across 4 clinical formulas (Devine, Robinson, Miller, Hamwi) and WHO Healthy BMI weight ranges.",
    url: "https://www.holycalculator.com/ideal-weight-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ideal Weight Calculator | Holy Calculator",
    description:
      "Calculate your ideal body weight using Devine, Robinson, Miller, and Hamwi formulas alongside the WHO Healthy BMI weight range.",
  },
};

export default function IdealWeightCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Health", href: "/#health" },
    { label: "Ideal Weight Calculator", active: true },
  ];

  // FAQPage schema markup (JSON-LD)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: IDEAL_WEIGHT_FAQS.map((faq) => ({
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
    name: "Holy Calculator — Ideal Weight Calculator",
    url: "https://www.holycalculator.com/ideal-weight-calculator",
    applicationCategory: "HealthApplication",
    operatingSystem: "All",
    description:
      "Compare ideal body weight across Devine, Robinson, Miller, and Hamwi formulas alongside WHO Healthy BMI weight ranges.",
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
    name: "How to Compare Ideal Weight Formulas",
    description:
      "Step-by-step instructions to calculate and compare ideal body weight across four clinical formulas and healthy BMI ranges.",
    step: [
      {
        "@type": "HowToStep",
        name: "Select unit system and physical parameters",
        text: "Choose US Customary (ft/in) or Metric (cm) units, select biological sex, and enter age and height.",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Review formula comparison table",
        text: "Examine the side-by-side comparison table showing Devine, Robinson, Miller, and Hamwi calculations alongside the WHO Healthy BMI Weight Range.",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "Evaluate body frame size context",
        text: "Consult the wrist circumference reference table to adjust expectations for small, medium, or large skeletal frame sizes.",
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
        <h1>Ideal Weight Calculator</h1>
        <p className="lead">
          Compare your ideal body weight across four classic medical formulas — Devine (1974), Robinson (1983), Miller (1983), and Hamwi (1964) — alongside the World Health Organization (WHO) Healthy BMI Weight Range.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <IdealWeightCalculatorIsland />

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
                <Link href="/bmi-calculator">
                  <span>BMI Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/bmr-calculator">
                  <span>BMR Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/calorie-calculator">
                  <span>Calorie Calculator</span>
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
            <h4>Clinical Fast Facts</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Devine (1974):</strong> Most widely cited in pharmacy &amp; drug dosing
                </span>
              </li>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Healthy BMI:</strong> 18.5 – 24.9 kg/m² WHO standard range
                </span>
              </li>
              <li>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Frame Size:</strong> Wrist size alters healthy weight by ±10%
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* CLS-safe Below-Calculator Ad Space */}
      <AdBanner />

      {/* Educational Reference Content & FAQs */}
      <IdealWeightReferenceContent />

      <Footer />
    </main>
  );
}
