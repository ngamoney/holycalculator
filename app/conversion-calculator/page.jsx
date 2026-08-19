import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import SidebarAd from "@/components/SidebarAd";
import ConversionCalculatorIsland from "@/components/ConversionCalculatorIsland";
import ConversionReferenceContent from "@/components/ConversionReferenceContent";
import { CONVERSION_FAQS } from "@/lib/data/conversionFaqs";
import Link from "next/link";

export const metadata = {
  title: "Unit Conversion Calculator – Length, Weight, Temperature & More | Holy Calculator",
  description:
    "Convert units across Length, Weight, Temperature, Area, Volume, Time, and Speed instantly. Free metric to imperial converter.",
  alternates: {
    canonical: "https://www.holycalculator.com/conversion-calculator",
  },
  openGraph: {
    title: "Unit Conversion Calculator – Length, Weight, Temperature & More",
    description:
      "Free online Unit Conversion Calculator. Convert centimeters to inches, kilograms to pounds, Celsius to Fahrenheit, liters to gallons, and more.",
    url: "https://www.holycalculator.com/conversion-calculator",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unit Conversion Calculator | Holy Calculator",
    description:
      "Convert units across Length, Weight, Temperature, Area, Volume, Time, and Speed instantly.",
  },
};

export default function ConversionCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Conversions", href: "/#categories" },
    { label: "Unit Conversion Calculator", active: true },
  ];

  // FAQPage schema markup (JSON-LD)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: CONVERSION_FAQS.map((faq) => ({
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
    name: "Holy Calculator — Unit Conversion Calculator",
    url: "https://www.holycalculator.com/conversion-calculator",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    description:
      "Convert units across Length, Weight, Temperature, Area, Volume, Time, and Speed instantly with instant unit swapping.",
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
    name: "How to Convert Measurement Units",
    description:
      "Step-by-step instructions to convert values between metric and imperial unit systems.",
    step: [
      {
        "@type": "HowToStep",
        name: "Select category tab",
        text: "Choose the category of measurement (Length, Weight, Temperature, Area, Volume, Time, or Speed).",
        position: 1,
      },
      {
        "@type": "HowToStep",
        name: "Choose From and To units",
        text: "Select the starting unit from the 'From' dropdown and target unit from the 'To' dropdown.",
        position: 2,
      },
      {
        "@type": "HowToStep",
        name: "Enter value for instant result",
        text: "Input the numeric value into the From box to view instant converted output.",
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
          Unit Conversion Tools
        </div>
        <h1>Unit Conversion Calculator</h1>
        <p className="lead">
          Convert measurement units instantly across length, weight/mass, temperature, area, volume, time, and speed with metric and US customary support.
        </p>
      </header>

      {/* Main Two-Column Layout */}
      <div className="calc-layout">
        <ConversionCalculatorIsland />

        {/* Desktop Sticky Sidebar Rail */}
        <aside className="calc-sidebar">
          {/* Vertical Ad Space */}
          <div className="sidebar-box" style={{ padding: "10px", textAlign: "center" }}>
            <SidebarAd />
          </div>

          {/* Related Tools */}
          <div className="sidebar-box">
            <h4>Conversion &amp; Math Tools</h4>
            <ul className="sidebar-links-list">
              <li>
                <Link href="/currency-calculator">
                  <span>Currency Converter</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/date-calculator">
                  <span>Date Calculator</span>
                  <span>→</span>
                </Link>
              </li>
              <li>
                <Link href="/math/percentage-calculator">
                  <span>Percentage Calculator</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Fast Facts */}
          <div className="sidebar-box">
            <h4>Conversion Fast Facts</h4>
            <ul className="sidebar-links-list" style={{ gap: "10px" }}>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>1 Inch = 2.54 cm:</strong> Exact international standard since 1959
                </span>
              </li>
              <li style={{ borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>1 Gallon = 16 Cups:</strong> US Customary fluid volume ratio
                </span>
              </li>
              <li>
                <span style={{ fontSize: "12.5px", color: "var(--ink-60)", display: "block" }}>
                  <strong style={{ color: "var(--ink)" }}>Absolute Zero:</strong> −273.15 °C = 0 Kelvin (K)
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* CLS-safe Below-Calculator Ad Space */}
      <AdBanner />

      {/* Educational Reference Content & FAQs */}
      <ConversionReferenceContent />

      <Footer />
    </main>
  );
}
