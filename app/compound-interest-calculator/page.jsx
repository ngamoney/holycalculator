import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import CompoundInterestCalculatorIsland from "@/components/CompoundInterestCalculatorIsland";
import CompoundInterestReferenceContent from "@/components/CompoundInterestReferenceContent";
import { COMPOUND_INTEREST_FAQS } from "@/lib/data/compoundInterestFaqs";
import Link from "next/link";

export const metadata = {
  title: "Compound Interest Calculator – See How Your Money Grows | Holy Calculator",
  description:
    "Calculate future value, total interest earned, and investment growth with custom compounding frequencies, contributions, and interest rate conversions.",
  keywords: [
    "compound interest calculator",
    "compound interest formula",
    "rule of 72 calculator",
    "daily compound interest",
    "monthly compound interest",
    "investment growth calculator",
    "interest rate converter",
  ],
  alternates: {
    canonical: "https://www.holycalculator.com/compound-interest-calculator",
  },
  openGraph: {
    title: "Compound Interest Calculator – See How Your Money Grows",
    description:
      "Calculate your future investment value, total interest earned, Rule of 72 doubling time, and convert interest rates across compounding frequencies.",
    url: "https://www.holycalculator.com/compound-interest-calculator",
    type: "website",
    siteName: "Holy Calculator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compound Interest Calculator – See How Your Money Grows",
    description:
      "Calculate compound interest growth, future value, and convert interest rates across compounding frequencies.",
  },
};

export default function CompoundInterestCalculatorPage() {
  const breadcrumbItems = [
    { label: "Finance", href: "/#finance" },
    { label: "Compound Interest Calculator" },
  ];

  // FAQ Schema Markup (JSON-LD)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: COMPOUND_INTEREST_FAQS.map((faq) => ({
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
    name: "Compound Interest Calculator",
    url: "https://www.holycalculator.com/compound-interest-calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Interactive compound interest calculator estimating future investment value, total deposits, interest earned, Rule of 72 doubling time, and compounding rate conversions.",
  };

  // HowTo Schema Markup
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Calculate Compound Growth and Interest Rate Conversions",
    description:
      "Step-by-step method to calculate an investment's future value using compound interest rates, additional deposits, and rate conversions.",
    step: [
      {
        "@type": "HowToStep",
        name: "Input Initial Principal & Interest Rate",
        text: "Enter your starting investment balance and nominal annual interest rate.",
      },
      {
        "@type": "HowToStep",
        name: "Set Compounding Frequency & Timeline",
        text: "Select your compounding frequency (e.g. monthly, daily, continuous) and investment duration in years or months.",
      },
      {
        "@type": "HowToStep",
        name: "Add Additional Periodic Contributions",
        text: "Include optional recurring deposits (monthly or annually) and select contribution timing (start vs end of period).",
      },
      {
        "@type": "HowToStep",
        name: "Analyze Future Value & Convert Rates",
        text: "Review future value, total interest earned, Rule of 72 doubling time, and use the secondary rate converter tool.",
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
        <h1>Compound Interest Calculator</h1>
        <p className="lead">
          Calculate how your savings and investments grow over time with compound interest, regular contributions, 9 compounding frequencies, Rule of 72 doubling estimates, and compounding rate conversions.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <CompoundInterestCalculatorIsland />

        {/* Desktop Sidebar */}
        <aside className="calc-sidebar">
          {/* Vertical Ad Space */}
          <SidebarAd />

          {/* Related Financial Tools */}
          <div className="sidebar-box">
            <h4>Financial Calculators</h4>
            <ul className="sidebar-links-list">
              <li>
                <Link href="/compound-interest-calculator">
                  <span>Compound Interest</span>
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
              <li>
                <Link href="/budget-calculator">
                  <span>Budget Calculator</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Compound Interest Benchmarks */}
          <div className="sidebar-box">
            <h4>Growth Benchmarks</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Rule of 72</strong><br />
                  $T \approx 72 / r$ estimates doubling time in years
                </span>
              </li>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Timing Advantage</strong><br />
                  Start-of-period deposits earn an extra period of growth
                </span>
              </li>
              <li>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Bernoulli &amp; Constant e</strong><br />
                  Continuous compounding approaches A = P &middot; e<sup>r &middot; t</sup>
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
        <CompoundInterestReferenceContent />
      </div>

      <Footer />
    </div>
  );
}
