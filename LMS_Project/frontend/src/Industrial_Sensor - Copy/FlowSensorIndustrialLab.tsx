"use client";

import React, { useMemo, useState } from "react";
import {
  Activity, BookOpen, CheckCircle2, ClipboardList, Cpu, FileText,
  Info, Maximize, Monitor, Play, RotateCcw, Settings, Square,
  Sun, Volume2, Zap,
} from "lucide-react";

type Tab = "Simulator" | "Theory" | "Wiring Diagram" | "Quiz" | "Report";
type SensorType = "Turbine Flow" | "Magnetic Flow" | "Ultrasonic Flow" | "Vortex Flow";
type OutputMode = "Pulse Output" | "4-20mA" | "0-10V" | "PNP Switch";
type FluidType = "Water" | "Oil" | "Chemical" | "Air/Gas";

export default function FlowSensorIndustrialLab() {
  const [tab, setTab] = useState<Tab>("Simulator");
  const [power, setPower] = useState(true);
  const [sensorType, setSensorType] = useState<SensorType>("Magnetic Flow");
  const [outputMode, setOutputMode] = useState<OutputMode>("4-20mA");
  const [fluidType, setFluidType] = useState<FluidType>("Water");
  const [alarmSet, setAlarmSet] = useState(75);
  const [flowRate, setFlowRate] = useState(42);
  const [alarmCount, setAlarmCount] = useState(1);

  const conductiveOk = sensorType !== "Magnetic Flow" || fluidType !== "Oil" && fluidType !== "Air/Gas";
  const measuredFlow = conductiveOk ? flowRate : 0;
  const highAlarm = power && measuredFlow >= alarmSet;
  const percent = Math.min(100, measuredFlow);
  const current = power ? 4 + (percent / 100) * 16 : 0;
  const voltage = power ? (percent / 100) * 10 : 0;
  const pulseHz = power ? measuredFlow * 8 : 0;
  const outputOn = power && (outputMode === "PNP Switch" ? highAlarm : measuredFlow > 0);

  function moveFlow(v: number) {
    const next = Number(Math.max(0, Math.min(100, v)).toFixed(0));
    if (!highAlarm && power && next >= alarmSet) setAlarmCount((n) => n + 1);
    setFlowRate(next);
  }

  function reset() {
    setPower(false);
    setSensorType("Magnetic Flow");
    setOutputMode("4-20mA");
    setFluidType("Water");
    setAlarmSet(75);
    setFlowRate(42);
    setAlarmCount(0);
    setTab("Simulator");
  }

  const logs = useMemo(() => {
    if (!power) return [["--:--", "Power OFF", "text-slate-500"]];
    return [
      ["10:24:15", "Flow Sensor Started", "text-slate-700"],
      !conductiveOk
        ? ["10:24:18", "Invalid Medium for Magnetic Flow", "text-red-600"]
        : highAlarm
        ? ["10:24:18", "High Flow Alarm", "text-red-600"]
        : ["10:24:23", "Flow Normal", "text-green-600"],
      ["10:24:18", `${current.toFixed(1)} mA / ${pulseHz.toFixed(0)} Hz`, "text-slate-900"],
      ["LIVE", `${sensorType} / ${fluidType}`, "text-blue-600"],
    ];
  }, [power, conductiveOk, highAlarm, current, pulseHz, sensorType, fluidType]);

  return (
    <main className="min-h-screen bg-white p-3 text-slate-950 sm:p-4 lg:p-5">
      <div className="mx-auto max-w-[1560px] space-y-4">
        <Header tab={tab} setTab={setTab} />

        {tab !== "Simulator" ? (
          <LearningTab tab={tab} sensorType={sensorType} outputMode={outputMode} />
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <aside className="space-y-4 xl:col-span-3">
              <Panel title="FLOW SENSOR CONFIGURATION" icon={<Settings size={20} />}>
                <Control label="Sensor Type">
                  <Select value={sensorType} onChange={(v) => setSensorType(v as SensorType)}>
                    <option>Turbine Flow</option>
                    <option>Magnetic Flow</option>
                    <option>Ultrasonic Flow</option>
                    <option>Vortex Flow</option>
                  </Select>
                </Control>

                <Control label="Fluid Type">
                  <Select value={fluidType} onChange={(v) => setFluidType(v as FluidType)}>
                    <option>Water</option>
                    <option>Oil</option>
                    <option>Chemical</option>
                    <option>Air/Gas</option>
                  </Select>
                </Control>

                <Control label="Output Mode">
                  <Select value={outputMode} onChange={(v) => setOutputMode(v as OutputMode)}>
                    <option>Pulse Output</option>
                    <option>4-20mA</option>
                    <option>0-10V</option>
                    <option>PNP Switch</option>
                  </Select>
                </Control>

                <Control label="Alarm Set">
                  <div className="grid grid-cols-[1fr_42px_42px] gap-2">
                    <div className="input flex items-center justify-between">
                      <b>{alarmSet}</b><span>%</span>
                    </div>
                    <button className="miniBtn" onClick={() => setAlarmSet(Math.max(10, alarmSet - 5))}>−</button>
                    <button className="miniBtn" onClick={() => setAlarmSet(Math.min(100, alarmSet + 5))}>+</button>
                  </div>
                </Control>

                <Control label="Supply">
                  <div className="input flex items-center justify-between">
                    <span>24 V DC</span>
                    <Zap size={15} className="text-blue-600" />
                  </div>
                </Control>
              </Panel>

              <Panel title="FLOW SENSOR STATUS" icon={<Activity size={20} />}>
                <Status label="Power" value={power ? "Active" : "OFF"} dot={power} />
                <Status label="Flow Status" value={conductiveOk ? "VALID" : "INVALID"} badge={conductiveOk} danger={!conductiveOk} />
                <Status label="Alarm" value={highAlarm ? "HIGH" : "NORMAL"} badge={highAlarm} danger={highAlarm} />
                <Status label="Flow Rate" value={`${measuredFlow.toFixed(0)}%`} distance />
                <Status label="Output" value={outputOn ? "ACTIVE" : "OFF"} badge={outputOn} />
              </Panel>

              <Panel title="INSTRUCTIONS" icon={<Info size={20} />}>
                <ol className="space-y-3 text-sm leading-relaxed">
                  <li>1. Select flow sensor and fluid type.</li>
                  <li>2. Adjust flow rate using slider.</li>
                  <li>3. Observe pipe flow animation and turbine rotation.</li>
                  <li>4. Compare pulse, analog and switch outputs.</li>
                </ol>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button onClick={() => setPower(true)} className="primaryBtn"><Play size={17} /> Start</button>
                  <button onClick={() => setPower(false)} className="secondaryBtn"><Square size={15} /> Stop</button>
                  <button onClick={reset} className="secondaryBtn col-span-2"><RotateCcw size={17} /> Reset</button>
                </div>
              </Panel>
            </aside>

            <section className="space-y-4 xl:col-span-9">
              <Panel title="FLOW SENSOR SIMULATION AREA" icon={<Monitor size={20} />}>
                <div className="relative h-[420px] overflow-hidden rounded-xl bg-white sm:h-[500px] lg:h-[575px]">
                  <FlowScene
                    power={power}
                    sensorType={sensorType}
                    fluidType={fluidType}
                    flowRate={flowRate}
                    measuredFlow={measuredFlow}
                    alarmSet={alarmSet}
                    highAlarm={highAlarm}
                    conductiveOk={conductiveOk}
                    current={current}
                    voltage={voltage}
                    pulseHz={pulseHz}
                  />

                  <LiveReadout
                    flowRate={flowRate}
                    measuredFlow={measuredFlow}
                    alarmSet={alarmSet}
                    highAlarm={highAlarm}
                    conductiveOk={conductiveOk}
                    current={current}
                    voltage={voltage}
                    pulseHz={pulseHz}
                    sensorType={sensorType}
                    outputMode={outputMode}
                    fluidType={fluidType}
                  />

                  <div className="absolute bottom-4 left-1/2 w-[86%] max-w-xl -translate-x-1/2 rounded-xl border bg-white/95 p-3 shadow-sm">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={flowRate}
                      onChange={(e) => moveFlow(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                    <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                      <span>No Flow</span>
                      <span>Adjust pipe flow rate</span>
                      <span>Max Flow</span>
                    </div>
                  </div>
                </div>
              </Panel>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12">
                <Panel title="I/O INDICATOR" icon={<Cpu size={19} />} className="xl:col-span-3">
                  <div className="grid h-[190px] grid-cols-3 place-items-center">
                    <Lamp label="POWER" on={power} />
                    <Lamp label="FLOW" on={measuredFlow > 0} />
                    <Lamp label="ALARM" on={highAlarm || !conductiveOk} danger />
                  </div>
                </Panel>

                <Panel title="FLOW SENSOR CONNECTION" icon={<Settings size={19} />} className="xl:col-span-5">
                  <WiringSvg outputMode={outputMode} outputOn={outputOn} current={current} voltage={voltage} pulseHz={pulseHz} />
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
                    Flow Alarm Count: <b>{alarmCount}</b>
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
          <p className="text-base text-blue-600 sm:text-lg">Flow Sensor Simulation</p>
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

function Panel({ title, icon, children, className = "" }: any) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
      <div className="flex h-14 items-center gap-3 border-b px-5 font-bold text-blue-600">{icon}{title}</div>
      <div className="p-5">{children}</div>
    </section>
  );
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

function FlowScene({ power, sensorType, fluidType, flowRate, measuredFlow, alarmSet, highAlarm, conductiveOk, current, voltage, pulseHz }: any) {
  const speed = Math.max(0.35, 2.2 - measuredFlow / 70);
  const flowOpacity = power && measuredFlow > 0 ? 0.35 + measuredFlow / 160 : 0.08;

  const fluidColor =
    fluidType === "Oil" ? "#f59e0b" :
    fluidType === "Chemical" ? "#22c55e" :
    fluidType === "Air/Gas" ? "#94a3b8" : "#38bdf8";

  return (
    <svg viewBox="0 0 1120 560" className="h-full w-full">
      <defs>
        <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="8" floodOpacity=".2" /></filter>
        <linearGradient id="steel" x1="0" x2="1">
          <stop offset="0" stopColor="#64748b" /><stop offset=".35" stopColor="#f8fafc" />
          <stop offset=".65" stopColor="#94a3b8" /><stop offset="1" stopColor="#334155" />
        </linearGradient>
      </defs>

      <rect x="70" y="420" width="980" height="42" rx="8" fill="#e5e7eb" stroke="#94a3b8" />
      <rect x="105" y="435" width="910" height="10" rx="5" fill="#cbd5e1" />

      <rect x="115" y="255" width="780" height="105" rx="45" fill="#94a3b8" stroke="#475569" filter="url(#shadow)" />
      <rect x="145" y="283" width="720" height="48" rx="24" fill={fluidColor} opacity={flowOpacity} />

      {Array.from({ length: 13 }).map((_, i) => (
        <circle key={i} cx={165 + i * 55} cy="307" r="7" fill="white" opacity=".7">
          {power && measuredFlow > 0 && (
            <animate attributeName="cx" from={165 + i * 55} to={215 + i * 55} dur={`${speed}s`} repeatCount="indefinite" />
          )}
        </circle>
      ))}

      <rect x="440" y="185" width="160" height="165" rx="18" fill="url(#steel)" stroke="#334155" filter="url(#shadow)" />
      <circle cx="520" cy="308" r="62" fill="#f8fafc" stroke="#334155" strokeWidth="7" />

      {sensorType === "Turbine Flow" && (
        <g transform={`translate(520 308) rotate(${measuredFlow * 4})`}>
          {Array.from({ length: 6 }).map((_, i) => (
            <path key={i} d="M0 0 L18 -9 L55 0 L18 9 Z" fill="#2563eb" transform={`rotate(${i * 60})`} />
          ))}
          <circle r="10" fill="#111827" />
        </g>
      )}

      {sensorType === "Magnetic Flow" && (
        <g>
          <rect x="470" y="250" width="22" height="115" rx="8" fill="#ef4444" />
          <rect x="548" y="250" width="22" height="115" rx="8" fill="#2563eb" />
          <text x="487" y="230" fontSize="13" fill="#475569">Magnetic Field</text>
        </g>
      )}

      {sensorType === "Ultrasonic Flow" && (
        <g>
          <rect x="455" y="232" width="45" height="30" rx="8" fill="#2563eb" />
          <rect x="540" y="354" width="45" height="30" rx="8" fill="#2563eb" />
          <line x1="500" y1="250" x2="540" y2="354" stroke="#2563eb" strokeDasharray="7 6" strokeWidth="3" />
          <text x="445" y="220" fontSize="13" fill="#475569">Ultrasonic Transit Time</text>
        </g>
      )}

      {sensorType === "Vortex Flow" && (
        <g>
          <rect x="505" y="270" width="30" height="75" rx="8" fill="#111827" />
          {Array.from({ length: 4 }).map((_, i) => (
            <path key={i} d={`M545 ${275 + i * 18} C580 ${260 + i * 15}, 610 ${300 + i * 12}, 645 ${280 + i * 15}`} fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="6 6" />
          ))}
          <text x="475" y="230" fontSize="13" fill="#475569">Vortex Shedding</text>
        </g>
      )}

      <circle cx="470" cy="215" r="7" fill={power ? "#22c55e" : "#64748b"} />
      <circle cx="495" cy="215" r="7" fill={highAlarm ? "#ef4444" : conductiveOk ? "#22c55e" : "#ef4444"} />

      <path d="M600 260 C690 150 770 195 820 260" fill="none" stroke="#111827" strokeWidth="18" strokeLinecap="round" />
      <rect x="820" y="210" width="150" height="105" rx="16" fill="#f8fafc" stroke="#94a3b8" filter="url(#shadow)" />
      <text x="850" y="240" fontSize="15" fontWeight="700" fill="#2563eb">PLC / AI</text>
      <text x="845" y="267" fontSize="13" fill="#475569">{current.toFixed(1)} mA</text>
      <text x="845" y="290" fontSize="13" fill="#475569">{pulseHz.toFixed(0)} Hz</text>

      {power && measuredFlow > 0 && (
        <circle r="5" fill={highAlarm ? "#ef4444" : "#22c55e"}>
          <animateMotion dur="1.3s" repeatCount="indefinite" path="M600 260 C690 150 770 195 820 260" />
        </circle>
      )}

      <line x1="140" y1="145" x2="440" y2="145" stroke="#9ca3af" />
      <text x="290" y="135" textAnchor="middle" fill={highAlarm || !conductiveOk ? "#dc2626" : "#2563eb"} fontSize="22" fontWeight="700">
        {measuredFlow.toFixed(0)}% FLOW
      </text>
      <text x="290" y="170" textAnchor="middle" fill="#111" fontSize="13">
        Alarm Setpoint: {alarmSet}%
      </text>

      {(highAlarm || !conductiveOk) && (
        <text x="520" y="150" fill="#dc2626" fontSize="24" fontWeight="700">
          {!conductiveOk ? "INVALID FLOW MEDIUM" : "HIGH FLOW ALARM"}
        </text>
      )}

      <text x="440" y="175" fontSize="13" fill="#475569">{sensorType} Sensor</text>
      <text x="80" y="505" fontSize="13" fill="#475569">Industrial pipe flow measurement station</text>
      <text x="80" y="530" fontSize="13" fill="#64748b">Process Pipe → Flow Sensor → Pulse / Analog Output → PLC</text>
    </svg>
  );
}

function LiveReadout({ flowRate, measuredFlow, alarmSet, highAlarm, conductiveOk, current, voltage, pulseHz, sensorType, outputMode, fluidType }: any) {
  return (
    <div className="absolute right-3 top-3 w-[238px] rounded-lg border bg-white shadow-lg sm:right-5 sm:top-16 sm:w-[300px]">
      <div className="flex h-12 items-center gap-3 border-b px-4 font-bold text-blue-600"><Activity size={20} /> LIVE READOUT</div>
      <div className="space-y-4 p-4 text-xs sm:text-sm">
        <Read label="Actual Flow" value={`${flowRate.toFixed(0)}%`} green />
        <Read label="Measured Flow" value={`${measuredFlow.toFixed(0)}%`} green={conductiveOk} danger={!conductiveOk} />
        <Read label="Alarm Set" value={`${alarmSet}%`} />
        <Read label="Alarm" value={!conductiveOk ? "INVALID" : highAlarm ? "HIGH" : "NORMAL"} danger={highAlarm || !conductiveOk} green={!highAlarm && conductiveOk} />
        <Read label="Current" value={`${current.toFixed(1)} mA`} />
        <Read label="Voltage" value={`${voltage.toFixed(2)} V`} />
        <Read label="Pulse" value={`${pulseHz.toFixed(0)} Hz`} />
        <Read label="Sensor Type" value={sensorType} />
        <Read label="Output Mode" value={outputMode} />
        <Read label="Fluid" value={fluidType} />
      </div>
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

function WiringSvg({ outputMode, outputOn, current, voltage, pulseHz }: any) {
  return (
    <svg viewBox="0 0 620 190" className="h-[190px] w-full">
      <rect x="25" y="62" width="105" height="72" rx="14" fill="#94a3b8" stroke="#334155" />
      <circle cx="78" cy="98" r="28" fill="#f8fafc" stroke="#334155" />
      <path d="M63 98 C73 78 90 118 103 98" fill="none" stroke="#2563eb" strokeWidth="4" />
      <circle cx="110" cy="80" r="5" fill={outputOn ? "#22c55e" : "#64748b"} />

      <polyline points="130,72 175,35 205,35" fill="none" stroke="#dc2626" strokeWidth="2" />
      <line x1="205" y1="35" x2="410" y2="35" stroke="#dc2626" strokeWidth="2" />
      <polygon points="410,29 426,35 410,41" fill="#dc2626" />

      <line x1="130" y1="95" x2="410" y2="95" stroke={outputOn ? "#16a34a" : "#111"} strokeWidth={outputOn ? 4 : 2} />
      <polygon points="410,88 426,95 410,102" fill={outputOn ? "#16a34a" : "#111"} />

      <polyline points="130,118 175,155 205,155" fill="none" stroke="#2563eb" strokeWidth="2" />
      <line x1="205" y1="155" x2="410" y2="155" stroke="#2563eb" strokeWidth="2" />
      <polygon points="410,149 426,155 410,161" fill="#2563eb" />

      {outputOn && (
        <circle r="5" fill="#22c55e">
          <animateMotion dur="1.2s" repeatCount="indefinite" path="M130 95 L410 95" />
        </circle>
      )}

      <text x="215" y="30" fontSize="14" fill="#7f1d1d">Brown</text>
      <text x="215" y="88" fontSize="14">Black / Signal</text>
      <text x="215" y="148" fontSize="14" fill="#2563eb">Blue</text>

      <text x="450" y="40" fontSize="14">+24 V DC</text>
      <text x="450" y="100" fontSize="14">
        {outputMode === "4-20mA" ? `${current.toFixed(1)} mA` : outputMode === "0-10V" ? `${voltage.toFixed(2)} V` : outputMode === "Pulse Output" ? `${pulseHz.toFixed(0)} Hz` : "PLC Input"}
      </text>
      <text x="450" y="160" fontSize="14">0 V DC</text>

      <text x="35" y="175" fontSize="12" fill="#475569">3-wire flow sensor connection</text>
    </svg>
  );
}

function LearningTab({ tab, sensorType, outputMode }: any) {
  const data: Record<string, { icon: any; title: string; points: string[] }> = {
    Theory: {
      icon: <BookOpen size={22} />,
      title: "Flow Sensor Theory",
      points: [
        "Flow sensors measure the movement rate of liquid or gas through a pipe.",
        "Turbine flow sensors generate pulses as the rotor spins with flow.",
        "Magnetic flow sensors require conductive liquid.",
        "Ultrasonic and vortex sensors can measure flow without moving mechanical parts.",
      ],
    },
    "Wiring Diagram": {
      icon: <Zap size={22} />,
      title: `${outputMode} Wiring Explanation`,
      points: [
        "Brown wire connects to +24 V DC.",
        "Blue wire connects to 0 V DC.",
        "Black wire carries pulse, analog, or switch output.",
        "Pulse output is useful for totalizer counting; 4–20mA is useful for continuous flow measurement.",
      ],
    },
    Quiz: {
      icon: <CheckCircle2 size={22} />,
      title: "Quick Quiz",
      points: [
        "Q1: Which flow sensor uses a rotating blade?",
        "Q2: Why does magnetic flow require conductive liquid?",
        "Q3: What is pulse output used for?",
        "Q4: Which output is common for PLC analog flow reading?",
      ],
    },
    Report: {
      icon: <FileText size={22} />,
      title: "Simulation Report",
      points: [
        `Selected sensor type: ${sensorType}`,
        `Selected output mode: ${outputMode}`,
        "Recommended activity: change flow rate and observe pulse frequency.",
        "Compare magnetic, turbine, ultrasonic and vortex flow behavior.",
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