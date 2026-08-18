import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import StandardDeviationCalculatorIsland from "@/components/StandardDeviationCalculatorIsland";
import StandardDeviationReferenceContent from "@/components/StandardDeviationReferenceContent";
import { STANDARD_DEVIATION_FAQS } from "@/lib/data/standardDeviationFaqs";
import Link from "next/link";

export const metadata = {
  title: "Standard Deviation Calculator – Population & Sample SD, Variance, Mean | Holy Calculator",
  description:
    "Calculate population and sample standard deviation, variance, mean, sum, count, and 95% confidence interval margin of error. Free statistics calculator.",
  alternates: {
    canonical: "https://holycalculator.com/math/standard-deviation-calculator",
  },
  openGraph: {
    title: "Standard Deviation Calculator – Population & Sample SD, Variance, Mean",
    description:
      "Free online Standard Deviation Calculator. Compute population (σ) and sample (s) standard deviation, variance, mean, and 95% margin of error.",
    url: "https://holycalculator.com/math/standard-deviation-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Standard Deviation Calculator | Holy Calculator",
    description:
      "Calculate population and sample standard deviation, variance, mean, sum, count, and 95% confidence interval margin of error.",
  },
};

export default function StandardDeviationCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Math", href: "/#math" },
    { label: "Standard Deviation Calculator", active: true },
  ];

  // FAQPage schema markup (JSON-LD)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: STANDARD_DEVIATION_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  // WebApplication schema markup
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Holy Calculator — Standard Deviation Calculator",
    url: "https://holycalculator.com/math/standard-deviation-calculator",
    applicationCategory: "EducationalApplication",
    operatingSystem: "All",
    description:
      "Calculate population and sample standard deviation, variance, mean, sum, count, and 95% confidence interval margin of error.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  // HowTo schema markup
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Calculate Population and Sample Standard Deviation",
    description:
      "Step-by-step instructions to calculate standard deviation, variance, and mean for any dataset.",
    step: [
      {
        "@type": "HowToStep",
        name: "Select calculation mode",
        text: "Choose Sample Standard Deviation (s, N-1 divisor) for samples or Population Standard Deviation (σ, N divisor) for complete populations.",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Paste or enter your dataset",
        text: "Enter numbers separated by commas, spaces, or newlines into the data set textarea.",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "View statistical outputs",
        text: "Examine standard deviation, variance, arithmetic mean, total sum, sample count, and 95% confidence interval margin of error.",
        position: 3,
      },
    ],
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <Header />

      <Breadcrumbs items={breadcrumbItems} />

      {/* Page Header */}
      <header className="calc-page-header">
        <div className="eyebrow" style={{ color: "#9C7420" }}>
          <span className="dot" style={{ background: "#9C7420" }} />
          Math &amp; Statistics Calculators
        </div>
        <h1>Standard Deviation Calculator</h1>
        <p className="lead">
          Calculate Population (σ) and Sample (s) standard deviation, variance, mean, sum, sample size, and 95% confidence interval margin of error from any raw numbers dataset.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <StandardDeviationCalculatorIsland />

        {/* Desktop Sticky Sidebar Rail */}
        <aside className="calc-sidebar">
          {/* Vertical Ad Space */}
          <div className="sidebar-box" style={{ padding: "10px", textAlign: "center" }}>
            <SidebarAd />
          </div>

          {/* Related Math Tools */}
          <div className="sidebar-box">
            <h4>Math &amp; Statistics Tools</h4>
            <ul className="sidebar-links-list">
              <li>
                <Link href="/math/percentage-calculator">
                  <span>Percentage Calculator</span>
                  <span>→</span>
                </Link>
              </li>
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
                  <span>All Math Tools</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Statistics Fast Facts */}
          <div className="sidebar-box">
            <h4>Statistics Fast Facts</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Bessel&apos;s Correction:</strong> N−1 divisor corrects sample variance bias
                </span>
              </li>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>68-95-99.7 Rule:</strong> Normal distributions fall within 1, 2, or 3 SDs
                </span>
              </li>
              <li>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Variance:</strong> Equal to standard deviation squared (σ² or s²)
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* CLS-safe Below-Calculator Ad Space */}
      <AdBanner />

      {/* Educational Reference Content & FAQs */}
      <StandardDeviationReferenceContent />

      <Footer />
    </main>
  );
}
