export default function BrandStripes() {
  return (
    <>
      {/* Esquina superior derecha */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 220,
          height: 220,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "4.5%",
            left: "95.5%",
            width: 380,
            height: 28,
            background: "#001A8B",
            transform: "translate(-50%, -50%) rotate(45deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "16.7%",
            left: "83.3%",
            width: 380,
            height: 28,
            background: "#B90001",
            transform: "translate(-50%, -50%) rotate(45deg)",
          }}
        />
      </div>

      {/* Esquina inferior izquierda */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 220,
          height: 220,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "95.5%",
            left: "4.5%",
            width: 380,
            height: 28,
            background: "#B90001",
            transform: "translate(-50%, -50%) rotate(45deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "83.3%",
            left: "16.7%",
            width: 380,
            height: 28,
            background: "#001A8B",
            transform: "translate(-50%, -50%) rotate(45deg)",
          }}
        />
      </div>
    </>
  );
}
