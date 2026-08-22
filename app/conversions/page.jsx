import CategoryHub from "@/components/CategoryHub";

export const metadata = {
  title: "Unit Conversion Calculators — Length, Weight, Temperature, Area & Volume | Holy Calculator",
  description:
    "Free conversion tools for length, mass, weight, temperature, surface area, fluid volume, speed, and real-time currency exchange rates.",
  alternates: {
    canonical: "https://www.holycalculator.com/conversions",
  },
  openGraph: {
    title: "Unit Conversion Calculators | Holy Calculator",
    description:
      "Free conversion tools for length, mass, weight, temperature, surface area, fluid volume, speed, and real-time currency exchange rates.",
    url: "https://www.holycalculator.com/conversions",
    siteName: "Holy Calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unit Conversion Calculators | Holy Calculator",
    description:
      "Free conversion tools for length, mass, weight, temperature, surface area, fluid volume, speed, and real-time currency exchange rates.",
  },
};

export default function ConversionsHubPage() {
  return (
    <CategoryHub
      categoryKey="conversions"
      title="Unit Conversion Calculators"
      subtitle="Metric and imperial unit conversion for length, weight, area, volume, and speed"
      breadcrumbLabel="Conversions"
      icon="⇄"
      iconClass="conv"
      intro="Convert values across imperial and metric measurement systems instantly. Our collection of conversion calculators covers distance and length (inches, meters, miles), mass and weight (pounds, kilograms, ounces), temperature scales (Celsius, Fahrenheit, Kelvin), surface area (acres, square feet, hectares), 3D volume (liters, gallons, cups), and speed parameters (mph, km/h, knots). Each converter offers real-time bi-directional calculations to ensure rapid accuracy for recipes, engineering, travel, construction, and study."
    />
  );
}
