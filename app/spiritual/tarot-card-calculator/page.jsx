import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import TarotCalculatorIsland from "@/components/TarotCalculatorIsland";
import TarotReferenceContent from "@/components/TarotReferenceContent";
import { TAROT_FAQS } from "@/lib/data/tarotFaqs";
import Link from "next/link";

export const metadata = {
  title: "Tarot Card Reader & Calculator – Daily Draw, 3-Card Spread & Yes/No Tarot | Holy Calculator",
  description:
    "Draw 3-card past-present-future tarot spreads, single daily guidance cards, and Yes/No tarot readings.",
  alternates: {
    canonical: "https://www.holycalculator.com/spiritual/tarot-card-calculator",
  },
  openGraph: {
    title: "Tarot Card Reader & Calculator – Daily Draw & 3-Card Spread",
    description:
      "Free online Tarot Card Reading Calculator. Draw 3-card spreads, single daily cards, and instant Yes/No tarot readings.",
    url: "https://www.holycalculator.com/spiritual/tarot-card-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tarot Card Reader & Calculator | Holy Calculator",
    description: "Draw 3-card tarot spreads and daily single card readings.",
  },
};

export default function TarotCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Spiritual & Luck", href: "/#spiritual" },
    { label: "Daily Tarot Card Reading", active: true },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: TAROT_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Holy Calculator — Tarot Card Reader",
    url: "https://www.holycalculator.com/spiritual/tarot-card-calculator",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "All",
    description: "Draw 3-card tarot spreads and daily single card readings.",
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
          Spiritual &amp; Tarot Reading
        </div>
        <h1>Daily Tarot Card Reader &amp; Calculator</h1>
        <p className="lead">
          Draw 3-card past-present-future tarot spreads, single daily guidance cards, or instant Yes/No tarot oracle readings.
        </p>
      </header>

      <div className="calc-layout">
        <TarotCalculatorIsland />

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
                <Link href="/spiritual/zodiac-compatibility-calculator">
                  <span>Zodiac Compatibility</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/spiritual/lucky-number-generator">
                  <span>Lucky Number Generator</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <AdBanner />
      <TarotReferenceContent />
      <Footer />
    </main>
  );
}
