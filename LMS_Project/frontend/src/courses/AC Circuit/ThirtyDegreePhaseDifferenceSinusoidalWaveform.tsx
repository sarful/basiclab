export default function ThirtyDegreePhaseDifferenceSinusoidalWaveform() {
  const axisStroke = 2.5;
  const waveStroke = 4.5;

  const titleStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 28,
    fill: "black",
    fontWeight: 600,
  };

  const textStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 24,
    fill: "black",
  };

  const smallTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 19,
    fill: "black",
  };

  const tinyTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 16,
    fill: "black",
  };

  const blueStroke = "#2f67ad";
  const blueFill = "#d9e6f7";
  const brownStroke = "#7b332d";
  const brownFill = "#e4c5bf";

  const axisY = 255;
  const axisX = 90;
  const endX = 930;
  const voltageStartX = 100;
  const period = 640;
  const phaseShift = 53; // about 30 degrees of one cycle
  const voltageAmp = 185;
  const currentAmp = 130;

  const sinePath = (
    startX: number,
    midY: number,
    amp: number,
    cycle: number
  ) => `
    M ${startX} ${midY}
    C ${startX + cycle * 0.125} ${midY - amp},
      ${startX + cycle * 0.375} ${midY - amp},
      ${startX + cycle * 0.5} ${midY}
    C ${startX + cycle * 0.625} ${midY + amp},
      ${startX + cycle * 0.875} ${midY + amp},
      ${startX + cycle} ${midY}
  `;

  const filledSinePath = (
    startX: number,
    midY: number,
    amp: number,
    cycle: number
  ) => `
    ${sinePath(startX, midY, amp, cycle)}
    L ${startX + cycle} ${midY}
    L ${startX} ${midY}
    Z
  `;

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-6xl bg-white">
        <svg
          viewBox="0 0 1000 520"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">30 Degree Phase Difference of a Sinusoidal Waveform</title>
          <desc id="desc">
            Two sinusoidal waveforms with a 30 degree phase difference, showing
            voltage and current against omega t.
          </desc>

          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 Z" fill="black" />
            </marker>
          </defs>

          <rect width="1000" height="520" fill="white" />

          {/* Axes */}
          <line
            x1={axisX}
            y1="40"
            x2={axisX}
            y2="470"
            stroke="black"
            strokeWidth={axisStroke}
          />
          <line
            x1={axisX}
            y1={axisY}
            x2={endX}
            y2={axisY}
            stroke="black"
            strokeWidth={axisStroke}
            markerEnd="url(#arrow)"
          />

          <text x="945" y="263" style={smallTextStyle}>
            θ = ωt
          </text>

          {/* Dashed amplitude guides */}
          <line
            x1={axisX}
            y1="70"
            x2="800"
            y2="70"
            stroke="black"
            strokeWidth="2"
            strokeDasharray="10 8"
          />
          <line
            x1={axisX}
            y1="120"
            x2="740"
            y2="120"
            stroke="black"
            strokeWidth="2"
            strokeDasharray="10 8"
          />
          <line
            x1={axisX}
            y1="390"
            x2="740"
            y2="390"
            stroke="black"
            strokeWidth="2"
            strokeDasharray="10 8"
          />
          <line
            x1={axisX}
            y1="440"
            x2="800"
            y2="440"
            stroke="black"
            strokeWidth="2"
            strokeDasharray="10 8"
          />

          {/* Axis labels */}
          <text x="25" y="78" style={smallTextStyle}>
            +Vₘ
          </text>
          <text x="25" y="128" style={smallTextStyle}>
            +Iₘ
          </text>
          <text x="45" y="263" style={smallTextStyle}>
            0
          </text>
          <text x="30" y="398" style={smallTextStyle}>
            -Iₘ
          </text>
          <text x="25" y="448" style={smallTextStyle}>
            -Vₘ
          </text>

          {/* Waveform filled regions */}
          <path
            d={filledSinePath(voltageStartX, axisY, voltageAmp, period)}
            fill={blueFill}
            opacity="0.95"
          />
          <path
            d={filledSinePath(voltageStartX + phaseShift, axisY, currentAmp, period)}
            fill={brownFill}
            opacity="0.75"
          />

          {/* Voltage waveform */}
          <path
            d={sinePath(voltageStartX, axisY, voltageAmp, period)}
            fill="none"
            stroke={blueStroke}
            strokeWidth={waveStroke + 1}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Current waveform delayed by 30 degrees */}
          <path
            d={sinePath(voltageStartX + phaseShift, axisY, currentAmp, period)}
            fill="none"
            stroke={brownStroke}
            strokeWidth={waveStroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Important points on axis */}
          <circle cx={voltageStartX} cy={axisY} r="6" fill="white" stroke="black" strokeWidth="2" />
          <circle cx={voltageStartX + period} cy={axisY} r="6" fill="white" stroke="black" strokeWidth="2" />
          <circle
            cx={voltageStartX + phaseShift}
            cy={axisY}
            r="5"
            fill="white"
            stroke="black"
            strokeWidth="2"
          />
          <circle
            cx={voltageStartX + period + phaseShift}
            cy={axisY}
            r="5"
            fill="white"
            stroke="black"
            strokeWidth="2"
          />

          {/* Tick marks and labels */}
          {[
            { x: voltageStartX + period * 0.25, label: "π/2" },
            { x: voltageStartX + period * 0.5, label: "π" },
            { x: voltageStartX + period * 0.75, label: "3π/2" },
            { x: voltageStartX + period, label: "2π" },
          ].map((tick) => (
            <g key={tick.label}>
              <line
                x1={tick.x}
                y1={axisY - 10}
                x2={tick.x}
                y2={axisY + 10}
                stroke="black"
                strokeWidth="2"
              />
              <text
                x={tick.x}
                y={axisY - 26}
                textAnchor="middle"
                style={textStyle}
              >
                {tick.label}
              </text>
            </g>
          ))}

          <text
            x={voltageStartX + period + phaseShift}
            y={axisY - 30}
            textAnchor="middle"
            style={smallTextStyle}
          >
            2π+φ
          </text>

          {/* Phase difference marker */}
          <line
            x1={voltageStartX}
            y1="315"
            x2={voltageStartX + phaseShift}
            y2="315"
            stroke="black"
            strokeWidth="2"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />
          <line
            x1={voltageStartX}
            y1="305"
            x2={voltageStartX}
            y2="325"
            stroke="black"
            strokeWidth="2"
          />
          <line
            x1={voltageStartX + phaseShift}
            y1="305"
            x2={voltageStartX + phaseShift}
            y2="325"
            stroke="black"
            strokeWidth="2"
          />
          <text x="120" y="345" style={smallTextStyle}>
            φ = 30°
          </text>

          {/* Labels with leader arrows */}
          <text x="310" y="55" style={textStyle}>
            Voltage (V)
          </text>
          <line
            x1="340"
            y1="64"
            x2="280"
            y2="94"
            stroke="black"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />

          <text x="450" y="135" style={textStyle}>
            Current (I)
          </text>
          <line
            x1="455"
            y1="143"
            x2="405"
            y2="185"
            stroke="black"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />

          {/* Right-side phase lead/lag note */}
          <line
            x1={voltageStartX + period}
            y1={axisY + 26}
            x2={voltageStartX + period + phaseShift}
            y2={axisY + 26}
            stroke="black"
            strokeWidth="2"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />
          <text
            x={voltageStartX + period + 28}
            y={axisY + 55}
            textAnchor="middle"
            style={tinyTextStyle}
          >
            φ
          </text>

          {/* Caption */}
          <text x="500" y="500" textAnchor="middle" style={titleStyle}>
            30° Phase Difference of a Sinusoidal Waveform
          </text>
        </svg>
      </div>
    </main>
  );
}
