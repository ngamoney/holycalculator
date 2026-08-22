import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import calculators from "@/data/calculators.json";

export const metadata = {
  title: "All Calculators — Complete Free Online Directory | Holy Calculator",
  description:
    "Browse our complete directory of free online calculators spanning finance, health, math, date & time, unit conversions, spiritual numerology, and utility tools.",
  alternates: {
    canonical: "https://www.holycalculator.com/calculators",
  },
  openGraph: {
    title: "All Calculators Directory | Holy Calculator",
    description:
      "Browse our complete directory of free online calculators spanning finance, health, math, date & time, unit conversions, spiritual numerology, and utility tools.",
    url: "https://www.holycalculator.com/calculators",
    siteName: "Holy Calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Calculators Directory | Holy Calculator",
    description:
      "Browse our complete directory of free online calculators spanning finance, health, math, date & time, unit conversions, spiritual numerology, and utility tools.",
  },
};

const CATEGORY_GROUPS = [
  {
    key: "finance",
    name: "Finance Calculators",
    hubUrl: "/finance",
    icon: "$",
    iconBg: "var(--ink)",
  },
  {
    key: "health",
    name: "Health & Fitness Calculators",
    hubUrl: "/health",
    icon: "+",
    iconBg: "var(--green)",
  },
  {
    key: "math",
    name: "Math & Algebra Calculators",
    hubUrl: "/math",
    icon: "%",
    iconBg: "var(--gold-deep)",
  },
  {
    key: "date-time",
    name: "Date & Time Calculators",
    hubUrl: "/date-time",
    icon: "◷",
    iconBg: "#7A6A55",
  },
  {
    key: "conversions",
    name: "Unit Conversion Calculators",
    hubUrl: "/conversions",
    icon: "⇄",
    iconBg: "#4A5A6B",
  },
  {
    key: "spiritual",
    name: "Spiritual & Numerology Calculators",
    hubUrl: "/spiritual",
    icon: "✦",
    iconBg: "var(--indigo)",
  },
  {
    key: "other",
    name: "Utility Tools & Games",
    hubUrl: "/tools",
    icon: "◎",
    iconBg: "var(--ink-60)",
  },
];

export default function AllCalculatorsDirectoryPage() {
  // Map calculators by category
  const groupedCalculators = CATEGORY_GROUPS.map((group) => {
    const items = calculators.filter((calc) => calc.category === group.key);
    return {
      ...group,
      items,
    };
  });

  const totalCount = calculators.filter((calc) => Boolean(calc.url)).length;

  return (
    <main>
      <Header />

      <section className="cat-section" style={{ marginTop: "32px", marginBottom: "64px" }}>
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "All Calculators" },
          ]}
        />

        <div style={{ marginTop: "24px", marginBottom: "32px" }}>
          <h1
            style={{
              fontFamily: "var(--head)",
              fontSize: "34px",
              fontWeight: "700",
              lineHeight: "1.2",
              color: "var(--ink)",
              marginBottom: "8px",
            }}
          >
            All Calculators Directory
          </h1>
          <p
            style={{
              fontFamily: "var(--mono)",
              fontSize: "13.5px",
              color: "var(--ink-60)",
              marginBottom: "16px",
            }}
          >
            {totalCount} free interactive calculators · No sign-in required · Instant formula breakdown
          </p>
          <p
            style={{
              fontSize: "15px",
              lineHeight: "1.65",
              color: "var(--ink-80)",
              maxWidth: "800px",
            }}
          >
            Welcome to the complete Holy Calculator directory. Browse our entire collection of interactive tools across finance, health, math, date and time, unit conversions, spiritual numerology, and utility gaming tools. Every calculator provides step-by-step mathematical breakdowns with zero required downloads or subscriptions.
          </p>
        </div>

        {/* Ad slot below intro paragraph */}
        <AdBanner />

        <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", gap: "48px" }}>
          {groupedCalculators.map((group) => {
            if (group.items.length === 0) return null;
            return (
              <div key={group.key}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                    borderBottom: "1px solid var(--line)",
                    paddingBottom: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "8px",
                        background: group.iconBg,
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--mono)",
                        fontWeight: "700",
                        fontSize: "15px",
                      }}
                    >
                      {group.icon}
                    </div>
                    <h2
                      style={{
                        fontFamily: "var(--head)",
                        fontSize: "22px",
                        fontWeight: "700",
                        color: "var(--ink)",
                      }}
                    >
                      {group.name}
                    </h2>
                  </div>

                  <Link
                    href={group.hubUrl}
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: "12px",
                      color: "var(--gold-deep)",
                      textDecoration: "none",
                      fontWeight: "600",
                    }}
                  >
                    View Hub →
                  </Link>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "18px",
                  }}
                >
                  {group.items.map((calc) => (
                    <Link
                      key={calc.id || calc.slug}
                      href={calc.url.startsWith("/") ? calc.url : `/${calc.url}`}
                      className="key"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        textDecoration: "none",
                        color: "inherit",
                        transition: "transform 0.15s ease, box-shadow 0.15s ease",
                        padding: "20px",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "10px",
                          }}
                        >
                          <span style={{ fontSize: "18px" }}>{calc.icon || "🔢"}</span>
                          <h3
                            style={{
                              fontFamily: "var(--head)",
                              fontSize: "16px",
                              fontWeight: "700",
                              color: "var(--ink)",
                            }}
                          >
                            {calc.name}
                          </h3>
                        </div>
                        <p
                          style={{
                            fontSize: "13px",
                            lineHeight: "1.45",
                            color: "var(--ink-60)",
                            marginBottom: "14px",
                          }}
                        >
                          {calc.description}
                        </p>
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--mono)",
                          fontSize: "11.5px",
                          fontWeight: "600",
                          color: "var(--gold-deep)",
                        }}
                      >
                        Open Tool →
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
}
