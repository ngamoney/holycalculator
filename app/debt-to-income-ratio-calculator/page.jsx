import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import DebtRatioCalculatorIsland from "@/components/DebtRatioCalculatorIsland";
import DebtRatioReferenceContent from "@/components/DebtRatioReferenceContent";
import { DEBT_RATIO_FAQS } from "@/lib/data/debtRatioFaqs";
import Link from "next/link";

export const metadata = {
  title: "Debt-to-Income (DTI) Ratio Calculator – Front-End & Back-End Ratios | Holy Calculator",
  description:
    "Calculate your Front-End and Back-End Debt-to-Income (DTI) ratios for mortgage and loan underwriting. Check 28/36 rule approval benchmarks and borrowing limits.",
  alternates: {
    canonical: "https://www.holycalculator.com/debt-to-income-ratio-calculator",
  },
  openGraph: {
    title: "Debt-to-Income (DTI) Ratio Calculator – Front-End & Back-End Ratios",
    description:
      "Free DTI calculator for home buyers and borrowers. Calculate housing ratios, total debt obligations, and mortgage qualification benchmarks.",
    url: "https://www.holycalculator.com/debt-to-income-ratio-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Debt-to-Income (DTI) Ratio Calculator | Holy Calculator",
    description:
      "Calculate your Front-End and Back-End DTI ratios for mortgage qualification.",
  },
};

export default function DebtRatioCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Finance", href: "/#finance" },
    { label: "Debt-to-Income Ratio Calculator", active: true },
  ];

  // FAQPage JSON-LD schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: DEBT_RATIO_FAQS.map((faq) => ({
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
    name: "Holy Calculator — Debt-to-Income (DTI) Ratio Calculator",
    url: "https://www.holycalculator.com/debt-to-income-ratio-calculator",
    applicationCategory: "FinancialApplication",
    operatingSystem: "All",
    description:
      "Calculate your Front-End and Back-End Debt-to-Income ratios and evaluate conventional, FHA, and VA mortgage underwriting eligibility.",
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
    name: "How to Calculate Your Debt-to-Income Ratio",
    description:
      "Step-by-step instructions for calculating front-end and back-end DTI ratios for loan approval.",
    step: [
      {
        "@type": "HowToStep",
        name: "Enter gross income",
        text: "Input annual pre-tax salary and any other recurring monthly income.",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Enter monthly housing costs",
        text: "Add rent or estimated mortgage payment including property taxes, homeowners insurance, and HOA dues.",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "Add recurring debt payments",
        text: "Input auto loans, student debt, credit card minimums, and personal loans.",
        position: 3,
      },
      {
        "@type": "HowToStep",
        name: "Review DTI ratio benchmarks",
        text: "Compare your front-end and back-end percentages against the 28/36 underwriting standard.",
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
        <h1>Debt-to-Income (DTI) Ratio Calculator</h1>
        <p className="lead">
          Calculate your Front-End (housing) and Back-End (total debt) DTI ratios to determine your borrowing capacity.
          Evaluate your numbers against standard Conventional, FHA, and VA mortgage underwriting benchmarks.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <DebtRatioCalculatorIsland />

        {/* Desktop Sidebar */}
        <aside className="calc-sidebar">
          <SidebarAd />

          <div className="sidebar-box">
            <h4>Related Mortgage Tools</h4>
            <ul className="sidebar-links-list">
              <li>
                <Link href="/mortgage-calculator">
                  <span>Mortgage Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/house-affordability-calculator">
                  <span>House Affordability</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/debt-payoff-calculator">
                  <span>Debt Payoff Planner</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="sidebar-box">
            <h4>DTI Underwriting Benchmarks</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Front-End Limit: 28%</strong><br />
                  Total monthly housing expenses should ideally stay at or below 28% of gross income.
                </span>
              </li>
              <li>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Back-End Limit: 36%–43%</strong><br />
                  All monthly debts combined should not exceed 36% for prime or 43% for qualified mortgages.
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <AdBanner />

      {/* SEO Reference Content */}
      <DebtRatioReferenceContent />

      <Footer />
    </main>
  );
}
