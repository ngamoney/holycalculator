import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import BmiCalculatorIsland from "@/components/BmiCalculatorIsland";
import BmiReferenceContent from "@/components/BmiReferenceContent";
import { BMI_FAQS } from "@/lib/data/bmiFaqs";
import Link from "next/link";

export const metadata = {
  title: "BMI Calculator – Body Mass Index for Adults, Teens & Children | Holy Calculator",
  description:
    "Calculate your exact Body Mass Index (BMI), BMI Prime, Ponderal Index, and healthy weight range for adults, teens, and children. Free WHO & CDC clinical standards.",
  alternates: {
    canonical: "https://www.holycalculator.com/bmi-calculator",
  },
  openGraph: {
    title: "BMI Calculator – Body Mass Index for Adults, Teens & Children",
    description:
      "Free Body Mass Index (BMI) calculator supporting US Customary and Metric units. Instant WHO adult classification, CDC child percentiles, BMI Prime, and Ponderal Index.",
    url: "https://www.holycalculator.com/bmi-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BMI Calculator – Body Mass Index for Adults, Teens & Children | Holy Calculator",
    description:
      "Calculate your exact Body Mass Index (BMI), BMI Prime, Ponderal Index, and healthy weight range for adults, teens, and children.",
  },
};

export default function BmiCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Health", href: "/#health" },
    { label: "BMI Calculator", active: true },
  ];

  // FAQPage schema markup (JSON-LD)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: BMI_FAQS.map((faq) => ({
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
    name: "Holy Calculator — BMI Calculator",
    url: "https://www.holycalculator.com/bmi-calculator",
    applicationCategory: "HealthApplication",
    operatingSystem: "All",
    description:
      "Calculate Body Mass Index (BMI), BMI Prime, Ponderal Index, and age-adjusted CDC percentiles for adults, teens, and children.",
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
    name: "How to Calculate Your Body Mass Index (BMI)",
    description:
      "Step-by-step instructions to calculate your BMI, evaluate your WHO weight category, and determine your target healthy weight range.",
    step: [
      {
        "@type": "HowToStep",
        name: "Select unit system",
        text: "Choose between US Customary units (feet, inches, pounds), Metric units (centimeters, kilograms), or custom units.",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Enter age, sex, height, and weight",
        text: "Input your age (2–120 years), biological sex, height, and weight into the calculator form.",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "Review BMI category and healthy weight range",
        text: "View your computed BMI value, WHO/CDC category badge, visual scale marker, BMI Prime, Ponderal Index, and target weight range.",
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
        <h1>BMI Calculator</h1>
        <p className="lead">
          Calculate your Body Mass Index (BMI), BMI Prime, Ponderal Index, and healthy target weight range. Supports US Customary and Metric units for adults (WHO standards) and age-adjusted growth chart percentiles for children and teens (CDC standards).
        </p>
      </header>

      {/* Main Two-Column Layout (Interactive Island + Sticky Sidebar) */}
      <div className="calc-layout">
        <BmiCalculatorIsland />

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
                <Link href="/pregnancy-calculator">
                  <span>Pregnancy Due Date</span>
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
                <Link href="/#health">
                  <span>All Health Tools</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick WHO Reference Card */}
          <div className="sidebar-box">
            <h4>Quick WHO Cutoffs</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "#3B82F6" }}>Underweight:</strong> &lt; 18.5
                </span>
              </li>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "#4F7A5B" }}>Normal Weight:</strong> 18.5 – 24.9
                </span>
              </li>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "#C9992F" }}>Overweight:</strong> 25.0 – 29.9
                </span>
              </li>
              <li>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "#D32F2F" }}>Obese:</strong> &ge; 30.0
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* CLS-safe Below-Calculator Ad Space */}
      <AdBanner />

      {/* SEO Educational Reference Content & FAQs */}
      <BmiReferenceContent />

      <Footer />
    </main>
  );
}
