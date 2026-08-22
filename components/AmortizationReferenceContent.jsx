"use client";

import { useState } from "react";
import Link from "next/link";
import { AMORTIZATION_FAQS } from "@/lib/data/amortizationFaqs";
import AdBanner from "@/components/AdBanner";
import styles from "./AmortizationReferenceContent.module.css";

export default function AmortizationReferenceContent() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className={styles.refContentSection}>
      <div className={styles.refProse}>
        <h2>Understanding Loan Amortization Schedules</h2>
        <p>
          Amortization is the process of gradually reducing a debt obligation through regular periodic payments of principal and interest over a specified duration.
          While each monthly installment remains identical across the life of a fixed-rate loan, the underlying composition of every payment shifts continuously.
        </p>
        <p>
          During the initial years of an amortized loan, the outstanding principal balance is at its highest, meaning that interest accounts for the overwhelming majority of your payment.
          As each principal payment chips away at the loan balance, future interest accrues on a smaller foundation, causing the equity-building principal slice to accelerate until the debt is extinguished.
        </p>

        {/* Formula Display */}
        <div className={styles.formulaCard}>
          <div className={styles.formulaTitle}>Monthly Interest &amp; Principal Breakdown Formulas</div>
          <div className={styles.formulaMath}>
            Interest<sub>m</sub> = Balance<sub>m−1</sub> × (Annual Rate ÷ 12)
          </div>
          <div className={styles.formulaMath}>
            Principal<sub>m</sub> = Monthly Payment − Interest<sub>m</sub>
          </div>
          <div className={styles.formulaDesc}>
            Where <strong>Balance<sub>m−1</sub></strong> is the remaining loan principal at the end of the previous period. The newly reduced balance becomes: <code>Balance<sub>m</sub> = Balance<sub>m−1</sub> − Principal<sub>m</sub></code>.
          </div>
        </div>

        <h3>The Power of Prepayments and Extra Principal</h3>
        <p>
          Because amortized interest is strictly a function of remaining principal, any additional payment applied directly to principal yields a compounding savings effect.
          For instance, on a 30-year $300,000 mortgage at 6.5% interest:
        </p>
        <ul>
          <li><strong>Standard Term:</strong> Total interest paid equals <strong>$382,633</strong> across 360 payments.</li>
          <li><strong>With $100 Extra / Month:</strong> Total interest falls to <strong>$328,112</strong> — a cash savings of <strong>$54,521</strong> and shaving over <strong>4 years</strong> off the loan.</li>
          <li><strong>With $250 Extra / Month:</strong> Total interest falls to <strong>$272,490</strong> — saving <strong>$110,143</strong> and retiring the debt <strong>8.5 years early</strong>.</li>
        </ul>

        {/* Amortization Schedule Comparison */}
        <div className={styles.tableCard}>
          <h4>Sample $100,000 Loan at 6.0% (15-Year Term)</h4>
          <table className={styles.compTable}>
            <thead>
              <tr>
                <th>Timeline Period</th>
                <th>Monthly Payment</th>
                <th>Principal Share</th>
                <th>Interest Share</th>
                <th>Ending Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Month 1</strong></td>
                <td>$843.86</td>
                <td>$343.86 (41%)</td>
                <td>$500.00 (59%)</td>
                <td>$99,656.14</td>
              </tr>
              <tr>
                <td><strong>Year 5 (Month 60)</strong></td>
                <td>$843.86</td>
                <td>$453.60 (54%)</td>
                <td>$390.26 (46%)</td>
                <td>$77,597.51</td>
              </tr>
              <tr>
                <td><strong>Year 10 (Month 120)</strong></td>
                <td>$843.86</td>
                <td>$611.83 (73%)</td>
                <td>$232.03 (27%)</td>
                <td>$45,793.89</td>
              </tr>
              <tr>
                <td><strong>Month 180 (Final)</strong></td>
                <td>$843.86</td>
                <td>$839.66 (99.5%)</td>
                <td>$4.20 (0.5%)</td>
                <td>$0.00</td>
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
            {AMORTIZATION_FAQS.map((faq, index) => {
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
          <p>Explore amortization-related tools across Holy Calculator:</p>
          <div className={styles.relatedLinks}>
            <Link href="/payment-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>💵</span>
              <div>
                <strong>Payment Calculator</strong>
                <span>Quick monthly payment and debt payoff time estimator</span>
              </div>
            </Link>
            <Link href="/mortgage-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>🏠</span>
              <div>
                <strong>Mortgage Calculator</strong>
                <span>Factor in property taxes, insurance, PMI, and HOA fees</span>
              </div>
            </Link>
            <Link href="/loan-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>💳</span>
              <div>
                <strong>Loan Calculator</strong>
                <span>Comprehensive general loan payment and compounding solver</span>
              </div>
            </Link>
            <Link href="/auto-loan-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>🚗</span>
              <div>
                <strong>Auto Loan Calculator</strong>
                <span>Calculate car payments with trade-ins and sales taxes</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
