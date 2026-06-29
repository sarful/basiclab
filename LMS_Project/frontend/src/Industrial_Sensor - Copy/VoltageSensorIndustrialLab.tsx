"use client";

import React, { useMemo, useState } from "react";
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

type Tab = "Simulator" | "Theory" | "Wiring Diagram" | "Quiz" | "Report";
type SensorType =
  | "AC Voltage Sensor"
  | "DC Voltage Sensor"
  | "Voltage Transducer"
  | "Isolated Voltage Sensor";
type OutputMode = "0-10V" | "4-20mA" | "Relay Alarm" | "PLC Analog Input";
type SourceType = "Single Phase AC" | "Three Phase AC" | "DC Bus" | "Battery Bank";

export default function VoltageSensorIndustrialLab() {
  const [tab, setTab] = useState<Tab>("Simulator");
  const [power, setPower] = useState(true);
  const [sensorType, setSensorType] = useState<SensorType>("Voltage Transducer");
  const [sourceType, setSourceType] = useState<SourceType>("Single Phase AC");
  const [outputMode, setOutputMode] = useState<OutputMode>("4-20mA");
  const [voltage, setVoltage] = useState(220);
  const [alarmSet, setAlarmSet] = useState(240);
  const [alarmCount, setAlarmCount] = useState(1);

  const maxVoltage =
    sourceType === "DC Bus" ? 600 : sourceType === "Battery Bank" ? 120 : 440;

  const percent = Math.min(100, Math.max(0, (voltage / maxVoltage) * 100));
  const outputV = power ? (percent / 100) * 10 : 0;
  const current = power ? 4 + (percent / 100) * 16 : 0;
  const highAlarm = power && voltage >= alarmSet;
  const outputOn = power && (outputMode === "Relay Alarm" ? highAlarm : voltage > 0);

  function updateVoltage(v: number) {
    const next = Number(Math.max(0, Math.min(maxVoltage, v)).toFixed(0));
    if (!highAlarm && power && next >= alarmSet) setAlarmCount((n) => n + 1);
    setVoltage(next);
  }

  function reset() {
    setPower(false);
    setSensorType("Voltage Transducer");
    setSourceType("Single Phase AC");
    setOutputMode("4-20mA");
    setVoltage(220);
    setAlarmSet(240);
    setAlarmCount(0);
    setTab("Simulator");
  }

  const logs = useMemo(() => {
    if (!power) return [["--:--", "Power OFF", "text-slate-500"]];
    return [
      ["10:24:15", "Voltage Sensor Started", "text-slate-700"],
      highAlarm
        ? ["10:24:18", "Over Voltage Alarm", "text-red-600"]
        : ["10:24:23", "Voltage Normal", "text-green-600"],
      ["10:24:18", `${outputV.toFixed(2)} V / ${current.toFixed(1)} mA`, "text-slate-900"],
      ["LIVE", `${sensorType} / ${sourceType}`, "text-blue-600"],
    ];
  }, [power, highAlarm, outputV, current, sensorType, sourceType]);

  return (
    <main className="min-h-screen bg-white p-3 text-slate-950 sm:p-4 lg:p-5">
      <div className="mx-auto max-w-[1560px] space-y-4">
        <Header tab={tab} setTab={setTab} />

        {tab !== "Simulator" ? (
          <LearningTab tab={tab} sensorType={sensorType} outputMode={outputMode} />
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <aside className="space-y-4 xl:col-span-3">
              <Panel title="VOLTAGE SENSOR CONFIGURATION" icon={<Settings size={20} />}>
                <Control label="Sensor Type">
                  <Select value={sensorType} onChange={(v) => setSensorType(v as SensorType)}>
                    <option>AC Voltage Sensor</option>
                    <option>DC Voltage Sensor</option>
                    <option>Voltage Transducer</option>
                    <option>Isolated Voltage Sensor</option>
                  </Select>
                </Control>

                <Control label="Source Type">
                  <Select value={sourceType} onChange={(v) => setSourceType(v as SourceType)}>
                    <option>Single Phase AC</option>
                    <option>Three Phase AC</option>
                    <option>DC Bus</option>
                    <option>Battery Bank</option>
                  </Select>
                </Control>

                <Control label="Output Mode">
                  <Select value={outputMode} onChange={(v) => setOutputMode(v as OutputMode)}>
                    <option>0-10V</option>
                    <option>4-20mA</option>
                    <option>Relay Alarm</option>
                    <option>PLC Analog Input</option>
                  </Select>
                </Control>

                <Control label="Alarm Set">
                  <div className="grid grid-cols-[1fr_42px_42px] gap-2">
                    <div className="input flex items-center justify-between">
                      <b>{alarmSet}</b>
                      <span>V</span>
                    </div>
                    <button className="miniBtn" onClick={() => setAlarmSet(Math.max(10, alarmSet - 10))}>−</button>
                    <button className="miniBtn" onClick={() => setAlarmSet(Math.min(maxVoltage, alarmSet + 10))}>+</button>
                  </div>
                </Control>

                <Control label="Supply">
                  <div className="input flex items-center justify-between">
                    <span>24 V DC</span>
                    <Zap size={15} className="text-blue-600" />
                  </div>
                </Control>
              </Panel>

              <Panel title="VOLTAGE SENSOR STATUS" icon={<Activity size={20} />}>
                <Status label="Power" value={power ? "Active" : "OFF"} dot={power} />
                <Status label="Alarm" value={highAlarm ? "OVERVOLT" : "NORMAL"} badge={highAlarm} danger={highAlarm} />
                <Status label="Output" value={outputOn ? "ACTIVE" : "OFF"} badge={outputOn} />
                <Status label="Voltage" value={`${voltage} V`} distance />
                <Status label="Range" value={`0-${maxVoltage} V`} />
              </Panel>

              <Panel title="INSTRUCTIONS" icon={<Info size={20} />}>
                <ol className="space-y-3 text-sm leading-relaxed">
                  <li>1. Select AC/DC voltage source.</li>
                  <li>2. Adjust measured voltage.</li>
                  <li>3. Observe scaling, isolation and output signal.</li>
                  <li>4. Compare 0–10V, 4–20mA and relay alarm.</li>
                </ol>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button onClick={() => setPower(true)} className="primaryBtn"><Play size={17} /> Start</button>
                  <button onClick={() => setPower(false)} className="secondaryBtn"><Square size={15} /> Stop</button>
                  <button onClick={reset} className="secondaryBtn col-span-2"><RotateCcw size={17} /> Reset</button>
                </div>
              </Panel>
            </aside>

            <section className="space-y-4 xl:col-span-9">
              <Panel title="VOLTAGE SENSOR SIMULATION AREA" icon={<Monitor size={20} />}>
                <div className="relative h-[420px] overflow-hidden rounded-xl bg-white sm:h-[500px] lg:h-[575px]">
                  <VoltageScene
                    power={power}
                    sensorType={sensorType}
                    sourceType={sourceType}
                    voltage={voltage}
                    alarmSet={alarmSet}
                    highAlarm={highAlarm}
                    outputV={outputV}
                    current={current}
                    percent={percent}
                  />

                  <LiveReadout
                    voltage={voltage}
                    alarmSet={alarmSet}
                    highAlarm={highAlarm}
                    outputV={outputV}
                    current={current}
                    percent={percent}
                    sensorType={sensorType}
                    sourceType={sourceType}
                    outputMode={outputMode}
                  />

                  <div className="absolute bottom-4 left-1/2 w-[86%] max-w-xl -translate-x-1/2 rounded-xl border bg-white/95 p-3 shadow-sm">
                    <input
                      type="range"
                      min={0}
                      max={maxVoltage}
                      value={voltage}
                      onChange={(e) => updateVoltage(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                    <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                      <span>0V</span>
                      <span>Adjust measured voltage</span>
                      <span>{maxVoltage}V</span>
                    </div>
                  </div>
                </div>
              </Panel>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12">
                <Panel title="I/O INDICATOR" icon={<Cpu size={19} />} className="xl:col-span-3">
                  <div className="grid h-[190px] grid-cols-3 place-items-center">
                    <Lamp label="POWER" on={power} />
                    <Lamp label="SIGNAL" on={power && voltage > 0} />
                    <Lamp label="ALARM" on={highAlarm} danger />
                  </div>
                </Panel>

                <Panel title="VOLTAGE SENSOR CONNECTION" icon={<Settings size={19} />} className="xl:col-span-5">
                  <WiringSvg outputMode={outputMode} outputOn={outputOn} current={current} outputV={outputV} />
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
                    Overvoltage Count: <b>{alarmCount}</b>
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
          <p className="text-base text-blue-600 sm:text-lg">Voltage Sensor Simulation</p>
        </div>
      </div>

      <nav className="flex overflow-x-auto rounded-xl border bg-white shadow-sm lg:col-span-6">
        {tabs.map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`min-w-[135px] flex-1 px-4 py-4 text-sm ${
              tab === item ? "border-b-2 border-blue-600 text-blue-600" : "text-slate-700"
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

function VoltageScene({ power, sensorType, sourceType, voltage, alarmSet, highAlarm, outputV, current, percent }: any) {
  const needleAngle = -130 + percent * 2.6;

  return (
    <svg viewBox="0 0 1120 560" className="h-full w-full">
      <defs>
        <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="8" floodOpacity=".2" /></filter>
        <linearGradient id="metal" x1="0" x2="1">
          <stop offset="0" stopColor="#111827" />
          <stop offset=".25" stopColor="#e5e7eb" />
          <stop offset=".55" stopColor="#64748b" />
          <stop offset=".82" stopColor="#f8fafc" />
          <stop offset="1" stopColor="#111827" />
        </linearGradient>
      </defs>

      <rect x="70" y="420" width="980" height="42" rx="8" fill="#e5e7eb" stroke="#94a3b8" />
      <rect x="105" y="435" width="910" height="10" rx="5" fill="#cbd5e1" />

      <rect x="110" y="210" width="210" height="150" rx="18" fill="#f8fafc" stroke="#334155" filter="url(#shadow)" />
      <text x="145" y="245" fontSize="18" fontWeight="700" fill="#2563eb">SOURCE</text>
      <text x="135" y="280" fontSize="14" fill="#475569">{sourceType}</text>
      <text x="135" y="315" fontSize="24" fontWeight="700" fill={highAlarm ? "#dc2626" : "#111827"}>
        {voltage} V
      </text>

      <path d="M320 285 C390 240 430 330 500 285" fill="none" stroke="#111827" strokeWidth="18" strokeLinecap="round" />
      {power && (
        <circle r="5" fill={highAlarm ? "#ef4444" : "#22c55e"}>
          <animateMotion dur="1.1s" repeatCount="indefinite" path="M320 285 C390 240 430 330 500 285" />
        </circle>
      )}

      <rect x="500" y="215" width="165" height="145" rx="18" fill="url(#metal)" stroke="#111827" filter="url(#shadow)" />
      <text x="530" y="250" fontSize="16" fontWeight="700" fill="#111827">VOLTAGE</text>
      <text x="525" y="272" fontSize="16" fontWeight="700" fill="#111827">TRANSDUCER</text>
      <circle cx="535" cy="320" r="7" fill={power ? "#22c55e" : "#64748b"} />
      <circle cx="560" cy="320" r="7" fill={highAlarm ? "#ef4444" : "#22c55e"} />

      <path d="M665 285 C735 185 805 185 860 260" fill="none" stroke="#111827" strokeWidth="18" strokeLinecap="round" />
      {power && (
        <circle r="5" fill={highAlarm ? "#ef4444" : "#22c55e"}>
          <animateMotion dur="1.25s" repeatCount="indefinite" path="M665 285 C735 185 805 185 860 260" />
        </circle>
      )}

      <circle cx="800" cy="285" r="105" fill="#f8fafc" stroke="#334155" strokeWidth="8" filter="url(#shadow)" />
      <circle cx="800" cy="285" r="76" fill="#ffffff" stroke="#cbd5e1" />
      {Array.from({ length: 11 }).map((_, i) => {
        const a = (-130 + i * 26) * Math.PI / 180;
        return (
          <line
            key={i}
            x1={800 + Math.cos(a) * 70}
            y1={285 + Math.sin(a) * 70}
            x2={800 + Math.cos(a) * 88}
            y2={285 + Math.sin(a) * 88}
            stroke="#475569"
            strokeWidth="3"
          />
        );
      })}
      <g transform={`rotate(${needleAngle} 800 285)`}>
        <line x1="800" y1="285" x2="872" y2="285" stroke={highAlarm ? "#ef4444" : "#2563eb"} strokeWidth="5" strokeLinecap="round" />
      </g>
      <circle cx="800" cy="285" r="8" fill="#111827" />
      <text x="770" y="330" fontSize="18" fontWeight="700" fill={highAlarm ? "#dc2626" : "#2563eb"}>
        {voltage} V
      </text>

      <rect x="900" y="230" width="150" height="105" rx="16" fill="#f8fafc" stroke="#94a3b8" filter="url(#shadow)" />
      <text x="930" y="260" fontSize="15" fontWeight="700" fill="#2563eb">PLC AI</text>
      <text x="925" y="287" fontSize="13" fill="#475569">{outputV.toFixed(2)} V</text>
      <text x="925" y="310" fontSize="13" fill="#475569">{current.toFixed(1)} mA</text>

      <line x1="140" y1="145" x2="440" y2="145" stroke="#9ca3af" />
      <text x="290" y="135" textAnchor="middle" fill={highAlarm ? "#dc2626" : "#2563eb"} fontSize="22" fontWeight="700">
        {voltage} V
      </text>
      <text x="290" y="170" textAnchor="middle" fill="#111" fontSize="13">
        Alarm Setpoint: {alarmSet} V
      </text>

      {highAlarm && (
        <text x="500" y="150" fill="#dc2626" fontSize="24" fontWeight="700">
          OVER VOLTAGE ALARM
        </text>
      )}

      <text x="500" y="198" fontSize="13" fill="#475569">{sensorType}</text>
      <text x="80" y="505" fontSize="13" fill="#475569">Industrial voltage monitoring and isolation station</text>
      <text x="80" y="530" fontSize="13" fill="#64748b">Voltage Source → Isolated Transducer → PLC Analog / Alarm Output</text>
    </svg>
  );
}

function LiveReadout({ voltage, alarmSet, highAlarm, outputV, current, percent, sensorType, sourceType, outputMode }: any) {
  return (
    <div className="absolute right-3 top-3 w-[238px] rounded-lg border bg-white shadow-lg sm:right-5 sm:top-16 sm:w-[300px]">
      <div className="flex h-12 items-center gap-3 border-b px-4 font-bold text-blue-600">
        <Activity size={20} /> LIVE READOUT
      </div>
      <div className="space-y-4 p-4 text-xs sm:text-sm">
        <Read label="Input Voltage" value={`${voltage} V`} green={!highAlarm} danger={highAlarm} />
        <Read label="Alarm Set" value={`${alarmSet} V`} />
        <Read label="Alarm" value={highAlarm ? "OVERVOLT" : "NORMAL"} danger={highAlarm} green={!highAlarm} />
        <Read label="Range %" value={`${percent.toFixed(0)}%`} />
        <Read label="0-10V Output" value={`${outputV.toFixed(2)} V`} />
        <Read label="4-20mA Output" value={`${current.toFixed(1)} mA`} />
        <Read label="Sensor Type" value={sensorType} />
        <Read label="Source Type" value={sourceType} />
        <Read label="Output Mode" value={outputMode} />
      </div>
    </div>
  );
}

function WiringSvg({ outputMode, outputOn, current, outputV }: any) {
  return (
    <svg viewBox="0 0 620 190" className="h-[190px] w-full">
      <rect x="25" y="62" width="105" height="72" rx="14" fill="#94a3b8" stroke="#334155" />
      <text x="52" y="105" fontSize="18" fontWeight="700" fill="white">V</text>
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
        {outputMode === "4-20mA"
          ? `${current.toFixed(1)} mA`
          : outputMode === "0-10V"
          ? `${outputV.toFixed(2)} V`
          : outputMode === "Relay Alarm"
          ? "Relay Output"
          : "PLC Analog"}
      </text>
      <text x="450" y="160" fontSize="14">0 V DC</text>

      <text x="35" y="175" fontSize="12" fill="#475569">3-wire isolated voltage sensor connection</text>
    </svg>
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

function LearningTab({ tab, sensorType, outputMode }: any) {
  const data: Record<string, { icon: any; title: string; points: string[] }> = {
    Theory: {
      icon: <BookOpen size={22} />,
      title: "Voltage Sensor Theory",
      points: [
        "Voltage sensors measure AC or DC voltage and convert it into a safe signal.",
        "Voltage transducers provide isolation between high voltage and PLC circuits.",
        "0–10V and 4–20mA outputs are common for PLC analog input.",
        "Relay alarm output can be used for overvoltage protection.",
      ],
    },
    "Wiring Diagram": {
      icon: <Zap size={22} />,
      title: `${outputMode} Wiring Explanation`,
      points: [
        "High-voltage input connects to the sensor measuring terminals.",
        "Sensor supply uses 24 V DC.",
        "Signal output connects to PLC analog input or relay input.",
        "Isolation protects low-voltage control circuits from hazardous voltage.",
      ],
    },
    Quiz: {
      icon: <CheckCircle2 size={22} />,
      title: "Quick Quiz",
      points: [
        "Q1: Why is isolation important in voltage sensing?",
        "Q2: Which output is better for long cable distance?",
        "Q3: What is the purpose of overvoltage alarm?",
        "Q4: Difference between AC voltage sensor and DC voltage sensor?",
      ],
    },
    Report: {
      icon: <FileText size={22} />,
      title: "Simulation Report",
      points: [
        `Selected sensor type: ${sensorType}`,
        `Selected output mode: ${outputMode}`,
        "Recommended activity: increase voltage and observe output scaling.",
        "Observe alarm behavior when voltage crosses setpoint.",
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