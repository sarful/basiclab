"use client";

import { motion } from "framer-motion";

import { clamp, formatResistance } from "./logic";

export function LdrVisual({
  lightPercent,
  resistance,
  voltage,
  fixedResistor,
}: {
  lightPercent: number;
  resistance: number;
  voltage: number;
  fixedResistor: number;
}) {
  const current = voltage / Math.max(resistance + fixedResistor, 1);
  const outputVoltage = voltage * (resistance / (fixedResistor + resistance));
  const lightLevel = clamp(lightPercent / 100, 0, 1);
  const flowLevel = clamp(current / 0.01, 0.08, 1);
  const particleCount = Math.min(Math.max(Math.round(flowLevel * 18), 4), 22);
  const speed = Math.max(0.55, 2.4 - flowLevel * 1.5);
  const ledBrightness = clamp(outputVoltage / Math.max(voltage, 1), 0, 1);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">LDR Behavior Visualizer</h2>
          <p className="text-xs text-slate-600">Change the light level and watch the LDR resistance and divider output respond.</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${lightPercent > 60 ? "bg-yellow-100 text-yellow-700" : lightPercent > 25 ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-700"}`}>
          {lightPercent > 60 ? "BRIGHT LIGHT" : lightPercent > 25 ? "MEDIUM LIGHT" : "DARK"}
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3">
        <svg viewBox="0 0 780 370" className="h-auto w-[780px] sm:w-full">
          <defs>
            <filter id="lampGlow" x="-70%" y="-70%" width="240%" height="240%">
              <feGaussianBlur stdDeviation={6 + ledBrightness * 18} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="ldrFace" cx="50%" cy="45%" r="60%">
              <stop offset="0%" stopColor="#fef9c3" />
              <stop offset="55%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#a16207" />
            </radialGradient>
          </defs>

          <text x="390" y="28" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="800">
            LDR: Light ↑ → Resistance ↓ | Light ↓ → Resistance ↑
          </text>

          <rect x="42" y="122" width="90" height="92" rx="14" fill="#0f172a" stroke="#94a3b8" strokeWidth="3" />
          <text x="87" y="158" textAnchor="middle" fill="#f8fafc" fontSize="16" fontWeight="800">
            DC
          </text>
          <text x="87" y="184" textAnchor="middle" fill="#7dd3fc" fontSize="14" fontWeight="800">
            {voltage}V
          </text>

          <path d="M132 168 H286" stroke="#64748b" strokeWidth={5 + flowLevel * 5} strokeLinecap="round" />
          <path d="M444 168 H656 V248 H87 V214" stroke="#64748b" strokeWidth={5 + flowLevel * 5} fill="none" strokeLinecap="round" />

          <motion.g animate={{ scale: lightPercent > 80 ? [1, 1.03, 1] : 1 }} transition={{ repeat: Infinity, duration: 1.1 }}>
            <circle cx="365" cy="168" r="39" fill="#fde68a" stroke="#111827" strokeWidth="5" />
            <circle cx="365" cy="168" r="34" fill="url(#ldrFace)" stroke="#a16207" strokeWidth="4" />

            <path d="M338 154 C346 145 384 145 392 154" stroke="#111827" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M334 168 C348 155 382 181 396 168" stroke="#111827" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M340 182 C350 191 380 191 390 182" stroke="#111827" strokeWidth="5" fill="none" strokeLinecap="round" />

            <path d="M326 126 L345 148" stroke="#eab308" strokeWidth="5" strokeLinecap="round" />
            <polygon points="345,148 337,145 341,153" fill="#eab308" />
            <path d="M404 126 L385 148" stroke="#eab308" strokeWidth="5" strokeLinecap="round" />
            <polygon points="385,148 389,153 395,145" fill="#eab308" />

            <line x1="286" y1="168" x2="330" y2="168" stroke="#64748b" strokeWidth="7" strokeLinecap="round" />
            <line x1="400" y1="168" x2="444" y2="168" stroke="#64748b" strokeWidth="7" strokeLinecap="round" />

            <motion.circle
              cx="365"
              cy="168"
              r={22 + lightLevel * 5}
              fill="rgba(250,204,21,0.12)"
              animate={{ opacity: [0.25, 0.6, 0.25] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            />

            <text x="365" y="225" textAnchor="middle" fill="#64748b" fontSize="12">
              R = {formatResistance(resistance)}
            </text>
          </motion.g>

          <motion.g animate={{ opacity: lightLevel > 0.15 ? [0.25, 1, 0.25] : 0.12 }} transition={{ repeat: Infinity, duration: 1 }}>
            <line x1="275" y1="72" x2="325" y2="116" stroke="#eab308" strokeWidth={2 + lightLevel * 5} strokeLinecap="round" />
            <line x1="365" y1="58" x2="365" y2="100" stroke="#eab308" strokeWidth={2 + lightLevel * 5} strokeLinecap="round" />
            <line x1="455" y1="72" x2="405" y2="116" stroke="#eab308" strokeWidth={2 + lightLevel * 5} strokeLinecap="round" />
          </motion.g>

          {Array.from({ length: particleCount }).map((_, index) => (
            <motion.circle
              key={`ldr-electron-${particleCount}-${index}`}
              r="4"
              fill="#0ea5e9"
              stroke="#e0f2fe"
              strokeWidth="1.5"
              initial={{ offsetDistance: "0%", opacity: 0 }}
              animate={{ offsetDistance: "100%", opacity: [0, 1, 1, 0] }}
              transition={{ duration: speed, repeat: Infinity, ease: "linear", delay: index * (speed / particleCount) }}
              style={{ offsetPath: "path('M87 214 V248 H656 V168 H444 H400 H330 H286 H132')" }}
            />
          ))}

          <g transform="translate(622 85)">
            <circle cx="45" cy="45" r="38" fill={`rgba(250,204,21,${0.15 + ledBrightness * 0.85})`} stroke="#ca8a04" strokeWidth={4 + ledBrightness * 4} filter="url(#lampGlow)" />
            <path d="M30 45 H60 M36 30 L54 60 M54 30 L36 60" stroke="#a16207" strokeWidth="4" strokeLinecap="round" />
            <text x="45" y="100" textAnchor="middle" fill="#334155" fontSize="12" fontWeight="700">
              Street Light
            </text>
            <text x="45" y="118" textAnchor="middle" fill="#64748b" fontSize="10">
              {ledBrightness > 0.65 ? "ON" : ledBrightness > 0.25 ? "DIM" : "OFF"}
            </text>
          </g>

          <text x="180" y="143" textAnchor="middle" fill="#2563eb" fontSize="12" fontWeight="700">
            Current flow
          </text>
          <text x="580" y="143" textAnchor="middle" fill="#16a34a" fontSize="12" fontWeight="700">
            Vout across LDR
          </text>

          <g transform="translate(130 315)">
            <text x="0" y="0" fill="#334155" fontSize="12" fontWeight="700">
              Light Intensity
            </text>
            <rect x="0" y="10" width="150" height="9" rx="5" fill="#e2e8f0" />
            <motion.rect x="0" y="10" height="9" rx="5" fill="#eab308" animate={{ width: 150 * lightLevel }} />
          </g>
          <g transform="translate(315 315)">
            <text x="0" y="0" fill="#334155" fontSize="12" fontWeight="700">
              Resistance Drop
            </text>
            <rect x="0" y="10" width="150" height="9" rx="5" fill="#e2e8f0" />
            <motion.rect x="0" y="10" height="9" rx="5" fill="#22c55e" animate={{ width: 150 * (1 - clamp(resistance / 100000, 0, 1)) }} />
          </g>
          <g transform="translate(500 315)">
            <text x="0" y="0" fill="#334155" fontSize="12" fontWeight="700">
              Output Voltage
            </text>
            <rect x="0" y="10" width="150" height="9" rx="5" fill="#e2e8f0" />
            <motion.rect x="0" y="10" height="9" rx="5" fill="#8b5cf6" animate={{ width: 150 * clamp(outputVoltage / Math.max(voltage, 1), 0, 1) }} />
          </g>
        </svg>
      </div>
    </div>
  );
}
