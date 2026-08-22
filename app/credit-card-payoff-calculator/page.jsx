import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import CreditCardPayoffCalculatorIsland from "@/components/CreditCardPayoffCalculatorIsland";
import CreditCardPayoffReferenceContent from "@/components/CreditCardPayoffReferenceContent";
import { CREDIT_CARD_PAYOFF_FAQS } from "@/lib/data/creditCardPayoffFaqs";
import Link from "next/link";

export const metadata = {
  title: "Credit Card Payoff Calculator – Avalanche vs Snowball Strategy | Holy Calculator",
  description:
    "Plan the payoff of multiple credit cards using Debt Avalanche or Debt Snowball methods. Calculate interest savings, rollover payments, and your debt-free milestone.",
  alternates: {
    canonical: "https://www.holycalculator.com/credit-card-payoff-calculator",
  },
  openGraph: {
    title: "Credit Card Payoff Calculator – Avalanche vs Snowball Strategy",
    description:
      "Free multi-credit card payoff calculator. Compare Debt Avalanche and Debt Snowball strategies with payment rollovers and full timeline schedules.",
    url: "https://www.holycalculator.com/credit-card-payoff-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Credit Card Payoff Calculator | Holy Calculator",
    description:
      "Plan the payoff of multiple credit cards using Avalanche or Snowball methods.",
  },
};

export default function CreditCardPayoffCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Finance", href: "/#finance" },
    { label: "Credit Card Payoff Calculator", active: true },
  ];

  // FAQPage JSON-LD schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: CREDIT_CARD_PAYOFF_FAQS.map((faq) => ({
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
    name: "Holy Calculator — Credit Card Payoff Calculator",
    url: "https://www.holycalculator.com/credit-card-payoff-calculator",
    applicationCategory: "FinancialApplication",
    operatingSystem: "All",
    description:
      "Create a cost-efficient payback schedule for multiple credit cards using Debt Avalanche and Debt Snowball payoff strategies.",
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
    name: "How to Pay Off Multiple Credit Cards",
    description:
      "Step-by-step guide to organizing multiple credit cards and building a rollover payoff strategy.",
    step: [
      {
        "@type": "HowToStep",
        name: "Enter your total monthly credit card budget",
        text: "Specify the total monthly dollar amount you can dedicate across all credit cards.",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Add each credit card details",
        text: "Input balance, minimum monthly payment, and interest rate (APR) for each card.",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "Choose Avalanche or Snowball strategy",
        text: "Select Avalanche to minimize interest (highest APR first) or Snowball to maximize momentum (lowest balance first).",
        position: 3,
      },
      {
        "@type": "HowToStep",
        name: "Review payoff timeline & milestones",
        text: "Follow the generated month-by-month rollover schedule to debt freedom.",
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
        <h1>Credit Card Payoff Calculator</h1>
        <p className="lead">
          Calculate the fastest, most cost-effective path to paying off multiple credit cards.
          Compare the Debt Avalanche (highest APR first) and Debt Snowball (lowest balance first) methods with automatic payment rollovers.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <CreditCardPayoffCalculatorIsland />

        {/* Desktop Sidebar */}
        <aside className="calc-sidebar">
          <SidebarAd />

          <div className="sidebar-box">
            <h4>Related Debt Tools</h4>
            <ul className="sidebar-links-list">
              <li>
                <Link href="/credit-card-calculator">
                  <span>Single Card Calculator</span>
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
            <h4>Rollover Rules</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Never Drop Your Budget</strong><br />
                  Keep your total monthly payment amount constant as cards are paid off to maintain rollover acceleration.
                </span>
              </li>
              <li>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Target One Card at a Time</strong><br />
                  Pay minimums on everything except the priority target card to maximize compounding velocity.
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <AdBanner />

      {/* SEO Reference Content */}
      <CreditCardPayoffReferenceContent />

      <Footer />
    </main>
  );
}
