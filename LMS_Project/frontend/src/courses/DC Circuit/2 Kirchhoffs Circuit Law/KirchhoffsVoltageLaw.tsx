import type { CSSProperties } from "react";

export default function KirchhoffsVoltageLaw() {
  const stroke = 3;

  const textStyle: CSSProperties = {
    fontFamily: "Times New Roman, serif",
    fill: "black",
  };

  const labelStyle: CSSProperties = {
    ...textStyle,
    fontSize: 26,
  };

  const smallLabelStyle: CSSProperties = {
    ...textStyle,
    fontSize: 22,
  };

  const equationStyle: CSSProperties = {
    ...textStyle,
    fontSize: 28,
    fontWeight: "bold",
  };

  const resistor = (
    x: number,
    y: number,
    length = 120,
    height = 18,
    direction: "horizontal" | "vertical" = "horizontal"
  ) => {
    const step = length / 8;

    if (direction === "horizontal") {
      return `
        ${x},${y}
        ${x + step},${y}
        ${x + step * 2},${y - height}
        ${x + step * 3},${y + height}
        ${x + step * 4},${y - height}
        ${x + step * 5},${y + height}
        ${x + step * 6},${y - height}
        ${x + step * 7},${y + height}
        ${x + step * 8},${y}
      `;
    }

    return `
      ${x},${y}
      ${x},${y + step}
      ${x - height},${y + step * 2}
      ${x + height},${y + step * 3}
      ${x - height},${y + step * 4}
      ${x + height},${y + step * 5}
      ${x - height},${y + step * 6}
      ${x + height},${y + step * 7}
      ${x},${y + step * 8}
    `;
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-5xl bg-white">
        <svg
          viewBox="0 0 1000 520"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Kirchhoff&apos;s Voltage Law</title>
          <desc id="desc">
            Black and white Kirchhoff&apos;s Voltage Law loop circuit using ANSI
            zigzag resistor symbols. The diagram shows four resistors around a
            closed loop and the voltage-drop summation equation.
          </desc>

          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 Z" fill="black" />
            </marker>
          </defs>

          <rect width="1000" height="520" fill="white" />

          {/* Left statement */}
          <text x="35" y="160" style={labelStyle}>
            The sum of all the Voltage
          </text>
          <text x="65" y="195" style={labelStyle}>
            Drops around the loop
          </text>
          <text x="92" y="230" style={labelStyle}>
            is equal to Zero
          </text>

          {/* Loop corner points */}
          <text x="495" y="80" style={smallLabelStyle}>
            A
          </text>
          <text x="900" y="80" style={smallLabelStyle}>
            B
          </text>
          <text x="902" y="435" style={smallLabelStyle}>
            C
          </text>
          <text x="495" y="435" style={smallLabelStyle}>
            D
          </text>

          {/* Top branch wire and resistor */}
          <line
            x1="550"
            y1="95"
            x2="650"
            y2="95"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <polyline
            points={resistor(650, 95, 120, 18, "horizontal")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="770"
            y1="95"
            x2="885"
            y2="95"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <text x="700" y="75" textAnchor="middle" style={smallLabelStyle}>
            R
          </text>

          {/* Right branch wire and resistor */}
          <line
            x1="885"
            y1="95"
            x2="885"
            y2="175"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <polyline
            points={resistor(885, 175, 120, 18, "vertical")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="885"
            y1="295"
            x2="885"
            y2="395"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <text x="920" y="245" style={smallLabelStyle}>
            R
          </text>

          {/* Bottom branch wire and resistor */}
          <line
            x1="885"
            y1="395"
            x2="770"
            y2="395"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <polyline
            points={resistor(650, 395, 120, 18, "horizontal")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="650"
            y1="395"
            x2="550"
            y2="395"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <text x="710" y="430" textAnchor="middle" style={smallLabelStyle}>
            R
          </text>

          {/* Left branch wire and resistor */}
          <line
            x1="550"
            y1="395"
            x2="550"
            y2="315"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <polyline
            points={resistor(550, 195, 120, 18, "vertical")}
            fill="none"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="550"
            y1="195"
            x2="550"
            y2="95"
            stroke="black"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <text x="510" y="260" style={smallLabelStyle}>
            R
          </text>

          {/* Circular direction arrows */}
          <circle
            cx="715"
            cy="245"
            r="120"
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeDasharray="9 8"
          />

          <path
            d="M 645 150 A 120 120 0 0 1 815 180"
            fill="none"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />
          <path
            d="M 820 310 A 120 120 0 0 1 640 335"
            fill="none"
            stroke="black"
            strokeWidth="2.5"
            markerEnd="url(#arrow)"
          />

          {/* KVL equation */}
          <text x="35" y="485" style={equationStyle}>
            VAB + VBC + VCD + VDA = 0
          </text>
        </svg>
      </div>
    </main>
  );
}
