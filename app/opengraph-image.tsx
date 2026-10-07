import { ImageResponse } from "next/og";

export const alt = "Quad Tech Solutions Inc. — telecom engineering and field services";
export const size = { width: 1200, height: 630 };
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
          justifyContent: "space-between",
          background: "#0a0a0f",
          color: "#ffffff",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#00d4ff", letterSpacing: 4 }}>
          QUADTECH SOLUTIONS
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>
            Telecom engineering and field services
          </div>
          <div style={{ display: "flex", marginTop: 24, fontSize: 28, color: "#a1a1aa" }}>
            Baltimore, MD · Mississauga, ON · Founded 2012
          </div>
        </div>
      </div>
    ),
    size,
  );
}
