"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./SalesTaxReferenceContent.module.css";
import { SALES_TAX_FAQS } from "@/lib/data/salesTaxFaqs";
import { STATE_SALES_TAX_RATES } from "@/lib/calculations/salesTax";
import AdBanner from "@/components/AdBanner";

export default function SalesTaxReferenceContent() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className={styles.refSection}>
      <div className={styles.refContainer}>
        {/* Section 1: What is Sales Tax? */}
        <h2 className={styles.blockHeading}>What is Sales Tax &amp; How Does It Work?</h2>
        <p className={styles.paragraph}>
          <strong>Sales tax</strong> is a consumption tax imposed by state and local governments on the retail sale of goods and select services. Unlike international Value-Added Tax (VAT), there is <strong>no federal sales tax in the United States</strong>. Instead, sales tax is levied independently by 45 individual states, the District of Columbia, and thousands of local municipalities (counties, cities, and special transit districts).
        </p>
        <p className={styles.paragraph}>
          Retailers collect sales tax from consumers at the point of sale on behalf of tax authorities. The combined sales tax rate paid by a customer equals the <strong>State Base Rate</strong> plus any applicable <strong>Local, County, or Municipal Surcharges</strong>.
        </p>

        {/* Section 2: States with No Sales Tax (NOMAD) */}
        <h3 className={styles.subHeading}>The 5 States with No General State Sales Tax (NOMAD)</h3>
        <p className={styles.paragraph}>
          Five U.S. states do not levy a general state-level sales tax, often remembered by the acronym <strong>NOMAD</strong>:
        </p>
        <ul className={styles.paragraph} style={{ paddingLeft: "20px" }}>
          <li><strong>New Hampshire (NH):</strong> 0.00% state sales tax (levies specific meals &amp; room taxes).</li>
          <li><strong>Oregon (OR):</strong> 0.00% state sales tax (no local sales tax).</li>
          <li><strong>Montana (MT):</strong> 0.00% state sales tax (resort communities may levy local option taxes up to 3%).</li>
          <li><strong>Alaska (AK):</strong> 0.00% state sales tax (local boroughs and cities levy local sales taxes up to 7.5%).</li>
          <li><strong>Delaware (DE):</strong> 0.00% state sales tax (levies a gross receipts tax on businesses instead).</li>
        </ul>

        {/* Section 3: Complete 50-State Sales Tax Rate Table */}
        <h2 className={styles.blockHeading}>State Sales Tax Rates Table (50 States + DC &amp; Territories)</h2>
        <div className={styles.tableNotice}>
          📌 <strong>Rates Status Notice:</strong> General state base rates and maximum local tax estimates last updated: <strong>August 2026</strong>. Actual rates depend on municipal boundaries and item category exemptions.
        </div>

        <div className={styles.tableCardWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>State / Territory</th>
                <th>State Base Rate</th>
                <th>Max Local Rate</th>
                <th>Max Combined Rate</th>
              </tr>
            </thead>
            <tbody>
              {STATE_SALES_TAX_RATES.map((st) => (
                <tr key={st.code}>
                  <td>
                    <strong>{st.name}</strong> ({st.code})
                  </td>
                  <td className={styles.monoCell}>{st.stateRate.toFixed(3).replace(/\.?0+$/, "")}%</td>
                  <td className={styles.monoCell}>{st.maxLocalRate.toFixed(3).replace(/\.?0+$/, "")}%</td>
                  <td className={styles.monoCell}>
                    <strong>{st.maxCombinedRate.toFixed(3).replace(/\.?0+$/, "")}%</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* In-Content Ad Placement after State Table */}
        <AdBanner />

        {/* Section 4: History & Deduction Context */}
        <h2 className={styles.blockHeading}>U.S. Sales Tax History &amp; Federal Deductibility</h2>
        <p className={styles.paragraph}>
          Taxes on trade in America date back to colonial times, most famously commemorated by the Boston Tea Party of 1773. Modern state sales taxes emerged during the Great Depression, starting with Mississippi in 1930, as states sought reliable revenue sources to fund public infrastructure and emergency relief.
        </p>
        <h3 className={styles.subHeading}>Sales Tax Deduction (Schedule A Itemized Deductions)</h3>
        <p className={styles.paragraph}>
          Under federal tax law, taxpayers who itemize deductions on Form 1040 (Schedule A) can choose to deduct either <strong>state and local income taxes</strong> OR <strong>state and local general sales taxes</strong> (the SALT deduction). Under current tax provisions, total SALT deductions are capped at $10,000 per household ($5,000 for married filing separately).
        </p>

        {/* Section 5: Sales Tax vs. VAT/GST */}
        <h3 className={styles.subHeading}>Sales Tax vs. International VAT &amp; GST</h3>
        <p className={styles.paragraph}>
          International shoppers frequently confuse U.S. sales tax with <strong>Value-Added Tax (VAT)</strong> or <strong>Goods and Services Tax (GST)</strong>. Key differences include:
        </p>
        <ul className={styles.paragraph} style={{ paddingLeft: "20px" }}>
          <li>
            <strong>Point of Collection:</strong> U.S. sales tax is collected exclusively at the final retail purchase. VAT/GST is collected incrementally at every step of manufacturing and distribution.
          </li>
          <li>
            <strong>Display Pricing:</strong> U.S. retail shelf prices almost always exclude sales tax (tax is calculated at checkout). In contrast, European and global VAT is typically included in the visible price tag.
          </li>
        </ul>

        {/* Disclaimer Callout */}
        <div className={styles.disclaimerCallout}>
          <h4 className={styles.disclaimerTitle}>Financial &amp; Tax Disclaimer</h4>
          <p className={styles.disclaimerBody}>
            The sales tax information provided on Holy Calculator is for general educational and reference purposes only. Tax laws, local municipal surcharges, and product-specific tax exemptions change periodically. This content does not constitute professional tax or legal advice. Always consult a certified public accountant (CPA) or your state Department of Revenue for transaction-specific guidance.
          </p>
        </div>

        {/* Section 6: FAQ Accordion */}
        <h2 className={styles.blockHeading}>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {SALES_TAX_FAQS.map((faq, index) => {
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
                    <p style={{ margin: 0 }}>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Section 7: Related Calculators */}
        <h2 className={styles.blockHeading}>Related Financial Calculators</h2>
        <div className={styles.relatedGrid}>
          <Link href="/mortgage-calculator" className={styles.relatedCard}>
            <div>
              <h3 className={styles.relatedCardTitle}>Mortgage Calculator</h3>
              <p className={styles.relatedCardDesc}>
                Calculate monthly house payments, property taxes, PMI, and full loan amortization schedules.
              </p>
            </div>
          </Link>
          <Link href="/loan-calculator" className={styles.relatedCard}>
            <div>
              <h3 className={styles.relatedCardTitle}>Loan Calculator</h3>
              <p className={styles.relatedCardDesc}>
                Calculate monthly loan payments, interest charges, and loan payoff timelines.
              </p>
            </div>
          </Link>
          <Link href="/budget-calculator" className={styles.relatedCard}>
            <div>
              <h3 className={styles.relatedCardTitle}>Budget Calculator</h3>
              <p className={styles.relatedCardDesc}>
                Plan your household budget, track expense categories, and calculate DTI ratios.
              </p>
            </div>
          </Link>
          <Link href="/currency-calculator" className={styles.relatedCard}>
            <div>
              <h3 className={styles.relatedCardTitle}>Currency Converter</h3>
              <p className={styles.relatedCardDesc}>
                Convert global foreign exchange rates with live exchange rates and comparison tables.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
