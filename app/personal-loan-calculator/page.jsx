import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import PersonalLoanCalculatorIsland from "@/components/PersonalLoanCalculatorIsland";
import PersonalLoanReferenceContent from "@/components/PersonalLoanReferenceContent";
import { PERSONAL_LOAN_FAQS } from "@/lib/data/personalLoanFaqs";
import Link from "next/link";

export const metadata = {
  title: "Personal Loan Calculator – Monthly Payment, Origination Fee & APR | Holy Calculator",
  description:
    "Calculate monthly personal loan payments, true effective APR, origination fee deductions, and total financing interest costs with full amortization schedules.",
  alternates: {
    canonical: "https://www.holycalculator.com/personal-loan-calculator",
  },
  openGraph: {
    title: "Personal Loan Calculator – Monthly Payment, Origination Fee & APR",
    description:
      "Free personal loan payment calculator with origination fee deductions, effective APR solver, and complete month-by-month repayment schedules.",
    url: "https://www.holycalculator.com/personal-loan-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Personal Loan Calculator | Holy Calculator",
    description:
      "Calculate monthly personal loan payments, true effective APR, and origination fee deductions.",
  },
};

export default function PersonalLoanCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Finance", href: "/#finance" },
    { label: "Personal Loan Calculator", active: true },
  ];

  // FAQPage JSON-LD schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PERSONAL_LOAN_FAQS.map((faq) => ({
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
    name: "Holy Calculator — Personal Loan Calculator",
    url: "https://www.holycalculator.com/personal-loan-calculator",
    applicationCategory: "FinancialApplication",
    operatingSystem: "All",
    description:
      "Calculate monthly installments, total interest charges, net cash disbursements, and true effective APR for unsecured personal loans.",
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
    name: "How to Calculate Personal Loan Payments and APR",
    description:
      "Step-by-step instructions for calculating personal loan payments and all-in financing costs.",
    step: [
      {
        "@type": "HowToStep",
        name: "Enter loan amount and term",
        text: "Input target borrowing amount and repayment duration in years.",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Enter stated interest rate (APR)",
        text: "Input the lender's nominal annual interest rate.",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "Add origination fees or insurance",
        text: "Optionally specify percentage or dollar origination fees deducted from disbursement.",
        position: 3,
      },
      {
        "@type": "HowToStep",
        name: "Review net payout and effective APR",
        text: "Instantly see monthly installments, net cash received, and true effective APR.",
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
        <h1>Personal Loan Calculator</h1>
        <p className="lead">
          Calculate your monthly personal loan payments and total borrowing costs.
          Factor in upfront origination fee deductions and solve for your true Effective APR.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <PersonalLoanCalculatorIsland />

        {/* Desktop Sidebar */}
        <aside className="calc-sidebar">
          <SidebarAd />

          <div className="sidebar-box">
            <h4>Related Borrowing Tools</h4>
            <ul className="sidebar-links-list">
              <li>
                <Link href="/loan-calculator">
                  <span>Loan Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/debt-payoff-calculator">
                  <span>Debt Payoff Planner</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/credit-card-calculator">
                  <span>Credit Card Calculator</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="sidebar-box">
            <h4>Personal Loan Insights</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Origination Deduction</strong><br />
                  Most online lenders deduct origination fees (1%–8%) directly from your bank payout.
                </span>
              </li>
              <li>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Fixed vs Revolving</strong><br />
                  Personal loans have fixed payments and end dates, unlike open-ended credit cards.
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <AdBanner />

      {/* SEO Reference Content */}
      <PersonalLoanReferenceContent />

      <Footer />
    </main>
  );
}
