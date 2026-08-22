import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import PaymentCalculatorIsland from "@/components/PaymentCalculatorIsland";
import PaymentReferenceContent from "@/components/PaymentReferenceContent";
import { PAYMENT_FAQS } from "@/lib/data/paymentFaqs";
import Link from "next/link";

export const metadata = {
  title: "Payment Calculator – Calculate Monthly Loan Payments & Payoff Schedules | Holy Calculator",
  description:
    "Calculate monthly loan payments, total interest, and payoff timelines with fixed terms or fixed monthly payment amounts. Includes full amortization schedules.",
  alternates: {
    canonical: "https://www.holycalculator.com/payment-calculator",
  },
  openGraph: {
    title: "Payment Calculator – Calculate Monthly Loan Payments & Payoff Schedules",
    description:
      "Free monthly payment calculator with fixed term vs. fixed payment modes, interest breakdown, and complete year-by-year amortization schedules.",
    url: "https://www.holycalculator.com/payment-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Payment Calculator – Calculate Monthly Loan Payments | Holy Calculator",
    description:
      "Calculate monthly loan payments, total interest, and payoff timelines with fixed terms or fixed monthly payment amounts.",
  },
};

export default function PaymentCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Finance", href: "/#finance" },
    { label: "Payment Calculator", active: true },
  ];

  // FAQPage JSON-LD schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PAYMENT_FAQS.map((faq) => ({
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
    name: "Holy Calculator — Payment Calculator",
    url: "https://www.holycalculator.com/payment-calculator",
    applicationCategory: "FinancialApplication",
    operatingSystem: "All",
    description:
      "Calculate monthly loan payments, interest breakdown, and payoff timelines with fixed terms or fixed monthly payment amounts.",
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
    name: "How to Calculate a Monthly Loan Payment",
    description:
      "Step-by-step guide to calculating monthly loan installments, total interest charges, and loan amortization.",
    step: [
      {
        "@type": "HowToStep",
        name: "Select calculation mode",
        text: "Choose Fixed Term to find monthly payments, or Fixed Payments to calculate time until debt payoff.",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Enter loan amount",
        text: "Input total principal amount to be borrowed or financed.",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "Enter term or target payment and interest rate",
        text: "Specify duration in years and months (or desired monthly payment) and annual interest rate (APR).",
        position: 3,
      },
      {
        "@type": "HowToStep",
        name: "Review results & schedule",
        text: "Instantly view monthly payment, total interest cost, and annual or monthly amortization schedules.",
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
        <h1>Payment Calculator</h1>
        <p className="lead">
          Calculate your exact monthly loan payment or solve for the time required to pay off debt with fixed monthly installments.
          Includes interactive principal versus interest breakdowns and complete amortization schedules.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <PaymentCalculatorIsland />

        {/* Desktop Sidebar */}
        <aside className="calc-sidebar">
          <SidebarAd />

          <div className="sidebar-box">
            <h4>Related Financial Tools</h4>
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
                <Link href="/auto-loan-calculator">
                  <span>Auto Loan Calculator</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="sidebar-box">
            <h4>Quick Payment Rules</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Extra Principal Savings</strong><br />
                  Adding even $50/mo directly to principal cuts total interest significantly on long-term loans.
                </span>
              </li>
              <li>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Front-Loaded Interest</strong><br />
                  Standard amortization applies more of each installment toward interest in early years.
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <AdBanner />

      {/* SEO Reference Content */}
      <PaymentReferenceContent />

      <Footer />
    </main>
  );
}
