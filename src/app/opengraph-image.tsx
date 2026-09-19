import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          background: "linear-gradient(135deg, #3A2417, #5A3825)",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 96,
            color: "#F5EAD8",
            letterSpacing: 16,
            fontWeight: 700,
            display: "flex",
          }}
        >
          CAKOO
        </div>
        <div style={{ fontSize: 28, color: "#C68B57", marginTop: 20, display: "flex" }}>
          Baked With Love. Made For Moments.
        </div>
      </div>
    ),
    size
  );
}
