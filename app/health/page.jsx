import CategoryHub from "@/components/CategoryHub";

export const metadata = {
  title: "Health & Fitness Calculators — BMI, Calorie, BMR & Weight Tools | Holy Calculator",
  description:
    "Free health calculators for Body Mass Index (BMI), daily calorie needs (TDEE), body fat percentage, BMR, ideal body weight, and pregnancy due dates.",
  alternates: {
    canonical: "https://www.holycalculator.com/health",
  },
  openGraph: {
    title: "Health & Fitness Calculators | Holy Calculator",
    description:
      "Free health calculators for Body Mass Index (BMI), daily calorie needs (TDEE), body fat percentage, BMR, ideal body weight, and pregnancy due dates.",
    url: "https://www.holycalculator.com/health",
    siteName: "Holy Calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Health & Fitness Calculators | Holy Calculator",
    description:
      "Free health calculators for Body Mass Index (BMI), daily calorie needs (TDEE), body fat percentage, BMR, ideal body weight, and pregnancy due dates.",
  },
};

export default function HealthHubPage() {
  return (
    <CategoryHub
      categoryKey="health"
      title="Health & Fitness Calculators"
      subtitle="Body metrics, calorie expenditure, weight targets, and gestational timelines"
      breadcrumbLabel="Health"
      icon="+"
      iconClass="health"
      intro="Track your physical fitness and health metrics using evidence-based medical and biological formulas. Our health calculators help you assess Body Mass Index (BMI), estimate daily calorie requirements for weight maintenance or loss, calculate Basal Metabolic Rate (BMR), measure body fat percentage via the U.S. Navy formula, and determine healthy body weight ranges across established clinical standards. Expecting mothers can also track gestational progress and estimate due dates using LMP, conception, or ultrasound parameters. All calculators provide immediate results tailored to age, sex, height, and activity level."
    />
  );
}
