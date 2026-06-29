"use client";

import { motion } from "framer-motion";

import { calculateThermistorResistance, formatResistance } from "./logic";
import type { ThermistorMode } from "./types";

export function ThermistorGraph({
  mode,
  nominalResistance,
  temperature,
  resistance,
}: {
  mode: ThermistorMode;
  nominalResistance: number;
  temperature: number;
  resistance: number;
}) {
  const width = 430;
  const height = 260;

  const left = 46;
  const right = 24;
  const top = 32;
  const bottom = 44;

  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;

  const safeTemperature = Math.max(0, Math.min(120, temperature));
  const safeResistance = Math.max(resistance, 1);

  const samples = Array.from({ length: 121 }, (_, temperatureValue) => {
    const calculatedResistance = calculateThermistorResistance(
      mode,
      nominalResistance,
      temperatureValue,
    );

    return {
      temperature: temperatureValue,
      resistance: Math.max(calculatedResistance, 1),
    };
  });

  const maxResistance = Math.max(...samples.map((item) => item.resistance));
  const minResistance = Math.min(...samples.map((item) => item.resistance));
  const resistanceRange = Math.max(maxResistance - minResistance, 1);

  const getX = (temperatureValue: number) =>
    left + (temperatureValue / 120) * plotWidth;

  const getY = (resistanceValue: number) =>
    top +
    (1 - (resistanceValue - minResistance) / resistanceRange) * plotHeight;

  const curvePath = samples
    .map((item, index) => {
      const command = index === 0 ? "M" : "L";
      return `${command}${getX(item.temperature).toFixed(2)} ${getY(
        item.resistance,
      ).toFixed(2)}`;
    })
    .join(" ");

  const liveX = getX(safeTemperature);
  const liveY = getY(safeResistance);

  const curveColor = mode === "ntc" ? "#2563eb" : "#f97316";

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <h2 className="text-lg font-bold leading-tight text-slate-900">
        Temperature vs Resistance Graph
      </h2>

      <p className="mt-2 text-xs leading-5 text-slate-600">
        {mode === "ntc"
          ? "NTC thermistor: resistance decreases nonlinearly as temperature increases."
          : "PTC thermistor: resistance increases nonlinearly as temperature increases."}
      </p>

      <div className="mt-4 overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full min-w-[320px]"
          role="img"
          aria-label={`${mode.toUpperCase()} temperature resistance curve`}
        >
          {[0, 1, 2, 3, 4].map((line) => {
            const y = top + (line / 4) * plotHeight;

            return (
              <line
                key={`horizontal-grid-${line}`}
                x1={left}
                y1={y}
                x2={width - right}
                y2={y}
                stroke="#e2e8f0"
                strokeWidth="1"
              />
            );
          })}

          {[0, 30, 60, 90, 120].map((temp) => {
            const x = getX(temp);

            return (
              <g key={`temperature-grid-${temp}`}>
                <line
                  x1={x}
                  y1={top}
                  x2={x}
                  y2={height - bottom}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={height - 20}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="10"
                  fontWeight="700"
                >
                  {temp}°C
                </text>
              </g>
            );
          })}

          <line
            x1={left}
            y1={top}
            x2={left}
            y2={height - bottom}
            stroke="#94a3b8"
            strokeWidth="2"
          />

          <line
            x1={left}
            y1={height - bottom}
            x2={width - right}
            y2={height - bottom}
            stroke="#94a3b8"
            strokeWidth="2"
          />

          <motion.path
            d={curvePath}
            fill="none"
            stroke={curveColor}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8 }}
          />

          <motion.circle
            cx={liveX}
            cy={liveY}
            r="6"
            fill="#0ea5e9"
            stroke="#e0f2fe"
            strokeWidth="3"
            animate={{ scale: [1, 1.18, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />

          <text
            x={liveX}
            y={Math.max(18, liveY - 14)}
            textAnchor="middle"
            fill="#334155"
            fontSize="11"
            fontWeight="900"
          >
            {safeTemperature.toFixed(0)}°C · {formatResistance(safeResistance)}
          </text>

          <text
            x={width / 2}
            y={height - 4}
            textAnchor="middle"
            fill="#334155"
            fontSize="11"
            fontWeight="800"
          >
            Temperature
          </text>

          <text
            x="14"
            y={height / 2}
            textAnchor="middle"
            fill="#334155"
            fontSize="11"
            fontWeight="800"
            transform={`rotate(-90 14 ${height / 2})`}
          >
            Resistance
          </text>

          <text
            x={left + 4}
            y={top - 10}
            fill="#64748b"
            fontSize="10"
            fontWeight="700"
          >
            Max {formatResistance(maxResistance)}
          </text>

          <text
            x={left + 4}
            y={height - bottom - 8}
            fill="#64748b"
            fontSize="10"
            fontWeight="700"
          >
            Min {formatResistance(minResistance)}
          </text>

          <text
            x={width - right}
            y={top - 10}
            textAnchor="end"
            fill={curveColor}
            fontSize="11"
            fontWeight="900"
          >
            {mode.toUpperCase()} Curve
          </text>
        </svg>
      </div>
    </section>
  );
}
