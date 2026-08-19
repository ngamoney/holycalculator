import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import CalorieCalculatorIsland from "@/components/CalorieCalculatorIsland";
import CalorieReferenceContent from "@/components/CalorieReferenceContent";
import { CALORIE_FAQS } from "@/lib/data/calorieFaqs";
import Link from "next/link";

export const metadata = {
  title: "Calorie Calculator – Daily Calorie Needs & Weight Goals | Holy Calculator",
  description:
    "Calculate your maintenance calories, BMR, and daily calorie targets for weight loss or gain. Supports Mifflin-St Jeor, Harris-Benedict, and Katch-McArdle formulas with US and metric units.",
  alternates: {
    canonical: "https://holycalculator.com/calorie-calculator",
  },
  openGraph: {
    title: "Calorie Calculator – Daily Calorie Needs & Weight Goals",
    description:
      "Free calorie calculator with BMR estimation and weight loss/gain targets. Supports three BMR formulas, US and metric units, and live results.",
    url: "https://holycalculator.com/calorie-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calorie Calculator – Daily Calorie Needs & Weight Goals | Holy Calculator",
    description:
      "Calculate your maintenance calories, BMR, and personalized weight loss or gain calorie targets using Mifflin-St Jeor, Harris-Benedict, or Katch-McArdle formulas.",
  },
};

export default function CalorieCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Fitness & Health", href: "/#health" },
    { label: "Calorie Calculator", active: true },
  ];

  // FAQPage schema — matches the rendered FAQ section
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: CALORIE_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  // WebApplication schema
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Holy Calculator — Calorie Calculator",
    url: "https://holycalculator.com/calorie-calculator",
    applicationCategory: "HealthApplication",
    operatingSystem: "All",
    description:
      "Calculate daily calorie needs, BMR, and weight-change targets using Mifflin-St Jeor, Revised Harris-Benedict, or Katch-McArdle formulas.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  // HowTo schema
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Calculate Your Daily Calorie Needs",
    description:
      "Step-by-step guide to calculating Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) to determine daily calorie needs.",
    step: [
      {
        "@type": "HowToStep",
        name: "Enter your personal details",
        text: "Input your age, biological sex, height, and weight. These are required by all BMR formulas.",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Select your activity level",
        text: "Choose the activity level that best describes your typical week, from Sedentary to Extra Active.",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "Read your calorie targets",
        text: "The calculator instantly shows your maintenance calories (TDEE), along with calorie targets for mild, moderate, and more significant weight loss or gain.",
        position: 3,
      },
    ],
  };

  return (
    <main>
      {/* Structured Data */}
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
        <div className="eyebrow">
          <span className="dot" />
          Fitness &amp; Health Calculators
        </div>
        <h1>Calorie Calculator</h1>
        <p className="lead">
          Estimate your daily maintenance calories, BMR, and personalized targets for weight loss or
          gain — using the Mifflin-St Jeor, Harris-Benedict, or Katch-McArdle formula. Supports
          US and metric units with live results and a shareable link.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <CalorieCalculatorIsland />

        {/* Desktop Sticky Sidebar */}
        <aside className="calc-sidebar">
          {/* Vertical Ad */}
          <SidebarAd />

          {/* Related Fitness & Health Calculators */}
          <div className="sidebar-box">
            <h4>Fitness &amp; Health Calculators</h4>
            <ul className="sidebar-links-list">
              <li>
                <Link href="/#health">
                  <span>BMI Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/#health">
                  <span>Body Fat Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/#health">
                  <span>BMR Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/#health">
                  <span>Macro Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/#health">
                  <span>Ideal Weight Calculator</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Calorie Facts */}
          <div className="sidebar-box">
            <h4>Quick Reference</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>1 lb ≈ 3,500 kcal</strong><br />
                  Net deficit/surplus to change ~1 lb body weight
                </span>
              </li>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>1 kcal = 4.184 kJ</strong><br />
                  International energy unit conversion
                </span>
              </li>
              <li>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Safe minimum</strong><br />
                  ~1,200 kcal/day (women), ~1,500 kcal/day (men) without medical supervision
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Below-calculator ad */}
      <AdBanner />

      {/* SEO Reference Content */}
      <CalorieReferenceContent />

      <Footer />
    </main>
  );
}
