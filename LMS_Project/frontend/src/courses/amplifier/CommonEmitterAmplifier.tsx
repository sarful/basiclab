import React from "react";

const STROKE = "#000000";
const BG = "#ffffff";

type Point = {
  x: number;
  y: number;
};

function Wire({
  x1,
  y1,
  x2,
  y2,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={STROKE}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  );
}

function Node({ x, y, r = 2.4 }: { x: number; y: number; r?: number }) {
  return <circle cx={x} cy={y} r={r} fill={STROKE} />;
}

function Terminal({ x, y }: Point) {
  return (
    <circle
      cx={x}
      cy={y}
      r="5"
      fill={BG}
      stroke={STROKE}
      strokeWidth="1.3"
    />
  );
}

function Label({
  x,
  y,
  children,
  size = 14,
  anchor = "start",
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      fill={STROKE}
      fontSize={size}
      fontFamily="Times New Roman, serif"
      textAnchor={anchor}
      dominantBaseline="middle"
    >
      {children}
    </text>
  );
}

function Resistor({
  x,
  y1,
  y2,
  label,
  labelX,
  labelY,
}: {
  x: number;
  y1: number;
  y2: number;
  label?: React.ReactNode;
  labelX?: number;
  labelY?: number;
}) {
  const lead = 13;
  const amp = 9;
  const steps = 8;
  const zTop = y1 + lead;
  const zBottom = y2 - lead;
  const step = (zBottom - zTop) / steps;

  const points: string[] = [];
  points.push(`${x},${zTop}`);

  for (let i = 1; i <= steps; i++) {
    const px = i % 2 === 0 ? x - amp : x + amp;
    const py = zTop + step * i;
    points.push(`${px},${py}`);
  }

  points.push(`${x},${zBottom}`);

  return (
    <g>
      <Wire x1={x} y1={y1} x2={x} y2={zTop} />

      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={STROKE}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      <Wire x1={x} y1={zBottom} x2={x} y2={y2} />

      {label && (
        <Label x={labelX ?? x + 16} y={labelY ?? (y1 + y2) / 2}>
          {label}
        </Label>
      )}
    </g>
  );
}

function CapacitorHorizontal({
  x1,
  x2,
  y,
  label,
  labelX,
  labelY,
}: {
  x1: number;
  x2: number;
  y: number;
  label?: React.ReactNode;
  labelX?: number;
  labelY?: number;
}) {
  const mid = (x1 + x2) / 2;
  const gap = 6;

  return (
    <g>
      <Wire x1={x1} y1={y} x2={mid - gap} y2={y} />
      <Wire x1={mid + gap} y1={y} x2={x2} y2={y} />

      <line
        x1={mid - gap}
        y1={y - 17}
        x2={mid - gap}
        y2={y + 17}
        stroke={STROKE}
        strokeWidth="1.6"
      />

      <line
        x1={mid + gap}
        y1={y - 17}
        x2={mid + gap}
        y2={y + 17}
        stroke={STROKE}
        strokeWidth="1.6"
      />

      {label && (
        <Label x={labelX ?? mid} y={labelY ?? y - 26} anchor="middle">
          {label}
        </Label>
      )}
    </g>
  );
}

function CapacitorVertical({
  x,
  y1,
  y2,
  label,
  labelX,
  labelY,
}: {
  x: number;
  y1: number;
  y2: number;
  label?: React.ReactNode;
  labelX?: number;
  labelY?: number;
}) {
  const mid = (y1 + y2) / 2;
  const gap = 6;

  return (
    <g>
      <Wire x1={x} y1={y1} x2={x} y2={mid - gap} />
      <Wire x1={x} y1={mid + gap} x2={x} y2={y2} />

      <line
        x1={x - 17}
        y1={mid - gap}
        x2={x + 17}
        y2={mid - gap}
        stroke={STROKE}
        strokeWidth="1.6"
      />

      <line
        x1={x - 17}
        y1={mid + gap}
        x2={x + 17}
        y2={mid + gap}
        stroke={STROKE}
        strokeWidth="1.6"
      />

      {label && (
        <Label x={labelX ?? x + 18} y={labelY ?? mid}>
          {label}
        </Label>
      )}
    </g>
  );
}

function Ground({ x, y }: Point) {
  return (
    <g stroke={STROKE} strokeWidth="1.5" strokeLinecap="round">
      <Wire x1={x} y1={y - 12} x2={x} y2={y} />
      <line x1={x - 14} y1={y} x2={x + 14} y2={y} />
      <line x1={x - 9} y1={y + 5} x2={x + 9} y2={y + 5} />
      <line x1={x - 4} y1={y + 10} x2={x + 4} y2={y + 10} />
    </g>
  );
}

function SineSource({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r="17"
        fill={BG}
        stroke={STROKE}
        strokeWidth="1.4"
      />

      <path
        d={`M ${cx - 10} ${cy} C ${cx - 5} ${cy - 12}, ${
          cx + 4
        } ${cy + 12}, ${cx + 10} ${cy}`}
        fill="none"
        stroke={STROKE}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </g>
  );
}

function NpnTransistor() {
  return (
    <g>
      <circle
        cx="221"
        cy="160"
        r="50"
        fill={BG}
        stroke={STROKE}
        strokeWidth="1.5"
      />

      {/* Base */}
      <line
        x1="196"
        y1="124"
        x2="196"
        y2="196"
        stroke={STROKE}
        strokeWidth="2"
      />

      <line
        x1="162"
        y1="160"
        x2="196"
        y2="160"
        stroke={STROKE}
        strokeWidth="2"
      />

      {/* Collector */}
      <line
        x1="196"
        y1="143"
        x2="246"
        y2="118"
        stroke={STROKE}
        strokeWidth="2"
      />

      {/* Emitter, arrowhead removed */}
      <line
        x1="196"
        y1="178"
        x2="246"
        y2="202"
        stroke={STROKE}
        strokeWidth="2"
      />

      {/* Leads */}
      <line
        x1="246"
        y1="118"
        x2="247"
        y2="108"
        stroke={STROKE}
        strokeWidth="1.5"
      />

      <line
        x1="246"
        y1="202"
        x2="252"
        y2="218"
        stroke={STROKE}
        strokeWidth="1.5"
      />
    </g>
  );
}

export default function CommonEmitterAmplifier() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <svg
        width="380"
        height="322"
        viewBox="0 0 380 322"
        className="h-auto w-full max-w-[760px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="380" height="322" fill={BG} />

        {/* Top VCC rail */}
        <Wire x1={130} y1={11} x2={335} y2={11} />
        <Node x={235} y={11} r={2} />
        <Terminal x={335} y={11} />
        <Label x={346} y={10}>+Vcc</Label>

        {/* R1 and R2 bias divider */}
        <Resistor
          x={130}
          y1={11}
          y2={112}
          label="R1"
          labelX={106}
          labelY={63}
        />

        <Wire x1={130} y1={112} x2={130} y2={160} />

        <Resistor
          x={130}
          y1={160}
          y2={280}
          label="R2"
          labelX={107}
          labelY={220}
        />

        <Wire x1={130} y1={280} x2={130} y2={298} />
        <Ground x={130} y={298} />

        {/* Input source and coupling capacitor */}
        <Wire x1={31} y1={146} x2={68} y2={146} />

        <CapacitorHorizontal
          x1={68}
          x2={130}
          y={146}
          label="C1"
          labelX={86}
          labelY={119}
        />

        <Wire x1={31} y1={146} x2={31} y2={201} />
        <SineSource cx={31} cy={218} />
        <Wire x1={31} y1={235} x2={31} y2={313} />
        <Label x={5} y={264}>Vin</Label>

        {/* Base node */}
        <Wire x1={130} y1={160} x2={162} y2={160} />
        <Node x={130} y={160} />
        <Label x={155} y={145}>IB</Label>
        <Label x={171} y={227}>VB</Label>

        {/* Collector resistor */}
        <Resistor
          x={235}
          y1={11}
          y2={111}
          label="RC"
          labelX={251}
          labelY={63}
        />

        <Wire x1={235} y1={111} x2={246} y2={118} />

        <Label x={286} y={65}>IcRC</Label>
        <Label x={273} y={86}>Ic</Label>

        {/* Transistor */}
        <NpnTransistor />

        {/* Output line */}
        <Wire x1={246} y1={146} x2={335} y2={146} />
        <Terminal x={335} y={146} />
        <Label x={348} y={149}>Vout</Label>
        <Label x={291} y={188}>VCE</Label>

        {/* Emitter resistor */}
        <Wire x1={252} y1={218} x2={252} y2={222} />
        <Label x={272} y={220}>IE</Label>

        <Resistor
          x={252}
          y1={222}
          y2={283}
          label="RE"
          labelX={229}
          labelY={253}
        />

        <Wire x1={252} y1={283} x2={252} y2={289} />
        <Ground x={252} y={289} />

        {/* Emitter bypass capacitor */}
        <Wire x1={252} y1={222} x2={312} y2={222} />

        <CapacitorVertical
          x={312}
          y1={222}
          y2={292}
          label="Ce"
          labelX={326}
          labelY={258}
        />

        <Wire x1={312} y1={292} x2={312} y2={307} />
        <Wire x1={312} y1={307} x2={334} y2={307} />
        <Terminal x={334} y={307} />
        <Label x={348} y={307}>0V</Label>

        {/* Return/common ground wire */}
        <Wire x1={31} y1={313} x2={252} y2={313} />
        <Wire x1={252} y1={299} x2={252} y2={313} />
        <Wire x1={312} y1={307} x2={312} y2={313} />
      </svg>
    </div>
  );
}
