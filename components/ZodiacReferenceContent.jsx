"use client";

import { useState } from "react";
import styles from "./ZodiacReferenceContent.module.css";
import { ZODIAC_FAQS } from "@/lib/data/zodiacFaqs";
import { ZODIAC_SIGNS } from "@/lib/calculations/zodiac";

export default function ZodiacReferenceContent() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const toggleFaq = (index) => setOpenFaqIndex(openFaqIndex === index ? null : index);

  const signs = Object.values(ZODIAC_SIGNS);

  return (
    <section className={styles.refSection}>
      <div className={styles.refContainer}>
        <h2 className={styles.blockHeading}>Understanding Zodiac Love Compatibility</h2>
        <p className={styles.paragraph}>
          In Western astrology, Zodiac love compatibility evaluates how two individuals' Sun signs interact based on their core elements (Fire, Earth, Air, Water) and modalities (Cardinal, Fixed, Mutable).
        </p>

        <h2 className={styles.blockHeading}>The 12 Zodiac Signs Overview</h2>
        <div className={styles.tableCardWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Sign</th>
                <th>Element</th>
                <th>Modality</th>
                <th>Date Range</th>
              </tr>
            </thead>
            <tbody>
              {signs.map((s) => (
                <tr key={s.slug}>
                  <td><strong>{s.symbol} {s.name}</strong></td>
                  <td>{s.element}</td>
                  <td>{s.modality}</td>
                  <td>{s.dates}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className={styles.blockHeading}>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {ZODIAC_FAQS.map((faq, index) => {
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
