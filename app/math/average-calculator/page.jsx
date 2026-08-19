import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import AverageCalculatorIsland from "@/components/AverageCalculatorIsland";
import AverageReferenceContent from "@/components/AverageReferenceContent";
import { AVERAGE_FAQS } from "@/lib/data/averageFaqs";
import Link from "next/link";

export const metadata = {
  title: "Average Calculator – Find Mean, Median, Mode & Weighted Average | Holy Calculator",
  description:
    "Calculate Arithmetic Mean, Median, Mode, Range, Geometric Mean, Harmonic Mean, and Weighted Average instantly with custom dataset support.",
  alternates: {
    canonical: "https://www.holycalculator.com/math/average-calculator",
  },
  openGraph: {
    title: "Average Calculator – Find Mean, Median, Mode & Weighted Average",
    description:
      "Free online Average & Statistics Calculator. Calculate mean, median, mode, range, geometric mean, harmonic mean, and weighted averages instantly.",
    url: "https://www.holycalculator.com/math/average-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Average Calculator | Holy Calculator",
    description:
      "Calculate Mean, Median, Mode, Range, Geometric Mean, Harmonic Mean, and Weighted Average instantly.",
  },
};

export default function AverageCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Math", href: "/#math" },
    { label: "Average Calculator", active: true },
  ];

  // FAQPage schema markup (JSON-LD)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: AVERAGE_FAQS.map((faq) => ({
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
    name: "Holy Calculator — Average Calculator",
    url: "https://www.holycalculator.com/math/average-calculator",
    applicationCategory: "EducationalApplication",
    operatingSystem: "All",
    description:
      "Calculate Mean, Median, Mode, Range, Geometric Mean, Harmonic Mean, and Weighted Average with instant debounced calculations.",
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
    name: "How to Calculate Averages and Statistical Metrics",
    description:
      "Step-by-step instructions to calculate simple averages, median, mode, range, and weighted averages.",
    step: [
      {
        "@type": "HowToStep",
        name: "Select mode",
        text: "Choose between 'Simple Average & Statistics' mode or 'Weighted Average' mode.",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Enter numbers or value-weight pairs",
        text: "Input numbers separated by commas, spaces, or newlines, or enter value and weight rows.",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "View instant calculated results",
        text: "The result card displays Mean, Median, Mode, Range, Geometric Mean, Harmonic Mean, Sum, and Count.",
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
        <div className="eyebrow" style={{ color: "#9C7420" }}>
          <span className="dot" style={{ background: "#9C7420" }} />
          Math &amp; Statistics Calculators
        </div>
        <h1>Average Calculator</h1>
        <p className="lead">
          Calculate the Arithmetic Mean, Median, Mode, Range, Geometric Mean, Harmonic Mean, and Weighted Average instantly from any list of numbers.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <AverageCalculatorIsland />

        {/* Desktop Sticky Sidebar Rail */}
        <aside className="calc-sidebar">
          {/* Vertical Ad Space */}
          <div className="sidebar-box" style={{ padding: "10px", textAlign: "center" }}>
            <SidebarAd />
          </div>

          {/* Related Math Tools */}
          <div className="sidebar-box">
            <h4>Math &amp; Academic Tools</h4>
            <ul className="sidebar-links-list">
              <li>
                <Link href="/math/standard-deviation-calculator">
                  <span>Standard Deviation</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/grade-calculator">
                  <span>Grade Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/gpa-calculator">
                  <span>GPA Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/math/percentage-calculator">
                  <span>Percentage Calculator</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Average Fast Facts */}
          <div className="sidebar-box">
            <h4>Average Fast Facts</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Mean (x̄):</strong> Sum of values divided by count (N)
                </span>
              </li>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Median:</strong> Middle value resistant to outliers
                </span>
              </li>
              <li>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Mode:</strong> Most frequently occurring number
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* CLS-safe Below-Calculator Ad Space */}
      <AdBanner />

      {/* Educational Reference Content & FAQs */}
      <AverageReferenceContent />

      <Footer />
    </main>
  );
}
