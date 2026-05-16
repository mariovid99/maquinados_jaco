import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Maquinados JACO | Manufactura CNC de Precisión en Monterrey";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0A1342 0%, #001A8B 55%, #0A0A0A 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "64px 72px",
          position: "relative",
        }}
      >
        {/* Red accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "6px",
            height: "100%",
            background: "#B90001",
          }}
        />
        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "24px",
          }}
        >
          <div style={{ width: "32px", height: "2px", background: "#B90001" }} />
          <span style={{ color: "#B90001", fontSize: "14px", fontFamily: "monospace", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Monterrey, N.L. · Desde una sola pieza
          </span>
        </div>
        {/* Headline */}
        <div
          style={{
            fontSize: "80px",
            fontWeight: 900,
            color: "#FFFFFF",
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            marginBottom: "28px",
          }}
        >
          MAQUINADOS{" "}
          <span style={{ color: "#B90001" }}>JACO</span>
        </div>
        {/* Subtitle */}
        <div
          style={{
            fontSize: "22px",
            color: "rgba(255,255,255,0.7)",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          Manufactura CNC · Soldadura · CAD/CAM · Comercialización
        </div>
      </div>
    ),
    { ...size }
  );
}
