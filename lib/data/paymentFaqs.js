export const PAYMENT_FAQS = [
  {
    question: "How is a monthly loan payment calculated?",
    answer:
      "A fixed-rate monthly loan payment is calculated using the standard annuity amortization formula: P = [L × r × (1 + r)^n] / [(1 + r)^n − 1], where L is the loan amount, r is the monthly interest rate (annual APR divided by 12), and n is the total number of monthly payments.",
  },
  {
    question: "What is the difference between a fixed term and fixed payment calculation?",
    answer:
      "A fixed-term calculation determines your required monthly installment based on a set payoff duration (e.g. 15 or 30 years). A fixed-payment calculation does the reverse: it tells you exactly how many months and years it will take to become debt-free when you pay a specific fixed dollar amount each month.",
  },
  {
    question: "How much can paying extra each month save in total interest?",
    answer:
      "Paying extra directly reduces your loan principal. Because monthly interest is calculated against the remaining principal balance, every extra dollar paid reduces all future interest compounding, often shortening repayment timelines by years and saving thousands in financing fees.",
  },
  {
    question: "Why is more of my payment going toward interest at the beginning of the loan?",
    answer:
      "Loan amortization front-loads interest payments because interest is calculated on the outstanding balance. Early on, your balance is highest, so the interest charge is large. As principal decreases with each installment, the interest portion shrinks and the principal portion increases.",
  },
  {
    question: "Does the payment calculation include property taxes or insurance?",
    answer:
      "This payment calculator computes pure principal and interest (P&I). For home mortgages requiring escrow for property taxes, homeowners insurance, and private mortgage insurance (PMI), please use our dedicated Mortgage Calculator.",
  },
];
