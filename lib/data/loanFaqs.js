/**
 * loanFaqs.js — FAQ dataset for the Loan Calculator page.
 * Used for both JSON-LD FAQPage schema and the rendered FAQ section.
 */

export const LOAN_FAQS = [
  {
    question: "What is the difference between APR and APY?",
    answer:
      "Annual Percentage Rate (APR) represents the nominal annual cost of borrowing without accounting for the compounding of interest within the year. Annual Percentage Yield (APY), or Effective Annual Rate (EAR), factors in how frequently interest compounds (e.g. monthly, daily). Because compounding adds interest onto interest, APY is always slightly higher than nominal APR for compounding frequencies greater than once per year.",
  },
  {
    question: "What is an amortized loan?",
    answer:
      "An amortized loan is a debt structure where equal, regular periodic payments are made throughout the loan term. Each payment covers both interest accrued during the period and a portion of the principal balance. Early in the loan, a larger share of each payment goes toward interest; as the principal balance decreases, a larger portion goes directly toward paying down principal.",
  },
  {
    question: "What is a deferred payment loan?",
    answer:
      "A deferred payment loan allows the borrower to delay periodic payments until loan maturity or a specified future date. Interest continues to compound over the loan term and accumulates onto the principal balance, resulting in a single lump-sum payment due at maturity.",
  },
  {
    question: "How does compounding frequency affect the total interest I pay?",
    answer:
      "More frequent compounding (e.g., daily vs. annual compounding) means interest is calculated and added to the principal balance more often. Over time, higher compounding frequencies generate slightly higher total interest charges for borrowers, making daily compounding more expensive for borrowers and more profitable for lenders.",
  },
  {
    question: "What is a bond's present value vs. face value?",
    answer:
      "A bond's face value (or par value) is the predetermined lump sum the issuer promises to pay the bondholder at maturity. The present value (or issue price) is what the bond is worth today. When interest rates are applied, the bond is purchased at a discount (present value < face value), and the difference represents the investor's total earned interest at maturity.",
  },
  {
    question: "What are the '5 Cs of Credit' used by lenders?",
    answer:
      "Lenders evaluate loan applicants using the 5 Cs of Credit: Character (credit history and reliability), Capacity (debt-to-income ratio and ability to repay), Capital (personal savings and net worth), Collateral (assets backing a secured loan), and Conditions (loan purpose, interest rate environment, and economic trends).",
  },
];
