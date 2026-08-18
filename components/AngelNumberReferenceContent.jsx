"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./AngelNumberReferenceContent.module.css";
import { ANGEL_NUMBER_FAQS } from "@/lib/data/angelNumberFaqs";
import { ANGEL_NUMBER_DICTIONARY } from "@/lib/data/angelNumberData";

export default function AngelNumberReferenceContent() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const sequenceKeys = ["111", "222", "333", "444", "555", "666", "777", "888", "999", "000", "1111", "1212", "1010"];

  return (
    <section className={styles.refSection}>
      <div className={styles.refContainer}>
        {/* Section 1: What Are Angel Numbers */}
        <h2 className={styles.blockHeading}>What Are Angel Numbers &amp; Synchronicity?</h2>
        <p className={styles.paragraph}>
          In spiritual numerology, <strong>Angel Numbers</strong> are repeating numerical sequences—such as 111, 222, 444, 777, or 1111—that appear repeatedly in your daily life. Whether you notice 11:11 on a digital clock, spot a $4.44 purchase total, or see a 777 license plate, these repeating sequences are regarded as cosmic synchronicities and divine messages from guardian angels.
        </p>

        {/* Section 2: How Angel Numbers Work */}
        <h2 className={styles.blockHeading}>How Angel Numbers Work in Numerology</h2>
        <p className={styles.paragraph}>
          In numerology, numbers are energetic symbols. Repeating sequences amplify the core frequency of the root digit:
        </p>
        <ul className={styles.paragraph} style={{ paddingLeft: "20px" }}>
          <li><strong>Single Digits (1–9):</strong> Represent core character archetypes and fundamental life lessons.</li>
          <li><strong>Triple Sequences (111, 222, 333):</strong> Represent immediate energetic messages and active guidance regarding your current focus.</li>
          <li><strong>Master Four-Digit Sequences (1111, 1212, 1010):</strong> Represent high-vibrational manifestation portals, twin flame connections, and spiritual awakenings.</li>
        </ul>

        {/* Section 3: Angel Number Meanings Table */}
        <h2 className={styles.blockHeading}>Angel Numbers Meaning Master Reference Table</h2>
        <div className={styles.tableCardWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Sequence</th>
                <th>Spiritual Theme</th>
                <th>Core Essence</th>
              </tr>
            </thead>
            <tbody>
              {sequenceKeys.map((key) => {
                const item = ANGEL_NUMBER_DICTIONARY[key];
                if (!item) return null;
                return (
                  <tr key={key}>
                    <td className={styles.monoCell}>
                      <strong>{item.sequence}</strong>
                    </td>
                    <td>{item.title}</td>
                    <td>{item.tagline}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Section 4: Angel Numbers in Love & Abundance */}
        <h2 className={styles.blockHeading}>Angel Numbers in Love, Twin Flames &amp; Abundance</h2>
        <p className={styles.paragraph}>
          Angel Numbers offer targeted guidance across specific areas of your life:
        </p>
        <div className={styles.calloutBox}>
          <strong>Love &amp; Twin Flames:</strong> 111 and 1111 signal new romantic beginnings and twin flame alignment. 222 indicates harmonious partnership, while 444 reassures emotional security.<br /><br />
          <strong>Money &amp; Abundance:</strong> 888 is the ultimate sign of financial prosperity and karmic rewards. 555 announces career transformation, while 777 signals divine good luck.
        </div>

        {/* FAQ Section */}
        <h2 className={styles.blockHeading}>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {ANGEL_NUMBER_FAQS.map((faq, index) => {
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

        {/* Related Spiritual Tools */}
        <h2 className={styles.blockHeading}>Related Spiritual &amp; Numerology Tools</h2>
        <div className={styles.relatedGrid}>
          <Link href="/spiritual/life-path-number-calculator" className={styles.relatedCard}>
            <div>
              <h3 className={styles.relatedCardTitle}>Life Path Number Calculator</h3>
              <p className={styles.relatedCardDesc}>
                Calculate your Life Path Number and Master Numbers (11, 22, 33) using Pythagorean reduction.
              </p>
            </div>
          </Link>
          <Link href="/dice-roller" className={styles.relatedCard}>
            <div>
              <h3 className={styles.relatedCardTitle}>Virtual Dice Roller</h3>
              <p className={styles.relatedCardDesc}>
                Roll polyhedral dice (d4, d6, d8, d10, d12, d20) with cryptographically secure randomness.
              </p>
            </div>
          </Link>
          <Link href="/date-calculator" className={styles.relatedCard}>
            <div>
              <h3 className={styles.relatedCardTitle}>Date Calculator</h3>
              <p className={styles.relatedCardDesc}>
                Calculate exact days between dates, business day durations, and calendar additions.
              </p>
            </div>
          </Link>
          <Link href="/age-calculator" className={styles.relatedCard}>
            <div>
              <h3 className={styles.relatedCardTitle}>Age Calculator</h3>
              <p className={styles.relatedCardDesc}>
                Calculate exact age down to months, days, hours, and total leap years lived.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
