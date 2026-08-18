import Link from "next/link";
import styles from "./ConversionReferenceContent.module.css";
import { CONVERSION_FAQS } from "@/lib/data/conversionFaqs";

export default function ConversionReferenceContent() {
  return (
    <article className={styles.referenceWrapper}>
      {/* 1. Systems of Units Explainer */}
      <section className={styles.contentBlock}>
        <h2>Systems of Measurement Units</h2>
        <p>
          Throughout human history, distinct regional measurement systems developed to quantify length, mass, area, volume, and time. Today, two major international systems predominate:
        </p>

        <div className={styles.gridTwo}>
          <div className={styles.cardBox}>
            <h4>1. International System of Units (SI / Metric)</h4>
            <p style={{ fontSize: "13.5px", color: "var(--ink-60)" }}>
              The modern metric system is the universal standard for science, medicine, and global trade. It relies on decimal base-10 prefixes (kilo-, centi-, milli-) scaling systematically from base units such as the meter (m), gram (g), and liter (L).
            </p>
          </div>

          <div className={styles.cardBox}>
            <h4>2. US Customary &amp; Imperial Systems</h4>
            <p style={{ fontSize: "13.5px", color: "var(--ink-60)" }}>
              Derived from historic English units established before the American Revolution, US Customary units use historical non-decimal conversion ratios (e.g. 12 inches per foot, 16 ounces per pound, 4 quarts per gallon).
            </p>
          </div>
        </div>
      </section>

      {/* 2. Why the US Still Uses Imperial/Customary Units */}
      <section className={styles.contentBlock}>
        <h2>Why the United States Still Uses Customary Units</h2>
        <p>
          When European nations metricated during the 19th century, the United States had already built massive industrial manufacturing plants, rail networks, building construction standards, and land survey grids based on feet, inches, and acres.
        </p>
        <p>
          While the US officially recognized the metric system in 1866 and defined Customary units in terms of exact metric standards (such as defining 1 inch as exactly 2.54 cm in 1959), the immense cost of replacing machine tools, building codes, highway signs, and consumer packaging led the US to retain Customary units for domestic commerce while utilizing metric standards for scientific, medical, and military operations.
        </p>
      </section>

      {/* 3. FAQ Section */}
      <section className={styles.contentBlock}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {CONVERSION_FAQS.map((faq, index) => (
            <details key={index} className={styles.faqItem}>
              <summary className={styles.faqQuestion}>
                <span>{faq.question}</span>
                <span style={{ fontSize: "18px", color: "var(--ink)" }}>+</span>
              </summary>
              <div className={styles.faqAnswer}>{faq.answer}</div>
            </details>
          ))}
        </div>
      </section>

      {/* 4. Related Calculators */}
      <section className={styles.contentBlock}>
        <h2>Related Conversion &amp; Utility Calculators</h2>
        <div className={styles.relatedGrid}>
          <Link href="/currency-calculator" className={styles.relatedCard}>
            <div>
              <h4>Currency Calculator</h4>
              <p>Convert world currencies with live exchange rates, manual rate overrides, and popular exchange rate tables.</p>
            </div>
            <span className={styles.arrowLink}>Open Currency Tool →</span>
          </Link>

          <Link href="/date-calculator" className={styles.relatedCard}>
            <div>
              <h4>Date Calculator</h4>
              <p>Calculate exact duration between dates or add and subtract time with business day skipping.</p>
            </div>
            <span className={styles.arrowLink}>Open Date Tool →</span>
          </Link>

          <Link href="/math/percentage-calculator" className={styles.relatedCard}>
            <div>
              <h4>Percentage Calculator</h4>
              <p>Calculate basic percentages, percentage share, percentage difference, and percentage increase/decrease.</p>
            </div>
            <span className={styles.arrowLink}>Open Percentage Tool →</span>
          </Link>
        </div>
      </section>
    </article>
  );
}
