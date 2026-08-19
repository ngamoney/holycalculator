import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import LuckyNumberCalculatorIsland from "@/components/LuckyNumberCalculatorIsland";
import LuckyNumberReferenceContent from "@/components/LuckyNumberReferenceContent";
import { LUCKY_NUMBER_FAQS } from "@/lib/data/luckyNumberFaqs";
import Link from "next/link";

export const metadata = {
  title: "US Lottery Lucky Number Generator – Powerball, Mega Millions & Pick 3/4/5 | Holy Calculator",
  description:
    "Generate lucky numbers for US lotteries (Powerball, Mega Millions, Cash4Life, Pick 3/4/5) and personal birthday numerology.",
  alternates: {
    canonical: "https://www.holycalculator.com/spiritual/lucky-number-generator",
  },
  openGraph: {
    title: "US Lottery Lucky Number Generator – Powerball & Mega Millions",
    description:
      "Free random lucky number generator for US Powerball, Mega Millions, Cash4Life, Pick 3, Pick 4, Pick 5, and birthday numerology.",
    url: "https://www.holycalculator.com/spiritual/lucky-number-generator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "US Lottery Lucky Number Generator | Holy Calculator",
    description: "Generate lucky numbers for US lotteries and birthday numerology.",
  },
};

export default function LuckyNumberGeneratorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Spiritual & Luck", href: "/#spiritual" },
    { label: "Lucky Number Generator", active: true },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: LUCKY_NUMBER_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Holy Calculator — Lucky Number Generator",
    url: "https://www.holycalculator.com/spiritual/lucky-number-generator",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "All",
    description: "Generate lucky numbers for US lotteries and birthday numerology.",
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
          Spiritual &amp; Luck Tools
        </div>
        <h1>Lucky Number Generator</h1>
        <p className="lead">
          Generate cryptographically random, unbiased lucky numbers for US Powerball, Mega Millions, Cash4Life, Pick 3/4/5, and Birthday Numerology.
        </p>
      </header>

      <div className="calc-layout">
        <LuckyNumberCalculatorIsland />

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
            </ul>
          </div>
        </aside>
      </div>

      <AdBanner />
      <LuckyNumberReferenceContent />
      <Footer />
    </main>
  );
}
