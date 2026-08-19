import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import BudgetCalculatorIsland from "@/components/BudgetCalculatorIsland";
import BudgetReferenceContent from "@/components/BudgetReferenceContent";
import { BUDGET_FAQS } from "@/lib/data/budgetFaqs";
import Link from "next/link";

export const metadata = {
  title: "Budget Calculator – Plan Your Income, Expenses & DTI Ratio | Holy Calculator",
  description:
    "Plan your personal budget, track 9 expense categories across 30+ line items, calculate your DTI ratio, and compare spending against financial benchmarks.",
  keywords: [
    "budget calculator",
    "personal budget planner",
    "monthly expense breakdown",
    "debt to income ratio calculator",
    "50 30 20 budget calculator",
    "household budget calculator",
    "living expenses calculator",
  ],
  alternates: {
    canonical: "https://www.holycalculator.com/budget-calculator",
  },
  openGraph: {
    title: "Budget Calculator – Plan Your Income, Expenses & DTI Ratio",
    description:
      "Plan your monthly budget, track 9 expense categories across 30+ line items, calculate DTI ratio, and analyze net cash flow.",
    url: "https://www.holycalculator.com/budget-calculator",
    type: "website",
    siteName: "Holy Calculator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Budget Calculator – Plan Your Income, Expenses & DTI Ratio",
    description:
      "Plan your personal budget, track expenses across 9 categories, and calculate your debt-to-income ratio.",
  },
};

export default function BudgetCalculatorPage() {
  const breadcrumbItems = [
    { label: "Finance", href: "/#finance" },
    { label: "Budget Calculator" },
  ];

  // FAQ Schema Markup (JSON-LD)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: BUDGET_FAQS.map((faq) => ({
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
    name: "Budget Calculator",
    url: "https://www.holycalculator.com/budget-calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Interactive personal budget calculator estimating gross income, net cash flow, DTI ratio, and category spending benchmarks across 30+ line items.",
  };

  // HowTo Schema Markup
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Build a Personal Budget and Calculate Net Cash Flow",
    description:
      "Step-by-step method to organize monthly income, estimate taxes, categorize spending, and evaluate financial rule-of-thumb benchmarks.",
    step: [
      {
        "@type": "HowToStep",
        name: "Input Income & Tax Rate",
        text: "Enter your pre-tax income sources (salary, pension, investments) and combined tax rate estimate.",
      },
      {
        "@type": "HowToStep",
        name: "Fill In Collapsible Expense Categories",
        text: "Expand relevant categories (Housing, Transportation, Living, Debt, Healthcare, Savings) and enter monthly or annual line items.",
      },
      {
        "@type": "HowToStep",
        name: "Review Net Surplus & DTI Ratio",
        text: "Analyze your net monthly surplus/deficit, Debt-to-Income (DTI) ratio, and category spending donut chart.",
      },
      {
        "@type": "HowToStep",
        name: "Compare Against Financial Benchmarks",
        text: "Check your spending percentages against standard heuristics (30% Housing, 15% Transportation, 15% Savings).",
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
        <h1>Budget Calculator</h1>
        <p className="lead">
          Plan your monthly cash flow, track income and expenses across 9 categories with 30+ line items, calculate your Debt-to-Income (DTI) ratio, and compare your spending against financial rules of thumb.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <BudgetCalculatorIsland />

        {/* Desktop Sidebar */}
        <aside className="calc-sidebar">
          {/* Vertical Ad Space */}
          <SidebarAd />

          {/* Related Financial Tools */}
          <div className="sidebar-box">
            <h4>Financial Calculators</h4>
            <ul className="sidebar-links-list">
              <li>
                <Link href="/budget-calculator">
                  <span>Budget Calculator</span>
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
                <Link href="/loan-calculator">
                  <span>Loan Calculator</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Budgeting Benchmarks */}
          <div className="sidebar-box">
            <h4>Budgeting Benchmarks</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>50/30/20 Rule</strong><br />
                  50% Needs, 30% Wants, 20% Savings &amp; Debt Payoff
                </span>
              </li>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>30% Housing Cap</strong><br />
                  Recommended max percentage of income for housing
                </span>
              </li>
              <li>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>36% Max DTI Ratio</strong><br />
                  Standard recommended upper ceiling for total monthly debt payments
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
        <BudgetReferenceContent />
      </div>

      <Footer />
    </div>
  );
}
