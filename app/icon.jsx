import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#14171F",
          borderRadius: "7px",
          border: "1.5px solid #C9992F",
          color: "#C9992F",
          fontFamily: "monospace",
          fontSize: "18px",
          fontWeight: "900",
          letterSpacing: "-1px",
        }}
      >
        H
      </div>
    ),
    {
      ...size,
    }
  );
}
