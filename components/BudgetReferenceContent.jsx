import { BUDGET_FAQS } from "@/lib/data/budgetFaqs";
import Link from "next/link";
import styles from "./BudgetReferenceContent.module.css";

export default function BudgetReferenceContent() {
  return (
    <article className={styles.referenceArticle}>
      {/* 1. Specialized Financial Calculators Hub */}
      <section className={styles.section}>
        <h2>Specialized Financial Calculators</h2>
        <p>
          While this personal budget calculator provides a comprehensive view of your monthly cash flow,
          complex financial obligations like home mortgages, car loans, or long-term retirement planning involve specialized calculations.
          Use our dedicated tools built specifically for your financial needs:
        </p>

        <div className={styles.hubGrid}>
          <Link href="/mortgage-calculator" className={styles.hubCard}>
            <div className={styles.hubIcon}>🏠</div>
            <div className={styles.hubContent}>
              <h3>Mortgage Calculator</h3>
              <p>Calculate PITI payments, property taxes, homeowners insurance, PMI auto-cancellation, and 30-year amortization.</p>
              <span className={styles.hubLinkText}>Open Mortgage Calculator →</span>
            </div>
          </Link>

          <Link href="/retirement-calculator" className={styles.hubCard}>
            <div className={styles.hubIcon}>🌴</div>
            <div className={styles.hubContent}>
              <h3>Retirement Calculator</h3>
              <p>Estimate target nest egg needs, 4% rule withdrawals, and 401(k)/IRA trajectory across 4 calculation modes.</p>
              <span className={styles.hubLinkText}>Open Retirement Calculator →</span>
            </div>
          </Link>

          <Link href="/#finance" className={styles.hubCard}>
            <div className={styles.hubIcon}>🚗</div>
            <div className={styles.hubContent}>
              <h3>Auto Loan Calculator</h3>
              <p>Estimate monthly vehicle financing payments, dealer trade-ins, sales tax, and total loan interest paid.</p>
              <span className={styles.hubLinkText}>Open Auto Loan Calculator →</span>
            </div>
          </Link>

          <Link href="/loan-calculator" className={styles.hubCard}>
            <div className={styles.hubIcon}>💳</div>
            <div className={styles.hubContent}>
              <h3>Generic Loan Calculator</h3>
              <p>Calculate amortized loan payments, deferred lump sums, and bond present values with custom compounding frequencies.</p>
              <span className={styles.hubLinkText}>Open Loan Calculator →</span>
            </div>
          </Link>
        </div>
      </section>

      {/* 2. Understanding Budgeting Rules */}
      <section className={styles.section}>
        <h2>Popular Budgeting Frameworks</h2>

        <div className={styles.frameworkCard}>
          <h3>1. The 50/30/20 Rule</h3>
          <p>
            The 50/30/20 rule divides your after-tax net income into three straightforward categories:
          </p>
          <ul>
            <li><strong>50% Needs:</strong> Essential living expenses like mortgage/rent, utilities, groceries, insurance, and minimum debt payments.</li>
            <li><strong>30% Wants:</strong> Non-essential spending like dining out, entertainment, hobbies, streaming services, and vacations.</li>
            <li><strong>20% Savings &amp; Debt:</strong> Retirement contributions, emergency savings, and extra principal payments toward debt.</li>
          </ul>
        </div>

        <div className={styles.frameworkCard}>
          <h3>2. The 80/20 &ldquo;Pay Yourself First&rdquo; Rule</h3>
          <p>
            A simplified approach where you immediately allocate 20% of your income to savings and investments as soon as you get paid,
            and feel free to spend the remaining 80% on living expenses and personal desires without tracking every micro-transaction.
          </p>
        </div>

        <div className={styles.frameworkCard}>
          <h3>3. Zero-Based Budgeting</h3>
          <p>
            Every single dollar of income is assigned a specific job before the month begins (Income minus Expenses equals $0).
            Any remaining surplus is explicitly assigned to savings, debt payoff, or an emergency buffer fund.
          </p>
        </div>
      </section>

      {/* 3. Avoiding Double-Dipping */}
      <section className={styles.section}>
        <h2>Practical Guide: Avoiding &ldquo;Double-Dipping&rdquo;</h2>
        <p>
          A common mistake in budget calculations is double-counting the same dollar under two categories.
          For instance, if you purchase $400 of groceries and $150 of dining out using a credit card, you should enter $400 under
          <strong>Food &amp; Groceries</strong> and $150 under <strong>Meals Out</strong>.
        </p>
        <p>
          Do <strong>not</strong> also enter $550 under &ldquo;Credit Card Payment&rdquo; unless you are paying off a pre-existing historical balance debt from prior months.
          Keeping current month spending categorized by item type yields an accurate budget breakdown.
        </p>
      </section>

      {/* 4. Frequently Asked Questions */}
      <section className={styles.section}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {BUDGET_FAQS.map((faq, idx) => (
            <div key={idx} className={styles.faqItem}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
