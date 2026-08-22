import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import HouseAffordabilityCalculatorIsland from "@/components/HouseAffordabilityCalculatorIsland";
import HouseAffordabilityReferenceContent from "@/components/HouseAffordabilityReferenceContent";
import { HOUSE_AFFORDABILITY_FAQS } from "@/lib/data/houseAffordabilityFaqs";
import Link from "next/link";

export const metadata = {
  title: "House Affordability Calculator – How Much House Can I Afford? | Holy Calculator",
  description:
    "Calculate your maximum home purchasing budget based on household income, monthly debts, down payment funds, and 28/36 underwriting rules.",
  alternates: {
    canonical: "https://www.holycalculator.com/house-affordability-calculator",
  },
  openGraph: {
    title: "House Affordability Calculator – How Much House Can I Afford?",
    description:
      "Free house affordability calculator based on income, debt, and down payment. Compare conservative, conventional, and aggressive underwriting budget tiers.",
    url: "https://www.holycalculator.com/house-affordability-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "House Affordability Calculator | Holy Calculator",
    description:
      "Calculate your maximum home purchase price based on income and debts.",
  },
};

export default function HouseAffordabilityCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Finance", href: "/#finance" },
    { label: "House Affordability Calculator", active: true },
  ];

  // FAQPage JSON-LD schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOUSE_AFFORDABILITY_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  // WebApplication JSON-LD schema
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Holy Calculator — House Affordability Calculator",
    url: "https://www.holycalculator.com/house-affordability-calculator",
    applicationCategory: "FinancialApplication",
    operatingSystem: "All",
    description:
      "Estimate the maximum home price and monthly mortgage payment you can afford based on income, debt obligations, and down payment savings.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  // HowTo JSON-LD schema
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Calculate House Affordability",
    description:
      "Step-by-step instructions for calculating your maximum home purchasing power.",
    step: [
      {
        "@type": "HowToStep",
        name: "Enter household annual income",
        text: "Input gross annual pre-tax income for all contributing borrowers.",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Enter monthly recurring debts",
        text: "Add monthly payments for auto loans, student loans, credit cards, and personal loans.",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "Input down payment savings",
        text: "Specify total liquid cash available for your upfront down payment.",
        position: 3,
      },
      {
        "@type": "HowToStep",
        name: "Review affordability tiers & monthly PITI",
        text: "Inspect maximum purchase price across conservative (25%), conventional (28/36), and aggressive (45%) budget models.",
        position: 4,
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
          Financial Calculators
        </div>
        <h1>House Affordability Calculator</h1>
        <p className="lead">
          Calculate how much house you can afford based on your household income, recurring monthly debts, down payment funds, and current mortgage interest rates.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <HouseAffordabilityCalculatorIsland />

        {/* Desktop Sidebar */}
        <aside className="calc-sidebar">
          <SidebarAd />

          <div className="sidebar-box">
            <h4>Related Home Buying Tools</h4>
            <ul className="sidebar-links-list">
              <li>
                <Link href="/mortgage-calculator">
                  <span>Mortgage Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/down-payment-calculator">
                  <span>Down Payment Planner</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/debt-to-income-ratio-calculator">
                  <span>Debt-to-Income Ratio</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="sidebar-box">
            <h4>Affordability Benchmark</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>3x to 4x Annual Salary</strong><br />
                  A common safe benchmark is purchasing a home valued at 3x to 4x your gross household income.
                </span>
              </li>
              <li>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Watch Out for Debts</strong><br />
                  Every $100/mo in auto or student debt reduces your home buying capacity by ~$16,000.
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <AdBanner />

      {/* SEO Reference Content */}
      <HouseAffordabilityReferenceContent />

      <Footer />
    </main>
  );
}
