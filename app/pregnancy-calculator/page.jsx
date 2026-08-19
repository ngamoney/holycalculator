import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import DueDateCalculatorIsland from "@/components/DueDateCalculatorIsland";
import PregnancyReferenceContent from "@/components/PregnancyReferenceContent";
import { PREGNANCY_FAQS } from "@/lib/data/pregnancyFaqs";
import Link from "next/link";

export const metadata = {
  title: "Pregnancy & Due Date Calculator – Estimate Your Due Date | Holy Calculator",
  description:
    "Calculate your estimated due date, gestational age, and trimester timeline using LMP, conception date, IVF transfer, or ultrasound scan. Clinical methods aligned with ACOG.",
  alternates: {
    canonical: "https://www.holycalculator.com/pregnancy-calculator",
  },
  openGraph: {
    title: "Pregnancy & Due Date Calculator – Estimate Your Due Date",
    description:
      "Free clinical pregnancy due date calculator with 5 calculation methods (LMP, conception, IVF, ultrasound, known due date). Live trimester timeline and gestational age tracking.",
    url: "https://www.holycalculator.com/pregnancy-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pregnancy & Due Date Calculator – Estimate Your Due Date | Holy Calculator",
    description:
      "Calculate your estimated due date, gestational age, and trimester timeline using LMP, conception date, IVF transfer, or ultrasound scan. Clinical methods aligned with ACOG.",
  },
};

export default function PregnancyCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Health", href: "/#health" },
    { label: "Pregnancy Due Date Calculator", active: true },
  ];

  // FAQPage schema — matches rendered FAQ section
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PREGNANCY_FAQS.map((faq) => ({
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
    name: "Holy Calculator — Pregnancy Due Date Calculator",
    url: "https://www.holycalculator.com/pregnancy-calculator",
    applicationCategory: "HealthApplication",
    operatingSystem: "All",
    description:
      "Calculate estimated pregnancy due dates, gestational age, and trimester milestones using LMP, conception, IVF, or ultrasound dating algorithms.",
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
    name: "How to Calculate Your Pregnancy Due Date",
    description:
      "Step-by-step guide to calculating an estimated due date using your last menstrual period (LMP), conception date, IVF transfer date, or ultrasound measurement.",
    step: [
      {
        "@type": "HowToStep",
        name: "Select your calculation method",
        text: "Choose between Last Menstrual Period (LMP), Conception Date, IVF Transfer Date, Ultrasound Date, or Known Due Date.",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Enter your date and cycle details",
        text: "Input the corresponding date and, if applicable, your average cycle length or embryo transfer stage.",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "Review estimated due date and trimester timeline",
        text: "View your calculated due date, current gestational age in weeks and days, trimester stage, and developmental milestone dates.",
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
        <div className="eyebrow" style={{ color: "var(--green)" }}>
          <span className="dot" style={{ background: "var(--green)" }} />
          Health Calculators
        </div>
        <h1>Pregnancy Due Date Calculator</h1>
        <p className="lead">
          Estimate your due date, current gestational age, and trimester timeline using standard
          clinical algorithms aligned with American College of Obstetricians and Gynecologists (ACOG) guidelines.
          Supports Last Menstrual Period (LMP), conception date, IVF transfer, ultrasound scan, and reverse due date calculations.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <DueDateCalculatorIsland />

        {/* Desktop Sidebar */}
        <aside className="calc-sidebar">
          {/* Vertical Ad Space */}
          <SidebarAd />

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
                <Link href="/age-calculator">
                  <span>Age Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/#health">
                  <span>BMI Calculator</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Clinical References */}
          <div className="sidebar-box">
            <h4>Clinical Benchmarks</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>280 Days (40 Weeks)</strong><br />
                  Average duration from LMP to estimated due date
                </span>
              </li>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>266 Days (38 Weeks)</strong><br />
                  Average duration from fertilization to delivery
                </span>
              </li>
              <li>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>37 – 42 Weeks</strong><br />
                  Normal clinical range for full-term delivery
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Below-calculator ad slot */}
      <AdBanner />

      {/* SEO Reference Content */}
      <PregnancyReferenceContent />

      <Footer />
    </main>
  );
}
