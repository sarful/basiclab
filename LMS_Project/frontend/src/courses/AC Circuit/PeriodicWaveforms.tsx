export default function PeriodicWaveforms() {
  const axisStroke = 2.5;
  const waveStroke = 4;

  const labelStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 24,
    fill: "black",
  };

  const titleStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 28,
    fill: "black",
    fontWeight: 600,
  };

  const smallTextStyle = {
    fontFamily: "Times New Roman, serif",
    fontSize: 20,
    fill: "black",
  };

  const waveStrokeColor = "#1f5fa8";
  const waveFillColor = "#dbe6f2";

  const sinePath =
    "M 95 165 C 120 55, 170 55, 195 165 C 220 275, 270 275, 295 165 C 320 55, 370 55, 395 165 C 420 275, 470 275, 495 165";

  const sineAreaPath =
    "M 95 165 C 120 55, 170 55, 195 165 C 220 275, 270 275, 295 165 C 320 55, 370 55, 395 165 C 420 275, 470 275, 495 165 L 495 165 L 95 165 Z";

  const complexPath =
    "M 650 165 C 670 55, 700 80, 720 95 C 750 120, 760 45, 795 85 C 825 120, 810 165, 835 220 C 865 285, 900 250, 920 250 C 950 250, 965 300, 995 165";

  const complexAreaPath = `${complexPath} L 995 165 L 650 165 Z`;

  const trianglePath =
    "M 95 500 L 145 330 L 245 610 L 345 330 L 445 610 L 495 500";

  const triangleAreaPath = `${trianglePath} L 495 500 L 95 500 Z`;

  const squarePath =
    "M 650 500 L 650 330 L 745 330 L 745 610 L 840 610 L 840 330 L 935 330 L 935 610 L 1030 610 L 1030 500";

  const squareAreaPath = `${squarePath} L 1030 500 L 650 500 Z`;

  const Axis = ({
    x,
    y,
    width,
    height,
    showAmplitude = false,
  }: {
    x: number;
    y: number;
    width: number;
    height: number;
    showAmplitude?: boolean;
  }) => {
    const top = y - height;
    const bottom = y + height;
    const right = x + width;

    return (
      <>
        <line
          x1={x}
          y1={top}
          x2={x}
          y2={bottom}
          stroke="black"
          strokeWidth={axisStroke}
        />

        <line
          x1={x}
          y1={y}
          x2={right}
          y2={y}
          stroke="black"
          strokeWidth={axisStroke}
        />

        <polygon
          points={`${right},${y} ${right - 14},${y - 7} ${right - 14},${y + 7}`}
          fill="white"
          stroke="black"
          strokeWidth={axisStroke}
        />

        <text x={right + 10} y={y + 8} style={smallTextStyle}>
          time
        </text>

        <text x={x - 42} y={top + 12} style={labelStyle}>
          +V
        </text>

        <text x={x - 28} y={y + 8} style={labelStyle}>
          0
        </text>

        <text x={x - 36} y={bottom + 6} style={labelStyle}>
          −V
        </text>

        {[95, 195, 295, 395, 495].map((tickX) => (
          <line
            key={`${x}-${y}-${tickX}`}
            x1={tickX + (x > 100 ? 555 : 0)}
            y1={y - 9}
            x2={tickX + (x > 100 ? 555 : 0)}
            y2={y + 9}
            stroke="black"
            strokeWidth={2}
          />
        ))}

        {showAmplitude && (
          <text
            x={x - 72}
            y={y + 20}
            style={labelStyle}
            transform={`rotate(-90 ${x - 72} ${y + 20})`}
          >
            Amplitude
          </text>
        )}
      </>
    );
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-7xl bg-white">
        <svg
          viewBox="0 0 1120 700"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
        >
          <title id="title">Different Types of Periodic Waveforms</title>
          <desc id="desc">
            Four periodic waveform diagrams showing sine wave, complex wave,
            triangular wave, and square wave with amplitude and time axes.
          </desc>

          <rect width="1120" height="700" fill="white" />

          {/* Top-left: Sine wave */}
          <text x="205" y="42" textAnchor="middle" style={titleStyle}>
            Sine wave
          </text>

          <Axis x={95} y={165} width={410} height={120} showAmplitude />

          <path d={sineAreaPath} fill={waveFillColor} />
          <path
            d={sinePath}
            fill="none"
            stroke={waveStrokeColor}
            strokeWidth={waveStroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Top-right: Complex wave */}
          <text x="800" y="42" textAnchor="middle" style={titleStyle}>
            Complex wave
          </text>

          <Axis x={650} y={165} width={380} height={120} />

          <path d={complexAreaPath} fill={waveFillColor} />
          <path
            d={complexPath}
            fill="none"
            stroke={waveStrokeColor}
            strokeWidth={waveStroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Bottom-left: Triangular wave */}
          <text x="255" y="375" textAnchor="middle" style={titleStyle}>
            Triangular wave
          </text>

          <Axis x={95} y={500} width={410} height={120} showAmplitude />

          <path d={triangleAreaPath} fill={waveFillColor} />
          <path
            d={trianglePath}
            fill="none"
            stroke={waveStrokeColor}
            strokeWidth={waveStroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Bottom-right: Square wave */}
          <text x="815" y="375" textAnchor="middle" style={titleStyle}>
            Square wave
          </text>

          <Axis x={650} y={500} width={380} height={120} />

          <path d={squareAreaPath} fill={waveFillColor} />
          <path
            d={squarePath}
            fill="none"
            stroke={waveStrokeColor}
            strokeWidth={waveStroke}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </main>
  );
}
