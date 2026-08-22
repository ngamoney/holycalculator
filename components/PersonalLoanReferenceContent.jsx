"use client";

import { useState } from "react";
import Link from "next/link";
import { PERSONAL_LOAN_FAQS } from "@/lib/data/personalLoanFaqs";
import AdBanner from "@/components/AdBanner";
import styles from "./PersonalLoanReferenceContent.module.css";

export default function PersonalLoanReferenceContent() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className={styles.refContentSection}>
      <div className={styles.refProse}>
        <h2>How Personal Loans &amp; APR Math Work</h2>
        <p>
          A personal loan is a fixed-term installment loan typically issued without requiring collateral (unsecured).
          Borrowers receive a lump sum upfront and repay the balance through equal monthly installments combining principal and interest over 12 to 84 months.
        </p>
        <p>
          Unlike credit cards with variable compounding rates, personal loans provide fixed payment certainty.
          However, calculating your true borrowing cost requires evaluating the <strong>Annual Percentage Rate (APR)</strong>, which incorporates upfront origination fees alongside the stated nominal interest rate.
        </p>

        {/* APR Formula Box */}
        <div className={styles.formulaCard}>
          <div className={styles.formulaTitle}>Personal Loan Payment &amp; Effective APR</div>
          <div className={styles.formulaMath}>
            Monthly Payment (P) = [ L × r × (1 + r)<sup>n</sup> ] / [ (1 + r)<sup>n</sup> − 1 ]
          </div>
          <div className={styles.formulaDesc}>
            Where <strong>L</strong> is the principal loan amount, <strong>r</strong> is the monthly interest rate (APR ÷ 12), and <strong>n</strong> is the loan term in months. When an origination fee is deducted upfront, the Effective APR is solved by equating the present value of monthly installments to the net cash proceeds received.
          </div>
        </div>

        <h3>Impact of Origination Fees on Real Borrowing Cost</h3>
        <p>
          Suppose you borrow <strong>$20,000 at a 10.0% nominal rate for 5 years (60 months)</strong> with a <strong>3.0% origination fee ($600)</strong> deducted from your loan disbursement:
        </p>
        <ul>
          <li><strong>Contract Loan Amount:</strong> $20,000 (Monthly payment = $424.94)</li>
          <li><strong>Net Cash Deposited in Bank:</strong> <code>$20,000 − $600 = $19,400</code></li>
          <li><strong>Total Interest Paid:</strong> $5,496.45</li>
          <li><strong>Total All-in Cost:</strong> $25,496.45 (Principal + Interest + $600 Fee)</li>
          <li><strong>True Effective APR:</strong> <strong>11.38%</strong> (1.38% higher than the advertised nominal rate!)</li>
        </ul>

        {/* Ad Banner */}
        <AdBanner />

        {/* FAQ SECTION */}
        <div className={styles.faqWrap} id="faqs">
          <h2>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            {PERSONAL_LOAN_FAQS.map((faq, index) => {
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
          <h3>Related Borrowing &amp; Debt Tools</h3>
          <p>Compare personal financing options across Holy Calculator:</p>
          <div className={styles.relatedLinks}>
            <Link href="/loan-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>💳</span>
              <div>
                <strong>Loan Calculator</strong>
                <span>General loan payment and compounding schedule solver</span>
              </div>
            </Link>
            <Link href="/debt-payoff-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>📉</span>
              <div>
                <strong>Debt Payoff Calculator</strong>
                <span>Consolidate credit cards and personal loans into one plan</span>
              </div>
            </Link>
            <Link href="/payment-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>💵</span>
              <div>
                <strong>Payment Calculator</strong>
                <span>Solve for required payments or target debt-free timelines</span>
              </div>
            </Link>
            <Link href="/auto-loan-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>🚗</span>
              <div>
                <strong>Auto Loan Calculator</strong>
                <span>Compare personal loan rates vs. auto dealer financing</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
