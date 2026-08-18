import Link from "next/link";
import styles from "./PercentageReferenceContent.module.css";
import { PERCENTAGE_FAQS } from "@/lib/data/percentageFaqs";

export default function PercentageReferenceContent() {
  return (
    <article className={styles.referenceWrapper}>
      {/* 1. Intro */}
      <section className={styles.contentBlock}>
        <h2>What is a Percentage?</h2>
        <p>
          A <strong>percentage</strong> (from the Latin <em>per centum</em> meaning &quot;by the hundred&quot;) is a mathematical ratio or fraction expressed as a fraction of 100. It is denoted using the percent symbol (<strong>%</strong>). Percentages allow seamless comparison of proportions regardless of the absolute starting size.
        </p>
      </section>

      {/* 2. Formulas & Worked Numerical Examples */}
      <section className={styles.contentBlock}>
        <h2>Percentage Formulas &amp; Worked Examples</h2>
        <p>
          Understanding the three primary mathematical percentage formulas helps in solving everyday financial and academic calculations:
        </p>

        <div className={styles.gridTwo}>
          <div className={styles.cardBox}>
            <h4>1. Basic Percentage Formula</h4>
            <p style={{ fontSize: "13.5px", color: "var(--ink-60)" }}>
              Find a specific percentage portion of a base number.
            </p>
            <div className={styles.formulaBox} style={{ margin: "10px 0 0", fontSize: "12.5px" }}>
              {"Value = (Percentage ÷ 100) × Base"}<br />
              {"Example: 15% of $200 = (15 ÷ 100) × 200 = $30"}
            </div>
          </div>

          <div className={styles.cardBox}>
            <h4>2. Percentage Share Formula</h4>
            <p style={{ fontSize: "13.5px", color: "var(--ink-60)" }}>
              Determine what percent a part represents relative to a total whole.
            </p>
            <div className={styles.formulaBox} style={{ margin: "10px 0 0", fontSize: "12.5px" }}>
              {"Percentage = (Part ÷ Whole) × 100"}<br />
              {"Example: 30 out of 200 = (30 ÷ 200) × 100 = 15%"}
            </div>
          </div>

          <div className={styles.cardBox}>
            <h4>3. Percentage Difference Formula</h4>
            <p style={{ fontSize: "13.5px", color: "var(--ink-60)" }}>
              Compare two numbers without designating an initial starting baseline.
            </p>
            <div className={styles.formulaBox} style={{ margin: "10px 0 0", fontSize: "12.5px" }}>
              {"Diff = |V1 - V2| ÷ ((V1 + V2) ÷ 2) × 100"}<br />
              {"Example: 100 & 150 = |50| ÷ 125 × 100 = 40%"}
            </div>
          </div>

          <div className={styles.cardBox}>
            <h4>4. Percentage Change Formula</h4>
            <p style={{ fontSize: "13.5px", color: "var(--ink-60)" }}>
              Calculate the resulting total after increasing or decreasing by a percentage.
            </p>
            <div className={styles.formulaBox} style={{ margin: "10px 0 0", fontSize: "12.5px" }}>
              {"Final = Base × (1 ± (Percentage ÷ 100))"}<br />
              {"Example: $100 + 20% = 100 × 1.20 = $120"}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Practical Everyday Applications */}
      <section className={styles.contentBlock}>
        <h2>Common Real-World Applications</h2>
        <div className={styles.cardBox} style={{ background: "var(--paper)" }}>
          <ul style={{ paddingLeft: "20px", color: "var(--ink-60)", fontSize: "14.5px", lineHeight: "1.7" }}>
            <li>
              <strong>Retail Shopping Discounts:</strong> Calculate final sale prices during store promotions (e.g. 25% off a $80 jacket = $60 final price).
            </li>
            <li>
              <strong>Sales Tax &amp; Gratuity (Tips):</strong> Compute total bill costs including state sales tax or restaurant tipping (e.g. 18% tip on a $50 dinner = $9 tip).
            </li>
            <li>
              <strong>Academic Test Scores:</strong> Convert raw test scores into percentages to calculate course grades and GPAs.
            </li>
            <li>
              <strong>Financial Interest Rates:</strong> Determine yield returns, credit card APR fees, and loan interest accrual over time.
            </li>
          </ul>
        </div>
      </section>

      {/* 4. FAQ Section */}
      <section className={styles.contentBlock}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {PERCENTAGE_FAQS.map((faq, index) => (
            <details key={index} className={styles.faqItem}>
              <summary className={styles.faqQuestion}>
                <span>{faq.question}</span>
                <span style={{ fontSize: "18px", color: "#9C7420" }}>+</span>
              </summary>
              <div className={styles.faqAnswer}>{faq.answer}</div>
            </details>
          ))}
        </div>
      </section>

      {/* 5. Related Calculators */}
      <section className={styles.contentBlock}>
        <h2>Related Math Calculators</h2>
        <div className={styles.relatedGrid}>
          <Link href="/grade-calculator" className={styles.relatedCard}>
            <div>
              <h4>Grade Calculator</h4>
              <p>Calculate weighted class grades and determine the exact score needed on your final exam.</p>
            </div>
            <span className={styles.arrowLink}>Open Grade Tool →</span>
          </Link>

          <Link href="/gpa-calculator" className={styles.relatedCard}>
            <div>
              <h4>GPA Calculator</h4>
              <p>Calculate high school and college Grade Point Average with weighted and unweighted credits.</p>
            </div>
            <span className={styles.arrowLink}>Open GPA Tool →</span>
          </Link>

          <Link href="/date-calculator" className={styles.relatedCard}>
            <div>
              <h4>Date Calculator</h4>
              <p>Calculate duration between dates or add and subtract time with business day skipping.</p>
            </div>
            <span className={styles.arrowLink}>Open Date Tool →</span>
          </Link>
        </div>
      </section>
    </article>
  );
}
