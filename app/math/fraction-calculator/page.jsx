import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import FractionCalculatorIsland from "@/components/FractionCalculatorIsland";
import FractionReferenceContent from "@/components/FractionReferenceContent";
import { FRACTION_FAQS } from "@/lib/data/fractionFaqs";
import Link from "next/link";

export const metadata = {
  title: "Fraction Calculator – Add, Subtract, Multiply, Divide & Simplify Fractions | Holy Calculator",
  description:
    "Add, subtract, multiply, divide, simplify fractions, convert decimals to fractions, and solve mixed numbers with instant step-by-step results.",
  alternates: {
    canonical: "https://holycalculator.com/math/fraction-calculator",
  },
  openGraph: {
    title: "Fraction Calculator – Add, Subtract, Multiply, Divide & Simplify Fractions",
    description:
      "Free online Fraction Calculator. Perform basic fraction arithmetic, mixed numbers calculations, fraction simplification, and decimal-to-fraction conversions.",
    url: "https://holycalculator.com/math/fraction-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fraction Calculator | Holy Calculator",
    description:
      "Add, subtract, multiply, divide, simplify fractions, convert decimals to fractions, and solve mixed numbers.",
  },
};

export default function FractionCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Math", href: "/#math" },
    { label: "Fraction Calculator", active: true },
  ];

  // FAQPage schema markup (JSON-LD)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FRACTION_FAQS.map((faq) => ({
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
    name: "Holy Calculator — Fraction Calculator",
    url: "https://holycalculator.com/math/fraction-calculator",
    applicationCategory: "EducationalApplication",
    operatingSystem: "All",
    description:
      "Perform fraction addition, subtraction, multiplication, division, simplification, decimal conversions, and BigInt large number math.",
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
    name: "How to Add, Subtract, Multiply, and Divide Fractions",
    description:
      "Step-by-step instructions to perform fraction arithmetic, simplify fractions, and convert between decimals and fractions.",
    step: [
      {
        "@type": "HowToStep",
        name: "Select sub-calculator tool",
        text: "Choose between basic fraction operations, mixed numbers, simplification, decimal conversion, or BigInt arbitrary-precision math.",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Enter numerators and denominators",
        text: "Input the top numerator and bottom denominator numbers for each fraction.",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "View simplified result",
        text: "The calculator instantly displays the GCD-reduced result in both improper fraction and mixed number formats.",
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
        <h1>Fraction Calculator</h1>
        <p className="lead">
          Add, subtract, multiply, divide, and simplify fractions or mixed numbers, and convert seamlessly between decimals and fractions with Euclidean GCD precision.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <FractionCalculatorIsland />

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
                <Link href="/math/percentage-calculator">
                  <span>Percentage Calculator</span>
                  <span>→</span>
                </Link>
              </li>
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
                <Link href="/#math">
                  <span>All Math Tools</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Math Fast Facts */}
          <div className="sidebar-box">
            <h4>Fraction Fast Facts</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>GCD Reduction:</strong> Euclidean algorithm simplifies fractions to lowest terms
                </span>
              </li>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Reciprocal Division:</strong> Dividing by a fraction is multiplying by its inverse
                </span>
              </li>
              <li>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>BigInt Engine:</strong> Computes exact ratios beyond 9 quadrillion (2⁵³)
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* CLS-safe Below-Calculator Ad Space */}
      <AdBanner />

      {/* Educational Reference Content & FAQs */}
      <FractionReferenceContent />

      <Footer />
    </main>
  );
}
