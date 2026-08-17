import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import MortgageCalculatorIsland from "@/components/MortgageCalculatorIsland";
import MortgageReferenceContent from "@/components/MortgageReferenceContent";
import { MORTGAGE_FAQS } from "@/lib/data/mortgageFaqs";
import Link from "next/link";

export const metadata = {
  title: "Mortgage Calculator – Monthly Payment, Taxes & Amortization | Holy Calculator",
  description:
    "Calculate monthly mortgage payments, property taxes, insurance, PMI, extra payments, and full amortization schedules for Conventional, FHA, VA, & USDA loans.",
  alternates: {
    canonical: "https://holycalculator.com/mortgage-calculator",
  },
  openGraph: {
    title: "Mortgage Calculator – Monthly Payment, Taxes & Amortization",
    description:
      "Free mortgage payment calculator with PMI LTV cancellation tracking, extra payments, biweekly comparison, and full 360-month amortization schedules.",
    url: "https://holycalculator.com/mortgage-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mortgage Calculator – Monthly Payment, Taxes & Amortization | Holy Calculator",
    description:
      "Calculate monthly mortgage payments, property taxes, insurance, PMI, extra payments, and full amortization schedules for Conventional, FHA, VA, & USDA loans.",
  },
};

export default function MortgageCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Finance", href: "/#finance" },
    { label: "Mortgage Calculator", active: true },
  ];

  // FAQPage JSON-LD schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: MORTGAGE_FAQS.map((faq) => ({
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
    name: "Holy Calculator — Mortgage Calculator",
    url: "https://holycalculator.com/mortgage-calculator",
    applicationCategory: "FinancialApplication",
    operatingSystem: "All",
    description:
      "Calculate total monthly mortgage out-of-pocket costs, property taxes, insurance, PMI cancellation timelines, extra principal savings, and full amortization schedules.",
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
    name: "How to Calculate Your Monthly Mortgage Payment",
    description:
      "Step-by-step guide to estimating total monthly home loan costs including principal, interest, property taxes, home insurance, and PMI.",
    step: [
      {
        "@type": "HowToStep",
        name: "Enter home price and down payment",
        text: "Input the target home purchase price and your down payment in dollars or percentage.",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Select loan term and interest rate",
        text: "Choose a loan term (30, 20, 15, or 10 years) and enter your expected annual interest rate.",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "Add property taxes, insurance & fees",
        text: "Customize local property tax rates, annual homeowners insurance, HOA fees, and PMI rate if applicable.",
        position: 3,
      },
      {
        "@type": "HowToStep",
        name: "Review monthly out-of-pocket payment and schedule",
        text: "Instantly view your total monthly payment breakdown, biweekly savings, and full amortization schedule.",
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
        <h1>Mortgage Calculator</h1>
        <p className="lead">
          Estimate your total monthly home loan payment, property taxes, homeowners insurance, PMI, and extra payoff savings using standard amortization algorithms.
          Supports Conventional, FHA, VA, and USDA loan types with automatic PMI LTV cancellation tracking and full 360-month schedules.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <MortgageCalculatorIsland />

        {/* Desktop Sidebar */}
        <aside className="calc-sidebar">
          {/* Vertical Ad Space (600px height reserved) */}
          <SidebarAd />

          {/* Related Financial Tools */}
          <div className="sidebar-box">
            <h4>Financial Calculators</h4>
            <ul className="sidebar-links-list">
              <li>
                <Link href="/mortgage-calculator">
                  <span>Mortgage Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/#finance">
                  <span>Loan Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/#finance">
                  <span>Compound Interest</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Financial Benchmarks */}
          <div className="sidebar-box">
            <h4>Mortgage Benchmarks</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>28% / 36% DTI Rule</strong><br />
                  Standard front-end housing &amp; back-end total debt ratio caps
                </span>
              </li>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>20% Down Payment</strong><br />
                  Standard threshold to eliminate monthly PMI on conventional loans
                </span>
              </li>
              <li>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>78% LTV Cancellation</strong><br />
                  Automatic PMI cancellation threshold under the federal HPA
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Below-calculator ad banner */}
      <AdBanner />

      {/* SEO Reference Content */}
      <MortgageReferenceContent />

      <Footer />
    </main>
  );
}
