import { multimeterGeometry } from "./multimeterGeometry";

const OMEGA = "\u03a9";

export type MultimeterJackId = "jack_10a" | "jack_voma" | "jack_com";
export type ProbeLeadColor = "red" | "black";

type DigitalMultimeterProbeJacksProps = {
  blackLeadJack?: MultimeterJackId;
  className?: string;
  redLeadJack?: MultimeterJackId;
  showLeadRoutes?: boolean;
};

type JackMeta = {
  cx: number;
  cy: number;
  id: MultimeterJackId;
  label: string;
  ringTone: "red" | "white";
};

const jackMeta: JackMeta[] = [
  {
    id: "jack_10a",
    label: "10A",
    cx: multimeterGeometry.probeJacks.tenAmp.cx,
    cy: multimeterGeometry.probeJacks.tenAmp.cy,
    ringTone: "red",
  },
  {
    id: "jack_voma",
    label: `V${OMEGA}mA`,
    cx: multimeterGeometry.probeJacks.vmA.cx,
    cy: multimeterGeometry.probeJacks.vmA.cy,
    ringTone: "white",
  },
  {
    id: "jack_com",
    label: "COM",
    cx: multimeterGeometry.probeJacks.com.cx,
    cy: multimeterGeometry.probeJacks.com.cy,
    ringTone: "white",
  },
];

function getLeadColor(color: ProbeLeadColor, active: boolean) {
  if (color === "red") {
    return active
      ? { glow: "rgba(255,92,68,0.34)", stroke: "#ff5c44", wire: "#ff654c" }
      : { glow: "transparent", stroke: "#b55f58", wire: "#7c3631" };
  }

  return active
    ? { glow: "rgba(215,221,229,0.28)", stroke: "#eff2f7", wire: "#d4dae3" }
    : { glow: "transparent", stroke: "#828890", wire: "#555b64" };
}

function JackSocket({
  activeLeadColor,
  cx,
  cy,
  isSelected,
  outerRadius,
  ringTone,
}: {
  activeLeadColor?: ProbeLeadColor;
  cx: number;
  cy: number;
  isSelected: boolean;
  outerRadius: number;
  ringTone: JackMeta["ringTone"];
}) {
  const baseStroke = ringTone === "red" ? "#ff6e59" : "#d6d9df";
  const leadColors = activeLeadColor ? getLeadColor(activeLeadColor, true) : undefined;

  return (
    <g>
      {isSelected ? (
        <circle
          cx={cx}
          cy={cy}
          r={outerRadius * 1.18}
          fill={leadColors?.glow ?? "rgba(255,255,255,0.14)"}
        />
      ) : null}

      <circle
        cx={cx}
        cy={cy}
        r={outerRadius}
        fill="url(#probeJackBodyGradient)"
        stroke={leadColors?.stroke ?? baseStroke}
        strokeWidth={isSelected ? 2.8 : 2.1}
      />
      <circle
        cx={cx}
        cy={cy}
        r={outerRadius * 0.68}
        fill="url(#probeJackRimGradient)"
      />
      <circle
        cx={cx}
        cy={cy}
        r={outerRadius * 0.46}
        fill="#040404"
        stroke={leadColors?.stroke ?? "#d8dbe0"}
        strokeWidth={isSelected ? 1.8 : 1.2}
      />
      <circle
        cx={cx - outerRadius * 0.22}
        cy={cy - outerRadius * 0.24}
        r={outerRadius * 0.12}
        fill="rgba(255,255,255,0.2)"
      />
    </g>
  );
}

function LeadRoute({
  color,
  from,
  label,
  to,
}: {
  color: ProbeLeadColor;
  from: { x: number; y: number };
  label: string;
  to: { x: number; y: number };
}) {
  const colors = getLeadColor(color, true);
  const controlX = color === "red" ? to.x + 56 : to.x + 32;
  const controlY = color === "red" ? to.y - 38 : to.y + 28;
  const path = `M ${from.x} ${from.y} C ${controlX} ${from.y}, ${controlX} ${controlY}, ${to.x} ${to.y}`;

  return (
    <g>
      <path d={path} fill="none" stroke={colors.glow} strokeWidth="10" strokeLinecap="round" />
      <path d={path} fill="none" stroke={colors.wire} strokeWidth="4.2" strokeLinecap="round" />
      <circle cx={from.x} cy={from.y} r="5.2" fill={colors.stroke} />
      <Label x={from.x + (color === "red" ? 16 : -16)} y={from.y - 10} color={colors.stroke} anchor={color === "red" ? "start" : "end"}>
        {label}
      </Label>
    </g>
  );
}

function Label({
  x,
  y,
  children,
  anchor = "middle",
  color = "#f6f6f7",
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  anchor?: "start" | "middle" | "end";
  color?: string;
}) {
  return (
    <text
      x={x}
      y={y}
      fill={color}
      fontSize="13"
      fontWeight="700"
      textAnchor={anchor}
      fontFamily="Arial, Helvetica, sans-serif"
      letterSpacing="0.04em"
    >
      {children}
    </text>
  );
}

export default function DigitalMultimeterProbeJacks({
  blackLeadJack = "jack_com",
  className,
  redLeadJack = "jack_voma",
  showLeadRoutes = true,
}: DigitalMultimeterProbeJacksProps) {
  const g = multimeterGeometry;
  const outerRadius = g.probeJacks.tenAmp.r;

  const redJack = jackMeta.find((jack) => jack.id === redLeadJack) ?? jackMeta[1];
  const blackJack = jackMeta.find((jack) => jack.id === blackLeadJack) ?? jackMeta[2];

  return (
    <svg
      viewBox={g.canvas.viewBox}
      className={className}
      role="img"
      aria-label="Digital multimeter probe jack layer"
    >
      <defs>
        <radialGradient id="probeJackBodyGradient" cx="38%" cy="34%" r="70%">
          <stop offset="0%" stopColor="#8f9197" />
          <stop offset="55%" stopColor="#51525a" />
          <stop offset="100%" stopColor="#1c1d22" />
        </radialGradient>

        <radialGradient id="probeJackRimGradient" cx="42%" cy="40%" r="72%">
          <stop offset="0%" stopColor="#0b0c10" />
          <stop offset="100%" stopColor="#676972" />
        </radialGradient>
      </defs>

      {showLeadRoutes ? (
        <>
          <LeadRoute
            color="red"
            from={{ x: redJack.cx + outerRadius * 0.95, y: redJack.cy - outerRadius * 0.2 }}
            to={{ x: g.controlPanel.x + g.controlPanel.width + 20, y: redJack.cy - 16 }}
            label="Red lead"
          />
          <LeadRoute
            color="black"
            from={{ x: blackJack.cx + outerRadius * 0.84, y: blackJack.cy + outerRadius * 0.24 }}
            to={{ x: g.controlPanel.x + g.controlPanel.width + 12, y: blackJack.cy + 30 }}
            label="Black lead"
          />
        </>
      ) : null}

      {jackMeta.map((jack) => {
        const activeLeadColor =
          jack.id === redLeadJack ? "red" : jack.id === blackLeadJack ? "black" : undefined;
        const isSelected = activeLeadColor !== undefined;

        return (
          <g key={jack.id}>
            <JackSocket
              activeLeadColor={activeLeadColor}
              cx={jack.cx}
              cy={jack.cy}
              isSelected={isSelected}
              outerRadius={outerRadius}
              ringTone={jack.ringTone}
            />
          </g>
        );
      })}
    </svg>
  );
}
