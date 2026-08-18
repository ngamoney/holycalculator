/**
 * compoundInterestFaqs.js — FAQ dataset for the Compound Interest Calculator page.
 * Used for both JSON-LD FAQPage schema and the rendered FAQ section.
 */

export const COMPOUND_INTEREST_FAQS = [
  {
    question: "What is compound interest and how is it calculated?",
    answer:
      "Compound interest is interest calculated on both the initial principal amount and all accumulated interest from previous periods. Unlike simple interest, compound interest allows your wealth to grow exponentially because you earn 'interest on interest.' The standard periodic compounding formula is A = P(1 + r/n)^(nt).",
  },
  {
    question: "What is the difference between simple interest and compound interest?",
    answer:
      "Simple interest is calculated exclusively on the original principal amount for the entire duration of the loan or investment. Compound interest calculates interest on the growing total balance (principal plus prior interest earned). Over long periods, compound interest dramatically outperforms simple interest due to exponential compounding.",
  },
  {
    question: "What is the Rule of 72 and how do I use it?",
    answer:
      "The Rule of 72 is a mental math shortcut used to estimate how many years it will take for an investment to double in value at a fixed annual rate of return. You divide 72 by the annual interest rate (R). For example, at a 7.2% annual return, your money doubles in approximately 10 years (72 / 7.2 = 10).",
  },
  {
    question: "How does compounding frequency affect my total returns?",
    answer:
      "More frequent compounding (e.g. daily or monthly compounding versus annual compounding) means interest is added to your account balance more often. Each subsequent interest calculation applies to a slightly larger balance. Over 20 to 30 years, higher compounding frequencies add significant value.",
  },
  {
    question: "How does contribution timing (start vs. end of period) affect growth?",
    answer:
      "Making contributions at the start of each month or year gives those funds an extra compounding period to grow compared to end-of-period contributions. Over a 30-year period, start-of-period contributions accumulate noticeably higher total wealth.",
  },
  {
    question: "What is Jacob Bernoulli's connection to Euler's constant e and compounding?",
    answer:
      "In 1683, Swiss mathematician Jacob Bernoulli studied continuous compound interest while analyzing the growth of $1 at 100% interest compounded infinitely often. This led directly to the discovery of the mathematical constant e (approximately 2.71828), which forms the basis for continuous compounding A = Pe^(rt).",
  },
];
