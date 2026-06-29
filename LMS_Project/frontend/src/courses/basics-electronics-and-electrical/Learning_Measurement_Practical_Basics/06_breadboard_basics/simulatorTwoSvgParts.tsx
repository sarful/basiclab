"use client";

import { simulatorTwoColumns, simulatorTwoRowY } from "./simulatorTwoData";

export function SimulatorTwoPowerRail({
  side,
  x,
}: {
  side: "left" | "right";
  x: number;
}) {
  const blueX = side === "left" ? x + 10 : x - 10;
  const redX = side === "left" ? x + 40 : x + 20;

  return (
    <>
      {simulatorTwoColumns.map((column) => (
        <g key={`${side}-rail-${column}`}>
          <rect
            x={blueX - 10}
            y={simulatorTwoRowY(column) - 8}
            width="22"
            height="16"
            rx="3"
            fill="#fff7aa"
            stroke="#111827"
            strokeWidth="1.4"
          />
          <rect
            x={redX - 10}
            y={simulatorTwoRowY(column) - 8}
            width="22"
            height="16"
            rx="3"
            fill="#fff7aa"
            stroke="#111827"
            strokeWidth="1.4"
          />
        </g>
      ))}
    </>
  );
}

export function SimulatorTwoFeatureLabel({
  lineToX,
  lineToY,
  text,
  title,
  x,
  y,
}: {
  lineToX: number;
  lineToY: number;
  text: string;
  title: string;
  x: number;
  y: number;
}) {
  return (
    <g>
      <line x1={x + 90} y1={y + 60} x2={lineToX} y2={lineToY} stroke="#0f172a" strokeWidth="2" />
      <rect x={x} y={y} width="180" height="62" rx="10" fill="white" stroke="#0f172a" opacity="0.96" />
      <text x={x + 12} y={y + 24} className="fill-slate-900 text-[15px] font-bold">
        {title}
      </text>
      <text x={x + 12} y={y + 47} className="fill-slate-600 text-[12px]">
        {text}
      </text>
    </g>
  );
}
