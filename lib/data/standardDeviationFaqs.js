/**
 * standardDeviationFaqs.js — Comprehensive FAQ entries for the Standard Deviation Calculator page
 */

export const STANDARD_DEVIATION_FAQS = [
  {
    question: "What is the difference between Population and Sample Standard Deviation?",
    answer:
      "Population Standard Deviation (σ) is used when your data set contains every single member of the entire population being studied (divided by N). Sample Standard Deviation (s) is used when your data set represents a sample taken from a larger population. Sample SD uses Bessel's correction (divided by N - 1) to eliminate systematic underestimation bias.",
  },
  {
    question: "Why does Sample Standard Deviation divide by N - 1 instead of N?",
    answer:
      "Dividing by N - 1 is known as Bessel's correction. When calculating sample variance using the sample mean rather than the true unknown population mean, the sample values tend to lie closer to their own sample mean. Dividing by N - 1 slightly increases the calculated variance to produce an unbiased estimate of the true population variance.",
  },
  {
    question: "What does a high vs. low standard deviation indicate?",
    answer:
      "A low standard deviation indicates that data points cluster tightly around the mean (low variability). A high standard deviation indicates that data points are spread out widely across a broader range of values.",
  },
  {
    question: "How is standard deviation used to measure financial risk?",
    answer:
      "In finance and investment management, standard deviation measures price volatility. A stock or fund with a high standard deviation experiences rapid and unpredictable price swings (higher risk), while a low standard deviation indicates stable, consistent price movements.",
  },
  {
    question: "What is the 95% Confidence Interval Margin of Error?",
    answer:
      "The 95% Confidence Interval Margin of Error calculates the range within which the true population mean is expected to lie with 95% certainty. It is calculated as 1.96 × (Standard Deviation / √N).",
  },
];
