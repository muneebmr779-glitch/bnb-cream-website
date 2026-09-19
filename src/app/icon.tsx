import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
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
          background: "linear-gradient(135deg, #5A3825, #2E1A10)",
          borderRadius: 14,
          fontFamily: "Georgia, serif",
        }}
      >
        <span style={{ color: "#E9D6BA", fontSize: 34, fontWeight: 700 }}>C</span>
      </div>
    ),
    size
  );
}
