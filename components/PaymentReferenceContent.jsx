"use client";

import { useState } from "react";
import Link from "next/link";
import { PAYMENT_FAQS } from "@/lib/data/paymentFaqs";
import AdBanner from "@/components/AdBanner";
import styles from "./PaymentReferenceContent.module.css";

export default function PaymentReferenceContent() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className={styles.refContentSection}>
      <div className={styles.refProse}>
        <h2>How Loan Payments Are Calculated</h2>
        <p>
          Whether you are financing a home, purchasing a vehicle, or managing personal borrowing, loan payments are structured around <strong>amortization</strong>.
          Under a fixed-rate loan, every installment contains two components: interest paid to the lender for borrowing capital, and principal applied to diminish the outstanding balance.
        </p>
        <p>
          At the start of your loan, the majority of your payment covers interest because the outstanding principal balance is at its peak. Over time, as regular payments reduce the principal, the monthly interest portion decreases and the equity-building principal portion accelerates.
        </p>

        {/* Formula Display Card */}
        <div className={styles.formulaCard}>
          <div className={styles.formulaTitle}>Standard Loan Payment Formula (Annuity Equation)</div>
          <div className={styles.formulaMath}>
            P = [ L × r × (1 + r)<sup>n</sup> ] / [ (1 + r)<sup>n</sup> − 1 ]
          </div>
          <div className={styles.formulaDesc}>
            Where <strong>P</strong> is the monthly payment, <strong>L</strong> is the principal loan amount, <strong>r</strong> is the monthly interest rate (Annual APR ÷ 12), and <strong>n</strong> is the total number of monthly payments (Years × 12).
          </div>
        </div>

        <h3>Worked Step-by-Step Example</h3>
        <p>
          Suppose you borrow <strong>$200,000</strong> at a <strong>6.0% annual interest rate</strong> over a <strong>15-year term (180 months)</strong>:
        </p>
        <ul>
          <li><strong>Monthly Interest Rate (r):</strong> <code>6.0% ÷ 12 = 0.5% = 0.005</code></li>
          <li><strong>Compounding Factor (1 + r)<sup>180</sup>:</strong> <code>(1.005)<sup>180</sup> ≈ 2.45409</code></li>
          <li><strong>Numerator:</strong> <code>$200,000 × 0.005 × 2.45409 = $2,454.09</code></li>
          <li><strong>Denominator:</strong> <code>2.45409 − 1 = 1.45409</code></li>
          <li><strong>Monthly Payment (P):</strong> <code>$2,454.09 ÷ 1.45409 =</code> <strong>$1,687.71</strong></li>
          <li><strong>Total Paid Over 15 Years:</strong> <code>$1,687.71 × 180 = $303,788.46</code> ($103,788.46 in interest)</li>
        </ul>

        {/* Comparison Table */}
        <div className={styles.tableCard}>
          <h4>Fixed Term vs. Fixed Payment Planning</h4>
          <table className={styles.compTable}>
            <thead>
              <tr>
                <th>Strategy</th>
                <th>Primary Question Solved</th>
                <th>Best Used When</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Fixed Term</strong></td>
                <td>&ldquo;What will my monthly payment be for an X-year loan?&rdquo;</td>
                <td>Budgeting for a new mortgage, auto loan, or personal loan before signing contract terms.</td>
              </tr>
              <tr>
                <td><strong>Fixed Payment</strong></td>
                <td>&ldquo;How quickly will I become debt-free if I pay $X per month?&rdquo;</td>
                <td>Accelerating debt payoff, credit card consolidation, or planning extra monthly principal payments.</td>
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
            {PAYMENT_FAQS.map((faq, index) => {
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
          <h3>Related Financial Calculators</h3>
          <p>Explore specialized repayment and amortization tools across Holy Calculator:</p>
          <div className={styles.relatedLinks}>
            <Link href="/loan-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>💳</span>
              <div>
                <strong>Loan Calculator</strong>
                <span>Full amortization tables &amp; multi-schedule comparisons</span>
              </div>
            </Link>
            <Link href="/mortgage-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>🏠</span>
              <div>
                <strong>Mortgage Calculator</strong>
                <span>Include taxes, insurance, HOA, and PMI in your home payment</span>
              </div>
            </Link>
            <Link href="/auto-loan-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>🚗</span>
              <div>
                <strong>Auto Loan Calculator</strong>
                <span>Factor in vehicle trade-in values, dealer fees, and sales tax</span>
              </div>
            </Link>
            <Link href="/amortization-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>📊</span>
              <div>
                <strong>Amortization Calculator</strong>
                <span>Detailed year-by-year and month-by-month principal payoff schedules</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
