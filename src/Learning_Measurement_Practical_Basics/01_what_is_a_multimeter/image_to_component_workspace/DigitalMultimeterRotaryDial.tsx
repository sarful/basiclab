import { multimeterGeometry } from "./multimeterGeometry";
import {
  getDialStopAngle,
  multimeterStopLayout,
  type MultimeterDialStopId,
} from "./multimeterStopLayout";

type DigitalMultimeterRotaryDialProps = {
  className?: string;
  selectedStopId?: MultimeterDialStopId;
  showStopMarkers?: boolean;
  showTicks?: boolean;
};

function pointOnAngle(cx: number, cy: number, radius: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;

  return {
    x: cx + Math.cos(rad) * radius,
    y: cy + Math.sin(rad) * radius,
  };
}

function getToneColors(tone: (typeof multimeterStopLayout)[number]["tone"], active: boolean) {
  if (active && tone === "red") {
    return { glow: "rgba(255,87,61,0.35)", stroke: "#ff5a39", fill: "#ff8d72" };
  }

  if (active && tone === "green") {
    return { glow: "rgba(35,189,96,0.32)", stroke: "#31b763", fill: "#8ff0b1" };
  }

  if (active) {
    return { glow: "rgba(255,255,255,0.26)", stroke: "#f7f7f7", fill: "#ffffff" };
  }

  return { glow: "transparent", stroke: "#dadbde", fill: "#f6f6f7" };
}

function DialPointer({
  angle,
}: {
  angle: number;
}) {
  const { center, faceRadius, capRadius } = multimeterGeometry.dial;
  const tip = pointOnAngle(center.x, center.y, faceRadius * 0.92, angle);
  const neckCenter = pointOnAngle(center.x, center.y, faceRadius * 0.1, angle + 180);
  const tail = pointOnAngle(center.x, center.y, faceRadius * 0.22, angle + 180);
  const left = pointOnAngle(neckCenter.x, neckCenter.y, faceRadius * 0.055, angle - 90);
  const right = pointOnAngle(neckCenter.x, neckCenter.y, faceRadius * 0.055, angle + 90);
  const leftShoulder = pointOnAngle(center.x, center.y, faceRadius * 0.15, angle - 98);
  const rightShoulder = pointOnAngle(center.x, center.y, faceRadius * 0.15, angle + 98);
  const tailLeft = pointOnAngle(tail.x, tail.y, faceRadius * 0.028, angle - 90);
  const tailRight = pointOnAngle(tail.x, tail.y, faceRadius * 0.028, angle + 90);

  const path = [
    `M ${leftShoulder.x} ${leftShoulder.y}`,
    `L ${left.x} ${left.y}`,
    `L ${tip.x} ${tip.y}`,
    `L ${right.x} ${right.y}`,
    `L ${rightShoulder.x} ${rightShoulder.y}`,
    `L ${tailRight.x} ${tailRight.y}`,
    `L ${tailLeft.x} ${tailLeft.y}`,
    "Z",
  ].join(" ");

  return (
    <g>
      <path
        d={path}
        fill="url(#dialPointerGradient)"
        stroke="#1b1c20"
        strokeWidth="1.6"
      />
      <line
        x1={center.x - 3}
        y1={center.y + 4}
        x2={tip.x - 8}
        y2={tip.y - 12}
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx={center.x} cy={center.y} r={capRadius * 0.96} fill="#383941" stroke="#16171a" strokeWidth="1.4" />
      <circle cx={center.x - 2} cy={center.y - 2} r={capRadius * 0.36} fill="rgba(255,255,255,0.14)" />
    </g>
  );
}

export default function DigitalMultimeterRotaryDial({
  className,
  selectedStopId = "off",
  showStopMarkers = true,
  showTicks = true,
}: DigitalMultimeterRotaryDialProps) {
  const g = multimeterGeometry;
  const selectedStop = multimeterStopLayout.find((stop) => stop.id === selectedStopId) ?? multimeterStopLayout[1];
  const selectedAngle = getDialStopAngle(selectedStop.dotX, selectedStop.dotY);

  return (
    <svg
      viewBox={g.canvas.viewBox}
      className={className}
      role="img"
      aria-label="Digital multimeter rotary dial layer"
    >
      <defs>
        <radialGradient id="dialOuterGradient" cx="42%" cy="38%" r="78%">
          <stop offset="0%" stopColor="#8d8f95" />
          <stop offset="62%" stopColor="#5a5c61" />
          <stop offset="100%" stopColor="#212226" />
        </radialGradient>

        <radialGradient id="dialFaceGradient" cx="56%" cy="46%" r="60%">
          <stop offset="0%" stopColor="#797b80" />
          <stop offset="58%" stopColor="#5b5d62" />
          <stop offset="100%" stopColor="#34353a" />
        </radialGradient>

        <linearGradient id="dialPointerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4d4e53" />
          <stop offset="100%" stopColor="#25262b" />
        </linearGradient>

        <filter id="dialShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="9" floodColor="#000000" floodOpacity="0.3" />
        </filter>
      </defs>

      <g filter="url(#dialShadow)">
        <circle
          cx={g.dial.center.x}
          cy={g.dial.center.y}
          r={g.dial.outerRadius}
          fill="url(#dialOuterGradient)"
          stroke="#16171a"
          strokeWidth="3"
        />
        <circle
          cx={g.dial.center.x}
          cy={g.dial.center.y}
          r={g.dial.bezelRadius}
          fill="#7e8084"
          stroke="#0f1012"
          strokeWidth="2.5"
        />
        <circle
          cx={g.dial.center.x}
          cy={g.dial.center.y}
          r={g.dial.faceRadius}
          fill="url(#dialFaceGradient)"
        />
      </g>

      {showTicks || showStopMarkers ? (
        <g opacity={0.9}>
          {multimeterStopLayout.map((stop) => {
            const angle = getDialStopAngle(stop.dotX, stop.dotY);
            const inner = pointOnAngle(g.dial.center.x, g.dial.center.y, g.dial.outerRadius * 1.015, angle);
            const outer = pointOnAngle(g.dial.center.x, g.dial.center.y, g.dial.outerRadius * 1.105, angle);
            const active = stop.id === selectedStopId;
            const colors = getToneColors(stop.tone, active);

            return (
              <g key={stop.id}>
                {showTicks ? (
                  <line
                    x1={inner.x}
                    y1={inner.y}
                    x2={outer.x}
                    y2={outer.y}
                    stroke={colors.stroke}
                    strokeWidth={active ? 3.4 : 2.2}
                    strokeLinecap="round"
                  />
                ) : null}
                {showStopMarkers ? (
                  <>
                    <circle
                      cx={stop.dotX}
                      cy={stop.dotY}
                      r={active ? 7.5 : 0}
                      fill={colors.glow}
                    />
                    <circle
                      cx={stop.dotX}
                      cy={stop.dotY}
                      r={active ? 4.2 : 2.8}
                      fill={colors.fill}
                    />
                  </>
                ) : null}
              </g>
            );
          })}
        </g>
      ) : null}

      <DialPointer angle={selectedAngle} />
    </svg>
  );
}

export const multimeterDialStops = multimeterStopLayout.map((stop) => ({
  angle: getDialStopAngle(stop.dotX, stop.dotY),
  id: stop.id,
  label: stop.label,
  tone: stop.tone ?? "neutral",
}));

export const multimeterDialStopsClockwise = [...multimeterDialStops].sort(
  (left, right) => left.angle - right.angle,
);
