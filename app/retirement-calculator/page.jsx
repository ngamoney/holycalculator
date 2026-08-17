import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import RetirementCalculatorIsland from "@/components/RetirementCalculatorIsland";
import RetirementReferenceContent from "@/components/RetirementReferenceContent";
import { RETIREMENT_FAQS } from "@/lib/data/retirementFaqs";
import Link from "next/link";

export const metadata = {
  title: "Retirement Calculator – How Much Do You Need to Retire? | Holy Calculator",
  description:
    "Calculate how much money you need to retire, required monthly savings, sustainable withdrawals, and drawdown timelines with 4 interactive calculation modes.",
  keywords: [
    "retirement calculator",
    "how much do I need to retire",
    "retirement savings calculator",
    "4 percent rule calculator",
    "retirement drawdown calculator",
    "nest egg calculator",
    "social security retirement",
  ],
  alternates: {
    canonical: "https://holycalculator.com/retirement-calculator",
  },
  openGraph: {
    title: "Retirement Calculator – How Much Do You Need to Retire?",
    description:
      "Estimate your retirement nest egg, monthly savings plan, sustainable withdrawals, and drawdown duration with 4 interactive modes.",
    url: "https://holycalculator.com/retirement-calculator",
    type: "website",
    siteName: "Holy Calculator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Retirement Calculator – How Much Do You Need to Retire?",
    description:
      "Calculate your retirement nest egg, required monthly savings, and withdrawal timeline with 4 interactive calculation modes.",
  },
};

export default function RetirementCalculatorPage() {
  const breadcrumbItems = [
    { label: "Finance", href: "/#finance" },
    { label: "Retirement Calculator" },
  ];

  // FAQ Schema Markup (JSON-LD)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: RETIREMENT_FAQS.map((faq) => ({
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
    name: "Retirement Calculator",
    url: "https://holycalculator.com/retirement-calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Interactive 4-mode retirement calculator estimating target nest egg needed, required monthly savings, sustainable withdrawals, and drawdown duration.",
  };

  // HowTo Schema Markup
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Calculate Your Retirement Savings Needs",
    description:
      "Step-by-step method to calculate your retirement nest egg target and evaluate whether your current savings plan is on track.",
    step: [
      {
        "@type": "HowToStep",
        name: "Select Your Calculation Mode",
        text: "Choose from 4 calculation modes: Target Nest Egg Needs, Savings Plan Mode, Sustainable Withdrawal Mode, or Drawdown Duration.",
      },
      {
        "@type": "HowToStep",
        name: "Enter Your Age & Expected Timeline",
        text: "Input your current age, target retirement age, and estimated life expectancy.",
      },
      {
        "@type": "HowToStep",
        name: "Input Income & Investment Return Assumptions",
        text: "Specify your current income, desired retirement income percentage (e.g. 80%), and investment return before and during retirement.",
      },
      {
        "@type": "HowToStep",
        name: "Review On-Track Status & Gap Analysis",
        text: "Analyze your projected nest egg trajectory, shortfall or surplus gap, and required additional monthly contributions.",
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
        <h1>Retirement Calculator</h1>
        <p className="lead">
          Calculate how much money you need to retire, evaluate your savings plan, determine sustainable monthly withdrawals, and estimate how long your nest egg will last across 4 interactive calculation modes.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <RetirementCalculatorIsland />

        {/* Desktop Sidebar */}
        <aside className="calc-sidebar">
          {/* Vertical Ad Space */}
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
                <Link href="/retirement-calculator">
                  <span>Retirement Calculator</span>
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

          {/* Quick Retirement Benchmarks */}
          <div className="sidebar-box">
            <h4>Retirement Benchmarks</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>10%–15% Savings Rule</strong><br />
                  Recommended annual savings rate of gross income starting in 20s/30s
                </span>
              </li>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>80% Income Replacement</strong><br />
                  Estimated annual retirement income needed vs. working salary
                </span>
              </li>
              <li>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>4% Safe Withdrawal Rule</strong><br />
                  Trinity Study benchmark for 30-year retirement portfolio survival
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
        <RetirementReferenceContent />
      </div>

      <Footer />
    </div>
  );
}
