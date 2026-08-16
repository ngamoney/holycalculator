import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import GPACalculatorIsland from "@/components/GPACalculatorIsland";
import GPAReferenceContent from "@/components/GPAReferenceContent";
import { GPA_FAQS } from "@/lib/data/gpaFaqs";
import Link from "next/link";

export const metadata = {
  title: "GPA Calculator – Calculate Your Grade Point Average | Holy Calculator",
  description:
    "Calculate semester and cumulative Grade Point Average (GPA) instantly. Supports 4.0 scale, letter grades, percentages, prior GPA carryover, and target GPA planning.",
  alternates: {
    canonical: "https://holycalculator.com/gpa-calculator",
  },
  openGraph: {
    title: "GPA Calculator – Calculate Your Grade Point Average",
    description:
      "Calculate semester and cumulative Grade Point Average (GPA) instantly. Supports 4.0 scale, letter grades, percentages, prior GPA carryover, and target GPA planning.",
    url: "https://holycalculator.com/gpa-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GPA Calculator – Calculate Your Grade Point Average",
    description:
      "Free instant GPA Calculator with semester grouping, letter/percentage grades, prior GPA carryover, and target planning.",
  },
};

export default function GPACalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Math", href: "/#math" },
    { label: "GPA Calculator", active: true },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": GPA_FAQS.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Calculate Grade Point Average (GPA)",
    "description": "Step-by-step instructions to calculate semester and cumulative grade point average using quality points and credit weighting.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Convert each letter grade to numerical grade points",
        "text": "Map each class grade to standard GPA points (e.g., A = 4.0, B = 3.0, C = 2.0).",
        "position": 1,
      },
      {
        "@type": "HowToStep",
        "name": "Multiply grade points by course credit hours",
        "text": "Multiply each class's grade point value by its number of credit hours to calculate Quality Points (e.g., 4 credits × 4.0 = 16 quality points).",
        "position": 2,
      },
      {
        "@type": "HowToStep",
        "name": "Divide total quality points by total credit hours",
        "text": "Sum all quality points earned and divide by the total number of graded credits attempted across the term.",
        "position": 3,
      },
    ],
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Holy Calculator - GPA Calculator",
    "url": "https://holycalculator.com/gpa-calculator",
    "applicationCategory": "EducationalApplication",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
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
          <span className="dot" />
          Math &amp; Academic Calculators
        </div>
        <h1>GPA Calculator</h1>
        <p className="lead">
          Calculate your semester and cumulative Grade Point Average (GPA) instantly. Group courses by term, carry forward prior college credits, and project the exact grades you need to achieve your graduation goal.
        </p>
      </header>

      {/* Main Two-Column Layout (Interactive Island + Sticky Ad Rail) */}
      <div className="calc-layout">
        <GPACalculatorIsland />

        {/* Desktop Sticky Sidebar Rail */}
        <aside className="calc-sidebar">
          {/* 300x600 Sticky Ad Container */}
          <div className="sidebar-box" style={{ padding: "10px", textAlign: "center" }}>
            <div className="ad-vertical" style={{ height: "450px" }}>
              ADVERTISEMENT — 300×600
            </div>
          </div>

          {/* Quick Navigation / Related Calculators */}
          <div className="sidebar-box">
            <h4>Academic &amp; Math Calculators</h4>
            <ul className="sidebar-links-list">
              <li>
                <Link href="/grade-calculator">
                  <span>Grade Calculator</span>
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
                <Link href="/#math">
                  <span>Fraction Calculator</span>
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

      {/* SEO Reference Content, Conversion Scale Table, Worked Examples, and FAQ */}
      <GPAReferenceContent />

      <Footer />
    </main>
  );
}
