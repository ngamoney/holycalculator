/**
 * mortgageFaqs.js — FAQ dataset for the Mortgage Calculator page.
 * Used for both JSON-LD FAQPage schema and the rendered FAQ section.
 * Copy is YMYL-compliant: factual, objective, citing standard banking and CFPB guidelines.
 */

export const MORTGAGE_FAQS = [
  {
    question: "How is a monthly mortgage payment calculated?",
    answer:
      "A monthly mortgage payment comprises four primary components often referred to as PITI: Principal, Interest, Taxes, and Insurance. The core Principal and Interest (P&I) portion is calculated using the standard fixed-rate amortization formula: M = L × [r(1+r)^N] / [(1+r)^N - 1], where L is the loan amount, r is the monthly interest rate, and N is the total number of monthly payments. Property taxes, homeowners insurance, private mortgage insurance (PMI), and homeowners association (HOA) fees are added to determine your total monthly out-of-pocket payment.",
  },
  {
    question: "What is PMI and when does it go away?",
    answer:
      "Private Mortgage Insurance (PMI) is required by conventional lenders when a home buyer makes a down payment of less than 20% (giving a Loan-to-Value ratio greater than 80%). Under the federal Homeowners Protection Act (HPA), conventional PMI automatically cancels when your principal loan balance reaches 78% of the home's original appraised value, or you may request cancellation once your balance drops to 80% LTV. Government-backed loans operate differently: VA loans require no PMI, while FHA loans charge a Mortgage Insurance Premium (MIP) that typically lasts for the entire loan term if the down payment was under 10%.",
  },
  {
    question: "Should I pay off my mortgage early with extra payments?",
    answer:
      "Making extra principal payments reduces your remaining loan balance faster, accelerating equity build-up and saving significant interest over the life of the loan. However, financial planners recommend balancing early mortgage payoff against other financial priorities — such as establishing a 3- to 6-month emergency reserve, maxing out tax-advantaged retirement accounts, or paying off high-interest consumer debt. If your mortgage carries a low fixed interest rate (e.g., under 4–5%), investing surplus funds in diversified assets may yield a higher long-term return than paying down low-cost debt.",
  },
  {
    question: "How does a biweekly mortgage payment plan work?",
    answer:
      "Under a biweekly payment structure, you pay half of your monthly mortgage payment every two weeks. Because there are 52 weeks in a year, you make 26 half-payments, which equals 13 full monthly payments per year — effectively making one extra full monthly payment each year toward principal. On a standard 30-year fixed loan at 6.5% interest, a biweekly plan can shave roughly 4 to 5 years off your loan term and reduce total interest paid by 15% to 20%.",
  },
  {
    question: "What is the difference between Conventional, FHA, VA, and USDA loans?",
    answer:
      "Conventional loans are backed by private lenders or Fannie Mae/Freddie Mac and require a minimum 3% to 5% down payment, with PMI required below 20% down. FHA loans are insured by the Federal Housing Administration, accepting credit scores down to 580 with a 3.5% down payment. VA loans are guaranteed by the U.S. Department of Veterans Affairs for eligible military service members and veterans, offering 0% down payment with no monthly PMI. USDA loans are backed by the U.S. Department of Agriculture for qualifying rural and suburban home buyers, offering 0% down options.",
  },
  {
    question: "How much house can I afford based on my income?",
    answer:
      "Lenders typically evaluate home affordability using two key Debt-to-Income (DTI) guidelines: the 28% front-end rule and the 36% back-end rule. Under the front-end rule, your total monthly housing costs (PITI + HOA) should not exceed 28% of your gross monthly income. Under the back-end rule, your total monthly debt obligations (housing payment plus student loans, car loans, credit cards, and minimum debt payments) should not exceed 36% to 43% of gross income.",
  },
];
