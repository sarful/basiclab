"use client";

import { motion } from "framer-motion";

import {
  buildCharacteristicCurvePath,
  CHARACTERISTIC_CHART,
  currentToY,
  DIODE_MODEL,
  getCharacteristicPoint,
  voltageToX,
} from "./logic";

export function CharacteristicsView({ voltage }: { voltage: number }) {
  const point = getCharacteristicPoint(voltage);
  const curvePath = buildCharacteristicCurvePath();

  const zeroX = voltageToX(0);
  const zeroY = currentToY(0);
  const thresholdX = voltageToX(DIODE_MODEL.thresholdVoltage);

  const regionLabel =
    point.region === "forward"
      ? "Forward conduction"
      : point.region === "reverse-blocked"
        ? "Reverse blocking"
        : "Below threshold";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
            Diode V-I Characteristics
          </p>
          <h2 className="text-2xl font-black text-slate-900">
            Real Diode Characteristic Curve
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
            Forward current rises after about 0.7V. In reverse direction, only
            tiny leakage flows until breakdown region.
          </p>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-right">
          <p className="text-xs font-black uppercase text-blue-700">Region</p>
          <p className="text-xl font-black text-blue-900">{regionLabel}</p>
        </div>
      </div>

      <svg
        viewBox="0 0 560 360"
        className="h-auto min-h-[360px] w-full"
        role="img"
        aria-label="Real diode voltage current characteristic curve"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect
          x="42"
          y="28"
          width="470"
          height="285"
          rx="20"
          fill="#f8fafc"
          stroke="#e2e8f0"
        />

        {[-12, -6, 0, 6, 12].map((tick) => {
          const x = voltageToX(tick);
          return (
            <g key={`v-${tick}`}>
              <line
                x1={x}
                y1={CHARACTERISTIC_CHART.y}
                x2={x}
                y2={CHARACTERISTIC_CHART.zeroY}
                stroke="#e2e8f0"
                strokeDasharray="4 6"
              />
              <text
                x={x}
                y="292"
                textAnchor="middle"
                fontSize="12"
                fontWeight="800"
                fill="#475569"
              >
                {tick}V
              </text>
            </g>
          );
        })}

        {[-25, -10, 0, 10, 25].map((tick) => {
          const y = currentToY(tick);
          return (
            <g key={`i-${tick}`}>
              <line
                x1={CHARACTERISTIC_CHART.x}
                y1={y}
                x2={CHARACTERISTIC_CHART.x + CHARACTERISTIC_CHART.width}
                y2={y}
                stroke="#e2e8f0"
                strokeDasharray="4 6"
              />
              <text
                x="58"
                y={y + 4}
                textAnchor="end"
                fontSize="12"
                fontWeight="800"
                fill="#475569"
              >
                {tick}
              </text>
            </g>
          );
        })}

        <line
          x1={CHARACTERISTIC_CHART.x}
          y1={zeroY}
          x2={CHARACTERISTIC_CHART.x + CHARACTERISTIC_CHART.width + 18}
          y2={zeroY}
          stroke="#0f172a"
          strokeWidth="2.5"
        />
        <line
          x1={zeroX}
          y1={CHARACTERISTIC_CHART.zeroY}
          x2={zeroX}
          y2={CHARACTERISTIC_CHART.y - 18}
          stroke="#0f172a"
          strokeWidth="2.5"
        />

        <polygon
          points={`${CHARACTERISTIC_CHART.x + CHARACTERISTIC_CHART.width + 18},${zeroY} ${CHARACTERISTIC_CHART.x + CHARACTERISTIC_CHART.width + 5},${zeroY - 7} ${CHARACTERISTIC_CHART.x + CHARACTERISTIC_CHART.width + 5},${zeroY + 7}`}
          fill="#0f172a"
        />
        <polygon
          points={`${zeroX},${CHARACTERISTIC_CHART.y - 18} ${zeroX - 7},${CHARACTERISTIC_CHART.y - 4} ${zeroX + 7},${CHARACTERISTIC_CHART.y - 4}`}
          fill="#0f172a"
        />

        <text
          x="438"
          y={zeroY - 12}
          fontSize="20"
          fontWeight="900"
          fill="#0f172a"
        >
          VD
        </text>
        <text
          x={zeroX + 10}
          y="35"
          fontSize="20"
          fontWeight="900"
          fill="#0f172a"
        >
          ID
        </text>

        <line
          x1={thresholdX}
          y1={CHARACTERISTIC_CHART.y}
          x2={thresholdX}
          y2={CHARACTERISTIC_CHART.zeroY}
          stroke="#f97316"
          strokeWidth="2"
          strokeDasharray="7 6"
        />
        <text
          x={thresholdX + 10}
          y="70"
          fontSize="12"
          fontWeight="900"
          fill="#c2410c"
        >
          0.7V
        </text>

        <path
          d={curvePath}
          fill="none"
          stroke="#bfdbfe"
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.42"
        />
        <path
          d={curvePath}
          fill="none"
          stroke="#2563eb"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        <motion.line
          x1={point.x}
          y1={zeroY}
          x2={point.x}
          y2={point.y}
          stroke="#ef4444"
          strokeWidth="1.8"
          strokeDasharray="5 5"
          animate={{ x1: point.x, x2: point.x, y2: point.y }}
          transition={{ duration: 0.25 }}
        />
        <motion.line
          x1={zeroX}
          y1={point.y}
          x2={point.x}
          y2={point.y}
          stroke="#ef4444"
          strokeWidth="1.8"
          strokeDasharray="5 5"
          animate={{ y1: point.y, y2: point.y, x2: point.x }}
          transition={{ duration: 0.25 }}
        />

        <motion.circle
          cx={point.x}
          cy={point.y}
          r="8"
          fill="#dc2626"
          stroke="#ffffff"
          strokeWidth="3"
          animate={{ cx: point.x, cy: point.y }}
          transition={{ duration: 0.25 }}
        />
      </svg>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black uppercase text-slate-500">
            Voltage VD
          </p>
          <p className="mt-1 text-xl font-black">
            {point.voltage.toFixed(1)} V
          </p>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-xs font-black uppercase text-red-600">
            Current ID
          </p>
          <p className="mt-1 text-xl font-black text-red-700">
            {point.currentMA.toFixed(2)} mA
          </p>
        </div>

        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
          <p className="text-xs font-black uppercase text-orange-600">
            Threshold
          </p>
          <p className="mt-1 text-xl font-black text-orange-700">
            {point.threshold.toFixed(1)} V
          </p>
        </div>
      </div>
    </div>
  );
}
