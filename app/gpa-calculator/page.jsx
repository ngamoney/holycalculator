import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import SidebarAd from "@/components/SidebarAd";
import GPACalculatorIsland from "@/components/GPACalculatorIsland";
import GPAReferenceContent from "@/components/GPAReferenceContent";
import { GPA_FAQS } from "@/lib/data/gpaFaqs";
import Link from "next/link";

export const metadata = {
  title: "GPA Calculator – Calculate Your Grade Point Average | Holy Calculator",
  description:
    "Calculate semester and cumulative Grade Point Average (GPA) instantly. Supports 4.0 scale, letter grades, percentages, prior GPA carryover, and target GPA planning.",
  alternates: {
    canonical: "https://www.holycalculator.com/gpa-calculator",
  },
  openGraph: {
    title: "GPA Calculator – Calculate Your Grade Point Average",
    description:
      "Free college and high school GPA calculator. Calculate cumulative GPA, weighted grades, and goal GPA forecasts.",
    url: "https://www.holycalculator.com/gpa-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GPA Calculator | Holy Calculator",
    description: "Calculate high school and college GPA with weighted credits.",
  },
};

export default function GPACalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Math", href: "/#math" },
    { label: "GPA Calculator", active: true },
  ];

  // FAQPage Schema Markup
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: GPA_FAQS.map((faq) => ({
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
    name: "Holy Calculator — GPA Calculator",
    url: "https://www.holycalculator.com/gpa-calculator",
    applicationCategory: "EducationalApplication",
    operatingSystem: "All",
    description:
      "Instant GPA calculation tool for semester and cumulative GPA projections.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  // HowTo Schema Markup
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Calculate Your Grade Point Average (GPA)",
    description:
      "Step-by-step instructions to calculate weighted and unweighted semester and cumulative GPA.",
    step: [
      {
        "@type": "HowToStep",
        name: "Add your courses and credits",
        text: "Input each class name, credit hours (weight), and grade received (letter grade or percentage).",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Include prior cumulative GPA",
        text: "Optional: enter your existing cumulative GPA and completed credits to compute your updated overall standing.",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "Forecast your target GPA",
        text: "Use the Target GPA section to see what grades you need in future semesters to graduate with your goal honors.",
        position: 3,
      },
    ],
  };

  return (
    <main>
      {/* JSON-LD Structured Data */}
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

      {/* Global Header */}
      <Header />

      {/* Breadcrumbs Navigation */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Page Header */}
      <header className="calc-page-header">
        <div className="eyebrow">
          <span className="dot" style={{ background: "#9C7420" }} />
          Academic &amp; Math Calculators
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
          <SidebarAd />

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
