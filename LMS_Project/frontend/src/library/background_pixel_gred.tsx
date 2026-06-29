type BackgroundPixelGredProps = {
  width: number;
  height: number;
  minor?: number;
  major?: number;
  backgroundColor?: string;
  minorStroke?: string;
  majorStroke?: string;
  minorStrokeWidth?: number;
  majorStrokeWidth?: number;
  labelColor?: string;
  labelSize?: number;
  borderColor?: string;
  borderStrokeWidth?: number;
  showLabels?: boolean;
  showBorder?: boolean;
};

export default function BackgroundPixelGred({
  width,
  height,
  minor = 20,
  major = 100,
  backgroundColor = "#ffffff",
  minorStroke = "#e5e7eb",
  majorStroke = "#cbd5e1",
  minorStrokeWidth = 0.7,
  majorStrokeWidth = 1.2,
  labelColor = "#94a3b8",
  labelSize = 10,
  borderColor = "#94a3b8",
  borderStrokeWidth = 1,
  showLabels = true,
  showBorder = true,
}: BackgroundPixelGredProps) {
  return (
    <g>
      <rect width={width} height={height} fill={backgroundColor} />

      {Array.from({ length: Math.floor(width / minor) + 1 }).map((_, i) => {
        const x = i * minor;
        const isMajor = x % major === 0;

        return (
          <line
            key={`vx-${x}`}
            x1={x}
            y1="0"
            x2={x}
            y2={height}
            stroke={isMajor ? majorStroke : minorStroke}
            strokeWidth={isMajor ? majorStrokeWidth : minorStrokeWidth}
          />
        );
      })}

      {Array.from({ length: Math.floor(height / minor) + 1 }).map((_, i) => {
        const y = i * minor;
        const isMajor = y % major === 0;

        return (
          <line
            key={`hy-${y}`}
            x1="0"
            y1={y}
            x2={width}
            y2={y}
            stroke={isMajor ? majorStroke : minorStroke}
            strokeWidth={isMajor ? majorStrokeWidth : minorStrokeWidth}
          />
        );
      })}

      {showLabels &&
        Array.from({ length: Math.floor(width / major) + 1 }).map((_, i) => {
          const x = i * major;

          return (
            <text
              key={`tx-${x}`}
              x={x + 4}
              y="14"
              fontSize={labelSize}
              fill={labelColor}
              stroke="none"
            >
              {x}
            </text>
          );
        })}

      {showLabels &&
        Array.from({ length: Math.floor(height / major) + 1 }).map((_, i) => {
          const y = i * major;

          return (
            <text
              key={`ty-${y}`}
              x="4"
              y={y + 14}
              fontSize={labelSize}
              fill={labelColor}
              stroke="none"
            >
              {y}
            </text>
          );
        })}

      {showBorder ? (
        <rect
          x="0.5"
          y="0.5"
          width={width - 1}
          height={height - 1}
          fill="none"
          stroke={borderColor}
          strokeWidth={borderStrokeWidth}
        />
      ) : null}
    </g>
  );
}
