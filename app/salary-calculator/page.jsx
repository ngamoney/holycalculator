import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import SalaryCalculatorIsland from "@/components/SalaryCalculatorIsland";
import SalaryReferenceContent from "@/components/SalaryReferenceContent";
import { SALARY_FAQS } from "@/lib/data/salaryFaqs";
import Link from "next/link";

export const metadata = {
  title: "Salary Calculator – Hourly to Salary, Bi-Weekly & Monthly Wage Converter | Holy Calculator",
  description:
    "Convert hourly wages to annual salary, bi-weekly paychecks, and monthly earnings. Factor in paid vacation days, holidays, and overtime pay.",
  alternates: {
    canonical: "https://www.holycalculator.com/salary-calculator",
  },
  openGraph: {
    title: "Salary Calculator – Hourly to Salary, Bi-Weekly & Monthly Wage Converter",
    description:
      "Free salary conversion calculator. Convert between hourly, daily, weekly, bi-weekly, semi-monthly, and annual earnings with paid time off adjustments.",
    url: "https://www.holycalculator.com/salary-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Salary Calculator | Holy Calculator",
    description:
      "Convert hourly wages to annual salary, bi-weekly paychecks, and monthly earnings.",
  },
};

export default function SalaryCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Finance", href: "/#finance" },
    { label: "Salary Calculator", active: true },
  ];

  // FAQPage JSON-LD schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SALARY_FAQS.map((faq) => ({
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
    name: "Holy Calculator — Salary & Wage Converter",
    url: "https://www.holycalculator.com/salary-calculator",
    applicationCategory: "FinancialApplication",
    operatingSystem: "All",
    description:
      "Convert salary and hourly wages between hourly, daily, weekly, bi-weekly, semi-monthly, and annual payment frequencies.",
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
    name: "How to Convert Hourly Wage to Annual Salary",
    description:
      "Step-by-step instructions for converting hourly rates into annual and paycheck amounts.",
    step: [
      {
        "@type": "HowToStep",
        name: "Enter wage or salary amount",
        text: "Input your rate of pay (e.g. $50/hour or $85,000/year).",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Select pay frequency & weekly hours",
        text: "Choose frequency and specify standard weekly hours (e.g. 40 hours/week).",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "Adjust paid holidays & PTO",
        text: "Add annual paid vacation days and statutory holidays to calculate effective hourly rates.",
        position: 3,
      },
      {
        "@type": "HowToStep",
        name: "Review paycheck breakdowns & overtime rates",
        text: "Instantly view bi-weekly, monthly, quarterly, and annual earnings alongside 1.5x and 2.0x overtime rates.",
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
        <h1>Salary Calculator</h1>
        <p className="lead">
          Convert your hourly wage or annual salary into equivalent weekly, bi-weekly, semi-monthly, and monthly paycheck amounts.
          Factor in paid holidays, vacation time, and overtime pay.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <SalaryCalculatorIsland />

        {/* Desktop Sidebar */}
        <aside className="calc-sidebar">
          <SidebarAd />

          <div className="sidebar-box">
            <h4>Related Income Tools</h4>
            <ul className="sidebar-links-list">
              <li>
                <Link href="/401k-calculator">
                  <span>401(k) Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/budget-calculator">
                  <span>Budget Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/house-affordability-calculator">
                  <span>House Affordability</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="sidebar-box">
            <h4>Full-Time Work Benchmarks</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "10px" }}>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>2,080 Hours / Year</strong><br />
                  Standard full-time calculation: 40 hrs/week × 52 weeks = 2,080 hours.
                </span>
              </li>
              <li>
                <span style={{ fontSize: "13px", color: "var(--ink-60)", lineHeight: "1.5", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Bi-Weekly vs Semi-Monthly</strong><br />
                  Bi-weekly has 26 paychecks/yr; semi-monthly has 24 paychecks/yr.
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <AdBanner />

      {/* SEO Reference Content */}
      <SalaryReferenceContent />

      <Footer />
    </main>
  );
}
