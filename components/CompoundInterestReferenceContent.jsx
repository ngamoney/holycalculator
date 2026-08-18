import { COMPOUND_INTEREST_FAQS } from "@/lib/data/compoundInterestFaqs";
import Link from "next/link";
import styles from "./CompoundInterestReferenceContent.module.css";

export default function CompoundInterestReferenceContent() {
  return (
    <article className={styles.referenceArticle}>
      {/* 1. Simple vs Compound Interest */}
      <section className={styles.section}>
        <h2>Simple Interest vs. Compound Interest</h2>
        <p>
          Understanding the difference between simple and compound interest is fundamental to personal financial growth.
          Simple interest is calculated exclusively on your original principal, while compound interest is calculated on both the principal and all accumulated interest from prior periods.
        </p>

        <div className={styles.comparisonGrid}>
          <div className={styles.compCard}>
            <h3>Simple Interest Worked Example</h3>
            <p className={styles.compVal}>$120.00</p>
            <p>
              Investing <strong>$100 at 10% simple annual interest</strong> for 2 years generates exactly $10 in Year 1 and $10 in Year 2 ($100 principal + $20 interest).
            </p>
          </div>

          <div className={`${styles.compCard} ${styles.highlightCompCard}`}>
            <h3>Compound Interest Worked Example</h3>
            <p className={styles.compVal}>$121.00</p>
            <p>
              Investing <strong>$100 at 10% annual compound interest</strong> yields $110 at the end of Year 1 ($100 principal + $10 interest).
              In Year 2, the 10% interest applies to the new $110 balance, earning $11 in Year 2 ($100 principal + $21 total interest).
            </p>
          </div>
        </div>
      </section>

      {/* 2. Mathematical Formulas */}
      <section className={styles.section}>
        <h2>The Mathematical Formulas for Compound Interest</h2>

        <div className={styles.formulaBox}>
          <h3>1. Standard Periodic Compounding Formula</h3>
          <p className={styles.formulaText}>
            A = P &middot; (1 + r / n)<sup>(n &middot; t)</sup>
          </p>
          <ul className={styles.formulaLegend}>
            <li><strong>A:</strong> Future value of the investment balance</li>
            <li><strong>P:</strong> Initial principal investment</li>
            <li><strong>r:</strong> Nominal annual interest rate (as a decimal)</li>
            <li><strong>n:</strong> Compounding frequency per year (12 for monthly, 365 for daily)</li>
            <li><strong>t:</strong> Investment horizon in years</li>
          </ul>
        </div>

        <div className={styles.formulaBox}>
          <h3>2. Continuous Compounding Formula (using e)</h3>
          <p className={styles.formulaText}>
            A = P &middot; e<sup>(r &middot; t)</sup>
          </p>
          <ul className={styles.formulaLegend}>
            <li><strong>e:</strong> Euler&rsquo;s mathematical constant (&asymp; 2.71828)</li>
            <li><strong>r &amp; t:</strong> Annual rate decimal and timeline in years</li>
          </ul>
        </div>
      </section>

      {/* 3. The Rule of 72 */}
      <section className={styles.section}>
        <h2>The Rule of 72: Doubling Estimation</h2>
        <p>
          The <strong>Rule of 72</strong> is a popular mental shortcut to estimate how long it takes for an investment to double at a fixed interest rate.
          Simply divide 72 by the annual interest rate percentage ($T \approx 72 / r$).
        </p>

        <div className={styles.ruleTableWrapper}>
          <table className={styles.ruleTable}>
            <thead>
              <tr>
                <th>Annual Rate (%)</th>
                <th>Rule of 72 Estimate</th>
                <th>Exact Mathematical Doubling Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>4.0%</strong></td>
                <td>18.0 Years</td>
                <td>17.67 Years</td>
              </tr>
              <tr>
                <td><strong>6.0%</strong></td>
                <td>12.0 Years</td>
                <td>11.90 Years</td>
              </tr>
              <tr>
                <td><strong>7.2%</strong></td>
                <td>10.0 Years</td>
                <td>9.97 Years</td>
              </tr>
              <tr>
                <td><strong>8.0%</strong></td>
                <td>9.0 Years</td>
                <td>9.01 Years</td>
              </tr>
              <tr>
                <td><strong>10.0%</strong></td>
                <td>7.2 Years</td>
                <td>7.27 Years</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className={styles.caveatNote}>
          <em>Note: The Rule of 72 is an approximation that works best for interest rates between 5% and 10%. At very high interest rates, logarithmic calculation is required for precision.</em>
        </p>
      </section>

      {/* 4. Brief History of Compound Interest */}
      <section className={styles.section}>
        <h2>A Brief History of Compound Interest</h2>
        <p>
          Compound interest has been recognized since antiquity. Historical clay tablets from ancient Babylon and Sumer (circa 2000 BCE) reveal that ancient merchants calculated compound interest on grain and silver loans.
        </p>
        <p>
          In 1683, Swiss mathematician <strong>Jacob Bernoulli</strong> studied the problem of continuous compounding: if an account paying 100% interest compounded annually yields $2 at year end, what happens if interest compounds monthly, daily, or infinitely often?
          Bernoulli proved that as compounding frequency approaches infinity, the growth approaches a mathematical limit — discovering the fundamental mathematical constant <strong>e &asymp; 2.71828</strong>.
        </p>
      </section>

      {/* 5. Related Calculators Hub */}
      <section className={styles.section}>
        <h2>Related Financial Calculators</h2>
        <div className={styles.hubGrid}>
          <Link href="/retirement-calculator" className={styles.hubCard}>
            <div className={styles.hubIcon}>🌴</div>
            <div className={styles.hubContent}>
              <h3>Retirement Calculator</h3>
              <p>Project long-term compound growth toward your specific retirement savings nest egg.</p>
              <span className={styles.hubLinkText}>Open Retirement Calculator →</span>
            </div>
          </Link>

          <Link href="/loan-calculator" className={styles.hubCard}>
            <div className={styles.hubIcon}>💳</div>
            <div className={styles.hubContent}>
              <h3>Generic Loan Calculator</h3>
              <p>See how compound interest works against borrowers across 9 compounding frequencies.</p>
              <span className={styles.hubLinkText}>Open Loan Calculator →</span>
            </div>
          </Link>

          <Link href="/mortgage-calculator" className={styles.hubCard}>
            <div className={styles.hubIcon}>🏠</div>
            <div className={styles.hubContent}>
              <h3>Mortgage Calculator</h3>
              <p>Calculate 30-year home financing, interest costs, and full amortization schedules.</p>
              <span className={styles.hubLinkText}>Open Mortgage Calculator →</span>
            </div>
          </Link>
        </div>
      </section>

      {/* 6. Frequently Asked Questions */}
      <section className={styles.section}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {COMPOUND_INTEREST_FAQS.map((faq, idx) => (
            <div key={idx} className={styles.faqItem}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
