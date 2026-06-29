"use client";

import React, { useEffect, useMemo, useState } from "react";

type InputKey = "A" | "B" | "C";
type InputState = Record<InputKey, boolean>;
type SimulationStep = 1 | 2 | 3 | 4;

type BooleanLawId =
  | "basic"
  | "identity"
  | "null"
  | "idempotent"
  | "complement"
  | "demorganAnd"
  | "demorganOr"
  | "absorption"
  | "distributive"
  | "nandUniversal"
  | "norUniversal";

type PresetType =
  | "allOff"
  | "allOn"
  | "alt101"
  | "alt010"
  | "onlyA"
  | "onlyB"
  | "onlyC"
  | "random";

type XY = { x: number; y: number };

type LawInfo = {
  id: BooleanLawId;
  title: string;
  formula: string;
  simplified: string;
  rule: string;
  q: boolean;
  usedKeys: readonly InputKey[];
  explanation: string;
};

type WaveformSample = {
  inputs: InputState;
  q: boolean;
};

type WireProps = {
  d?: string;
  from?: XY;
  to?: XY;
  active?: boolean;
};

type CurrentDotProps = {
  path: string;
  active: boolean;
  speed: number;
  size: number;
  count: number;
};

type ControlButtonProps = {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  onClick: () => void;
};

type InputTerminalProps = {
  inputKey: InputKey;
  x: number;
  y: number;
  active: boolean;
  highlighted: boolean;
  interactive: boolean;
  showValue: boolean;
  onToggle: (key: InputKey) => void;
};

export type AndFunctionDiagramProps = Omit<
  React.SVGProps<SVGSVGElement>,
  "viewBox"
> & {
  initialInputs?: Partial<Record<InputKey, boolean>>;
  initialLaw?: BooleanLawId;
  interactive?: boolean;
  showControls?: boolean;
  showTruthValues?: boolean;
  showCurrentDots?: boolean;
  showTruthTable?: boolean;
  animationSpeed?: number;
  autoRun?: boolean;
  currentDotCount?: number;
  currentDotSize?: number;
  currentDotSpeed?: number;
  enableStepMode?: boolean;
  showFormulaPanel?: boolean;
  showWaveform?: boolean;
  showDebugTerminals?: boolean;
};

/* -------------------------------------------------------
   Architecture constants
------------------------------------------------------- */

const INPUT_KEYS: readonly InputKey[] = ["A", "B", "C"];

const BOOLEAN_LAWS: readonly {
  id: BooleanLawId;
  label: string;
  group: string;
}[] = [
  { id: "basic", label: "Basic Expression", group: "Expression" },
  { id: "identity", label: "Identity Law", group: "Basic Laws" },
  { id: "null", label: "Null Law", group: "Basic Laws" },
  { id: "idempotent", label: "Idempotent Law", group: "Basic Laws" },
  { id: "complement", label: "Complement Law", group: "Basic Laws" },
  { id: "demorganAnd", label: "De Morgan: NAND Form", group: "De Morgan" },
  { id: "demorganOr", label: "De Morgan: NOR Form", group: "De Morgan" },
  { id: "absorption", label: "Absorption Law", group: "Simplification" },
  { id: "distributive", label: "Distributive Law", group: "Simplification" },
  { id: "nandUniversal", label: "NAND Universal", group: "Universal Gates" },
  { id: "norUniversal", label: "NOR Universal", group: "Universal Gates" },
];

const VIEW_BOX = {
  x: 0,
  y: 0,
  w: 720,
  h: 330,
};

const SCALE = {
  CIRCUIT_CANVAS_SCALE: 1,
  CIRCUIT_COMPONENT_SCALE: 1,
  CIRCUIT_WIRE_SCALE: 1,
};

const COLORS = {
  background: "#ffffff",
  cardFill: "#f8fbff",
  cardActive: "#dbeeff",
  stroke: "#111111",
  wireInactive: "#64748b",
  wireActive: "#0b72d9",
  terminalFill: "#ffffff",
  terminalFillActive: "#0b72d9",
  terminalStroke: "#111111",
  terminalStrokeActive: "#0b72d9",
  labelBlue: "#1260aa",
  textDark: "#0f172a",
  valueActive: "#0b72d9",
  valueInactive: "#334155",
  currentDot: "#0b72d9",
  success: "#16a34a",
  danger: "#dc2626",
  debug: "#ff3b30",
};

const BASE_WIRE_WIDTH = 2.2;

const FONT = {
  family: `"Times New Roman", Times, serif`,
  mono: `"JetBrains Mono", "SFMono-Regular", Consolas, monospace`,
  labelSize: 20,
  valueSize: 13,
  titleSize: 18,
  bodySize: 15,
};

const TERMINAL = {
  r: 6,
  strokeWidth: 1.5,
};

const COMPONENT_OFFSET = {
  inputA: { x: 0, y: 0 },
  inputB: { x: 0, y: 0 },
  inputC: { x: 0, y: 0 },
  algebraBlock: { x: 0, y: 0 },
  output: { x: 0, y: 0 },
};

const WIRE_OFFSET = {
  default: { x: 0, y: 0 },
  active: { x: 0, y: 0 },
};

const DEBUG_TERMINAL_OFFSET = {
  x: 0,
  y: 0,
};

const PATH = {
  A: "M 80 85 H 250",
  B: "M 80 160 H 250",
  C: "M 80 235 H 250",
  Q: "M 470 160 H 640",
};

/* -------------------------------------------------------
   Logic helpers
------------------------------------------------------- */

function boolToBit(value: boolean) {
  return value ? 1 : 0;
}

function not(value: boolean) {
  return !value;
}

function nand(a: boolean, b: boolean) {
  return !(a && b);
}

function nor(a: boolean, b: boolean) {
  return !(a || b);
}

function createInputState(
  initialInputs?: Partial<Record<InputKey, boolean>>
): InputState {
  return {
    A: initialInputs?.A ?? false,
    B: initialInputs?.B ?? false,
    C: initialInputs?.C ?? false,
  };
}

function createAllOffInputState(): InputState {
  return {
    A: false,
    B: false,
    C: false,
  };
}

function getLawInfo(inputs: InputState, lawId: BooleanLawId): LawInfo {
  const A = inputs.A;
  const B = inputs.B;
  const C = inputs.C;

  if (lawId === "identity") {
    return {
      id: lawId,
      title: "Identity Law",
      formula: "Q = A + 0",
      simplified: "Q = A",
      rule: "A + 0 = A and A · 1 = A",
      q: A,
      usedKeys: ["A"],
      explanation:
        "Identity law says adding 0 or multiplying by 1 does not change the Boolean variable.",
    };
  }

  if (lawId === "null") {
    return {
      id: lawId,
      title: "Null Law",
      formula: "Q = A · 0",
      simplified: "Q = 0",
      rule: "A + 1 = 1 and A · 0 = 0",
      q: false,
      usedKeys: ["A"],
      explanation:
        "Null law forces the result to a fixed value. A · 0 is always 0.",
    };
  }

  if (lawId === "idempotent") {
    return {
      id: lawId,
      title: "Idempotent Law",
      formula: "Q = A + A",
      simplified: "Q = A",
      rule: "A + A = A and A · A = A",
      q: A,
      usedKeys: ["A"],
      explanation:
        "Repeating the same Boolean variable does not change the final result.",
    };
  }

  if (lawId === "complement") {
    return {
      id: lawId,
      title: "Complement Law",
      formula: "Q = A + A'",
      simplified: "Q = 1",
      rule: "A + A' = 1 and A · A' = 0",
      q: true,
      usedKeys: ["A"],
      explanation:
        "A variable and its inverse cover both possible logic states, so A + A' is always 1.",
    };
  }

  if (lawId === "demorganAnd") {
    const q = not(A && B);
    return {
      id: lawId,
      title: "De Morgan's Law",
      formula: "Q = (A · B)'",
      simplified: "Q = A' + B'",
      rule: "(A · B)' = A' + B'",
      q,
      usedKeys: ["A", "B"],
      explanation:
        "The complement of an AND expression becomes an OR expression of complemented variables.",
    };
  }

  if (lawId === "demorganOr") {
    const q = not(A || B);
    return {
      id: lawId,
      title: "De Morgan's Law",
      formula: "Q = (A + B)'",
      simplified: "Q = A' · B'",
      rule: "(A + B)' = A' · B'",
      q,
      usedKeys: ["A", "B"],
      explanation:
        "The complement of an OR expression becomes an AND expression of complemented variables.",
    };
  }

  if (lawId === "absorption") {
    const q = A || (A && B);
    return {
      id: lawId,
      title: "Absorption Law",
      formula: "Q = A + A · B",
      simplified: "Q = A",
      rule: "A + A · B = A",
      q,
      usedKeys: ["A", "B"],
      explanation:
        "The term A already includes all cases needed. Therefore A · B is absorbed by A.",
    };
  }

  if (lawId === "distributive") {
    const q = (A && B) || (A && C);
    return {
      id: lawId,
      title: "Distributive Law",
      formula: "Q = A · B + A · C",
      simplified: "Q = A · (B + C)",
      rule: "A · B + A · C = A · (B + C)",
      q,
      usedKeys: ["A", "B", "C"],
      explanation:
        "The common variable A can be factored out from both product terms.",
    };
  }

  if (lawId === "nandUniversal") {
    const q = nand(nand(A, B), nand(A, B));
    return {
      id: lawId,
      title: "Universal NAND Construction",
      formula: "Q = (A NAND B) NAND (A NAND B)",
      simplified: "Q = A · B",
      rule: "AND can be built using only NAND gates.",
      q,
      usedKeys: ["A", "B"],
      explanation:
        "NAND is a universal gate because NOT, AND, OR, and other logic can be created using only NAND gates.",
    };
  }

  if (lawId === "norUniversal") {
    const q = nor(nor(A, B), nor(A, B));
    return {
      id: lawId,
      title: "Universal NOR Construction",
      formula: "Q = (A NOR B) NOR (A NOR B)",
      simplified: "Q = A + B",
      rule: "OR can be built using only NOR gates.",
      q,
      usedKeys: ["A", "B"],
      explanation:
        "NOR is a universal gate because NOT, AND, OR, and other logic can be created using only NOR gates.",
    };
  }

  const q = (A && B) || C;

  return {
    id: "basic",
    title: "Boolean Algebra Expression",
    formula: "Q = A · B + C",
    simplified: "Q = A · B + C",
    rule: "AND is evaluated before OR.",
    q,
    usedKeys: ["A", "B", "C"],
    explanation:
      "This example combines AND and OR. First calculate A · B, then OR the result with C.",
  };
}

function applyPreset(
  previous: InputState,
  usedKeys: readonly InputKey[],
  preset: PresetType
): InputState {
  const next: InputState = { ...previous };

  usedKeys.forEach((key) => {
    next[key] = false;
  });

  if (preset === "allOff") return next;

  if (preset === "allOn") {
    usedKeys.forEach((key) => {
      next[key] = true;
    });
    return next;
  }

  if (preset === "alt101") {
    usedKeys.forEach((key, index) => {
      next[key] = index % 2 === 0;
    });
    return next;
  }

  if (preset === "alt010") {
    usedKeys.forEach((key, index) => {
      next[key] = index % 2 === 1;
    });
    return next;
  }

  if (preset === "onlyA") {
    if (usedKeys.includes("A")) next.A = true;
    return next;
  }

  if (preset === "onlyB") {
    if (usedKeys.includes("B")) next.B = true;
    return next;
  }

  if (preset === "onlyC") {
    if (usedKeys.includes("C")) next.C = true;
    return next;
  }

  usedKeys.forEach((key) => {
    next[key] = Math.random() >= 0.5;
  });

  return next;
}

function createTruthTableState(
  index: number,
  keys: readonly InputKey[]
): InputState {
  const state = createAllOffInputState();

  keys.forEach((key, position) => {
    const shift = keys.length - position - 1;
    state[key] = Boolean(index & (1 << shift));
  });

  return state;
}

function isSameInputState(
  a: InputState,
  b: InputState,
  keys: readonly InputKey[]
) {
  return keys.every((key) => a[key] === b[key]);
}

function getNextStep(step: SimulationStep): SimulationStep {
  if (step === 1) return 2;
  if (step === 2) return 3;
  if (step === 3) return 4;
  return 1;
}

function stepText(step: SimulationStep, law: LawInfo) {
  if (step === 1) return "Selected input variables are highlighted.";
  if (step === 2) return `The expression ${law.formula} is evaluated.`;
  if (step === 3) return "The output path carries the result to Q.";
  return `Final result: Q = ${boolToBit(law.q)}.`;
}

/* -------------------------------------------------------
   SVG reusable helpers
------------------------------------------------------- */

function Wire({ d, from, to, active = false }: WireProps) {
  if (d) {
    return (
      <path
        d={d}
        fill="none"
        stroke={active ? COLORS.wireActive : COLORS.wireInactive}
        strokeWidth={
          active
            ? BASE_WIRE_WIDTH * SCALE.CIRCUIT_WIRE_SCALE + 1
            : BASE_WIRE_WIDTH * SCALE.CIRCUIT_WIRE_SCALE
        }
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  }

  if (!from || !to) return null;

  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke={active ? COLORS.wireActive : COLORS.wireInactive}
      strokeWidth={
        active
          ? BASE_WIRE_WIDTH * SCALE.CIRCUIT_WIRE_SCALE + 1
          : BASE_WIRE_WIDTH * SCALE.CIRCUIT_WIRE_SCALE
      }
      strokeLinecap="round"
    />
  );
}

function CurrentDot({ path, active, speed, size, count }: CurrentDotProps) {
  if (!active) return null;

  const safeCount = Math.max(1, Math.min(8, Math.floor(count)));
  const safeSpeed = Math.max(0.25, speed);
  const safeSize = Math.max(1, size);
  const duration = `${safeSpeed}s`;

  return (
    <g>
      {Array.from({ length: safeCount }, (_, index) => {
        const delay = (safeSpeed / safeCount) * index;

        return (
          <circle
            key={`${path}-${index}`}
            r={safeSize}
            fill={COLORS.currentDot}
            opacity={0}
          >
            <animateMotion
              dur={duration}
              begin={`${delay}s`}
              repeatCount="indefinite"
              path={path}
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.12;0.88;1"
              dur={duration}
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        );
      })}
    </g>
  );
}

function Terminal({
  x,
  y,
  active = false,
  debug = false,
}: {
  x: number;
  y: number;
  active?: boolean;
  debug?: boolean;
}) {
  return (
    <>
      <circle
        cx={x}
        cy={y}
        r={TERMINAL.r}
        fill={active ? COLORS.terminalFillActive : COLORS.terminalFill}
        stroke={active ? COLORS.terminalStrokeActive : COLORS.terminalStroke}
        strokeWidth={TERMINAL.strokeWidth}
      />

      {debug && (
        <circle
          cx={x + DEBUG_TERMINAL_OFFSET.x}
          cy={y + DEBUG_TERMINAL_OFFSET.y}
          r={2.5}
          fill={COLORS.debug}
        />
      )}
    </>
  );
}

function SvgText({
  x,
  y,
  children,
  size = FONT.labelSize,
  fill = COLORS.labelBlue,
  anchor = "start",
  family = FONT.family,
  weight = 700,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  fill?: string;
  anchor?: "start" | "middle" | "end";
  family?: string;
  weight?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      fill={fill}
      fontFamily={family}
      fontSize={size}
      fontWeight={weight}
      textAnchor={anchor}
      paintOrder="stroke"
      stroke={COLORS.background}
      strokeWidth={0.9}
    >
      {children}
    </text>
  );
}

function InputTerminal({
  inputKey,
  x,
  y,
  active,
  highlighted,
  interactive,
  showValue,
  onToggle,
}: InputTerminalProps) {
  const handleKeyDown = (event: React.KeyboardEvent<SVGGElement>) => {
    if (!interactive) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle(inputKey);
    }
  };

  return (
    <g
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={`Toggle input ${inputKey}. Current value is ${boolToBit(
        active
      )}`}
      onClick={interactive ? () => onToggle(inputKey) : undefined}
      onKeyDown={handleKeyDown}
      style={{ cursor: interactive ? "pointer" : "default" }}
    >
      <circle cx={x} cy={y} r={18} fill="transparent" />
      <Terminal x={x} y={y} active={highlighted} />

      <SvgText x={x - 55} y={y + 7}>
        {inputKey}
      </SvgText>

      {showValue && (
        <SvgText
          x={x + 16}
          y={y + 5}
          size={FONT.valueSize}
          fill={active ? COLORS.valueActive : COLORS.valueInactive}
          family="Arial, Helvetica, sans-serif"
        >
          = {boolToBit(active)}
        </SvgText>
      )}
    </g>
  );
}

function AlgebraBlock({
  law,
  active,
}: {
  law: LawInfo;
  active: boolean;
}) {
  return (
    <g transform={`translate(${COMPONENT_OFFSET.algebraBlock.x} ${COMPONENT_OFFSET.algebraBlock.y})`}>
      <rect
        x={250}
        y={50}
        width={220}
        height={220}
        rx={22}
        fill={active ? COLORS.cardActive : COLORS.cardFill}
        stroke={active ? COLORS.wireActive : COLORS.stroke}
        strokeWidth={2}
      />

      <SvgText
        x={360}
        y={84}
        size={FONT.titleSize}
        fill={COLORS.textDark}
        anchor="middle"
        family="Arial, Helvetica, sans-serif"
      >
        Boolean Algebra
      </SvgText>

      <line
        x1={275}
        y1={100}
        x2={445}
        y2={100}
        stroke="#cbd5e1"
        strokeWidth={1.5}
      />

      <SvgText
        x={360}
        y={132}
        size={15}
        fill={COLORS.labelBlue}
        anchor="middle"
        family={FONT.mono}
      >
        {law.formula}
      </SvgText>

      <SvgText
        x={360}
        y={168}
        size={14}
        fill={COLORS.textDark}
        anchor="middle"
        family={FONT.mono}
      >
        {law.simplified}
      </SvgText>

      <rect
        x={295}
        y={193}
        width={130}
        height={44}
        rx={12}
        fill={law.q ? "#dbeafe" : "#f1f5f9"}
        stroke={law.q ? COLORS.wireActive : "#cbd5e1"}
        strokeWidth={1.5}
      />

      <SvgText
        x={360}
        y={222}
        size={20}
        fill={law.q ? COLORS.valueActive : COLORS.valueInactive}
        anchor="middle"
        family={FONT.mono}
      >
        Q = {boolToBit(law.q)}
      </SvgText>
    </g>
  );
}

function BooleanAlgebraCanvas({
  inputs,
  law,
  interactive,
  showTruthValues,
  showCurrentDots,
  currentDotCount,
  currentDotSize,
  animationSpeed,
  isStepMode,
  simulationStep,
  onToggleInput,
}: {
  inputs: InputState;
  law: LawInfo;
  interactive: boolean;
  showTruthValues: boolean;
  showCurrentDots: boolean;
  currentDotCount: number;
  currentDotSize: number;
  animationSpeed: number;
  isStepMode: boolean;
  simulationStep: SimulationStep;
  onToggleInput: (key: InputKey) => void;
}) {
  const live = !isStepMode;
  const inputStage = live || simulationStep === 1;
  const algebraStage = live || simulationStep === 2;
  const outputStage = live || simulationStep === 3 || simulationStep === 4;
  const resultStage = live || simulationStep === 4;

  const inputPositions: Record<InputKey, XY> = {
    A: { x: 80 + COMPONENT_OFFSET.inputA.x, y: 85 + COMPONENT_OFFSET.inputA.y },
    B: { x: 80 + COMPONENT_OFFSET.inputB.x, y: 160 + COMPONENT_OFFSET.inputB.y },
    C: { x: 80 + COMPONENT_OFFSET.inputC.x, y: 235 + COMPONENT_OFFSET.inputC.y },
  };

  const inputActive: Record<InputKey, boolean> = {
    A: inputs.A && law.usedKeys.includes("A") && inputStage,
    B: inputs.B && law.usedKeys.includes("B") && inputStage,
    C: inputs.C && law.usedKeys.includes("C") && inputStage,
  };

  const outputActive = law.q && outputStage;
  const outputTerminalActive = law.q && resultStage;

  return (
    <svg
      viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.w} ${VIEW_BOX.h}`}
      role="img"
      aria-label="Boolean algebra interactive simulation"
      className="h-auto w-full rounded-2xl bg-white"
      preserveAspectRatio="xMidYMid meet"
      style={{
        transform: `scale(${SCALE.CIRCUIT_CANVAS_SCALE})`,
        transformOrigin: "top left",
      }}
    >
      <rect width="100%" height="100%" fill={COLORS.background} />

      <SvgText x={32} y={35} size={18} fill={COLORS.textDark}>
        Inputs
      </SvgText>

      {INPUT_KEYS.map((key) => {
        const position = inputPositions[key];
        const used = law.usedKeys.includes(key);

        return (
          <g key={key} opacity={used ? 1 : 0.25}>
            <InputTerminal
              inputKey={key}
              x={position.x}
              y={position.y}
              active={inputs[key]}
              highlighted={inputActive[key]}
              interactive={interactive && used}
              showValue={showTruthValues}
              onToggle={onToggleInput}
            />

            <Wire d={PATH[key]} active={inputActive[key]} />
          </g>
        );
      })}

      <AlgebraBlock law={law} active={algebraStage} />

      <Wire d={PATH.Q} active={outputActive} />

      <Terminal
        x={645 + COMPONENT_OFFSET.output.x}
        y={160 + COMPONENT_OFFSET.output.y}
        active={outputTerminalActive}
      />

      <SvgText x={665} y={167} size={22}>
        Q
      </SvgText>

      {showTruthValues && (
        <SvgText
          x={665}
          y={190}
          size={14}
          fill={law.q ? COLORS.valueActive : COLORS.valueInactive}
          family="Arial, Helvetica, sans-serif"
        >
          = {boolToBit(law.q)}
        </SvgText>
      )}

      {showCurrentDots && (
        <>
          {INPUT_KEYS.map((key) => (
            <CurrentDot
              key={`dot-${key}`}
              path={PATH[key]}
              active={inputActive[key]}
              speed={animationSpeed}
              size={currentDotSize}
              count={currentDotCount}
            />
          ))}

          <CurrentDot
            path={PATH.Q}
            active={outputActive}
            speed={animationSpeed}
            size={currentDotSize}
            count={currentDotCount}
          />
        </>
      )}
    </svg>
  );
}

/* -------------------------------------------------------
   Tailwind UI blocks
------------------------------------------------------- */

function ControlButton({
  children,
  active = false,
  disabled = false,
  ariaLabel,
  onClick,
}: ControlButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={[
        "rounded-lg border px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        active
          ? "border-blue-600 bg-blue-600 text-white shadow-sm hover:bg-blue-700"
          : "border-slate-300 bg-white text-slate-800 hover:border-blue-300 hover:bg-blue-50",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      role="status"
      aria-live="polite"
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold",
        active
          ? "bg-blue-100 text-blue-800 ring-1 ring-blue-200"
          : "bg-red-50 text-red-700 ring-1 ring-red-100",
      ].join(" ")}
    >
      Q = {boolToBit(active)}
    </span>
  );
}

function StatePill({ label, value }: { label: string; value: boolean }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ring-1",
        value
          ? "bg-blue-50 text-blue-700 ring-blue-200"
          : "bg-slate-100 text-slate-600 ring-slate-200",
      ].join(" ")}
    >
      {label}: {boolToBit(value)}
    </span>
  );
}

function SpeedSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-800">Dot speed</span>
        <span className="rounded-full bg-white px-2 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
          {value.toFixed(1)}s
        </span>
      </div>

      <input
        type="range"
        min={0.4}
        max={3}
        step={0.1}
        value={value}
        aria-label="Current dot animation speed"
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-blue-600"
      />
    </div>
  );
}

function StepProgress({
  enabled,
  step,
}: {
  enabled: boolean;
  step: SimulationStep;
}) {
  const steps: readonly SimulationStep[] = [1, 2, 3, 4];

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Step Progress
        </span>
        <span className="rounded-full bg-white px-2 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
          {enabled ? `Step ${step}` : "Live"}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {steps.map((item) => {
          const isCurrent = enabled && item === step;
          const isCompleted = enabled && item < step;

          return (
            <div
              key={item}
              className={[
                "rounded-lg border px-2 py-2 text-center text-xs font-bold",
                isCurrent
                  ? "border-blue-600 bg-blue-600 text-white"
                  : isCompleted
                  ? "border-blue-200 bg-blue-100 text-blue-800"
                  : "border-slate-200 bg-white text-slate-500",
              ].join(" ")}
            >
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PresetControls({
  usedKeys,
  onPreset,
}: {
  usedKeys: readonly InputKey[];
  onPreset: (preset: PresetType) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
        Input Presets
      </div>

      <div className="grid grid-cols-2 gap-2">
        <ControlButton onClick={() => onPreset("allOff")}>All OFF</ControlButton>
        <ControlButton onClick={() => onPreset("allOn")}>All ON</ControlButton>
        <ControlButton onClick={() => onPreset("alt101")}>101</ControlButton>
        <ControlButton onClick={() => onPreset("alt010")}>010</ControlButton>
        <ControlButton
          disabled={!usedKeys.includes("A")}
          onClick={() => onPreset("onlyA")}
        >
          Only A
        </ControlButton>
        <ControlButton
          disabled={!usedKeys.includes("B")}
          onClick={() => onPreset("onlyB")}
        >
          Only B
        </ControlButton>
        <ControlButton
          disabled={!usedKeys.includes("C")}
          onClick={() => onPreset("onlyC")}
        >
          Only C
        </ControlButton>
        <ControlButton onClick={() => onPreset("random")}>Random</ControlButton>
      </div>
    </div>
  );
}

function LawSelector({
  selectedLaw,
  onChange,
}: {
  selectedLaw: BooleanLawId;
  onChange: (id: BooleanLawId) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
        Boolean Algebra Laws
      </div>

      <div className="grid gap-2">
        {BOOLEAN_LAWS.map((law) => (
          <button
            key={law.id}
            type="button"
            aria-pressed={selectedLaw === law.id}
            onClick={() => onChange(law.id)}
            className={[
              "rounded-lg border px-3 py-2 text-left text-xs font-bold transition",
              selectedLaw === law.id
                ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                : "border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50",
            ].join(" ")}
          >
            <span className="block">{law.label}</span>
            <span
              className={[
                "block text-[10px]",
                selectedLaw === law.id ? "text-blue-100" : "text-slate-400",
              ].join(" ")}
            >
              {law.group}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function FormulaPanel({ law, inputs }: { law: LawInfo; inputs: InputState }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-bold text-slate-900">Formula Panel</h3>

      <div className="grid gap-2 text-sm text-slate-700">
        <p>
          <strong>Selected law:</strong> {law.title}
        </p>

        <p>
          <strong>Rule:</strong> {law.rule}
        </p>

        <div className="rounded-xl bg-slate-50 p-3 font-mono text-xs text-slate-900 ring-1 ring-slate-200">
          <p>{law.formula}</p>
          <p>{law.simplified}</p>
          <p>
            A={boolToBit(inputs.A)}, B={boolToBit(inputs.B)}, C=
            {boolToBit(inputs.C)} → Q={boolToBit(law.q)}
          </p>
        </div>
      </div>
    </div>
  );
}

function CopyTruthTableButton({ text }: { text: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 1400);
    } catch {
      setStatus("failed");
      window.setTimeout(() => setStatus("idle"), 1400);
    }
  };

  return (
    <ControlButton onClick={copyText}>
      {status === "copied"
        ? "Copied"
        : status === "failed"
        ? "Copy failed"
        : "Copy truth table"}
    </ControlButton>
  );
}

function BitCell({ value }: { value: boolean }) {
  return (
    <td
      className={[
        "border border-slate-200 px-2 py-1 font-bold",
        value ? "bg-blue-50 text-blue-700" : "bg-slate-50 text-slate-500",
      ].join(" ")}
    >
      {boolToBit(value)}
    </td>
  );
}

function TruthTable({
  lawId,
  inputs,
}: {
  lawId: BooleanLawId;
  inputs: InputState;
}) {
  const law = getLawInfo(inputs, lawId);
  const keys = law.usedKeys;
  const rowCount = 2 ** keys.length;

  const [onlyCurrentRow, setOnlyCurrentRow] = useState(false);
  const [onlyQOneRows, setOnlyQOneRows] = useState(false);
  const [onlyQZeroRows, setOnlyQZeroRows] = useState(false);

  const rows = useMemo(() => {
    return Array.from({ length: rowCount }, (_, index) => {
      const rowInputs = createTruthTableState(index, keys);
      const rowLaw = getLawInfo(rowInputs, lawId);

      return {
        index,
        inputs: rowInputs,
        q: rowLaw.q,
      };
    });
  }, [keys, lawId, rowCount]);

  const visibleRows = rows.filter((row) => {
    const currentRow = isSameInputState(row.inputs, inputs, keys);

    if (onlyCurrentRow && !currentRow) return false;
    if (onlyQOneRows && !row.q) return false;
    if (onlyQZeroRows && row.q) return false;

    return true;
  });

  const truthTableText = useMemo(() => {
    const header = [...keys, "Q"].join("\t");

    const body = rows
      .map((row) =>
        [...keys.map((key) => boolToBit(row.inputs[key])), boolToBit(row.q)].join(
          "\t"
        )
      )
      .join("\n");

    return `${header}\n${body}`;
  }, [keys, rows]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-slate-900">Truth Table</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          {visibleRows.length} / {rowCount} rows
        </span>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <ControlButton
          active={onlyCurrentRow}
          onClick={() => setOnlyCurrentRow((value) => !value)}
        >
          Search current row
        </ControlButton>

        <ControlButton
          active={onlyQOneRows}
          onClick={() => {
            setOnlyQOneRows((value) => !value);
            setOnlyQZeroRows(false);
          }}
        >
          Only Q = 1
        </ControlButton>

        <ControlButton
          active={onlyQZeroRows}
          onClick={() => {
            setOnlyQZeroRows((value) => !value);
            setOnlyQOneRows(false);
          }}
        >
          Only Q = 0
        </ControlButton>

        <CopyTruthTableButton text={truthTableText} />
      </div>

      <div className="max-h-96 overflow-auto rounded-xl border border-slate-200">
        <table className="w-full border-collapse text-center text-xs">
          <thead className="sticky top-0 bg-slate-100 text-slate-700">
            <tr>
              {keys.map((key) => (
                <th key={key} className="border border-slate-200 px-2 py-2">
                  {key}
                </th>
              ))}
              <th className="border border-slate-200 px-2 py-2">Q</th>
            </tr>
          </thead>

          <tbody>
            {visibleRows.map((row) => {
              const currentRow = isSameInputState(row.inputs, inputs, keys);

              return (
                <tr
                  key={row.index}
                  className={[
                    row.q ? "bg-blue-50" : "bg-white",
                    currentRow ? "outline outline-2 outline-blue-600" : "",
                  ].join(" ")}
                >
                  {keys.map((key) => (
                    <BitCell key={key} value={row.inputs[key]} />
                  ))}

                  <td
                    className={[
                      "border border-slate-200 px-2 py-1 font-black",
                      row.q
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-500",
                    ].join(" ")}
                  >
                    {boolToBit(row.q)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function WaveformPanel({
  samples,
}: {
  samples: WaveformSample[];
}) {
  const rows: readonly (InputKey | "Q")[] = ["A", "B", "C", "Q"];
  const width = 520;
  const rowHeight = 28;
  const labelWidth = 34;
  const svgHeight = rows.length * rowHeight + 12;

  const createPath = (values: boolean[], rowIndex: number) => {
    const top = rowIndex * rowHeight + 8;
    const highY = top + 4;
    const lowY = top + 18;
    const cellWidth = (width - labelWidth - 12) / Math.max(values.length, 1);
    const firstY = values[0] ? highY : lowY;

    let path = `M ${labelWidth} ${firstY}`;

    values.forEach((value, index) => {
      const y = value ? highY : lowY;
      const nextX = labelWidth + cellWidth * (index + 1);
      path += ` H ${nextX}`;

      const nextValue = values[index + 1];

      if (typeof nextValue === "boolean" && nextValue !== value) {
        path += ` V ${nextValue ? highY : lowY}`;
      }
    });

    return path;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-slate-900">Mini Waveform Panel</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          {samples.length} samples
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-2">
        <svg
          viewBox={`0 0 ${width} ${svgHeight}`}
          className="min-w-[520px]"
          role="img"
          aria-label="Digital waveform timeline for Boolean algebra values"
        >
          <rect x={0} y={0} width={width} height={svgHeight} fill="#f8fafc" />

          {rows.map((row, rowIndex) => {
            const values = samples.map((sample) =>
              row === "Q" ? sample.q : sample.inputs[row]
            );

            return (
              <g key={row}>
                <text
                  x={6}
                  y={rowIndex * rowHeight + 24}
                  fontFamily="Arial, Helvetica, sans-serif"
                  fontSize={12}
                  fontWeight={700}
                  fill={row === "Q" ? "#0b72d9" : "#334155"}
                >
                  {row}
                </text>

                <line
                  x1={labelWidth}
                  y1={rowIndex * rowHeight + 26}
                  x2={width - 8}
                  y2={rowIndex * rowHeight + 26}
                  stroke="#e2e8f0"
                  strokeWidth={1}
                />

                <path
                  d={createPath(values, rowIndex)}
                  fill="none"
                  stroke={values[values.length - 1] ? "#0b72d9" : "#64748b"}
                  strokeWidth={2}
                  strokeLinejoin="miter"
                  strokeLinecap="square"
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   Left-side single control panel
------------------------------------------------------- */

function LeftControlPanel({
  inputs,
  law,
  selectedLaw,
  isAutoRunning,
  isStepMode,
  simulationStep,
  isShowingCurrentDots,
  isShowingTruthValues,
  isShowingTruthTable,
  dotSpeed,
  showFormulaPanel,
  onLawChange,
  onToggleInput,
  onPreset,
  onToggleAutoRun,
  onToggleStepMode,
  onNextStep,
  onToggleCurrentDots,
  onToggleTruthValues,
  onToggleTruthTable,
  onDotSpeedChange,
}: {
  inputs: InputState;
  law: LawInfo;
  selectedLaw: BooleanLawId;
  isAutoRunning: boolean;
  isStepMode: boolean;
  simulationStep: SimulationStep;
  isShowingCurrentDots: boolean;
  isShowingTruthValues: boolean;
  isShowingTruthTable: boolean;
  dotSpeed: number;
  showFormulaPanel: boolean;
  onLawChange: (id: BooleanLawId) => void;
  onToggleInput: (key: InputKey) => void;
  onPreset: (preset: PresetType) => void;
  onToggleAutoRun: () => void;
  onToggleStepMode: () => void;
  onNextStep: () => void;
  onToggleCurrentDots: () => void;
  onToggleTruthValues: () => void;
  onToggleTruthTable: () => void;
  onDotSpeedChange: (value: number) => void;
}) {
  return (
    <aside className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-black text-slate-900">Control Panel</h3>
          <p className="text-xs font-medium text-slate-500">
            Boolean Algebra Simulator
          </p>
        </div>

        <StatusBadge active={law.q} />
      </div>

      <LawSelector selectedLaw={selectedLaw} onChange={onLawChange} />

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
          Active Inputs
        </div>

        <div className="flex flex-wrap gap-2">
          {law.usedKeys.map((key) => (
            <StatePill key={key} label={key} value={inputs[key]} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {law.usedKeys.map((key) => (
          <ControlButton
            key={key}
            active={inputs[key]}
            ariaLabel={`Toggle input ${key}`}
            onClick={() => onToggleInput(key)}
          >
            Toggle {key}
          </ControlButton>
        ))}
      </div>

      <PresetControls usedKeys={law.usedKeys} onPreset={onPreset} />

      <div className="grid grid-cols-2 gap-2">
        <ControlButton active={isAutoRunning} onClick={onToggleAutoRun}>
          {isAutoRunning ? "Stop" : "Auto Run"}
        </ControlButton>

        <ControlButton active={isStepMode} onClick={onToggleStepMode}>
          Step Mode
        </ControlButton>

        <ControlButton disabled={!isStepMode} onClick={onNextStep}>
          Next Step
        </ControlButton>
      </div>

      <StepProgress enabled={isStepMode} step={simulationStep} />

      <div className="grid grid-cols-1 gap-2">
        <ControlButton active={isShowingCurrentDots} onClick={onToggleCurrentDots}>
          {isShowingCurrentDots ? "Hide Current Dots" : "Show Current Dots"}
        </ControlButton>

        <ControlButton active={isShowingTruthValues} onClick={onToggleTruthValues}>
          {isShowingTruthValues ? "Hide Truth Values" : "Show Truth Values"}
        </ControlButton>

        <ControlButton active={isShowingTruthTable} onClick={onToggleTruthTable}>
          {isShowingTruthTable ? "Hide Truth Table" : "Show Truth Table"}
        </ControlButton>
      </div>

      <SpeedSlider value={dotSpeed} onChange={onDotSpeedChange} />

      {showFormulaPanel && <FormulaPanel law={law} inputs={inputs} />}
    </aside>
  );
}

/* -------------------------------------------------------
   Main component
------------------------------------------------------- */

export default function AndFunctionDiagram({
  initialInputs,
  initialLaw = "basic",
  interactive = true,
  showControls = true,
  showTruthValues = true,
  showCurrentDots = true,
  showTruthTable = false,
  animationSpeed = 1.2,
  autoRun = false,
  currentDotCount = 2,
  currentDotSize = 3,
  currentDotSpeed,
  enableStepMode = false,
  showFormulaPanel = true,
  showWaveform = true,
  className = "",
}: AndFunctionDiagramProps) {
  const [selectedLaw, setSelectedLaw] = useState<BooleanLawId>(initialLaw);
  const [inputs, setInputs] = useState<InputState>(() =>
    createInputState(initialInputs)
  );
  const [isAutoRunning, setIsAutoRunning] = useState(autoRun);
  const [isStepMode, setIsStepMode] = useState(enableStepMode);
  const [simulationStep, setSimulationStep] = useState<SimulationStep>(1);
  const [isShowingCurrentDots, setIsShowingCurrentDots] =
    useState(showCurrentDots);
  const [isShowingTruthValues, setIsShowingTruthValues] =
    useState(showTruthValues);
  const [isShowingTruthTable, setIsShowingTruthTable] =
    useState(showTruthTable);
  const [dotSpeed, setDotSpeed] = useState(currentDotSpeed ?? animationSpeed);
  const [waveformSamples, setWaveformSamples] = useState<WaveformSample[]>([]);

  const law = useMemo(
    () => getLawInfo(inputs, selectedLaw),
    [inputs, selectedLaw]
  );

  useEffect(() => {
    setIsAutoRunning(autoRun);
  }, [autoRun]);

  useEffect(() => {
    setIsStepMode(enableStepMode);
  }, [enableStepMode]);

  useEffect(() => {
    setIsShowingCurrentDots(showCurrentDots);
  }, [showCurrentDots]);

  useEffect(() => {
    setIsShowingTruthValues(showTruthValues);
  }, [showTruthValues]);

  useEffect(() => {
    setIsShowingTruthTable(showTruthTable);
  }, [showTruthTable]);

  useEffect(() => {
    setDotSpeed(currentDotSpeed ?? animationSpeed);
  }, [animationSpeed, currentDotSpeed]);

  useEffect(() => {
    setWaveformSamples((previous) => {
      const nextSample: WaveformSample = {
        inputs,
        q: law.q,
      };

      const last = previous[previous.length - 1];

      if (
        last &&
        last.q === nextSample.q &&
        isSameInputState(last.inputs, nextSample.inputs, INPUT_KEYS)
      ) {
        return previous;
      }

      return [...previous, nextSample].slice(-16);
    });
  }, [inputs, law.q]);

  useEffect(() => {
    if (!isAutoRunning) return;

    const intervalId = window.setInterval(() => {
      setInputs((previous) => applyPreset(previous, law.usedKeys, "random"));
      setSimulationStep(1);
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isAutoRunning, law.usedKeys]);

  const toggleInput = (key: InputKey) => {
    setInputs((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
    setSimulationStep(1);
  };

  const applyInputPreset = (preset: PresetType) => {
    setInputs((previous) => applyPreset(previous, law.usedKeys, preset));
    setSimulationStep(1);
  };

  const changeLaw = (id: BooleanLawId) => {
    setSelectedLaw(id);
    setSimulationStep(1);
  };

  const nextStep = () => {
    setSimulationStep((previous) => getNextStep(previous));
  };

  return (
    <div className={`w-full max-w-[1220px] bg-white ${className}`}>
      <div className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
        {showControls && (
          <LeftControlPanel
            inputs={inputs}
            law={law}
            selectedLaw={selectedLaw}
            isAutoRunning={isAutoRunning}
            isStepMode={isStepMode}
            simulationStep={simulationStep}
            isShowingCurrentDots={isShowingCurrentDots}
            isShowingTruthValues={isShowingTruthValues}
            isShowingTruthTable={isShowingTruthTable}
            dotSpeed={dotSpeed}
            showFormulaPanel={showFormulaPanel}
            onLawChange={changeLaw}
            onToggleInput={toggleInput}
            onPreset={applyInputPreset}
            onToggleAutoRun={() => setIsAutoRunning((value) => !value)}
            onToggleStepMode={() => setIsStepMode((value) => !value)}
            onNextStep={nextStep}
            onToggleCurrentDots={() => setIsShowingCurrentDots((value) => !value)}
            onToggleTruthValues={() => setIsShowingTruthValues((value) => !value)}
            onToggleTruthTable={() => setIsShowingTruthTable((value) => !value)}
            onDotSpeedChange={setDotSpeed}
          />
        )}

        <main className="flex min-w-0 flex-col gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <BooleanAlgebraCanvas
              inputs={inputs}
              law={law}
              interactive={interactive}
              showTruthValues={isShowingTruthValues}
              showCurrentDots={isShowingCurrentDots}
              currentDotCount={currentDotCount}
              currentDotSize={currentDotSize}
              animationSpeed={dotSpeed}
              isStepMode={isStepMode}
              simulationStep={simulationStep}
              onToggleInput={toggleInput}
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Simulation Explanation
              </h3>
              <StatusBadge active={law.q} />
            </div>

            <div className="grid gap-2 text-sm text-slate-700">
              <p>
                <strong>Law:</strong> {law.title}
              </p>
              <p>
                <strong>Expression:</strong> {law.formula}
              </p>
              <p>
                <strong>Simplified form:</strong> {law.simplified}
              </p>
              <p>
                <strong>Current step:</strong>{" "}
                {isStepMode
                  ? `Step ${simulationStep}: ${stepText(simulationStep, law)}`
                  : "Live simulation"}
              </p>
              <p>
                <strong>Explanation:</strong> {law.explanation}
              </p>
            </div>
          </div>

          {showWaveform && <WaveformPanel samples={waveformSamples} />}

          {isShowingTruthTable && (
            <TruthTable lawId={selectedLaw} inputs={inputs} />
          )}
        </main>
      </div>
    </div>
  );
}