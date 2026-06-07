import ContactorCutawayView from "../../src/Magnetic Contactor simulation/Phase 2 – Internal Construction/ContactorCutawayView";

export default function MagneticContactorPhase2Page() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px 20px",
        background:
          "radial-gradient(circle at top, rgba(16, 185, 129, 0.08), transparent 34%), linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
      }}
    >
      <div
        style={{
          width: "min(100%, 1180px)",
          margin: "0 auto",
          display: "grid",
          gap: "18px",
        }}
      >
        <header
          style={{
            padding: "24px 28px",
            border: "1px solid #d9e2ec",
            borderRadius: "28px",
            background: "rgba(255, 255, 255, 0.94)",
            boxShadow: "0 18px 36px rgba(15, 23, 42, 0.08)",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#059669",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Magnetic Contactor Simulation
          </p>
          <h1
            style={{
              margin: "10px 0 0",
              color: "#0f172a",
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              lineHeight: 1,
              letterSpacing: "-0.05em",
            }}
          >
            Phase 2: Internal Construction
          </h1>
        </header>

        <section
          style={{
            border: "1px solid #d9e2ec",
            borderRadius: "28px",
            overflow: "hidden",
            background: "#ffffff",
            boxShadow: "0 18px 36px rgba(15, 23, 42, 0.08)",
          }}
        >
          <ContactorCutawayView />
        </section>
      </div>
    </main>
  );
}
