import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import SidebarAd from "@/components/SidebarAd";
import AgeCalculatorIsland from "@/components/AgeCalculatorIsland";
import AgeReferenceContent from "@/components/AgeReferenceContent";
import { AGE_FAQS } from "@/lib/data/ageFaqs";
import Link from "next/link";

export const metadata = {
  title: "Age Calculator – Find Your Exact Age in Years, Months & Days | Holy Calculator",
  description:
    "Calculate your exact age in years, months, days, hours, and seconds from date of birth. Find your age on any specific date with instant shareable links.",
  alternates: {
    canonical: "https://www.holycalculator.com/age-calculator",
  },
  openGraph: {
    title: "Age Calculator – Find Your Exact Age in Years, Months & Days",
    description:
      "Calculate your exact chronological age in years, months, days, hours, and seconds. Free, instant, and supports calculating age on any past or future date.",
    url: "https://www.holycalculator.com/age-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Age Calculator – Find Your Exact Age in Years, Months & Days",
    description:
      "Calculate your exact chronological age in years, months, days, hours, and seconds with instant shareable links.",
  },
};

export default function AgeCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Date & Time", href: "/#date" },
    { label: "Age Calculator", active: true },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": AGE_FAQS.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Holy Calculator - Age Calculator",
    "url": "https://www.holycalculator.com/age-calculator",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
  };

  return (
    <main>
      {/* Structured Data Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />

      <Header />

      {/* Breadcrumbs Navigation */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Page Header */}
      <header className="calc-page-header">
        <div className="eyebrow">
          <span className="dot" style={{ background: "#7a6a55" }} />
          Date &amp; Time Calculators
        </div>
        <h1>Age Calculator</h1>
        <p className="lead">
          Calculate your exact chronological age in years, months, days, hours, and seconds. Find out your age on any past or future date, discover the day of the week you were born, and see your upcoming birthday countdown.
        </p>
      </header>

      {/* Main Two-Column Layout (Interactive Island + Sticky Ad Rail) */}
      <div className="calc-layout">
        <AgeCalculatorIsland />

        {/* Desktop Sticky Sidebar Rail */}
        <aside className="calc-sidebar">
          {/* 300x600 Sticky Ad Container */}
          <SidebarAd />

          {/* Quick Navigation / Related Calculators */}
          <div className="sidebar-box">
            <h4>Popular Calculators</h4>
            <ul className="sidebar-links-list">
              <li>
                <Link href="/grade-calculator">
                  <span>Grade Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/gpa-calculator">
                  <span>GPA Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/#math">
                  <span>Percentage Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <span>Scientific Calculator</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* SEO Reference Content, Age Systems Comparison, and FAQ */}
      <AgeReferenceContent />

      <Footer />
    </main>
  );
}
