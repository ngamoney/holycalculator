import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import PercentageCalculatorIsland from "@/components/PercentageCalculatorIsland";
import PercentageReferenceContent from "@/components/PercentageReferenceContent";
import { PERCENTAGE_FAQS } from "@/lib/data/percentageFaqs";
import Link from "next/link";

export const metadata = {
  title: "Percentage Calculator – Find Percentages, Differences & Changes | Holy Calculator",
  description:
    "Calculate basic percentages (X% of Y, X is what % of Y, X is Y% of what), percentage difference, and percentage increase or decrease instantly.",
  alternates: {
    canonical: "https://www.holycalculator.com/math/percentage-calculator",
  },
  openGraph: {
    title: "Percentage Calculator – Find Percentages, Differences & Changes",
    description:
      "Free online Percentage Calculator. Compute basic percentages, percentage difference, and percentage increase or decrease with instant debounced results.",
    url: "https://www.holycalculator.com/math/percentage-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Percentage Calculator | Holy Calculator",
    description:
      "Calculate basic percentages, percentage difference, and percentage increase or decrease instantly.",
  },
};

export default function PercentageCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Math", href: "/#math" },
    { label: "Percentage Calculator", active: true },
  ];

  // FAQPage schema markup (JSON-LD)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PERCENTAGE_FAQS.map((faq) => ({
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
    name: "Holy Calculator — Percentage Calculator",
    url: "https://www.holycalculator.com/math/percentage-calculator",
    applicationCategory: "EducationalApplication",
    operatingSystem: "All",
    description:
      "Calculate basic percentages, percentage difference, and percentage increase/decrease with instant debounced calculations.",
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
    name: "How to Calculate Percentages, Differences, and Changes",
    description:
      "Step-by-step instructions to solve basic percentage queries, calculate percentage differences between two values, and compute percentage increases or decreases.",
    step: [
      {
        "@type": "HowToStep",
        name: "Choose your target percentage phrasing",
        text: "Select the mini-calculator matching your natural query ('What is X% of Y', 'X is what % of Y', or 'X is Y% of what').",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Enter numbers in the mini-calculator card",
        text: "Input the known numbers into the designated fields.",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "View instant calculated results",
        text: "The result card instantly outputs the final calculated percentage value alongside the explicit algebraic formula.",
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
          Math Calculators
        </div>
        <h1>Percentage Calculator</h1>
        <p className="lead">
          Calculate basic percentages, percentage differences between two numbers, and percentage increases or decreases instantly with five natural-language mini-calculators.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <PercentageCalculatorIsland />

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
                <Link href="/#math">
                  <span>All Math Tools</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Math Fast Facts */}
          <div className="sidebar-box">
            <h4>Percentage Fast Facts</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Per Centum:</strong> Latin for &quot;by the hundred&quot;
                </span>
              </li>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Reversible %:</strong> X% of Y is always equal to Y% of X! (e.g. 8% of 50 = 50% of 8 = 4)
                </span>
              </li>
              <li>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Relative Diff:</strong> Uses average denominator for un-based comparisons
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* CLS-safe Below-Calculator Ad Space */}
      <AdBanner />

      {/* Educational Reference Content & FAQs */}
      <PercentageReferenceContent />

      <Footer />
    </main>
  );
}
