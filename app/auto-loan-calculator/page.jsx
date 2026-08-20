import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import AutoLoanCalculatorIsland from "@/components/AutoLoanCalculatorIsland";
import AutoLoanReferenceContent from "@/components/AutoLoanReferenceContent";
import { AUTO_LOAN_FAQS } from "@/lib/data/autoLoanFaqs";
import Link from "next/link";

export const metadata = {
  title: "Auto Loan Calculator – Monthly Car Payment, Tax & Amortization | Holy Calculator",
  description:
    "Calculate monthly car payments, total interest, state sales tax, trade-in allowances, dealer fees, and full amortization schedules.",
  alternates: {
    canonical: "https://www.holycalculator.com/auto-loan-calculator",
  },
  openGraph: {
    title: "Auto Loan Calculator – Monthly Car Payment, Tax & Amortization",
    description:
      "Free car payment calculator with down payment toggles, trade-in tax deductions, state sales tax calculations, and 24-to-84 month amortization schedules.",
    url: "https://www.holycalculator.com/auto-loan-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Auto Loan Calculator – Monthly Car Payment, Tax & Amortization | Holy Calculator",
    description:
      "Calculate monthly car payments, total interest, state sales tax, trade-in allowances, dealer fees, and full amortization schedules.",
  },
};

export default function AutoLoanCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Finance", href: "/#finance" },
    { label: "Auto Loan Calculator", active: true },
  ];

  // FAQPage JSON-LD schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: AUTO_LOAN_FAQS.map((faq) => ({
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
    name: "Holy Calculator — Auto Loan Calculator",
    url: "https://www.holycalculator.com/auto-loan-calculator",
    applicationCategory: "FinancialApplication",
    operatingSystem: "All",
    description:
      "Calculate total monthly car financing costs, trade-in tax savings, dealer fees, total loan interest, and full monthly amortization schedules.",
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
    name: "How to Calculate Your Monthly Auto Loan Payment",
    description:
      "Step-by-step guide to estimating total monthly vehicle financing costs including principal, interest, state sales tax, and trade-in allowances.",
    step: [
      {
        "@type": "HowToStep",
        name: "Enter vehicle purchase price & trade-in value",
        text: "Input target car price and trade-in allowance value.",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Add down payment and select loan term",
        text: "Specify down payment in dollars or percentage and select loan duration (24 to 84 months).",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "Enter interest rate (APR) and state sales tax",
        text: "Input your expected APR interest rate and local state sales tax percentage.",
        position: 3,
      },
      {
        "@type": "HowToStep",
        name: "Review monthly payment and amortization schedule",
        text: "Instantly view monthly car payment, total interest, sales tax, and full loan schedule.",
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
        <h1>Auto Loan Calculator</h1>
        <p className="lead">
          Estimate your monthly car loan payment, total interest, state sales tax, trade-in credit allowance, and dealer fees.
          Supports 24 to 84-month loan terms with full yearly and monthly amortization schedules.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <AutoLoanCalculatorIsland />

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
            </ul>
          </div>

          {/* Quick Auto Benchmarks */}
          <div className="sidebar-box">
            <h4>Auto Loan Benchmarks</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>20/4/10 Rule</strong><br />
                  20% down, 4-year max loan term, 10% gross income cap for total auto costs
                </span>
              </li>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Trade-in Tax Credit</strong><br />
                  Trade-in allowances reduce taxable vehicle price in most US states
                </span>
              </li>
              <li>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>60-Month Standard</strong><br />
                  5-year loan term offers balance between monthly payment and interest cost
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Below-calculator ad banner */}
      <AdBanner />

      {/* Financial Notice Disclaimer */}
      <div className="calc-layout" style={{ marginTop: "24px" }}>
        <div style={{ background: "var(--paper-raised)", border: "1px solid var(--line)", borderLeft: "4px solid var(--gold)", padding: "16px 20px", borderRadius: "8px", fontSize: "13px", color: "var(--ink-60)" }}>
          <strong style={{ color: "var(--ink)" }}>Financial Notice:</strong> Information on holycalculator.com is intended for general educational purposes and is not individualized financial advice or credit decisioning. Loan calculations use standard fixed-rate amortization formulas. Always consult a licensed auto loan lender, dealer, or financial advisor regarding specific financing terms.
        </div>
      </div>

      {/* SEO Reference Content */}
      <AutoLoanReferenceContent />

      <Footer />
    </main>
  );
}
