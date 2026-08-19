import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import SalesTaxCalculatorIsland from "@/components/SalesTaxCalculatorIsland";
import SalesTaxReferenceContent from "@/components/SalesTaxReferenceContent";
import { SALES_TAX_FAQS } from "@/lib/data/salesTaxFaqs";
import Link from "next/link";

export const metadata = {
  title: "Sales Tax Calculator – Calculate Tax Rate, Before & After Tax Price | Holy Calculator",
  description:
    "Calculate sales tax amounts, original before-tax prices, and final totals with 50-state tax rate lookups and state tax rate reference tables.",
  alternates: {
    canonical: "https://www.holycalculator.com/sales-tax-calculator",
  },
  openGraph: {
    title: "Sales Tax Calculator – Calculate Tax Rate, Before & After Tax Price",
    description:
      "Free online Sales Tax Calculator. Solve for price before tax, tax rate, or final price with 50-state U.S. sales tax rate lookups.",
    url: "https://www.holycalculator.com/sales-tax-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sales Tax Calculator | Holy Calculator",
    description:
      "Solve for price before tax, tax rate, or final price with 50-state U.S. sales tax rate lookups.",
  },
};

export default function SalesTaxCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Finance", href: "/#finance" },
    { label: "Sales Tax Calculator", active: true },
  ];

  // FAQPage schema markup (JSON-LD)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SALES_TAX_FAQS.map((faq) => ({
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
    name: "Holy Calculator — Sales Tax Calculator",
    url: "https://www.holycalculator.com/sales-tax-calculator",
    applicationCategory: "FinancialApplication",
    operatingSystem: "All",
    description:
      "Calculate sales tax amounts, original prices, and final prices with pre-filled 50-state U.S. sales tax rates.",
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
    name: "How to Calculate Sales Tax and Prices",
    description:
      "Step-by-step instructions to calculate sales tax amounts, original item prices, or tax percentages.",
    step: [
      {
        "@type": "HowToStep",
        name: "Choose calculation target mode",
        text: "Select whether you want to calculate final price after tax, original price before tax, or the effective tax rate.",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Select state or enter tax rate",
        text: "Pick a state from the dropdown to pre-fill the general base rate, or type a custom tax percentage.",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "View instant calculation breakdown",
        text: "The result card instantly displays total price, tax paid in dollars, and the original before-tax price.",
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
        <div className="eyebrow" style={{ color: "var(--ink)" }}>
          <span className="dot" style={{ background: "var(--ink)" }} />
          Finance Calculators
        </div>
        <h1>Sales Tax Calculator</h1>
        <p className="lead">
          Calculate sales tax amounts, before-tax prices, or tax rates instantly. Pre-fill base tax rates for all 50 U.S. states, Washington D.C., Puerto Rico, and Guam.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <SalesTaxCalculatorIsland />

        {/* Desktop Sticky Sidebar Rail */}
        <aside className="calc-sidebar">
          {/* Vertical Ad Space */}
          <div className="sidebar-box" style={{ padding: "10px", textAlign: "center" }}>
            <SidebarAd />
          </div>

          {/* Related Finance Tools */}
          <div className="sidebar-box">
            <h4>Finance Tools</h4>
            <ul className="sidebar-links-list">
              <li>
                <Link href="/mortgage-calculator">
                  <span>Mortgage Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/loan-calculator">
                  <span>Loan Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/budget-calculator">
                  <span>Budget Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/currency-calculator">
                  <span>Currency Converter</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Sales Tax Fast Facts */}
          <div className="sidebar-box">
            <h4>Sales Tax Fast Facts</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>No Federal Sales Tax:</strong> Levied independently by 45 states + DC.
                </span>
              </li>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>5 Zero-Tax States:</strong> NH, OR, MT, AK, DE (NOMAD states).
                </span>
              </li>
              <li>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Highest Base Rate:</strong> California (7.25% state base rate).
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* CLS-safe Below-Calculator Ad Space */}
      <AdBanner />

      {/* Educational Reference Content & FAQs */}
      <SalesTaxReferenceContent />

      <Footer />
    </main>
  );
}
