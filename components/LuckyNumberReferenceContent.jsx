"use client";

import { useState } from "react";
import styles from "./LuckyNumberReferenceContent.module.css";
import { LUCKY_NUMBER_FAQS } from "@/lib/data/luckyNumberFaqs";

export default function LuckyNumberReferenceContent() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const toggleFaq = (index) => setOpenFaqIndex(openFaqIndex === index ? null : index);

  return (
    <section className={styles.refSection}>
      <div className={styles.refContainer}>
        <h2 className={styles.blockHeading}>US Lottery Rules &amp; Ball Matrix Guide</h2>
        <p className={styles.paragraph}>
          Major US lotteries use specific ball matrix draws. Using cryptographically secure random number generators eliminates personal bias when filling out play slips.
        </p>

        <div className={styles.tableCardWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Game</th>
                <th>Main Balls Pool</th>
                <th>Bonus Ball Pool</th>
                <th>Jackpot Odds</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Powerball</strong></td>
                <td>5 numbers (1–69)</td>
                <td>1 Red Powerball (1–26)</td>
                <td>1 in 292,201,338</td>
              </tr>
              <tr>
                <td><strong>Mega Millions</strong></td>
                <td>5 numbers (1–70)</td>
                <td>1 Gold Mega Ball (1–25)</td>
                <td>1 in 302,575,350</td>
              </tr>
              <tr>
                <td><strong>Cash4Life</strong></td>
                <td>5 numbers (1–60)</td>
                <td>1 Green Cash Ball (1–4)</td>
                <td>1 in 21,846,048</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className={styles.blockHeading}>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {LUCKY_NUMBER_FAQS.map((faq, index) => {
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
