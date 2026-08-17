import { MORTGAGE_FAQS } from "@/lib/data/mortgageFaqs";
import Link from "next/link";
import styles from "./MortgageReferenceContent.module.css";

export default function MortgageReferenceContent() {
  return (
    <article className={styles.referenceContainer}>
      {/* 1. Mortgage PITI Breakdown */}
      <section className={styles.section}>
        <h2>Understanding Your Monthly Mortgage Payment (PITI)</h2>
        <p>
          When you buy a home, your total monthly mortgage payment typically consists of four main components, often
          abbreviated as <strong>PITI</strong>: Principal, Interest, Taxes, and Insurance. Using a comprehensive <strong>mortgage calculator</strong> helps
          you estimate how each component affects your monthly housing budget.
        </p>

        <div className={styles.componentsGrid}>
          <div className={styles.compCard}>
            <h3>1. Principal</h3>
            <p>
              The portion of your payment that directly reduces your remaining loan balance. Early in a 30-year mortgage,
              only a small percentage of your payment goes toward principal, but as the loan amortizes, principal reduction increases each month.
            </p>
          </div>

          <div className={styles.compCard}>
            <h3>2. Interest</h3>
            <p>
              The fee charged by your lender for borrowing the money. Interest makes up the vast majority of your monthly payment
              during the initial years of a long-term loan.
            </p>
          </div>

          <div className={styles.compCard}>
            <h3>3. Property Taxes</h3>
            <p>
              Real estate taxes collected by your local municipality or county to fund public schools, roads, and emergency services.
              Lenders usually collect 1/12th of your annual tax bill each month into an escrow account.
            </p>
          </div>

          <div className={styles.compCard}>
            <h3>4. Homeowners Insurance &amp; PMI</h3>
            <p>
              Hazard insurance protects your home against property damage. If your down payment is under 20% on a conventional loan,
              Private Mortgage Insurance (PMI) is also included to protect the lender until your loan-to-value (LTV) ratio reaches 80%.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Recurring vs Non-Recurring Costs */}
      <section className={styles.section}>
        <h2>Homeownership Costs: Recurring vs. Non-Recurring</h2>
        <p>
          Preparing for homeownership involves planning for both ongoing monthly expenses and upfront, one-time closing costs.
        </p>

        <div className={styles.tableWrapper}>
          <table className={styles.costTable}>
            <thead>
              <tr>
                <th>Cost Category</th>
                <th>Frequency</th>
                <th>Estimated Cost / Impact</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Property Taxes</strong></td>
                <td>Monthly (via Escrow)</td>
                <td>~0.5% – 2.5% of home value / yr</td>
                <td>Local government real estate property assessments.</td>
              </tr>
              <tr>
                <td><strong>Homeowners Insurance</strong></td>
                <td>Monthly (via Escrow)</td>
                <td>~$1,000 – $2,500 / yr</td>
                <td>Hazard and dwelling coverage required by lenders.</td>
              </tr>
              <tr>
                <td><strong>PMI / MIP</strong></td>
                <td>Monthly</td>
                <td>0.3% – 1.5% of loan amount / yr</td>
                <td>Required when down payment is less than 20% (cancels at 80% LTV on conventional loans).</td>
              </tr>
              <tr>
                <td><strong>HOA / Condo Fees</strong></td>
                <td>Monthly / Quarterly</td>
                <td>$50 – $500+ / mo</td>
                <td>Community maintenance, amenities, and shared building upkeep.</td>
              </tr>
              <tr>
                <td><strong>Closing Costs</strong></td>
                <td>One-Time Upfront</td>
                <td>2% – 5% of loan amount</td>
                <td>Lender origination fees, appraisal, title search, escrow fees, and recording costs.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Early Payoff Strategies */}
      <section className={styles.section}>
        <h2>Strategies for Paying Off Your Mortgage Early</h2>
        <p>
          Accelerating your mortgage payoff can save tens of thousands of dollars in interest and free up your monthly cash flow years ahead of schedule.
        </p>

        <div className={styles.strategyGrid}>
          <div className={styles.strategyCard}>
            <h3>Biweekly Payment Plan</h3>
            <p>
              Paying half your monthly mortgage payment every two weeks results in 26 half-payments per year (13 full monthly payments).
              This extra payment directly reduces principal, shaving 4 to 5 years off a 30-year mortgage without drastic budgeting changes.
            </p>
          </div>

          <div className={styles.strategyCard}>
            <h3>Extra Monthly Principal Contributions</h3>
            <p>
              Adding even $100 or $200 directly toward principal each month compounding reduces your loan balance and accelerates equity buildup.
            </p>
          </div>

          <div className={styles.strategyCard}>
            <h3>Refinancing to a Shorter Term</h3>
            <p>
              Switching from a 30-year to a 15-year fixed mortgage secures lower interest rates while dramatically shortening your loan duration.
            </p>
          </div>
        </div>
      </section>

      {/* 4. FAQ Section */}
      <section className={styles.section}>
        <h2>Frequently Asked Questions — Mortgage Calculator</h2>
        <div className={styles.faqList}>
          {MORTGAGE_FAQS.map((faq, index) => (
            <div key={index} className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>{faq.question}</h3>
              <p className={styles.faqAnswer}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Related Tools */}
      <section className={styles.section}>
        <h2>Related Calculators</h2>
        <div className={styles.relatedGrid}>
          <Link href="/calorie-calculator" className={styles.relatedCard}>
            <span className={styles.relatedIcon}>🔥</span>
            <div>
              <h4>Calorie Calculator</h4>
              <p>Estimate daily maintenance calories and weight loss targets.</p>
            </div>
          </Link>

          <Link href="/pregnancy-calculator" className={styles.relatedCard}>
            <span className={styles.relatedIcon}>🗓️</span>
            <div>
              <h4>Pregnancy Calculator</h4>
              <p>Estimate due date, gestational age, and trimester milestones.</p>
            </div>
          </Link>

          <Link href="/age-calculator" className={styles.relatedCard}>
            <span className={styles.relatedIcon}>◷</span>
            <div>
              <h4>Age Calculator</h4>
              <p>Calculate chronological age in years, months, weeks, and days.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Financial Disclaimer Footer */}
      <div className={styles.contentDisclaimer}>
        <p>
          <strong>Financial Notice:</strong> Information on holycalculator.com is intended for general educational purposes
          and is not individualized financial advice, credit decisioning, or an offer of loan terms. Loan calculations use standard
          fixed-rate amortization formulas. Always consult a licensed mortgage broker, loan officer, or financial planner regarding
          your specific financing situation.
        </p>
      </div>
    </article>
  );
}
