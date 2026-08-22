import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import RefinanceCalculatorIsland from "@/components/RefinanceCalculatorIsland";
import RefinanceReferenceContent from "@/components/RefinanceReferenceContent";
import { REFINANCE_FAQS } from "@/lib/data/refinanceFaqs";
import Link from "next/link";

export const metadata = {
  title: "Refinance Calculator – Breakeven, Monthly Savings & Lifetime Interest | Holy Calculator",
  description:
    "Compare your current mortgage with a new refinanced loan. Calculate monthly payment savings, breakeven period (months), closing costs, and lifetime interest savings.",
  alternates: {
    canonical: "https://www.holycalculator.com/refinance-calculator",
  },
  openGraph: {
    title: "Refinance Calculator – Breakeven, Monthly Savings & Lifetime Interest",
    description:
      "Free mortgage refinance calculator with side-by-side loan comparisons, breakeven horizon analysis, closing costs, points, and cash-out calculations.",
    url: "https://www.holycalculator.com/refinance-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Refinance Calculator | Holy Calculator",
    description:
      "Compare current and refinanced loans to calculate monthly savings and breakeven horizons.",
  },
};

export default function RefinanceCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Finance", href: "/#finance" },
    { label: "Refinance Calculator", active: true },
  ];

  // FAQPage JSON-LD schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: REFINANCE_FAQS.map((faq) => ({
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
    name: "Holy Calculator — Mortgage Refinance Calculator",
    url: "https://www.holycalculator.com/refinance-calculator",
    applicationCategory: "FinancialApplication",
    operatingSystem: "All",
    description:
      "Evaluate whether refinancing a home mortgage or personal loan saves money by calculating monthly payments, closing cost breakeven timelines, and total lifetime interest.",
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
    name: "How to Calculate Mortgage Refinance Savings",
    description:
      "Step-by-step instructions for comparing an existing mortgage against a refinanced loan offer.",
    step: [
      {
        "@type": "HowToStep",
        name: "Enter current loan balance and rate",
        text: "Input your remaining mortgage principal, years remaining, and current interest rate.",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Input refinanced loan terms",
        text: "Select your new loan term (e.g. 15, 20, or 30 years) and prospective interest rate.",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "Add closing costs and discount points",
        text: "Input total lender fees, title insurance, and prepaid discount points.",
        position: 3,
      },
      {
        "@type": "HowToStep",
        name: "Review monthly savings and breakeven point",
        text: "See how many months it will take for your monthly payment reduction to offset total upfront closing costs.",
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
        <h1>Refinance Calculator</h1>
        <p className="lead">
          Compare your current mortgage side-by-side with a new refinanced loan offer.
          Calculate your monthly payment savings, lifetime interest reduction, and exact breakeven horizon in months.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <RefinanceCalculatorIsland />

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
                <Link href="/amortization-calculator">
                  <span>Amortization Schedule</span>
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
            <h4>Refinance Rule of Thumb</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>1% Rate Reduction</strong><br />
                  A 1% drop in interest rate on a $300k mortgage saves approximately $200 per month.
                </span>
              </li>
              <li>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Watch the Breakeven</strong><br />
                  Ensure you plan to stay in the home longer than your breakeven period to lock in real savings.
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <AdBanner />

      {/* SEO Reference Content */}
      <RefinanceReferenceContent />

      <Footer />
    </main>
  );
}
