"use client";

import { useState } from "react";
import Link from "next/link";
import { AGE_FAQS } from "@/lib/data/ageFaqs";
import AdBanner from "@/components/AdBanner";
import styles from "./AgeReferenceContent.module.css";

export default function AgeReferenceContent() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className={styles.refContentSection}>
      {/* Top in-content ad banner */}
      <AdBanner />

      <div className={styles.refProse}>
        <h2>How Age Is Calculated: Western vs. Traditional Systems</h2>
        <p>
          In modern international practice, age is measured according to the <strong>Western chronological system</strong>. Under this convention, a person is considered 0 years old on the day of their birth. Their age increases by exactly one year on each annual anniversary of their birth date.
        </p>
        <p>
          However, across various cultures throughout history, different reckoning systems have evolved:
        </p>

        <div className={styles.tableCardWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Age System</th>
                <th>Age at Birth</th>
                <th>When Age Increments</th>
                <th>Common Usage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Western Chronological</strong></td>
                <td>0 years old</td>
                <td>On your specific annual birthday</td>
                <td>Global standard, legal documents, medical records</td>
              </tr>
              <tr>
                <td><strong>Traditional Chinese (Xusui)</strong></td>
                <td>1 year old</td>
                <td>First day of the Lunar New Year (Spring Festival)</td>
                <td>Chinese astrology, traditional horoscopes, genealogy</td>
              </tr>
              <tr>
                <td><strong>Traditional Korean (K-Age)*</strong></td>
                <td>1 year old</td>
                <td>On January 1st of every calendar year</td>
                <td>Historically in South Korea (officially unified to Western age in 2023)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style={{ fontSize: "12.5px", color: "var(--ink-60)", fontStyle: "italic" }}>
          *Note: South Korea officially adopted the international Western age standard for administrative, legal, and civil matters in June 2023.
        </p>

        <h2>Month-Length Mismatches &amp; Calendar Nuances</h2>
        <p>
          A common source of confusion in date arithmetic is that months in the Gregorian calendar have variable lengths (28, 29, 30, or 31 days). When calculating age in years, months, and days:
        </p>
        <ul>
          <li>
            <strong>Day Borrowing Rule:</strong> If the target day is less than the birth day, the calculation borrows the exact number of days in the preceding calendar month. For example, calculating the time between <code>Feb 28</code> and <code>Mar 31</code> yields <strong>1 month and 3 days</strong> (or 1 month in non-leap years depending on starting month), because March follows a 28-day February.
          </li>
          <li>
            <strong>Leap Years (Feb 29):</strong> Individuals born on February 29 during a leap year legally gain a year of age on March 1 (or February 28 depending on jurisdiction) during non-leap years. In total day-count calculations, leap years add an extra 24 hours of lived time.
          </li>
        </ul>

        <div className={styles.infoCard}>
          <div className={styles.infoTitle}>Calendar Rule — Exact Day Counting</div>
          <div className={styles.infoContent}>
            Total days, hours, minutes, and seconds are calculated continuously from the UTC timestamp of the start date to the target date, ensuring exact astronomical precision regardless of month-length discrepancies.
          </div>
        </div>

        {/* Related Calculators Links */}
        <div className={styles.relatedCard}>
          <h3>Explore Related Calculation Tools</h3>
          <p>Discover other instant academic and date calculation utilities on Holy Calculator:</p>
          <div className={styles.relatedGrid}>
            <Link href="/grade-calculator" className={styles.relatedLink}>
              <strong>Grade Calculator →</strong>
              <span>Calculate weighted class average &amp; final exam goal</span>
            </Link>
            <Link href="/gpa-calculator" className={styles.relatedLink}>
              <strong>GPA Calculator →</strong>
              <span>Calculate high school &amp; college cumulative GPA</span>
            </Link>
            <Link href="/#math" className={styles.relatedLink}>
              <strong>Percentage Calculator →</strong>
              <span>Calculate percentage increase &amp; differences</span>
            </Link>
            <Link href="/" className={styles.relatedLink}>
              <strong>Scientific Calculator →</strong>
              <span>Full-featured browser calculator</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Secondary In-Content Ad Banner */}
      <AdBanner />

      {/* FAQ Section */}
      <div className={styles.faqWrap}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {AGE_FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className={styles.faqItem}>
                <button
                  type="button"
                  className={styles.faqQuestion}
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <span className={`${styles.faqIcon} ${isOpen ? styles.open : ""}`}>+</span>
                </button>
                {isOpen && (
                  <div className={styles.faqAnswer}>
                    <p style={{ margin: 0 }}>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
