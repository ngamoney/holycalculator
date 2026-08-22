"use client";

import { useState } from "react";
import Link from "next/link";
import { RENT_VS_BUY_FAQS } from "@/lib/data/rentVsBuyFaqs";
import AdBanner from "@/components/AdBanner";
import styles from "./RentVsBuyReferenceContent.module.css";

export default function RentVsBuyReferenceContent() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className={styles.refContentSection}>
      <div className={styles.refProse}>
        <h2>The Complete Financial Economics of Renting vs. Buying</h2>
        <p>
          The decision between renting and buying a home is both a lifestyle choice and one of the largest financial commitments you will make.
          While conventional wisdom often equates renting to &ldquo;throwing money away,&rdquo; a rigorous mathematical comparison reveals that both housing pathways involve substantial unrecoverable costs.
        </p>
        <p>
          Homeowners incur non-equity expenses including mortgage interest, real estate taxes, homeowners insurance, HOA fees, maintenance (1%–2% of home value annually), and transaction costs (2%–5% to buy, 6%–8% to sell).
          Renters incur lease expenses, but avoid maintenance liabilities and preserve liquid capital (down payments and closing fees) that can compound in diversified index funds.
        </p>

        {/* The 5% Rule Box */}
        <div className={styles.ruleCard}>
          <div className={styles.ruleTitle}>The 5% Rule for Quick Comparison</div>
          <div className={styles.ruleMath}>
            Annual Unrecoverable Cost of Homeownership ≈ 5.0% of Home Value
          </div>
          <div className={styles.ruleBreakdown}>
            <span>• 1.0% Property Taxes</span>
            <span>• 1.0% Maintenance &amp; Repairs</span>
            <span>• 3.0% Cost of Capital / Mortgage Interest</span>
          </div>
          <div className={styles.ruleDesc}>
            <strong>Example:</strong> For a $500,000 home, the unrecoverable monthly cost of ownership is <code>($500,000 × 5%) ÷ 12 = $2,083/month</code>. If you can rent an equivalent quality home for less than $2,083/month, renting and investing the remainder is mathematically superior.
          </div>
        </div>

        <h3>When Buying Outperforms Renting</h3>
        <ul>
          <li><strong>Extended Stay Horizon:</strong> When you plan to remain in the property for 5 to 10+ years, allowing appreciation and principal amortization to offset transaction fees.</li>
          <li><strong>Forced Savings Discipline:</strong> Principal payments build equity automatically, whereas renters must actively invest their surplus cash flow.</li>
          <li><strong>Fixed Housing Cost:</strong> A 30-year fixed mortgage insulates your housing budget from rental market inflation over decades.</li>
        </ul>

        {/* Ad Banner */}
        <AdBanner />

        {/* FAQ SECTION */}
        <div className={styles.faqWrap} id="faqs">
          <h2>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            {RENT_VS_BUY_FAQS.map((faq, index) => {
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
          <h3>Related Real Estate &amp; Housing Calculators</h3>
          <p>Explore tools to evaluate your housing decisions across Holy Calculator:</p>
          <div className={styles.relatedLinks}>
            <Link href="/mortgage-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>🏠</span>
              <div>
                <strong>Mortgage Calculator</strong>
                <span>Calculate principal, interest, taxes, and PMI breakdowns</span>
              </div>
            </Link>
            <Link href="/house-affordability-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>🏡</span>
              <div>
                <strong>House Affordability</strong>
                <span>Find maximum home price based on your current salary</span>
              </div>
            </Link>
            <Link href="/down-payment-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>💰</span>
              <div>
                <strong>Down Payment Calculator</strong>
                <span>Determine upfront cash requirements and savings timelines</span>
              </div>
            </Link>
            <Link href="/refinance-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>🔄</span>
              <div>
                <strong>Refinance Calculator</strong>
                <span>Evaluate mortgage rate adjustments and breakeven horizons</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
