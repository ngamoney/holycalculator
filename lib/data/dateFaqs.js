/**
 * dateFaqs.js — Comprehensive FAQ entries for the Date Calculator page
 */

export const DATE_FAQS = [
  {
    question: "How is the exact duration between two dates calculated?",
    answer:
      "The duration between two dates is calculated by comparing calendar years, months, and days using standard calendar borrowing math. For example, if the end day is smaller than the start day, the calculator borrows the exact number of days in the preceding month. The tool also provides a continuous breakdown into total days, total weeks, total hours, total minutes, and total seconds.",
  },
  {
    question: "How does business-day counting work with holidays?",
    answer:
      "Business-day counting calculates elapsed time by skipping Saturdays, Sundays, and any selected official or custom holidays. When adding 10 business days to a Thursday, for instance, the calculator steps forward day-by-day, skipping weekend days and active holidays so that only actual working days are counted toward the total.",
  },
  {
    question: "What is the difference between fixed and floating US holidays?",
    answer:
      "Fixed holidays occur on the exact same month and day every year (e.g. Independence Day is always July 4th, Christmas Day is always December 25th). Floating holidays occur on a specific weekday relative to the month (e.g. Martin Luther King Jr. Day is the 3rd Monday of January; Thanksgiving Day is the 4th Thursday of November). Our calculator automatically computes exact floating holiday dates for any target year.",
  },
  {
    question: "How are leap years and month-end dates handled when adding months?",
    answer:
      "When adding or subtracting months, if the target month has fewer days than the starting day (for example, adding 1 month to January 31st), the calculator automatically rolls back to the last valid day of that target month (February 28th in a standard year, or February 29th in a leap year).",
  },
  {
    question: "Can I add custom company or regional holidays?",
    answer:
      "Yes. In the Holiday Settings drawer, you can add custom recurring holidays by entering a name, month, and day. These custom holidays will be excluded automatically whenever you calculate business-day additions or subtractions.",
  },
];
