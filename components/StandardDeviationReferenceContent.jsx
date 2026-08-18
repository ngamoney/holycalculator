import Link from "next/link";
import styles from "./StandardDeviationReferenceContent.module.css";
import { STANDARD_DEVIATION_FAQS } from "@/lib/data/standardDeviationFaqs";

export default function StandardDeviationReferenceContent() {
  return (
    <article className={styles.referenceWrapper}>
      {/* 1. Intro */}
      <section className={styles.contentBlock}>
        <h2>What is Standard Deviation?</h2>
        <p>
          In statistics and probability theory, <strong>Standard Deviation</strong> (symbolized as <strong>σ</strong> for population or <strong>s</strong> for sample) measures the extent of dispersion or variability within a set of data values relative to their arithmetic mean.
        </p>
        <p>
          A low standard deviation indicates that the data points tend to cluster closely around the average (mean), whereas a high standard deviation indicates that data points are spread out across a wide range of values.
        </p>
      </section>

      {/* 2. Population vs. Sample Formulas */}
      <section className={styles.contentBlock}>
        <h2>Population vs. Sample Standard Deviation Equations</h2>
        <p>
          The primary mathematical distinction lies in whether your dataset includes the entire universe of interest (Population) or a subset sample selected to represent that universe (Sample):
        </p>

        <div className={styles.gridTwo}>
          <div className={styles.cardBox}>
            <h4>1. Population Standard Deviation (σ)</h4>
            <p style={{ fontSize: "13.5px", color: "var(--ink-60)" }}>
              Applied when every member of the population is measured. Uses full count <em>N</em> as the denominator.
            </p>
            <div className={styles.formulaBox} style={{ margin: "10px 0 0", fontSize: "13px" }}>
              {"σ = √ [ Σ (x - μ)² / N ]"}<br />
              {"Where μ = Population Mean, N = Population Count"}
            </div>
          </div>

          <div className={styles.cardBox}>
            <h4>2. Sample Standard Deviation (s)</h4>
            <p style={{ fontSize: "13.5px", color: "var(--ink-60)" }}>
              Applied when estimating population parameters from a sample. Uses Bessel&apos;s correction (<em>N − 1</em>) to eliminate bias.
            </p>
            <div className={styles.formulaBox} style={{ margin: "10px 0 0", fontSize: "13px" }}>
              {"s = √ [ Σ (x - x̄)² / (N - 1) ]"}<br />
              {"Where x̄ = Sample Mean, N - 1 = Degrees of Freedom"}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Step-by-Step Worked Example */}
      <section className={styles.contentBlock}>
        <h2>Step-by-Step Calculation Example</h2>
        <p>
          Let&apos;s calculate the Sample Standard Deviation for the dataset: <strong>10, 12, 23, 23, 16, 23, 21, 16</strong> (N = 8):
        </p>

        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Step</th>
                <th>Operation</th>
                <th>Resulting Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Step 1</strong></td>
                <td>Calculate the Mean (x̄ = Σx / N)</td>
                <td className={styles.monoCell}>144 / 8 = 18.0</td>
              </tr>
              <tr>
                <td><strong>Step 2</strong></td>
                <td>Subtract Mean from each data point (x - x̄)</td>
                <td className={styles.monoCell}>-8, -6, 5, 5, -2, 5, 3, -2</td>
              </tr>
              <tr>
                <td><strong>Step 3</strong></td>
                <td>Square each difference (x - x̄)²</td>
                <td className={styles.monoCell}>64, 36, 25, 25, 4, 25, 9, 4</td>
              </tr>
              <tr>
                <td><strong>Step 4</strong></td>
                <td>Sum the squared differences Σ(x - x̄)²</td>
                <td className={styles.monoCell}>Sum = 192</td>
              </tr>
              <tr>
                <td><strong>Step 5</strong></td>
                <td>Divide by N - 1 (8 - 1 = 7) for Sample Variance (s²)</td>
                <td className={styles.monoCell}>192 / 7 = 27.42857</td>
              </tr>
              <tr style={{ background: "rgba(156, 116, 32, 0.08)" }}>
                <td><strong>Step 6</strong></td>
                <td>Take Square Root for Sample SD (s)</td>
                <td className={styles.monoCell}>√27.42857 = 5.237229</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Real-World Applications */}
      <section className={styles.contentBlock}>
        <h2>Real-World Applications of Standard Deviation</h2>
        <div className={styles.cardBox} style={{ background: "var(--paper)" }}>
          <ul style={{ paddingLeft: "20px", color: "var(--ink-60)", fontSize: "14.5px", lineHeight: "1.7" }}>
            <li>
              <strong>Industrial Quality Control:</strong> Manufacturers track process variation to ensure machined parts, liquid volumes, and component dimensions remain within tight engineering tolerances.
            </li>
            <li>
              <strong>Meteorology &amp; Climate Analysis:</strong> Meteorologists evaluate temperature variations and rainfall dispersion to characterize seasonal stability versus extreme climate volatility.
            </li>
            <li>
              <strong>Investment Risk Management:</strong> In financial portfolio theory, standard deviation quantifies asset price volatility. Comparing historical returns helps investors evaluate risk-adjusted performance (e.g. Sharpe ratio).
            </li>
          </ul>
        </div>
      </section>

      {/* 5. FAQ Section */}
      <section className={styles.contentBlock}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {STANDARD_DEVIATION_FAQS.map((faq, index) => (
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

      {/* 6. Related Calculators */}
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
