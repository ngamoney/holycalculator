"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./AverageReferenceContent.module.css";
import { AVERAGE_FAQS } from "@/lib/data/averageFaqs";

export default function AverageReferenceContent() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className={styles.refSection}>
      <div className={styles.refContainer}>
        {/* Section 1: Statistical Averages Overview */}
        <h2 className={styles.blockHeading}>Understanding Averages &amp; Central Tendency</h2>
        <p className={styles.paragraph}>
          In statistics and mathematics, an <strong>average</strong> is a single numerical value used to represent the central or typical value of a set of data. The three most common measures of central tendency are the <strong>Arithmetic Mean</strong>, <strong>Median</strong>, and <strong>Mode</strong>.
        </p>

        <h3 className={styles.subHeading}>1. Arithmetic Mean</h3>
        <p className={styles.paragraph}>
          The Arithmetic Mean is the standard average most people refer to in daily life. It is calculated by taking the sum of all values in the dataset and dividing by the total count of numbers:
        </p>
        <div className={styles.formulaBox}>
          Mean (x̄) = (x₁ + x₂ + ... + xₙ) / n = Σx / n
        </div>

        <h3 className={styles.subHeading}>2. Median</h3>
        <p className={styles.paragraph}>
          The Median is the exact middle value when a dataset is arranged in ascending order. If the dataset contains an odd number of items, the median is the center number. If the dataset contains an even number of items, the median is the average of the two middle numbers. The median is especially useful for analyzing datasets with extreme outliers (such as home prices or income levels).
        </p>

        <h3 className={styles.subHeading}>3. Mode</h3>
        <p className={styles.paragraph}>
          The Mode is the value that occurs most frequently in a dataset. A dataset may have one mode (unimodal), multiple modes (bimodal or multimodal), or no mode at all if all values appear with equal frequency.
        </p>

        <h3 className={styles.subHeading}>4. Range</h3>
        <p className={styles.paragraph}>
          The Range represents the total mathematical spread between the largest and smallest numbers in the dataset:
        </p>
        <div className={styles.formulaBox}>
          Range = Maximum Value − Minimum Value
        </div>

        {/* Section 2: Specialized Averages */}
        <h2 className={styles.blockHeading}>Geometric, Harmonic &amp; Weighted Averages</h2>
        <p className={styles.paragraph}>
          In addition to the standard arithmetic mean, specialized statistical metrics are required for specific mathematical contexts:
        </p>
        <ul className={styles.paragraph} style={{ paddingLeft: "20px" }}>
          <li>
            <strong>Weighted Average:</strong> Used when data values contribute unequally to the final total. Each value is multiplied by an assigned weight (such as course credit hours or exam percentage weights):
            <div className={styles.formulaBox}>
              Weighted Mean = Σ(xᵢ · wᵢ) / Σwᵢ
            </div>
          </li>
          <li>
            <strong>Geometric Mean:</strong> Used for calculating average growth rates, interest compounding, or ratios. It multiplies all positive numbers together and takes the n-th root:
            <div className={styles.formulaBox}>
              Geometric Mean = ⁿ√(x₁ · x₂ · ... · xₙ)
            </div>
          </li>
          <li>
            <strong>Harmonic Mean:</strong> Used for calculating average rates or ratios across fixed distances (such as average speed for round trips):
            <div className={styles.formulaBox}>
              Harmonic Mean = n / (1/x₁ + 1/x₂ + ... + 1/xₙ)
            </div>
          </li>
        </ul>

        {/* Section 3: Mean vs Median Comparison */}
        <h2 className={styles.blockHeading}>When to Use Mean vs. Median</h2>
        <p className={styles.paragraph}>
          Choosing between the Mean and Median depends on the symmetry and spread of your data:
        </p>
        <ul className={styles.paragraph} style={{ paddingLeft: "20px" }}>
          <li><strong>Use the Mean</strong> when data is normally distributed without extreme outliers (e.g., student test scores, height measurements, daily temperature).</li>
          <li><strong>Use the Median</strong> when data is heavily skewed or contains extreme values (e.g., net worth, real estate prices, salaries), as outliers distort the arithmetic mean.</li>
        </ul>

        {/* FAQ Section */}
        <h2 className={styles.blockHeading}>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {AVERAGE_FAQS.map((faq, index) => {
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

        {/* Related Math Calculators */}
        <h2 className={styles.blockHeading}>Related Math &amp; Academic Calculators</h2>
        <div className={styles.relatedGrid}>
          <Link href="/math/standard-deviation-calculator" className={styles.relatedCard}>
            <div>
              <h3 className={styles.relatedCardTitle}>Standard Deviation Calculator</h3>
              <p className={styles.relatedCardDesc}>
                Calculate population and sample standard deviation, variance, and confidence intervals.
              </p>
            </div>
          </Link>
          <Link href="/grade-calculator" className={styles.relatedCard}>
            <div>
              <h3 className={styles.relatedCardTitle}>Grade Calculator</h3>
              <p className={styles.relatedCardDesc}>
                Calculate weighted class grades and determine the exact score needed on your final exam.
              </p>
            </div>
          </Link>
          <Link href="/gpa-calculator" className={styles.relatedCard}>
            <div>
              <h3 className={styles.relatedCardTitle}>GPA Calculator</h3>
              <p className={styles.relatedCardDesc}>
                Calculate high school and college cumulative GPA with weighted and unweighted credits.
              </p>
            </div>
          </Link>
          <Link href="/math/percentage-calculator" className={styles.relatedCard}>
            <div>
              <h3 className={styles.relatedCardTitle}>Percentage Calculator</h3>
              <p className={styles.relatedCardDesc}>
                Calculate basic percentages, percentage differences, and percentage increases or decreases.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
