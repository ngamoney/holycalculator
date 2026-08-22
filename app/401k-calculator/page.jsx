import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import FourZeroOneKCalculatorIsland from "@/components/FourZeroOneKCalculatorIsland";
import FourZeroOneKReferenceContent from "@/components/FourZeroOneKReferenceContent";
import { FOUR_ZERO_ONE_K_FAQS } from "@/lib/data/fourZeroOneKFaqs";
import Link from "next/link";

export const metadata = {
  title: "401(k) Calculator – Estimate Retirement Balance, Employer Match & Growth | Holy Calculator",
  description:
    "Calculate your projected 401(k) retirement balance, company match growth, inflation-adjusted purchasing power, and monthly retirement income.",
  alternates: {
    canonical: "https://www.holycalculator.com/401k-calculator",
  },
  openGraph: {
    title: "401(k) Calculator – Estimate Retirement Balance & Employer Match",
    description:
      "Free 401(k) growth planner with employer match formulas, salary growth, inflation adjustment, and 4% safe retirement withdrawal estimations.",
    url: "https://www.holycalculator.com/401k-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "401(k) Calculator – Estimate Retirement Balance | Holy Calculator",
    description:
      "Calculate your projected 401(k) balance, employer matching impact, and safe monthly retirement income.",
  },
};

export default function FourZeroOneKCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Finance", href: "/#finance" },
    { label: "401(k) Calculator", active: true },
  ];

  // FAQPage JSON-LD schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FOUR_ZERO_ONE_K_FAQS.map((faq) => ({
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
    name: "Holy Calculator — 401(k) Calculator",
    url: "https://www.holycalculator.com/401k-calculator",
    applicationCategory: "FinancialApplication",
    operatingSystem: "All",
    description:
      "Estimate future 401(k) nest egg values, company matching contributions, compound investment returns, and sustainable retirement withdrawals.",
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
    name: "How to Estimate Your 401(k) Retirement Balance",
    description:
      "Step-by-step instructions for modeling long-term 401(k) growth, employer match contributions, and retirement income.",
    step: [
      {
        "@type": "HowToStep",
        name: "Enter current age and retirement age",
        text: "Input your starting age and target retirement milestone.",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Add annual salary & current 401(k) balance",
        text: "Input current gross earnings and existing retirement account savings.",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "Set contribution rate and company match",
        text: "Enter your salary deferral percentage and employer match policy (e.g. 50% match up to 6%).",
        position: 3,
      },
      {
        "@type": "HowToStep",
        name: "Review projected nest egg & monthly income",
        text: "Instantly view total balance at retirement, inflation-adjusted value, and estimated monthly income.",
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
        <h1>401(k) Retirement Calculator</h1>
        <p className="lead">
          Project your 401(k) balance at retirement and calculate the compounding power of employer matching funds.
          Adjust for expected salary growth, investment returns, inflation, and safe 4% retirement withdrawals.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <FourZeroOneKCalculatorIsland />

        {/* Desktop Sidebar */}
        <aside className="calc-sidebar">
          <SidebarAd />

          <div className="sidebar-box">
            <h4>Related Wealth Tools</h4>
            <ul className="sidebar-links-list">
              <li>
                <Link href="/retirement-calculator">
                  <span>Retirement Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/compound-interest-calculator">
                  <span>Compound Interest</span>
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

          <div className="sidebar-box">
            <h4>401(k) Rules &amp; Limits</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>2026 IRS Cap: $23,500</strong><br />
                  Workers under 50 can contribute up to $23,500 ($31,000 for age 50+ catch-up).
                </span>
              </li>
              <li>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Free Match Money</strong><br />
                  Always contribute enough to capture 100% of your employer matching match.
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <AdBanner />

      {/* SEO Reference Content */}
      <FourZeroOneKReferenceContent />

      <Footer />
    </main>
  );
}
