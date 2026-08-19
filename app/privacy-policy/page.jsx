import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = {
  title: "Privacy Policy | Holy Calculator",
  description:
    "Learn about how Holy Calculator protects your privacy, handles information, cookies, analytics, local storage, and advertising.",
  alternates: {
    canonical: "https://holycalculator.com/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | Holy Calculator",
    description:
      "Holy Calculator Privacy Policy — details on data privacy, cookies, local storage, and user rights.",
    url: "https://holycalculator.com/privacy-policy",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | Holy Calculator",
    description: "Learn about how Holy Calculator protects your privacy.",
  },
};

export default function PrivacyPolicyPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Privacy Policy", active: true },
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
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last Updated: August 19, 2026</p>
        </header>

        <article className="static-prose">
          <p>
            Holy Calculator (&ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our,&rdquo; or &ldquo;the Site&rdquo;) operates holycalculator.com. This Privacy Policy explains what information we collect, how we use it, and the choices you have.
          </p>

          <h2>Information We Do Not Collect</h2>
          <p>
            Holy Calculator does not require account creation, login, or registration. The calculators on this Site are designed to work entirely by processing the numbers and dates you enter directly in your browser — we do not transmit or store the values you type into a calculator (loan amounts, income figures, dates of birth, health information, etc.) on our servers.
          </p>

          <h2>Information Collected Automatically</h2>
          <p>Like most websites, we automatically collect certain information when you visit:</p>
          <ul>
            <li>
              <strong>Usage data</strong>: pages visited, time spent, referring site, device/browser type, and approximate location (derived from IP address) — collected via Google Analytics (or third-party analytics provider).
            </li>
            <li>
              <strong>Cookies and similar technologies</strong>: used for basic site functionality and by our advertising partners (see below).
            </li>
          </ul>

          <h2>Local Storage</h2>
          <p>
            Some calculators use your browser&apos;s local storage to save preferences (for example, unit preference on the Calorie Calculator, or recent calculations on the Grade Calculator) so the page remembers your settings on your next visit. <strong>This information stays on your own device</strong> — it is not transmitted to or stored on our servers, and we cannot access it.
          </p>

          <h2>Advertising and Cookies</h2>
          <p>
            We display advertisements through Google AdSense and/or other third-party ad networks. These networks may use cookies, web beacons, and similar technologies to:
          </p>
          <ul>
            <li>Serve ads based on your prior visits to this and other websites</li>
            <li>Measure ad performance</li>
          </ul>
          <p>
            Google&apos;s use of advertising cookies enables it and its partners to serve ads based on your visits to this site and/or other sites on the Internet. You can opt out of personalized advertising by visiting Google Ads Settings (<a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">adssettings.google.com</a>) or <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">www.aboutads.info/choices/</a>.
          </p>
          <p>
            We do not control the cookies set by third-party ad networks and encourage you to review their respective privacy policies.
          </p>

          <h2>Shareable Links</h2>
          <p>
            Some calculators let you generate a shareable link (for example, a due-date calculator result or a loan scenario). These links encode the values you entered directly in the URL — nothing is stored on our servers when you use this feature. Anyone with the link can view the calculated result. Use discretion before sharing links that contain sensitive personal information.
          </p>

          <h2>Children&apos;s Privacy</h2>
          <p>
            Holy Calculator is not directed at children under 13, and we do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us so we can address it.
          </p>

          <h2>Your Rights</h2>
          <p>
            Depending on your location, you may have rights to access, correct, or request deletion of personal data we hold about you, and to opt out of certain data processing (including &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; of data under laws like the CCPA). Because we collect minimal personal data directly, most requests will relate to analytics or advertising cookies — see the opt-out links above, or contact us at <a href="mailto:contactus@holycalculator.com">contactus@holycalculator.com</a>.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The &ldquo;Last Updated&rdquo; date above reflects the most recent revision. Continued use of the Site after changes constitutes acceptance of the updated policy.
          </p>

          <h2>Contact Us</h2>
          <p>
            Questions about this Privacy Policy can be sent to <a href="mailto:contactus@holycalculator.com">contactus@holycalculator.com</a>.
          </p>
        </article>
      </div>

      <Footer />
    </main>
  );
}
