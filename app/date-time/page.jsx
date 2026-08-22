import CategoryHub from "@/components/CategoryHub";

export const metadata = {
  title: "Date & Time Calculators — Age, Duration, Time Zones & Countdowns | Holy Calculator",
  description:
    "Free date and time calculators to compute chronological age, count days between dates, convert global time zones, and build live event countdown timers.",
  alternates: {
    canonical: "https://www.holycalculator.com/date-time",
  },
  openGraph: {
    title: "Date & Time Calculators | Holy Calculator",
    description:
      "Free date and time calculators to compute chronological age, count days between dates, convert global time zones, and build live event countdown timers.",
    url: "https://www.holycalculator.com/date-time",
    siteName: "Holy Calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Date & Time Calculators | Holy Calculator",
    description:
      "Free date and time calculators to compute chronological age, count days between dates, convert global time zones, and build live event countdown timers.",
  },
};

export default function DateTimeHubPage() {
  return (
    <CategoryHub
      categoryKey="date-time"
      title="Date & Time Calculators"
      subtitle="Age verification, date math, worldwide time zone conversion, and countdown timers"
      breadcrumbLabel="Date & Time"
      icon="◷"
      iconClass="date"
      intro="Manage time, track milestones, and solve scheduling queries effortlessly. Our date and time tools let you compute exact chronological age down to days and seconds, add or subtract calendar business days while accounting for federal holidays, convert local times across global UTC time zones, and set up live event countdown timers for upcoming holidays or occasions. Whether planning work deliverables or calculating precise age milestones, these tools deliver immediate and accurate temporal calculations."
    />
  );
}
