import {
  multimeterFaceDiodeV2,
  multimeterFaceMajorLabelsV2,
  multimeterFaceStopsV2,
  pointOnDialV2,
  type MultimeterFaceStopIdV2,
} from "./multimeterFaceSystemV2";

type DigitalMultimeterFaceV2Props = {
  className?: string;
  selectedStopId?: MultimeterFaceStopIdV2;
};

function Label({
  color = "#f6f6f7",
  x,
  y,
  size,
  text,
}: {
  color?: string;
  x: number;
  y: number;
  size: number;
  text: string;
}) {
  return (
    <text
      x={x}
      y={y}
      fill={color}
      fontFamily="Arial, Helvetica, sans-serif"
      fontSize={size}
      fontWeight={700}
      textAnchor="middle"
    >
      {text}
    </text>
  );
}

function DiodeSymbol({ color, x, y }: { color: string; x: number; y: number }) {
  return (
    <g
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3"
    >
      <line x1={x - 15} y1={y} x2={x - 4} y2={y} />
      <path
        d={`M ${x - 4} ${y - 10} L ${x + 8} ${y} L ${x - 4} ${y + 10} Z`}
        fill={color}
        stroke="none"
      />
      <line x1={x + 10} y1={y - 11} x2={x + 10} y2={y + 11} />
      <line x1={x + 10} y1={y} x2={x + 20} y2={y} />
    </g>
  );
}

function getStopToneColor(
  stopId: (typeof multimeterFaceStopsV2)[number]["id"],
  tone: (typeof multimeterFaceStopsV2)[number]["tone"],
  active: boolean,
) {
  if (stopId === "off") return "#ff5538";
  if (stopId.startsWith("dcv_")) return "#ff8a3d";
  if (stopId.startsWith("ohm_")) return "#ffd84a";
  if (stopId === "diode") return "#22c55e";
  if (stopId.startsWith("acv_")) return "#4da3ff";
  if (stopId === "dca_10a") return "#ff69b4";
  if (stopId.startsWith("dca_")) return "#b06cff";
  if (active && tone === "red") return "#ff8d72";
  if (active && tone === "green") return "#8ff0b1";
  return "#f6f6f7";
}

export default function DigitalMultimeterFaceV2({
  className,
  selectedStopId = "off",
}: DigitalMultimeterFaceV2Props) {
  const diodeAnchor = pointOnDialV2(
    multimeterFaceDiodeV2.angle,
    multimeterFaceDiodeV2.radius,
  );
  const diodePosition = {
    x: diodeAnchor.x + multimeterFaceDiodeV2.offsetX,
    y: diodeAnchor.y + multimeterFaceDiodeV2.offsetY,
  };

  return (
    <svg
      viewBox="0 0 558 966"
      className={className}
      role="img"
      aria-label="Digital multimeter face rebuild v2"
    >
      <g>
        {multimeterFaceMajorLabelsV2.map((item) => {
          const position = pointOnDialV2(item.angle, item.radius);

          return (
            <Label
              key={`${item.text}-${item.angle}-${item.radius}`}
              color={item.color}
              x={position.x + (item.offsetX ?? 0)}
              y={position.y + (item.offsetY ?? 0)}
              size={item.size}
              text={item.text}
            />
          );
        })}
      </g>

      <g opacity={0.96}>
        {multimeterFaceStopsV2.map((stop) => {
          const dot = pointOnDialV2(stop.angle, stop.tickInnerRadius ?? 0);
          const tickOuter = pointOnDialV2(
            stop.angle,
            stop.tickOuterRadius ?? 0,
          );
          const active = stop.id === selectedStopId;
          const stopColor = getStopToneColor(stop.id, stop.tone, active);

          return (
            <g key={stop.id}>
              <line
                x1={dot.x}
                y1={dot.y}
                x2={tickOuter.x}
                y2={tickOuter.y}
                stroke={stopColor}
                strokeLinecap="round"
                strokeWidth={active ? 3.2 : 2.1}
              />
              <circle
                cx={dot.x}
                cy={dot.y}
                r={active ? 4.1 : 2.8}
                fill={stopColor}
              />
              {stop.legendText && stop.labelRadius && stop.labelSize ? (
                <Label
                  color={stopColor}
                  x={
                    pointOnDialV2(
                      stop.labelAngle ?? stop.angle,
                      stop.labelRadius,
                    ).x
                  }
                  y={
                    pointOnDialV2(
                      stop.labelAngle ?? stop.angle,
                      stop.labelRadius,
                    ).y
                  }
                  size={stop.labelSize}
                  text={stop.legendText}
                />
              ) : null}
            </g>
          );
        })}
      </g>

      <g>
        <DiodeSymbol
          color={multimeterFaceDiodeV2.color}
          x={diodePosition.x}
          y={diodePosition.y}
        />
      </g>
    </svg>
  );
}
