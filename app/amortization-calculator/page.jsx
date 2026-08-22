import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import AmortizationCalculatorIsland from "@/components/AmortizationCalculatorIsland";
import AmortizationReferenceContent from "@/components/AmortizationReferenceContent";
import { AMORTIZATION_FAQS } from "@/lib/data/amortizationFaqs";
import Link from "next/link";

export const metadata = {
  title: "Amortization Calculator – Full Loan Payment Schedule & Extra Prepayments | Holy Calculator",
  description:
    "Generate complete monthly and annual loan amortization schedules. Calculate principal and interest breakdowns, extra prepayments, and lifetime interest savings.",
  alternates: {
    canonical: "https://www.holycalculator.com/amortization-calculator",
  },
  openGraph: {
    title: "Amortization Calculator – Full Loan Payment Schedule & Extra Prepayments",
    description:
      "Free loan amortization calculator with extra monthly and annual payment options, payoff timeline acceleration, and full printable schedules.",
    url: "https://www.holycalculator.com/amortization-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Amortization Calculator – Full Loan Payment Schedule | Holy Calculator",
    description:
      "Generate complete monthly and annual loan amortization schedules with extra prepayment savings.",
  },
};

export default function AmortizationCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Finance", href: "/#finance" },
    { label: "Amortization Calculator", active: true },
  ];

  // FAQPage JSON-LD schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: AMORTIZATION_FAQS.map((faq) => ({
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
    name: "Holy Calculator — Amortization Calculator",
    url: "https://www.holycalculator.com/amortization-calculator",
    applicationCategory: "FinancialApplication",
    operatingSystem: "All",
    description:
      "Generate complete monthly and annual loan amortization schedules with extra monthly and lump-sum prepayment savings.",
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
    name: "How to Generate a Loan Amortization Schedule",
    description:
      "Step-by-step instructions for calculating fixed loan payments and building a full amortization schedule with extra payments.",
    step: [
      {
        "@type": "HowToStep",
        name: "Enter loan amount and term",
        text: "Input original loan balance and duration in years and months.",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Enter interest rate",
        text: "Specify fixed annual percentage rate (APR) for the borrowing term.",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "Add optional extra payments",
        text: "Optionally test extra monthly, yearly, or one-time principal prepayments.",
        position: 3,
      },
      {
        "@type": "HowToStep",
        name: "Review amortization schedule",
        text: "Inspect annual or monthly breakdown tables showing principal, interest, and declining loan balances.",
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
        <h1>Amortization Calculator</h1>
        <p className="lead">
          Calculate monthly loan payments and generate comprehensive annual and monthly amortization schedules.
          Test how extra monthly, annual, or one-time principal payments accelerate your debt payoff date and slash lifetime interest costs.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <AmortizationCalculatorIsland />

        {/* Desktop Sidebar */}
        <aside className="calc-sidebar">
          <SidebarAd />

          <div className="sidebar-box">
            <h4>Related Financial Tools</h4>
            <ul className="sidebar-links-list">
              <li>
                <Link href="/payment-calculator">
                  <span>Payment Calculator</span>
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
                <Link href="/loan-calculator">
                  <span>Loan Calculator</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="sidebar-box">
            <h4>Amortization Facts</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Prepayment Acceleration</strong><br />
                  Early extra payments have maximum impact because interest compounds on remaining principal.
                </span>
              </li>
              <li>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>No Prepayment Penalty</strong><br />
                  Most modern consumer and home mortgages allow penalty-free principal reductions.
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <AdBanner />

      {/* SEO Reference Content */}
      <AmortizationReferenceContent />

      <Footer />
    </main>
  );
}
