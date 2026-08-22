"use client";

import { useState } from "react";
import Link from "next/link";
import { SALARY_FAQS } from "@/lib/data/salaryFaqs";
import AdBanner from "@/components/AdBanner";
import styles from "./SalaryReferenceContent.module.css";

export default function SalaryReferenceContent() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className={styles.refContentSection}>
      <div className={styles.refProse}>
        <h2>How Salary &amp; Hourly Wage Conversions Work</h2>
        <p>
          Converting between hourly wages and annual salaries requires understanding standard full-time employment schedules.
          A standard 40-hour work week across 52 weeks in a calendar year equals <strong>2,080 working hours annually</strong>.
        </p>
        <p>
          Depending on your company&rsquo;s payroll calendar, earnings are distributed across different pay period counts:
          <strong> Weekly</strong> (52 paychecks), <strong>Bi-Weekly</strong> (26 paychecks every two weeks), <strong>Semi-Monthly</strong> (24 paychecks twice per month), or <strong>Monthly</strong> (12 paychecks).
        </p>

        {/* Formula Box */}
        <div className={styles.formulaCard}>
          <div className={styles.formulaTitle}>Standard Wage Conversion Formulas</div>
          <div className={styles.formulaMath}>
            Annual Salary = Hourly Wage × Hours per Week × 52 Weeks
          </div>
          <div className={styles.formulaMath}>
            Hourly Rate = Annual Salary ÷ 2,080 Hours (Standard Full-Time)
          </div>
          <div className={styles.formulaDesc}>
            Bi-Weekly Gross Paycheck = Annual Salary ÷ 26 &nbsp;|&nbsp; Semi-Monthly Gross Paycheck = Annual Salary ÷ 24
          </div>
        </div>

        {/* Quick Reference Table */}
        <div className={styles.tableCard}>
          <h4>Hourly to Annual Salary Quick Reference (40 hrs/wk)</h4>
          <table className={styles.compTable}>
            <thead>
              <tr>
                <th>Hourly Wage</th>
                <th>Weekly Pay</th>
                <th>Bi-Weekly (26x)</th>
                <th>Monthly (12x)</th>
                <th>Annual Salary</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>$20.00 / hr</td>
                <td>$800</td>
                <td>$1,600</td>
                <td>$3,467</td>
                <td><strong>$41,600 / yr</strong></td>
              </tr>
              <tr>
                <td>$25.00 / hr</td>
                <td>$1,000</td>
                <td>$2,000</td>
                <td>$4,333</td>
                <td><strong>$52,000 / yr</strong></td>
              </tr>
              <tr>
                <td>$35.00 / hr</td>
                <td>$1,400</td>
                <td>$2,800</td>
                <td>$6,067</td>
                <td><strong>$72,800 / yr</strong></td>
              </tr>
              <tr>
                <td>$50.00 / hr</td>
                <td>$2,000</td>
                <td>$4,000</td>
                <td>$8,667</td>
                <td><strong>$104,000 / yr</strong></td>
              </tr>
              <tr>
                <td>$75.00 / hr</td>
                <td>$3,000</td>
                <td>$6,000</td>
                <td>$13,000</td>
                <td><strong>$156,000 / yr</strong></td>
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
            {SALARY_FAQS.map((faq, index) => {
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
          <h3>Related Income &amp; Financial Calculators</h3>
          <p>Explore tools to calculate and optimize your earnings across Holy Calculator:</p>
          <div className={styles.relatedLinks}>
            <Link href="/401k-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>📈</span>
              <div>
                <strong>401(k) Calculator</strong>
                <span>Calculate employer match and retirement compounding</span>
              </div>
            </Link>
            <Link href="/budget-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>📊</span>
              <div>
                <strong>Budget Calculator</strong>
                <span>Organize bi-weekly paychecks and monthly living expenses</span>
              </div>
            </Link>
            <Link href="/house-affordability-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>🏡</span>
              <div>
                <strong>House Affordability</strong>
                <span>Find out what home price your salary qualifies for</span>
              </div>
            </Link>
            <Link href="/debt-to-income-ratio-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>📉</span>
              <div>
                <strong>Debt-to-Income Ratio</strong>
                <span>Evaluate your wage capacity against recurring debt payments</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
