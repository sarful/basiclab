"use client";

export function SimulatorOneRailBox({ y }: { y: number }) {
  return (
    <rect
      x="30"
      y={y}
      width="1140"
      height="90"
      rx="7"
      fill="#f3eddf"
      stroke="#d8d0c0"
    />
  );
}

export function SimulatorOnePowerLines({
  top = false,
  y,
}: {
  top?: boolean;
  y: number;
}) {
  const redY = top ? y : y + 55;
  const blueY = top ? y + 55 : y;

  return (
    <>
      <line x1="80" y1={redY} x2="1120" y2={redY} stroke="#e23b2e" strokeWidth="3" />
      <line x1="80" y1={blueY} x2="1120" y2={blueY} stroke="#1875bd" strokeWidth="3" />
    </>
  );
}

export function SimulatorOnePowerSigns({
  reverse = false,
  y,
}: {
  reverse?: boolean;
  y: number;
}) {
  const plusY = reverse ? y + 55 : y;
  const minusY = reverse ? y : y + 55;

  return (
    <>
      <text x="55" y={plusY + 7} className="fill-red-600 text-[28px] font-light">
        +
      </text>
      <text x="1135" y={plusY + 7} className="fill-red-600 text-[28px] font-light">
        +
      </text>
      <text x="56" y={minusY + 5} className="fill-blue-600 text-[28px] font-light">
        -
      </text>
      <text x="1137" y={minusY + 5} className="fill-blue-600 text-[28px] font-light">
        -
      </text>
    </>
  );
}

export function SimulatorOneFeatureLabel({
  text,
  title,
  x,
  y,
}: {
  text: string;
  title: string;
  x: number;
  y: number;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width="285"
        height="66"
        rx="10"
        fill="#ffffff"
        stroke="#334155"
        strokeWidth="1.5"
        opacity="0.96"
      />
      <text x={x + 14} y={y + 25} className="fill-slate-900 text-[16px] font-bold">
        {title}
      </text>
      <text x={x + 14} y={y + 48} className="fill-slate-600 text-[12px]">
        {text}
      </text>
    </g>
  );
}
