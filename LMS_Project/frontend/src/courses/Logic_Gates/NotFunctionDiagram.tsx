"use client";

import React, { useEffect, useMemo, useState } from "react";

type DiagramVariant = "not";

export type InputKey = "A";
export type InputState = Record<InputKey, boolean>;
export type SimulationStep = 1 | 2 | 3 | 4;

export type LogicState = {
  A: boolean;
  Q: boolean;
};

type XY = { x: number; y: number };

type PresetType = "allOff" | "allOn" | "toggle" | "random";

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

type NotGateProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  active?: boolean;
  bubbleActive?: boolean;
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
  inputs: InputState;
  logic: LogicState;
};

type TruthTableProps = {
  inputs: InputState;
};

type WaveformSample = {
  inputs: InputState;
  q: boolean;
};

type WaveformPanelProps = {
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

const INPUT_KEYS: readonly InputKey[] = ["A"];

const TABS: readonly { key: DiagramVariant; label: string }[] = [
  { key: "not", label: "1-input NOT" },
];

const VIEW_BOX: Record<DiagramVariant, string> = {
  not: "0 0 230 90",
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
  notBlue: "#1260aa",
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
  bubbleR: 5,
};

const COMPONENT_OFFSET = {
  notGate: { x: 0, y: 0 },
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
  not: {
    inputA: "M 35 45 H 82",
    Q: "M 150 45 H 195",
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
  };
}

function calculateLogic(inputs: InputState): LogicState {
  return {
    A: inputs.A,
    Q: !inputs.A,
  };
}

function applyPreset(previous: InputState, preset: PresetType): InputState {
  if (preset === "allOff") return { A: false };
  if (preset === "allOn") return { A: true };
  if (preset === "toggle") return { A: !previous.A };
  return { A: Math.random() >= 0.5 };
}

function createTruthTableState(index: number): InputState {
  return {
    A: Boolean(index),
  };
}

function isSameInputState(a: InputState, b: InputState) {
  return a.A === b.A;
}

function getNextStep(step: SimulationStep): SimulationStep {
  if (step === 1) return 2;
  if (step === 2) return 3;
  if (step === 3) return 4;
  return 1;
}

function getFormulaTitle() {
  return "Q = NOT(A)";
}

function stepText(step: SimulationStep) {
  if (step === 1) return "Input A is selected.";
  if (step === 2) return "The NOT gate inverts A.";
  if (step === 3) return "The output path carries the inverted result.";
  return "Q shows the final NOT output.";
}

/* -------------------------------------------------------
   SVG reusable helpers
------------------------------------------------------- */

function notGatePath(x: number, y: number, w: number, h: number) {
  const scaledW = w * SCALE.CIRCUIT_COMPONENT_SCALE;
  const scaledH = h * SCALE.CIRCUIT_COMPONENT_SCALE;

  return [
    `M ${x} ${y}`,
    `L ${x} ${y + scaledH}`,
    `L ${x + scaledW} ${y + scaledH / 2}`,
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
  const rawId = React.useId();
  const pathId = `current-dot-${rawId.replace(/:/g, "")}`;

  if (!active) return null;

  const safeCount = Math.max(1, Math.min(8, Math.floor(count)));
  const safeSpeed = Math.max(0.25, speed);
  const safeSize = Math.max(1, size);
  const duration = `${safeSpeed}s`;

  return (
    <g>
      <path id={pathId} d={path} fill="none" stroke="none" />

      {Array.from({ length: safeCount }, (_, index) => {
        const delay = (safeSpeed / safeCount) * index;

        return (
          <circle
            key={`${pathId}-${index}`}
            r={safeSize}
            fill={COLORS.currentDot}
            opacity={0}
          >
            <animateMotion dur={duration} begin={`${delay}s`} repeatCount="indefinite">
              <mpath href={`#${pathId}`} />
            </animateMotion>
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

function NotGate({ x, y, w, h, active = false, bubbleActive = false }: NotGateProps) {
  const offsetX = COMPONENT_OFFSET.notGate.x;
  const offsetY = COMPONENT_OFFSET.notGate.y;
  const bubbleCx = x + offsetX + w + GATE.bubbleR;
  const bubbleCy = y + offsetY + h / 2;

  return (
    <g>
      <path
        d={notGatePath(x + offsetX, y + offsetY, w, h)}
        fill={active ? COLORS.gateFillActive : COLORS.gateFill}
        stroke={COLORS.gateStroke}
        strokeWidth={GATE.strokeWidth}
      />

      <circle
        cx={bubbleCx}
        cy={bubbleCy}
        r={GATE.bubbleR}
        fill={COLORS.background}
        stroke={bubbleActive ? COLORS.wireActive : COLORS.gateStroke}
        strokeWidth={GATE.strokeWidth}
      />

      <text
        x={x + offsetX + w * 0.42}
        y={y + offsetY + h / 2}
        fill={COLORS.notBlue}
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize={14}
        fontWeight={700}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        1
      </text>
    </g>
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
      aria-label={`Toggle input ${inputKey}. Current value is ${boolToBit(active)}`}
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
   NOT circuit
------------------------------------------------------- */

function NotGateCircuit({
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

  const activeInput = inputs.A && inputStage;
  const activeGate = gateStage;
  const activeOutput = logic.Q && outputStage;
  const activeTerminal = logic.Q && resultStage;

  return (
    <g>
      <InputTerminal
        inputKey="A"
        x={31}
        y={45}
        labelX={7}
        labelY={50}
        valueX={42}
        valueY={32}
        active={inputs.A}
        highlighted={activeInput}
        interactive={interactive}
        showValue={showTruthValues}
        debug={debug}
        onToggle={onToggleInput}
      />

      {activeInput ? <ActiveWire d={PATH.not.inputA} /> : <Wire d={PATH.not.inputA} />}

      <NotGate
        x={82}
        y={20}
        w={58}
        h={50}
        active={activeGate}
        bubbleActive={activeOutput}
      />

      {activeOutput ? <ActiveWire d={PATH.not.Q} /> : <Wire d={PATH.not.Q} />}

      <Terminal x={199} y={45} active={activeTerminal} debug={debug} />

      <Label x={211} y={50}>
        Q
      </Label>

      {showTruthValues && (
        <ValueLabel x={207} y={68} active={logic.Q}>
          = {boolToBit(logic.Q)}
        </ValueLabel>
      )}

      {showCurrentDots && (
        <>
          <CurrentDot
            path={PATH.not.inputA}
            active={activeInput}
            speed={animationSpeed}
            size={currentDotSize}
            count={currentDotCount}
          />

          <CurrentDot
            path={PATH.not.Q}
            active={activeOutput}
            speed={animationSpeed}
            size={currentDotSize}
            count={currentDotCount}
          />
        </>
      )}

      <Caption x={73} y={84}>
        Logic NOT Gate / Inverter
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
      NOT Output {active ? "ON" : "OFF"}
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
        <ControlButton onClick={() => onPreset("allOff")}>A = 0</ControlButton>
        <ControlButton onClick={() => onPreset("allOn")}>A = 1</ControlButton>
        <ControlButton onClick={() => onPreset("toggle")}>Toggle A</ControlButton>
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

function FormulaPanel({ inputs, logic }: FormulaPanelProps) {
  const evaluated = `Q = NOT(${boolToBit(inputs.A)}) = ${boolToBit(logic.Q)}`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-bold text-slate-900">Formula Panel</h3>

      <div className="grid gap-2 text-sm text-slate-700">
        <p className="font-semibold text-slate-900">{getFormulaTitle()}</p>

        <p>
          <strong>NOT rule:</strong> output is the opposite of input.
        </p>

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

function TruthTable({ inputs }: TruthTableProps) {
  const [onlyCurrentRow, setOnlyCurrentRow] = useState(false);
  const [onlyQOneRows, setOnlyQOneRows] = useState(false);
  const [onlyQZeroRows, setOnlyQZeroRows] = useState(false);

  const rows = useMemo(() => {
    return Array.from({ length: 2 }, (_, index) => {
      const rowInputs = createTruthTableState(index);
      const rowLogic = calculateLogic(rowInputs);

      return {
        index,
        inputs: rowInputs,
        logic: rowLogic,
      };
    });
  }, []);

  const visibleRows = rows.filter((row) => {
    const currentRow = isSameInputState(row.inputs, inputs);

    if (onlyCurrentRow && !currentRow) return false;
    if (onlyQOneRows && !row.logic.Q) return false;
    if (onlyQZeroRows && row.logic.Q) return false;

    return true;
  });

  const truthTableText = useMemo(() => {
    const header = ["A", "Q"].join("\t");

    const body = rows
      .map((row) =>
        [boolToBit(row.inputs.A), boolToBit(row.logic.Q)].join("\t")
      )
      .join("\n");

    return `${header}\n${body}`;
  }, [rows]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-slate-900">NOT Truth Table</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          {visibleRows.length} / 2 rows
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

      <div className="overflow-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[240px] border-collapse text-center text-xs">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="border border-slate-200 px-2 py-2">A</th>
              <th className="border border-slate-200 px-2 py-2">Q</th>
            </tr>
          </thead>

          <tbody>
            {visibleRows.map((row) => {
              const currentRow = isSameInputState(row.inputs, inputs);

              return (
                <tr
                  key={row.index}
                  className={[
                    row.logic.Q ? "bg-blue-50" : "bg-white",
                    currentRow ? "outline outline-2 outline-blue-600" : "",
                  ].join(" ")}
                >
                  <BitCell value={row.inputs.A} />

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

function WaveformPanel({ samples }: WaveformPanelProps) {
  const rows: readonly (InputKey | "Q")[] = ["A", "Q"];
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
          aria-label="Digital waveform timeline for input A and NOT output Q"
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
  return (
    <aside className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-black text-slate-900">Control Panel</h3>
          <p className="text-xs font-medium text-slate-500">
            1-input NOT gate
          </p>
        </div>

        <StatusBadge active={logic.Q} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
          Circuit Formula
        </div>
        <p className="font-mono text-sm font-bold text-blue-900">
          {getFormulaTitle()}
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
          Input
        </div>
        <div className="flex flex-wrap gap-2">
          <StatePill label="A" value={inputs.A} />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
          Output
        </div>
        <div className="flex flex-wrap gap-2">
          <StatePill label="Q" value={logic.Q} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <ControlButton
          active={inputs.A}
          ariaLabel="Toggle input A"
          onClick={() => onToggleInput("A")}
        >
          Toggle A
        </ControlButton>
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

      {showFormulaPanel && <FormulaPanel inputs={inputs} logic={logic} />}
    </aside>
  );
}

/* -------------------------------------------------------
   Main component
------------------------------------------------------- */

export default function AndFunctionDiagram({
  variant = "not",
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

  const logic = useMemo(() => calculateLogic(inputs), [inputs]);

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

      if (last && last.q === nextSample.q && isSameInputState(last.inputs, nextSample.inputs)) {
        return previous;
      }

      return [...previous, nextSample].slice(-16);
    });
  }, [inputs, logic.Q]);

  useEffect(() => {
    if (!isAutoRunning) return;

    const intervalId = window.setInterval(() => {
      setInputs((previous) => applyPreset(previous, "random"));
      setSimulationStep(1);
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isAutoRunning]);

  const toggleInput = (key: InputKey) => {
    setInputs((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
    setSimulationStep(1);
  };

  const applyInputPreset = (preset: PresetType) => {
    setInputs((previous) => applyPreset(previous, preset));
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
              aria-label="NOT logic gate simulation"
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

              <NotGateCircuit
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
                <strong>Formula:</strong> {getFormulaTitle()}
              </p>
              <p>
                <strong>Current step:</strong>{" "}
                {isStepMode
                  ? `Step ${simulationStep}: ${stepText(simulationStep)}`
                  : "Live simulation"}
              </p>
              <p>
                <strong>Output:</strong>{" "}
                {logic.Q
                  ? "Input A is 0, so NOT output Q = 1."
                  : "Input A is 1, so NOT output Q = 0."}
              </p>
            </div>
          </div>

          {showWaveform && <WaveformPanel samples={waveformSamples} />}

          {isShowingTruthTable && <TruthTable inputs={inputs} />}
        </main>
      </div>
    </div>
  );
}