"use client";

import { useState } from "react";
import Link from "next/link";
import { DOWN_PAYMENT_FAQS } from "@/lib/data/downPaymentFaqs";
import AdBanner from "@/components/AdBanner";
import styles from "./DownPaymentReferenceContent.module.css";

export default function DownPaymentReferenceContent() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className={styles.refContentSection}>
      <div className={styles.refProse}>
        <h2>How Down Payments &amp; Upfront Cash Requirements Work</h2>
        <p>
          A down payment represents the initial cash contribution you pay toward the purchase price of a home.
          The remaining balance is financed through a residential mortgage lender.
        </p>
        <p>
          In addition to the down payment, home buyers must prepare for out-of-pocket <strong>closing costs</strong> (2% to 5% of purchase price), which cover loan origination, property appraisal, title search, escrow fees, and prepaid homeowners insurance and property taxes.
        </p>

        {/* Down Payment Programs Comparison */}
        <div className={styles.tableCard}>
          <h4>Minimum Down Payment Requirements by Loan Program</h4>
          <table className={styles.compTable}>
            <thead>
              <tr>
                <th>Mortgage Program</th>
                <th>Minimum Down Payment</th>
                <th>PMI / Mortgage Insurance Rule</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Conventional (First-Time Buyer)</strong></td>
                <td>3.0%</td>
                <td>Private Mortgage Insurance (PMI) removable at 20% equity</td>
              </tr>
              <tr>
                <td><strong>Conventional (Standard)</strong></td>
                <td>5.0%</td>
                <td>PMI required until reaching 80% Loan-to-Value (LTV)</td>
              </tr>
              <tr>
                <td><strong>FHA Loan</strong></td>
                <td>3.5% (580+ credit) / 10% (500–579)</td>
                <td>Mortgage Insurance Premium (MIP) required for life of loan if &lt;10% down</td>
              </tr>
              <tr>
                <td><strong>VA Loan (Military)</strong></td>
                <td>0% ($0 down)</td>
                <td>No monthly PMI (one-time VA funding fee applies)</td>
              </tr>
              <tr>
                <td><strong>USDA Loan (Rural Housing)</strong></td>
                <td>0% ($0 down)</td>
                <td>Annual USDA guarantee fee (0.35%)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>The 20% Down Payment Tradeoff</h3>
        <p>
          While putting 20% down avoids PMI premiums ($100–$300/mo) and secures slightly lower interest rates, saving $80,000–$100,000 in cash can delay homeownership by years.
          During that waiting period, home price appreciation and rental rate increases may surpass the cumulative cost of paying temporary PMI.
        </p>

        {/* Ad Banner */}
        <AdBanner />

        {/* FAQ SECTION */}
        <div className={styles.faqWrap} id="faqs">
          <h2>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            {DOWN_PAYMENT_FAQS.map((faq, index) => {
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
          <h3>Related Real Estate Calculators</h3>
          <p>Explore tools to plan your home purchase across Holy Calculator:</p>
          <div className={styles.relatedLinks}>
            <Link href="/mortgage-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>🏠</span>
              <div>
                <strong>Mortgage Calculator</strong>
                <span>Calculate monthly PITI, PMI, and full amortization</span>
              </div>
            </Link>
            <Link href="/house-affordability-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>🏡</span>
              <div>
                <strong>House Affordability</strong>
                <span>Determine purchase price limits based on your income</span>
              </div>
            </Link>
            <Link href="/rent-vs-buy-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>⚖️</span>
              <div>
                <strong>Rent vs. Buy Calculator</strong>
                <span>Model the financial breakeven of buying vs investing savings</span>
              </div>
            </Link>
            <Link href="/debt-to-income-ratio-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>📊</span>
              <div>
                <strong>Debt-to-Income Ratio</strong>
                <span>Check underwriting approval odds before making an offer</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
