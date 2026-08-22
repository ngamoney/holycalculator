"use client";

import { useState } from "react";
import Link from "next/link";
import { CREDIT_CARD_PAYOFF_FAQS } from "@/lib/data/creditCardPayoffFaqs";
import AdBanner from "@/components/AdBanner";
import styles from "./CreditCardPayoffReferenceContent.module.css";

export default function CreditCardPayoffReferenceContent() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className={styles.refContentSection}>
      <div className={styles.refProse}>
        <h2>Strategic Payoff Planning for Multiple Credit Cards</h2>
        <p>
          Managing multiple revolving credit cards with varying balances and APRs requires a structured repayment strategy.
          Instead of scattering extra payments evenly across cards, concentrated payoff methods create a <strong>rollover payment snowball</strong> that eliminates debt significantly faster.
        </p>
        <p>
          As each individual credit card reaches a zero balance, its entire former monthly payment is redirected into the next target card.
          This means your debt elimination momentum continuously compounds without requiring you to increase your total monthly budget.
        </p>

        {/* Debt Avalanche vs Snowball Comparison */}
        <div className={styles.tableCard}>
          <h4>Debt Avalanche vs. Debt Snowball Method</h4>
          <table className={styles.compTable}>
            <thead>
              <tr>
                <th>Criteria</th>
                <th>Debt Avalanche (Recommended for Math)</th>
                <th>Debt Snowball (Recommended for Psychology)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Target Order</strong></td>
                <td>Highest Interest Rate (APR) to Lowest</td>
                <td>Smallest Principal Balance to Largest</td>
              </tr>
              <tr>
                <td><strong>Total Interest Paid</strong></td>
                <td>Lowest possible lifetime interest cost</td>
                <td>Slightly higher interest than Avalanche</td>
              </tr>
              <tr>
                <td><strong>Payoff Velocity</strong></td>
                <td>Fastest mathematical debt elimination</td>
                <td>Quick early victories &amp; rapid account closures</td>
              </tr>
              <tr>
                <td><strong>Best For</strong></td>
                <td>Analytical borrowers focused strictly on saving money</td>
                <td>Borrowers seeking motivational momentum &amp; simplicity</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Worked Example: 3-Card Avalanche Acceleration</h3>
        <p>
          Suppose you owe <strong>$14,500 total</strong> across three cards with a fixed <strong>$500 monthly payoff budget</strong>:
        </p>
        <ul>
          <li><strong>Card 1:</strong> $4,600 @ 18.99% APR (Min: $100)</li>
          <li><strong>Card 2:</strong> $3,900 @ 19.99% APR (Min: $90) — <em>Highest APR Target</em></li>
          <li><strong>Card 3:</strong> $6,000 @ 15.99% APR (Min: $120)</li>
        </ul>
        <p>
          Under the Avalanche method:
          1. You pay minimums on Card 1 ($100) and Card 3 ($120), while sending the entire remaining $280 to Card 2 ($370 total).
          2. Card 2 is completely wiped out in <strong>Month 12</strong>.
          3. You roll Card 2&apos;s $370 payment into Card 1 ($470 total/mo), eliminating Card 1 in <strong>Month 21</strong>.
          4. Finally, all $500/mo hits Card 3, making you <strong>100% debt-free in Month 34</strong> while saving over <strong>$4,200 in interest</strong> vs. minimum payments.
        </p>

        {/* Ad Banner */}
        <AdBanner />

        {/* FAQ SECTION */}
        <div className={styles.faqWrap} id="faqs">
          <h2>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            {CREDIT_CARD_PAYOFF_FAQS.map((faq, index) => {
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
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RELATED CALCULATORS */}
        <div className={styles.relatedCard}>
          <h3>Related Debt &amp; Credit Calculators</h3>
          <p>Explore tools to optimize your debt freedom timeline across Holy Calculator:</p>
          <div className={styles.relatedLinks}>
            <Link href="/credit-card-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>💳</span>
              <div>
                <strong>Credit Card Calculator</strong>
                <span>Single card payoff timeline and minimum payment simulator</span>
              </div>
            </Link>
            <Link href="/debt-payoff-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>📉</span>
              <div>
                <strong>Debt Payoff Calculator</strong>
                <span>Multi-debt planner including auto, student, and personal loans</span>
              </div>
            </Link>
            <Link href="/personal-loan-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>🤝</span>
              <div>
                <strong>Personal Loan Calculator</strong>
                <span>Compare debt consolidation loan rates vs. credit card APRs</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
