import CategoryHub from "@/components/CategoryHub";

export const metadata = {
  title: "Spiritual & Numerology Calculators — Life Path, Angel Numbers & Zodiac Match | Holy Calculator",
  description:
    "Free spiritual and numerology tools to decode Life Path numbers, angel number sequences, zodiac love compatibility, lucky numbers, and daily tarot readings.",
  alternates: {
    canonical: "https://www.holycalculator.com/spiritual",
  },
  openGraph: {
    title: "Spiritual & Numerology Calculators | Holy Calculator",
    description:
      "Free spiritual and numerology tools to decode Life Path numbers, angel number sequences, zodiac love compatibility, lucky numbers, and daily tarot readings.",
    url: "https://www.holycalculator.com/spiritual",
    siteName: "Holy Calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spiritual & Numerology Calculators | Holy Calculator",
    description:
      "Free spiritual and numerology tools to decode Life Path numbers, angel number sequences, zodiac love compatibility, lucky numbers, and daily tarot readings.",
  },
};

export default function SpiritualHubPage() {
  return (
    <CategoryHub
      categoryKey="spiritual"
      title="Spiritual & Numerology Calculators"
      subtitle="Numerology charts, angel sequence meanings, astrological synergy, and tarot draws"
      breadcrumbLabel="Spiritual"
      icon="✦"
      iconClass="spiritual"
      intro="Explore sacred geometry, astrological dynamics, and authentic Pythagorean numerology with our spiritual tools. Calculate your Life Path Number and Master Numbers (11, 22, 33) based on birth dates, decode repeating Angel Number meanings (111, 222, 777, 1111), evaluate astrological synergy and element harmony with the Zodiac Compatibility Calculator, generate lottery and personal lucky numbers, or draw daily 3-card Tarot spreads. All spiritual tools provide clear mathematical breakdowns alongside ancient esoteric interpretations."
    />
  );
}
