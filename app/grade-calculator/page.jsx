import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import SidebarAd from "@/components/SidebarAd";
import GradeCalculatorIsland from "@/components/GradeCalculatorIsland";
import GradeReferenceContent from "@/components/GradeReferenceContent";
import { GRADE_FAQS } from "@/lib/data/gradeFaqs";
import Link from "next/link";

export const metadata = {
  title: "Grade Calculator – Weighted Average & Final Grade Needed | Holy Calculator",
  description:
    "Calculate your weighted grade average and find out exactly what score you need on your final exam. Free, instant, and works with percentages, points, or letter grades.",
  alternates: {
    canonical: "https://www.holycalculator.com/grade-calculator",
  },
  openGraph: {
    title: "Grade Calculator – Weighted Average & Final Grade Needed",
    description:
      "Calculate your weighted grade average and find out exactly what score you need on your final exam. Free, instant, and works with percentages, points, or letter grades.",
    url: "https://www.holycalculator.com/grade-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Grade Calculator – Weighted Average & Final Grade Needed",
    description:
      "Calculate your weighted grade average and find out what score you need on your final exam. Instant reactive calculator with shareable results.",
  },
};

export default function GradeCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Math", href: "/#math" },
    { label: "Grade Calculator", active: true },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": GRADE_FAQS.map((faq) => ({
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
    "name": "How to Calculate a Weighted Grade Average",
    "description": "Step-by-step calculation instructions to determine your overall weighted course grade.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Multiply each assignment grade by its weight",
        "text": "For each graded component, multiply the percentage score by the decimal weight (e.g., 90% × 0.20 = 18 points).",
        "position": 1,
      },
      {
        "@type": "HowToStep",
        "name": "Sum all weighted points",
        "text": "Add together the weighted points calculated across all homework, quizzes, tests, and projects.",
        "position": 2,
      },
      {
        "@type": "HowToStep",
        "name": "Divide by total weight sum",
        "text": "Divide the total weighted points by the sum of the assignment weights. If weights total 100%, the sum is your final percentage grade.",
        "position": 3,
      },
    ],
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Holy Calculator - Grade Calculator",
    "url": "https://www.holycalculator.com/grade-calculator",
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
        <h1>Grade Calculator</h1>
        <p className="lead">
          Calculate your overall weighted class grade and determine the exact score you need on your final exam to reach your target GPA. Works with percentages, points, or letter grades with instant shareable links.
        </p>
      </header>

      {/* Main Two-Column Layout (Interactive Island + Sticky Ad Rail) */}
      <div className="calc-layout">
        <GradeCalculatorIsland />

        {/* Desktop Sticky Sidebar Rail */}
        <aside className="calc-sidebar">
          {/* 300x600 Sticky Ad Container */}
          <SidebarAd />

          {/* Quick Navigation / Related Calculators */}
          <div className="sidebar-box">
            <h4>Math Calculators</h4>
            <ul className="sidebar-links-list">
              <li>
                <Link href="/#math">
                  <span>Percentage Calculator</span>
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
      <GradeReferenceContent />

      <Footer />
    </main>
  );
}
