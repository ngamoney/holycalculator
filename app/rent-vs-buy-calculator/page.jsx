import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import RentVsBuyCalculatorIsland from "@/components/RentVsBuyCalculatorIsland";
import RentVsBuyReferenceContent from "@/components/RentVsBuyReferenceContent";
import { RENT_VS_BUY_FAQS } from "@/lib/data/rentVsBuyFaqs";
import Link from "next/link";

export const metadata = {
  title: "Rent vs. Buy Calculator – Financial Breakeven & Wealth Comparison | Holy Calculator",
  description:
    "Compare the total costs and long-term net wealth of renting versus buying a home. Factor in mortgage interest, taxes, maintenance, appreciation, and investing market returns.",
  alternates: {
    canonical: "https://www.holycalculator.com/rent-vs-buy-calculator",
  },
  openGraph: {
    title: "Rent vs. Buy Calculator – Financial Breakeven & Wealth Comparison",
    description:
      "Free Rent vs. Buy calculator with breakeven timelines, unrecoverable cost modeling, home equity accumulation, and investment portfolio projections.",
    url: "https://www.holycalculator.com/rent-vs-buy-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rent vs. Buy Calculator | Holy Calculator",
    description:
      "Compare the total financial costs and wealth accumulation of renting vs. buying a home.",
  },
};

export default function RentVsBuyCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Finance", href: "/#finance" },
    { label: "Rent vs. Buy Calculator", active: true },
  ];

  // FAQPage JSON-LD schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: RENT_VS_BUY_FAQS.map((faq) => ({
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
    name: "Holy Calculator — Rent vs. Buy Calculator",
    url: "https://www.holycalculator.com/rent-vs-buy-calculator",
    applicationCategory: "FinancialApplication",
    operatingSystem: "All",
    description:
      "Analyze the long-term wealth impact and breakeven horizon between renting an apartment and buying residential real estate.",
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
    name: "How to Compare Renting vs Buying a Home",
    description:
      "Step-by-step instructions for modeling the financial tradeoffs between leasing and purchasing a property.",
    step: [
      {
        "@type": "HowToStep",
        name: "Enter home price & down payment",
        text: "Input target purchase price, down payment percentage, and mortgage interest rate.",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Enter equivalent monthly rent",
        text: "Input the current monthly rent for a comparable property in your local market.",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "Select planned stay duration",
        text: "Specify how many years you expect to reside in the home before relocating or selling.",
        position: 3,
      },
      {
        "@type": "HowToStep",
        name: "Review breakeven year and net wealth advantage",
        text: "Examine the 30-year projection comparing home equity against investment portfolio growth.",
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
        <h1>Rent vs. Buy Calculator</h1>
        <p className="lead">
          Find out whether renting or buying a home makes more financial sense for your timeline.
          Compare total housing costs, home equity accumulation, and the opportunity cost of investing in the market.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <RentVsBuyCalculatorIsland />

        {/* Desktop Sidebar */}
        <aside className="calc-sidebar">
          <SidebarAd />

          <div className="sidebar-box">
            <h4>Related Real Estate Tools</h4>
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
                <Link href="/down-payment-calculator">
                  <span>Down Payment Planner</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="sidebar-box">
            <h4>The 5% Rule</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Unrecoverable Costs</strong><br />
                  1% property tax + 1% maintenance + 3% cost of capital ≈ 5% of home value annually.
                </span>
              </li>
              <li>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Stay Duration Matters</strong><br />
                  Buying rarely beats renting under 4 years due to heavy buying and selling transaction fees.
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <AdBanner />

      {/* SEO Reference Content */}
      <RentVsBuyReferenceContent />

      <Footer />
    </main>
  );
}
