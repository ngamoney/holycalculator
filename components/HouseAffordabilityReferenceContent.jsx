"use client";

import { useState } from "react";
import Link from "next/link";
import { HOUSE_AFFORDABILITY_FAQS } from "@/lib/data/houseAffordabilityFaqs";
import AdBanner from "@/components/AdBanner";
import styles from "./HouseAffordabilityReferenceContent.module.css";

export default function HouseAffordabilityReferenceContent() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className={styles.refContentSection}>
      <div className={styles.refProse}>
        <h2>How House Affordability &amp; Mortgage Qualification Work</h2>
        <p>
          Determining how much house you can afford involves calculating your maximum allowable monthly mortgage payment using lender Debt-to-Income (DTI) underwriting limits, and reverse-engineering the purchase price based on your down payment and current interest rates.
        </p>
        <p>
          Underwriters evaluate your total monthly housing cost—known as <strong>PITI</strong> (Principal, Interest, Property Taxes, and Homeowners Insurance), plus Private Mortgage Insurance (PMI) and HOA fees—to ensure housing does not exceed established percentage caps of your gross pre-tax income.
        </p>

        {/* 28/36 Rule Explanation Box */}
        <div className={styles.ruleCard}>
          <div className={styles.ruleTitle}>The 28/36 Underwriting Benchmark</div>
          <div className={styles.ruleMath}>
            Max Monthly Housing (PITI) = Gross Monthly Income × 28%
          </div>
          <div className={styles.ruleMath}>
            Max Total Monthly Debt = Gross Monthly Income × 36%
          </div>
          <div className={styles.ruleDesc}>
            If you earn $10,000/month gross ($120,000/year), your maximum monthly housing payment should not exceed $2,800/month, and all debt payments combined (housing + auto + student loans) must not exceed $3,600/month.
          </div>
        </div>

        <h3>The 4 Pillars of House Affordability</h3>
        <ul>
          <li><strong>Gross Income:</strong> The total verifiable income earned by all co-borrowers on the loan.</li>
          <li><strong>Monthly Debt Obligations:</strong> Minimum monthly payments for credit cards, student loans, auto financing, and personal loans. Lower debts directly increase your purchasing budget.</li>
          <li><strong>Down Payment Capital:</strong> Putting 20% down avoids Private Mortgage Insurance (PMI) and lowers your monthly payment. Putting 3% to 5% down allows earlier entry into homeownership with slightly higher monthly carrying costs.</li>
          <li><strong>Interest Rates &amp; Property Taxes:</strong> Higher mortgage rates increase the monthly interest portion of your payment, reducing the maximum principal amount you qualify to borrow.</li>
        </ul>

        {/* Ad Banner */}
        <AdBanner />

        {/* FAQ SECTION */}
        <div className={styles.faqWrap} id="faqs">
          <h2>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            {HOUSE_AFFORDABILITY_FAQS.map((faq, index) => {
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
          <h3>Related Real Estate &amp; Mortgage Calculators</h3>
          <p>Explore tools to evaluate your home buying budget across Holy Calculator:</p>
          <div className={styles.relatedLinks}>
            <Link href="/mortgage-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>🏠</span>
              <div>
                <strong>Mortgage Calculator</strong>
                <span>Calculate full PITI payments, amortization, and loan interest</span>
              </div>
            </Link>
            <Link href="/debt-to-income-ratio-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>📊</span>
              <div>
                <strong>Debt-to-Income Ratio</strong>
                <span>Check your front-end and back-end underwriting approval odds</span>
              </div>
            </Link>
            <Link href="/down-payment-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>💰</span>
              <div>
                <strong>Down Payment Calculator</strong>
                <span>Determine upfront savings targets and equity requirements</span>
              </div>
            </Link>
            <Link href="/rent-vs-buy-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>⚖️</span>
              <div>
                <strong>Rent vs. Buy Calculator</strong>
                <span>Compare the financial payoff of renting vs homeownership</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
