/**
 * budgetFaqs.js — FAQ dataset for the Budget Calculator page.
 * Used for both JSON-LD FAQPage schema and the rendered FAQ section.
 */

export const BUDGET_FAQS = [
  {
    question: "What percentage of my income should go to housing?",
    answer:
      "A widely recognized financial guideline is the 30% Rule, which recommends spending no more than 30% of your gross monthly income on housing expenses (mortgage/rent, property taxes, home insurance, and utilities). In high-cost-of-living urban areas, renters often spend 35%–40%, but compensating by reducing transportation or dining expenses is key to maintaining overall budget balance.",
  },
  {
    question: "What is a good Debt-to-Income (DTI) ratio?",
    answer:
      "Lenders generally consider a Debt-to-Income (DTI) ratio of 36% or lower to be healthy, with no more than 28% allocated to housing debt (the 28/36 rule). A DTI ratio above 43% is typically considered high-risk by mortgage lenders and may limit your ability to qualify for new credit.",
  },
  {
    question: "How do I avoid 'double-dipping' when entering expenses?",
    answer:
      "Double-dipping occurs when you record the same dollar under two different categories. For example, if you pay for restaurant meals using a credit card, enter that spending under 'Meals Out & Dining' rather than under 'Credit Card Payment'. Only record credit card payments under the Debt category if you are paying off pre-existing historical balance debt that isn't captured in your current month's line items.",
  },
  {
    question: "What is the 50/30/20 budgeting rule?",
    answer:
      "Popularized by Senator Elizabeth Warren, the 50/30/20 rule divides your after-tax net income into three spending categories: 50% for Needs (housing, utilities, groceries, transportation, minimum debt payments), 30% for Wants (dining out, entertainment, hobbies, travel), and 20% for Savings & Debt Payoff (401k, emergency fund, investments, extra debt principal).",
  },
  {
    question: "How much should I save in an emergency fund?",
    answer:
      "Financial planners recommend keeping 3 to 6 months' worth of essential living expenses in a liquid high-yield savings account. Dual-income households with stable jobs may aim for 3 months, while freelancers, single earners, or individuals with variable commission income should target 6 to 9 months of expenses.",
  },
  {
    question: "How often should I review and update my budget?",
    answer:
      "You should review your budget monthly to compare actual spending against your planned limits. Additionally, recalculate your budget whenever major life events occur, such as a salary increase, job change, rent adjustment, new child, or major debt payoff.",
  },
];
