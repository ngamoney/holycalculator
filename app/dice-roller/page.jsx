import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import SidebarAd from "@/components/SidebarAd";
import DiceRollerIsland from "@/components/DiceRollerIsland";
import DiceReferenceContent from "@/components/DiceReferenceContent";
import { DICE_FAQS } from "@/lib/data/diceFaqs";
import Link from "next/link";

export const metadata = {
  title: "Dice Roller – Free Virtual Dice (d4, d6, d8, d10, d12, d20) | Holy Calculator",
  description:
    "Roll virtual dice online — standard 6-sided or any custom polyhedral die (d4, d6, d8, d10, d12, d20). Cryptographically random. Perfect for D&D, Pathfinder, and tabletop RPGs.",
  alternates: {
    canonical: "https://www.holycalculator.com/dice-roller",
  },
  openGraph: {
    title: "Dice Roller – Free Virtual Dice (d4, d6, d8, d10, d12, d20)",
    description:
      "Free virtual dice roller for tabletop RPGs. Roll any polyhedral die with cryptographically secure randomness. Supports d4, d6, d8, d10, d12, d20, and custom-sided dice.",
    url: "https://www.holycalculator.com/dice-roller",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dice Roller – Free Virtual Dice (d4, d6, d8, d10, d12, d20)",
    description:
      "Free virtual dice roller for D&D and tabletop RPGs. Roll any polyhedral die with cryptographically random results.",
  },
};

export default function DiceRollerPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Other Calculators", href: "/#other" },
    { label: "Dice Roller", active: true },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": DICE_FAQS.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Holy Calculator – Dice Roller",
    "url": "https://www.holycalculator.com/dice-roller",
    "applicationCategory": "GameApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />

      <Header />
      <Breadcrumbs items={breadcrumbItems} />

      {/* Page Header */}
      <header className="calc-page-header">
        <div className="eyebrow">
          <span className="dot" style={{ background: "#3B3564" }} />
          Fun &amp; Other Tools
        </div>
        <h1>Virtual Dice Roller</h1>
        <p className="lead">
          Roll any polyhedral die — d4, d6, d8, d10, d12, d20, or any custom-sided die you need. Uses cryptographically secure randomness so every roll is genuinely unpredictable. Perfect for D&amp;D, Pathfinder, and any tabletop RPG.
        </p>
      </header>

      {/* Two-column layout: Island + Sidebar */}
      <div className="calc-layout">
        <DiceRollerIsland />

        {/* Desktop sticky sidebar — no ads near the Roll button */}
        <aside className="calc-sidebar">
          <SidebarAd />

          <div className="sidebar-box">
            <h4>Related Tools</h4>
            <ul className="sidebar-links-list">
              <li>
                <Link href="/age-calculator">
                  <span>Age Calculator</span>
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
            </ul>
          </div>
        </aside>
      </div>

      {/* Reference content sits BELOW the roller — ads safe here */}
      <DiceReferenceContent />

      <Footer />
    </main>
  );
}
