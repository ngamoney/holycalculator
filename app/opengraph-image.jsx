import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#14171F",
          backgroundImage: "radial-gradient(circle at 50% 30%, #1E2330 0%, #14171F 70%)",
          color: "#F6F3EC",
          padding: "60px 40px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand Logo Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              background: "#14171F",
              border: "2.5px solid #C9992F",
              color: "#C9992F",
              padding: "8px 20px",
              borderRadius: "14px",
              fontSize: "44px",
              fontWeight: "800",
              fontFamily: "monospace",
            }}
          >
            holy
          </div>
          <div
            style={{
              fontSize: "62px",
              fontWeight: "900",
              letterSpacing: "-0.03em",
              color: "#FDFCF8",
            }}
          >
            calculator
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "30px",
            fontWeight: "700",
            color: "#C9992F",
            marginBottom: "20px",
            textAlign: "center",
            letterSpacing: "-0.01em",
          }}
        >
          One engine for every number you need — practical and otherwise.
        </div>

        {/* Categories Badges */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: "920px",
            marginTop: "16px",
          }}
        >
          {["Finance", "Health & Fitness", "Math & Algebra", "Date & Time", "Conversions", "Spiritual"].map(
            (cat) => (
              <div
                key={cat}
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#F6F3EC",
                  padding: "8px 18px",
                  borderRadius: "24px",
                  fontSize: "18px",
                  fontWeight: "600",
                  fontFamily: "monospace",
                }}
              >
                {cat}
              </div>
            )
          )}
        </div>

        {/* Bottom Feature Subtitle */}
        <div
          style={{
            fontSize: "18px",
            color: "rgba(255, 255, 255, 0.5)",
            marginTop: "36px",
            fontFamily: "monospace",
          }}
        >
          30+ Free Calculators • Instant Calculation • Every Formula Shown
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
