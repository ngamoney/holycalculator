import { RETIREMENT_FAQS } from "@/lib/data/retirementFaqs";
import styles from "./RetirementReferenceContent.module.css";

export default function RetirementReferenceContent() {
  return (
    <article className={styles.referenceArticle}>
      {/* 1. How Retirement Planning Works */}
      <section className={styles.section}>
        <h2>How Retirement Planning Works</h2>
        <p>
          Retirement planning is the financial process of determining your future income goals, estimating your living expenses in retirement,
          and building an investment portfolio to support those expenses. Unlike short-term savings goals, retirement planning involves long horizons
          (often 20 to 40 years of accumulation followed by 20 to 30 years of decumulation) where compound interest and inflation play decisive roles.
        </p>
        <p>
          Financial readiness — rather than arbitrary age — is the true deciding factor for when you can safely retire. Achieving financial independence
          means your accumulated assets, combined with fixed income sources like Social Security or pensions, generate sufficient passive cash flow
          to cover your annual expenses without exhausting your nest egg.
        </p>
      </section>

      {/* 2. Benchmark Rules of Thumb */}
      <section className={styles.section}>
        <h2>Three Core Rules of Thumb in Retirement Planning</h2>

        <div className={styles.ruleCard}>
          <h3>1. The 10% to 15% Savings Rule</h3>
          <p>
            <strong>The Guideline:</strong> Aim to save between 10% and 15% of your pre-tax gross income each year for retirement, starting in your 20s or early 30s.
            This target includes any employer match (e.g., if you contribute 6% and your employer matches 4%, your total savings rate is 10%).
          </p>
          <p>
            <strong>Worked Example:</strong> If your pre-tax salary is $80,000, saving 12% equates to $9,600 per year ($800 per month). Over 35 years at an average 7% annual return,
            this monthly contribution grows to over $1.1 million.
          </p>
          <p className={styles.limitNote}>
            <em>Limitation:</em> If you begin saving in your late 30s or 40s, a 10% rate will likely leave a shortfall. Later starters may need to save 20% to 25% or more.
          </p>
        </div>

        <div className={styles.ruleCard}>
          <h3>2. The 80% Income Replacement Rule</h3>
          <p>
            <strong>The Guideline:</strong> Expect to need approximately 80% of your final pre-retirement annual income to maintain your current standard of living in retirement.
          </p>
          <p>
            <strong>Worked Example:</strong> If you earn $100,000 in your final working year, the 80% rule estimates you will need roughly $80,000 per year in retirement income.
            While workplace expenses (commuting, professional attire, payroll taxes) decrease, healthcare and leisure spending often rise.
          </p>
          <p className={styles.limitNote}>
            <em>Limitation:</em> Retirees who enter retirement with a paid-off mortgage may require only 60–70% of income, whereas those planning extensive international travel or facing high medical costs may require 90%+ of income.
          </p>
        </div>

        <div className={styles.ruleCard}>
          <h3>3. The 4% Safe Withdrawal Rule</h3>
          <p>
            <strong>The Guideline:</strong> Derived from the landmark Trinity Study (1998), the 4% rule states that withdrawing 4% of your initial retirement portfolio value in Year 1,
            and adjusting that dollar amount for inflation in subsequent years, offers a 95%+ historical probability that your money will last at least 30 years.
          </p>
          <p>
            <strong>Worked Example:</strong> With a $1,000,000 nest egg, a 4% initial withdrawal provides $40,000 in Year 1. If inflation is 3% in Year 2, your Year 2 withdrawal becomes $41,200.
          </p>
          <p className={styles.limitNote}>
            <em>Limitation:</em> The 4% rule assumes a balanced 50/50 or 60/40 stock/bond portfolio and a 30-year horizon. Early retirees (retiring in their 40s or 50s) should target lower initial withdrawal rates (3.0% to 3.5%).
          </p>
        </div>
      </section>

      {/* 3. The Impact of Inflation */}
      <section className={styles.section}>
        <h2>The Impact of Inflation on Retirement Savings</h2>
        <p>
          Inflation is the gradual erosion of purchasing power over time. According to historical statistics from the U.S. Bureau of Labor Statistics (BLS),
          the U.S. Consumer Price Index (CPI) has averaged approximately <strong>2.5% to 2.6% per year</strong> over the past 50 years.
        </p>
        <p>
          At an average 2.6% inflation rate, prices double roughly every 27 years (by the Rule of 72). This means that a lifestyle costing $50,000 per year today
          will cost approximately $100,000 per year 27 years from now. To protect against inflation, retirement portfolios must maintain growth assets
          (such as equities and real estate) even during retirement, rather than shifting entirely into fixed-yield cash equivalents.
        </p>
      </section>

      {/* 4. Common Retirement Income Vehicles */}
      <section className={styles.section}>
        <h2>Overview of Retirement Income Vehicles</h2>

        <div className={styles.gridContainer}>
          <div className={styles.vehicleCard}>
            <h3>Social Security</h3>
            <p>
              Designed by the Social Security Administration (SSA) to replace approximately 40% of average working wages. Benefits can be claimed as early as age 62 or delayed up to age 70 for delayed retirement credits.
            </p>
          </div>

          <div className={styles.vehicleCard}>
            <h3>Employer 401(k) / 403(b) / 457</h3>
            <p>
              Tax-advantaged workplace savings plans allowing pre-tax or Roth contributions. Many employers offer matching contributions (e.g., 50% match up to 6%), which represent immediate guaranteed returns.
            </p>
          </div>

          <div className={styles.vehicleCard}>
            <h3>Traditional &amp; Roth IRAs</h3>
            <p>
              Individual Retirement Accounts. Traditional IRAs offer upfront tax deductions with taxed withdrawals; Roth IRAs use after-tax dollars to provide 100% tax-free qualified withdrawals in retirement.
            </p>
          </div>

          <div className={styles.vehicleCard}>
            <h3>Pensions &amp; Annuities</h3>
            <p>
              Defined-benefit pensions provide guaranteed lifetime monthly income funded by employers. Commercial annuities convert a lump sum into guaranteed annuity payments backed by an insurance provider.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Frequently Asked Questions */}
      <section className={styles.section}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {RETIREMENT_FAQS.map((faq, idx) => (
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
