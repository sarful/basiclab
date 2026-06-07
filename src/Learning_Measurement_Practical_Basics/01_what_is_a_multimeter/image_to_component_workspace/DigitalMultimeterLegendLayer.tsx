import { multimeterGeometry } from "./multimeterGeometry";
import { multimeterStopLayout } from "./multimeterStopLayout";

// Shared Unicode-safe symbols for the printed meter labels.
const OMEGA = "\u03a9";

type DigitalMultimeterLegendLayerProps = {
  className?: string;
};

// Simple coordinate pair used by label and symbol placement helpers.
type Point = {
  x: number;
  y: number;
};

// Radial placement keeps labels tied to the selector center instead of ad-hoc x/y offsets.
type RadialLabelPlacement = {
  angle: number;
  radius: number;
  text: string;
  size: number;
  anchor?: "start" | "middle" | "end";
  weight?: number | string;
  color?: string;
};

// Common text settings for all printed legend labels.
type LabelProps = {
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  weight?: number | string;
  color?: string;
  anchor?: "start" | "middle" | "end";
  rotate?: number;
  letterSpacing?: number;
};

// Reusable text wrapper keeps the legend typography consistent.
function Label({
  x,
  y,
  children,
  size = 18,
  weight = 700,
  color = "#f7f7f7",
  anchor = "middle",
  rotate,
  letterSpacing,
}: LabelProps) {
  const transform = rotate ? `rotate(${rotate} ${x} ${y})` : undefined;

  return (
    <text
      x={x}
      y={y}
      fill={color}
      fontSize={size}
      fontWeight={weight}
      textAnchor={anchor}
      fontFamily="Arial, Helvetica, sans-serif"
      transform={transform}
      letterSpacing={letterSpacing}
    >
      {children}
    </text>
  );
}

function TinyDot({ cx, cy }: { cx: number; cy: number }) {
  return <circle cx={cx} cy={cy} r="3.1" fill="#f6f6f7" />;
}

// Compact diode icon for the lower function area.
function DiodeSymbol({ x, y }: { x: number; y: number }) {
  return (
    <g
      stroke="#f7f7f7"
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1={x - 15} y1={y} x2={x - 4} y2={y} />
      <path
        d={`M ${x - 4} ${y - 10} L ${x + 8} ${y} L ${x - 4} ${y + 10} Z`}
        fill="#f7f7f7"
        stroke="none"
      />
      <line x1={x + 10} y1={y - 11} x2={x + 10} y2={y + 11} />
      <line x1={x + 10} y1={y} x2={x + 20} y2={y} />
    </g>
  );
}

// DCV becomes the major font-size reference so the main face labels stay visually related.
const majorLabelFontSize = 15;
const dialCenter = multimeterGeometry.dial.center;

// Convert polar coordinates into SVG points so labels can orbit the dial center cleanly.
function pointOnDial(angle: number, radius: number): Point {
  const radians = (angle * Math.PI) / 180;

  return {
    x: dialCenter.x + Math.cos(radians) * radius,
    y: dialCenter.y + Math.sin(radians) * radius,
  };
}

// Major labels now use dial-center radial placement instead of scattered manual coordinates.
const majorRadialPlacements = {
  dcv: { angle: -132, radius: 233, text: "DCV", size: majorLabelFontSize },
  off: { angle: -88, radius: 214, text: "OFF", size: majorLabelFontSize },
  acv: { angle: -43, radius: 233, text: "ACV", size: majorLabelFontSize },
  dca: { angle: -24, radius: 252, text: "DCA", size: majorLabelFontSize },
  omega: { angle: 115, radius: 248, text: OMEGA, size: majorLabelFontSize + 1 },
  hfe: { angle: 49, radius: 202, text: "hFE", size: majorLabelFontSize },
  tenA: { angle: 53, radius: 229, text: "10A", size: majorLabelFontSize },
} as const satisfies Record<string, RadialLabelPlacement>;

// Lower function symbols use the same radial placement idea as the major text.
const lowerSymbolPlacements = {
  diode: { angle: 68, radius: 229 },
} as const;

export default function DigitalMultimeterLegendLayer({
  className,
}: DigitalMultimeterLegendLayerProps) {
  const g = multimeterGeometry;
  const white = "#f6f6f7";
  const majorLabelPositions = Object.fromEntries(
    Object.entries(majorRadialPlacements).map(([key, item]) => [
      key,
      { ...item, ...pointOnDial(item.angle, item.radius) },
    ]),
  ) as Record<keyof typeof majorRadialPlacements, RadialLabelPlacement & Point>;
  const diodePosition = pointOnDial(
    lowerSymbolPlacements.diode.angle,
    lowerSymbolPlacements.diode.radius,
  );
  const stopLegendItems = multimeterStopLayout.filter(
    (item): item is typeof item & {
      labelAngle: number;
      labelRadius: number;
      labelSize: number;
      legendText: string;
    } =>
      typeof item.labelAngle === "number" &&
      typeof item.labelRadius === "number" &&
      typeof item.labelSize === "number" &&
      typeof item.legendText === "string",
  );

  return (
    <svg
      viewBox={g.canvas.viewBox}
      className={className}
      role="img"
      aria-label="Digital multimeter legend text layer"
    >
      {/* Main face labels and all printed range text around the selector dial. */}
      <g>
        {Object.values(majorLabelPositions).map((item) => (
          <Label
            key={item.text}
            x={item.x}
            y={item.y}
            size={item.size}
            color={item.text === "OFF" ? white : item.color}
            anchor={item.anchor}
            weight={item.weight}
          >
            {item.text}
          </Label>
        ))}

        {/* Shared stop data now drives the printed stop labels, dots, and rotary ticks together. */}
        {stopLegendItems.map((item) => {
          const position = pointOnDial(item.labelAngle, item.labelRadius);

          return (
            <Label
              key={`${item.id}-${item.labelAngle}-${item.labelRadius}`}
              x={position.x}
              y={position.y}
              size={item.labelSize}
            >
              {item.legendText}
            </Label>
          );
        })}
      </g>

      {/* Printed selector dots show each switch stop around the dial edge. */}
      <g>
        {multimeterStopLayout.map((stop) => (
          <TinyDot key={`${stop.id}-${stop.dotX}-${stop.dotY}`} cx={stop.dotX} cy={stop.dotY} />
        ))}
      </g>

      {/* Diode test symbol sits in the lower-right function position. */}
      <g>
        <DiodeSymbol x={diodePosition.x} y={diodePosition.y} />
      </g>
    </svg>
  );
}
