import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = {
  title: "About Holy Calculator — Fast, Neutral Online Calculators",
  description:
    "Discover Holy Calculator's mission to provide fast, transparent, and neutral online calculation tools without popups or sales funnels.",
  alternates: {
    canonical: "https://www.holycalculator.com/about",
  },
  openGraph: {
    title: "About Holy Calculator — Fast, Neutral Online Calculators",
    description:
      "Holy Calculator is a free collection of fast, accurate calculators spanning finance, health, math, and everyday tools.",
    url: "https://www.holycalculator.com/about",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "About Holy Calculator",
    description: "Fast, clear, neutral online tools for everyday calculations.",
  },
};

export default function AboutPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "About Us", active: true },
  ];

  return (
    <main>
      <Header />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="static-page-wrapper">
        <header className="static-page-header">
          <div className="eyebrow">
            <span className="dot" />
            Trust &amp; Legal
          </div>
          <h1>About Holy Calculator</h1>
        </header>

        <article className="static-prose">
          <p>
            Holy Calculator is a free, all-in-one collection of online calculators — built to be fast, clear, and genuinely useful, without the clutter, popups, or aggressive sales funnels found on many calculator sites.
          </p>

          <h2>What We Offer</h2>
          <p>Our calculators span several categories:</p>
          <ul>
            <li><strong>Education</strong>: Grade Calculator, GPA Calculator</li>
            <li><strong>Date &amp; Time</strong>: Age Calculator, Countdown Calculator</li>
            <li><strong>Health</strong>: Calorie Calculator, Pregnancy &amp; Due Date Calculator</li>
            <li><strong>Financial</strong>: Mortgage, Auto Loan, Retirement, Loan, Budget, Income Tax, Paycheck, and Compound Interest Calculators</li>
            <li><strong>Conversion</strong>: Unit Conversion and Currency Calculators</li>
            <li><strong>Fun &amp; Tools</strong>: Dice Roller</li>
          </ul>
          <p>We&apos;re continuing to add new calculators regularly.</p>

          <h2>Our Approach</h2>
          <ul>
            <li>
              <strong>Fast by design.</strong> Every calculator recalculates instantly as you type — no page reloads, no waiting.
            </li>
            <li>
              <strong>Neutral, not a sales funnel.</strong> We don&apos;t embed lender rate-shopping widgets, affiliate product placements, or &ldquo;get a quote&rdquo; walls inside our calculators. Our financial and health calculators exist to give you a clear estimate, not to sell you something.
            </li>
            <li>
              <strong>Built on standard, cited methods.</strong> Where a calculation touches health or finance, we use standard, publicly documented formulas (for example, ACOG-aligned due date estimation, IRS tax bracket data, standard amortization math) and note our sources where relevant.
            </li>
            <li>
              <strong>Honest about limitations.</strong> Every calculator makes clear that it provides an estimate, not professional advice — see our Disclaimer.
            </li>
          </ul>

          <h2>How We&apos;re Supported</h2>
          <p>
            Holy Calculator is free to use and supported by advertising. We don&apos;t charge for access to any calculator, and we don&apos;t require an account or login.
          </p>

          <h2>Feedback</h2>
          <p>
            Found an error, or have an idea for a calculator we should build? We&apos;d like to hear from you — see our <a href="/contact">Contact page</a>.
          </p>
        </article>
      </div>

      <Footer />
    </main>
  );
}
