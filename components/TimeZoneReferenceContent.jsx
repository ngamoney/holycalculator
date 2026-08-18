"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./TimeZoneReferenceContent.module.css";
import { TIMEZONE_FAQS } from "@/lib/data/timezoneFaqs";

export default function TimeZoneReferenceContent() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className={styles.refSection}>
      <div className={styles.refContainer}>
        {/* Section 1: How Time Zone Conversion Works */}
        <h2 className={styles.blockHeading}>How Time Zone Conversion Works</h2>
        <p className={styles.paragraph}>
          A time zone is a geographic region that observes a uniform standard time for legal, commercial, and social purposes. Standard time zones are defined relative to <strong>Coordinated Universal Time (UTC)</strong>, which serves as the primary time standard by which the world regulates clocks and time. Earth is divided into 24 principal longitudinal bands spaced approximately 15° apart, with each band representing a one-hour offset relative to the Prime Meridian (0° longitude) running through Greenwich, London.
        </p>
        <p className={styles.paragraph}>
          Converting time between two locations requires computing the difference between their respective UTC offsets. For example, if Location A is set to <strong>UTC-05:00</strong> (Eastern Standard Time) and Location B is set to <strong>UTC+09:00</strong> (Japan Standard Time), the time offset difference is computed as:
        </p>
        <p className={styles.paragraph} style={{ fontFamily: "var(--font-jetbrains, monospace)", background: "var(--paper, #F6F3EC)", padding: "10px 14px", borderRadius: "6px" }}>
          Target Offset (+9) − Source Offset (-5) = +14 Hours Difference
        </p>
        <p className={styles.paragraph}>
          When converting 3:00 PM (15:00) from UTC-05:00 to UTC+09:00, adding 14 hours yields 29:00, which rolls past midnight to become 5:00 AM on the <em>following calendar day (+1 day)</em>.
        </p>

        {/* Section 2: GMT vs UTC Distinction */}
        <h3 className={styles.subHeading}>Understanding GMT vs. UTC</h3>
        <p className={styles.paragraph}>
          Although <strong>Greenwich Mean Time (GMT)</strong> and <strong>Coordinated Universal Time (UTC)</strong> are frequently used interchangeably in everyday conversation, they differ fundamentally in technical precision:
        </p>
        <ul className={styles.paragraph} style={{ paddingLeft: "20px" }}>
          <li>
            <strong>Greenwich Mean Time (GMT):</strong> A historical time zone based on astronomical mean solar time at the Royal Observatory in Greenwich, London. GMT is a specific civil time zone observed in select countries (such as the UK during winter months).
          </li>
          <li>
            <strong>Coordinated Universal Time (UTC):</strong> An international time standard computed using precise atomic clocks (International Atomic Time, TAI) synchronized with astronomical solar measurements. UTC is not a geographic time zone itself, but the universal reference anchor for all world time zones.
          </li>
        </ul>

        {/* Section 3: Non-Standard Fractional Offsets */}
        <h3 className={styles.subHeading}>Half-Hour and Quarter-Hour Time Zones</h3>
        <p className={styles.paragraph}>
          While most global time zones differ by whole-hour increments, several nations adopt half-hour or quarter-hour offsets to better align legal standard time with solar noon across their landmasses:
        </p>
        <ul className={styles.paragraph} style={{ paddingLeft: "20px" }}>
          <li>
            <strong>India Standard Time (IST) &amp; Sri Lanka:</strong> Set to <strong>UTC+05:30</strong>, centering national time halfway between the 75°E and 90°E meridians.
          </li>
          <li>
            <strong>Nepal Standard Time (NST):</strong> Set to <strong>UTC+05:45</strong> (Kathmandu), anchored precisely to the 86°15&apos;E meridian passing through Mount Gaurishankar.
          </li>
          <li>
            <strong>Iran Standard Time (IRST):</strong> Set to <strong>UTC+03:30</strong> (Tehran), matching the 52.5°E longitude line.
          </li>
          <li>
            <strong>Chatham Islands (New Zealand):</strong> Set to <strong>UTC+12:45</strong>, representing one of the rare quarter-hour island offsets in the Pacific.
          </li>
        </ul>

        {/* Section 4: Daylight Saving Time Notice */}
        <div className={styles.disclaimerCallout}>
          <h4 className={styles.disclaimerTitle}>Daylight Saving Time (DST) &amp; Static Offset Disclaimer</h4>
          <p className={styles.disclaimerBody}>
            This calculator operates on a fixed standard UTC-offset model (UTC-12:00 to UTC+14:00) and does not automatically adjust for Daylight Saving Time (DST) shifts. Because DST start and end dates vary worldwide according to local political regulations, users converting times during active daylight saving periods should select the corresponding daylight offset (for example, choosing UTC-04:00 EDT instead of UTC-05:00 EST for Eastern Daylight Time).
          </p>
        </div>

        {/* FAQ Section */}
        <h2 className={styles.blockHeading}>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {TIMEZONE_FAQS.map((faq, index) => {
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

        {/* Related Calculators */}
        <h2 className={styles.blockHeading}>Related Calculators</h2>
        <div className={styles.relatedGrid}>
          <Link href="/age-calculator" className={styles.relatedCard}>
            <div>
              <h3 className={styles.relatedCardTitle}>Age Calculator</h3>
              <p className={styles.relatedCardDesc}>
                Calculate exact chronological age in years, months, days, hours, and seconds.
              </p>
            </div>
          </Link>
          <Link href="/date-calculator" className={styles.relatedCard}>
            <div>
              <h3 className={styles.relatedCardTitle}>Date Calculator</h3>
              <p className={styles.relatedCardDesc}>
                Calculate duration between dates or add/subtract days with business day options.
              </p>
            </div>
          </Link>
          <Link href="/conversion-calculator" className={styles.relatedCard}>
            <div>
              <h3 className={styles.relatedCardTitle}>Unit Conversion Calculator</h3>
              <p className={styles.relatedCardDesc}>
                Convert units across length, weight, area, volume, time, and speed instantly.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
