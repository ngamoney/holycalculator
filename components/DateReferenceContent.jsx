import Link from "next/link";
import styles from "./DateReferenceContent.module.css";
import { DATE_FAQS } from "@/lib/data/dateFaqs";

export default function DateReferenceContent() {
  return (
    <article className={styles.referenceWrapper}>
      {/* 1. Intro */}
      <section className={styles.contentBlock}>
        <h2>How the Date Calculator Works</h2>
        <p>
          The <strong>Date Calculator</strong> processes calendar intervals using the standard international <strong>Gregorian Calendar</strong>. It operates in two primary modes: <strong>Days Between Two Dates</strong> (calculating exact elapsed time in years, months, weeks, and days) and <strong>Add or Subtract Time</strong> (adding or subtracting specific time intervals, with optional business-day skipping for weekends and US federal holidays).
        </p>
      </section>

      {/* 2. Gregorian Calendar & Leap Year Rules */}
      <section className={styles.contentBlock}>
        <h2>The Gregorian Calendar &amp; Leap Year Math</h2>
        <p>
          First decreed by Pope Gregory XIII in October 1582 to correct the drift of the Julian calendar relative to solar equinoxes, the Gregorian calendar establishes a mean calendar year of 365.2425 days.
        </p>

        <div className={styles.cardBox} style={{ background: "var(--paper)" }}>
          <h4>Leap Year Rules</h4>
          <ul style={{ paddingLeft: "20px", color: "var(--ink-60)", fontSize: "14.5px", lineHeight: "1.7" }}>
            <li>Every year that is evenly divisible by 4 is a leap year (adding February 29th)...</li>
            <li><strong>Except</strong> for century years (ending in 00), which are NOT leap years...</li>
            <li><strong>Unless</strong> the century year is also evenly divisible by 400 (for example, 2000 was a leap year, but 1900 was not, and 2100 will not be).</li>
          </ul>
        </div>
      </section>

      {/* 3. US Federal & Observed Holidays Guide */}
      <section className={styles.contentBlock}>
        <h2>Fixed vs. Floating US Federal Holidays</h2>
        <p>
          Business day calculation requires distinguishing between fixed-date holidays and floating-weekday holidays:
        </p>

        <div className={styles.gridTwo}>
          <div className={styles.cardBox}>
            <h4>Fixed-Date Holidays</h4>
            <p style={{ fontSize: "13.5px", color: "var(--ink-60)" }}>
              Occur on the exact same month and calendar day every year, regardless of weekday.
            </p>
            <ul style={{ paddingLeft: "18px", fontSize: "13px", color: "var(--ink-60)", marginTop: "8px", lineHeight: "1.6" }}>
              <li><strong>New Year&apos;s Day:</strong> January 1</li>
              <li><strong>Juneteenth:</strong> June 19</li>
              <li><strong>Independence Day:</strong> July 4</li>
              <li><strong>Veterans Day:</strong> November 11</li>
              <li><strong>Christmas Day:</strong> December 25</li>
            </ul>
          </div>

          <div className={styles.cardBox}>
            <h4>Floating-Weekday Holidays</h4>
            <p style={{ fontSize: "13.5px", color: "var(--ink-60)" }}>
              Occur on a specific day of the week relative to the month (e.g. 3rd Monday).
            </p>
            <ul style={{ paddingLeft: "18px", fontSize: "13px", color: "var(--ink-60)", marginTop: "8px", lineHeight: "1.6" }}>
              <li><strong>MLK Jr. Day:</strong> 3rd Monday in January</li>
              <li><strong>Presidents&apos; Day:</strong> 3rd Monday in February</li>
              <li><strong>Memorial Day:</strong> Last Monday in May</li>
              <li><strong>Labor Day:</strong> 1st Monday in September</li>
              <li><strong>Thanksgiving:</strong> 4th Thursday in November</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. 2026 & 2027 US Federal Holidays Reference Table */}
      <section className={styles.contentBlock}>
        <h2>US Federal &amp; Observed Holiday Dates (2026 – 2027)</h2>
        <p>
          Reference list of official US federal closures for the current and upcoming calendar years:
        </p>

        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Holiday Name</th>
                <th>2026 Date</th>
                <th>2027 Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>New Year&apos;s Day</td>
                <td className={styles.monoCell}>Thu, Jan 1, 2026</td>
                <td className={styles.monoCell}>Fri, Jan 1, 2027</td>
              </tr>
              <tr>
                <td>Martin Luther King Jr. Day</td>
                <td className={styles.monoCell}>Mon, Jan 19, 2026</td>
                <td className={styles.monoCell}>Mon, Jan 18, 2027</td>
              </tr>
              <tr>
                <td>Presidents&apos; Day</td>
                <td className={styles.monoCell}>Mon, Feb 16, 2026</td>
                <td className={styles.monoCell}>Mon, Feb 15, 2027</td>
              </tr>
              <tr>
                <td>Memorial Day</td>
                <td className={styles.monoCell}>Mon, May 25, 2026</td>
                <td className={styles.monoCell}>Mon, May 31, 2027</td>
              </tr>
              <tr>
                <td>Juneteenth National Independence Day</td>
                <td className={styles.monoCell}>Fri, Jun 19, 2026</td>
                <td className={styles.monoCell}>Sat, Jun 19, 2027 (Observed Jun 18)</td>
              </tr>
              <tr>
                <td>Independence Day</td>
                <td className={styles.monoCell}>Sat, Jul 4, 2026 (Observed Jul 3)</td>
                <td className={styles.monoCell}>Sun, Jul 4, 2027 (Observed Jul 5)</td>
              </tr>
              <tr>
                <td>Labor Day</td>
                <td className={styles.monoCell}>Mon, Sep 7, 2026</td>
                <td className={styles.monoCell}>Mon, Sep 6, 2027</td>
              </tr>
              <tr>
                <td>Columbus Day / Indigenous Peoples&apos; Day</td>
                <td className={styles.monoCell}>Mon, Oct 12, 2026</td>
                <td className={styles.monoCell}>Mon, Oct 11, 2027</td>
              </tr>
              <tr>
                <td>Veterans Day</td>
                <td className={styles.monoCell}>Wed, Nov 11, 2026</td>
                <td className={styles.monoCell}>Thu, Nov 11, 2027</td>
              </tr>
              <tr>
                <td>Thanksgiving Day</td>
                <td className={styles.monoCell}>Thu, Nov 26, 2026</td>
                <td className={styles.monoCell}>Thu, Nov 25, 2027</td>
              </tr>
              <tr>
                <td>Christmas Day</td>
                <td className={styles.monoCell}>Fri, Dec 25, 2026</td>
                <td className={styles.monoCell}>Sat, Dec 25, 2027 (Observed Dec 24)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. FAQ Section */}
      <section className={styles.contentBlock}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {DATE_FAQS.map((faq, index) => (
            <details key={index} className={styles.faqItem}>
              <summary className={styles.faqQuestion}>
                <span>{faq.question}</span>
                <span style={{ fontSize: "18px", color: "#7A6A55" }}>+</span>
              </summary>
              <div className={styles.faqAnswer}>{faq.answer}</div>
            </details>
          ))}
        </div>
      </section>

      {/* 6. Related Calculators */}
      <section className={styles.contentBlock}>
        <h2>Related Date &amp; Time Calculators</h2>
        <div className={styles.relatedGrid}>
          <Link href="/date-time/time-zone-calculator" className={styles.relatedCard}>
            <div>
              <h4>Time Zone Calculator</h4>
              <p>Convert time across world UTC offsets, compute time differences, and handle day rollovers.</p>
            </div>
            <span className={styles.arrowLink}>Open Time Zone Tool →</span>
          </Link>

          <Link href="/age-calculator" className={styles.relatedCard}>
            <div>
              <h4>Age Calculator</h4>
              <p>Calculate exact chronological age in years, months, days, hours, and seconds from birth date.</p>
            </div>
            <span className={styles.arrowLink}>Open Age Tool →</span>
          </Link>

          <Link href="/pregnancy-calculator" className={styles.relatedCard}>
            <div>
              <h4>Pregnancy Due Date Calculator</h4>
              <p>Estimate due dates, gestational age in weeks and days, and trimester developmental milestones.</p>
            </div>
            <span className={styles.arrowLink}>Open Pregnancy Tool →</span>
          </Link>
        </div>
      </section>
    </article>
  );
}
