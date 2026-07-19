"use client";

import {
  Activity,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Cpu,
  FileText,
  Info,
  Maximize,
  Monitor,
  Play,
  RotateCcw,
  Settings,
  Square,
  Sun,
  Volume2,
  Zap,
} from "lucide-react";
import React, { useMemo, useState } from "react";

type Tab = "Simulator" | "Theory" | "Wiring Diagram" | "Quiz" | "Report";
type ServoType = "AC Servo" | "DC Servo" | "BLDC Servo" | "Closed-loop Servo";
type ControlMode = "Position Control" | "Speed Control" | "Torque Control";
type Direction = "CW" | "CCW";
type LoadType = "No Load" | "Light Load" | "Heavy Load" | "Jam Condition";

const VIEW_BOX = "0 0 1120 560";
const VIEW_BOX_WIDTH = 1120;
const VIEW_BOX_HEIGHT = 560;

const CIRCUIT_CANVAS_SCALE = 1;

const CIRCUIT_COMPONENT_SCALE = {
  base: 1,
  motorBody: 1,
  rotorOuter: 1,
  rotorInner: 1,
  shaft: 1,
  drive: 1,
  cable: 1,
  feedbackChart: 1,
} as const;

const BASE_WIRE_WIDTH = 18;
const CIRCUIT_WIRE_SCALE = 1;

const STYLE = {
  text: "#0f172a",
  muted: "#64748b",
  wire: "#111827",
  active: "#22c55e",
  command: "#2563eb",
  danger: "#ef4444",
  panel: "#f8fafc",
  metal: "#e5e7eb",
} as const;

type Point = { x: number; y: number };
type ComponentBox = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
};

function scaleComponent(component: ComponentBox, scale: number): ComponentBox {
  const width = component.width * scale;
  const height = component.height * scale;

  return {
    ...component,
    x: component.x - (width - component.width) / 2,
    y: component.y - (height - component.height) / 2,
    width,
    height,
  };
}

function pointOnComponent(
  component: ComponentBox,
  xRatio: number,
  yRatio: number,
): Point {
  return {
    x: component.x + component.width * xRatio,
    y: component.y + component.height * yRatio,
  };
}

function buildCanvasScaleTransform(scale: number) {
  if (scale === 1) return undefined;

  const centerX = VIEW_BOX_WIDTH / 2;
  const centerY = VIEW_BOX_HEIGHT / 2;

  return `translate(${centerX} ${centerY}) scale(${scale}) translate(${-centerX} ${-centerY})`;
}

function clampValue(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

const BASE_COMPONENT = {
  base: { x: 70, y: 420, width: 980, height: 42, rotate: 0 },
  rail: { x: 105, y: 435, width: 910, height: 10, rotate: 0 },
  motorBody: { x: 205, y: 160, width: 410, height: 250, rotate: 0 },
  rotorOuter: { x: 293, y: 173, width: 224, height: 224, rotate: 0 },
  rotorInner: { x: 329, y: 209, width: 152, height: 152, rotate: 0 },
  drivePort: { x: 600, y: 245, width: 82, height: 78, rotate: 0 },
  drive: { x: 875, y: 210, width: 155, height: 125, rotate: 0 },
  feedbackChart: { x: 680, y: 365, width: 210, height: 70, rotate: 0 },
} as const satisfies Record<string, ComponentBox>;

const COMPONENT = {
  base: scaleComponent(BASE_COMPONENT.base, CIRCUIT_COMPONENT_SCALE.base),
  rail: scaleComponent(BASE_COMPONENT.rail, CIRCUIT_COMPONENT_SCALE.base),
  motorBody: scaleComponent(
    BASE_COMPONENT.motorBody,
    CIRCUIT_COMPONENT_SCALE.motorBody,
  ),
  rotorOuter: scaleComponent(
    BASE_COMPONENT.rotorOuter,
    CIRCUIT_COMPONENT_SCALE.rotorOuter,
  ),
  rotorInner: scaleComponent(
    BASE_COMPONENT.rotorInner,
    CIRCUIT_COMPONENT_SCALE.rotorInner,
  ),
  drivePort: scaleComponent(
    BASE_COMPONENT.drivePort,
    CIRCUIT_COMPONENT_SCALE.drive,
  ),
  drive: scaleComponent(BASE_COMPONENT.drive, CIRCUIT_COMPONENT_SCALE.drive),
  feedbackChart: scaleComponent(
    BASE_COMPONENT.feedbackChart,
    CIRCUIT_COMPONENT_SCALE.feedbackChart,
  ),
} as const;

const NODE = {
  motorCenter: pointOnComponent(COMPONENT.rotorOuter, 0.5, 0.5),
  rotorPointerEnd: { x: 405 + 86, y: 285 },
  commandPointerEnd: { x: 405 + 115, y: 285 },

  cableStart: { x: 682, y: 285 },
  cableMid1: { x: 745, y: 190 },
  cableMid2: { x: 815, y: 190 },
  cableEnd: { x: 875, y: 265 },

  feedbackCenter: {
    x: COMPONENT.feedbackChart.x + COMPONENT.feedbackChart.width / 2,
    y: COMPONENT.feedbackChart.y + COMPONENT.feedbackChart.height / 2,
  },
} as const;

const WIRE = {
  width: BASE_WIRE_WIDTH * CIRCUIT_WIRE_SCALE,
  cablePath: `M${NODE.cableStart.x} ${NODE.cableStart.y} C${NODE.cableMid1.x} ${NODE.cableMid1.y} ${NODE.cableMid2.x} ${NODE.cableMid2.y} ${NODE.cableEnd.x} ${NODE.cableEnd.y}`,
} as const;

const PATH = {
  cableMotion: WIRE.cablePath,
} as const;

const LABEL = {
  position: { x: 305, y: 115 },
  command: { x: 305, y: 150 },
  fault: { x: 500, y: 135 },
  servoType: { x: 215, y: 145 },
  footer1: { x: 80, y: 505 },
  footer2: { x: 80, y: 530 },
} as const;

export default function ServoMotorIndustrialLab() {
  const [tab, setTab] = useState<Tab>("Simulator");
  const [power, setPower] = useState(true);
  const [servoType, setServoType] = useState<ServoType>("AC Servo");
  const [controlMode, setControlMode] =
    useState<ControlMode>("Position Control");
  const [direction, setDirection] = useState<Direction>("CW");
  const [loadType, setLoadType] = useState<LoadType>("Light Load");
  const [command, setCommand] = useState(180);
  const [position, setPosition] = useState(120);
  const [faultCount, setFaultCount] = useState(0);

  const error = command - position;
  const loadFactor =
    loadType === "No Load"
      ? 0.2
      : loadType === "Light Load"
        ? 0.45
        : loadType === "Heavy Load"
          ? 0.82
          : 1;

  const torque = power
    ? Math.min(100, Math.abs(error) * 0.35 + loadFactor * 45)
    : 0;
  const speed = power ? Math.min(3000, Math.abs(error) * 10 + 300) : 0;
  const current = power ? 0.6 + loadFactor * 3.2 + Math.abs(error) / 180 : 0;
  const fault = power && (loadType === "Jam Condition" || current > 3.8);
  const running = power && !fault && Math.abs(error) > 1;

  function moveCommand(v: number) {
    const next = Number(Math.max(0, Math.min(360, v)).toFixed(0));
    setCommand(next);

    if (power && !fault) {
      setPosition((p) => p + (next - p) * 0.35);
    }
  }

  function jog(delta: number) {
    if (!power || fault) return;

    setPosition((p) =>
      Math.max(0, Math.min(360, p + (direction === "CW" ? delta : -delta))),
    );
  }

  function reset() {
    setPower(false);
    setServoType("AC Servo");
    setControlMode("Position Control");
    setDirection("CW");
    setLoadType("Light Load");
    setCommand(180);
    setPosition(120);
    setFaultCount(0);
    setTab("Simulator");
  }

  const logs = useMemo(() => {
    if (!power) return [["--:--", "Power OFF", "text-slate-500"]];

    return [
      ["10:24:15", "Servo Drive Enabled", "text-slate-700"],
      fault
        ? ["10:24:18", "Servo Fault / Overload", "text-red-600"]
        : ["10:24:23", "Servo Tracking Normal", "text-green-600"],
      [
        "10:24:18",
        `Error ${error.toFixed(1)}° / Current ${current.toFixed(2)} A`,
        "text-slate-900",
      ],
      ["LIVE", `${servoType} / ${controlMode}`, "text-blue-600"],
    ];
  }, [power, fault, error, current, servoType, controlMode]);

  return (
    <main className="min-h-screen bg-white p-3 text-slate-950 sm:p-4 lg:p-5">
      <div className="mx-auto max-w-[1560px] space-y-4">
        <Header tab={tab} setTab={setTab} />

        {tab !== "Simulator" ? (
          <LearningTab
            tab={tab}
            servoType={servoType}
            controlMode={controlMode}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <aside className="space-y-4 xl:col-span-3">
              <Panel title="SERVO CONFIGURATION" icon={<Settings size={20} />}>
                <Control label="Servo Type">
                  <Select
                    value={servoType}
                    onChange={(v: string) => setServoType(v as ServoType)}
                  >
                    <option>AC Servo</option>
                    <option>DC Servo</option>
                    <option>BLDC Servo</option>
                    <option>Closed-loop Servo</option>
                  </Select>
                </Control>

                <Control label="Control Mode">
                  <Select
                    value={controlMode}
                    onChange={(v: string) => setControlMode(v as ControlMode)}
                  >
                    <option>Position Control</option>
                    <option>Speed Control</option>
                    <option>Torque Control</option>
                  </Select>
                </Control>

                <Control label="Direction">
                  <Select
                    value={direction}
                    onChange={(v: string) => setDirection(v as Direction)}
                  >
                    <option>CW</option>
                    <option>CCW</option>
                  </Select>
                </Control>

                <Control label="Load Type">
                  <Select
                    value={loadType}
                    onChange={(v: string) => {
                      setLoadType(v as LoadType);
                      if (v === "Jam Condition") setFaultCount((n) => n + 1);
                    }}
                  >
                    <option>No Load</option>
                    <option>Light Load</option>
                    <option>Heavy Load</option>
                    <option>Jam Condition</option>
                  </Select>
                </Control>

                <Control label="Command">
                  <div className="input flex items-center justify-between">
                    <b>{command}</b>
                    <span>°</span>
                  </div>
                </Control>

                <Control label="Supply">
                  <div className="input flex items-center justify-between">
                    <span>220 V AC Drive</span>
                    <Zap size={15} className="text-blue-600" />
                  </div>
                </Control>
              </Panel>

              <Panel title="SERVO STATUS" icon={<Activity size={20} />}>
                <Status
                  label="Power"
                  value={power ? "Enabled" : "OFF"}
                  dot={power}
                />
                <Status
                  label="Run State"
                  value={running ? "TRACKING" : fault ? "FAULT" : "HOLD"}
                  badge={running || fault}
                  danger={fault}
                />
                <Status
                  label="Position"
                  value={`${position.toFixed(1)}°`}
                  distance
                />
                <Status label="Error" value={`${error.toFixed(1)}°`} />
                <Status label="Current" value={`${current.toFixed(2)} A`} />
              </Panel>

              <Panel title="INSTRUCTIONS" icon={<Info size={20} />}>
                <ol className="space-y-3 text-sm leading-relaxed">
                  <li>1. Select servo type and control mode.</li>
                  <li>2. Move command position with slider.</li>
                  <li>3. Observe encoder feedback and position error.</li>
                  <li>4. Test heavy load and jam fault condition.</li>
                </ol>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button onClick={() => setPower(true)} className="primaryBtn">
                    <Play size={17} /> Enable
                  </button>
                  <button
                    onClick={() => setPower(false)}
                    className="secondaryBtn"
                  >
                    <Square size={15} /> Stop
                  </button>
                  <button onClick={() => jog(5)} className="secondaryBtn">
                    Jog +5°
                  </button>
                  <button onClick={() => jog(20)} className="secondaryBtn">
                    Jog +20°
                  </button>
                  <button onClick={reset} className="secondaryBtn col-span-2">
                    <RotateCcw size={17} /> Reset
                  </button>
                </div>
              </Panel>
            </aside>

            <section className="space-y-4 xl:col-span-9">
              <Panel
                title="SERVO MOTOR SIMULATION AREA"
                icon={<Monitor size={20} />}
              >
                <div className="relative h-[420px] overflow-hidden rounded-xl bg-white sm:h-[500px] lg:h-[575px]">
                  <ServoScene
                    power={power}
                    running={running}
                    fault={fault}
                    servoType={servoType}
                    direction={direction}
                    loadType={loadType}
                    command={command}
                    position={position}
                    error={error}
                    current={current}
                    torque={torque}
                    speed={speed}
                  />

                  <LiveReadout
                    command={command}
                    position={position}
                    error={error}
                    current={current}
                    torque={torque}
                    speed={speed}
                    servoType={servoType}
                    controlMode={controlMode}
                    direction={direction}
                    loadType={loadType}
                    fault={fault}
                  />

                  <div className="absolute bottom-4 left-1/2 w-[86%] max-w-xl -translate-x-1/2 rounded-xl border bg-white/95 p-3 shadow-sm">
                    <input
                      type="range"
                      min={0}
                      max={360}
                      step={1}
                      value={command}
                      onChange={(e) => moveCommand(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                    <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                      <span>0°</span>
                      <span>Adjust servo command position</span>
                      <span>360°</span>
                    </div>
                  </div>
                </div>
              </Panel>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12">
                <Panel
                  title="I/O INDICATOR"
                  icon={<Cpu size={19} />}
                  className="xl:col-span-3"
                >
                  <div className="grid h-[190px] grid-cols-3 place-items-center">
                    <Lamp label="ENABLE" on={power} />
                    <Lamp label="SERVO" on={running} />
                    <Lamp label="FAULT" on={fault} danger />
                  </div>
                </Panel>

                <Panel
                  title="SERVO DRIVE CONNECTION"
                  icon={<Settings size={19} />}
                  className="xl:col-span-5"
                >
                  <WiringSvg
                    running={running}
                    fault={fault}
                    direction={direction}
                    error={error}
                    current={current}
                  />
                </Panel>

                <Panel
                  title="EVENT LOG"
                  icon={<ClipboardList size={19} />}
                  className="md:col-span-2 xl:col-span-4"
                >
                  <div className="space-y-4 pt-2 text-sm">
                    {logs.map(([time, msg, color], i) => (
                      <div key={i} className="grid grid-cols-[75px_1fr]">
                        <span>{time}</span>
                        <span className={color}>{msg}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-lg bg-slate-50 p-3 text-xs">
                    Fault Count: <b>{faultCount}</b>
                  </div>
                </Panel>
              </div>
            </section>
          </div>
        )}
      </div>

      <style jsx global>{`
        .input {
          height: 42px;
          width: 100%;
          border: 1px solid #dbe3ef;
          border-radius: 8px;
          background: white;
          padding: 0 12px;
          outline: none;
          font-size: 14px;
        }
        .primaryBtn {
          display: flex;
          height: 44px;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 8px;
          background: #2563eb;
          color: white;
          font-weight: 600;
        }
        .secondaryBtn {
          display: flex;
          height: 44px;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 8px;
          border: 1px solid #dbe3ef;
          background: white;
          font-weight: 600;
        }
      `}</style>
    </main>
  );
}

function ServoScene({
  power,
  running,
  fault,
  servoType,
  direction,
  command,
  position,
  error,
  current,
  torque,
  speed,
}: {
  power: boolean;
  running: boolean;
  fault: boolean;
  servoType: ServoType;
  direction: Direction;
  loadType: LoadType;
  command: number;
  position: number;
  error: number;
  current: number;
  torque: number;
  speed: number;
}) {
  const spinDur = Math.max(0.55, 3.5 - speed / 950);
  const canvasTransform = buildCanvasScaleTransform(CIRCUIT_CANVAS_SCALE);

  return (
    <svg viewBox={VIEW_BOX} className="h-full w-full">
      <defs>
        <filter id="shadow">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodOpacity=".2" />
        </filter>
        <linearGradient id="servoBody" x1="0" x2="1">
          <stop offset="0" stopColor="#111827" />
          <stop offset=".24" stopColor="#e5e7eb" />
          <stop offset=".55" stopColor="#64748b" />
          <stop offset=".82" stopColor="#f8fafc" />
          <stop offset="1" stopColor="#111827" />
        </linearGradient>
      </defs>

      <g transform={canvasTransform}>
        <MachineBase />
        <ServoMotorVisual
          running={running}
          fault={fault}
          position={position}
          command={command}
          direction={direction}
          spinDur={spinDur}
        />
        <ServoDriveVisual
          power={power}
          fault={fault}
          running={running}
          speed={speed}
          current={current}
          torque={torque}
        />
        <FeedbackChart error={error} running={running} fault={fault} />

        <line x1="155" y1="125" x2="455" y2="125" stroke="#9ca3af" />

        <text
          x={LABEL.position.x}
          y={LABEL.position.y}
          textAnchor="middle"
          fill={fault ? "#dc2626" : STYLE.command}
          fontSize="22"
          fontWeight="700"
        >
          POSITION {position.toFixed(1)}°
        </text>

        <text
          x={LABEL.command.x}
          y={LABEL.command.y}
          textAnchor="middle"
          fill="#111"
          fontSize="13"
        >
          Command {command}° | Error {error.toFixed(1)}° | {direction}
        </text>

        {fault && (
          <text
            x={LABEL.fault.x}
            y={LABEL.fault.y}
            fill="#dc2626"
            fontSize="24"
            fontWeight="700"
          >
            SERVO FAULT / JAM
          </text>
        )}

        <text
          x={LABEL.servoType.x}
          y={LABEL.servoType.y}
          fontSize="13"
          fill="#475569"
        >
          {servoType}
        </text>

        <text
          x={LABEL.footer1.x}
          y={LABEL.footer1.y}
          fontSize="13"
          fill="#475569"
        >
          Industrial servo positioning and feedback control station
        </text>

        <text
          x={LABEL.footer2.x}
          y={LABEL.footer2.y}
          fontSize="13"
          fill="#64748b"
        >
          Controller Command → Servo Drive → Motor → Encoder Feedback → Position
          Correction
        </text>
      </g>
    </svg>
  );
}

function MachineBase() {
  return (
    <g>
      <rect
        x={COMPONENT.base.x}
        y={COMPONENT.base.y}
        width={COMPONENT.base.width}
        height={COMPONENT.base.height}
        rx="8"
        fill="#e5e7eb"
        stroke="#94a3b8"
      />
      <rect
        x={COMPONENT.rail.x}
        y={COMPONENT.rail.y}
        width={COMPONENT.rail.width}
        height={COMPONENT.rail.height}
        rx="5"
        fill="#cbd5e1"
      />
    </g>
  );
}

function ServoMotorVisual({
  running,
  fault,
  position,
  command,
  direction,
  spinDur,
}: {
  running: boolean;
  fault: boolean;
  position: number;
  command: number;
  direction: Direction;
  spinDur: number;
}) {
  const cx = NODE.motorCenter.x;
  const cy = NODE.motorCenter.y;

  return (
    <g>
      <rect
        x={COMPONENT.motorBody.x}
        y={COMPONENT.motorBody.y}
        width={COMPONENT.motorBody.width}
        height={COMPONENT.motorBody.height}
        rx="32"
        fill="url(#servoBody)"
        stroke="#111827"
        filter="url(#shadow)"
      />

      <circle
        cx={cx}
        cy={cy}
        r="112"
        fill="#f8fafc"
        stroke="#334155"
        strokeWidth="8"
      />
      <circle
        cx={cx}
        cy={cy}
        r="76"
        fill="#111827"
        stroke="#64748b"
        strokeWidth="6"
      />

      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i * 15 * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={cx + Math.cos(a) * 82}
            y1={cy + Math.sin(a) * 82}
            x2={cx + Math.cos(a) * 105}
            y2={cy + Math.sin(a) * 105}
            stroke={i % 2 ? "#94a3b8" : "#111827"}
            strokeWidth="4"
          />
        );
      })}

      <g transform={`rotate(${position} ${cx} ${cy})`}>
        <line
          x1={cx}
          y1={cy}
          x2={cx + 86}
          y2={cy}
          stroke={fault ? STYLE.danger : STYLE.active}
          strokeWidth="10"
          strokeLinecap="round"
        />
        <circle
          cx={cx + 94}
          cy={cy}
          r="10"
          fill={fault ? STYLE.danger : STYLE.active}
        />
        {running && (
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 ${cx} ${cy}`}
            to={`${direction === "CW" ? 360 : -360} ${cx} ${cy}`}
            dur={`${spinDur}s`}
            repeatCount="indefinite"
            additive="sum"
          />
        )}
      </g>

      <g transform={`rotate(${command} ${cx} ${cy})`}>
        <line
          x1={cx}
          y1={cy}
          x2={cx + 115}
          y2={cy}
          stroke={STYLE.command}
          strokeWidth="3"
          strokeDasharray="8 6"
        />
      </g>

      <circle
        cx={cx}
        cy={cy}
        r="20"
        fill="#e5e7eb"
        stroke="#334155"
        strokeWidth="5"
      />

      {running &&
        Array.from({ length: 4 }).map((_, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={95 + i * 13}
            fill="none"
            stroke={STYLE.active}
            strokeDasharray="8 8"
            opacity={0.22 - i * 0.04}
          />
        ))}
    </g>
  );
}

function ServoDriveVisual({
  power,
  fault,
  running,
  speed,
  current,
  torque,
}: {
  power: boolean;
  fault: boolean;
  running: boolean;
  speed: number;
  current: number;
  torque: number;
}) {
  return (
    <g>
      <rect
        x={COMPONENT.drivePort.x}
        y={COMPONENT.drivePort.y}
        width={COMPONENT.drivePort.width}
        height={COMPONENT.drivePort.height}
        rx="12"
        fill={STYLE.wire}
      />

      <path
        d={WIRE.cablePath}
        fill="none"
        stroke={STYLE.wire}
        strokeWidth={WIRE.width}
        strokeLinecap="round"
      />

      <rect
        x={COMPONENT.drive.x}
        y={COMPONENT.drive.y}
        width={COMPONENT.drive.width}
        height={COMPONENT.drive.height}
        rx="16"
        fill={STYLE.panel}
        stroke="#94a3b8"
        filter="url(#shadow)"
      />

      <text x="915" y="240" fontSize="15" fontWeight="700" fill={STYLE.command}>
        DRIVE
      </text>
      <text x="905" y="267" fontSize="13" fill="#475569">
        Speed {speed.toFixed(0)} RPM
      </text>
      <text x="905" y="290" fontSize="13" fill="#475569">
        Current {current.toFixed(2)} A
      </text>
      <text x="905" y="313" fontSize="13" fill="#475569">
        Torque {torque.toFixed(0)}%
      </text>

      {power && (
        <circle
          r="5"
          fill={fault ? STYLE.danger : running ? STYLE.active : STYLE.muted}
        >
          <animateMotion
            dur="1.25s"
            repeatCount="indefinite"
            path={PATH.cableMotion}
          />
        </circle>
      )}
    </g>
  );
}

function FeedbackChart({
  error,
  running,
  fault,
}: {
  error: number;
  running: boolean;
  fault: boolean;
}) {
  const x = COMPONENT.feedbackChart.x;
  const y = COMPONENT.feedbackChart.y;
  const e = clampValue(error, -55, 55);

  return (
    <g>
      <text
        x={x}
        y={y - 15}
        fontSize="14"
        fontWeight="700"
        fill={STYLE.command}
      >
        Command vs Feedback Monitor
      </text>
      <line x1={x} y1={y + 35} x2={x + 210} y2={y + 35} stroke="#94a3b8" />
      <line x1={x + 105} y1={y} x2={x + 105} y2={y + 70} stroke="#94a3b8" />
      <circle
        cx={x + 105 + e}
        cy={y + 35}
        r="10"
        fill={fault ? STYLE.danger : running ? STYLE.active : STYLE.muted}
      />
      <text x={x} y={y + 92} fontSize="12" fill="#475569">
        Error: {error.toFixed(1)}°
      </text>
    </g>
  );
}

const WIRING_VIEW_BOX = "0 0 620 190";
const WIRING_BASE_WIRE_WIDTH = 2.5;
const WIRING_ACTIVE_WIRE_SCALE = 1.6;

const WIRING_COMPONENT = {
  drive: { x: 25, y: 55, width: 105, height: 92, rotate: 0 },
} as const;

const WIRING_NODE = {
  driveOut: { x: 130, y: 100 },
  bendX: 205,
  arrowX: 410,
  arrowEndX: 426,
  labelX: 215,
  endTextX: 450,
} as const;

const WIRING_PATH = {
  supply: { y: 28, color: "#dc2626", label: "L/N" },
  command: { y: 60, color: "#16a34a", label: "PULSE/CMD" },
  direction: { y: 95, color: "#2563eb", label: "DIR" },
  encoder: { y: 130, color: "#7c3aed", label: "ENCODER" },
  motor: { y: 162, color: "#64748b", label: "U/V/W" },
} as const;

function WiringSvg({
  running,
  fault,
  direction,
  error,
  current,
}: {
  running: boolean;
  fault: boolean;
  direction: Direction;
  error: number;
  current: number;
}) {
  return (
    <svg viewBox={WIRING_VIEW_BOX} className="h-[190px] w-full">
      <rect
        x={WIRING_COMPONENT.drive.x}
        y={WIRING_COMPONENT.drive.y}
        width={WIRING_COMPONENT.drive.width}
        height={WIRING_COMPONENT.drive.height}
        rx="14"
        fill="#94a3b8"
        stroke="#334155"
      />
      <text x="50" y="88" fontSize="13" fontWeight="700" fill="white">
        SERVO
      </text>
      <text x="47" y="112" fontSize="12" fill="white">
        DRIVE
      </text>
      <circle
        cx="110"
        cy="77"
        r="5"
        fill={fault ? STYLE.danger : running ? STYLE.active : STYLE.muted}
      />

      <WiringWire
        {...WIRING_PATH.supply}
        end="220 V AC Supply"
        active={running}
      />
      <WiringWire
        {...WIRING_PATH.command}
        end={`Error ${error.toFixed(1)}°`}
        active={running}
      />
      <WiringWire {...WIRING_PATH.direction} end={direction} active={running} />
      <WiringWire
        {...WIRING_PATH.encoder}
        end="Feedback A/B/Z"
        active={running}
      />
      <WiringWire
        {...WIRING_PATH.motor}
        color={fault ? STYLE.danger : WIRING_PATH.motor.color}
        end={`${current.toFixed(2)} A Motor`}
        active={running || fault}
      />

      <text x="35" y="184" fontSize="12" fill="#475569">
        Servo drive power, command, encoder feedback and motor wiring
      </text>
    </svg>
  );
}

function WiringWire({
  y,
  color,
  label,
  end,
  active,
}: {
  y: number;
  color: string;
  label: string;
  end: string;
  active: boolean;
}) {
  const strokeWidth = active
    ? WIRING_BASE_WIRE_WIDTH * WIRING_ACTIVE_WIRE_SCALE
    : WIRING_BASE_WIRE_WIDTH;

  const motionPath = `M${WIRING_NODE.bendX} ${y} L${WIRING_NODE.arrowX} ${y}`;

  return (
    <g>
      <line
        x1={WIRING_NODE.driveOut.x}
        y1={WIRING_NODE.driveOut.y}
        x2={WIRING_NODE.bendX}
        y2={y}
        stroke={color}
        strokeWidth="2"
      />
      <line
        x1={WIRING_NODE.bendX}
        y1={y}
        x2={WIRING_NODE.arrowX}
        y2={y}
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <polygon
        points={`${WIRING_NODE.arrowX},${y - 6} ${WIRING_NODE.arrowEndX},${y} ${WIRING_NODE.arrowX},${y + 6}`}
        fill={color}
      />
      <text x={WIRING_NODE.labelX} y={y - 6} fontSize="13" fill={color}>
        {label}
      </text>
      <text x={WIRING_NODE.endTextX} y={y + 5} fontSize="13">
        {end}
      </text>
      {active && (
        <circle
          r="5"
          fill={color === STYLE.danger ? STYLE.danger : STYLE.active}
        >
          <animateMotion
            dur="1.2s"
            repeatCount="indefinite"
            path={motionPath}
          />
        </circle>
      )}
    </g>
  );
}

function Header({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const tabs: Tab[] = [
    "Simulator",
    "Theory",
    "Wiring Diagram",
    "Quiz",
    "Report",
  ];

  return (
    <header className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-center">
      <div className="flex items-center gap-4 lg:col-span-3">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-600 text-white">
          <Cpu size={30} />
        </div>
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">INDUSTRIAL LAB</h1>
          <p className="text-base text-blue-600 sm:text-lg">
            Servo Motor Simulation
          </p>
        </div>
      </div>

      <nav className="flex overflow-x-auto rounded-xl border bg-white shadow-sm lg:col-span-6">
        {tabs.map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`min-w-[135px] flex-1 px-4 py-4 text-sm ${
              tab === item
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-slate-700"
            }`}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="hidden justify-end gap-8 text-slate-800 lg:col-span-3 lg:flex">
        <Sun size={24} />
        <Volume2 size={24} />
        <Maximize size={24} />
      </div>
    </header>
  );
}

function LiveReadout({
  command,
  position,
  error,
  current,
  torque,
  speed,
  servoType,
  controlMode,
  direction,
  loadType,
  fault,
}: any) {
  return (
    <div className="absolute right-3 top-3 w-[238px] rounded-lg border bg-white shadow-lg sm:right-5 sm:top-16 sm:w-[300px]">
      <div className="flex h-12 items-center gap-3 border-b px-4 font-bold text-blue-600">
        <Activity size={20} /> LIVE READOUT
      </div>
      <div className="space-y-4 p-4 text-xs sm:text-sm">
        <Read label="Command" value={`${command}°`} />
        <Read
          label="Feedback"
          value={`${position.toFixed(1)}°`}
          green={!fault}
          danger={fault}
        />
        <Read
          label="Position Error"
          value={`${error.toFixed(1)}°`}
          danger={fault}
        />
        <Read label="Speed" value={`${speed.toFixed(0)} RPM`} />
        <Read label="Motor Current" value={`${current.toFixed(2)} A`} />
        <Read label="Torque Demand" value={`${torque.toFixed(0)}%`} />
        <Read label="Servo Type" value={servoType} />
        <Read label="Mode" value={controlMode} />
        <Read label="Direction" value={direction} />
        <Read label="Load" value={loadType} />
      </div>
    </div>
  );
}

function Panel({ title, icon, children, className = "" }: any) {
  return (
    <section
      className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      <div className="flex h-14 items-center gap-3 border-b px-5 font-bold text-blue-600">
        {icon}
        {title}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Control({ label, children }: any) {
  return (
    <div className="mb-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-[120px_1fr] sm:items-center">
      <span>{label}</span>
      {children}
    </div>
  );
}

function Select({ value, onChange, children }: any) {
  return (
    <select
      className="input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {children}
    </select>
  );
}

function Status({ label, value, dot, badge, distance, danger }: any) {
  return (
    <div className="mb-4 grid grid-cols-[1fr_120px] items-center text-sm">
      <span>{label}</span>
      <span
        className={`flex h-8 items-center justify-center rounded-md ${
          badge
            ? `${danger ? "bg-red-600" : "bg-green-600"} font-semibold text-white`
            : ""
        } ${distance ? "border text-lg font-semibold text-blue-600" : ""}`}
      >
        {dot && <span className="mr-2 h-3 w-3 rounded-full bg-green-500" />}
        {value}
      </span>
    </div>
  );
}

function Read({ label, value, green, danger }: any) {
  return (
    <div className="flex justify-between gap-3">
      <span>{label}</span>
      <b className={danger ? "text-red-600" : green ? "text-green-600" : ""}>
        {value}
      </b>
    </div>
  );
}

function Lamp({ label, on, danger }: any) {
  return (
    <div className="text-center">
      <p className="mb-5 text-sm">{label}</p>
      <div className="grid h-14 w-14 place-items-center rounded-full border-8 border-slate-200 bg-slate-100">
        <div
          className={`h-8 w-8 rounded-full ${
            on
              ? danger
                ? "bg-red-500 shadow-[0_0_20px_#ef4444]"
                : "bg-green-500 shadow-[0_0_20px_#22c55e]"
              : "bg-slate-300"
          }`}
        />
      </div>
    </div>
  );
}

function LearningTab({ tab, servoType, controlMode }: any) {
  const data: Record<
    string,
    { icon: React.ReactNode; title: string; points: string[] }
  > = {
    Theory: {
      icon: <BookOpen size={22} />,
      title: "Servo Motor Theory",
      points: [
        "A servo motor is a closed-loop motor system used for accurate position, speed and torque control.",
        "The drive compares command position with encoder feedback and corrects the error.",
        "Servo systems are used in CNC machines, robotics, packaging machines and automation axes.",
        "Faults can occur from overload, jam, encoder error, overcurrent or drive protection.",
      ],
    },
    "Wiring Diagram": {
      icon: <Zap size={22} />,
      title: `${controlMode} Wiring Explanation`,
      points: [
        "Controller sends pulse, analog, or communication command to the servo drive.",
        "Servo drive supplies controlled power to U/V/W motor phases.",
        "Encoder feedback returns position information to the drive.",
        "Fault output reports abnormal drive or motor condition.",
      ],
    },
    Quiz: {
      icon: <CheckCircle2 size={22} />,
      title: "Quick Quiz",
      points: [
        "Q1: Why is servo called closed-loop control?",
        "Q2: What is encoder feedback used for?",
        "Q3: What happens when position error is high?",
        "Q4: What can cause a servo drive fault?",
      ],
    },
    Report: {
      icon: <FileText size={22} />,
      title: "Simulation Report",
      points: [
        `Selected servo type: ${servoType}`,
        `Selected control mode: ${controlMode}`,
        "Recommended activity: change command position and observe feedback error.",
        "Test heavy load and jam condition to understand servo fault behavior.",
      ],
    },
  };

  const item = data[tab];

  return (
    <Panel title={tab.toUpperCase()} icon={item.icon}>
      <div className="min-h-[520px] rounded-xl bg-slate-50 p-6">
        <h2 className="mb-5 text-2xl font-bold text-blue-600">{item.title}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {item.points.map((p, i) => (
            <div key={i} className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="mb-3 font-bold text-slate-800">
                Learning Point {i + 1}
              </div>
              <p className="leading-7 text-slate-700">{p}</p>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}
