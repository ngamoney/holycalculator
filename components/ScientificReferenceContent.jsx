"use client";

import { useState } from "react";
import styles from "./ScientificReferenceContent.module.css";
import { SCIENTIFIC_FAQS } from "@/lib/data/scientificFaqs";

export default function ScientificReferenceContent() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const toggleFaq = (index) => setOpenFaqIndex(openFaqIndex === index ? null : index);

  return (
    <section className={styles.refSection}>
      <div className={styles.refContainer}>
        <h2 className={styles.blockHeading}>Scientific Calculator Function Cheatsheet</h2>
        <p className={styles.paragraph}>
          Scientific calculators handle complex algebraic, trigonometric, logarithmic, and exponential operations beyond basic arithmetic.
        </p>

        <div className={styles.tableCardWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Function</th>
                <th>Button Key</th>
                <th>Mathematical Meaning</th>
                <th>Example</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Sine / ArcSine</strong></td>
                <td className={styles.monoCell}>sin / sin⁻¹</td>
                <td>Trigonometric sine ratio (opposite / hypotenuse)</td>
                <td className={styles.monoCell}>sin(30°) = 0.5</td>
              </tr>
              <tr>
                <td><strong>Cosine / ArcCosine</strong></td>
                <td className={styles.monoCell}>cos / cos⁻¹</td>
                <td>Trigonometric cosine ratio (adjacent / hypotenuse)</td>
                <td className={styles.monoCell}>cos(60°) = 0.5</td>
              </tr>
              <tr>
                <td><strong>Tangent / ArcTangent</strong></td>
                <td className={styles.monoCell}>tan / tan⁻¹</td>
                <td>Trigonometric tangent ratio (opposite / adjacent)</td>
                <td className={styles.monoCell}>tan(45°) = 1</td>
              </tr>
              <tr>
                <td><strong>Logarithm (Base 10)</strong></td>
                <td className={styles.monoCell}>log</td>
                <td>Common logarithm (power of 10)</td>
                <td className={styles.monoCell}>log(1000) = 3</td>
              </tr>
              <tr>
                <td><strong>Natural Logarithm</strong></td>
                <td className={styles.monoCell}>ln</td>
                <td>Logarithm to natural base e (e ≈ 2.71828)</td>
                <td className={styles.monoCell}>ln(e) = 1</td>
              </tr>
              <tr>
                <td><strong>Exponents &amp; Roots</strong></td>
                <td className={styles.monoCell}>xʸ / √</td>
                <td>Raises base to power y or evaluates square root</td>
                <td className={styles.monoCell}>2^10 = 1024, √(144) = 12</td>
              </tr>
              <tr>
                <td><strong>Factorial</strong></td>
                <td className={styles.monoCell}>n!</td>
                <td>Product of all positive integers ≤ n</td>
                <td className={styles.monoCell}>5! = 120</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className={styles.blockHeading}>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {SCIENTIFIC_FAQS.map((faq, index) => {
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
                  <span>{isOpen ? "−" : "+"}</span>
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
