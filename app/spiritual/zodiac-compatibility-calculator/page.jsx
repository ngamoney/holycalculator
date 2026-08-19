import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import ZodiacCalculatorIsland from "@/components/ZodiacCalculatorIsland";
import ZodiacReferenceContent from "@/components/ZodiacReferenceContent";
import { ZODIAC_FAQS } from "@/lib/data/zodiacFaqs";
import Link from "next/link";

export const metadata = {
  title: "Zodiac Compatibility Calculator – Love Match & Element Synergy | Holy Calculator",
  description:
    "Calculate love compatibility percentage, element synergy, and relationship dynamics between any two zodiac signs.",
  alternates: {
    canonical: "https://www.holycalculator.com/spiritual/zodiac-compatibility-calculator",
  },
  openGraph: {
    title: "Zodiac Compatibility Calculator – Love Match & Element Synergy",
    description:
      "Calculate love match percentage between any two zodiac signs based on elements, modalities, and astrology synastry.",
    url: "https://www.holycalculator.com/spiritual/zodiac-compatibility-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zodiac Compatibility Calculator | Holy Calculator",
    description: "Calculate love compatibility between any two zodiac signs.",
  },
};

export default function ZodiacCompatibilityCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Spiritual & Luck", href: "/#spiritual" },
    { label: "Zodiac Compatibility Calculator", active: true },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ZODIAC_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Holy Calculator — Zodiac Compatibility Calculator",
    url: "https://www.holycalculator.com/spiritual/zodiac-compatibility-calculator",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "All",
    description: "Calculate love compatibility between any two zodiac signs.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />

      <Header />
      <Breadcrumbs items={breadcrumbItems} />

      <header className="calc-page-header">
        <div className="eyebrow" style={{ color: "#3B3564" }}>
          <span className="dot" style={{ background: "#3B3564" }} />
          Spiritual &amp; Astrology Calculators
        </div>
        <h1>Zodiac Compatibility Calculator</h1>
        <p className="lead">
          Select any two Zodiac signs to calculate love compatibility score, communication rating, passion meter, and element synergy.
        </p>
      </header>

      <div className="calc-layout">
        <ZodiacCalculatorIsland />

        <aside className="calc-sidebar">
          <div className="sidebar-box" style={{ padding: "10px", textAlign: "center" }}>
            <SidebarAd />
          </div>

          <div className="sidebar-box">
            <h4>Spiritual Tools</h4>
            <ul className="sidebar-links-list">
              <li>
                <Link href="/spiritual/life-path-number-calculator">
                  <span>Life Path Number</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/spiritual/angel-number-calculator">
                  <span>Angel Number Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/dice-roller">
                  <span>Virtual Dice Roller</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <AdBanner />
      <ZodiacReferenceContent />
      <Footer />
    </main>
  );
}
