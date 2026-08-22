"use client";

import { useState } from "react";
import Link from "next/link";
import { CREDIT_CARD_FAQS } from "@/lib/data/creditCardFaqs";
import AdBanner from "@/components/AdBanner";
import styles from "./CreditCardReferenceContent.module.css";

export default function CreditCardReferenceContent() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className={styles.refContentSection}>
      <div className={styles.refProse}>
        <h2>How Credit Card Interest &amp; Balance Payoff Works</h2>
        <p>
          Credit cards are revolving unsecured debt facilities that calculate finance charges based on your Average Daily Balance.
          When you carry a balance from month to month, interest accrues daily at your Daily Periodic Rate (APR divided by 365) and compounds every billing cycle.
        </p>
        <p>
          Because credit card APRs average between 18% and 29%, carrying debt is one of the most expensive forms of consumer borrowing.
          Understanding how payments are distributed between interest and principal is critical to avoiding prolonged debt cycles.
        </p>

        {/* Formula Display Box */}
        <div className={styles.formulaCard}>
          <div className={styles.formulaTitle}>Credit Card Finance Charge Formula</div>
          <div className={styles.formulaMath}>
            Daily Finance Charge = Average Daily Balance × (APR ÷ 365)
          </div>
          <div className={styles.formulaDesc}>
            Monthly interest charged on your statement is the sum of all daily finance charges accrued over your 28 to 31-day billing cycle.
          </div>
        </div>

        <h3>The Minimum Payment Trap Explained</h3>
        <p>
          Card issuers typically set minimum monthly payments using one of two formulas:
        </p>
        <ul>
          <li><strong>Formula A:</strong> <code>Accrued Monthly Interest + 1% of Principal Balance</code> (subject to a $25 or $35 minimum).</li>
          <li><strong>Formula B:</strong> <code>2.0% to 2.5% of the Total Balance</code>.</li>
        </ul>
        <p>
          On an <strong>$8,000 balance at 18.0% APR</strong>, your initial minimum payment is roughly <strong>$200</strong> ($120 interest + $80 principal).
          As the balance drops, the required minimum payment also falls, slowing principal reduction to a crawl.
          Paying only the minimum takes over <strong>20 years</strong> to eliminate the debt and costs more than <strong>$8,500 in pure interest</strong>!
        </p>

        {/* Minimum vs Fixed Payment Comparison Table */}
        <div className={styles.tableCard}>
          <h4>$8,000 Balance at 18% APR — Payoff Comparison</h4>
          <table className={styles.compTable}>
            <thead>
              <tr>
                <th>Repayment Strategy</th>
                <th>Monthly Payment</th>
                <th>Time to Pay Off</th>
                <th>Total Interest Paid</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Minimum Payment Only</strong></td>
                <td>Declining ($200 down to $25)</td>
                <td>20 Years, 4 Months</td>
                <td>$8,642</td>
              </tr>
              <tr>
                <td><strong>Fixed $250 / Month</strong></td>
                <td>$250 fixed</td>
                <td>3 Years, 7 Months</td>
                <td>$2,865 (Save $5,777)</td>
              </tr>
              <tr>
                <td><strong>Fixed $400 / Month</strong></td>
                <td>$400 fixed</td>
                <td>2 Years, 0 Months</td>
                <td>$1,560 (Save $7,082)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Ad Banner */}
        <AdBanner />

        {/* FAQ SECTION */}
        <div className={styles.faqWrap} id="faqs">
          <h2>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            {CREDIT_CARD_FAQS.map((faq, index) => {
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
          <h3>Related Debt &amp; Payoff Calculators</h3>
          <p>Explore tools to optimize your debt freedom timeline across Holy Calculator:</p>
          <div className={styles.relatedLinks}>
            <Link href="/credit-card-payoff-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>💳</span>
              <div>
                <strong>Credit Card Payoff Calculator</strong>
                <span>Multi-card acceleration and timeline solver</span>
              </div>
            </Link>
            <Link href="/debt-payoff-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>📉</span>
              <div>
                <strong>Debt Payoff Calculator</strong>
                <span>Compare Debt Snowball vs. Debt Avalanche strategies</span>
              </div>
            </Link>
            <Link href="/personal-loan-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>🤝</span>
              <div>
                <strong>Personal Loan Calculator</strong>
                <span>Consolidate high-APR credit cards into a single fixed payment</span>
              </div>
            </Link>
            <Link href="/budget-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>📊</span>
              <div>
                <strong>Budget Calculator</strong>
                <span>Organize monthly expenses to maximize debt payoff contributions</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
