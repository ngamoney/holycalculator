/**
 * retirementFaqs.js — FAQ dataset for the Retirement Calculator page.
 * Used for both JSON-LD FAQPage schema and the rendered FAQ section.
 * Copy is YMYL-safe: objective, citing historical statistics (BLS, SSA, Fidelity guidelines).
 */

export const RETIREMENT_FAQS = [
  {
    question: "How much money do I need to retire?",
    answer:
      "A standard financial guideline is the 80% Rule, which suggests you will need roughly 80% of your pre-tax working income each year in retirement to maintain your lifestyle. Another common benchmark is to aim for a retirement nest egg equal to 10 to 12 times your final annual salary by age 67. However, exact needs vary based on your health costs, housing status, debt, desired travel, and other income sources like Social Security or pensions.",
  },
  {
    question: "What is the 4% safe withdrawal rule?",
    answer:
      "The 4% rule is a historical benchmark derived from the Trinity Study (1998). It suggests that retirees can withdraw 4% of their total investment portfolio in the first year of retirement, adjusting that dollar amount for inflation each subsequent year, with a high statistical probability that the portfolio will last at least 30 years. Financial planners note that market conditions, fee structures, and longer life expectancies may warrant a more flexible withdrawal rate between 3.3% and 4.0%.",
  },
  {
    question: "How does inflation affect my retirement savings?",
    answer:
      "Inflation reduces purchasing power over time. According to the U.S. Bureau of Labor Statistics (BLS), long-term historical inflation has averaged approximately 2.5% to 2.6% per year. At a 2.6% annual inflation rate, the cost of living doubles roughly every 27 years. This means a retiree needing $60,000 per year today would require approximately $120,000 per year 27 years into retirement to purchase the exact same goods and services.",
  },
  {
    question: "What is the difference between a 401(k) and an IRA?",
    answer:
      "A 401(k) is an employer-sponsored retirement plan that often includes employer matching contributions and higher annual contribution limits. An Individual Retirement Account (IRA) is opened independently through a brokerage. Both come in Traditional (pre-tax contributions, taxed withdrawals) and Roth (after-tax contributions, tax-free qualified withdrawals) structures. Financial advisors generally recommend contributing enough to a 401(k) to capture the full employer match before funding an IRA or additional savings.",
  },
  {
    question: "How much of my income will Social Security replace?",
    answer:
      "According to the Social Security Administration (SSA), Social Security benefits are designed to replace approximately 40% of the average worker's pre-retirement earnings. Lower earners may see a higher replacement percentage (~50–60%), while higher earners see a lower percentage (~25–35%). Social Security is intended to form a foundation of retirement income, requiring supplemental savings from 401(k)s, IRAs, or personal investments.",
  },
  {
    question: "What is the 10% savings rule for retirement?",
    answer:
      "The 10% to 15% rule suggests that individuals should aim to save 10% to 15% of their gross annual income for retirement starting in their 20s or early 30s (including any employer match). Starting later in life often requires a higher contribution rate — for instance, someone starting at age 40 may need to save 20% to 25% of their income to hit the same retirement target.",
  },
];
