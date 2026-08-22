"use client";

import { useState } from "react";
import Link from "next/link";
import { STUDENT_LOAN_FAQS } from "@/lib/data/studentLoanFaqs";
import AdBanner from "@/components/AdBanner";
import styles from "./StudentLoanReferenceContent.module.css";

export default function StudentLoanReferenceContent() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className={styles.refContentSection}>
      <div className={styles.refProse}>
        <h2>How Student Loan Interest &amp; Repayment Works</h2>
        <p>
          Student loans are installment loans designed to fund higher education tuition, room, board, and textbooks.
          Unlike consumer credit cards, federal student loans feature simple daily interest calculation without monthly capitalization (unless specific triggering events occur, such as leaving deferment).
        </p>
        <p>
          Each monthly payment is applied in a statutory order: first to any accrued unpaid interest, and secondly to reduce the outstanding principal balance.
          Because interest accrues based on daily principal, any extra money paid directly reduces subsequent daily interest charges.
        </p>

        {/* Daily Interest Formula Box */}
        <div className={styles.formulaCard}>
          <div className={styles.formulaTitle}>Simple Daily Interest Formula (Federal Student Loans)</div>
          <div className={styles.formulaMath}>
            Daily Interest Accrual = (Principal Balance × APR) ÷ 365.25
          </div>
          <div className={styles.formulaDesc}>
            Monthly interest charged equals the daily accrual multiplied by the exact number of calendar days in the billing period.
          </div>
        </div>

        <h3>Federal Repayment Plans Compared</h3>
        <div className={styles.tableCard}>
          <h4>Comparison of Federal Student Loan Plans</h4>
          <table className={styles.compTable}>
            <thead>
              <tr>
                <th>Plan Name</th>
                <th>Repayment Term</th>
                <th>Payment Structure</th>
                <th>Total Interest Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Standard Repayment</strong></td>
                <td>10 Years (120 months)</td>
                <td>Fixed monthly payment</td>
                <td>Lowest total interest</td>
              </tr>
              <tr>
                <td><strong>Graduated Repayment</strong></td>
                <td>10 Years</td>
                <td>Starts low, increases every 2 years</td>
                <td>Moderate total interest</td>
              </tr>
              <tr>
                <td><strong>Extended Repayment</strong></td>
                <td>25 Years</td>
                <td>Fixed or graduated payments</td>
                <td>Higher total interest</td>
              </tr>
              <tr>
                <td><strong>Income-Driven (IDR/SAVE)</strong></td>
                <td>20 to 25 Years</td>
                <td>5% to 10% of discretionary income</td>
                <td>Forgiveness after 20–25 yrs (tax rules vary)</td>
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
            {STUDENT_LOAN_FAQS.map((faq, index) => {
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
          <p>Explore loan and debt payoff tools across Holy Calculator:</p>
          <div className={styles.relatedLinks}>
            <Link href="/debt-payoff-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>📉</span>
              <div>
                <strong>Debt Payoff Calculator</strong>
                <span>Combine student loans with auto and credit card debt</span>
              </div>
            </Link>
            <Link href="/personal-loan-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>🤝</span>
              <div>
                <strong>Personal Loan Calculator</strong>
                <span>Explore student loan refinancing and consolidation options</span>
              </div>
            </Link>
            <Link href="/payment-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>💵</span>
              <div>
                <strong>Payment Calculator</strong>
                <span>Quick monthly payment and loan payoff solver</span>
              </div>
            </Link>
            <Link href="/budget-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>📊</span>
              <div>
                <strong>Budget Calculator</strong>
                <span>Organize post-grad living expenses and savings goals</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
