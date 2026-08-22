import CategoryHub from "@/components/CategoryHub";

export const metadata = {
  title: "Finance Calculators — Mortgage, Loan, Tax & Interest Tools | Holy Calculator",
  description:
    "Free finance calculators to estimate mortgage payments, auto loans, retirement savings, personal budgets, compound interest, sales tax, and currency rates.",
  alternates: {
    canonical: "https://www.holycalculator.com/finance",
  },
  openGraph: {
    title: "Finance Calculators | Holy Calculator",
    description:
      "Free finance calculators to estimate mortgage payments, auto loans, retirement savings, personal budgets, compound interest, sales tax, and currency rates.",
    url: "https://www.holycalculator.com/finance",
    siteName: "Holy Calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Finance Calculators | Holy Calculator",
    description:
      "Free finance calculators to estimate mortgage payments, auto loans, retirement savings, personal budgets, compound interest, sales tax, and currency rates.",
  },
};

export default function FinanceHubPage() {
  return (
    <CategoryHub
      categoryKey="finance"
      title="Finance Calculators"
      subtitle="Mortgages, loans, investments, taxes, and budgeting"
      breadcrumbLabel="Finance"
      icon="$"
      iconClass="finance"
      intro="Make informed financial decisions with our suite of free, interactive financial calculators. Whether you're purchasing your first home, estimating monthly car payments, planning long-term retirement savings, or building a monthly household budget, our calculators provide precise mathematical breakdowns instantly. Each tool calculates exact figures—including interest amortization, property tax estimates, PMI, compound interest earnings, and sales tax adjustments—without requiring account sign-ups or personal data input. Use these financial tools to run scenario comparisons, optimize payment schedules, and understand the exact formulas behind your money."
    />
  );
}
