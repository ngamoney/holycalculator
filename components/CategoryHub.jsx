import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import calculators from "@/data/calculators.json";

export default function CategoryHub({
  categoryKey,
  title,
  subtitle,
  intro,
  breadcrumbLabel,
  icon = "✦",
  iconClass = "finance",
}) {
  const filteredCalculators = calculators.filter(
    (calc) => calc.category === categoryKey
  );

  return (
    <main>
      <Header />

      <section className="cat-section" style={{ marginTop: "32px", marginBottom: "64px" }}>
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: breadcrumbLabel || title },
          ]}
        />

        <div style={{ marginTop: "24px", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div className={`key-icon`} style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                iconClass === "finance" ? "var(--ink)" :
                iconClass === "health" ? "var(--green)" :
                iconClass === "math" ? "var(--gold-deep)" :
                iconClass === "date" ? "#7A6A55" :
                iconClass === "conv" ? "#4A5A6B" :
                iconClass === "spiritual" ? "var(--indigo)" : "var(--ink-60)",
              color: "#fff"
            }}>
              {icon}
            </div>
            <div>
              <h1 style={{
                fontFamily: "var(--head)",
                fontSize: "32px",
                fontWeight: "700",
                lineHeight: "1.2",
                color: "var(--ink)"
              }}>
                {title}
              </h1>
              {subtitle && (
                <p style={{ fontFamily: "var(--mono)", fontSize: "13px", color: "var(--ink-60)", marginTop: "4px" }}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div style={{
            fontSize: "15px",
            lineHeight: "1.65",
            color: "var(--ink-80)",
            maxWidth: "800px",
            marginTop: "16px"
          }}>
            <p>{intro}</p>
          </div>
        </div>

        {/* Ad slot below intro paragraph, above calculator list */}
        <AdBanner />

        <div style={{ marginTop: "40px" }}>
          <h2 style={{
            fontFamily: "var(--head)",
            fontSize: "20px",
            fontWeight: "700",
            marginBottom: "20px",
            color: "var(--ink)"
          }}>
            Available {breadcrumbLabel || title} ({filteredCalculators.length})
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px"
          }}>
            {filteredCalculators.map((calc) => (
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
                  padding: "24px"
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <span style={{ fontSize: "20px" }}>{calc.icon || "🔢"}</span>
                    <h3 style={{
                      fontFamily: "var(--head)",
                      fontSize: "17px",
                      fontWeight: "700",
                      color: "var(--ink)"
                    }}>
                      {calc.name}
                    </h3>
                  </div>
                  <p style={{
                    fontSize: "13.5px",
                    lineHeight: "1.5",
                    color: "var(--ink-60)",
                    marginBottom: "16px"
                  }}>
                    {calc.description}
                  </p>
                </div>
                <div style={{
                  fontFamily: "var(--mono)",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--gold-deep)",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}>
                  Open Calculator →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
