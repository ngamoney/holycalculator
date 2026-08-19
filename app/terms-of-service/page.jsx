import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = {
  title: "Terms of Service | Holy Calculator",
  description:
    "Read the Terms of Service for using Holy Calculator and its online calculation tools.",
  alternates: {
    canonical: "https://www.holycalculator.com/terms-of-service",
  },
  openGraph: {
    title: "Terms of Service | Holy Calculator",
    description:
      "Holy Calculator Terms of Service — terms of site usage, estimates disclaimer, and liability limits.",
    url: "https://www.holycalculator.com/terms-of-service",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Terms of Service | Holy Calculator",
    description: "Terms of Service for using holycalculator.com.",
  },
};

export default function TermsOfServicePage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Terms of Service", active: true },
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
          <h1>Terms of Service</h1>
          <p className="last-updated">Last Updated: August 19, 2026</p>
        </header>

        <article className="static-prose">
          <p>
            Please read these Terms of Service (&ldquo;Terms&rdquo;) carefully before using holycalculator.com (the &ldquo;Site&rdquo;). By accessing or using the Site, you agree to be bound by these Terms.
          </p>

          <h2>1. Use of the Site</h2>
          <p>
            Holy Calculator provides free online calculators across categories including education, date/time, health, finance, and other tools. The Site is provided for general informational and estimation purposes only.
          </p>
          <p>
            You agree to use the Site only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else&apos;s use of the Site.
          </p>

          <h2>2. Estimates Only — No Professional Advice</h2>
          <p>
            <strong>The calculators on this Site produce estimates based on the information you enter and standard, publicly available formulas.</strong> They are not a substitute for professional advice, including but not limited to:
          </p>
          <ul>
            <li>
              <strong>Financial advice</strong>: Mortgage, loan, retirement, tax, budget, and other financial calculators provide estimates only. Actual loan terms, tax liability, and financial outcomes depend on factors this Site cannot account for, including your specific lender, credit profile, local tax jurisdiction, and current law. Consult a licensed financial advisor, accountant, or tax professional for decisions with real financial consequences.
            </li>
            <li>
              <strong>Medical/health advice</strong>: Calorie, pregnancy/due-date, and other health-related calculators provide general estimates based on standard formulas. They are not a diagnosis and do not account for individual medical conditions. Consult a physician or qualified healthcare provider for medical guidance, especially before making changes based on this Site related to diet, pregnancy, or any health condition.
            </li>
            <li>
              <strong>Legal advice</strong>: Nothing on this Site constitutes legal advice.
            </li>
          </ul>
          <p>
            Use of any calculator on this Site, and any decisions made based on its output, are at your own discretion and risk.
          </p>

          <h2>3. No Warranty</h2>
          <p>
            The Site and its calculators are provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo; without warranties of any kind, express or implied, including but not limited to warranties of accuracy, completeness, merchantability, or fitness for a particular purpose. While we make reasonable efforts to keep calculations correct and current (including updating tax-related figures annually), we do not guarantee that any result is free of errors or omissions.
          </p>

          <h2>4. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Holy Calculator and its operators shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of, or inability to use, the Site or reliance on any calculator&apos;s output.
          </p>

          <h2>5. Advertising and Third Parties</h2>
          <p>
            This Site displays advertisements served by third-party networks, including Google AdSense. We do not control the content of these advertisements, and their presence does not constitute an endorsement by Holy Calculator. This Site does not accept payment to feature specific products, lenders, or services within calculator results, and does not embed affiliate rate-shopping or lead-generation widgets within its calculators.
          </p>
          <p>
            Links to third-party websites are provided for convenience or as reference sources; we are not responsible for the content or practices of external sites.
          </p>

          <h2>6. Intellectual Property</h2>
          <p>
            The design, layout, original written content, and code of this Site are the property of Holy Calculator unless otherwise noted. You may use the calculators for personal, non-commercial purposes. Reproducing, scraping, or republishing substantial portions of the Site&apos;s content or code without permission is prohibited.
          </p>

          <h2>7. Changes to the Site and These Terms</h2>
          <p>
            We may modify, suspend, or discontinue any part of the Site at any time. We may also update these Terms; continued use of the Site after changes constitutes acceptance of the revised Terms. The &ldquo;Last Updated&rdquo; date above reflects the most recent revision.
          </p>

          <h2>8. Contact</h2>
          <p>
            Questions about these Terms can be sent to <a href="mailto:contactus@holycalculator.com">contactus@holycalculator.com</a>.
          </p>
        </article>
      </div>

      <Footer />
    </main>
  );
}
