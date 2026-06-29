"use client";

import { clamp } from "./logic";
import type { PhotodiodeState } from "./types";

export function SensorGraphSection({
  points,
  currentLux,
  currentOutputVoltage,
}: {
  points: PhotodiodeState[];
  currentLux: number;
  currentOutputVoltage: number;
}) {
  const maxLux = 100000;
  const maxVoltage = Math.max(1, ...points.map((point) => point.outputVoltage));
  const xForLux = (lux: number) => 55 + (Math.log10(lux + 1) / Math.log10(maxLux + 1)) * 390;
  const yForVoltage = (voltage: number) => 240 - (voltage / maxVoltage) * 175;
  const path = points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"}${xForLux(point.lux).toFixed(1)} ${yForVoltage(point.outputVoltage).toFixed(1)}`,
    )
    .join(" ");
  const currentX = xForLux(currentLux);
  const currentY = yForVoltage(currentOutputVoltage);

  return (
    <section className="overflow-x-auto rounded-3xl border bg-white p-4 shadow-sm sm:p-5">
      <h2 className="text-xl font-black">Interactive Graph: Lux to Output Voltage</h2>
      <p className="mt-1 text-sm font-semibold text-slate-600">
        This graph shows how photodiode current becomes a measurable resistor voltage as light increases.
      </p>
      <svg viewBox="0 0 520 290" className="mt-4 h-[290px] min-w-[520px] sm:min-w-0 sm:w-full" role="img" aria-label="Graph of lux versus photocurrent">
        <rect x="40" y="35" width="430" height="225" rx="14" fill="#f8fafc" stroke="#e2e8f0" />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <line x1={55 + i * 97.5} y1="55" x2={55 + i * 97.5} y2="240" stroke="#e2e8f0" />
            <line x1="55" y1={55 + i * 46.25} x2="445" y2={55 + i * 46.25} stroke="#e2e8f0" />
          </g>
        ))}
        <line x1="55" y1="240" x2="445" y2="240" stroke="#0f172a" strokeWidth="2" />
        <line x1="55" y1="240" x2="55" y2="55" stroke="#0f172a" strokeWidth="2" />
        <path d={path} fill="none" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={currentX} cy={currentY} r="7" fill="#dc2626" stroke="white" strokeWidth="2" />
        <text x="55" y="264" fontSize="11" fontWeight="800" fill="#475569">0</text>
        <text x="166" y="264" fontSize="11" fontWeight="800" fill="#475569">100</text>
        <text x="255" y="264" fontSize="11" fontWeight="800" fill="#475569">1k</text>
        <text x="345" y="264" fontSize="11" fontWeight="800" fill="#475569">10k</text>
        <text x="420" y="264" fontSize="11" fontWeight="800" fill="#475569">100k lux</text>
        <text x="17" y="60" fontSize="12" fontWeight="900" fill="#334155">V</text>
        <text x="350" y="285" fontSize="12" fontWeight="900" fill="#334155">Light level (lux)</text>
        <text x={clamp(currentX + 10, 70, 390)} y={clamp(currentY - 12, 45, 230)} fontSize="12" fontWeight="900" fill="#dc2626">
          {currentOutputVoltage.toFixed(2)}V
        </text>
      </svg>
    </section>
  );
}
