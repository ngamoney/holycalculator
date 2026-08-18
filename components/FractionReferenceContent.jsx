import Link from "next/link";
import styles from "./FractionReferenceContent.module.css";
import { FRACTION_FAQS } from "@/lib/data/fractionFaqs";

export default function FractionReferenceContent() {
  return (
    <article className={styles.referenceWrapper}>
      {/* 1. Intro */}
      <section className={styles.contentBlock}>
        <h2>What is a Fraction?</h2>
        <p>
          A <strong>fraction</strong> represents a part of a whole quantity or a ratio between two integers. Think of a pie sliced into equal portions: the <strong>denominator</strong> (bottom number) represents the total number of equal slices in the pie, while the <strong>numerator</strong> (top number) represents how many slices you currently have.
        </p>
        <p>
          In a proper fraction, the numerator is smaller than the denominator (e.g. 3/4). In an improper fraction, the numerator is greater than or equal to the denominator (e.g. 7/4), which can also be written as a mixed number (1 3/4).
        </p>
      </section>

      {/* 2. Four Basic Operations Guide */}
      <section className={styles.contentBlock}>
        <h2>How to Perform Fraction Operations</h2>
        <p>
          The four basic arithmetic operations each follow distinct algebraic rules:
        </p>

        <div className={styles.gridTwo}>
          <div className={styles.cardBox}>
            <h4>1. Addition &amp; Subtraction</h4>
            <p style={{ fontSize: "13.5px", color: "var(--ink-60)" }}>
              Fractions must share a common denominator before numerators can be added or subtracted.
            </p>
            <div className={styles.formulaBox} style={{ margin: "10px 0 0", fontSize: "12.5px" }}>
              {"a/b + c/d = (a·d + b·c) / (b·d)"}<br />
              {"Example: 1/2 + 1/3 = (3 + 2) / 6 = 5/6"}
            </div>
          </div>

          <div className={styles.cardBox}>
            <h4>2. Multiplication</h4>
            <p style={{ fontSize: "13.5px", color: "var(--ink-60)" }}>
              Multiply numerators together and denominators together directly.
            </p>
            <div className={styles.formulaBox} style={{ margin: "10px 0 0", fontSize: "12.5px" }}>
              {"(a/b) × (c/d) = (a·c) / (b·d)"}<br />
              {"Example: 3/4 × 2/3 = 6/12 = 1/2"}
            </div>
          </div>

          <div className={styles.cardBox}>
            <h4>3. Division (Reciprocal Method)</h4>
            <p style={{ fontSize: "13.5px", color: "var(--ink-60)" }}>
              Multiply the first fraction by the reciprocal (flipped version) of the second.
            </p>
            <div className={styles.formulaBox} style={{ margin: "10px 0 0", fontSize: "12.5px" }}>
              {"(a/b) ÷ (c/d) = (a/b) × (d/c) = (a·d) / (b·c)"}<br />
              {"Example: 1/2 ÷ 3/4 = 1/2 × 4/3 = 4/6 = 2/3"}
            </div>
          </div>

          <div className={styles.cardBox}>
            <h4>4. Simplification (GCD Reduction)</h4>
            <p style={{ fontSize: "13.5px", color: "var(--ink-60)" }}>
              Divide both numerator and denominator by their Greatest Common Divisor.
            </p>
            <div className={styles.formulaBox} style={{ margin: "10px 0 0", fontSize: "12.5px" }}>
              {"Simplify: GCD(24, 36) = 12"}<br />
              {"24 ÷ 12 / 36 ÷ 12 = 2/3"}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Decimal ↔ Fraction Conversions */}
      <section className={styles.contentBlock}>
        <h2>Converting Between Decimals &amp; Fractions</h2>
        <p>
          Converting decimals to fractions involves converting the decimal portion into a power-of-10 ratio:
        </p>

        <div className={styles.cardBox} style={{ background: "var(--paper)" }}>
          <ul style={{ paddingLeft: "20px", color: "var(--ink-60)", fontSize: "14.5px", lineHeight: "1.7" }}>
            <li>
              <strong>Decimal to Fraction:</strong> Count the digits after the decimal point to form the power-of-10 denominator (e.g. 0.375 has 3 digits, giving 375/1000). Reduce by the GCD (125) to get 3/8.
            </li>
            <li>
              <strong>Fraction to Decimal:</strong> Perform simple division of the numerator by the denominator (e.g. 3 ÷ 8 = 0.375).
            </li>
          </ul>
        </div>
      </section>

      {/* 4. FAQ Section */}
      <section className={styles.contentBlock}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {FRACTION_FAQS.map((faq, index) => (
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
          <Link href="/math/percentage-calculator" className={styles.relatedCard}>
            <div>
              <h4>Percentage Calculator</h4>
              <p>Calculate basic percentages, percentage share, percentage difference, and percentage increase/decrease.</p>
            </div>
            <span className={styles.arrowLink}>Open Percentage Tool →</span>
          </Link>

          <Link href="/math/standard-deviation-calculator" className={styles.relatedCard}>
            <div>
              <h4>Standard Deviation Calculator</h4>
              <p>Calculate population and sample standard deviation, variance, mean, and 95% margin of error.</p>
            </div>
            <span className={styles.arrowLink}>Open Std Dev Tool →</span>
          </Link>

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
        </div>
      </section>
    </article>
  );
}
