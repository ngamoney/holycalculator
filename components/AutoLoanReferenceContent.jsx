"use client";

import { useState } from "react";
import Link from "next/link";
import { AUTO_LOAN_FAQS } from "@/lib/data/autoLoanFaqs";
import AdBanner from "@/components/AdBanner";
import styles from "./AutoLoanReferenceContent.module.css";

export default function AutoLoanReferenceContent() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className={styles.refContentSection}>
      <div className={styles.refProse}>
        <h2>How Auto Loan Payments &amp; Financing Work</h2>
        <p>
          Financing a vehicle involves calculating fixed monthly installments that combine principal repayment with compounding interest across the agreed loan duration (typically 24 to 84 months).
          Unlike personal or real estate loans, auto financing incorporates unique upfront variables—including trade-in allowances, dealer documentation fees, title and registration costs, and state sales taxes.
        </p>

        {/* Formula Display Box */}
        <div className={styles.formulaCard}>
          <div className={styles.formulaTitle}>Mathematical Formula — Monthly Car Loan Payment</div>
          <div className={styles.formulaMath}>
            P = [ L × r × (1 + r)<sup>n</sup> ] / [ (1 + r)<sup>n</sup> − 1 ]
          </div>
          <div className={styles.formulaDesc}>
            Where <em>L</em> is the net loan balance (Vehicle Price − Down Payment − Trade-in + Taxes &amp; Fees), <em>r</em> is monthly APR (Annual Rate / 12), and <em>n</em> is total loan months.
          </div>
        </div>

        <h3>Worked Step-by-Step Example</h3>
        <p>
          Suppose you buy a vehicle priced at <strong>$35,000</strong> with a <strong>$5,000 trade-in</strong>, <strong>$3,500 down payment (10%)</strong>, <strong>6.5% sales tax</strong>, and <strong>5.5% interest rate</strong> over <strong>60 months</strong>:
        </p>
        <ul>
          <li><strong>Taxable Purchase Base:</strong> <code>$35,000 − $5,000 trade-in = $30,000</code></li>
          <li><strong>Sales Tax (6.5%):</strong> <code>$30,000 × 0.065 = $1,950</code></li>
          <li><strong>Net Financed Amount:</strong> <code>$35,000 − $3,500 down − $5,000 trade + $1,950 tax + $800 fees = $29,250</code></li>
          <li><strong>Monthly Payment (60 mo @ 5.5%):</strong> <strong>$558.82 / month</strong></li>
          <li><strong>Total Interest Paid:</strong> <code>($558.82 × 60) − $29,250 = $4,279.20</code></li>
        </ul>

        {/* Financial Benchmark Callout */}
        <div className={styles.benchmarkCard}>
          <h4>The 20/4/10 Rule for Car Financing</h4>
          <div className={styles.benchmarkGrid}>
            <div className={styles.benchmarkItem}>
              <strong>20% Down Payment</strong>
              <span>Protects against rapid initial depreciation and prevents underwater loan balances.</span>
            </div>
            <div className={styles.benchmarkItem}>
              <strong>4-Year Term Limit</strong>
              <span>Limits total interest paid compared to 72 or 84-month extended loan contracts.</span>
            </div>
            <div className={styles.benchmarkItem}>
              <strong>10% Income Cap</strong>
              <span>Total car costs (loan payment + auto insurance + gas) should stay below 10% of gross monthly income.</span>
            </div>
          </div>
        </div>

        {/* Ad Banner between sections */}
        <AdBanner />

        {/* Frequently Asked Questions Section */}
        <div className={styles.faqWrap} id="faqs">
          <h2>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            {AUTO_LOAN_FAQS.map((faq, index) => {
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

        {/* Related Calculators Links */}
        <div className={styles.relatedCard}>
          <h3>Explore Related Financial Calculators</h3>
          <p>Check out our suite of free, instant financial planning tools:</p>
          <div className={styles.relatedGrid}>
            <Link href="/mortgage-calculator" className={styles.relatedLink}>
              <strong>Mortgage Calculator →</strong>
              <span>Estimate monthly home loan payments &amp; taxes</span>
            </Link>
            <Link href="/loan-calculator" className={styles.relatedLink}>
              <strong>Loan Calculator →</strong>
              <span>Calculate general amortized &amp; deferred loans</span>
            </Link>
            <Link href="/budget-calculator" className={styles.relatedLink}>
              <strong>Budget Calculator →</strong>
              <span>Plan monthly spending &amp; calculate DTI ratios</span>
            </Link>
            <Link href="/compound-interest-calculator" className={styles.relatedLink}>
              <strong>Compound Interest →</strong>
              <span>Calculate investment growth &amp; savings yields</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
