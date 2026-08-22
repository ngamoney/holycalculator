"use client";

import { useState } from "react";
import Link from "next/link";
import { DEBT_RATIO_FAQS } from "@/lib/data/debtRatioFaqs";
import AdBanner from "@/components/AdBanner";
import styles from "./DebtRatioReferenceContent.module.css";

export default function DebtRatioReferenceContent() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className={styles.refContentSection}>
      <div className={styles.refProse}>
        <h2>Understanding Debt-to-Income (DTI) Underwriting Ratios</h2>
        <p>
          Your Debt-to-Income (DTI) ratio is one of the most critical metrics used by mortgage lenders, auto finance companies, and personal loan underwriters to assess credit risk.
          While your credit score indicates your repayment reliability, your DTI ratio measures your <strong>cash flow capacity</strong> to service new monthly debt payments.
        </p>
        <p>
          Underwriters divide your DTI into two distinct calculations: the <strong>Front-End Ratio</strong> (which looks solely at proposed housing expenses) and the <strong>Back-End Ratio</strong> (which factors in all recurring debt obligations combined).
        </p>

        {/* Formulas Display */}
        <div className={styles.formulaCard}>
          <div className={styles.formulaTitle}>Front-End vs. Back-End DTI Formulas</div>
          <div className={styles.formulaMath}>
            Front-End DTI (%) = (Monthly Housing Costs ÷ Gross Monthly Income) × 100
          </div>
          <div className={styles.formulaMath}>
            Back-End DTI (%) = (Total Monthly Debt Obligations ÷ Gross Monthly Income) × 100
          </div>
          <div className={styles.formulaDesc}>
            Housing costs include mortgage principal &amp; interest, real estate taxes, homeowners insurance, and HOA fees. Non-housing debt includes minimum credit card payments, auto loans, student debt, and personal loans.
          </div>
        </div>

        {/* Loan Program Guidelines Table */}
        <div className={styles.tableCard}>
          <h4>DTI Limits by Mortgage Loan Program</h4>
          <table className={styles.compTable}>
            <thead>
              <tr>
                <th>Loan Program</th>
                <th>Standard Front-End DTI</th>
                <th>Standard Back-End DTI</th>
                <th>Maximum with Compensating Factors</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Conventional (Fannie/Freddie)</strong></td>
                <td>28%</td>
                <td>36%</td>
                <td>Up to 45%–50% via Desktop Underwriter (DU)</td>
              </tr>
              <tr>
                <td><strong>FHA Loan</strong></td>
                <td>31%</td>
                <td>43%</td>
                <td>Up to 46.9% / 56.9% with strong cash reserves &amp; high credit</td>
              </tr>
              <tr>
                <td><strong>VA Loan</strong></td>
                <td>None stated</td>
                <td>41% benchmark</td>
                <td>Flexible based on meeting minimum Residual Income rules</td>
              </tr>
              <tr>
                <td><strong>USDA Loan</strong></td>
                <td>29%</td>
                <td>41%</td>
                <td>Up to 44% with automated underwriting waiver</td>
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
            {DEBT_RATIO_FAQS.map((faq, index) => {
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
          <h3>Related Mortgage &amp; Home Buying Calculators</h3>
          <p>Explore tools to evaluate loan qualification across Holy Calculator:</p>
          <div className={styles.relatedLinks}>
            <Link href="/mortgage-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>🏠</span>
              <div>
                <strong>Mortgage Calculator</strong>
                <span>Calculate full PITI payments, PMI, and loan amortization</span>
              </div>
            </Link>
            <Link href="/house-affordability-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>🏡</span>
              <div>
                <strong>House Affordability Calculator</strong>
                <span>Estimate maximum home purchase price based on your DTI</span>
              </div>
            </Link>
            <Link href="/debt-payoff-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>📉</span>
              <div>
                <strong>Debt Payoff Calculator</strong>
                <span>Pay down revolving credit to quickly lower your DTI ratio</span>
              </div>
            </Link>
            <Link href="/budget-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>📊</span>
              <div>
                <strong>Budget Calculator</strong>
                <span>Organize monthly income and line-item debt expenses</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
