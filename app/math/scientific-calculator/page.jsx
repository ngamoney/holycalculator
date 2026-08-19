import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import ScientificCalculatorIsland from "@/components/ScientificCalculatorIsland";
import ScientificReferenceContent from "@/components/ScientificReferenceContent";
import { SCIENTIFIC_FAQS } from "@/lib/data/scientificFaqs";
import Link from "next/link";

export const metadata = {
  title: "Scientific Calculator – Trigonometry, Logarithms & Memory | Holy Calculator",
  description:
    "Perform high-precision scientific calculations, trigonometry, logarithms, exponents, factorials, and memory operations.",
  alternates: {
    canonical: "https://www.holycalculator.com/math/scientific-calculator",
  },
  openGraph: {
    title: "Scientific Calculator – High-Precision Math & Trigonometry",
    description:
      "Free online scientific calculator with DEG/RAD modes, trig functions, logarithms, powers, roots, factorials, and memory controls.",
    url: "https://www.holycalculator.com/math/scientific-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scientific Calculator | Holy Calculator",
    description: "High-precision online scientific calculator with physical keyboard support.",
  },
};

export default function ScientificCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Math", href: "/#math" },
    { label: "Scientific Calculator", active: true },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SCIENTIFIC_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Holy Calculator — Scientific Calculator",
    url: "https://www.holycalculator.com/math/scientific-calculator",
    applicationCategory: "EducationalApplication",
    operatingSystem: "All",
    description: "High-precision scientific calculator with trigonometry and logarithms.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />

      <Header />
      <Breadcrumbs items={breadcrumbItems} />

      <header className="calc-page-header">
        <div className="eyebrow" style={{ color: "#9C7420" }}>
          <span className="dot" style={{ background: "#9C7420" }} />
          Math Calculators
        </div>
        <h1>Scientific Calculator</h1>
        <p className="lead">
          Perform high-precision scientific calculations, trigonometry (sin, cos, tan), logarithms (log, ln), exponents, roots, factorials, and memory operations with physical keyboard support.
        </p>
      </header>

      <div className="calc-layout">
        <ScientificCalculatorIsland />

        <aside className="calc-sidebar">
          <div className="sidebar-box" style={{ padding: "10px", textAlign: "center" }}>
            <SidebarAd />
          </div>

          <div className="sidebar-box">
            <h4>Math Tools</h4>
            <ul className="sidebar-links-list">
              <li>
                <Link href="/math/percentage-calculator">
                  <span>Percentage Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/math/fraction-calculator">
                  <span>Fraction Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/math/average-calculator">
                  <span>Average Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/math/standard-deviation-calculator">
                  <span>Standard Deviation</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/grade-calculator">
                  <span>Grade Calculator</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <AdBanner />
      <ScientificReferenceContent />
      <Footer />
    </main>
  );
}
