import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import BodyFatCalculatorIsland from "@/components/BodyFatCalculatorIsland";
import BodyFatReferenceContent from "@/components/BodyFatReferenceContent";
import { BODY_FAT_FAQS } from "@/lib/data/bodyFatFaqs";
import Link from "next/link";

export const metadata = {
  title: "Body Fat Calculator – U.S. Navy Method & BMI Method | Holy Calculator",
  description:
    "Calculate body fat percentage, fat mass, and lean body mass using the U.S. Navy Method and BMI Method with ACE reference categories.",
  alternates: {
    canonical: "https://www.holycalculator.com/body-fat-calculator",
  },
  openGraph: {
    title: "Body Fat Calculator – U.S. Navy Method & BMI Method",
    description:
      "Free online Body Fat Calculator. Estimate body fat percentage, fat mass, and lean mass with the U.S. Navy tape measure formula and BMI method.",
    url: "https://www.holycalculator.com/body-fat-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Body Fat Calculator | Holy Calculator",
    description:
      "Estimate body fat percentage, fat mass, and lean mass with the U.S. Navy tape measure formula.",
  },
};

export default function BodyFatCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Health & Fitness", href: "/#health" },
    { label: "Body Fat Calculator", active: true },
  ];

  // FAQPage schema markup (JSON-LD)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: BODY_FAT_FAQS.map((faq) => ({
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
    name: "Holy Calculator — Body Fat Calculator",
    url: "https://www.holycalculator.com/body-fat-calculator",
    applicationCategory: "HealthApplication",
    operatingSystem: "All",
    description:
      "Calculate body fat percentage, fat mass, and lean body mass using the U.S. Navy tape measure method and BMI method.",
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
    name: "How to Measure and Calculate Body Fat Percentage",
    description:
      "Step-by-step instructions to take tape measure circumferences and calculate body fat percentage.",
    step: [
      {
        "@type": "HowToStep",
        name: "Select gender and unit system",
        text: "Choose Male or Female and select US Customary (lbs, inches) or Metric (kg, cm).",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Take circumference measurements",
        text: "Measure neck below Adam's apple, waist at navel level (male) or narrowest point (female), and hips at widest point (female).",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "View instant body fat breakdown",
        text: "The calculator outputs U.S. Navy Body Fat %, ACE category badge, fat mass, lean body mass, and secondary BMI-based estimate.",
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
        <div className="eyebrow" style={{ color: "#4F7A5B" }}>
          <span className="dot" style={{ background: "#4F7A5B" }} />
          Health &amp; Fitness Calculators
        </div>
        <h1>Body Fat Calculator</h1>
        <p className="lead">
          Calculate body fat percentage, fat mass, and lean body mass using the U.S. Navy Circumference Method and BMI-based estimation formulas.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <BodyFatCalculatorIsland />

        {/* Desktop Sticky Sidebar Rail */}
        <aside className="calc-sidebar">
          {/* Vertical Ad Space */}
          <div className="sidebar-box" style={{ padding: "10px", textAlign: "center" }}>
            <SidebarAd />
          </div>

          {/* Related Health Tools */}
          <div className="sidebar-box">
            <h4>Health &amp; Fitness Tools</h4>
            <ul className="sidebar-links-list">
              <li>
                <Link href="/bmi-calculator">
                  <span>BMI Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/ideal-weight-calculator">
                  <span>Ideal Weight Calculator</span>
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
                <Link href="/bmr-calculator">
                  <span>BMR Calculator</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Body Fat Fast Facts */}
          <div className="sidebar-box">
            <h4>Body Fat Fast Facts</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Essential Fat:</strong> 2–5% in men, 10–13% in women
                </span>
              </li>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>U.S. Navy Method:</strong> Uses log10 waist/neck/hip ratios
                </span>
              </li>
              <li>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>DEXA Scan:</strong> Clinical gold-standard test
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* CLS-safe Below-Calculator Ad Space */}
      <AdBanner />

      {/* Educational Reference Content & FAQs */}
      <BodyFatReferenceContent />

      <Footer />
    </main>
  );
}
