"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./CountdownReferenceContent.module.css";
import { COUNTDOWN_FAQS } from "@/lib/data/countdownFaqs";

export default function CountdownReferenceContent() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className={styles.refSection}>
      <div className={styles.refContainer}>
        {/* Section 1: Overview & History */}
        <h2 className={styles.blockHeading}>The Science &amp; History of Countdown Timers</h2>
        <p className={styles.paragraph}>
          A <strong>countdown timer</strong> is a backward-counting clock that tracks remaining time until a specific future event occurs. Unlike standard clocks that measure elapsed time forward, countdown timers create psychological anticipation and urgency by displaying declining time units in real time.
        </p>
        <p className={styles.paragraph}>
          The formal concept of a countdown originated in early rocketry and spaceflight. German filmmaker Fritz Lang introduced the backward count (&quot;5, 4, 3, 2, 1, Launch!&quot;) in his 1929 sci-fi movie <em>Woman in the Moon</em>. NASA subsequently adopted the backward count for rocket launches (most famously during the Apollo 11 Moon landing in 1969) to synchronize engineering teams and safety checks prior to ignition.
        </p>

        {/* Section 2: Time Breakdown Math */}
        <h2 className={styles.blockHeading}>How Countdown Time Units Are Calculated</h2>
        <p className={styles.paragraph}>
          To calculate remaining time down to the second, total millisecond differences are converted using fixed temporal constants:
        </p>
        <div className={styles.calloutBox}>
          <strong>Time Unit Constants:</strong><br />
          • 1 Second = 1,000 Milliseconds<br />
          • 1 Minute = 60 Seconds = 60,000 Milliseconds<br />
          • 1 Hour = 60 Minutes = 3,600,000 Milliseconds<br />
          • 1 Day = 24 Hours = 86,400,000 Milliseconds
        </div>
        <p className={styles.paragraph}>
          The live clock display extracts days, hours, minutes, and seconds sequentially using modulo division so that remaining hours stay bounded between 0–23, minutes between 0–59, and seconds between 0–59.
        </p>

        {/* Section 3: Time Zone Synchronization */}
        <h2 className={styles.blockHeading}>Time Zone &amp; Global Event Synchronization</h2>
        <p className={styles.paragraph}>
          When setting a countdown for global events (such as New Year&apos;s Eve, global product launches, or international sports tournaments), time zone alignment is critical. A midnight countdown in New York (UTC-5) occurs 5 hours after midnight in London (UTC+0).
        </p>
        <p className={styles.paragraph}>
          Our live countdown timer runs using JavaScript&apos;s client-side clock, converting your chosen target date into an explicit ISO date-time string. Shareable links preserve exact target dates so friends and family across different cities see perfectly synchronized timers.
        </p>

        {/* Section 4: Popular Occasions */}
        <h2 className={styles.blockHeading}>Popular Countdown Occasions</h2>
        <ul className={styles.paragraph} style={{ paddingLeft: "20px" }}>
          <li><strong>Holidays &amp; Celebrations:</strong> New Year&apos;s Day, Christmas, Thanksgiving, Halloween, and St. Patrick&apos;s Day.</li>
          <li><strong>Personal Milestones:</strong> Weddings, baby due dates, retirement days, graduation ceremonies, and milestone birthdays.</li>
          <li><strong>Travel &amp; Entertainment:</strong> Vacations, concert dates, movie releases, and gaming launches.</li>
        </ul>

        {/* FAQ Section */}
        <h2 className={styles.blockHeading}>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {COUNTDOWN_FAQS.map((faq, index) => {
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

        {/* Related Date & Time Calculators */}
        <h2 className={styles.blockHeading}>Related Date &amp; Time Tools</h2>
        <div className={styles.relatedGrid}>
          <Link href="/date-time/time-zone-calculator" className={styles.relatedCard}>
            <div>
              <h3 className={styles.relatedCardTitle}>Time Zone Calculator</h3>
              <p className={styles.relatedCardDesc}>
                Convert time across world UTC time zones and calculate time differences.
              </p>
            </div>
          </Link>
          <Link href="/date-calculator" className={styles.relatedCard}>
            <div>
              <h3 className={styles.relatedCardTitle}>Date Calculator</h3>
              <p className={styles.relatedCardDesc}>
                Calculate duration between dates or add and subtract business days.
              </p>
            </div>
          </Link>
          <Link href="/age-calculator" className={styles.relatedCard}>
            <div>
              <h3 className={styles.relatedCardTitle}>Age Calculator</h3>
              <p className={styles.relatedCardDesc}>
                Calculate exact age in years, months, days, hours, and minutes.
              </p>
            </div>
          </Link>
          <Link href="/pregnancy-calculator" className={styles.relatedCard}>
            <div>
              <h3 className={styles.relatedCardTitle}>Pregnancy Due Date Calculator</h3>
              <p className={styles.relatedCardDesc}>
                Estimate your due date and weekly pregnancy milestones.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
