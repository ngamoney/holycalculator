import CategoryHub from "@/components/CategoryHub";

export const metadata = {
  title: "Utility Tools & Calculators — Virtual Dice Roller & Games | Holy Calculator",
  description:
    "Free online utility tools and interactive randomizers including virtual polyhedral dice rolling for RPG games.",
  alternates: {
    canonical: "https://www.holycalculator.com/tools",
  },
  openGraph: {
    title: "Utility Tools & Calculators | Holy Calculator",
    description:
      "Free online utility tools and interactive randomizers including virtual polyhedral dice rolling for RPG games.",
    url: "https://www.holycalculator.com/tools",
    siteName: "Holy Calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Utility Tools & Calculators | Holy Calculator",
    description:
      "Free online utility tools and interactive randomizers including virtual polyhedral dice rolling for RPG games.",
  },
};

export default function ToolsHubPage() {
  return (
    <CategoryHub
      categoryKey="other"
      title="Utility Tools & Calculators"
      subtitle="Interactive utilities, tabletop gaming tools, and custom randomizers"
      breadcrumbLabel="Tools"
      icon="◎"
      iconClass="other"
      intro="Discover handy digital utilities and tabletop gaming tools built with high-precision algorithms. Our utility suite includes cryptographically secure polyhedral dice rollers for tabletop RPG games (d4, d6, d8, d10, d12, d20), custom modifiers, and interactive gaming aids designed for fast execution across any device."
    />
  );
}
