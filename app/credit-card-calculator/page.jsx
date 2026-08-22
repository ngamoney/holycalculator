import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import CreditCardCalculatorIsland from "@/components/CreditCardCalculatorIsland";
import CreditCardReferenceContent from "@/components/CreditCardReferenceContent";
import { CREDIT_CARD_FAQS } from "@/lib/data/creditCardFaqs";
import Link from "next/link";

export const metadata = {
  title: "Credit Card Calculator – Payoff Timeline & Minimum Payment Trap | Holy Calculator",
  description:
    "Calculate your credit card payoff timeline, total interest charges, and required monthly payments. Compare against the minimum payment trap and save thousands.",
  alternates: {
    canonical: "https://www.holycalculator.com/credit-card-calculator",
  },
  openGraph: {
    title: "Credit Card Calculator – Payoff Timeline & Minimum Payment Trap",
    description:
      "Free credit card calculator with fixed payment vs. target timeframe modes, minimum payment trap comparison, and full month-by-month debt reduction schedules.",
    url: "https://www.holycalculator.com/credit-card-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Credit Card Calculator – Payoff Timeline | Holy Calculator",
    description:
      "Calculate your credit card payoff timeline, interest cost, and compare against minimum payment traps.",
  },
};

export default function CreditCardCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Finance", href: "/#finance" },
    { label: "Credit Card Calculator", active: true },
  ];

  // FAQPage JSON-LD schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: CREDIT_CARD_FAQS.map((faq) => ({
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
    name: "Holy Calculator — Credit Card Calculator",
    url: "https://www.holycalculator.com/credit-card-calculator",
    applicationCategory: "FinancialApplication",
    operatingSystem: "All",
    description:
      "Calculate credit card payoff timelines, interest charges, and required monthly payments with minimum payment trap comparisons.",
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
    name: "How to Calculate Credit Card Payoff",
    description:
      "Step-by-step instructions for calculating credit card debt payoff timelines and total interest costs.",
    step: [
      {
        "@type": "HowToStep",
        name: "Enter credit card balance and interest rate (APR)",
        text: "Input outstanding card balance and current annual percentage rate.",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Select payoff strategy",
        text: "Choose Fixed Monthly Payment to find time until debt-free, or Target Payoff Timeline to find required monthly payments.",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "Review payoff results & interest savings",
        text: "Instantly see how much money and time you save compared to paying only the credit card minimum.",
        position: 3,
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
        <h1>Credit Card Calculator</h1>
        <p className="lead">
          Calculate how quickly you can pay off your credit card balance or determine the exact monthly payment needed to become debt-free by a target date.
          See the true cost of interest and escape the minimum payment trap.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <CreditCardCalculatorIsland />

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
            </ul>
          </div>

          <div className="sidebar-box">
            <h4>Credit Card Tips</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Avoid Minimums</strong><br />
                  Paying only minimums stretches debt for decades and maximizes bank interest charges.
                </span>
              </li>
              <li>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Credit Utilization</strong><br />
                  Keeping card balances under 30% of your credit limit protects your credit score.
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <AdBanner />

      {/* SEO Reference Content */}
      <CreditCardReferenceContent />

      <Footer />
    </main>
  );
}
