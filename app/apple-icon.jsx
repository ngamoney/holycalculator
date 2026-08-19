import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
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
          background: "#14171F",
          borderRadius: "36px",
          border: "4px solid #C9992F",
          color: "#C9992F",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            fontSize: "82px",
            fontWeight: "900",
            letterSpacing: "-2px",
            lineHeight: "1",
          }}
        >
          H
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
