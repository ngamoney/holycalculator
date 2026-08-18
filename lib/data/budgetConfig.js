/**
 * budgetConfig.js — Configuration data for the Budget Calculator form.
 * Contains 4 income items and 9 collapsible expense categories with 30+ line items.
 */

export const INCOME_CONFIG = [
  { id: "salary", label: "Salary & Earned Income", hint: "W-2 wage, salary, hourly pay, or business income" },
  { id: "pension", label: "Pension & Social Security", hint: "Monthly pension benefits, SSA payouts, or annuities" },
  { id: "investments", label: "Investments & Savings", hint: "Interest, capital gains, dividends, rental income, etc." },
  { id: "otherIncome", label: "Other Income", hint: "Alimony, side hustles, freelance, gifts, or royalties" },
];

export const EXPENSE_CATEGORIES_CONFIG = [
  {
    id: "housing",
    title: "Housing & Utilities",
    icon: "🏠",
    isDebtCategory: true,
    items: [
      { id: "mortgage", label: "Mortgage Payment", isDebtItem: true },
      { id: "propertyTax", label: "Property Tax", isDebtItem: false },
      { id: "rent", label: "Rent Payment", isDebtItem: true },
      { id: "homeInsurance", label: "Homeowners / Renters Insurance", isDebtItem: false },
      { id: "hoaFee", label: "HOA & Co-Op Fees", isDebtItem: false },
      { id: "homeMaintenance", label: "Home Maintenance & Repairs", isDebtItem: false },
      { id: "utilities", label: "Utilities (Electric, Gas, Water, Trash, Internet)", isDebtItem: false },
    ],
  },
  {
    id: "transportation",
    title: "Transportation",
    icon: "🚗",
    isDebtCategory: false,
    items: [
      { id: "autoLoan", label: "Auto Loan Payment", isDebtItem: true },
      { id: "autoInsurance", label: "Auto Insurance", isDebtItem: false },
      { id: "gasoline", label: "Gasoline & Fuel", isDebtItem: false },
      { id: "autoMaintenance", label: "Auto Maintenance & Oil Changes", isDebtItem: false },
      { id: "parkingTolls", label: "Parking & Tolls", isDebtItem: false },
      { id: "otherTrans", label: "Other Transportation Costs (Transit, Rideshare)", isDebtItem: false },
    ],
  },
  {
    id: "debt",
    title: "Other Debt & Loan Payments",
    icon: "💳",
    isDebtCategory: true,
    items: [
      { id: "creditCard", label: "Credit Card Minimum Payments", isDebtItem: true },
      { id: "studentLoan", label: "Student Loan Payments", isDebtItem: true },
      { id: "otherLoan", label: "Other Loans & Personal Liabilities", isDebtItem: true },
    ],
  },
  {
    id: "living",
    title: "Living Expenses",
    icon: "🛒",
    isDebtCategory: false,
    items: [
      { id: "food", label: "Food & Groceries", isDebtItem: false },
      { id: "clothing", label: "Clothing & Apparel", isDebtItem: false },
      { id: "householdSupplies", label: "Household & Cleaning Supplies", isDebtItem: false },
      { id: "mealsOut", label: "Meals Out & Dining", isDebtItem: false },
      { id: "otherLiving", label: "Other Living Expenses", isDebtItem: false },
    ],
  },
  {
    id: "healthcare",
    title: "Healthcare",
    icon: "🩺",
    isDebtCategory: false,
    items: [
      { id: "medicalInsurance", label: "Medical & Dental Insurance Premiums", isDebtItem: false },
      { id: "medicalSpending", label: "Out-of-Pocket Medical & Prescriptions", isDebtItem: false },
    ],
  },
  {
    id: "children",
    title: "Children & Education",
    icon: "🎓",
    isDebtCategory: false,
    items: [
      { id: "childCare", label: "Child Care & Daycare", isDebtItem: false },
      { id: "tuitionSupplies", label: "Tuition & School Supplies", isDebtItem: false },
      { id: "childSupport", label: "Child Support Payments", isDebtItem: false },
      { id: "otherChild", label: "Other Children Expenses", isDebtItem: false },
    ],
  },
  {
    id: "savings",
    title: "Savings & Investments",
    icon: "💰",
    isDebtCategory: false,
    items: [
      { id: "retirementSavings", label: "401(k) & IRA Contributions", isDebtItem: false },
      { id: "collegeSaving", label: "College Savings (529 Plan)", isDebtItem: false },
      { id: "investmentsSaving", label: "Taxable Investments & Stocks", isDebtItem: false },
      { id: "emergencyFund", label: "Emergency Fund & General Savings", isDebtItem: false },
    ],
  },
  {
    id: "miscellaneous",
    title: "Miscellaneous Expenses",
    icon: "🎁",
    isDebtCategory: false,
    items: [
      { id: "pets", label: "Pets & Veterinary Care", isDebtItem: false },
      { id: "giftsDonations", label: "Gifts & Charitable Donations", isDebtItem: false },
      { id: "hobbiesSports", label: "Hobbies & Sports Equipment", isDebtItem: false },
      { id: "entertainment", label: "Entertainment & Streaming Subscriptions", isDebtItem: false },
      { id: "travelVacation", label: "Travel & Vacation Savings", isDebtItem: false },
      { id: "otherMisc", label: "Other Miscellaneous Expenses", isDebtItem: false },
    ],
  },
];
