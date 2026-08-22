"use client";

import { useState } from "react";
import Link from "next/link";
import { REFINANCE_FAQS } from "@/lib/data/refinanceFaqs";
import AdBanner from "@/components/AdBanner";
import styles from "./RefinanceReferenceContent.module.css";

export default function RefinanceReferenceContent() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className={styles.refContentSection}>
      <div className={styles.refProse}>
        <h2>How Mortgage Refinancing &amp; Breakeven Math Work</h2>
        <p>
          Refinancing involves paying off your existing mortgage with a newly originated loan—typically to secure a lower interest rate, adjust the repayment term, convert an adjustable-rate mortgage (ARM) to a fixed rate, or access home equity via cash out.
        </p>
        <p>
          While lowering your monthly payment is attractive, refinancing incurs closing fees (2% to 5% of loan value).
          Evaluating whether refinancing is financially sound hinges on calculating your <strong>breakeven horizon</strong>—the exact point where accumulated monthly savings fully offset upfront fees.
        </p>

        {/* Breakeven Formula */}
        <div className={styles.formulaCard}>
          <div className={styles.formulaTitle}>Mortgage Refinance Breakeven Equation</div>
          <div className={styles.formulaMath}>
            Breakeven Period (Months) = Total Refinance Closing Costs ÷ Monthly Payment Savings
          </div>
          <div className={styles.formulaDesc}>
            If you plan to own and occupy the property longer than the breakeven period, refinancing generates pure net savings. If you plan to sell or move before reaching breakeven, refinancing results in a net financial loss.
          </div>
        </div>

        <h3>Key Reasons to Refinance</h3>
        <ul>
          <li><strong>Rate Reduction:</strong> Lowering your interest rate by 0.75% to 1.0% can save thousands in annual interest charges.</li>
          <li><strong>Term Compression:</strong> Switching from a 30-year to a 15-year mortgage significantly accelerates equity growth while slashing lifetime interest.</li>
          <li><strong>PMI Removal:</strong> If your home has appreciated to 20%+ equity, refinancing can eliminate costly Private Mortgage Insurance premiums.</li>
          <li><strong>Debt Consolidation (Cash Out):</strong> Consolidating 20%+ APR credit card debt into a single mortgage rate saves thousands in high-interest charges.</li>
        </ul>

        {/* Ad Banner */}
        <AdBanner />

        {/* FAQ SECTION */}
        <div className={styles.faqWrap} id="faqs">
          <h2>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            {REFINANCE_FAQS.map((faq, index) => {
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
          <h3>Related Mortgage Calculators</h3>
          <p>Explore tools to evaluate your housing financing across Holy Calculator:</p>
          <div className={styles.relatedLinks}>
            <Link href="/mortgage-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>🏠</span>
              <div>
                <strong>Mortgage Calculator</strong>
                <span>Calculate principal, interest, taxes, PMI, and full schedules</span>
              </div>
            </Link>
            <Link href="/amortization-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>📅</span>
              <div>
                <strong>Amortization Calculator</strong>
                <span>Track how extra mortgage prepayments shorten your loan</span>
              </div>
            </Link>
            <Link href="/debt-to-income-ratio-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>📊</span>
              <div>
                <strong>Debt-to-Income Ratio</strong>
                <span>Check underwriting approval thresholds before refinancing</span>
              </div>
            </Link>
            <Link href="/down-payment-calculator" className={styles.relatedLink}>
              <span className={styles.relatedIcon}>💰</span>
              <div>
                <strong>Down Payment Calculator</strong>
                <span>Determine equity thresholds and PMI removal milestones</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
