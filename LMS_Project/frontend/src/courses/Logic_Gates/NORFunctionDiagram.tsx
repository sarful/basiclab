"use client";

import React, { useEffect, useMemo, useState } from "react";

type DiagramVariant = "two" | "three" | "six";

export type InputKey = "A" | "B" | "C" | "D" | "E" | "F";
export type InputState = Record<InputKey, boolean>;
export type SimulationStep = 1 | 2 | 3 | 4;

export type LogicState = {
  AB: boolean;
  CD: boolean;
  EF: boolean;
  rawOr: boolean;
  Q: boolean;
};

type XY = { x: number; y: number };
type IntermediateKey = "AB" | "CD" | "EF";

type PresetType =
  | "allOff"
  | "allOn"
  | "alt101010"
  | "alt010101"
  | "onlyA"
  | "onlyLast"
  | "random";

type WireProps = { d?: string; from?: XY; to?: XY };
type TerminalProps = { x: number; y: number; active?: boolean; debug?: boolean };

type InputTerminalProps = {
  inputKey: InputKey;
  x: number;
  y: number;
  labelX: number;
  labelY: number;
  valueX?: number;
  valueY?: number;
  active: boolean;
  highlighted: boolean;
  interactive: boolean;
  showValue: boolean;
  debug?: boolean;
  onToggle: (key: InputKey) => void;
};

type LabelProps = {
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  anchor?: "start" | "middle" | "end";
};

type ValueLabelProps = LabelProps & { active?: boolean };

type OrGateProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  plusSize?: number;
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

type TabButtonProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

type StatusBadgeProps = {
  active: boolean;
};

type SpeedSliderProps = {
  value: number;
  onChange: (value: number) => void;
};

type PresetControlsProps = {
  onPreset: (preset: PresetType) => void;
};

type StepProgressProps = {
  enabled: boolean;
  step: SimulationStep;
};

type FormulaPanelProps = {
  variant: DiagramVariant;
  inputs: InputState;
  logic: LogicState;
};

type TruthTableProps = {
  variant: DiagramVariant;
  inputs: InputState;
};

type WaveformSample = {
  inputs: InputState;
  q: boolean;
};

type WaveformPanelProps = {
  variant: DiagramVariant;
  samples: WaveformSample[];
};

type CopyTruthTableButtonProps = {
  text: string;
};

export type AndFunctionDiagramProps = Omit<
  React.SVGProps<SVGSVGElement>,
  "viewBox"
> & {
  variant?: DiagramVariant;
  initialInputs?: Partial<Record<InputKey, boolean>>;
  interactive?: boolean;
  showTabs?: boolean;
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
   Constants
------------------------------------------------------- */

const INPUT_KEYS: readonly InputKey[] = ["A", "B", "C", "D", "E", "F"];

const TABS: readonly { key: DiagramVariant; label: string }[] = [
  { key: "two", label: "2-input NOR" },
  { key: "three", label: "3-input NOR" },
  { key: "six", label: "6-input NOR" },
];

const VIEW_BOX: Record<DiagramVariant, string> = {
  two: "0 0 210 59",
  three: "0 0 213 61",
  six: "0 0 390 248",
};

const SCALE = {
  CIRCUIT_CANVAS_SCALE: 1,
  CIRCUIT_COMPONENT_SCALE: 1,
  CIRCUIT_WIRE_SCALE: 1,
};

const COLORS = {
  background: "#ffffff",
  gateFill: "#c8daef",
  gateFillActive: "#9fd0ff",
  gateStroke: "#111111",
  wireInactive: "#5a5a5a",
  wireActive: "#0b72d9",
  terminalFill: "#ffffff",
  terminalFillActive: "#0b72d9",
  terminalStroke: "#111111",
  terminalStrokeActive: "#0b72d9",
  labelBlue: "#1260aa",
  valueActive: "#0b72d9",
  valueInactive: "#333333",
  plusBlue: "#1260aa",
  caption: "#111111",
  currentDot: "#0b72d9",
  debug: "#ff3b30",
};

const BASE_WIRE_WIDTH = 1.35;

const FONT = {
  family: `"Times New Roman", Times, serif`,
  labelSize: 18,
  valueSize: 12,
  captionSize: 16,
};

const TERMINAL = {
  r: 4,
  strokeWidth: 1.2,
};

const GATE = {
  strokeWidth: 1.4,
};

const COMPONENT_OFFSET = {
  twoGate: { x: 0, y: 0 },
  threeGate: { x: 0, y: 0 },
  sixFunction: { x: 0, y: 0 },
  orGate: { x: 0, y: 0 },
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
  two: {
    inputA: "M 25 16 H 66",
    inputB: "M 25 43 H 66",
    Q: "M 145 30 H 185",
  },
  three: {
    inputA: "M 29 12 H 72",
    inputB: "M 29 30 H 72",
    inputC: "M 29 49 H 72",
    Q: "M 147 31 H 185",
  },
  six: {
    inputA: "M 31 16 H 75",
    inputB: "M 31 44 H 75",
    inputC: "M 31 92 H 75",
    inputD: "M 31 121 H 75",
    inputE: "M 31 168 H 75",
    inputF: "M 31 197 H 75",
    AB: "M 151 30 H 197 V 106 H 245",
    CD: "M 151 107 H 197 V 122 H 245",
    EF: "M 151 183 H 197 V 139 H 245",
    Q: "M 329 122 H 353",
  },
} as const;

/* -------------------------------------------------------
   Logic helpers
------------------------------------------------------- */

function boolToBit(value: boolean) {
  return value ? 1 : 0;
}

function createInputState(
  initialInputs?: Partial<Record<InputKey, boolean>>
): InputState {
  return {
    A: initialInputs?.A ?? false,
    B: initialInputs?.B ?? false,
    C: initialInputs?.C ?? false,
    D: initialInputs?.D ?? false,
    E: initialInputs?.E ?? false,
    F: initialInputs?.F ?? false,
  };
}

function createAllOffInputState(): InputState {
  return { A: false, B: false, C: false, D: false, E: false, F: false };
}

function getActiveInputKeys(variant: DiagramVariant): readonly InputKey[] {
  if (variant === "two") return ["A", "B"];
  if (variant === "three") return ["A", "B", "C"];
  return INPUT_KEYS;
}

function calculateLogic(inputs: InputState, variant: DiagramVariant): LogicState {
  const AB = inputs.A || inputs.B;
  const CD = inputs.C || inputs.D;
  const EF = inputs.E || inputs.F;

  const rawOr =
    variant === "two"
      ? AB
      : variant === "three"
      ? inputs.A || inputs.B || inputs.C
      : AB || CD || EF;

  const Q = !rawOr;

  return { AB, CD, EF, rawOr, Q };
}

function applyPreset(
  previous: InputState,
  keys: readonly InputKey[],
  preset: PresetType
): InputState {
  const next: InputState = { ...previous };

  keys.forEach((key) => {
    next[key] = false;
  });

  if (preset === "allOff") return next;

  if (preset === "allOn") {
    keys.forEach((key) => {
      next[key] = true;
    });
    return next;
  }

  if (preset === "alt101010") {
    keys.forEach((key, index) => {
      next[key] = index % 2 === 0;
    });
    return next;
  }

  if (preset === "alt010101") {
    keys.forEach((key, index) => {
      next[key] = index % 2 === 1;
    });
    return next;
  }

  if (preset === "onlyA") {
    if (keys.includes("A")) next.A = true;
    return next;
  }

  if (preset === "onlyLast") {
    const last = keys[keys.length - 1];
    next[last] = true;
    return next;
  }

  keys.forEach((key) => {
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

function getFormulaTitle(variant: DiagramVariant) {
  if (variant === "two") return "Q = NOT(A + B)";
  if (variant === "three") return "Q = NOT(A + B + C)";
  return "Q = NOT((A+B) + (C+D) + (E+F))";
}

function stepText(variant: DiagramVariant, step: SimulationStep) {
  if (variant === "two") {
    if (step === 1) return "Inputs A and B are selected.";
    if (step === 2) return "The NOR calculation checks NOT(A + B).";
    if (step === 3) return "The output path carries the NOR result.";
    return "Q shows the final NOR output.";
  }

  if (variant === "three") {
    if (step === 1) return "Inputs A, B, and C are selected.";
    if (step === 2) return "The NOR calculation checks NOT(A + B + C).";
    if (step === 3) return "The output path carries the NOR result.";
    return "Q shows the final NOR output.";
  }

  if (step === 1) return "Inputs A-F are selected.";
  if (step === 2) return "A+B, C+D, and E+F are calculated first.";
  if (step === 3) return "The final NOR output path moves toward Q.";
  return "Q shows the final NOR output.";
}

/* -------------------------------------------------------
   SVG reusable helpers
------------------------------------------------------- */

function orGatePath(x: number, y: number, w: number, h: number) {
  const scaledW = w * SCALE.CIRCUIT_COMPONENT_SCALE;
  const scaledH = h * SCALE.CIRCUIT_COMPONENT_SCALE;

  return [
    `M ${x} ${y}`,
    `C ${x + scaledW * 0.38} ${y} ${x + scaledW * 0.75} ${y + scaledH * 0.08} ${
      x + scaledW
    } ${y + scaledH / 2}`,
    `C ${x + scaledW * 0.75} ${y + scaledH * 0.92} ${
      x + scaledW * 0.38
    } ${y + scaledH} ${x} ${y + scaledH}`,
    `C ${x + scaledW * 0.2} ${y + scaledH * 0.68} ${
      x + scaledW * 0.2
    } ${y + scaledH * 0.32} ${x} ${y}`,
    "Z",
  ].join(" ");
}

function Wire({ d, from, to }: WireProps) {
  const offset = WIRE_OFFSET.default;

  if (d) {
    return (
      <path
        d={d}
        fill="none"
        stroke={COLORS.wireInactive}
        strokeWidth={BASE_WIRE_WIDTH * SCALE.CIRCUIT_WIRE_SCALE}
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    );
  }

  if (!from || !to) return null;

  return (
    <line
      x1={from.x + offset.x}
      y1={from.y + offset.y}
      x2={to.x + offset.x}
      y2={to.y + offset.y}
      stroke={COLORS.wireInactive}
      strokeWidth={BASE_WIRE_WIDTH * SCALE.CIRCUIT_WIRE_SCALE}
      strokeLinecap="square"
    />
  );
}

function ActiveWire({ d, from, to }: WireProps) {
  const offset = WIRE_OFFSET.active;

  if (d) {
    return (
      <path
        d={d}
        fill="none"
        stroke={COLORS.wireActive}
        strokeWidth={BASE_WIRE_WIDTH * SCALE.CIRCUIT_WIRE_SCALE + 0.9}
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    );
  }

  if (!from || !to) return null;

  return (
    <line
      x1={from.x + offset.x}
      y1={from.y + offset.y}
      x2={to.x + offset.x}
      y2={to.y + offset.y}
      stroke={COLORS.wireActive}
      strokeWidth={BASE_WIRE_WIDTH * SCALE.CIRCUIT_WIRE_SCALE + 0.9}
      strokeLinecap="square"
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

function Terminal({ x, y, active = false, debug = false }: TerminalProps) {
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
          r={2}
          fill={COLORS.debug}
        />
      )}
    </>
  );
}

function Label({
  x,
  y,
  children,
  size = FONT.labelSize,
  anchor = "start",
}: LabelProps) {
  return (
    <text
      x={x}
      y={y}
      fill={COLORS.labelBlue}
      fontFamily={FONT.family}
      fontSize={size}
      textAnchor={anchor}
      paintOrder="stroke"
      stroke={COLORS.background}
      strokeWidth={0.6}
    >
      {children}
    </text>
  );
}

function ValueLabel({
  x,
  y,
  children,
  size = FONT.valueSize,
  anchor = "start",
  active = false,
}: ValueLabelProps) {
  return (
    <text
      x={x}
      y={y}
      fill={active ? COLORS.valueActive : COLORS.valueInactive}
      fontFamily="Arial, Helvetica, sans-serif"
      fontSize={size}
      fontWeight={700}
      textAnchor={anchor}
      paintOrder="stroke"
      stroke={COLORS.background}
      strokeWidth={1.4}
    >
      {children}
    </text>
  );
}

function Caption({ x, y, children }: LabelProps) {
  return (
    <text
      x={x}
      y={y}
      fill={COLORS.caption}
      fontFamily={FONT.family}
      fontSize={FONT.captionSize}
      paintOrder="stroke"
      stroke={COLORS.background}
      strokeWidth={0.8}
    >
      {children}
    </text>
  );
}

function OrGate({ x, y, w, h, plusSize = 23, active = false }: OrGateProps) {
  const offsetX = COMPONENT_OFFSET.orGate.x;
  const offsetY = COMPONENT_OFFSET.orGate.y;

  return (
    <g>
      <path
        d={orGatePath(x + offsetX, y + offsetY, w, h)}
        fill={active ? COLORS.gateFillActive : COLORS.gateFill}
        stroke={COLORS.gateStroke}
        strokeWidth={GATE.strokeWidth}
      />

      <text
        x={x + offsetX + w * 0.46}
        y={y + offsetY + h / 2}
        fill={COLORS.plusBlue}
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize={plusSize}
        fontWeight={700}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        ≥1
      </text>
    </g>
  );
}

function InversionBubble({
  cx,
  cy,
  active,
}: {
  cx: number;
  cy: number;
  active: boolean;
}) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4.5}
      fill={COLORS.background}
      stroke={active ? COLORS.wireActive : COLORS.gateStroke}
      strokeWidth={1.4}
    />
  );
}

function InputTerminal({
  inputKey,
  x,
  y,
  labelX,
  labelY,
  valueX,
  valueY,
  active,
  highlighted,
  interactive,
  showValue,
  debug = false,
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
      <Label x={labelX} y={labelY}>
        {inputKey}
      </Label>

      {showValue && (
        <ValueLabel
          x={valueX ?? labelX + 18}
          y={valueY ?? labelY}
          active={active}
        >
          = {boolToBit(active)}
        </ValueLabel>
      )}

      <circle cx={x} cy={y} r={13} fill="transparent" />
      <Terminal x={x} y={y} active={highlighted} debug={debug} />
    </g>
  );
}

/* -------------------------------------------------------
   2-input NOR circuit
------------------------------------------------------- */

function TwoInputNorGate({
  inputs,
  logic,
  interactive,
  showTruthValues,
  showCurrentDots,
  currentDotCount,
  currentDotSize,
  animationSpeed,
  isStepMode,
  simulationStep,
  debug = false,
  onToggleInput,
}: {
  inputs: InputState;
  logic: LogicState;
  interactive: boolean;
  showTruthValues: boolean;
  showCurrentDots: boolean;
  currentDotCount: number;
  currentDotSize: number;
  animationSpeed: number;
  isStepMode: boolean;
  simulationStep: SimulationStep;
  debug?: boolean;
  onToggleInput: (key: InputKey) => void;
}) {
  const live = !isStepMode;
  const inputStage = live || simulationStep === 1;
  const gateStage = live || simulationStep === 2;
  const outputStage = live || simulationStep === 3 || simulationStep === 4;
  const resultStage = live || simulationStep === 4;

  const activeA = inputs.A && inputStage;
  const activeB = inputs.B && inputStage;
  const activeGate = gateStage && (logic.rawOr || logic.Q);
  const activeOutput = logic.Q && outputStage;
  const activeTerminal = logic.Q && resultStage;

  return (
    <g transform={`translate(${COMPONENT_OFFSET.twoGate.x} ${COMPONENT_OFFSET.twoGate.y})`}>
      <InputTerminal
        inputKey="A"
        x={21}
        y={16}
        labelX={0}
        labelY={21}
        valueX={31}
        valueY={13}
        active={inputs.A}
        highlighted={activeA}
        interactive={interactive}
        showValue={showTruthValues}
        debug={debug}
        onToggle={onToggleInput}
      />

      <InputTerminal
        inputKey="B"
        x={21}
        y={43}
        labelX={0}
        labelY={48}
        valueX={31}
        valueY={50}
        active={inputs.B}
        highlighted={activeB}
        interactive={interactive}
        showValue={showTruthValues}
        debug={debug}
        onToggle={onToggleInput}
      />

      {activeA ? <ActiveWire d={PATH.two.inputA} /> : <Wire d={PATH.two.inputA} />}
      {activeB ? <ActiveWire d={PATH.two.inputB} /> : <Wire d={PATH.two.inputB} />}

      <OrGate x={66} y={1} w={79} h={57} plusSize={17} active={activeGate} />
      <InversionBubble cx={150} cy={30} active={activeOutput} />

      {activeOutput ? <ActiveWire d={PATH.two.Q} /> : <Wire d={PATH.two.Q} />}
      <Terminal x={188} y={30} active={activeTerminal} debug={debug} />

      <Label x={198} y={35}>Q</Label>

      {showTruthValues && (
        <ValueLabel x={194} y={52} active={logic.Q}>
          = {boolToBit(logic.Q)}
        </ValueLabel>
      )}

      {showCurrentDots && (
        <>
          <CurrentDot path={PATH.two.inputA} active={activeA} speed={animationSpeed} size={currentDotSize} count={currentDotCount} />
          <CurrentDot path={PATH.two.inputB} active={activeB} speed={animationSpeed} size={currentDotSize} count={currentDotCount} />
          <CurrentDot path={PATH.two.Q} active={activeOutput} speed={animationSpeed} size={currentDotSize} count={currentDotCount} />
        </>
      )}
    </g>
  );
}

/* -------------------------------------------------------
   3-input NOR circuit
------------------------------------------------------- */

function ThreeInputNorGate({
  inputs,
  logic,
  interactive,
  showTruthValues,
  showCurrentDots,
  currentDotCount,
  currentDotSize,
  animationSpeed,
  isStepMode,
  simulationStep,
  debug = false,
  onToggleInput,
}: {
  inputs: InputState;
  logic: LogicState;
  interactive: boolean;
  showTruthValues: boolean;
  showCurrentDots: boolean;
  currentDotCount: number;
  currentDotSize: number;
  animationSpeed: number;
  isStepMode: boolean;
  simulationStep: SimulationStep;
  debug?: boolean;
  onToggleInput: (key: InputKey) => void;
}) {
  const live = !isStepMode;
  const inputStage = live || simulationStep === 1;
  const gateStage = live || simulationStep === 2;
  const outputStage = live || simulationStep === 3 || simulationStep === 4;
  const resultStage = live || simulationStep === 4;

  const activeA = inputs.A && inputStage;
  const activeB = inputs.B && inputStage;
  const activeC = inputs.C && inputStage;
  const activeGate = gateStage && (logic.rawOr || logic.Q);
  const activeOutput = logic.Q && outputStage;
  const activeTerminal = logic.Q && resultStage;

  return (
    <g transform={`translate(${COMPONENT_OFFSET.threeGate.x} ${COMPONENT_OFFSET.threeGate.y})`}>
      <InputTerminal
        inputKey="A"
        x={25}
        y={12}
        labelX={0}
        labelY={16}
        valueX={35}
        valueY={12}
        active={inputs.A}
        highlighted={activeA}
        interactive={interactive}
        showValue={showTruthValues}
        debug={debug}
        onToggle={onToggleInput}
      />

      <InputTerminal
        inputKey="B"
        x={25}
        y={30}
        labelX={0}
        labelY={34}
        valueX={35}
        valueY={32}
        active={inputs.B}
        highlighted={activeB}
        interactive={interactive}
        showValue={showTruthValues}
        debug={debug}
        onToggle={onToggleInput}
      />

      <InputTerminal
        inputKey="C"
        x={25}
        y={49}
        labelX={0}
        labelY={53}
        valueX={35}
        valueY={52}
        active={inputs.C}
        highlighted={activeC}
        interactive={interactive}
        showValue={showTruthValues}
        debug={debug}
        onToggle={onToggleInput}
      />

      {activeA ? <ActiveWire d={PATH.three.inputA} /> : <Wire d={PATH.three.inputA} />}
      {activeB ? <ActiveWire d={PATH.three.inputB} /> : <Wire d={PATH.three.inputB} />}
      {activeC ? <ActiveWire d={PATH.three.inputC} /> : <Wire d={PATH.three.inputC} />}

      <OrGate x={72} y={2} w={75} h={58} plusSize={17} active={activeGate} />
      <InversionBubble cx={151} cy={31} active={activeOutput} />

      {activeOutput ? <ActiveWire d={PATH.three.Q} /> : <Wire d={PATH.three.Q} />}
      <Terminal x={189} y={31} active={activeTerminal} debug={debug} />

      <Label x={199} y={35}>Q</Label>

      {showTruthValues && (
        <ValueLabel x={194} y={52} active={logic.Q}>
          = {boolToBit(logic.Q)}
        </ValueLabel>
      )}

      {showCurrentDots && (
        <>
          <CurrentDot path={PATH.three.inputA} active={activeA} speed={animationSpeed} size={currentDotSize} count={currentDotCount} />
          <CurrentDot path={PATH.three.inputB} active={activeB} speed={animationSpeed} size={currentDotSize} count={currentDotCount} />
          <CurrentDot path={PATH.three.inputC} active={activeC} speed={animationSpeed} size={currentDotSize} count={currentDotCount} />
          <CurrentDot path={PATH.three.Q} active={activeOutput} speed={animationSpeed} size={currentDotSize} count={currentDotCount} />
        </>
      )}
    </g>
  );
}

/* -------------------------------------------------------
   6-input NOR circuit
------------------------------------------------------- */

function SixInputNorFunction({
  inputs,
  logic,
  interactive,
  showTruthValues,
  showCurrentDots,
  animationSpeed,
  currentDotCount,
  currentDotSize,
  isStepMode,
  simulationStep,
  debug = false,
  onToggleInput,
}: {
  inputs: InputState;
  logic: LogicState;
  interactive: boolean;
  showTruthValues: boolean;
  showCurrentDots: boolean;
  animationSpeed: number;
  currentDotCount: number;
  currentDotSize: number;
  isStepMode: boolean;
  simulationStep: SimulationStep;
  debug?: boolean;
  onToggleInput: (key: InputKey) => void;
}) {
  const live = !isStepMode;
  const inputStage = live || simulationStep === 1;
  const gateStage = live || simulationStep === 2;
  const outputStage = live || simulationStep === 3 || simulationStep === 4;
  const resultStage = live || simulationStep === 4;

  const inputActive: InputState = {
    A: inputs.A && inputStage,
    B: inputs.B && inputStage,
    C: inputs.C && inputStage,
    D: inputs.D && inputStage,
    E: inputs.E && inputStage,
    F: inputs.F && inputStage,
  };

  const firstGateActive: Record<IntermediateKey, boolean> = {
    AB: logic.AB && gateStage,
    CD: logic.CD && gateStage,
    EF: logic.EF && gateStage,
  };

  const intermediateActive: Record<IntermediateKey, boolean> = {
    AB: logic.AB && outputStage,
    CD: logic.CD && outputStage,
    EF: logic.EF && outputStage,
  };

  const finalGateActive = gateStage && (logic.rawOr || logic.Q);
  const outputActive = logic.Q && outputStage;
  const terminalActive = logic.Q && resultStage;

  const inputRows: readonly {
    key: InputKey;
    x: number;
    y: number;
    labelX: number;
    labelY: number;
    valueX: number;
    valueY: number;
    path: string;
  }[] = [
    { key: "A", x: 27, y: 16, labelX: 0, labelY: 21, valueX: 38, valueY: 13, path: PATH.six.inputA },
    { key: "B", x: 27, y: 44, labelX: 0, labelY: 49, valueX: 38, valueY: 51, path: PATH.six.inputB },
    { key: "C", x: 27, y: 92, labelX: 0, labelY: 97, valueX: 38, valueY: 89, path: PATH.six.inputC },
    { key: "D", x: 27, y: 121, labelX: 0, labelY: 126, valueX: 38, valueY: 128, path: PATH.six.inputD },
    { key: "E", x: 27, y: 168, labelX: 0, labelY: 173, valueX: 38, valueY: 165, path: PATH.six.inputE },
    { key: "F", x: 27, y: 197, labelX: 0, labelY: 202, valueX: 38, valueY: 205, path: PATH.six.inputF },
  ];

  const intermediateRows: readonly {
    key: IntermediateKey;
    label: string;
    labelX: number;
    labelY: number;
    valueX: number;
    valueY: number;
    path: string;
  }[] = [
    { key: "AB", label: "A+B", labelX: 160, labelY: 22, valueX: 194, valueY: 22, path: PATH.six.AB },
    { key: "CD", label: "C+D", labelX: 160, labelY: 99, valueX: 194, valueY: 99, path: PATH.six.CD },
    { key: "EF", label: "E+F", labelX: 160, labelY: 175, valueX: 194, valueY: 175, path: PATH.six.EF },
  ];

  return (
    <g transform={`translate(${COMPONENT_OFFSET.sixFunction.x} ${COMPONENT_OFFSET.sixFunction.y})`}>
      {inputRows.map((item) => (
        <InputTerminal
          key={item.key}
          inputKey={item.key}
          x={item.x}
          y={item.y}
          labelX={item.labelX}
          labelY={item.labelY}
          valueX={item.valueX}
          valueY={item.valueY}
          active={inputs[item.key]}
          highlighted={inputActive[item.key]}
          interactive={interactive}
          showValue={showTruthValues}
          debug={debug}
          onToggle={onToggleInput}
        />
      ))}

      {inputRows.map((item) =>
        inputActive[item.key] ? (
          <ActiveWire key={item.key} d={item.path} />
        ) : (
          <Wire key={item.key} d={item.path} />
        )
      )}

      <OrGate x={75} y={1} w={76} h={58} plusSize={17} active={firstGateActive.AB} />
      <OrGate x={75} y={78} w={76} h={58} plusSize={17} active={firstGateActive.CD} />
      <OrGate x={75} y={154} w={76} h={58} plusSize={17} active={firstGateActive.EF} />

      {intermediateRows.map((item) => (
        <React.Fragment key={item.key}>
          <Label x={item.labelX} y={item.labelY}>
            {item.label}
          </Label>
          {showTruthValues && (
            <ValueLabel x={item.valueX} y={item.valueY} active={logic[item.key]}>
              = {boolToBit(logic[item.key])}
            </ValueLabel>
          )}
        </React.Fragment>
      ))}

      {intermediateRows.map((item) =>
        intermediateActive[item.key] ? (
          <ActiveWire key={item.key} d={item.path} />
        ) : (
          <Wire key={item.key} d={item.path} />
        )
      )}

      <OrGate x={245} y={93} w={84} h={58} plusSize={17} active={finalGateActive} />
      <InversionBubble cx={333} cy={122} active={outputActive} />

      {outputActive ? <ActiveWire d={PATH.six.Q} /> : <Wire d={PATH.six.Q} />}
      <Terminal x={357} y={122} active={terminalActive} debug={debug} />

      <Label x={376} y={129}>Q</Label>

      {showTruthValues && (
        <ValueLabel x={374} y={146} active={logic.Q}>
          = {boolToBit(logic.Q)}
        </ValueLabel>
      )}

      {showCurrentDots && (
        <>
          {inputRows.map((item) => (
            <CurrentDot
              key={`dot-${item.key}`}
              path={item.path}
              active={inputActive[item.key]}
              speed={animationSpeed}
              size={currentDotSize}
              count={currentDotCount}
            />
          ))}

          {intermediateRows.map((item) => (
            <CurrentDot
              key={`dot-${item.key}`}
              path={item.path}
              active={intermediateActive[item.key]}
              speed={animationSpeed}
              size={currentDotSize}
              count={Math.max(2, currentDotCount)}
            />
          ))}

          <CurrentDot
            path={PATH.six.Q}
            active={outputActive}
            speed={animationSpeed}
            size={currentDotSize}
            count={currentDotCount}
          />
        </>
      )}

      <Caption x={76} y={240}>
        6 input “NOR” function
      </Caption>
    </g>
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

function TabButton({ label, active, onClick }: TabButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={[
        "rounded-xl px-4 py-2 text-sm font-bold transition",
        active
          ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-200"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function StatusBadge({ active }: StatusBadgeProps) {
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
      NOR Output {active ? "ON" : "OFF"}
    </span>
  );
}

function SpeedSlider({ value, onChange }: SpeedSliderProps) {
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

      <div className="mt-1 flex justify-between text-[11px] font-medium text-slate-500">
        <span>Fast</span>
        <span>Slow</span>
      </div>
    </div>
  );
}

function PresetControls({ onPreset }: PresetControlsProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
        Input Presets
      </div>

      <div className="grid grid-cols-2 gap-2">
        <ControlButton onClick={() => onPreset("allOff")}>All OFF</ControlButton>
        <ControlButton onClick={() => onPreset("allOn")}>All ON</ControlButton>
        <ControlButton onClick={() => onPreset("alt101010")}>101010</ControlButton>
        <ControlButton onClick={() => onPreset("alt010101")}>010101</ControlButton>
        <ControlButton onClick={() => onPreset("onlyA")}>Only A ON</ControlButton>
        <ControlButton onClick={() => onPreset("onlyLast")}>Only Last ON</ControlButton>
        <ControlButton onClick={() => onPreset("random")}>Random</ControlButton>
      </div>
    </div>
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

function StepProgress({ enabled, step }: StepProgressProps) {
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

function FormulaPanel({ variant, inputs, logic }: FormulaPanelProps) {
  const evaluated =
    variant === "two"
      ? `Q = NOT(${boolToBit(inputs.A)} OR ${boolToBit(inputs.B)}) = ${boolToBit(
          logic.Q
        )}`
      : variant === "three"
      ? `Q = NOT(${boolToBit(inputs.A)} OR ${boolToBit(inputs.B)} OR ${boolToBit(
          inputs.C
        )}) = ${boolToBit(logic.Q)}`
      : `Q = NOT((${boolToBit(inputs.A)} OR ${boolToBit(
          inputs.B
        )}) OR (${boolToBit(inputs.C)} OR ${boolToBit(
          inputs.D
        )}) OR (${boolToBit(inputs.E)} OR ${boolToBit(inputs.F)})) = ${boolToBit(
          logic.Q
        )}`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-bold text-slate-900">Formula Panel</h3>

      <div className="grid gap-2 text-sm text-slate-700">
        <p className="font-semibold text-slate-900">{getFormulaTitle(variant)}</p>

        {variant === "six" && (
          <>
            <p>
              <strong>A+B</strong> = A OR B = {boolToBit(logic.AB)}
            </p>
            <p>
              <strong>C+D</strong> = C OR D = {boolToBit(logic.CD)}
            </p>
            <p>
              <strong>E+F</strong> = E OR F = {boolToBit(logic.EF)}
            </p>
          </>
        )}

        <div className="mt-2 rounded-xl bg-slate-50 p-3 font-mono text-xs text-slate-900 ring-1 ring-slate-200">
          {evaluated}
        </div>
      </div>
    </div>
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

function CopyTruthTableButton({ text }: CopyTruthTableButtonProps) {
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

function TruthTable({ variant, inputs }: TruthTableProps) {
  const [onlyCurrentRow, setOnlyCurrentRow] = useState(false);
  const [onlyQOneRows, setOnlyQOneRows] = useState(false);
  const [onlyQZeroRows, setOnlyQZeroRows] = useState(false);

  const keys = useMemo(() => getActiveInputKeys(variant), [variant]);
  const rowCount = 2 ** keys.length;

  const rows = useMemo(() => {
    return Array.from({ length: rowCount }, (_, index) => {
      const rowInputs = createTruthTableState(index, keys);
      const rowLogic = calculateLogic(rowInputs, variant);

      return {
        index,
        inputs: rowInputs,
        logic: rowLogic,
      };
    });
  }, [keys, rowCount, variant]);

  const visibleRows = rows.filter((row) => {
    const currentRow = isSameInputState(row.inputs, inputs, keys);

    if (onlyCurrentRow && !currentRow) return false;
    if (onlyQOneRows && !row.logic.Q) return false;
    if (onlyQZeroRows && row.logic.Q) return false;

    return true;
  });

  const truthTableText = useMemo(() => {
    const header =
      variant === "six"
        ? [...keys, "A+B", "C+D", "E+F", "Q"].join("\t")
        : [...keys, "Q"].join("\t");

    const body = rows
      .map((row) => {
        const inputValues = keys.map((key) => String(boolToBit(row.inputs[key])));

        if (variant === "six") {
          return [
            ...inputValues,
            boolToBit(row.logic.AB),
            boolToBit(row.logic.CD),
            boolToBit(row.logic.EF),
            boolToBit(row.logic.Q),
          ].join("\t");
        }

        return [...inputValues, boolToBit(row.logic.Q)].join("\t");
      })
      .join("\n");

    return `${header}\n${body}`;
  }, [keys, rows, variant]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-slate-900">NOR Truth Table</h3>
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
        <table className="w-full min-w-[430px] border-collapse text-center text-xs">
          <thead className="sticky top-0 bg-slate-100 text-slate-700">
            <tr>
              {keys.map((key) => (
                <th key={key} className="border border-slate-200 px-2 py-2">
                  {key}
                </th>
              ))}
              {variant === "six" && (
                <>
                  <th className="border border-slate-200 px-2 py-2">A+B</th>
                  <th className="border border-slate-200 px-2 py-2">C+D</th>
                  <th className="border border-slate-200 px-2 py-2">E+F</th>
                </>
              )}
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
                    row.logic.Q ? "bg-blue-50" : "bg-white",
                    currentRow ? "outline outline-2 outline-blue-600" : "",
                  ].join(" ")}
                >
                  {keys.map((key) => (
                    <BitCell key={key} value={row.inputs[key]} />
                  ))}

                  {variant === "six" && (
                    <>
                      <BitCell value={row.logic.AB} />
                      <BitCell value={row.logic.CD} />
                      <BitCell value={row.logic.EF} />
                    </>
                  )}

                  <td
                    className={[
                      "border border-slate-200 px-2 py-1 font-black",
                      row.logic.Q
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-500",
                    ].join(" ")}
                  >
                    {boolToBit(row.logic.Q)}
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

function WaveformPanel({ variant, samples }: WaveformPanelProps) {
  const keys = getActiveInputKeys(variant);
  const rows: readonly (InputKey | "Q")[] = [...keys, "Q"];
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
          aria-label="Digital waveform timeline for inputs and NOR output"
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
  variant,
  inputs,
  logic,
  isAutoRunning,
  isStepMode,
  simulationStep,
  isShowingCurrentDots,
  isShowingTruthValues,
  isShowingTruthTable,
  dotSpeed,
  showFormulaPanel,
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
  variant: DiagramVariant;
  inputs: InputState;
  logic: LogicState;
  isAutoRunning: boolean;
  isStepMode: boolean;
  simulationStep: SimulationStep;
  isShowingCurrentDots: boolean;
  isShowingTruthValues: boolean;
  isShowingTruthTable: boolean;
  dotSpeed: number;
  showFormulaPanel: boolean;
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
  const activeKeys = getActiveInputKeys(variant);

  return (
    <aside className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-black text-slate-900">Control Panel</h3>
          <p className="text-xs font-medium text-slate-500">
            {variant === "two"
              ? "2-input NOR gate"
              : variant === "three"
              ? "3-input NOR gate"
              : "6-input NOR gate"}
          </p>
        </div>

        <StatusBadge active={logic.Q} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
          Circuit Formula
        </div>
        <p className="font-mono text-sm font-bold text-blue-900">
          {getFormulaTitle(variant)}
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
          Inputs
        </div>
        <div className="flex flex-wrap gap-2">
          {activeKeys.map((key) => (
            <StatePill key={key} label={key} value={inputs[key]} />
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
          Outputs
        </div>
        <div className="flex flex-wrap gap-2">
          {variant === "six" && (
            <>
              <StatePill label="A+B" value={logic.AB} />
              <StatePill label="C+D" value={logic.CD} />
              <StatePill label="E+F" value={logic.EF} />
            </>
          )}
          <StatePill label="Q" value={logic.Q} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {activeKeys.map((key) => (
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

      <PresetControls onPreset={onPreset} />

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

      {showFormulaPanel && (
        <FormulaPanel variant={variant} inputs={inputs} logic={logic} />
      )}
    </aside>
  );
}

/* -------------------------------------------------------
   Main component
------------------------------------------------------- */

export default function AndFunctionDiagram({
  variant = "six",
  initialInputs,
  interactive = true,
  showTabs = true,
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
  showDebugTerminals = false,
  className = "",
  style,
  ...svgProps
}: AndFunctionDiagramProps) {
  const [activeVariant, setActiveVariant] = useState<DiagramVariant>(variant);
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

  const currentVariant = showTabs ? activeVariant : variant;
  const currentKeys = useMemo(
    () => getActiveInputKeys(currentVariant),
    [currentVariant]
  );

  const logic = useMemo(
    () => calculateLogic(inputs, currentVariant),
    [inputs, currentVariant]
  );

  useEffect(() => {
    setActiveVariant(variant);
  }, [variant]);

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
        q: logic.Q,
      };

      const last = previous[previous.length - 1];

      if (
        last &&
        last.q === nextSample.q &&
        isSameInputState(last.inputs, nextSample.inputs, currentKeys)
      ) {
        return previous;
      }

      return [...previous, nextSample].slice(-16);
    });
  }, [inputs, logic.Q, currentKeys]);

  useEffect(() => {
    if (!isAutoRunning) return;

    const intervalId = window.setInterval(() => {
      setInputs((previous) => applyPreset(previous, currentKeys, "random"));
      setSimulationStep(1);
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isAutoRunning, currentKeys]);

  const toggleInput = (key: InputKey) => {
    setInputs((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
    setSimulationStep(1);
  };

  const applyInputPreset = (preset: PresetType) => {
    setInputs((previous) => applyPreset(previous, currentKeys, preset));
    setSimulationStep(1);
  };

  const nextStep = () => {
    setSimulationStep((previous) => getNextStep(previous));
  };

  return (
    <div className="w-full max-w-[1220px] bg-white">
      {showTabs && (
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <TabButton
                key={tab.key}
                label={tab.label}
                active={currentVariant === tab.key}
                onClick={() => {
                  setActiveVariant(tab.key);
                  setSimulationStep(1);
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
        {showControls && (
          <LeftControlPanel
            variant={currentVariant}
            inputs={inputs}
            logic={logic}
            isAutoRunning={isAutoRunning}
            isStepMode={isStepMode}
            simulationStep={simulationStep}
            isShowingCurrentDots={isShowingCurrentDots}
            isShowingTruthValues={isShowingTruthValues}
            isShowingTruthTable={isShowingTruthTable}
            dotSpeed={dotSpeed}
            showFormulaPanel={showFormulaPanel}
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
            <svg
              viewBox={VIEW_BOX[currentVariant]}
              role="img"
              aria-label="NOR logic gate simulation"
              className={`h-auto w-full rounded-2xl bg-white ${className}`}
              preserveAspectRatio="xMinYMin meet"
              style={{
                transform: `scale(${SCALE.CIRCUIT_CANVAS_SCALE})`,
                transformOrigin: "top left",
                ...style,
              }}
              {...svgProps}
            >
              <rect width="100%" height="100%" fill={COLORS.background} />

              {currentVariant === "two" && (
                <TwoInputNorGate
                  inputs={inputs}
                  logic={logic}
                  interactive={interactive}
                  showTruthValues={isShowingTruthValues}
                  showCurrentDots={isShowingCurrentDots}
                  currentDotCount={currentDotCount}
                  currentDotSize={currentDotSize}
                  animationSpeed={dotSpeed}
                  isStepMode={isStepMode}
                  simulationStep={simulationStep}
                  debug={showDebugTerminals}
                  onToggleInput={toggleInput}
                />
              )}

              {currentVariant === "three" && (
                <ThreeInputNorGate
                  inputs={inputs}
                  logic={logic}
                  interactive={interactive}
                  showTruthValues={isShowingTruthValues}
                  showCurrentDots={isShowingCurrentDots}
                  currentDotCount={currentDotCount}
                  currentDotSize={currentDotSize}
                  animationSpeed={dotSpeed}
                  isStepMode={isStepMode}
                  simulationStep={simulationStep}
                  debug={showDebugTerminals}
                  onToggleInput={toggleInput}
                />
              )}

              {currentVariant === "six" && (
                <SixInputNorFunction
                  inputs={inputs}
                  logic={logic}
                  interactive={interactive}
                  showTruthValues={isShowingTruthValues}
                  showCurrentDots={isShowingCurrentDots}
                  animationSpeed={dotSpeed}
                  currentDotCount={currentDotCount}
                  currentDotSize={currentDotSize}
                  isStepMode={isStepMode}
                  simulationStep={simulationStep}
                  debug={showDebugTerminals}
                  onToggleInput={toggleInput}
                />
              )}
            </svg>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Simulation Explanation
              </h3>
              <StatusBadge active={logic.Q} />
            </div>

            <div className="grid gap-2 text-sm text-slate-700">
              <p>
                <strong>Formula:</strong> {getFormulaTitle(currentVariant)}
              </p>
              <p>
                <strong>Current step:</strong>{" "}
                {isStepMode
                  ? `Step ${simulationStep}: ${stepText(
                      currentVariant,
                      simulationStep
                    )}`
                  : "Live simulation"}
              </p>
              <p>
                <strong>Output:</strong>{" "}
                {logic.Q
                  ? "All required inputs are 0, so NOR output Q = 1."
                  : "At least one required input is 1, so NOR output Q = 0."}
              </p>
            </div>
          </div>

          {showWaveform && (
            <WaveformPanel variant={currentVariant} samples={waveformSamples} />
          )}

          {isShowingTruthTable && (
            <TruthTable variant={currentVariant} inputs={inputs} />
          )}
        </main>
      </div>
    </div>
  );
}