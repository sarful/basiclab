"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, CSSProperties } from "react";

type Direction = "CW" | "CCW";

type DriveMode =
  | "WAVE"
  | "FULL"
  | "HALF"
  | "MICRO_4"
  | "MICRO_8"
  | "MICRO_16";

type FluxMode = "RESULTANT" | "PHASE_COMPONENTS";

type MotorStatus =
  | "HOLD"
  | "SETTLING"
  | "TRACKING"
  | "LAGGING"
  | "MISSED STEP"
  | "STALL"
  | "OVERHEAT"
  | "DRIVER OFF"
  | "THERMAL SHUTDOWN";

type PhaseState = {
  commandElectricalDeg: number;
  phaseANormalized: number;
  phaseBNormalized: number;
};

type PhysicsState = {
  pulseCount: number;
  pulseAccumulator: number;

  actualMechanicalRad: number;
  angularVelocityRadS: number;

  temperatureC: number;
  windingResistanceOhm: number;
  copperLossW: number;

  missedSteps: number;
  slipEventMaximumBucket: number;
  missFlashTimerS: number;
  stallTimerS: number;

  thermalTrip: boolean;

  lastFrameMs: number;
  lastTelemetryMs: number;
  lastChartSampleMs: number;
};

type Telemetry = {
  commandMechanicalDeg: number;
  actualMechanicalDeg: number;
  visualMechanicalDeg: number;

  commandElectricalDeg: number;
  actualElectricalDeg: number;

  phaseANormalized: number;
  phaseBNormalized: number;

  phaseAAmps: number;
  phaseBAmps: number;
  currentVectorAmps: number;

  commandedSpeedRpm: number;
  actualSpeedRpm: number;

  electromagneticTorqueNm: number;
  availableTorqueNm: number;

  selectedLoadCapacityNm: number;
  appliedLoadTorqueNm: number;

  mechanicalErrorDeg: number;
  electricalErrorDeg: number;

  temperatureC: number;
  windingResistanceOhm: number;
  copperLossW: number;

  missedSteps: number;
  status: MotorStatus;
  thermalTrip: boolean;
};

type ChartSample = {
  phaseAAmps: number;
  phaseBAmps: number;

  commandDeg: number;
  actualDeg: number;

  torqueNm: number;
  temperatureC: number;
};

type ChartSeries = {
  label: string;
  color: string;
  dash?: string;
  value: (sample: ChartSample) => number;
};

const VIEWBOX_WIDTH = 1080;
const VIEWBOX_HEIGHT = 745;

const CENTER_X = 500;
const CENTER_Y = 342;

const ROTOR_TOOTH_COUNT = 24;

/*
 * Effective phase-alignment markers:
 *
 * Phase A positions occur every 15°.
 * Phase B positions are offset from Phase A by 7.5°.
 */
const EFFECTIVE_STATOR_TOOTH_COUNT = 48;

const ROTOR_TOOTH_PITCH_DEG =
  360 / ROTOR_TOOTH_COUNT;

const EFFECTIVE_STATOR_PITCH_DEG =
  360 / EFFECTIVE_STATOR_TOOTH_COUNT;

/*
 * One 90° electrical change produces one 7.5°
 * mechanical full step.
 */
const BASE_FULL_STEP_DEG = 7.5;

const ELECTRICAL_TO_MECHANICAL_RATIO =
  90 / BASE_FULL_STEP_DEG;

/*
 * Educational lumped-parameter motor values.
 */
const TORQUE_CONSTANT_NM_PER_A = 0.11;
const ROTOR_INERTIA_KG_M2 = 0.0022;

const VISCOUS_DAMPING_NM_PER_RAD_S = 0.018;
const COULOMB_FRICTION_NM = 0.004;

const MAX_LOAD_CAPACITY_NM = 0.18;

const AMBIENT_TEMPERATURE_C = 25;
const WARNING_TEMPERATURE_C = 80;
const SHUTDOWN_TEMPERATURE_C = 110;

const BASE_WINDING_RESISTANCE_OHM = 2.8;
const COPPER_TEMPERATURE_COEFFICIENT = 0.00393;

const THERMAL_RESISTANCE_C_PER_W = 14;
const THERMAL_CAPACITANCE_J_PER_C = 10;

const TELEMETRY_INTERVAL_MS = 75;
const CHART_SAMPLE_INTERVAL_MS = 150;
const MAX_CHART_SAMPLES = 100;

function clamp(
  value: number,
  minimum: number,
  maximum: number,
) {
  return Math.min(
    maximum,
    Math.max(minimum, value),
  );
}

function degToRad(degrees: number) {
  return (degrees * Math.PI) / 180;
}

function radToDeg(radians: number) {
  return (radians * 180) / Math.PI;
}

function normalizeDegrees(degrees: number) {
  return ((degrees % 360) + 360) % 360;
}

function wrapRadians(radians: number) {
  return Math.atan2(
    Math.sin(radians),
    Math.cos(radians),
  );
}

function shortestDegreeDifference(
  targetDegrees: number,
  actualDegrees: number,
) {
  return (
    ((targetDegrees - actualDegrees + 540) % 360) -
    180
  );
}

function angularDistanceDegrees(
  angleA: number,
  angleB: number,
) {
  return Math.abs(
    shortestDegreeDifference(angleA, angleB),
  );
}

function positiveModulo(
  value: number,
  divisor: number,
) {
  return (
    ((value % divisor) + divisor) %
    divisor
  );
}

function polarPoint(
  centerX: number,
  centerY: number,
  radius: number,
  clockwiseDegrees: number,
) {
  const radians =
    degToRad(clockwiseDegrees);

  return {
    x:
      centerX +
      Math.sin(radians) * radius,

    y:
      centerY -
      Math.cos(radians) * radius,
  };
}

function electricalIncrementDeg(
  mode: DriveMode,
) {
  switch (mode) {
    case "WAVE":
    case "FULL":
      return 90;

    case "HALF":
      return 45;

    case "MICRO_4":
      return 22.5;

    case "MICRO_8":
      return 11.25;

    case "MICRO_16":
      return 5.625;
  }
}

function electricalOffsetDeg(
  mode: DriveMode,
) {
  /*
   * Two-phase-on full-step states occur at:
   * 45°, 135°, 225°, 315° electrical.
   */
  return mode === "FULL" ? 45 : 0;
}

function mechanicalStepDeg(
  mode: DriveMode,
) {
  return (
    electricalIncrementDeg(mode) /
    ELECTRICAL_TO_MECHANICAL_RATIO
  );
}

function driveModeLabel(
  mode: DriveMode,
) {
  switch (mode) {
    case "WAVE":
      return "Wave drive";

    case "FULL":
      return "Full step";

    case "HALF":
      return "Compensated half step";

    case "MICRO_4":
      return "1/4 microstep";

    case "MICRO_8":
      return "1/8 microstep";

    case "MICRO_16":
      return "1/16 microstep";
  }
}

function calculatePhaseState(
  mode: DriveMode,
  pulseCount: number,
): PhaseState {
  const commandElectricalDeg =
    electricalOffsetDeg(mode) +
    pulseCount *
      electricalIncrementDeg(mode);

  /*
   * Wave drive:
   * one phase is energized at a time.
   */
  if (mode === "WAVE") {
    const sequence = [
      {
        phaseANormalized: 1,
        phaseBNormalized: 0,
      },
      {
        phaseANormalized: 0,
        phaseBNormalized: 1,
      },
      {
        phaseANormalized: -1,
        phaseBNormalized: 0,
      },
      {
        phaseANormalized: 0,
        phaseBNormalized: -1,
      },
    ];

    return {
      commandElectricalDeg,
      ...sequence[
        positiveModulo(pulseCount, 4)
      ],
    };
  }

  /*
   * Full step:
   * both phases are energized at the selected
   * per-phase current.
   */
  if (mode === "FULL") {
    const sequence = [
      {
        phaseANormalized: 1,
        phaseBNormalized: 1,
      },
      {
        phaseANormalized: -1,
        phaseBNormalized: 1,
      },
      {
        phaseANormalized: -1,
        phaseBNormalized: -1,
      },
      {
        phaseANormalized: 1,
        phaseBNormalized: -1,
      },
    ];

    return {
      commandElectricalDeg,
      ...sequence[
        positiveModulo(pulseCount, 4)
      ],
    };
  }

  /*
   * Compensated half-step:
   *
   * Diagonal two-phase states use 0.707 current
   * in each phase, maintaining a unit-length
   * current vector and reducing torque ripple.
   */
  if (mode === "HALF") {
    const diagonal =
      1 / Math.sqrt(2);

    const sequence = [
      {
        phaseANormalized: 1,
        phaseBNormalized: 0,
      },
      {
        phaseANormalized: diagonal,
        phaseBNormalized: diagonal,
      },
      {
        phaseANormalized: 0,
        phaseBNormalized: 1,
      },
      {
        phaseANormalized: -diagonal,
        phaseBNormalized: diagonal,
      },
      {
        phaseANormalized: -1,
        phaseBNormalized: 0,
      },
      {
        phaseANormalized: -diagonal,
        phaseBNormalized: -diagonal,
      },
      {
        phaseANormalized: 0,
        phaseBNormalized: -1,
      },
      {
        phaseANormalized: diagonal,
        phaseBNormalized: -diagonal,
      },
    ];

    return {
      commandElectricalDeg,
      ...sequence[
        positiveModulo(pulseCount, 8)
      ],
    };
  }

  /*
   * Microstepping:
   *
   * IA = Imax cos(theta)
   * IB = Imax sin(theta)
   */
  const electricalAngleRad =
    degToRad(commandElectricalDeg);

  return {
    commandElectricalDeg,

    phaseANormalized:
      Math.cos(electricalAngleRad),

    phaseBNormalized:
      Math.sin(electricalAngleRad),
  };
}

function poleForCurrent(
  current: number,
  positiveCurrentPole: "N" | "S",
) {
  if (Math.abs(current) < 0.05) {
    return "–";
  }

  if (current > 0) {
    return positiveCurrentPole;
  }

  return positiveCurrentPole === "N"
    ? "S"
    : "N";
}

function oppositePole(pole: string) {
  if (pole === "N") return "S";
  if (pole === "S") return "N";

  return "–";
}

function statusClass(
  status: MotorStatus,
) {
  switch (status) {
    case "TRACKING":
      return [
        "border-emerald-200",
        "bg-emerald-50",
        "text-emerald-700",
      ].join(" ");

    case "SETTLING":
      return [
        "border-cyan-200",
        "bg-cyan-50",
        "text-cyan-700",
      ].join(" ");

    case "LAGGING":
      return [
        "border-amber-200",
        "bg-amber-50",
        "text-amber-700",
      ].join(" ");

    case "MISSED STEP":
      return [
        "border-orange-200",
        "bg-orange-50",
        "text-orange-700",
      ].join(" ");

    case "STALL":
      return [
        "border-red-200",
        "bg-red-50",
        "text-red-700",
      ].join(" ");

    case "OVERHEAT":
      return [
        "border-orange-300",
        "bg-orange-50",
        "text-orange-800",
      ].join(" ");

    case "DRIVER OFF":
      return [
        "border-slate-300",
        "bg-slate-100",
        "text-slate-600",
      ].join(" ");

    case "THERMAL SHUTDOWN":
      return [
        "border-red-300",
        "bg-red-50",
        "text-red-800",
      ].join(" ");

    default:
      return [
        "border-slate-200",
        "bg-slate-50",
        "text-slate-600",
      ].join(" ");
  }
}

function temperatureColor(
  temperatureC: number,
) {
  if (
    temperatureC >=
    SHUTDOWN_TEMPERATURE_C
  ) {
    return "#b91c1c";
  }

  if (
    temperatureC >=
    WARNING_TEMPERATURE_C
  ) {
    return "#ea580c";
  }

  if (temperatureC >= 55) {
    return "#d97706";
  }

  return "#16a34a";
}

function Toggle({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-left transition hover:bg-slate-50"
    >
      <span className="text-[11px] font-semibold text-slate-600">
        {label}
      </span>

      <span
        className={`relative h-5 w-9 rounded-full transition ${
          checked
            ? "bg-blue-600"
            : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${
            checked
              ? "left-[18px]"
              : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}

function Metric({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-2">
      <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-0.5 font-mono text-xs font-bold text-slate-800">
        {value}

        {unit && (
          <span className="ml-1 text-[9px] text-slate-400">
            {unit}
          </span>
        )}
      </p>
    </div>
  );
}

function PoleBadge({
  x,
  y,
  pole,
  active = true,
  small = false,
}: {
  x: number;
  y: number;
  pole: string;
  active?: boolean;
  small?: boolean;
}) {
  const radius =
    small ? 12 : 16;

  const fill =
    pole === "N"
      ? "#dc2626"
      : pole === "S"
        ? "#2563eb"
        : "#94a3b8";

  return (
    <g
      opacity={active ? 1 : 0.3}
      pointerEvents="none"
    >
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill={fill}
        stroke="#ffffff"
        strokeWidth={small ? 2 : 3}
        filter={
          active
            ? "url(#smallGlow)"
            : undefined
        }
      />

      <text
        x={x}
        y={y + (small ? 4 : 5.5)}
        textAnchor="middle"
        fontSize={small ? 12 : 16}
        fontWeight="900"
        fill="#ffffff"
      >
        {pole}
      </text>
    </g>
  );
}

function Callout({
  label,
  textX,
  textY,
  targetX,
  targetY,
}: {
  label: string;
  textX: number;
  textY: number;
  targetX: number;
  targetY: number;
}) {
  return (
    <g pointerEvents="none">
      <text
        x={textX}
        y={textY}
        fontSize="19"
        fontWeight="800"
        fill="#111827"
      >
        {label}
      </text>

      <line
        x1={textX + 3}
        y1={textY + 6}
        x2={targetX}
        y2={targetY}
        stroke="#111827"
        strokeWidth="2.3"
        strokeLinecap="round"
      />

      <circle
        cx={targetX}
        cy={targetY}
        r="5"
        fill="#111827"
        stroke="#ffffff"
        strokeWidth="2"
      />
    </g>
  );
}

function Coil({
  x,
  y,
  width,
  height,
  rotation = 0,
  phase,
  normalizedCurrent,
  currentAmps,
  animationRunning,
  animationSpeed,
  temperatureC,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  phase: "A" | "B";
  normalizedCurrent: number;
  currentAmps: number;
  animationRunning: boolean;
  animationSpeed: number;
  temperatureC: number;
}) {
  const active =
    Math.abs(normalizedCurrent) > 0.04;

  const intensity =
    Math.abs(normalizedCurrent);

  const accent =
    phase === "A"
      ? "#2563eb"
      : "#16a34a";

  const thermalTint =
    clamp(
      (temperatureC - 45) / 65,
      0,
      1,
    );

  const turns = 12;

  const animationStyle: CSSProperties = {
    animationDuration: `${Math.max(
      0.22,
      1.1 / animationSpeed,
    )}s`,

    animationDirection:
      normalizedCurrent < 0
        ? "reverse"
        : "normal",

    animationPlayState:
      animationRunning && active
        ? "running"
        : "paused",
  };

  return (
    <g
      transform={`rotate(${rotation} ${
        x + width / 2
      } ${y + height / 2})`}
    >
      {active && (
        <rect
          x={x - 13}
          y={y - 13}
          width={width + 26}
          height={height + 26}
          rx="18"
          fill={accent}
          opacity={
            0.06 +
            intensity * 0.1
          }
          filter="url(#coilGlow)"
        />
      )}

      <rect
        x={x - 16}
        y={y}
        width="25"
        height={height}
        rx="7"
        fill="url(#insulatorGradient)"
        stroke="#a89d89"
        strokeWidth="2"
      />

      <rect
        x={x + width - 9}
        y={y}
        width="25"
        height={height}
        rx="7"
        fill="url(#insulatorGradient)"
        stroke="#a89d89"
        strokeWidth="2"
      />

      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="9"
        fill="#6b260b"
        stroke="#431504"
        strokeWidth="2.4"
      />

      {Array.from({
        length: turns,
      }).map((_, index) => {
        const turnHeight =
          height / turns;

        const centerLineY =
          y +
          index * turnHeight +
          turnHeight / 2;

        return (
          <g key={index}>
            <rect
              x={x + 4}
              y={
                y +
                index * turnHeight +
                1
              }
              width={width - 8}
              height={Math.max(
                turnHeight - 2,
                2.5,
              )}
              rx="3"
              fill={
                active
                  ? "url(#activeCopperGradient)"
                  : "url(#copperGradient)"
              }
              stroke={
                active
                  ? "#ffd36a"
                  : "#762706"
              }
              strokeWidth={
                active ? 1.1 : 0.8
              }
            />

            {active && (
              <line
                x1={x + 8}
                y1={centerLineY}
                x2={x + width - 8}
                y2={centerLineY}
                stroke={accent}
                strokeWidth={
                  1.4 +
                  intensity * 1.7
                }
                strokeDasharray="7 10"
                strokeLinecap="round"
                className="coil-current-animation"
                style={animationStyle}
                opacity={
                  0.35 +
                  intensity * 0.65
                }
              />
            )}
          </g>
        );
      })}

      {thermalTint > 0 && (
        <rect
          x={x + 3}
          y={y + 3}
          width={width - 6}
          height={height - 6}
          rx="7"
          fill="#ef4444"
          opacity={thermalTint * 0.24}
          pointerEvents="none"
        />
      )}

      <rect
        x={x + 4}
        y={y + 4}
        width={width - 8}
        height={height - 8}
        rx="7"
        fill="none"
        stroke={accent}
        strokeWidth={
          active ? 3.3 : 1.4
        }
        opacity={
          active
            ? 0.45 +
              intensity * 0.5
            : 0.15
        }
      />

      {active && (
        <>
          <circle
            cx={x + 7}
            cy={y + height / 2}
            r="8.5"
            fill="#111827"
            stroke={accent}
            strokeWidth="2"
          />

          <text
            x={x + 7}
            y={y + height / 2 + 4}
            textAnchor="middle"
            fontSize="10"
            fontWeight="900"
            fill="#ffffff"
          >
            {normalizedCurrent > 0
              ? "+"
              : "−"}
          </text>

          <circle
            cx={x + width - 7}
            cy={y + height / 2}
            r="8.5"
            fill="#111827"
            stroke={accent}
            strokeWidth="2"
          />

          <text
            x={x + width - 7}
            y={y + height / 2 + 4}
            textAnchor="middle"
            fontSize="10"
            fontWeight="900"
            fill="#ffffff"
          >
            {normalizedCurrent > 0
              ? "−"
              : "+"}
          </text>
        </>
      )}

      <text
        x={x + width / 2}
        y={y + height + 18}
        textAnchor="middle"
        fontSize="11"
        fontWeight="800"
        fill={accent}
      >
        {phase}{" "}
        {currentAmps >= 0 ? "+" : ""}
        {currentAmps.toFixed(2)} A
      </text>
    </g>
  );
}

function buildChartPath(
  samples: ChartSample[],
  selector: (
    sample: ChartSample,
  ) => number,
  minimum: number,
  maximum: number,
  width: number,
  height: number,
  padding: number,
) {
  if (samples.length < 2) {
    return "";
  }

  const range =
    Math.max(
      maximum - minimum,
      0.0001,
    );

  return samples
    .map((sample, index) => {
      const x =
        padding +
        (
          index /
          Math.max(
            samples.length - 1,
            1,
          )
        ) *
          (
            width -
            padding * 2
          );

      const normalized =
        clamp(
          (
            selector(sample) -
            minimum
          ) / range,
          0,
          1,
        );

      const y =
        height -
        padding -
        normalized *
          (
            height -
            padding * 2
          );

      return `${
        index === 0 ? "M" : "L"
      } ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function MiniChart({
  title,
  subtitle,
  samples,
  series,
  fixedMinimum,
  fixedMaximum,
}: {
  title: string;
  subtitle: string;
  samples: ChartSample[];
  series: ChartSeries[];
  fixedMinimum?: number;
  fixedMaximum?: number;
}) {
  const width = 520;
  const height = 145;
  const padding = 24;

  const values =
    samples.flatMap(
      (sample) =>
        series.map(
          (item) =>
            item.value(sample),
        ),
    );

  let minimum =
    fixedMinimum ??
    (
      values.length
        ? Math.min(...values)
        : -1
    );

  let maximum =
    fixedMaximum ??
    (
      values.length
        ? Math.max(...values)
        : 1
    );

  if (
    Math.abs(maximum - minimum) <
    0.001
  ) {
    minimum -= 1;
    maximum += 1;
  }

  if (
    fixedMinimum === undefined ||
    fixedMaximum === undefined
  ) {
    const extra =
      (maximum - minimum) * 0.1;

    if (
      fixedMinimum === undefined
    ) {
      minimum -= extra;
    }

    if (
      fixedMaximum === undefined
    ) {
      maximum += extra;
    }
  }

  const zeroVisible =
    minimum <= 0 &&
    maximum >= 0;

  const zeroY =
    zeroVisible
      ? height -
        padding -
        (
          (0 - minimum) /
          (maximum - minimum)
        ) *
          (
            height -
            padding * 2
          )
      : null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-xs font-bold text-slate-800">
            {title}
          </h3>

          <p className="mt-0.5 text-[10px] text-slate-500">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {series.map((item) => (
            <span
              key={item.label}
              className="flex items-center gap-1 text-[9px] font-semibold text-slate-500"
            >
              <span
                className="h-0.5 w-4"
                style={{
                  backgroundColor:
                    item.color,
                }}
              />

              {item.label}
            </span>
          ))}
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mt-2 h-auto w-full"
        aria-label={title}
      >
        <rect
          width={width}
          height={height}
          rx="8"
          fill="#f8fafc"
        />

        {[0.25, 0.5, 0.75].map(
          (ratio) => (
            <line
              key={ratio}
              x1={padding}
              x2={width - padding}
              y1={
                padding +
                ratio *
                  (
                    height -
                    padding * 2
                  )
              }
              y2={
                padding +
                ratio *
                  (
                    height -
                    padding * 2
                  )
              }
              stroke="#e2e8f0"
            />
          ),
        )}

        {zeroY !== null && (
          <line
            x1={padding}
            x2={width - padding}
            y1={zeroY}
            y2={zeroY}
            stroke="#94a3b8"
            strokeDasharray="4 4"
          />
        )}

        {series.map((item) => (
          <path
            key={item.label}
            d={buildChartPath(
              samples,
              item.value,
              minimum,
              maximum,
              width,
              height,
              padding,
            )}
            fill="none"
            stroke={item.color}
            strokeWidth="2.4"
            strokeDasharray={
              item.dash
            }
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        <text
          x="6"
          y="16"
          fontSize="9"
          fill="#64748b"
        >
          {maximum.toFixed(1)}
        </text>

        <text
          x="6"
          y={height - 7}
          fontSize="9"
          fill="#64748b"
        >
          {minimum.toFixed(1)}
        </text>
      </svg>
    </div>
  );
}

export default function StepperMotorSimulation() {
  const initialDriveMode: DriveMode =
    "MICRO_8";

  const initialPhaseState =
    calculatePhaseState(
      initialDriveMode,
      0,
    );

  const initialMechanicalDeg =
    initialPhaseState.commandElectricalDeg /
    ELECTRICAL_TO_MECHANICAL_RATIO;

  const [
    pulsesRunning,
    setPulsesRunning,
  ] = useState(false);

  const [
    driverEnabled,
    setDriverEnabled,
  ] = useState(true);

  const [
    direction,
    setDirection,
  ] = useState<Direction>("CW");

  const [
    driveMode,
    setDriveMode,
  ] = useState<DriveMode>(
    initialDriveMode,
  );

  const [
    fluxMode,
    setFluxMode,
  ] = useState<FluxMode>(
    "RESULTANT",
  );

  const [
    pulseRate,
    setPulseRate,
  ] = useState(28);

  const [
    loadLevel,
    setLoadLevel,
  ] = useState(0.1);

  const [
    currentLimitA,
    setCurrentLimitA,
  ] = useState(1.2);

  const [
    showFlux,
    setShowFlux,
  ] = useState(true);

  const [
    showLabels,
    setShowLabels,
  ] = useState(true);

  const [
    showToothAlignment,
    setShowToothAlignment,
  ] = useState(true);

  const [
    showWaveforms,
    setShowWaveforms,
  ] = useState(true);

  const rotorMechanicalRef =
    useRef<SVGGElement | null>(null);

  const shaftKeyRef =
    useRef<SVGGElement | null>(null);

  const effectiveRotorPoleRef =
    useRef<SVGGElement | null>(null);

  const physicsRef =
    useRef<PhysicsState>({
      pulseCount: 0,
      pulseAccumulator: 0,

      actualMechanicalRad:
        degToRad(
          initialMechanicalDeg,
        ),

      angularVelocityRadS: 0,

      temperatureC:
        AMBIENT_TEMPERATURE_C,

      windingResistanceOhm:
        BASE_WINDING_RESISTANCE_OHM,

      copperLossW: 0,

      missedSteps: 0,
      slipEventMaximumBucket: 0,
      missFlashTimerS: 0,
      stallTimerS: 0,

      thermalTrip: false,

      lastFrameMs: 0,
      lastTelemetryMs: 0,
      lastChartSampleMs: 0,
    });

  const initialTelemetry: Telemetry = {
    commandMechanicalDeg:
      initialMechanicalDeg,

    actualMechanicalDeg:
      initialMechanicalDeg,

    visualMechanicalDeg:
      initialMechanicalDeg,

    commandElectricalDeg:
      initialPhaseState.commandElectricalDeg,

    actualElectricalDeg:
      initialMechanicalDeg *
      ELECTRICAL_TO_MECHANICAL_RATIO,

    phaseANormalized:
      initialPhaseState.phaseANormalized,

    phaseBNormalized:
      initialPhaseState.phaseBNormalized,

    phaseAAmps:
      initialPhaseState.phaseANormalized *
      currentLimitA,

    phaseBAmps:
      initialPhaseState.phaseBNormalized *
      currentLimitA,

    currentVectorAmps:
      Math.hypot(
        initialPhaseState.phaseANormalized *
          currentLimitA,

        initialPhaseState.phaseBNormalized *
          currentLimitA,
      ),

    commandedSpeedRpm: 0,
    actualSpeedRpm: 0,

    electromagneticTorqueNm: 0,
    availableTorqueNm: 0,

    selectedLoadCapacityNm:
      loadLevel *
      MAX_LOAD_CAPACITY_NM,

    appliedLoadTorqueNm: 0,

    mechanicalErrorDeg: 0,
    electricalErrorDeg: 0,

    temperatureC:
      AMBIENT_TEMPERATURE_C,

    windingResistanceOhm:
      BASE_WINDING_RESISTANCE_OHM,

    copperLossW: 0,

    missedSteps: 0,
    status: "HOLD",
    thermalTrip: false,
  };

  const [
    telemetry,
    setTelemetry,
  ] = useState<Telemetry>(
    initialTelemetry,
  );

  const chartSamplesRef =
    useRef<ChartSample[]>([]);

  const [
    chartSamples,
    setChartSamples,
  ] = useState<ChartSample[]>([]);

  const controlsRef = useRef({
    pulsesRunning,
    driverEnabled,
    direction,
    driveMode,
    pulseRate,
    loadLevel,
    currentLimitA,
  });

  controlsRef.current = {
    pulsesRunning,
    driverEnabled,
    direction,
    driveMode,
    pulseRate,
    loadLevel,
    currentLimitA,
  };

  function updateMechanicalVisuals(
    mechanicalDeg: number,
  ) {
    const rotorTransform =
      `rotate(${mechanicalDeg} ${CENTER_X} ${CENTER_Y})`;

    rotorMechanicalRef.current?.setAttribute(
      "transform",
      rotorTransform,
    );

    shaftKeyRef.current?.setAttribute(
      "transform",
      rotorTransform,
    );

    effectiveRotorPoleRef.current?.setAttribute(
      "transform",
      `rotate(${
        mechanicalDeg *
        ELECTRICAL_TO_MECHANICAL_RATIO
      } ${CENTER_X} ${CENTER_Y})`,
    );
  }

  function applyManualPulse(
    selectedDirection: Direction,
  ) {
    const physics =
      physicsRef.current;

    if (
      physics.thermalTrip ||
      !driverEnabled
    ) {
      return;
    }

    physics.pulseCount +=
      selectedDirection === "CW"
        ? 1
        : -1;
  }

  function resetMechanicalPosition() {
    const phase =
      calculatePhaseState(
        driveMode,
        0,
      );

    const mechanicalDeg =
      phase.commandElectricalDeg /
      ELECTRICAL_TO_MECHANICAL_RATIO;

    const physics =
      physicsRef.current;

    setPulsesRunning(false);

    physics.pulseCount = 0;
    physics.pulseAccumulator = 0;

    physics.actualMechanicalRad =
      degToRad(mechanicalDeg);

    physics.angularVelocityRadS = 0;

    physics.missedSteps = 0;
    physics.slipEventMaximumBucket = 0;
    physics.missFlashTimerS = 0;
    physics.stallTimerS = 0;

    chartSamplesRef.current = [];
    setChartSamples([]);

    updateMechanicalVisuals(
      mechanicalDeg,
    );
  }

  function powerCycleSimulation() {
    const phase =
      calculatePhaseState(
        driveMode,
        0,
      );

    const mechanicalDeg =
      phase.commandElectricalDeg /
      ELECTRICAL_TO_MECHANICAL_RATIO;

    setPulsesRunning(false);
    setDriverEnabled(true);

    physicsRef.current = {
      pulseCount: 0,
      pulseAccumulator: 0,

      actualMechanicalRad:
        degToRad(mechanicalDeg),

      angularVelocityRadS: 0,

      temperatureC:
        AMBIENT_TEMPERATURE_C,

      windingResistanceOhm:
        BASE_WINDING_RESISTANCE_OHM,

      copperLossW: 0,

      missedSteps: 0,
      slipEventMaximumBucket: 0,
      missFlashTimerS: 0,
      stallTimerS: 0,

      thermalTrip: false,

      lastFrameMs: 0,
      lastTelemetryMs: 0,
      lastChartSampleMs: 0,
    };

    chartSamplesRef.current = [];
    setChartSamples([]);

    updateMechanicalVisuals(
      mechanicalDeg,
    );
  }

  /*
   * Changing drive mode preserves the real rotor position.
   * The nearest valid command state in the new mode is used.
   */
  function changeDriveMode(
    nextMode: DriveMode,
  ) {
    setPulsesRunning(false);
    setDriveMode(nextMode);

    const physics =
      physicsRef.current;

    const actualMechanicalDeg =
      radToDeg(
        physics.actualMechanicalRad,
      );

    const actualElectricalDeg =
      actualMechanicalDeg *
      ELECTRICAL_TO_MECHANICAL_RATIO;

    const increment =
      electricalIncrementDeg(
        nextMode,
      );

    const offset =
      electricalOffsetDeg(
        nextMode,
      );

    physics.pulseCount =
      Math.round(
        (
          actualElectricalDeg -
          offset
        ) / increment,
      );

    physics.pulseAccumulator = 0;
    physics.slipEventMaximumBucket = 0;
    physics.missFlashTimerS = 0;
    physics.stallTimerS = 0;

    chartSamplesRef.current = [];
    setChartSamples([]);
  }

  function toggleDriver() {
    if (
      physicsRef.current.thermalTrip
    ) {
      return;
    }

    if (driverEnabled) {
      setPulsesRunning(false);
      setDriverEnabled(false);
    } else {
      setDriverEnabled(true);
    }
  }

  useEffect(() => {
    let animationFrameId = 0;

    physicsRef.current.lastFrameMs = 0;

    const simulate = (
      timestampMs: number,
    ) => {
      const physics =
        physicsRef.current;

      const controls =
        controlsRef.current;

      if (
        physics.lastFrameMs === 0
      ) {
        physics.lastFrameMs =
          timestampMs;
      }

      const deltaTimeS =
        clamp(
          (
            timestampMs -
            physics.lastFrameMs
          ) / 1000,
          0,
          0.025,
        );

      physics.lastFrameMs =
        timestampMs;

      const currentStepDeg =
        mechanicalStepDeg(
          controls.driveMode,
        );

      const directionSign =
        controls.direction === "CW"
          ? 1
          : -1;

      /*
       * Pulse generator
       */
      if (
        controls.pulsesRunning &&
        controls.driverEnabled &&
        !physics.thermalTrip
      ) {
        physics.pulseAccumulator +=
          deltaTimeS *
          controls.pulseRate;

        let pulseGuard = 0;

        while (
          physics.pulseAccumulator >=
            1 &&
          pulseGuard < 16
        ) {
          physics.pulseCount +=
            directionSign;

          physics.pulseAccumulator -=
            1;

          pulseGuard += 1;
        }
      }

      /*
       * Phase currents
       */
      const phase =
        calculatePhaseState(
          controls.driveMode,
          physics.pulseCount,
        );

      const commandElectricalRad =
        degToRad(
          phase.commandElectricalDeg,
        );

      const commandMechanicalRad =
        commandElectricalRad /
        ELECTRICAL_TO_MECHANICAL_RATIO;

      const outputsEnabled =
        controls.driverEnabled &&
        !physics.thermalTrip;

      const phaseAAmps =
        outputsEnabled
          ? phase.phaseANormalized *
            controls.currentLimitA
          : 0;

      const phaseBAmps =
        outputsEnabled
          ? phase.phaseBNormalized *
            controls.currentLimitA
          : 0;

      const currentVectorAmps =
        Math.hypot(
          phaseAAmps,
          phaseBAmps,
        );

      /*
       * Electrical angle and torque
       */
      const actualElectricalRad =
        physics.actualMechanicalRad *
        ELECTRICAL_TO_MECHANICAL_RATIO;

      const electricalErrorRad =
        wrapRadians(
          commandElectricalRad -
          actualElectricalRad,
        );

      const availableTorqueNm =
        TORQUE_CONSTANT_NM_PER_A *
        currentVectorAmps;

      const electromagneticTorqueNm =
        availableTorqueNm *
        Math.sin(
          electricalErrorRad,
        );

      /*
       * Passive load
       */
      const selectedLoadCapacityNm =
        controls.loadLevel *
        MAX_LOAD_CAPACITY_NM;

      const dampingTorqueNm =
        VISCOUS_DAMPING_NM_PER_RAD_S *
        physics.angularVelocityRadS;

      const driveAfterDampingNm =
        electromagneticTorqueNm -
        dampingTorqueNm;

      let appliedLoadTorqueNm = 0;

      if (
        Math.abs(
          physics.angularVelocityRadS,
        ) > 0.01
      ) {
        appliedLoadTorqueNm =
          selectedLoadCapacityNm *
          Math.sign(
            physics.angularVelocityRadS,
          );
      } else if (
        Math.abs(
          driveAfterDampingNm,
        ) > 0.0001
      ) {
        appliedLoadTorqueNm =
          clamp(
            driveAfterDampingNm,
            -selectedLoadCapacityNm,
            selectedLoadCapacityNm,
          );
      }

      /*
       * Friction
       */
      const torqueBeforeFrictionNm =
        electromagneticTorqueNm -
        dampingTorqueNm -
        appliedLoadTorqueNm;

      const frictionTorqueNm =
        Math.abs(
          physics.angularVelocityRadS,
        ) > 0.01
          ? COULOMB_FRICTION_NM *
            Math.sign(
              physics.angularVelocityRadS,
            )
          : clamp(
              torqueBeforeFrictionNm,
              -COULOMB_FRICTION_NM,
              COULOMB_FRICTION_NM,
            );

      const netTorqueNm =
        torqueBeforeFrictionNm -
        frictionTorqueNm;

      /*
       * Semi-implicit Euler integration
       */
      const angularAccelerationRadS2 =
        netTorqueNm /
        ROTOR_INERTIA_KG_M2;

      physics.angularVelocityRadS +=
        angularAccelerationRadS2 *
        deltaTimeS;

      physics.angularVelocityRadS =
        clamp(
          physics.angularVelocityRadS,
          -40,
          40,
        );

      physics.actualMechanicalRad +=
        physics.angularVelocityRadS *
        deltaTimeS;

      const mechanicalErrorRad =
        commandMechanicalRad -
        physics.actualMechanicalRad;

      const mechanicalErrorDeg =
        radToDeg(
          mechanicalErrorRad,
        );

      const absoluteMechanicalErrorDeg =
        Math.abs(
          mechanicalErrorDeg,
        );

      /*
       * Missed-step detection with hysteresis
       */
      if (
        absoluteMechanicalErrorDeg <
        BASE_FULL_STEP_DEG * 0.35
      ) {
        physics.slipEventMaximumBucket =
          0;
      } else if (
        controls.pulsesRunning &&
        controls.driverEnabled &&
        !physics.thermalTrip
      ) {
        const slipBucket =
          Math.floor(
            absoluteMechanicalErrorDeg /
            BASE_FULL_STEP_DEG,
          );

        if (
          slipBucket >
          physics.slipEventMaximumBucket
        ) {
          physics.missedSteps +=
            slipBucket -
            physics.slipEventMaximumBucket;

          physics.slipEventMaximumBucket =
            slipBucket;

          physics.missFlashTimerS =
            0.5;
        }
      }

      physics.missFlashTimerS =
        Math.max(
          0,
          physics.missFlashTimerS -
            deltaTimeS,
        );

      /*
       * Stall detection
       */
      const commandedAngularVelocityRadS =
        controls.pulsesRunning &&
        controls.driverEnabled &&
        !physics.thermalTrip
          ? directionSign *
            controls.pulseRate *
            degToRad(currentStepDeg)
          : 0;

      const stalledCandidate =
        Math.abs(
          commandedAngularVelocityRadS,
        ) > 0.1 &&
        absoluteMechanicalErrorDeg >
          BASE_FULL_STEP_DEG * 2.5 &&
        Math.abs(
          physics.angularVelocityRadS,
        ) <
          Math.max(
            0.16,
            Math.abs(
              commandedAngularVelocityRadS,
            ) * 0.12,
          );

      if (stalledCandidate) {
        physics.stallTimerS +=
          deltaTimeS;
      } else {
        physics.stallTimerS =
          Math.max(
            0,
            physics.stallTimerS -
              deltaTimeS * 2,
          );
      }

      const stalled =
        physics.stallTimerS >= 0.6;

      /*
       * Temperature-dependent winding resistance
       */
      physics.windingResistanceOhm =
        BASE_WINDING_RESISTANCE_OHM *
        (
          1 +
          COPPER_TEMPERATURE_COEFFICIENT *
            (
              physics.temperatureC -
              AMBIENT_TEMPERATURE_C
            )
        );

      physics.copperLossW =
        physics.windingResistanceOhm *
        (
          phaseAAmps *
            phaseAAmps +
          phaseBAmps *
            phaseBAmps
        );

      /*
       * First-order thermal model
       */
      const coolingPowerW =
        (
          physics.temperatureC -
          AMBIENT_TEMPERATURE_C
        ) /
        THERMAL_RESISTANCE_C_PER_W;

      const temperatureRateCPerS =
        (
          physics.copperLossW -
          coolingPowerW
        ) /
        THERMAL_CAPACITANCE_J_PER_C;

      physics.temperatureC +=
        temperatureRateCPerS *
        deltaTimeS;

      physics.temperatureC =
        clamp(
          physics.temperatureC,
          AMBIENT_TEMPERATURE_C,
          140,
        );

      /*
       * Latched thermal shutdown
       */
      if (
        !physics.thermalTrip &&
        physics.temperatureC >=
          SHUTDOWN_TEMPERATURE_C
      ) {
        physics.thermalTrip = true;

        controlsRef.current.pulsesRunning =
          false;

        controlsRef.current.driverEnabled =
          false;

        setPulsesRunning(false);
        setDriverEnabled(false);
      }

      /*
       * Motor status
       */
      let status: MotorStatus =
        "HOLD";

      const lagThresholdDeg =
        Math.max(
          currentStepDeg * 1.5,
          BASE_FULL_STEP_DEG * 0.2,
        );

      if (physics.thermalTrip) {
        status =
          "THERMAL SHUTDOWN";
      } else if (stalled) {
        status = "STALL";
      } else if (
        physics.missFlashTimerS > 0
      ) {
        status = "MISSED STEP";
      } else if (
        physics.temperatureC >=
        WARNING_TEMPERATURE_C
      ) {
        status = "OVERHEAT";
      } else if (
        !controls.driverEnabled
      ) {
        status = "DRIVER OFF";
      } else if (
        controls.pulsesRunning &&
        absoluteMechanicalErrorDeg >
          lagThresholdDeg
      ) {
        status = "LAGGING";
      } else if (
        controls.pulsesRunning
      ) {
        status = "TRACKING";
      } else if (
        Math.abs(
          physics.angularVelocityRadS,
        ) > 0.03
      ) {
        status = "SETTLING";
      }

      const actualMechanicalDeg =
        radToDeg(
          physics.actualMechanicalRad,
        );

      /*
       * Stall vibration is visual only.
       */
      const visualMechanicalDeg =
        actualMechanicalDeg +
        (
          stalled
            ? Math.sin(
                timestampMs *
                  0.045,
              ) * 0.45
            : 0
        );

      updateMechanicalVisuals(
        visualMechanicalDeg,
      );

      /*
       * Rebase very large angles after long runs.
       */
      const mechanicalTurns =
        Math.trunc(
          physics.actualMechanicalRad /
          (
            Math.PI *
            2
          ),
        );

      if (
        Math.abs(mechanicalTurns) >
        1000
      ) {
        const mechanicalOffsetRad =
          mechanicalTurns *
          Math.PI *
          2;

        physics.actualMechanicalRad -=
          mechanicalOffsetRad;

        const pulseOffset =
          Math.round(
            (
              radToDeg(
                mechanicalOffsetRad,
              ) *
              ELECTRICAL_TO_MECHANICAL_RATIO
            ) /
            electricalIncrementDeg(
              controls.driveMode,
            ),
          );

        physics.pulseCount -=
          pulseOffset;
      }

      /*
       * Chart sampling
       */
      if (
        timestampMs -
          physics.lastChartSampleMs >=
        CHART_SAMPLE_INTERVAL_MS
      ) {
        physics.lastChartSampleMs =
          timestampMs;

        const nextSamples = [
          ...chartSamplesRef.current,
          {
            phaseAAmps,
            phaseBAmps,

            commandDeg:
              radToDeg(
                commandMechanicalRad,
              ),

            actualDeg:
              actualMechanicalDeg,

            torqueNm:
              electromagneticTorqueNm,

            temperatureC:
              physics.temperatureC,
          },
        ].slice(-MAX_CHART_SAMPLES);

        chartSamplesRef.current =
          nextSamples;

        setChartSamples(
          nextSamples,
        );
      }

      /*
       * React telemetry update
       */
      if (
        timestampMs -
          physics.lastTelemetryMs >=
        TELEMETRY_INTERVAL_MS
      ) {
        physics.lastTelemetryMs =
          timestampMs;

        const trippedNow =
          physics.thermalTrip;

        setTelemetry({
          commandMechanicalDeg:
            radToDeg(
              commandMechanicalRad,
            ),

          actualMechanicalDeg,

          visualMechanicalDeg,

          commandElectricalDeg:
            phase.commandElectricalDeg,

          actualElectricalDeg:
            radToDeg(
              actualElectricalRad,
            ),

          phaseANormalized:
            outputsEnabled &&
            !trippedNow
              ? phase.phaseANormalized
              : 0,

          phaseBNormalized:
            outputsEnabled &&
            !trippedNow
              ? phase.phaseBNormalized
              : 0,

          phaseAAmps:
            trippedNow
              ? 0
              : phaseAAmps,

          phaseBAmps:
            trippedNow
              ? 0
              : phaseBAmps,

          currentVectorAmps:
            trippedNow
              ? 0
              : currentVectorAmps,

          commandedSpeedRpm:
            (
              commandedAngularVelocityRadS *
              60
            ) /
            (
              Math.PI *
              2
            ),

          actualSpeedRpm:
            (
              physics.angularVelocityRadS *
              60
            ) /
            (
              Math.PI *
              2
            ),

          electromagneticTorqueNm:
            trippedNow
              ? 0
              : electromagneticTorqueNm,

          availableTorqueNm:
            trippedNow
              ? 0
              : availableTorqueNm,

          selectedLoadCapacityNm,

          appliedLoadTorqueNm,

          mechanicalErrorDeg,

          electricalErrorDeg:
            radToDeg(
              electricalErrorRad,
            ),

          temperatureC:
            physics.temperatureC,

          windingResistanceOhm:
            physics.windingResistanceOhm,

          copperLossW:
            trippedNow
              ? 0
              : physics.copperLossW,

          missedSteps:
            physics.missedSteps,

          status,

          thermalTrip:
            trippedNow,
        });
      }

      animationFrameId =
        requestAnimationFrame(
          simulate,
        );
    };

    animationFrameId =
      requestAnimationFrame(
        simulate,
      );

    return () => {
      cancelAnimationFrame(
        animationFrameId,
      );
    };
  }, []);

  const normalizedActualMechanicalDeg =
    normalizeDegrees(
      telemetry.actualMechanicalDeg,
    );

  const normalizedCommandMechanicalDeg =
    normalizeDegrees(
      telemetry.commandMechanicalDeg,
    );

  const normalizedFieldElectricalDeg =
    normalizeDegrees(
      telemetry.commandElectricalDeg,
    );

  const normalizedRotorElectricalDeg =
    normalizeDegrees(
      telemetry.actualElectricalDeg,
    );

  const topPole =
    poleForCurrent(
      telemetry.phaseANormalized,
      "S",
    );

  const bottomPole =
    oppositePole(topPole);

  const rightPole =
    poleForCurrent(
      telemetry.phaseBNormalized,
      "S",
    );

  const leftPole =
    oppositePole(rightPole);

  const statorResultantSouth =
    polarPoint(
      CENTER_X,
      CENTER_Y,
      184,
      normalizedFieldElectricalDeg,
    );

  const statorResultantNorth =
    polarPoint(
      CENTER_X,
      CENTER_Y,
      184,
      normalizedFieldElectricalDeg +
        180,
    );

  const rotorEffectiveNorth =
    polarPoint(
      CENTER_X,
      CENTER_Y,
      116,
      normalizedRotorElectricalDeg,
    );

  const rotorEffectiveSouth =
    polarPoint(
      CENTER_X,
      CENTER_Y,
      116,
      normalizedRotorElectricalDeg +
        180,
    );

  const fieldActive =
    telemetry.currentVectorAmps > 0.03;

  const resultantFluxClockwise = `
    M
      ${statorResultantNorth.x}
      ${statorResultantNorth.y}

    C
      ${
        (
          statorResultantNorth.x +
          rotorEffectiveSouth.x
        ) /
          2 +
        28
      }

      ${
        (
          statorResultantNorth.y +
          rotorEffectiveSouth.y
        ) / 2
      }

      ${
        rotorEffectiveSouth.x +
        20
      }

      ${rotorEffectiveSouth.y}

      ${rotorEffectiveSouth.x}

      ${rotorEffectiveSouth.y}

    Q
      ${CENTER_X}
      ${CENTER_Y}

      ${rotorEffectiveNorth.x}
      ${rotorEffectiveNorth.y}

    C
      ${
        rotorEffectiveNorth.x +
        20
      }

      ${rotorEffectiveNorth.y}

      ${
        (
          rotorEffectiveNorth.x +
          statorResultantSouth.x
        ) /
          2 +
        28
      }

      ${
        (
          rotorEffectiveNorth.y +
          statorResultantSouth.y
        ) / 2
      }

      ${statorResultantSouth.x}

      ${statorResultantSouth.y}

    A
      184
      184
      0
      0
      1

      ${statorResultantNorth.x}

      ${statorResultantNorth.y}
  `;

  const resultantFluxCounterClockwise = `
    M
      ${statorResultantNorth.x}
      ${statorResultantNorth.y}

    C
      ${
        (
          statorResultantNorth.x +
          rotorEffectiveSouth.x
        ) /
          2 -
        28
      }

      ${
        (
          statorResultantNorth.y +
          rotorEffectiveSouth.y
        ) / 2
      }

      ${
        rotorEffectiveSouth.x -
        20
      }

      ${rotorEffectiveSouth.y}

      ${rotorEffectiveSouth.x}

      ${rotorEffectiveSouth.y}

    Q
      ${CENTER_X}
      ${CENTER_Y}

      ${rotorEffectiveNorth.x}

      ${rotorEffectiveNorth.y}

    C
      ${
        rotorEffectiveNorth.x -
        20
      }

      ${rotorEffectiveNorth.y}

      ${
        (
          rotorEffectiveNorth.x +
          statorResultantSouth.x
        ) /
          2 -
        28
      }

      ${
        (
          rotorEffectiveNorth.y +
          statorResultantSouth.y
        ) / 2
      }

      ${statorResultantSouth.x}

      ${statorResultantSouth.y}

    A
      184
      184
      0
      0
      0

      ${statorResultantNorth.x}

      ${statorResultantNorth.y}
  `;

  const phaseAFluxPath = `
    M
      ${CENTER_X}
      ${CENTER_Y - 173}

    C
      ${CENTER_X + 178}
      ${CENTER_Y - 135}

      ${CENTER_X + 178}
      ${CENTER_Y + 135}

      ${CENTER_X}
      ${CENTER_Y + 173}

    C
      ${CENTER_X - 178}
      ${CENTER_Y + 135}

      ${CENTER_X - 178}
      ${CENTER_Y - 135}

      ${CENTER_X}
      ${CENTER_Y - 173}
  `;

  const phaseBFluxPath = `
    M
      ${CENTER_X + 173}
      ${CENTER_Y}

    C
      ${CENTER_X + 135}
      ${CENTER_Y + 178}

      ${CENTER_X - 135}
      ${CENTER_Y + 178}

      ${CENTER_X - 173}
      ${CENTER_Y}

    C
      ${CENTER_X - 135}
      ${CENTER_Y - 178}

      ${CENTER_X + 135}
      ${CENTER_Y - 178}

      ${CENTER_X + 173}
      ${CENTER_Y}
  `;

  /*
   * Flux remains present and animated during hold
   * because the coils remain energized when step
   * pulses are paused.
   */
  const fluxAnimationStyle: CSSProperties = {
    animationDuration: `${Math.max(
      0.35,
      1.5 /
        Math.max(
          pulseRate / 14,
          0.5,
        ),
    )}s`,

    animationPlayState:
      driverEnabled &&
      !telemetry.thermalTrip
        ? "running"
        : "paused",
  };

  const phaseAFluxStyle: CSSProperties = {
    ...fluxAnimationStyle,

    animationDirection:
      telemetry.phaseAAmps < 0
        ? "reverse"
        : "normal",
  };

  const phaseBFluxStyle: CSSProperties = {
    ...fluxAnimationStyle,

    animationDirection:
      telemetry.phaseBAmps < 0
        ? "reverse"
        : "normal",
  };

  const temperaturePercent =
    clamp(
      (
        (
          telemetry.temperatureC -
          AMBIENT_TEMPERATURE_C
        ) /
        (
          SHUTDOWN_TEMPERATURE_C -
          AMBIENT_TEMPERATURE_C
        )
      ) *
        100,
      0,
      100,
    );

  const currentMechanicalStepDeg =
    mechanicalStepDeg(driveMode);

  const currentChartSeries =
    useMemo<ChartSeries[]>(
      () => [
        {
          label: "Phase A",
          color: "#2563eb",
          value: (sample) =>
            sample.phaseAAmps,
        },
        {
          label: "Phase B",
          color: "#16a34a",
          value: (sample) =>
            sample.phaseBAmps,
        },
      ],
      [],
    );

  const positionChartSeries =
    useMemo<ChartSeries[]>(
      () => [
        {
          label: "Commanded",
          color: "#f97316",
          dash: "7 5",
          value: (sample) =>
            sample.commandDeg,
        },
        {
          label: "Actual",
          color: "#2563eb",
          value: (sample) =>
            sample.actualDeg,
        },
      ],
      [],
    );

  return (
    <main className="min-h-screen bg-white p-3 text-slate-900 sm:p-5">
      <style>{`
        @keyframes coilCurrentFlow {
          from {
            stroke-dashoffset: 0;
          }

          to {
            stroke-dashoffset: -34;
          }
        }

        @keyframes magneticFluxFlow {
          from {
            stroke-dashoffset: 0;
          }

          to {
            stroke-dashoffset: -58;
          }
        }

        @keyframes toothPulse {
          0%,
          100% {
            opacity: 0.68;
          }

          50% {
            opacity: 1;
          }
        }

        .coil-current-animation {
          animation-name: coilCurrentFlow;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .flux-animation {
          animation-name: magneticFluxFlow;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .tooth-pulse {
          animation:
            toothPulse
            0.9s
            ease-in-out
            infinite;
        }
      `}</style>

      <section className="mx-auto max-w-[1580px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.12)]">
        <header className="flex flex-col gap-3 border-b border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
              Interactive electromechanical simulation
            </p>

            <h1 className="mt-1 text-xl font-black tracking-tight sm:text-2xl">
              Physics-Based Hybrid Stepper Motor
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Logical wave, full-step, compensated half-step
              and sine/cosine microstep drive
            </p>
          </div>

          <div
            className={`rounded-lg border px-3 py-2 text-xs font-black ${statusClass(
              telemetry.status,
            )}`}
          >
            {telemetry.status}
          </div>
        </header>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <div className="overflow-auto bg-white">
              <svg
                viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
                role="img"
                aria-label="Physics-based interactive hybrid stepper motor"
                className="block h-auto min-w-[830px] w-full"
              >
                <defs>
                  <linearGradient
                    id="housingGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#ffffff"
                    />

                    <stop
                      offset="30%"
                      stopColor="#dddddd"
                    />

                    <stop
                      offset="62%"
                      stopColor="#a7a7a7"
                    />

                    <stop
                      offset="84%"
                      stopColor="#ededed"
                    />

                    <stop
                      offset="100%"
                      stopColor="#929292"
                    />
                  </linearGradient>

                  <linearGradient
                    id="darkMetalGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#707070"
                    />

                    <stop
                      offset="30%"
                      stopColor="#323232"
                    />

                    <stop
                      offset="70%"
                      stopColor="#151515"
                    />

                    <stop
                      offset="100%"
                      stopColor="#565656"
                    />
                  </linearGradient>

                  <linearGradient
                    id="rotorGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#858585"
                    />

                    <stop
                      offset="35%"
                      stopColor="#4d4d4d"
                    />

                    <stop
                      offset="72%"
                      stopColor="#252525"
                    />

                    <stop
                      offset="100%"
                      stopColor="#707070"
                    />
                  </linearGradient>

                  <linearGradient
                    id="toothGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#f4f4f4"
                    />

                    <stop
                      offset="40%"
                      stopColor="#a6a6a6"
                    />

                    <stop
                      offset="75%"
                      stopColor="#5b5b5b"
                    />

                    <stop
                      offset="100%"
                      stopColor="#dadada"
                    />
                  </linearGradient>

                  <linearGradient
                    id="shaftGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#ffffff"
                    />

                    <stop
                      offset="20%"
                      stopColor="#8a8a8a"
                    />

                    <stop
                      offset="45%"
                      stopColor="#eeeeee"
                    />

                    <stop
                      offset="72%"
                      stopColor="#666666"
                    />

                    <stop
                      offset="100%"
                      stopColor="#fafafa"
                    />
                  </linearGradient>

                  <linearGradient
                    id="copperGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#ffb257"
                    />

                    <stop
                      offset="30%"
                      stopColor="#a53e0d"
                    />

                    <stop
                      offset="55%"
                      stopColor="#f47c1d"
                    />

                    <stop
                      offset="80%"
                      stopColor="#712206"
                    />

                    <stop
                      offset="100%"
                      stopColor="#d85d10"
                    />
                  </linearGradient>

                  <linearGradient
                    id="activeCopperGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#fff0a3"
                    />

                    <stop
                      offset="20%"
                      stopColor="#ffb035"
                    />

                    <stop
                      offset="50%"
                      stopColor="#ff6f0f"
                    />

                    <stop
                      offset="78%"
                      stopColor="#af3306"
                    />

                    <stop
                      offset="100%"
                      stopColor="#ffc54d"
                    />
                  </linearGradient>

                  <linearGradient
                    id="insulatorGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#fffdf4"
                    />

                    <stop
                      offset="55%"
                      stopColor="#d8d0bf"
                    />

                    <stop
                      offset="100%"
                      stopColor="#988c78"
                    />
                  </linearGradient>

                  <linearGradient
                    id="resultantFluxGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#ef4444"
                    />

                    <stop
                      offset="48%"
                      stopColor="#a855f7"
                    />

                    <stop
                      offset="100%"
                      stopColor="#2563eb"
                    />
                  </linearGradient>

                  <radialGradient id="bearingGradient">
                    <stop
                      offset="0%"
                      stopColor="#ffffff"
                    />

                    <stop
                      offset="42%"
                      stopColor="#b4b4b4"
                    />

                    <stop
                      offset="73%"
                      stopColor="#414141"
                    />

                    <stop
                      offset="100%"
                      stopColor="#dddddd"
                    />
                  </radialGradient>

                  <radialGradient id="shaftFaceGradient">
                    <stop
                      offset="0%"
                      stopColor="#f8fafc"
                    />

                    <stop
                      offset="38%"
                      stopColor="#b8b8b8"
                    />

                    <stop
                      offset="72%"
                      stopColor="#666666"
                    />

                    <stop
                      offset="100%"
                      stopColor="#eeeeee"
                    />
                  </radialGradient>

                  <filter
                    id="motorShadow"
                    x="-30%"
                    y="-30%"
                    width="170%"
                    height="180%"
                  >
                    <feDropShadow
                      dx="8"
                      dy="13"
                      stdDeviation="13"
                      floodColor="#000000"
                      floodOpacity="0.2"
                    />
                  </filter>

                  <filter
                    id="coilGlow"
                    x="-70%"
                    y="-70%"
                    width="240%"
                    height="240%"
                  >
                    <feGaussianBlur stdDeviation="12" />
                  </filter>

                  <filter
                    id="fluxGlow"
                    x="-70%"
                    y="-70%"
                    width="240%"
                    height="240%"
                  >
                    <feGaussianBlur stdDeviation="5" />
                  </filter>

                  <filter
                    id="smallGlow"
                    x="-100%"
                    y="-100%"
                    width="300%"
                    height="300%"
                  >
                    <feGaussianBlur
                      stdDeviation="3"
                      result="blur"
                    />

                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  <marker
                    id="fluxArrow"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="4.5"
                    markerHeight="4.5"
                    orient="auto"
                  >
                    <path
                      d="M 0 0 L 10 5 L 0 10 Z"
                      fill="#2563eb"
                    />
                  </marker>
                </defs>

                <rect
                  width={VIEWBOX_WIDTH}
                  height={VIEWBOX_HEIGHT}
                  fill="#ffffff"
                />

                <ellipse
                  cx="555"
                  cy="666"
                  rx="300"
                  ry="28"
                  fill="#000000"
                  opacity="0.07"
                />

                {/* Rear motor depth */}
                <path
                  d="
                    M 300 65
                    L 750 65
                    Q 795 67 821 100
                    L 862 151
                    L 862 558
                    Q 858 610 812 640
                    L 775 660
                    L 300 660
                    Z
                  "
                  fill="url(#darkMetalGradient)"
                  stroke="#454545"
                  strokeWidth="5"
                />

                {Array.from({
                  length: 17,
                }).map((_, index) => (
                  <line
                    key={index}
                    x1={326 + index * 26}
                    y1="66"
                    x2={358 + index * 26}
                    y2="104"
                    stroke="#111111"
                    strokeWidth="1.7"
                    opacity="0.4"
                  />
                ))}

                {/* Front housing */}
                <g filter="url(#motorShadow)">
                  <path
                    d="
                      M 268 93
                      Q 242 93 226 117
                      L 190 157
                      L 190 550
                      Q 190 606 241 637
                      L 704 637
                      Q 785 633 812 574
                      L 812 166
                      Q 808 118 767 98
                      Z
                    "
                    fill="url(#housingGradient)"
                    stroke="#767676"
                    strokeWidth="5"
                  />

                  <path
                    d="
                      M 287 151
                      Q 314 127 358 127
                      L 674 127
                      Q 730 127 757 155
                      L 757 547
                      Q 735 594 684 599
                      L 353 599
                      Q 305 596 278 565
                      L 278 190
                      Q 278 166 287 151
                    "
                    fill="#1e1e1e"
                    stroke="#707070"
                    strokeWidth="6"
                  />
                </g>

                {/* Mounting holes */}
                {[
                  [244, 158],
                  [730, 158],
                  [244, 571],
                  [730, 571],
                ].map(([x, y]) => (
                  <g key={`${x}-${y}`}>
                    <circle
                      cx={x}
                      cy={y}
                      r="27"
                      fill="#bdbdbd"
                      stroke="#737373"
                      strokeWidth="3"
                    />

                    <circle
                      cx={x}
                      cy={y}
                      r="15"
                      fill="#171717"
                    />

                    <circle
                      cx={x - 5}
                      cy={y - 6}
                      r="5.5"
                      fill="#5a5a5a"
                    />
                  </g>
                ))}

                {/* Stator */}
                <circle
                  cx={CENTER_X}
                  cy={CENTER_Y}
                  r="217"
                  fill="none"
                  stroke="#8d8d8d"
                  strokeWidth="70"
                />

                <circle
                  cx={CENTER_X}
                  cy={CENTER_Y}
                  r="217"
                  fill="none"
                  stroke="#383838"
                  strokeWidth="53"
                />

                {Array.from({
                  length: 68,
                }).map((_, index) => (
                  <line
                    key={index}
                    x1={CENTER_X}
                    y1={CENTER_Y - 252}
                    x2={CENTER_X}
                    y2={CENTER_Y - 205}
                    stroke="#a2a2a2"
                    strokeWidth="1.35"
                    opacity="0.36"
                    transform={`rotate(${
                      index *
                      (360 / 68)
                    } ${CENTER_X} ${CENTER_Y})`}
                  />
                ))}

                {/* Four main pole shoes */}
                {[0, 90, 180, 270].map(
                  (rotation) => {
                    const belongsToPhaseA =
                      rotation === 0 ||
                      rotation === 180;

                    const normalizedCurrent =
                      belongsToPhaseA
                        ? telemetry.phaseANormalized
                        : telemetry.phaseBNormalized;

                    const active =
                      Math.abs(
                        normalizedCurrent,
                      ) > 0.04;

                    return (
                      <g
                        key={rotation}
                        transform={`rotate(${rotation} ${CENTER_X} ${CENTER_Y})`}
                      >
                        <path
                          d={`
                            M
                              ${CENTER_X - 72}
                              ${CENTER_Y - 232}

                            L
                              ${CENTER_X + 72}
                              ${CENTER_Y - 232}

                            L
                              ${CENTER_X + 59}
                              ${CENTER_Y - 177}

                            Q
                              ${CENTER_X}
                              ${CENTER_Y - 156}

                              ${CENTER_X - 59}
                              ${CENTER_Y - 177}

                            Z
                          `}
                          fill="url(#housingGradient)"
                          stroke={
                            active
                              ? belongsToPhaseA
                                ? "#2563eb"
                                : "#16a34a"
                              : "#555555"
                          }
                          strokeWidth={
                            active
                              ? 4.3
                              : 3.4
                          }
                        />
                      </g>
                    );
                  },
                )}

                {/* Effective phase-alignment markers */}
                {Array.from({
                  length:
                    EFFECTIVE_STATOR_TOOTH_COUNT,
                }).map((_, index) => {
                  const toothAngle =
                    index *
                    EFFECTIVE_STATOR_PITCH_DEG;

                  const toothPhase =
                    index % 2 === 0
                      ? "A"
                      : "B";

                  const phaseMagnitude =
                    toothPhase === "A"
                      ? Math.abs(
                          telemetry.phaseANormalized,
                        )
                      : Math.abs(
                          telemetry.phaseBNormalized,
                        );

                  const commandAxis =
                    normalizeDegrees(
                      telemetry.commandMechanicalDeg,
                    );

                  /*
                   * Up to 7.5° is used so adjacent Phase A
                   * and Phase B contributions can both be
                   * shown during full-step and microstepping.
                   */
                  const nearCommandAxis =
                    Math.min(
                      angularDistanceDegrees(
                        toothAngle,
                        commandAxis,
                      ),

                      angularDistanceDegrees(
                        toothAngle,
                        commandAxis + 180,
                      ),
                    ) <= 7.6;

                  const activeTooth =
                    showToothAlignment &&
                    phaseMagnitude > 0.05 &&
                    nearCommandAxis;

                  return (
                    <rect
                      key={index}
                      x={CENTER_X - 4.5}
                      y={CENTER_Y - 184}
                      width="9"
                      height="27"
                      rx="2"
                      fill={
                        activeTooth
                          ? toothPhase === "A"
                            ? "#67e8f9"
                            : "#86efac"
                          : "url(#toothGradient)"
                      }
                      stroke={
                        activeTooth
                          ? toothPhase === "A"
                            ? "#0891b2"
                            : "#15803d"
                          : "#505050"
                      }
                      strokeWidth={
                        activeTooth
                          ? 2.5
                          : 1.5
                      }
                      opacity={
                        activeTooth
                          ? 0.75 +
                            phaseMagnitude * 0.25
                          : 1
                      }
                      filter={
                        activeTooth
                          ? "url(#smallGlow)"
                          : undefined
                      }
                      className={
                        activeTooth
                          ? "tooth-pulse"
                          : undefined
                      }
                      transform={`rotate(${toothAngle} ${CENTER_X} ${CENTER_Y})`}
                    />
                  );
                })}

                {/* Coils */}
                <Coil
                  x={451}
                  y={104}
                  width={98}
                  height={75}
                  phase="A"
                  normalizedCurrent={
                    telemetry.phaseANormalized
                  }
                  currentAmps={
                    telemetry.phaseAAmps
                  }
                  animationRunning={
                    driverEnabled &&
                    !telemetry.thermalTrip
                  }
                  animationSpeed={Math.max(
                    pulseRate / 18,
                    0.5,
                  )}
                  temperatureC={
                    telemetry.temperatureC
                  }
                />

                <Coil
                  x={451}
                  y={491}
                  width={98}
                  height={75}
                  phase="A"
                  normalizedCurrent={
                    telemetry.phaseANormalized
                  }
                  currentAmps={
                    telemetry.phaseAAmps
                  }
                  animationRunning={
                    driverEnabled &&
                    !telemetry.thermalTrip
                  }
                  animationSpeed={Math.max(
                    pulseRate / 18,
                    0.5,
                  )}
                  temperatureC={
                    telemetry.temperatureC
                  }
                />

                <Coil
                  x={261}
                  y={305}
                  width={98}
                  height={75}
                  rotation={90}
                  phase="B"
                  normalizedCurrent={
                    telemetry.phaseBNormalized
                  }
                  currentAmps={
                    telemetry.phaseBAmps
                  }
                  animationRunning={
                    driverEnabled &&
                    !telemetry.thermalTrip
                  }
                  animationSpeed={Math.max(
                    pulseRate / 18,
                    0.5,
                  )}
                  temperatureC={
                    telemetry.temperatureC
                  }
                />

                <Coil
                  x={641}
                  y={305}
                  width={98}
                  height={75}
                  rotation={90}
                  phase="B"
                  normalizedCurrent={
                    telemetry.phaseBNormalized
                  }
                  currentAmps={
                    telemetry.phaseBAmps
                  }
                  animationRunning={
                    driverEnabled &&
                    !telemetry.thermalTrip
                  }
                  animationSpeed={Math.max(
                    pulseRate / 18,
                    0.5,
                  )}
                  temperatureC={
                    telemetry.temperatureC
                  }
                />

                {/* Stator N/S switching */}
                <PoleBadge
                  x={CENTER_X}
                  y={181}
                  pole={topPole}
                  active={topPole !== "–"}
                />

                <PoleBadge
                  x={CENTER_X}
                  y={503}
                  pole={bottomPole}
                  active={bottomPole !== "–"}
                />

                <PoleBadge
                  x={661}
                  y={CENTER_Y}
                  pole={rightPole}
                  active={rightPole !== "–"}
                />

                <PoleBadge
                  x={339}
                  y={CENTER_Y}
                  pole={leftPole}
                  active={leftPole !== "–"}
                />

                {/* Magnetic flux */}
                {showFlux &&
                  fieldActive &&
                  !telemetry.thermalTrip && (
                    <g pointerEvents="none">
                      {fluxMode ===
                      "RESULTANT" ? (
                        <>
                          <path
                            d={resultantFluxClockwise}
                            fill="none"
                            stroke="#a855f7"
                            strokeWidth="16"
                            opacity="0.09"
                            filter="url(#fluxGlow)"
                          />

                          <path
                            d={
                              resultantFluxCounterClockwise
                            }
                            fill="none"
                            stroke="#a855f7"
                            strokeWidth="16"
                            opacity="0.09"
                            filter="url(#fluxGlow)"
                          />

                          <path
                            d={resultantFluxClockwise}
                            fill="none"
                            stroke="url(#resultantFluxGradient)"
                            strokeWidth="4.5"
                            strokeDasharray="15 10"
                            strokeLinecap="round"
                            markerEnd="url(#fluxArrow)"
                            className="flux-animation"
                            style={
                              fluxAnimationStyle
                            }
                          />

                          <path
                            d={
                              resultantFluxCounterClockwise
                            }
                            fill="none"
                            stroke="url(#resultantFluxGradient)"
                            strokeWidth="4.5"
                            strokeDasharray="15 10"
                            strokeLinecap="round"
                            markerEnd="url(#fluxArrow)"
                            className="flux-animation"
                            style={{
                              ...fluxAnimationStyle,
                              animationDelay:
                                "-0.65s",
                            }}
                          />

                          <PoleBadge
                            x={
                              statorResultantNorth.x
                            }
                            y={
                              statorResultantNorth.y
                            }
                            pole="N"
                            small
                          />

                          <PoleBadge
                            x={
                              statorResultantSouth.x
                            }
                            y={
                              statorResultantSouth.y
                            }
                            pole="S"
                            small
                          />
                        </>
                      ) : (
                        <>
                          {Math.abs(
                            telemetry.phaseAAmps,
                          ) > 0.03 && (
                            <>
                              <path
                                d={phaseAFluxPath}
                                fill="none"
                                stroke="#2563eb"
                                strokeWidth={
                                  14 *
                                  Math.min(
                                    1,
                                    Math.abs(
                                      telemetry.phaseAAmps,
                                    ) /
                                      Math.max(
                                        currentLimitA,
                                        0.1,
                                      ),
                                  )
                                }
                                opacity="0.08"
                                filter="url(#fluxGlow)"
                              />

                              <path
                                d={phaseAFluxPath}
                                fill="none"
                                stroke="#2563eb"
                                strokeWidth={
                                  2.5 +
                                  3 *
                                    Math.min(
                                      1,
                                      Math.abs(
                                        telemetry.phaseAAmps,
                                      ) /
                                        Math.max(
                                          currentLimitA,
                                          0.1,
                                        ),
                                    )
                                }
                                strokeDasharray="14 10"
                                strokeLinecap="round"
                                className="flux-animation"
                                style={
                                  phaseAFluxStyle
                                }
                              />
                            </>
                          )}

                          {Math.abs(
                            telemetry.phaseBAmps,
                          ) > 0.03 && (
                            <>
                              <path
                                d={phaseBFluxPath}
                                fill="none"
                                stroke="#16a34a"
                                strokeWidth={
                                  14 *
                                  Math.min(
                                    1,
                                    Math.abs(
                                      telemetry.phaseBAmps,
                                    ) /
                                      Math.max(
                                        currentLimitA,
                                        0.1,
                                      ),
                                  )
                                }
                                opacity="0.08"
                                filter="url(#fluxGlow)"
                              />

                              <path
                                d={phaseBFluxPath}
                                fill="none"
                                stroke="#16a34a"
                                strokeWidth={
                                  2.5 +
                                  3 *
                                    Math.min(
                                      1,
                                      Math.abs(
                                        telemetry.phaseBAmps,
                                      ) /
                                        Math.max(
                                          currentLimitA,
                                          0.1,
                                        ),
                                    )
                                }
                                strokeDasharray="14 10"
                                strokeLinecap="round"
                                className="flux-animation"
                                style={
                                  phaseBFluxStyle
                                }
                              />
                            </>
                          )}

                          {/* Resultant field vector */}
                          <g
                            transform={`rotate(${normalizedFieldElectricalDeg} ${CENTER_X} ${CENTER_Y})`}
                          >
                            <line
                              x1={CENTER_X}
                              y1={CENTER_Y + 22}
                              x2={CENTER_X}
                              y2={CENTER_Y - 112}
                              stroke="#7c3aed"
                              strokeWidth="7"
                              strokeLinecap="round"
                            />

                            <path
                              d={`
                                M
                                  ${CENTER_X}
                                  ${CENTER_Y - 128}

                                L
                                  ${CENTER_X - 10}
                                  ${CENTER_Y - 108}

                                L
                                  ${CENTER_X + 10}
                                  ${CENTER_Y - 108}

                                Z
                              `}
                              fill="#7c3aed"
                            />
                          </g>
                        </>
                      )}
                    </g>
                  )}

                {/* Mechanical rotor */}
                <g ref={rotorMechanicalRef}>
                  <circle
                    cx={CENTER_X}
                    cy={CENTER_Y}
                    r="150"
                    fill="url(#rotorGradient)"
                    stroke="#202020"
                    strokeWidth="6"
                  />

                  {Array.from({
                    length:
                      ROTOR_TOOTH_COUNT,
                  }).map((_, index) => {
                    const localAngle =
                      index *
                      ROTOR_TOOTH_PITCH_DEG;

                    const worldAngle =
                      normalizeDegrees(
                        localAngle +
                          normalizedActualMechanicalDeg,
                      );

                    const commandAxis =
                      normalizeDegrees(
                        telemetry.commandMechanicalDeg,
                      );

                    /*
                     * Alignment is measured against the
                     * resultant commanded equilibrium,
                     * including midpoint positions used by
                     * full-step and microstepping.
                     */
                    const resultantAlignmentError =
                      Math.min(
                        angularDistanceDegrees(
                          worldAngle,
                          commandAxis,
                        ),

                        angularDistanceDegrees(
                          worldAngle,
                          commandAxis + 180,
                        ),
                      );

                    const aligned =
                      showToothAlignment &&
                      resultantAlignmentError <= 1.3;

                    const approaching =
                      showToothAlignment &&
                      resultantAlignmentError > 1.3 &&
                      resultantAlignmentError <= 3.8;

                    return (
                      <path
                        key={index}
                        d={`
                          M
                            ${CENTER_X - 9}
                            ${CENTER_Y - 179}

                          L
                            ${CENTER_X + 9}
                            ${CENTER_Y - 179}

                          L
                            ${CENTER_X + 14}
                            ${CENTER_Y - 150}

                          L
                            ${CENTER_X - 14}
                            ${CENTER_Y - 150}

                          Z
                        `}
                        fill={
                          aligned
                            ? "#fde047"
                            : approaching
                              ? "#fb923c"
                              : "url(#toothGradient)"
                        }
                        stroke={
                          aligned
                            ? "#a16207"
                            : approaching
                              ? "#c2410c"
                              : "#484848"
                        }
                        strokeWidth={
                          aligned ? 3 : 2
                        }
                        filter={
                          aligned
                            ? "url(#smallGlow)"
                            : undefined
                        }
                        className={
                          aligned
                            ? "tooth-pulse"
                            : undefined
                        }
                        transform={`rotate(${localAngle} ${CENTER_X} ${CENTER_Y})`}
                      />
                    );
                  })}

                  {/* Actual mechanical position marker */}
                  <path
                    d={`
                      M
                        ${CENTER_X}
                        ${CENTER_Y - 168}

                      L
                        ${CENTER_X - 8}
                        ${CENTER_Y - 182}

                      L
                        ${CENTER_X + 8}
                        ${CENTER_Y - 182}

                      Z
                    `}
                    fill="#2563eb"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </g>

                {/* Effective rotor electrical poles */}
                <g ref={effectiveRotorPoleRef}>
                  <PoleBadge
                    x={CENTER_X}
                    y={CENTER_Y - 116}
                    pole="N"
                  />

                  <PoleBadge
                    x={CENTER_X}
                    y={CENTER_Y + 116}
                    pole="S"
                  />
                </g>

                {/* Bearing */}
                <circle
                  cx={CENTER_X}
                  cy={CENTER_Y}
                  r="77"
                  fill="#272727"
                  stroke="#c8c8c8"
                  strokeWidth="9"
                />

                <circle
                  cx={CENTER_X}
                  cy={CENTER_Y}
                  r="57"
                  fill="#565656"
                  stroke="#222222"
                  strokeWidth="5"
                />

                {Array.from({
                  length: 13,
                }).map((_, index) => {
                  const angle =
                    (
                      index / 13
                    ) *
                    Math.PI *
                    2;

                  return (
                    <circle
                      key={index}
                      cx={
                        CENTER_X +
                        Math.cos(angle) *
                          67
                      }
                      cy={
                        CENTER_Y +
                        Math.sin(angle) *
                          67
                      }
                      r="8"
                      fill="url(#bearingGradient)"
                      stroke="#3c3c3c"
                      strokeWidth="1.4"
                    />
                  );
                })}

                {/* Front-facing shaft */}
                <circle
                  cx={CENTER_X}
                  cy={CENTER_Y}
                  r="51"
                  fill="url(#shaftFaceGradient)"
                  stroke="#505050"
                  strokeWidth="5"
                />

                <circle
                  cx={CENTER_X}
                  cy={CENTER_Y}
                  r="35"
                  fill="url(#shaftGradient)"
                  stroke="#777777"
                  strokeWidth="3"
                />

                {/* Only the shaft key rotates */}
                <g ref={shaftKeyRef}>
                  <rect
                    x={CENTER_X - 5}
                    y={CENTER_Y - 34}
                    width="10"
                    height="22"
                    rx="3"
                    fill="#252525"
                  />

                  <circle
                    cx={CENTER_X}
                    cy={CENTER_Y}
                    r="6.5"
                    fill="#191919"
                    stroke="#eeeeee"
                    strokeWidth="2"
                  />
                </g>

                {/* Commanded mechanical marker */}
                <g
                  transform={`rotate(${telemetry.commandMechanicalDeg} ${CENTER_X} ${CENTER_Y})`}
                >
                  <path
                    d={`
                      M
                        ${CENTER_X}
                        ${CENTER_Y - 198}

                      L
                        ${CENTER_X - 9}
                        ${CENTER_Y - 214}

                      L
                        ${CENTER_X + 9}
                        ${CENTER_Y - 214}

                      Z
                    `}
                    fill="#f97316"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />

                  {showLabels && (
                    <text
                      x={CENTER_X}
                      y={CENTER_Y - 220}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="900"
                      fill="#f97316"
                    >
                      CMD
                    </text>
                  )}
                </g>

                {/* Labels */}
                <g
                  opacity={
                    showLabels ? 1 : 0
                  }
                  style={{
                    transition:
                      "opacity 200ms ease",
                  }}
                >
                  <Callout
                    label="Stator"
                    textX={28}
                    textY={125}
                    targetX={322}
                    targetY={195}
                  />

                  <Callout
                    label="Coil"
                    textX={30}
                    textY={206}
                    targetX={310}
                    targetY={342}
                  />

                  <Callout
                    label="Rotor"
                    textX={30}
                    textY={444}
                    targetX={396}
                    targetY={387}
                  />

                  <Callout
                    label="Bearing"
                    textX={30}
                    textY={520}
                    targetX={447}
                    targetY={394}
                  />

                  <Callout
                    label="Shaft"
                    textX={30}
                    textY={594}
                    targetX={500}
                    targetY={342}
                  />
                </g>

                {/* Position card */}
                <g transform="translate(790 423)">
                  <rect
                    width="245"
                    height="134"
                    rx="12"
                    fill="#ffffff"
                    stroke="#cbd5e1"
                    strokeWidth="2"
                  />

                  <text
                    x="14"
                    y="22"
                    fontSize="10"
                    fontWeight="800"
                    fill="#64748b"
                  >
                    POSITION TRACKING
                  </text>

                  <text
                    x="14"
                    y="47"
                    fontSize="12"
                    fontWeight="700"
                    fill="#f97316"
                  >
                    Commanded
                  </text>

                  <text
                    x="230"
                    y="47"
                    textAnchor="end"
                    fontSize="12"
                    fontWeight="900"
                    fill="#f97316"
                  >
                    {normalizedCommandMechanicalDeg.toFixed(
                      2,
                    )}
                    °
                  </text>

                  <text
                    x="14"
                    y="69"
                    fontSize="12"
                    fontWeight="700"
                    fill="#2563eb"
                  >
                    Actual
                  </text>

                  <text
                    x="230"
                    y="69"
                    textAnchor="end"
                    fontSize="12"
                    fontWeight="900"
                    fill="#2563eb"
                  >
                    {normalizedActualMechanicalDeg.toFixed(
                      2,
                    )}
                    °
                  </text>

                  <text
                    x="14"
                    y="91"
                    fontSize="12"
                    fontWeight="700"
                    fill="#7c3aed"
                  >
                    Mechanical error
                  </text>

                  <text
                    x="230"
                    y="91"
                    textAnchor="end"
                    fontSize="12"
                    fontWeight="900"
                    fill="#7c3aed"
                  >
                    {telemetry.mechanicalErrorDeg.toFixed(
                      2,
                    )}
                    °
                  </text>

                  <text
                    x="14"
                    y="113"
                    fontSize="11"
                    fontWeight="700"
                    fill="#64748b"
                  >
                    Electrical error
                  </text>

                  <text
                    x="230"
                    y="113"
                    textAnchor="end"
                    fontSize="11"
                    fontWeight="900"
                    fill="#64748b"
                  >
                    {telemetry.electricalErrorDeg.toFixed(
                      1,
                    )}
                    °
                  </text>

                  <text
                    x="14"
                    y="128"
                    fontSize="9"
                    fill="#94a3b8"
                  >
                    Electrical : mechanical ratio = 12 : 1
                  </text>
                </g>

                {/* Alignment legend */}
                <g transform="translate(790 580)">
                  <rect
                    width="245"
                    height="94"
                    rx="12"
                    fill="#ffffff"
                    stroke="#cbd5e1"
                    strokeWidth="2"
                  />

                  <circle
                    cx="18"
                    cy="21"
                    r="6"
                    fill="#67e8f9"
                  />

                  <text
                    x="32"
                    y="25"
                    fontSize="10"
                    fill="#475569"
                  >
                    Active Phase A alignment
                  </text>

                  <circle
                    cx="18"
                    cy="46"
                    r="6"
                    fill="#86efac"
                  />

                  <text
                    x="32"
                    y="50"
                    fontSize="10"
                    fill="#475569"
                  >
                    Active Phase B alignment
                  </text>

                  <circle
                    cx="18"
                    cy="71"
                    r="6"
                    fill="#fde047"
                  />

                  <text
                    x="32"
                    y="75"
                    fontSize="10"
                    fill="#475569"
                  >
                    Rotor at resultant equilibrium
                  </text>
                </g>
              </svg>
            </div>

            {/* Waveforms */}
            {showWaveforms && (
              <div className="grid gap-3 border-t border-slate-200 bg-slate-50 p-3 xl:grid-cols-2">
                <MiniChart
                  title="Phase-current waveforms"
                  subtitle="Compensated half-step and sine/cosine microstep currents"
                  samples={chartSamples}
                  series={currentChartSeries}
                  fixedMinimum={
                    -Math.max(
                      currentLimitA,
                      0.5,
                    )
                  }
                  fixedMaximum={Math.max(
                    currentLimitA,
                    0.5,
                  )}
                />

                <MiniChart
                  title="Commanded versus actual position"
                  subtitle="A growing gap indicates lag or loss of synchronism"
                  samples={chartSamples}
                  series={positionChartSeries}
                />
              </div>
            )}
          </div>

          {/* Control panel */}
          <aside className="border-t border-slate-200 bg-slate-50 p-4 lg:border-l lg:border-t-0">
            <div className="sticky top-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Ideal current-regulated driver
                  </p>

                  <h2 className="mt-0.5 text-sm font-black">
                    Control Panel
                  </h2>
                </div>

                <span
                  className={`h-3 w-3 rounded-full ${
                    telemetry.thermalTrip
                      ? "bg-red-500 shadow-[0_0_10px_#ef4444]"
                      : driverEnabled
                        ? pulsesRunning
                          ? "animate-pulse bg-emerald-500 shadow-[0_0_10px_#22c55e]"
                          : "bg-blue-500"
                        : "bg-slate-300"
                  }`}
                />
              </div>

              <button
                type="button"
                disabled={
                  telemetry.thermalTrip ||
                  !driverEnabled
                }
                onClick={() =>
                  setPulsesRunning(
                    (previous) =>
                      !previous,
                  )
                }
                className={`w-full rounded-lg px-3 py-2.5 text-xs font-bold text-white transition disabled:cursor-not-allowed disabled:bg-slate-400 ${
                  pulsesRunning
                    ? "bg-rose-600 hover:bg-rose-500"
                    : "bg-blue-600 hover:bg-blue-500"
                }`}
              >
                {telemetry.thermalTrip
                  ? "Thermal Trip"
                  : !driverEnabled
                    ? "Enable Driver First"
                    : pulsesRunning
                      ? "Pause Step Pulses"
                      : "Start Step Pulses"}
              </button>

              <button
                type="button"
                disabled={
                  telemetry.thermalTrip
                }
                onClick={toggleDriver}
                className={`w-full rounded-lg border px-3 py-2 text-[11px] font-bold transition ${
                  driverEnabled
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    : "border-slate-300 bg-white text-slate-600 hover:bg-slate-100"
                } disabled:cursor-not-allowed disabled:opacity-40`}
              >
                Driver outputs:{" "}
                {driverEnabled
                  ? "ENABLED"
                  : "DISABLED"}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={
                    pulsesRunning ||
                    telemetry.thermalTrip ||
                    !driverEnabled
                  }
                  onClick={() =>
                    applyManualPulse("CCW")
                  }
                  className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-[10px] font-bold text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  − Manual step
                </button>

                <button
                  type="button"
                  disabled={
                    pulsesRunning ||
                    telemetry.thermalTrip ||
                    !driverEnabled
                  }
                  onClick={() =>
                    applyManualPulse("CW")
                  }
                  className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-[10px] font-bold text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  + Manual step
                </button>

                <button
                  type="button"
                  onClick={
                    resetMechanicalPosition
                  }
                  className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-[10px] font-bold text-slate-600 hover:bg-slate-100"
                >
                  Reset position
                </button>

                <button
                  type="button"
                  onClick={
                    powerCycleSimulation
                  }
                  className="rounded-lg border border-red-200 bg-red-50 px-2 py-2 text-[10px] font-bold text-red-700 hover:bg-red-100"
                >
                  Power cycle
                </button>
              </div>

              <div>
                <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Direction
                </p>

                <div className="grid grid-cols-2 rounded-lg border border-slate-200 bg-white p-1">
                  <button
                    type="button"
                    onClick={() =>
                      setDirection("CW")
                    }
                    className={`rounded-md px-2 py-2 text-[10px] font-bold ${
                      direction === "CW"
                        ? "bg-blue-600 text-white"
                        : "text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    Clockwise
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setDirection("CCW")
                    }
                    className={`rounded-md px-2 py-2 text-[10px] font-bold ${
                      direction === "CCW"
                        ? "bg-blue-600 text-white"
                        : "text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    Reverse
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="drive-mode"
                  className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400"
                >
                  Drive mode
                </label>

                <select
                  id="drive-mode"
                  value={driveMode}
                  onChange={(
                    event: ChangeEvent<HTMLSelectElement>,
                  ) =>
                    changeDriveMode(
                      event.target
                        .value as DriveMode,
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-blue-500"
                >
                  <option value="WAVE">
                    Wave drive
                  </option>

                  <option value="FULL">
                    Full step — two phases on
                  </option>

                  <option value="HALF">
                    Compensated half step
                  </option>

                  <option value="MICRO_4">
                    1/4 microstep
                  </option>

                  <option value="MICRO_8">
                    1/8 microstep
                  </option>

                  <option value="MICRO_16">
                    1/16 microstep
                  </option>
                </select>

                <p className="mt-1 text-[9px] text-slate-400">
                  {driveModeLabel(
                    driveMode,
                  )}{" "}
                  ·{" "}
                  {currentMechanicalStepDeg.toFixed(
                    4,
                  )}
                  ° mechanical per pulse
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Pulse frequency
                    </label>

                    <span className="font-mono text-[10px] font-bold text-blue-600">
                      {pulseRate} pulse/s
                    </span>
                  </div>

                  <input
                    type="range"
                    min="1"
                    max="120"
                    step="1"
                    value={pulseRate}
                    onChange={(
                      event: ChangeEvent<HTMLInputElement>,
                    ) =>
                      setPulseRate(
                        Number(
                          event.target.value,
                        ),
                      )
                    }
                    className="w-full accent-blue-600"
                  />
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Per-phase current
                    </label>

                    <span className="font-mono text-[10px] font-bold text-blue-600">
                      {currentLimitA.toFixed(
                        1,
                      )}{" "}
                      A
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0.4"
                    max="2"
                    step="0.1"
                    value={currentLimitA}
                    onChange={(
                      event: ChangeEvent<HTMLInputElement>,
                    ) =>
                      setCurrentLimitA(
                        Number(
                          event.target.value,
                        ),
                      )
                    }
                    className="w-full accent-blue-600"
                  />
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Brake-load capacity
                    </label>

                    <span className="font-mono text-[10px] font-bold text-red-600">
                      {(
                        loadLevel * 100
                      ).toFixed(0)}
                      %
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={loadLevel}
                    onChange={(
                      event: ChangeEvent<HTMLInputElement>,
                    ) =>
                      setLoadLevel(
                        Number(
                          event.target.value,
                        ),
                      )
                    }
                    className="w-full accent-red-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="flux-mode"
                  className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400"
                >
                  Flux visualization
                </label>

                <select
                  id="flux-mode"
                  value={fluxMode}
                  onChange={(
                    event: ChangeEvent<HTMLSelectElement>,
                  ) =>
                    setFluxMode(
                      event.target
                        .value as FluxMode,
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-blue-500"
                >
                  <option value="RESULTANT">
                    Resultant N → S circuit
                  </option>

                  <option value="PHASE_COMPONENTS">
                    Phase A/B components
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <Toggle
                  checked={showFlux}
                  label="Animated magnetic flux"
                  onChange={() =>
                    setShowFlux(
                      (value) => !value,
                    )
                  }
                />

                <Toggle
                  checked={
                    showToothAlignment
                  }
                  label="Tooth alignment"
                  onChange={() =>
                    setShowToothAlignment(
                      (value) => !value,
                    )
                  }
                />

                <Toggle
                  checked={showLabels}
                  label="Component labels"
                  onChange={() =>
                    setShowLabels(
                      (value) => !value,
                    )
                  }
                />

                <Toggle
                  checked={showWaveforms}
                  label="Live waveforms"
                  onChange={() =>
                    setShowWaveforms(
                      (value) => !value,
                    )
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Metric
                  label="Command angle"
                  value={normalizedCommandMechanicalDeg.toFixed(
                    2,
                  )}
                  unit="°"
                />

                <Metric
                  label="Actual angle"
                  value={normalizedActualMechanicalDeg.toFixed(
                    2,
                  )}
                  unit="°"
                />

                <Metric
                  label="Position error"
                  value={telemetry.mechanicalErrorDeg.toFixed(
                    2,
                  )}
                  unit="°"
                />

                <Metric
                  label="Actual speed"
                  value={telemetry.actualSpeedRpm.toFixed(
                    1,
                  )}
                  unit="rpm"
                />

                <Metric
                  label="Command speed"
                  value={telemetry.commandedSpeedRpm.toFixed(
                    1,
                  )}
                  unit="rpm"
                />

                <Metric
                  label="Motor torque"
                  value={telemetry.electromagneticTorqueNm.toFixed(
                    3,
                  )}
                  unit="N·m"
                />

                <Metric
                  label="Available torque"
                  value={telemetry.availableTorqueNm.toFixed(
                    3,
                  )}
                  unit="N·m"
                />

                <Metric
                  label="Load capacity"
                  value={telemetry.selectedLoadCapacityNm.toFixed(
                    3,
                  )}
                  unit="N·m"
                />

                <Metric
                  label="Applied load"
                  value={Math.abs(
                    telemetry.appliedLoadTorqueNm,
                  ).toFixed(3)}
                  unit="N·m"
                />

                <Metric
                  label="Missed steps"
                  value={String(
                    telemetry.missedSteps,
                  )}
                />

                <Metric
                  label="Current vector"
                  value={telemetry.currentVectorAmps.toFixed(
                    2,
                  )}
                  unit="A"
                />

                <Metric
                  label="Copper loss"
                  value={telemetry.copperLossW.toFixed(
                    2,
                  )}
                  unit="W"
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Coil temperature
                    </p>

                    <p
                      className="mt-1 font-mono text-lg font-black"
                      style={{
                        color:
                          temperatureColor(
                            telemetry.temperatureC,
                          ),
                      }}
                    >
                      {telemetry.temperatureC.toFixed(
                        1,
                      )}
                      °C
                    </p>
                  </div>

                  <div className="text-right text-[9px] text-slate-400">
                    <p>
                      R ={" "}
                      {telemetry.windingResistanceOhm.toFixed(
                        2,
                      )}
                      Ω
                    </p>

                    <p className="mt-1">
                      Trip at{" "}
                      {SHUTDOWN_TEMPERATURE_C}
                      °C
                    </p>
                  </div>
                </div>

                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full transition-[width]"
                    style={{
                      width: `${temperaturePercent}%`,

                      backgroundColor:
                        temperatureColor(
                          telemetry.temperatureC,
                        ),
                    }}
                  />
                </div>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-[9px] leading-4 text-blue-800">
                Full step energizes both phases at the
                selected per-phase current, so its current
                vector and available holding torque are
                approximately √2 times wave drive.
                Compensated half-step and microstepping
                maintain an approximately constant current
                vector.
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}