export const GRADE_FAQS = [
  {
    question: "What is a weighted grade and how is it calculated?",
    answer:
      "A weighted grade assigns different proportional values (or weights) to various course components rather than treating every assignment equally. To calculate a weighted average, multiply each assignment score by its corresponding weight percentage, sum all of these weighted values, and divide the total by the sum of the weights: Weighted Average = ∑(Grade × Weight) / ∑(Weight)."
  },
  {
    question: "What happens if my course weights do not add up to 100%?",
    answer:
      "If your course is currently in progress and graded assignments only total a partial percentage (such as 65%), our calculator normalizes your score to a 100% scale by dividing the weighted points earned so far by the total completed weight. This provides an accurate representation of your current standing in the course."
  },
  {
    question: "How do I calculate what score I need on my final exam?",
    answer:
      "To find your required final exam score, use the formula: Final Exam Score Needed = [Desired Final Grade - (Current Standing Grade × (1 - Final Exam Weight))] / Final Exam Weight. For instance, if you currently have an 88%, desire a 90%, and your final exam is worth 25% (0.25), you need: [90 - (88 × 0.75)] / 0.25 = 96% on the final exam."
  },
  {
    question: "How do letter grades translate to percentages and GPA points?",
    answer:
      "In standard North American academic grading systems, an 'A' (93–96%) represents a 4.0 GPA, an 'A-' (90–92%) represents a 3.7 GPA, a 'B+' (87–89%) represents a 3.3 GPA, and so on. Use our conversion reference table above to view the complete standard 4.0 grade point mapping."
  },
  {
    question: "Can I calculate my grade using total points instead of percentages?",
    answer:
      "Yes! You can toggle our calculator to 'Points' mode. In a points-based grading system, your overall course grade equals total points earned divided by total points possible multiplied by 100. If categories have specific weights, the calculator computes the category percentage first and applies the weight factor."
  },
  {
    question: "Can I save or share my calculation results?",
    answer:
      "Yes. Every time you adjust your grades, our calculator automatically updates your URL with a compressed snapshot using state serialization. You can click 'Share / Copy Link' to bookmark or send your calculation to classmates. Additionally, your recent calculations are saved locally in your browser's history."
  }
];
