import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import StudentLoanCalculatorIsland from "@/components/StudentLoanCalculatorIsland";
import StudentLoanReferenceContent from "@/components/StudentLoanReferenceContent";
import { STUDENT_LOAN_FAQS } from "@/lib/data/studentLoanFaqs";
import Link from "next/link";

export const metadata = {
  title: "Student Loan Calculator – Monthly Payment, Interest & Early Payoff | Holy Calculator",
  description:
    "Calculate monthly student loan payments, total interest costs, and prepayment savings. Compare 10-year standard and graduated repayment plans.",
  alternates: {
    canonical: "https://www.holycalculator.com/student-loan-calculator",
  },
  openGraph: {
    title: "Student Loan Calculator – Monthly Payment, Interest & Early Payoff",
    description:
      "Free student loan calculator with term selection, extra prepayment options, graduated plan estimates, and complete amortization schedules.",
    url: "https://www.holycalculator.com/student-loan-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Loan Calculator | Holy Calculator",
    description:
      "Calculate monthly student loan payments, interest costs, and prepayment savings.",
  },
};

export default function StudentLoanCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Finance", href: "/#finance" },
    { label: "Student Loan Calculator", active: true },
  ];

  // FAQPage JSON-LD schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: STUDENT_LOAN_FAQS.map((faq) => ({
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
    name: "Holy Calculator — Student Loan Calculator",
    url: "https://www.holycalculator.com/student-loan-calculator",
    applicationCategory: "FinancialApplication",
    operatingSystem: "All",
    description:
      "Estimate monthly student loan repayments, total financing costs, and interest savings from extra monthly principal payments.",
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
    name: "How to Calculate Student Loan Repayments",
    description:
      "Step-by-step instructions for calculating federal and private student loan installments and interest savings.",
    step: [
      {
        "@type": "HowToStep",
        name: "Enter total student loan balance",
        text: "Input the combined principal balance across your student loans.",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Choose repayment term & interest rate",
        text: "Select a 10, 15, 20, or 25-year repayment plan and input your average annual interest rate (APR).",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "Test optional extra monthly payments",
        text: "Add an extra monthly principal contribution to see how many years and dollars you save.",
        position: 3,
      },
      {
        "@type": "HowToStep",
        name: "Review amortization schedule",
        text: "Inspect the month-by-month table showing how interest accruals decline over time.",
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
        <h1>Student Loan Calculator</h1>
        <p className="lead">
          Calculate your monthly student loan payments and total borrowing costs across 10, 15, 20, and 25-year repayment terms.
          See how extra monthly principal payments accelerate your path to becoming debt-free.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <StudentLoanCalculatorIsland />

        {/* Desktop Sidebar */}
        <aside className="calc-sidebar">
          <SidebarAd />

          <div className="sidebar-box">
            <h4>Related Debt Tools</h4>
            <ul className="sidebar-links-list">
              <li>
                <Link href="/debt-payoff-calculator">
                  <span>Debt Payoff Planner</span>
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
                <Link href="/payment-calculator">
                  <span>Payment Calculator</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="sidebar-box">
            <h4>Student Loan Facts</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>$2,500 Tax Deduction</strong><br />
                  Eligible filers can deduct up to $2,500 in student loan interest paid annually.
                </span>
              </li>
              <li>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>No Prepayment Penalties</strong><br />
                  Federal and private student loans in the US cannot charge early payoff fees.
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <AdBanner />

      {/* SEO Reference Content */}
      <StudentLoanReferenceContent />

      <Footer />
    </main>
  );
}
