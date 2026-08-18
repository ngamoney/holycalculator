"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./LifePathReferenceContent.module.css";
import { LIFE_PATH_FAQS } from "@/lib/data/lifePathFaqs";
import { LIFE_PATH_ARCHETYPES } from "@/lib/data/lifePathData";

export default function LifePathReferenceContent() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const archetypeKeys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];

  return (
    <section className={styles.refSection}>
      <div className={styles.refContainer}>
        {/* Section 1: Introduction to Life Path Numerology */}
        <h2 className={styles.blockHeading}>What is a Life Path Number in Pythagorean Numerology?</h2>
        <p className={styles.paragraph}>
          In ancient Pythagorean numerology—founded by the Greek philosopher and mathematician Pythagoras—every calendar date and number carries a distinct vibrational pattern. Your <strong>Life Path Number</strong> is derived directly from your birth date, representing your core character blueprint, natural inclinations, and lifelong purpose.
        </p>
        <p className={styles.paragraph}>
          Just as astrology uses planetary positions at birth to chart your horoscope, numerology uses your birth date digits to outline your personal strengths, emotional tendencies, and life challenges.
        </p>

        {/* Section 2: Authentic Reduction Method */}
        <h2 className={styles.blockHeading}>The Authentic Pythagorean Reduction Method</h2>
        <p className={styles.paragraph}>
          Not all numerology calculators work the same way. Authentic Pythagorean numerology requires reducing the <strong>Month</strong>, <strong>Day</strong>, and <strong>Year</strong> of birth independently <em>before</em> summing them together:
        </p>
        <div className={styles.calloutBox}>
          <strong>Step-by-Step Reduction Protocol:</strong><br />
          1. <strong>Reduce Birth Month:</strong> Convert month (1–12) to a single digit (e.g. October 10 → 1+0 = 1). November (11) is preserved as a Master Number.<br />
          2. <strong>Reduce Birth Day:</strong> Convert day (1–31) to a single digit (e.g. 28 → 2+8 = 10 → 1+0 = 1). Days 11 and 22 are preserved as Master Numbers.<br />
          3. <strong>Reduce Birth Year:</strong> Sum all four digits of your birth year (e.g. 1994 → 1+9+9+4 = 23 → 2+3 = 5).<br />
          4. <strong>Sum and Reduce Total:</strong> Add the three reduced figures together (1 + 1 + 5 = 7). Reduce final sum if necessary, unless it equals Master Numbers 11, 22, or 33.
        </div>

        {/* Section 3: Master Numbers 11, 22, 33 */}
        <h2 className={styles.blockHeading}>Understanding Master Numbers (11, 22, and 33)</h2>
        <p className={styles.paragraph}>
          Master Numbers—<strong>11</strong> (The Intuitive Illuminator), <strong>22</strong> (The Master Builder), and <strong>33</strong> (The Master Teacher)—are double-digit numbers that possess heightened potential and intense energy. In numerology, these numbers are never reduced to single digits during calculation steps because doing so erases their master frequency.
        </p>

        {/* Section 4: Life Path Reference Summary Table */}
        <h2 className={styles.blockHeading}>Life Path Numbers Overview Reference Table</h2>
        <div className={styles.tableCardWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Path Number</th>
                <th>Archetype Title</th>
                <th>Ruling Element</th>
                <th>Core Essence</th>
              </tr>
            </thead>
            <tbody>
              {archetypeKeys.map((key) => {
                const item = LIFE_PATH_ARCHETYPES[key];
                return (
                  <tr key={key}>
                    <td>
                      <strong>Path {item.number}</strong> {item.isMaster ? "✨" : ""}
                    </td>
                    <td>{item.title}</td>
                    <td>{item.rulingElement}</td>
                    <td>{item.tagline}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* FAQ Section */}
        <h2 className={styles.blockHeading}>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {LIFE_PATH_FAQS.map((faq, index) => {
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

        {/* Related Spiritual & Other Tools */}
        <h2 className={styles.blockHeading}>Related Spiritual &amp; Fun Calculators</h2>
        <div className={styles.relatedGrid}>
          <Link href="/dice-roller" className={styles.relatedCard}>
            <div>
              <h3 className={styles.relatedCardTitle}>Virtual Dice Roller</h3>
              <p className={styles.relatedCardDesc}>
                Roll polyhedral dice (d4, d6, d8, d10, d12, d20) with cryptographically secure randomness.
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
          <Link href="/date-calculator" className={styles.relatedCard}>
            <div>
              <h3 className={styles.relatedCardTitle}>Date Calculator</h3>
              <p className={styles.relatedCardDesc}>
                Calculate exact days between dates, business day durations, and calendar additions.
              </p>
            </div>
          </Link>
          <Link href="/date-time/time-zone-calculator" className={styles.relatedCard}>
            <div>
              <h3 className={styles.relatedCardTitle}>Time Zone Calculator</h3>
              <p className={styles.relatedCardDesc}>
                Convert global UTC time zones and calculate international time differences.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
