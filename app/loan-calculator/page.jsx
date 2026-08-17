import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import LoanCalculatorIsland from "@/components/LoanCalculatorIsland";
import LoanReferenceContent from "@/components/LoanReferenceContent";
import { LOAN_FAQS } from "@/lib/data/loanFaqs";
import Link from "next/link";

export const metadata = {
  title: "Loan Calculator – Amortized Loans, Deferred Payments & Bonds | Holy Calculator",
  description:
    "Calculate monthly loan payments, total interest, deferred lump sums, and bond present values with custom compounding and payback frequencies.",
  keywords: [
    "loan calculator",
    "amortized loan calculator",
    "deferred payment calculator",
    "bond present value calculator",
    "loan payment schedule",
    "effective annual rate calculator",
    "compound interest loan",
  ],
  alternates: {
    canonical: "https://holycalculator.com/loan-calculator",
  },
  openGraph: {
    title: "Loan Calculator – Amortized Loans, Deferred Payments & Bonds",
    description:
      "Calculate periodic loan payments, total interest, maturity lump sums, and bond present values across 3 calculation modes.",
    url: "https://holycalculator.com/loan-calculator",
    type: "website",
    siteName: "Holy Calculator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Loan Calculator – Amortized Loans, Deferred Payments & Bonds",
    description:
      "Calculate loan payments, total interest, and amortization schedules across 3 calculation modes.",
  },
};

export default function LoanCalculatorPage() {
  const breadcrumbItems = [
    { label: "Finance", href: "/#finance" },
    { label: "Loan Calculator" },
  ];

  // FAQ Schema Markup (JSON-LD)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: LOAN_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  // WebApplication Schema Markup
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Loan Calculator",
    url: "https://holycalculator.com/loan-calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Interactive 3-mode generic loan calculator supporting amortized periodic payments, deferred payment lump sums, and bond present value math.",
  };

  // HowTo Schema Markup
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Calculate Loan Payments and Interest",
    description:
      "Step-by-step method to calculate amortized loan payments, deferred lump sums, or bond present values using effective compounding rates.",
    step: [
      {
        "@type": "HowToStep",
        name: "Select Your Calculation Mode",
        text: "Choose from 3 calculation modes: Amortized Loan (fixed periodic payments), Deferred Payment Loan (lump sum at maturity), or Bond (Present Value from face value).",
      },
      {
        "@type": "HowToStep",
        name: "Input Loan Amount & Term",
        text: "Enter the principal loan amount or maturity face value, along with the loan duration in years or months.",
      },
      {
        "@type": "HowToStep",
        name: "Set Rate & Frequencies",
        text: "Specify the nominal annual interest rate, compounding frequency (e.g. monthly, daily, continuous), and payback frequency.",
      },
      {
        "@type": "HowToStep",
        name: "Review Payment & Amortization Schedule",
        text: "Analyze the periodic payment amount, total interest paid, principal vs interest donut breakdown, and expandable payment schedule.",
      },
    ],
  };

  return (
    <div className="calc-page-wrapper">
      {/* Schema Injection */}
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

      {/* Main Page Header */}
      <header className="calc-page-header">
        <h1>Loan Calculator</h1>
        <p className="lead">
          Calculate periodic loan payments, total interest expenses, deferred maturity amounts, and bond present values across 3 calculation modes supporting custom compounding and payback frequencies.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <LoanCalculatorIsland />

        {/* Desktop Sidebar */}
        <aside className="calc-sidebar">
          {/* Vertical Ad Space */}
          <SidebarAd />

          {/* Related Financial Tools */}
          <div className="sidebar-box">
            <h4>Financial Calculators</h4>
            <ul className="sidebar-links-list">
              <li>
                <Link href="/loan-calculator">
                  <span>Loan Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/mortgage-calculator">
                  <span>Mortgage Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/retirement-calculator">
                  <span>Retirement Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/#finance">
                  <span>Auto Loan Calculator</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Loan Benchmarks */}
          <div className="sidebar-box">
            <h4>Loan Benchmarks</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>APR vs. APY</strong><br />
                  APY includes intra-year compounding, making it higher than nominal APR
                </span>
              </li>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Amortization Front-Loading</strong><br />
                  Early payments consist primarily of interest rather than principal
                </span>
              </li>
              <li>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>The 5 Cs of Credit</strong><br />
                  Character, Capacity, Capital, Collateral, and Conditions
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Below-calculator ad banner */}
      <AdBanner />

      {/* SEO Reference Content */}
      <div className="calc-container">
        <LoanReferenceContent />
      </div>

      <Footer />
    </div>
  );
}
