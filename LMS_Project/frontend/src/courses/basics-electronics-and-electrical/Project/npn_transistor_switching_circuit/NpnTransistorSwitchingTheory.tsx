export default function NpnTransistorSwitchingTheory() {
  const cardStyle = {
    border: "1px solid #dbe3ef",
    borderRadius: "18px",
    background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
    padding: "18px 20px",
  } as const;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <section style={cardStyle}>
        <p
          style={{
            margin: 0,
            color: "#2ea84a",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Workspace Goal
        </p>
        <h3
          style={{
            margin: "10px 0 8px",
            color: "#0f172a",
            fontSize: 28,
            fontWeight: 800,
          }}
        >
          NPN Transistor Switch Logic
        </h3>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}>
          This workspace demonstrates a basic low-side NPN switching circuit.
          The push button drives base current through <strong>RB</strong>, the
          transistor turns on, and collector current flows through{" "}
          <strong>R_LED</strong> and the LED load.
        </p>
      </section>

      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        <section style={cardStyle}>
          <h4 style={{ margin: "0 0 10px", color: "#0f172a", fontSize: 18 }}>
            Switch Open
          </h4>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
            The base is held low through <strong>RPD</strong>, so the transistor
            stays off and the LED path does not conduct.
          </p>
        </section>

        <section style={cardStyle}>
          <h4 style={{ margin: "0 0 10px", color: "#0f172a", fontSize: 18 }}>
            Switch Pressed
          </h4>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
            Base current flows through <strong>RB</strong>. Q1 turns on and
            allows current to move from collector to emitter, lighting the LED.
          </p>
        </section>

        <section style={cardStyle}>
          <h4 style={{ margin: "0 0 10px", color: "#0f172a", fontSize: 18 }}>
            Main Parts
          </h4>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
            <strong>Vcc</strong>, <strong>SW1</strong>, <strong>RB</strong>,{" "}
            <strong>RPD</strong>, <strong>R_LED</strong>, <strong>LED</strong>,
            and <strong>Q1 2N3904</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
