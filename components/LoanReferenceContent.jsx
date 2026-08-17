import { LOAN_FAQS } from "@/lib/data/loanFaqs";
import Link from "next/link";
import styles from "./LoanReferenceContent.module.css";

export default function LoanReferenceContent() {
  return (
    <article className={styles.referenceArticle}>
      {/* 1. Hub Section: Specialized Loan Calculators */}
      <section className={styles.section}>
        <h2>Specialized Loan Calculators</h2>
        <p>
          While this general-purpose Loan Calculator calculates standard interest, compounding, and amortization math across any custom loan term,
          specialized loans involve unique costs like property taxes, private mortgage insurance (PMI), dealer trade-ins, or income-driven repayment.
          Use our dedicated tools built specifically for your loan type:
        </p>

        <div className={styles.hubGrid}>
          <Link href="/mortgage-calculator" className={styles.hubCard}>
            <div className={styles.hubIcon}>🏠</div>
            <div className={styles.hubContent}>
              <h3>Mortgage Calculator</h3>
              <p>Calculate monthly PITI payments, property taxes, homeowners insurance, PMI auto-cancellation, and 30-year amortization.</p>
              <span className={styles.hubLinkText}>Open Mortgage Calculator →</span>
            </div>
          </Link>

          <Link href="/#finance" className={styles.hubCard}>
            <div className={styles.hubIcon}>🚗</div>
            <div className={styles.hubContent}>
              <h3>Auto Loan Calculator</h3>
              <p>Estimate monthly vehicle financing payments, trade-in values, sales tax, doc fees, and total interest paid.</p>
              <span className={styles.hubLinkText}>Open Auto Loan Calculator →</span>
            </div>
          </Link>

          <div className={`${styles.hubCard} ${styles.placeholderCard}`}>
            <div className={styles.hubIcon}>🎓</div>
            <div className={styles.hubContent}>
              <h3>Student Loan Calculator</h3>
              <p>Evaluate federal &amp; private student loan repayment plans, income-driven options, and grace period interest.</p>
              <span className={styles.comingSoonBadge}>Coming Soon</span>
            </div>
          </div>

          <div className={`${styles.hubCard} ${styles.placeholderCard}`}>
            <div className={styles.hubIcon}>💼</div>
            <div className={styles.hubContent}>
              <h3>Personal &amp; Business Loan Calculator</h3>
              <p>Compare unsecured personal loans, origination fees, SBA business financing, and line-of-credit interest rates.</p>
              <span className={styles.comingSoonBadge}>Coming Soon</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Understanding Loan Basics */}
      <section className={styles.section}>
        <h2>Understanding Loan Basics</h2>
        <p>
          A loan is an agreement where a lender provides funds to a borrower, who agrees to repay the principal amount along with interest over a set term.
          Mastering three fundamental concepts ensures you select the most cost-effective loan:
        </p>

        <div className={styles.conceptCard}>
          <h3>1. Nominal APR vs. Effective APY (EAR)</h3>
          <p>
            <strong>Annual Percentage Rate (APR):</strong> The base annual interest rate stated on a loan contract without factoring in compounding within the year.
          </p>
          <p>
            <strong>Annual Percentage Yield (APY) / Effective Rate:</strong> The true annual cost of borrowing when intra-year compounding is included.
            For instance, a 6.0% nominal rate compounding monthly produces an effective APY of <strong>6.17%</strong> ($ (1 + 0.06/12)^{12} - 1 $).
          </p>
        </div>

        <div className={styles.conceptCard}>
          <h3>2. Compounding Frequency</h3>
          <p>
            Interest can compound annually, semi-annually, quarterly, monthly, biweekly, daily, or continuously. Higher compounding frequencies calculate interest on unpaid interest more frequently, slightly increasing the total borrowing cost.
          </p>
        </div>

        <div className={styles.conceptCard}>
          <h3>3. Loan Term &amp; Payment Frequency</h3>
          <p>
            The loan term determines how long you have to repay the debt. Shorter terms require higher periodic payments but drastically reduce total interest paid. Conversely, longer terms lower monthly payments but increase total interest expenses over the life of the loan.
          </p>
        </div>
      </section>

      {/* 3. Secured vs. Unsecured Loans & The 5 Cs of Credit */}
      <section className={styles.section}>
        <h2>Secured vs. Unsecured Loans &amp; The 5 Cs of Credit</h2>
        <p>
          Loans fall into two primary structural categories:
        </p>
        <ul>
          <li>
            <strong>Secured Loans:</strong> Backed by a specific physical asset (collateral), such as a house (mortgage) or car (auto loan). If the borrower defaults, the lender can seize the collateral. Because of lower risk, secured loans feature lower interest rates.
          </li>
          <li>
            <strong>Unsecured Loans:</strong> Not backed by collateral (e.g. personal loans, credit cards, student loans). Qualification relies solely on creditworthiness, resulting in higher interest rates.
          </li>
        </ul>

        <h3 className={styles.subHeading}>The 5 Cs of Credit</h3>
        <p>Lenders evaluate your loan application against five key criteria:</p>
        <ol className={styles.fiveCsList}>
          <li><strong>Character:</strong> Credit history, score, and track record of timely debt payments.</li>
          <li><strong>Capacity:</strong> Debt-to-income (DTI) ratio and income stability to confirm repayment ability.</li>
          <li><strong>Capital:</strong> Liquid savings, investments, and personal net worth.</li>
          <li><strong>Collateral:</strong> Value and condition of the asset backing a secured loan.</li>
          <li><strong>Conditions:</strong> Loan purpose, interest rate trends, and macroeconomic environment.</li>
        </ol>
      </section>

      {/* 4. Frequently Asked Questions */}
      <section className={styles.section}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {LOAN_FAQS.map((faq, idx) => (
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
