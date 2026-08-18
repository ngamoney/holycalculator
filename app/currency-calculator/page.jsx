import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import CurrencyCalculatorIsland from "@/components/CurrencyCalculatorIsland";
import CurrencyReferenceContent from "@/components/CurrencyReferenceContent";
import { CURRENCY_FAQS } from "@/lib/data/currencyFaqs";
import Link from "next/link";

export const metadata = {
  title: "Currency Calculator – Convert Currencies with Live Exchange Rates | Holy Calculator",
  description:
    "Convert world currencies with live central bank exchange rates, manual exchange rate overrides, and popular currency pair reference tables.",
  alternates: {
    canonical: "https://holycalculator.com/currency-calculator",
  },
  openGraph: {
    title: "Currency Calculator – Convert Currencies with Live Exchange Rates",
    description:
      "Free online Currency Calculator. Convert USD, EUR, GBP, JPY, AUD, CAD, INR, and 150+ currencies with live real-time exchange rate feeds.",
    url: "https://holycalculator.com/currency-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Currency Calculator | Holy Calculator",
    description:
      "Convert currencies with live exchange rates, manual exchange rate overrides, and popular currency pair tables.",
  },
};

export default function CurrencyCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Finance", href: "/#finance" },
    { label: "Currency Calculator", active: true },
  ];

  // FAQPage schema markup (JSON-LD)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: CURRENCY_FAQS.map((faq) => ({
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
    name: "Holy Calculator — Currency Calculator",
    url: "https://holycalculator.com/currency-calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    description:
      "Convert currencies with live central bank exchange rates, custom rate overrides, and popular currency pair reference tables.",
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
    name: "How to Convert World Currencies with Live Exchange Rates",
    description:
      "Step-by-step instructions to convert currencies using live interbank exchange rates or manual bank rate overrides.",
    step: [
      {
        "@type": "HowToStep",
        name: "Enter conversion amount",
        text: "Input the numeric currency amount you wish to convert.",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Select From and To currencies",
        text: "Choose your source currency in the 'From' dropdown and target currency in the 'To' dropdown.",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "View live conversion output",
        text: "The tool instantly outputs the converted currency total based on live interbank exchange rates.",
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
        <div className="eyebrow" style={{ color: "var(--ink)" }}>
          <span className="dot" style={{ background: "var(--ink)" }} />
          Financial &amp; Forex Tools
        </div>
        <h1>Currency Calculator</h1>
        <p className="lead">
          Convert 150+ world currencies with live central bank exchange rates, custom bank rate overrides, and major currency pair market tables.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <CurrencyCalculatorIsland />

        {/* Desktop Sticky Sidebar Rail */}
        <aside className="calc-sidebar">
          {/* Vertical Ad Space */}
          <div className="sidebar-box" style={{ padding: "10px", textAlign: "center" }}>
            <SidebarAd />
          </div>

          {/* Related Tools */}
          <div className="sidebar-box">
            <h4>Financial &amp; Conversion Tools</h4>
            <ul className="sidebar-links-list">
              <li>
                <Link href="/conversion-calculator">
                  <span>Unit Converter</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/compound-interest-calculator">
                  <span>Compound Interest</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/mortgage-calculator">
                  <span>Mortgage Calculator</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Fast Facts */}
          <div className="sidebar-box">
            <h4>Forex Fast Facts</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Interbank Rate:</strong> Wholesale rate used between central banks
                </span>
              </li>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Bid-Ask Spread:</strong> Retail markup charged by consumer banks
                </span>
              </li>
              <li>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>DCC Caution:</strong> Always choose local currency at overseas ATMs
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* CLS-safe Below-Calculator Ad Space */}
      <AdBanner />

      {/* Educational Reference Content & FAQs */}
      <CurrencyReferenceContent />

      <Footer />
    </main>
  );
}
