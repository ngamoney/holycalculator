/**
 * fractionFaqs.js — Comprehensive FAQ entries for the Fraction Calculator page
 */

export const FRACTION_FAQS = [
  {
    question: "How do I add or subtract fractions with different denominators?",
    answer:
      "To add or subtract fractions with different denominators, first find a common denominator by calculating the Least Common Multiple (LCM) or multiplying the denominators. Convert both fractions into equivalent fractions with the common denominator, add or subtract the numerators, and simplify the result using the Greatest Common Divisor (GCD).",
  },
  {
    question: "How do I convert a decimal into a fraction?",
    answer:
      "To convert a decimal into a fraction, place the decimal numbers over a power of 10 corresponding to the number of decimal places (for example, 0.75 becomes 75/100). Then, simplify the fraction by dividing both numerator and denominator by their Greatest Common Divisor (75/100 reduces to 3/4).",
  },
  {
    question: "How do I simplify a fraction to lowest terms?",
    answer:
      "To simplify a fraction to lowest terms, find the Greatest Common Divisor (GCD) of the numerator and denominator, then divide both numbers by that GCD. For example, for 24/36, the GCD is 12. Dividing 24 and 36 by 12 gives 2/3.",
  },
  {
    question: "How do I divide one fraction by another?",
    answer:
      "To divide by a fraction, multiply by its reciprocal (flip the second fraction). For example, (1/2) ÷ (3/4) becomes (1/2) × (4/3) = 4/6, which simplifies to 2/3.",
  },
  {
    question: "What is the difference between an improper fraction and a mixed number?",
    answer:
      "An improper fraction has a numerator that is greater than or equal to its denominator (e.g. 7/4). A mixed number combines a whole integer and a proper fraction (e.g. 1 3/4). Both represent the exact same numeric value.",
  },
];
