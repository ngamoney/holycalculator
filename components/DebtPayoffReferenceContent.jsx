"use client";

import { useState } from "react";
import Link from "next/link";
import { DEBT_PAYOFF_FAQS } from "@/lib/data/debtPayoffFaqs";
import AdBanner from "@/components/AdBanner";
import styles from "./DebtPayoffReferenceContent.module.css";

export default function DebtPayoffReferenceContent() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className={styles.refContentSection}>
      <div className={styles.refProse}>
        <h2>How to Build a Complete Debt Elimination Plan</h2>
        <p>
          Achieving total debt freedom requires an organized approach that consolidates all borrowing—credit cards, auto loans, personal loans, medical bills, and student debt—into a unified monthly payoff engine.
        </p>
        <p>
          By maintaining minimum payments across all accounts and channeling any extra monthly savings toward a single priority target, you eliminate accounts sequentially.
          As each balance hits zero, its former minimum payment &ldquo;rolls over&rdquo; to accelerate the next target, compounding your debt elimination power every single month.
        </p>

        {/* Comparison Table */}
        <div className={styles.tableCard}>
          <h4>Debt Repayment Strategies at a Glance</h4>
          <table className={styles.compTable}>
            <thead>
              <tr>
                <th>Strategy</th>
                <th>Target Sequencing</th>
                <th>Primary Advantage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Debt Avalanche</strong></td>
                <td>Sort debts by highest interest rate (APR) to lowest</td>
                <td>Saves the maximum possible amount in total interest charges.</td>
              </tr>
              <tr>
                <td><strong>Debt Snowball</strong></td>
                <td>Sort debts by lowest principal balance to highest</td>
                <td>Provides quick early victories and reduces the number of open bills rapidly.</td>
              </tr>
              <tr>
                <td><strong>Baseline Minimums</strong></td>
                <td>Pay only required minimums across all open accounts</td>
                <td>Maximizes bank interest revenue and delays payoff by years or decades.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>The 5 Steps to Systematic Debt Elimination</h3>
        <ol>
          <li><strong>Inventory Every Debt:</strong> List out all lender balances, minimum monthly payments, and APR percentages.</li>
          <li><strong>Establish a Starter Emergency Fund:</strong> Maintain $1,000 to $2,500 in liquid savings to avoid creating new debt during unexpected expenses.</li>
          <li><strong>Choose Your Strategy:</strong> Select Avalanche for pure math optimization or Snowball for behavioral momentum.</li>
          <li><strong>Automate Fixed Payments:</strong> Set minimum payments on autopay and allocate all extra discretionary cash to your top priority target.</li>
          <li><strong>Roll Over Freed-up Cash Flow:</strong> When a loan is paid off, never reduce your monthly debt budget—roll the full installment into the next target immediately.</li>
        </ol>

        {/* Ad Banner */}
        <AdBanner />

        {/* FAQ SECTION */}
        <div className={styles.faqWrap} id="faqs">
          <h2>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            {DEBT_PAYOFF_FAQS.map((faq, index) => {
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
          <h3>Related Debt &amp; Financial Calculators</h3>
          <p>Explore tools to optimize your debt freedom timeline across Holy Calculator:</p>
          <div className={styles.relatedLinks}>
            <Link href="/credit-card-payoff-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>💳</span>
              <div>
                <strong>Credit Card Payoff Calculator</strong>
                <span>Multi-card rollover payoff planner</span>
              </div>
            </Link>
            <Link href="/student-loan-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>🎓</span>
              <div>
                <strong>Student Loan Calculator</strong>
                <span>Estimate standard, graduated, and income-driven repayments</span>
              </div>
            </Link>
            <Link href="/personal-loan-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>🤝</span>
              <div>
                <strong>Personal Loan Calculator</strong>
                <span>Calculate loan consolidation rates and monthly payments</span>
              </div>
            </Link>
            <Link href="/budget-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>📊</span>
              <div>
                <strong>Budget Calculator</strong>
                <span>Streamline monthly expenses to boost your debt payoff fund</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
