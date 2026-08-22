"use client";

import { useState } from "react";
import Link from "next/link";
import { FOUR_ZERO_ONE_K_FAQS } from "@/lib/data/fourZeroOneKFaqs";
import AdBanner from "@/components/AdBanner";
import styles from "./FourZeroOneKReferenceContent.module.css";

export default function FourZeroOneKReferenceContent() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className={styles.refContentSection}>
      <div className={styles.refProse}>
        <h2>How 401(k) Retirement Plans Compound Wealth</h2>
        <p>
          A 401(k) plan is an employer-sponsored, tax-advantaged defined-contribution retirement account.
          It combines three distinct wealth-building levers: pre-tax or Roth elective salary deferrals, corporate matching contributions (instant free return), and decades of compound investment growth without interim tax drag.
        </p>
        <p>
          By automating paycheck contributions and capturing your full employer matching percentage, even modest monthly deferrals grow exponentially over a 20 to 40-year career.
          Reinvesting dividends and letting compound interest work means investment returns typically comprise 60% to 80% of your ultimate retirement nest egg.
        </p>

        {/* Core Formula Box */}
        <div className={styles.formulaCard}>
          <div className={styles.formulaTitle}>401(k) Future Value Compounding Equation</div>
          <div className={styles.formulaMath}>
            FV = PV × (1 + r)<sup>n</sup> + PMT × [ ((1 + r)<sup>n</sup> − 1) / r ]
          </div>
          <div className={styles.formulaDesc}>
            Where <strong>FV</strong> is projected 401(k) retirement balance, <strong>PV</strong> is current balance, <strong>PMT</strong> is total annual contributions (Employee + Employer Match), <strong>r</strong> is average annual investment return rate, and <strong>n</strong> is years until retirement.
          </div>
        </div>

        <h3>The Exponential Value of Employer Matching</h3>
        <p>
          Consider an employee earning <strong>$75,000</strong> whose employer provides a <strong>50% match up to 6% of salary</strong>:
        </p>
        <ul>
          <li><strong>Employee Deferral (6%):</strong> <code>$75,000 × 0.06 = $4,500 / year ($375/month)</code></li>
          <li><strong>Employer Match (50% of 6%):</strong> <code>$4,500 × 0.50 = $2,250 / year ($187.50/month)</code></li>
          <li><strong>Total Annual Capital Invested:</strong> <code>$4,500 + $2,250 = $6,750 / year</code></li>
          <li><strong>30-Year Compounding at 7.0% Return:</strong> Generates over <strong>$680,000</strong> at retirement from just $135,000 in personal out-of-pocket contributions.</li>
        </ul>

        {/* Traditional vs Roth 401k Table */}
        <div className={styles.tableCard}>
          <h4>Traditional 401(k) vs. Roth 401(k) Comparison</h4>
          <table className={styles.compTable}>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Traditional 401(k)</th>
                <th>Roth 401(k)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Contribution Tax Treatment</strong></td>
                <td>Pre-tax dollars (reduces current year taxable income)</td>
                <td>After-tax dollars (no immediate tax deduction)</td>
              </tr>
              <tr>
                <td><strong>Withdrawal Tax Treatment</strong></td>
                <td>Taxed as ordinary income at retirement tax bracket</td>
                <td>100% tax-free withdrawals (contributions &amp; growth)</td>
              </tr>
              <tr>
                <td><strong>Best Suited For</strong></td>
                <td>High earners currently in peak tax brackets expecting lower income in retirement</td>
                <td>Early/mid-career savers expecting equal or higher tax brackets later in life</td>
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
            {FOUR_ZERO_ONE_K_FAQS.map((faq, index) => {
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
          <h3>Related Retirement &amp; Wealth Calculators</h3>
          <p>Plan your long-term wealth strategy with related tools across Holy Calculator:</p>
          <div className={styles.relatedLinks}>
            <Link href="/retirement-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>🌴</span>
              <div>
                <strong>Retirement Calculator</strong>
                <span>Estimate overall retirement nest egg needs &amp; withdrawal targets</span>
              </div>
            </Link>
            <Link href="/compound-interest-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>📈</span>
              <div>
                <strong>Compound Interest Calculator</strong>
                <span>Visualize exponential compounding across custom contribution periods</span>
              </div>
            </Link>
            <Link href="/budget-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>📊</span>
              <div>
                <strong>Budget Calculator</strong>
                <span>Optimize personal cash flow to free up more monthly savings</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
