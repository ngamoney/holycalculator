"use client";

import { useState } from "react";
import styles from "./TarotReferenceContent.module.css";
import { TAROT_FAQS } from "@/lib/data/tarotFaqs";
import { MAJOR_ARCANA } from "@/lib/calculations/tarot";

export default function TarotReferenceContent() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const toggleFaq = (index) => setOpenFaqIndex(openFaqIndex === index ? null : index);

  return (
    <section className={styles.refSection}>
      <div className={styles.refContainer}>
        <h2 className={styles.blockHeading}>The 22 Major Arcana Tarot Cards Overview</h2>
        <p className={styles.paragraph}>
          The Major Arcana represents the archetypal journey of life (known as 'The Fool's Journey'), outlining major spiritual transformations and turning points.
        </p>

        <div className={styles.tableCardWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Card</th>
                <th>Core Keywords</th>
                <th>Oracle Meaning</th>
              </tr>
            </thead>
            <tbody>
              {MAJOR_ARCANA.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.number}. {c.name}</strong></td>
                  <td>{c.keywords.join(", ")}</td>
                  <td>{c.uprightMeaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className={styles.blockHeading}>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {TAROT_FAQS.map((faq, index) => {
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
