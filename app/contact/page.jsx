import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = {
  title: "Contact Us | Holy Calculator",
  description:
    "Get in touch with Holy Calculator for feedback, calculator suggestions, corrections, or bug reports.",
  alternates: {
    canonical: "https://www.holycalculator.com/contact",
  },
  openGraph: {
    title: "Contact Us | Holy Calculator",
    description:
      "Contact Holy Calculator — reach out for questions, calculation feedback, or feature requests.",
    url: "https://www.holycalculator.com/contact",
    siteName: "Holy Calculator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact Us | Holy Calculator",
    description: "Get in touch with Holy Calculator.",
  },
};

export default function ContactPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Contact Us", active: true },
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
          <h1>Contact Us</h1>
        </header>

        <article className="static-prose">
          <p>
            We&apos;d like to hear from you — whether it&apos;s a bug report, a correction, a calculator suggestion, or a general inquiry.
          </p>

          <h2>Get in Touch</h2>
          <div className="contact-info-card">
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:contactus@holycalculator.com">
                contactus@holycalculator.com
              </a>
            </p>
          </div>

          <p>For fastest response, please include:</p>
          <ul>
            <li>Which calculator you&apos;re reaching out about (if applicable)</li>
            <li>A brief description of the issue, suggestion, or question</li>
            <li>Screenshots, if reporting a display or calculation issue</li>
          </ul>

          <h2>What We Can Help With</h2>
          <ul>
            <li>Reporting a calculation error or bug</li>
            <li>Suggesting a new calculator or feature</li>
            <li>General feedback on the Site</li>
            <li>Business or partnership inquiries</li>
            <li>Privacy or data questions (see also our <a href="/privacy-policy">Privacy Policy</a>)</li>
          </ul>

          <h2>What We Can&apos;t Provide</h2>
          <p>
            Please note that we are not able to provide personalized financial, medical, tax, or legal advice. For guidance specific to your situation, please consult a licensed professional.
          </p>
        </article>
      </div>

      <Footer />
    </main>
  );
}
