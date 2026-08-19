import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = {
  title: "Disclaimer | Holy Calculator",
  description:
    "Important disclaimers regarding financial, health, and general calculation estimates on Holy Calculator.",
  alternates: {
    canonical: "https://holycalculator.com/disclaimer",
  },
  openGraph: {
    title: "Disclaimer | Holy Calculator",
    description:
      "General, financial, and health disclaimers for online tools on Holy Calculator.",
    url: "https://holycalculator.com/disclaimer",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Disclaimer | Holy Calculator",
    description: "Disclaimers and accuracy guidelines for Holy Calculator.",
  },
};

export default function DisclaimerPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Disclaimer", active: true },
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
          <h1>Disclaimer</h1>
          <p className="last-updated">Last Updated: August 19, 2026</p>
        </header>

        <article className="static-prose">
          <p>
            The information and calculators provided on holycalculator.com (&ldquo;the Site&rdquo;) are for general informational and estimation purposes only. This page summarizes disclaimers that also appear alongside individual calculators.
          </p>

          <h2>General</h2>
          <p>
            All calculators on this Site use standard, publicly documented formulas and the values you provide. Results are estimates. They do not account for every individual circumstance, and small differences in inputs, assumptions, or applicable rules can meaningfully change real-world outcomes.
          </p>

          <h2>Financial Calculators</h2>
          <p>
            Calculators including but not limited to the Mortgage, Auto Loan, Retirement, Loan, Budget, Income Tax, Paycheck, and Compound Interest calculators are <strong>not financial advice</strong>. Actual results depend on your lender, credit profile, current interest rates, local tax rules, and other factors this Site cannot know. Tax-related figures (brackets, deduction amounts, credit values) are updated periodically to reflect current law but may not reflect the most recent legislative changes at all times. Always verify important financial figures with a licensed financial advisor, accountant, or the relevant official source (e.g., IRS.gov, SSA.gov) before making decisions.
          </p>

          <h2>Health Calculators</h2>
          <p>
            Calculators including the Calorie Calculator and Pregnancy/Due Date Calculator are <strong>not medical advice</strong> and do not provide a diagnosis. They are based on standard clinical formulas (e.g., BMR equations, ACOG-aligned due date estimation) but cannot account for your individual medical history or circumstances. If you are pregnant, managing a health condition, or considering a change to your diet or exercise routine, consult a physician or qualified healthcare provider.
          </p>

          <h2>Accuracy and Currency of Information</h2>
          <p>
            We aim to keep calculators and their underlying data (tax brackets, standard deduction amounts, contribution limits, etc.) current, and we review and update this data on a regular basis. However, we do not guarantee that all information is accurate, complete, or up to date at every moment. If you find an error, we welcome you to report it — see Contact.
          </p>

          <h2>No Liability</h2>
          <p>
            Holy Calculator and its operators are not liable for any loss or damage arising from reliance on any calculator or content on this Site. Use of the Site is at your own risk.
          </p>

          <h2>Third-Party Links and Advertisements</h2>
          <p>
            This Site may link to third-party sources for reference (e.g., government or clinical sources cited in calculator content) and displays third-party advertisements. We do not control, and are not responsible for, the content, accuracy, or practices of any linked site or advertiser.
          </p>

          <h2>Questions</h2>
          <p>
            If you have questions about this Disclaimer, contact us at <a href="mailto:contactus@holycalculator.com">contactus@holycalculator.com</a>.
          </p>
        </article>
      </div>

      <Footer />
    </main>
  );
}
