import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import DebtPayoffCalculatorIsland from "@/components/DebtPayoffCalculatorIsland";
import DebtPayoffReferenceContent from "@/components/DebtPayoffReferenceContent";
import { DEBT_PAYOFF_FAQS } from "@/lib/data/debtPayoffFaqs";
import Link from "next/link";

export const metadata = {
  title: "Debt Payoff Calculator – Avalanche & Snowball Multi-Debt Planner | Holy Calculator",
  description:
    "Plan the fastest path to becoming debt-free across credit cards, auto loans, and personal loans. Compare Avalanche and Snowball payoff strategies with payment rollovers.",
  alternates: {
    canonical: "https://www.holycalculator.com/debt-payoff-calculator",
  },
  openGraph: {
    title: "Debt Payoff Calculator – Avalanche & Snowball Multi-Debt Planner",
    description:
      "Free debt elimination planner with Debt Avalanche and Snowball options, payment rollover compounding, and custom multi-account schedules.",
    url: "https://www.holycalculator.com/debt-payoff-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Debt Payoff Calculator | Holy Calculator",
    description:
      "Plan the fastest path to becoming debt-free across credit cards, auto loans, and personal loans.",
  },
};

export default function DebtPayoffCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Finance", href: "/#finance" },
    { label: "Debt Payoff Calculator", active: true },
  ];

  // FAQPage JSON-LD schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: DEBT_PAYOFF_FAQS.map((faq) => ({
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
    name: "Holy Calculator — Debt Payoff Calculator",
    url: "https://www.holycalculator.com/debt-payoff-calculator",
    applicationCategory: "FinancialApplication",
    operatingSystem: "All",
    description:
      "Calculate total payoff timelines, interest savings, and account sequencing using Debt Avalanche and Debt Snowball methods.",
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
    name: "How to Build a Multi-Debt Payoff Plan",
    description:
      "Step-by-step guide to consolidating all debt balances into a structured snowball or avalanche payoff plan.",
    step: [
      {
        "@type": "HowToStep",
        name: "Enter extra monthly payment budget",
        text: "Input any extra monthly money available above your mandatory minimum payments.",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Add all debt accounts",
        text: "Input balance, minimum monthly payment, and interest rate (APR) for credit cards, auto loans, student loans, or personal loans.",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "Choose repayment strategy",
        text: "Select Avalanche (highest APR first to minimize interest) or Snowball (lowest balance first to maximize momentum).",
        position: 3,
      },
      {
        "@type": "HowToStep",
        name: "Track debt-free timeline & savings",
        text: "Follow the month-by-month rollover schedule to see when each debt is eliminated.",
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
        <h1>Debt Payoff Calculator</h1>
        <p className="lead">
          Calculate the fastest and most cost-effective plan to become 100% debt-free across all loans and credit cards.
          Compare Debt Avalanche (highest APR first) versus Debt Snowball (lowest balance first) with automatic payment rollovers.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <DebtPayoffCalculatorIsland />

        {/* Desktop Sidebar */}
        <aside className="calc-sidebar">
          <SidebarAd />

          <div className="sidebar-box">
            <h4>Related Debt Tools</h4>
            <ul className="sidebar-links-list">
              <li>
                <Link href="/credit-card-payoff-calculator">
                  <span>Credit Card Payoff</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/personal-loan-calculator">
                  <span>Personal Loan</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/student-loan-calculator">
                  <span>Student Loan</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="sidebar-box">
            <h4>Payoff Acceleration</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Rollover Acceleration</strong><br />
                  As each debt is eliminated, roll its former payment into the next priority target.
                </span>
              </li>
              <li>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Avalanche vs Snowball</strong><br />
                  Avalanche saves more money in interest; Snowball gives fast psychological wins.
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <AdBanner />

      {/* SEO Reference Content */}
      <DebtPayoffReferenceContent />

      <Footer />
    </main>
  );
}
