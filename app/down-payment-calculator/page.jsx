import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import DownPaymentCalculatorIsland from "@/components/DownPaymentCalculatorIsland";
import DownPaymentReferenceContent from "@/components/DownPaymentReferenceContent";
import { DOWN_PAYMENT_FAQS } from "@/lib/data/downPaymentFaqs";
import Link from "next/link";

export const metadata = {
  title: "Down Payment Calculator – Upfront Cash, Closing Costs & PMI | Holy Calculator",
  description:
    "Calculate required down payment cash, estimated closing costs, resulting mortgage loan balance, and Private Mortgage Insurance (PMI) across down payment tiers.",
  alternates: {
    canonical: "https://www.holycalculator.com/down-payment-calculator",
  },
  openGraph: {
    title: "Down Payment Calculator – Upfront Cash, Closing Costs & PMI",
    description:
      "Free mortgage down payment calculator. Compare 3.5% FHA, 5% Conventional, and 20% down payment scenarios with upfront cash and monthly payment breakdowns.",
    url: "https://www.holycalculator.com/down-payment-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Down Payment Calculator | Holy Calculator",
    description:
      "Calculate upfront cash requirements, closing costs, and monthly mortgage payments.",
  },
};

export default function DownPaymentCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Finance", href: "/#finance" },
    { label: "Down Payment Calculator", active: true },
  ];

  // FAQPage JSON-LD schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: DOWN_PAYMENT_FAQS.map((faq) => ({
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
    name: "Holy Calculator — Down Payment Calculator",
    url: "https://www.holycalculator.com/down-payment-calculator",
    applicationCategory: "FinancialApplication",
    operatingSystem: "All",
    description:
      "Calculate total out-of-pocket cash required for home purchase down payments, lender closing costs, and evaluate PMI impact on monthly payments.",
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
    name: "How to Calculate Mortgage Down Payment & Upfront Cash",
    description:
      "Step-by-step instructions for estimating down payment funds and total cash needed to close on a home.",
    step: [
      {
        "@type": "HowToStep",
        name: "Enter target home purchase price",
        text: "Input the expected purchase price of the residential property.",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Select down payment percentage",
        text: "Choose a target percentage such as 3.5% (FHA), 5% (Conventional), or 20% (No PMI).",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "Estimate closing costs",
        text: "Include 2% to 5% for lender, title, and escrow closing costs.",
        position: 3,
      },
      {
        "@type": "HowToStep",
        name: "Review total upfront cash & PMI requirement",
        text: "Inspect the total cash needed to close and see if your down payment qualifies for PMI exemption.",
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
        <h1>Down Payment Calculator</h1>
        <p className="lead">
          Calculate the total upfront cash required to buy a house, including your down payment and closing costs.
          Compare 3.5%, 5%, 10%, and 20% down payment tiers and see how equity affects monthly PMI.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <DownPaymentCalculatorIsland />

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
                <Link href="/rent-vs-buy-calculator">
                  <span>Rent vs. Buy</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="sidebar-box">
            <h4>Down Payment Facts</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>20% Eliminates PMI</strong><br />
                  Putting 20% down avoids Private Mortgage Insurance, saving $100–$300/mo.
                </span>
              </li>
              <li>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Add Closing Costs</strong><br />
                  Always budget an extra 2% to 4% in liquid cash for lender and title closing fees.
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <AdBanner />

      {/* SEO Reference Content */}
      <DownPaymentReferenceContent />

      <Footer />
    </main>
  );
}
