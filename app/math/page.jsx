import CategoryHub from "@/components/CategoryHub";

export const metadata = {
  title: "Math & Algebra Calculators — Percentages, Fractions, GPA & Statistics | Holy Calculator",
  description:
    "Free math calculators to compute percentages, solve fraction arithmetic, evaluate GPA, calculate grade averages, standard deviation, and scientific operations.",
  alternates: {
    canonical: "https://www.holycalculator.com/math",
  },
  openGraph: {
    title: "Math & Algebra Calculators | Holy Calculator",
    description:
      "Free math calculators to compute percentages, solve fraction arithmetic, evaluate GPA, calculate grade averages, standard deviation, and scientific operations.",
    url: "https://www.holycalculator.com/math",
    siteName: "Holy Calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Math & Algebra Calculators | Holy Calculator",
    description:
      "Free math calculators to compute percentages, solve fraction arithmetic, evaluate GPA, calculate grade averages, standard deviation, and scientific operations.",
  },
};

export default function MathHubPage() {
  return (
    <CategoryHub
      categoryKey="math"
      title="Math & Algebra Calculators"
      subtitle="Percentage changes, fraction operations, statistical analysis, and student grades"
      breadcrumbLabel="Math"
      icon="%"
      iconClass="math"
      intro="Simplify complex calculations, homework problems, and statistical analysis with our comprehensive set of mathematical tools. Designed for students, professionals, and everyday problem solvers, our math calculators handle percentage increases and decreases, step-by-step fraction arithmetic, weighted grade estimates for exams, high school and college GPA conversions, statistical mean and standard deviation analysis, and multi-function scientific equations. Every calculator reveals the step-by-step formula behind the output, ensuring full transparency and educational clarity."
    />
  );
}
