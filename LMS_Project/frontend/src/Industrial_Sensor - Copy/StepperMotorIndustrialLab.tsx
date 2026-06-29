"use client";

import React, { useMemo, useState } from "react";
import {
  Activity, BookOpen, CheckCircle2, ClipboardList, Cpu, FileText,
  Info, Maximize, Monitor, Play, RotateCcw, Settings, Square,
  Sun, Volume2, Zap,
} from "lucide-react";

type Tab = "Simulator" | "Theory" | "Wiring Diagram" | "Quiz" | "Report";
type MotorType = "Bipolar Stepper" | "Unipolar Stepper" | "Hybrid Stepper" | "Closed-loop Stepper";
type DriveMode = "Full Step" | "Half Step" | "Microstep 1/8" | "Microstep 1/16";
type Direction = "CW" | "CCW";
type LoadType = "No Load" | "Light Load" | "Heavy Load" | "Jam Condition";

export default function StepperMotorIndustrialLab() {
  const [tab, setTab] = useState<Tab>("Simulator");
  const [power, setPower] = useState(true);
  const [motorType, setMotorType] = useState<MotorType>("Bipolar Stepper");
  const [driveMode, setDriveMode] = useState<DriveMode>("Full Step");
  const [direction, setDirection] = useState<Direction>("CW");
  const [loadType, setLoadType] = useState<LoadType>("Light Load");
  const [speed, setSpeed] = useState(240);
  const [steps, setSteps] = useState(96);
  const [alarmCount, setAlarmCount] = useState(0);

  const microFactor = driveMode === "Full Step" ? 1 : driveMode === "Half Step" ? 2 : driveMode === "Microstep 1/8" ? 8 : 16;
  const baseStepAngle = 1.8;
  const effectiveStepAngle = baseStepAngle / microFactor;
  const shaftAngle = (steps * effectiveStepAngle) % 360;
  const pulseFreq = power ? (speed * microFactor) / 60 : 0;
  const loadFactor = loadType === "No Load" ? 0.2 : loadType === "Light Load" ? 0.45 : loadType === "Heavy Load" ? 0.82 : 1;
  const current = power ? 0.4 + loadFactor * 2.4 : 0;
  const torque = power ? Math.max(0, 2.8 - speed / 900) * (1 - loadFactor * 0.2) : 0;
  const alarm = power && (loadType === "Jam Condition" || current > 2.5);
  const running = power && !alarm && speed > 0;

  function updateSpeed(v: number) {
    setSpeed(Number(Math.max(0, Math.min(1200, v)).toFixed(0)));
  }

  function stepMotor(delta: number) {
    if (!power || alarm) return;
    setSteps((n) => n + (direction === "CW" ? delta : -delta));
  }

  function reset() {
    setPower(false);
    setMotorType("Bipolar Stepper");
    setDriveMode("Full Step");
    setDirection("CW");
    setLoadType("Light Load");
    setSpeed(240);
    setSteps(96);
    setAlarmCount(0);
    setTab("Simulator");
  }

  const logs = useMemo(() => {
    if (!power) return [["--:--", "Power OFF", "text-slate-500"]];
    return [
      ["10:24:15", "Stepper Drive Enabled", "text-slate-700"],
      alarm ? ["10:24:18", "Driver Fault / Overload", "text-red-600"] : ["10:24:23", "Motion Normal", "text-green-600"],
      ["10:24:18", `${pulseFreq.toFixed(0)} Hz / ${current.toFixed(2)} A`, "text-slate-900"],
      ["LIVE", `${motorType} / ${driveMode}`, "text-blue-600"],
    ];
  }, [power, alarm, pulseFreq, current, motorType, driveMode]);

  return (
    <main className="min-h-screen bg-white p-3 text-slate-950 sm:p-4 lg:p-5">
      <div className="mx-auto max-w-[1560px] space-y-4">
        <Header tab={tab} setTab={setTab} />

        {tab !== "Simulator" ? (
          <LearningTab tab={tab} motorType={motorType} driveMode={driveMode} />
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <aside className="space-y-4 xl:col-span-3">
              <Panel title="STEPPER CONFIGURATION" icon={<Settings size={20} />}>
                <Control label="Motor Type">
                  <Select value={motorType} onChange={(v) => setMotorType(v as MotorType)}>
                    <option>Bipolar Stepper</option>
                    <option>Unipolar Stepper</option>
                    <option>Hybrid Stepper</option>
                    <option>Closed-loop Stepper</option>
                  </Select>
                </Control>

                <Control label="Drive Mode">
                  <Select value={driveMode} onChange={(v) => setDriveMode(v as DriveMode)}>
                    <option>Full Step</option>
                    <option>Half Step</option>
                    <option>Microstep 1/8</option>
                    <option>Microstep 1/16</option>
                  </Select>
                </Control>

                <Control label="Direction">
                  <Select value={direction} onChange={(v) => setDirection(v as Direction)}>
                    <option>CW</option>
                    <option>CCW</option>
                  </Select>
                </Control>

                <Control label="Load Type">
                  <Select value={loadType} onChange={(v) => {
                    setLoadType(v as LoadType);
                    if (v === "Jam Condition") setAlarmCount((n) => n + 1);
                  }}>
                    <option>No Load</option>
                    <option>Light Load</option>
                    <option>Heavy Load</option>
                    <option>Jam Condition</option>
                  </Select>
                </Control>

                <Control label="Speed">
                  <div className="input flex items-center justify-between">
                    <b>{speed}</b><span>RPM</span>
                  </div>
                </Control>

                <Control label="Supply">
                  <div className="input flex items-center justify-between">
                    <span>24 V DC Drive</span><Zap size={15} className="text-blue-600" />
                  </div>
                </Control>
              </Panel>

              <Panel title="STEPPER STATUS" icon={<Activity size={20} />}>
                <Status label="Power" value={power ? "Enabled" : "OFF"} dot={power} />
                <Status label="Run State" value={running ? "RUNNING" : alarm ? "FAULT" : "STOP"} badge={running || alarm} danger={alarm} />
                <Status label="Current" value={`${current.toFixed(2)} A`} distance />
                <Status label="Step Angle" value={`${effectiveStepAngle.toFixed(3)}°`} />
                <Status label="Position" value={`${shaftAngle.toFixed(1)}°`} />
              </Panel>

              <Panel title="INSTRUCTIONS" icon={<Info size={20} />}>
                <ol className="space-y-3 text-sm leading-relaxed">
                  <li>1. Select motor and drive mode.</li>
                  <li>2. Adjust speed and step position.</li>
                  <li>3. Observe coil sequence, rotor angle and pulse train.</li>
                  <li>4. Test heavy load and jam fault condition.</li>
                </ol>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button onClick={() => setPower(true)} className="primaryBtn"><Play size={17} /> Enable</button>
                  <button onClick={() => setPower(false)} className="secondaryBtn"><Square size={15} /> Stop</button>
                  <button onClick={() => stepMotor(1)} className="secondaryBtn">Step +</button>
                  <button onClick={() => stepMotor(10)} className="secondaryBtn">Step +10</button>
                  <button onClick={reset} className="secondaryBtn col-span-2"><RotateCcw size={17} /> Reset</button>
                </div>
              </Panel>
            </aside>

            <section className="space-y-4 xl:col-span-9">
              <Panel title="STEPPER MOTOR SIMULATION AREA" icon={<Monitor size={20} />}>
                <div className="relative h-[420px] overflow-hidden rounded-xl bg-white sm:h-[500px] lg:h-[575px]">
                  <StepperScene
                    power={power}
                    running={running}
                    alarm={alarm}
                    motorType={motorType}
                    driveMode={driveMode}
                    direction={direction}
                    loadType={loadType}
                    speed={speed}
                    steps={steps}
                    shaftAngle={shaftAngle}
                    current={current}
                    torque={torque}
                    pulseFreq={pulseFreq}
                    microFactor={microFactor}
                  />

                  <LiveReadout
                    speed={speed}
                    steps={steps}
                    shaftAngle={shaftAngle}
                    current={current}
                    torque={torque}
                    pulseFreq={pulseFreq}
                    driveMode={driveMode}
                    motorType={motorType}
                    direction={direction}
                    loadType={loadType}
                    alarm={alarm}
                  />

                  <div className="absolute bottom-4 left-1/2 w-[86%] max-w-xl -translate-x-1/2 rounded-xl border bg-white/95 p-3 shadow-sm">
                    <input
                      type="range"
                      min={0}
                      max={1200}
                      step={10}
                      value={speed}
                      onChange={(e) => updateSpeed(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                    <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                      <span>0 RPM</span>
                      <span>Adjust step pulse speed</span>
                      <span>1200 RPM</span>
                    </div>
                  </div>
                </div>
              </Panel>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12">
                <Panel title="I/O INDICATOR" icon={<Cpu size={19} />} className="xl:col-span-3">
                  <div className="grid h-[190px] grid-cols-3 place-items-center">
                    <Lamp label="ENABLE" on={power} />
                    <Lamp label="PULSE" on={running} />
                    <Lamp label="FAULT" on={alarm} danger />
                  </div>
                </Panel>

                <Panel title="STEPPER DRIVE CONNECTION" icon={<Settings size={19} />} className="xl:col-span-5">
                  <WiringSvg running={running} alarm={alarm} direction={direction} pulseFreq={pulseFreq} current={current} />
                </Panel>

                <Panel title="EVENT LOG" icon={<ClipboardList size={19} />} className="md:col-span-2 xl:col-span-4">
                  <div className="space-y-4 pt-2 text-sm">
                    {logs.map(([time, msg, color], i) => (
                      <div key={i} className="grid grid-cols-[75px_1fr]">
                        <span>{time}</span>
                        <span className={color}>{msg}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-lg bg-slate-50 p-3 text-xs">
                    Fault Count: <b>{alarmCount}</b>
                  </div>
                </Panel>
              </div>
            </section>
          </div>
        )}
      </div>

      <style jsx global>{`
        .input{height:42px;width:100%;border:1px solid #dbe3ef;border-radius:8px;background:white;padding:0 12px;outline:none;font-size:14px}
        .miniBtn{height:42px;width:42px;border:1px solid #dbe3ef;border-radius:8px;background:white;font-size:23px}
        .primaryBtn{display:flex;height:44px;align-items:center;justify-content:center;gap:8px;border-radius:8px;background:#2563eb;color:white;font-weight:600}
        .secondaryBtn{display:flex;height:44px;align-items:center;justify-content:center;gap:8px;border-radius:8px;border:1px solid #dbe3ef;background:white;font-weight:600}
      `}</style>
    </main>
  );
}

function Header({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const tabs: Tab[] = ["Simulator", "Theory", "Wiring Diagram", "Quiz", "Report"];
  return (
    <header className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-center">
      <div className="flex items-center gap-4 lg:col-span-3">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-600 text-white"><Cpu size={30} /></div>
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">INDUSTRIAL LAB</h1>
          <p className="text-base text-blue-600 sm:text-lg">Stepper Motor Simulation</p>
        </div>
      </div>
      <nav className="flex overflow-x-auto rounded-xl border bg-white shadow-sm lg:col-span-6">
        {tabs.map((item) => (
          <button key={item} onClick={() => setTab(item)}
            className={`min-w-[135px] flex-1 px-4 py-4 text-sm ${tab === item ? "border-b-2 border-blue-600 text-blue-600" : "text-slate-700"}`}>
            {item}
          </button>
        ))}
      </nav>
      <div className="hidden justify-end gap-8 text-slate-800 lg:col-span-3 lg:flex">
        <Sun size={24} /><Volume2 size={24} /><Maximize size={24} />
      </div>
    </header>
  );
}

function StepperScene({ power, running, alarm, motorType, driveMode, direction, loadType, speed, steps, shaftAngle, current, torque, pulseFreq, microFactor }: any) {
  const cx = 405;
  const cy = 285;
  const activePhase = Math.abs(steps) % 4;
  const spinDur = Math.max(0.5, 4 - speed / 350);

  return (
    <svg viewBox="0 0 1120 560" className="h-full w-full">
      <defs>
        <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="8" floodOpacity=".2" /></filter>
        <linearGradient id="motorBody" x1="0" x2="1">
          <stop offset="0" stopColor="#111827" /><stop offset=".24" stopColor="#e5e7eb" />
          <stop offset=".55" stopColor="#64748b" /><stop offset=".82" stopColor="#f8fafc" />
          <stop offset="1" stopColor="#111827" />
        </linearGradient>
      </defs>

      <rect x="70" y="420" width="980" height="42" rx="8" fill="#e5e7eb" stroke="#94a3b8" />
      <rect x="105" y="435" width="910" height="10" rx="5" fill="#cbd5e1" />

      <rect x="215" y="160" width="380" height="250" rx="32" fill="url(#motorBody)" stroke="#111827" filter="url(#shadow)" />
      <circle cx={cx} cy={cy} r="112" fill="#f8fafc" stroke="#334155" strokeWidth="8" />
      <circle cx={cx} cy={cy} r="72" fill="#111827" stroke="#64748b" strokeWidth="6" />

      {[
        [cx, cy - 118, "A+"],
        [cx + 118, cy, "B+"],
        [cx, cy + 118, "A−"],
        [cx - 118, cy, "B−"],
      ].map(([x, y, label], i) => (
        <g key={label as string}>
          <rect
            x={(x as number) - 34}
            y={(y as number) - 22}
            width="68"
            height="44"
            rx="12"
            fill={power && activePhase === i && !alarm ? "#2563eb" : "#cbd5e1"}
            stroke="#334155"
          />
          <text x={x as number} y={(y as number) + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={power && activePhase === i && !alarm ? "white" : "#334155"}>
            {label}
          </text>
        </g>
      ))}

      <g transform={`rotate(${shaftAngle} ${cx} ${cy})`}>
        <path d={`M${cx} ${cy} L${cx + 86} ${cy} L${cx + 34} ${cy - 18} L${cx + 34} ${cy + 18} Z`} fill={alarm ? "#ef4444" : "#22c55e"} />
        <circle cx={cx} cy={cy} r="20" fill="#e5e7eb" stroke="#334155" strokeWidth="5" />
        {running && (
          <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`${direction === "CW" ? 360 : -360} ${cx} ${cy}`} dur={`${spinDur}s`} repeatCount="indefinite" additive="sum" />
        )}
      </g>

      {running && Array.from({ length: 5 }).map((_, i) => (
        <circle key={i} cx={cx} cy={cy} r={90 + i * 13} fill="none" stroke="#22c55e" strokeDasharray="8 8" opacity={0.22 - i * 0.03} />
      ))}

      <rect x="585" y="250" width="80" height="70" rx="12" fill="#111827" />
      <path d="M665 285 C735 190 805 190 865 265" fill="none" stroke="#111827" strokeWidth="18" strokeLinecap="round" />

      <rect x="865" y="210" width="155" height="120" rx="16" fill="#f8fafc" stroke="#94a3b8" filter="url(#shadow)" />
      <text x="905" y="240" fontSize="15" fontWeight="700" fill="#2563eb">DRIVE</text>
      <text x="895" y="267" fontSize="13" fill="#475569">{pulseFreq.toFixed(0)} Hz</text>
      <text x="895" y="290" fontSize="13" fill="#475569">{current.toFixed(2)} A</text>
      <text x="895" y="313" fontSize="13" fill="#475569">{torque.toFixed(2)} Nm</text>

      {power && (
        <circle r="5" fill={alarm ? "#ef4444" : "#22c55e"}>
          <animateMotion dur="1.25s" repeatCount="indefinite" path="M665 285 C735 190 805 190 865 265" />
        </circle>
      )}

      <PulseTrain x={680} y={365} running={running} />
      <text x="680" y="350" fontSize="14" fontWeight="700" fill="#2563eb">STEP / DIR Pulse Monitor</text>

      <line x1="155" y1="125" x2="455" y2="125" stroke="#9ca3af" />
      <text x="305" y="115" textAnchor="middle" fill={alarm ? "#dc2626" : "#2563eb"} fontSize="22" fontWeight="700">
        {shaftAngle.toFixed(1)}° POSITION
      </text>
      <text x="305" y="150" textAnchor="middle" fill="#111" fontSize="13">
        {driveMode} | {microFactor}x microstep | {direction}
      </text>

      {alarm && <text x="500" y="135" fill="#dc2626" fontSize="24" fontWeight="700">DRIVER FAULT / JAM</text>}

      <text x="220" y="145" fontSize="13" fill="#475569">{motorType}</text>
      <text x="80" y="505" fontSize="13" fill="#475569">Industrial stepper positioning station</text>
      <text x="80" y="530" fontSize="13" fill="#64748b">PLC Pulse/Direction → Stepper Drive → Motor Coils → Rotor Position</text>
    </svg>
  );
}

function PulseTrain({ x, y, running }: any) {
  const path = `M${x} ${y + 24} L${x + 22} ${y + 24} L${x + 22} ${y} L${x + 50} ${y} L${x + 50} ${y + 24} L${x + 82} ${y + 24} L${x + 82} ${y} L${x + 110} ${y} L${x + 110} ${y + 24} L${x + 150} ${y + 24}`;
  return (
    <g>
      <text x={x - 48} y={y + 18} fontSize="13" fontWeight="700">STEP</text>
      <path d={path} fill="none" stroke={running ? "#16a34a" : "#64748b"} strokeWidth="4" />
      <text x={x - 48} y={y + 62} fontSize="13" fontWeight="700">DIR</text>
      <line x1={x} y1={y + 58} x2={x + 150} y2={y + 58} stroke="#2563eb" strokeWidth="4" />
    </g>
  );
}

function LiveReadout({ speed, steps, shaftAngle, current, torque, pulseFreq, driveMode, motorType, direction, loadType, alarm }: any) {
  return (
    <div className="absolute right-3 top-3 w-[238px] rounded-lg border bg-white shadow-lg sm:right-5 sm:top-16 sm:w-[300px]">
      <div className="flex h-12 items-center gap-3 border-b px-4 font-bold text-blue-600"><Activity size={20} /> LIVE READOUT</div>
      <div className="space-y-4 p-4 text-xs sm:text-sm">
        <Read label="Speed" value={`${speed} RPM`} green={!alarm} danger={alarm} />
        <Read label="Position" value={`${shaftAngle.toFixed(1)}°`} green />
        <Read label="Step Count" value={`${steps}`} />
        <Read label="Pulse Freq" value={`${pulseFreq.toFixed(0)} Hz`} />
        <Read label="Phase Current" value={`${current.toFixed(2)} A`} />
        <Read label="Torque" value={`${torque.toFixed(2)} Nm`} />
        <Read label="Drive Mode" value={driveMode} />
        <Read label="Motor Type" value={motorType} />
        <Read label="Direction" value={direction} />
        <Read label="Load" value={loadType} />
      </div>
    </div>
  );
}

function WiringSvg({ running, alarm, direction, pulseFreq, current }: any) {
  return (
    <svg viewBox="0 0 620 190" className="h-[190px] w-full">
      <rect x="25" y="55" width="105" height="92" rx="14" fill="#94a3b8" stroke="#334155" />
      <text x="50" y="88" fontSize="13" fontWeight="700" fill="white">DRIVE</text>
      <text x="45" y="112" fontSize="12" fill="white">STEP/DIR</text>
      <circle cx="110" cy="77" r="5" fill={alarm ? "#ef4444" : running ? "#22c55e" : "#64748b"} />

      <Wire y={28} color="#dc2626" label="+24V" end="Drive Supply" active={running} />
      <Wire y={60} color={running ? "#16a34a" : "#111827"} label="STEP" end={`${pulseFreq.toFixed(0)} Hz`} active={running} />
      <Wire y={95} color="#2563eb" label="DIR" end={direction} active={running} />
      <Wire y={130} color={alarm ? "#ef4444" : "#7c3aed"} label="FAULT" end={alarm ? "Fault ON" : "Normal"} active={alarm} />
      <Wire y={162} color="#64748b" label="A+/A− B+/B−" end={`${current.toFixed(2)} A Coil`} active={running} />

      <text x="35" y="184" fontSize="12" fill="#475569">PLC pulse/direction and stepper drive wiring</text>
    </svg>
  );
}

function Wire({ y, color, label, end, active }: any) {
  return (
    <g>
      <line x1="130" y1="100" x2="205" y2={y} stroke={color} strokeWidth="2" />
      <line x1="205" y1={y} x2="410" y2={y} stroke={color} strokeWidth={active ? 4 : 2.5} />
      <polygon points={`410,${y - 6} 426,${y} 410,${y + 6}`} fill={color} />
      <text x="215" y={y - 6} fontSize="13" fill={color}>{label}</text>
      <text x="450" y={y + 5} fontSize="13">{end}</text>
      {active && (
        <circle r="5" fill={color === "#ef4444" ? "#ef4444" : "#22c55e"}>
          <animateMotion dur="1.2s" repeatCount="indefinite" path={`M205 ${y} L410 ${y}`} />
        </circle>
      )}
    </g>
  );
}

function Panel({ title, icon, children, className = "" }: any) {
  return <section className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}><div className="flex h-14 items-center gap-3 border-b px-5 font-bold text-blue-600">{icon}{title}</div><div className="p-5">{children}</div></section>;
}

function Control({ label, children }: any) {
  return <div className="mb-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-[120px_1fr] sm:items-center"><span>{label}</span>{children}</div>;
}

function Select({ value, onChange, children }: any) {
  return <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>{children}</select>;
}

function Status({ label, value, dot, badge, distance, danger }: any) {
  return (
    <div className="mb-4 grid grid-cols-[1fr_120px] items-center text-sm">
      <span>{label}</span>
      <span className={`flex h-8 items-center justify-center rounded-md ${badge ? `${danger ? "bg-red-600" : "bg-green-600"} font-semibold text-white` : ""} ${distance ? "border text-lg font-semibold text-blue-600" : ""}`}>
        {dot && <span className="mr-2 h-3 w-3 rounded-full bg-green-500" />}{value}
      </span>
    </div>
  );
}

function Read({ label, value, green, danger }: any) {
  return <div className="flex justify-between gap-3"><span>{label}</span><b className={danger ? "text-red-600" : green ? "text-green-600" : ""}>{value}</b></div>;
}

function Lamp({ label, on, danger }: any) {
  return (
    <div className="text-center">
      <p className="mb-5 text-sm">{label}</p>
      <div className="grid h-14 w-14 place-items-center rounded-full border-8 border-slate-200 bg-slate-100">
        <div className={`h-8 w-8 rounded-full ${on ? `${danger ? "bg-red-500 shadow-[0_0_20px_#ef4444]" : "bg-green-500 shadow-[0_0_20px_#22c55e]"}` : "bg-slate-300"}`} />
      </div>
    </div>
  );
}

function LearningTab({ tab, motorType, driveMode }: any) {
  const data: Record<string, { icon: any; title: string; points: string[] }> = {
    Theory: {
      icon: <BookOpen size={22} />,
      title: "Stepper Motor Theory",
      points: [
        "A stepper motor moves in fixed angular steps instead of rotating freely like an induction motor.",
        "The driver energizes motor coils in sequence to move the rotor step by step.",
        "Microstepping divides each full step into smaller steps for smoother motion.",
        "Stepper motors are used for positioning, indexing, CNC axes, printers and automation mechanisms.",
      ],
    },
    "Wiring Diagram": {
      icon: <Zap size={22} />,
      title: `${driveMode} Wiring Explanation`,
      points: [
        "PLC or controller sends STEP pulses to command movement.",
        "DIR signal controls clockwise or counter-clockwise rotation.",
        "Stepper drive supplies phase current to A and B motor coils.",
        "Fault output reports overload, jam, overcurrent or drive protection condition.",
      ],
    },
    Quiz: {
      icon: <CheckCircle2 size={22} />,
      title: "Quick Quiz",
      points: [
        "Q1: What does one STEP pulse do?",
        "Q2: Why is microstepping used?",
        "Q3: What is the function of DIR signal?",
        "Q4: What can cause a stepper drive fault?",
      ],
    },
    Report: {
      icon: <FileText size={22} />,
      title: "Simulation Report",
      points: [
        `Selected motor type: ${motorType}`,
        `Selected drive mode: ${driveMode}`,
        "Recommended activity: change speed and observe pulse frequency.",
        "Test heavy load and jam condition to understand driver fault behavior.",
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
              <div className="mb-3 font-bold text-slate-800">Learning Point {i + 1}</div>
              <p className="leading-7 text-slate-700">{p}</p>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}