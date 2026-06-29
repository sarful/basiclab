"use client";

import React, { useMemo, useState } from "react";
import {
  Activity, BookOpen, CheckCircle2, ClipboardList, Cpu, FileText,
  Info, Maximize, Monitor, Play, RotateCcw, Settings, Square,
  Sun, Volume2, Zap,
} from "lucide-react";

type Tab = "Simulator" | "Theory" | "Wiring Diagram" | "Quiz" | "Report";
type CellType = "S-Type Load Cell" | "Beam Load Cell" | "Compression Load Cell" | "Platform Load Cell";
type OutputMode = "mV/V Signal" | "Transmitter 4-20mA" | "0-10V" | "PLC Analog Input";
type Application = "Weighing Scale" | "Tank Weighing" | "Press Force" | "Conveyor Weighing";

export default function LoadCellIndustrialLab() {
  const [tab, setTab] = useState<Tab>("Simulator");
  const [power, setPower] = useState(true);
  const [cellType, setCellType] = useState<CellType>("Beam Load Cell");
  const [outputMode, setOutputMode] = useState<OutputMode>("Transmitter 4-20mA");
  const [application, setApplication] = useState<Application>("Weighing Scale");
  const [capacity, setCapacity] = useState(1000);
  const [alarmSet, setAlarmSet] = useState(800);
  const [loadKg, setLoadKg] = useState(420);
  const [alarmCount, setAlarmCount] = useState(1);

  const percent = Math.min(100, Math.max(0, (loadKg / capacity) * 100));
  const deformation = percent * 0.28;
  const mvSignal = power ? (percent / 100) * 20 : 0;
  const current = power ? 4 + (percent / 100) * 16 : 0;
  const voltage = power ? (percent / 100) * 10 : 0;
  const overload = power && loadKg >= alarmSet;
  const outputOn = power && loadKg > 0;

  function updateLoad(v: number) {
    const next = Number(Math.max(0, Math.min(capacity, v)).toFixed(0));
    if (!overload && power && next >= alarmSet) setAlarmCount((n) => n + 1);
    setLoadKg(next);
  }

  function reset() {
    setPower(false);
    setCellType("Beam Load Cell");
    setOutputMode("Transmitter 4-20mA");
    setApplication("Weighing Scale");
    setCapacity(1000);
    setAlarmSet(800);
    setLoadKg(420);
    setAlarmCount(0);
    setTab("Simulator");
  }

  const logs = useMemo(() => {
    if (!power) return [["--:--", "Power OFF", "text-slate-500"]];
    return [
      ["10:24:15", "Load Cell System Started", "text-slate-700"],
      overload ? ["10:24:18", "Overload Alarm", "text-red-600"] : ["10:24:23", "Load Normal", "text-green-600"],
      ["10:24:18", `${mvSignal.toFixed(2)} mV / ${current.toFixed(1)} mA`, "text-slate-900"],
      ["LIVE", `${cellType} / ${application}`, "text-blue-600"],
    ];
  }, [power, overload, mvSignal, current, cellType, application]);

  return (
    <main className="min-h-screen bg-white p-3 text-slate-950 sm:p-4 lg:p-5">
      <div className="mx-auto max-w-[1560px] space-y-4">
        <Header tab={tab} setTab={setTab} />

        {tab !== "Simulator" ? (
          <LearningTab tab={tab} cellType={cellType} outputMode={outputMode} />
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <aside className="space-y-4 xl:col-span-3">
              <Panel title="LOAD CELL CONFIGURATION" icon={<Settings size={20} />}>
                <Control label="Cell Type">
                  <Select value={cellType} onChange={(v) => setCellType(v as CellType)}>
                    <option>S-Type Load Cell</option>
                    <option>Beam Load Cell</option>
                    <option>Compression Load Cell</option>
                    <option>Platform Load Cell</option>
                  </Select>
                </Control>

                <Control label="Application">
                  <Select value={application} onChange={(v) => setApplication(v as Application)}>
                    <option>Weighing Scale</option>
                    <option>Tank Weighing</option>
                    <option>Press Force</option>
                    <option>Conveyor Weighing</option>
                  </Select>
                </Control>

                <Control label="Output Mode">
                  <Select value={outputMode} onChange={(v) => setOutputMode(v as OutputMode)}>
                    <option>mV/V Signal</option>
                    <option>Transmitter 4-20mA</option>
                    <option>0-10V</option>
                    <option>PLC Analog Input</option>
                  </Select>
                </Control>

                <Control label="Capacity">
                  <div className="grid grid-cols-[1fr_42px_42px] gap-2">
                    <div className="input flex items-center justify-between"><b>{capacity}</b><span>kg</span></div>
                    <button className="miniBtn" onClick={() => setCapacity(Math.max(100, capacity - 100))}>−</button>
                    <button className="miniBtn" onClick={() => setCapacity(Math.min(5000, capacity + 100))}>+</button>
                  </div>
                </Control>

                <Control label="Alarm Set">
                  <div className="grid grid-cols-[1fr_42px_42px] gap-2">
                    <div className="input flex items-center justify-between"><b>{alarmSet}</b><span>kg</span></div>
                    <button className="miniBtn" onClick={() => setAlarmSet(Math.max(50, alarmSet - 50))}>−</button>
                    <button className="miniBtn" onClick={() => setAlarmSet(Math.min(capacity, alarmSet + 50))}>+</button>
                  </div>
                </Control>

                <Control label="Excitation">
                  <div className="input flex items-center justify-between"><span>10 V DC</span><Zap size={15} className="text-blue-600" /></div>
                </Control>
              </Panel>

              <Panel title="LOAD CELL STATUS" icon={<Activity size={20} />}>
                <Status label="Power" value={power ? "Active" : "OFF"} dot={power} />
                <Status label="Alarm" value={overload ? "OVERLOAD" : "NORMAL"} badge={overload} danger={overload} />
                <Status label="Output" value={outputOn ? "ACTIVE" : "OFF"} badge={outputOn} />
                <Status label="Load" value={`${loadKg} kg`} distance />
                <Status label="Capacity" value={`${capacity} kg`} />
              </Panel>

              <Panel title="INSTRUCTIONS" icon={<Info size={20} />}>
                <ol className="space-y-3 text-sm leading-relaxed">
                  <li>1. Select load cell type and application.</li>
                  <li>2. Adjust applied load using slider.</li>
                  <li>3. Observe bridge strain and signal output.</li>
                  <li>4. Compare mV/V, 4–20mA and 0–10V output.</li>
                </ol>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button onClick={() => setPower(true)} className="primaryBtn"><Play size={17} /> Start</button>
                  <button onClick={() => setPower(false)} className="secondaryBtn"><Square size={15} /> Stop</button>
                  <button onClick={reset} className="secondaryBtn col-span-2"><RotateCcw size={17} /> Reset</button>
                </div>
              </Panel>
            </aside>

            <section className="space-y-4 xl:col-span-9">
              <Panel title="LOAD CELL SIMULATION AREA" icon={<Monitor size={20} />}>
                <div className="relative h-[420px] overflow-hidden rounded-xl bg-white sm:h-[500px] lg:h-[575px]">
                  <LoadCellScene
                    power={power}
                    cellType={cellType}
                    application={application}
                    loadKg={loadKg}
                    capacity={capacity}
                    alarmSet={alarmSet}
                    overload={overload}
                    mvSignal={mvSignal}
                    current={current}
                    voltage={voltage}
                    percent={percent}
                    deformation={deformation}
                  />

                  <LiveReadout
                    loadKg={loadKg}
                    capacity={capacity}
                    alarmSet={alarmSet}
                    overload={overload}
                    mvSignal={mvSignal}
                    current={current}
                    voltage={voltage}
                    percent={percent}
                    deformation={deformation}
                    cellType={cellType}
                    outputMode={outputMode}
                    application={application}
                  />

                  <div className="absolute bottom-4 left-1/2 w-[86%] max-w-xl -translate-x-1/2 rounded-xl border bg-white/95 p-3 shadow-sm">
                    <input
                      type="range"
                      min={0}
                      max={capacity}
                      step={1}
                      value={loadKg}
                      onChange={(e) => updateLoad(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                    <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                      <span>0 kg</span>
                      <span>Adjust applied weight / force</span>
                      <span>{capacity} kg</span>
                    </div>
                  </div>
                </div>
              </Panel>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12">
                <Panel title="I/O INDICATOR" icon={<Cpu size={19} />} className="xl:col-span-3">
                  <div className="grid h-[190px] grid-cols-3 place-items-center">
                    <Lamp label="POWER" on={power} />
                    <Lamp label="SIGNAL" on={outputOn} />
                    <Lamp label="ALARM" on={overload} danger />
                  </div>
                </Panel>

                <Panel title="LOAD CELL CONNECTION" icon={<Settings size={19} />} className="xl:col-span-5">
                  <WiringSvg outputMode={outputMode} outputOn={outputOn} mvSignal={mvSignal} current={current} voltage={voltage} />
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
                    Overload Count: <b>{alarmCount}</b>
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
          <p className="text-base text-blue-600 sm:text-lg">Load Cell Simulation</p>
        </div>
      </div>

      <nav className="flex overflow-x-auto rounded-xl border bg-white shadow-sm lg:col-span-6">
        {tabs.map((item) => (
          <button key={item} onClick={() => setTab(item)}
            className={`min-w-[135px] flex-1 px-4 py-4 text-sm ${tab === item ? "border-b-2 border-blue-600 text-blue-600" : "text-slate-700"}`}
          >
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

function LoadCellScene({ power, cellType, application, loadKg, capacity, alarmSet, overload, mvSignal, current, voltage, percent, deformation }: any) {
  const plateY = 190 + deformation;
  const beamBend = deformation * 0.85;

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

      <rect x="190" y={plateY} width="280" height="42" rx="8" fill="#d1d5db" stroke="#64748b" filter="url(#shadow)" />
      <rect x="255" y={plateY - 82} width="150" height="76" rx="10" fill={overload ? "#fecaca" : "#e5e7eb"} stroke={overload ? "#dc2626" : "#94a3b8"} />
      <text x="285" y={plateY - 38} fontSize="20" fontWeight="700" fill={overload ? "#dc2626" : "#111827"}>{loadKg} kg</text>

      {cellType === "Beam Load Cell" && (
        <g filter="url(#shadow)">
          <path
            d={`M230 315 C330 ${315 + beamBend}, 430 ${315 + beamBend}, 530 315`}
            fill="none"
            stroke={overload ? "#ef4444" : "#2563eb"}
            strokeWidth="34"
            strokeLinecap="round"
          />
          <circle cx="260" cy="315" r="18" fill="#f8fafc" stroke="#334155" />
          <circle cx="500" cy="315" r="18" fill="#f8fafc" stroke="#334155" />
          <rect x="365" y={300 + beamBend} width="42" height="28" rx="6" fill="#111827" />
          <text x="330" y="365" fontSize="13" fill="#475569">Strain Gauge Zone</text>
        </g>
      )}

      {cellType === "S-Type Load Cell" && (
        <g filter="url(#shadow)">
          <path d="M330 235 H465 V275 H370 V315 H465 V355 H330 Z" fill="url(#steel)" stroke="#334155" strokeWidth="4" />
          <circle cx="360" cy="255" r="18" fill="#f8fafc" stroke="#334155" />
          <circle cx="360" cy="335" r="18" fill="#f8fafc" stroke="#334155" />
          <rect x="398" y="284" width="30" height="22" rx="5" fill="#111827" />
        </g>
      )}

      {cellType === "Compression Load Cell" && (
        <g filter="url(#shadow)">
          <circle cx="380" cy="310" r="75" fill="url(#steel)" stroke="#334155" strokeWidth="5" />
          <circle cx="380" cy="310" r="35" fill="#f8fafc" stroke="#94a3b8" strokeWidth="4" />
          <rect x="335" y="220" width="90" height="25" rx="6" fill="#d1d5db" stroke="#64748b" />
          <rect x="335" y="380" width="90" height="25" rx="6" fill="#d1d5db" stroke="#64748b" />
        </g>
      )}

      {cellType === "Platform Load Cell" && (
        <g filter="url(#shadow)">
          <rect x="225" y="310" width="300" height="48" rx="10" fill="url(#steel)" stroke="#334155" />
          {[260, 335, 410, 485].map((x) => <rect key={x} x={x} y="360" width="36" height="48" rx="8" fill="#94a3b8" stroke="#475569" />)}
          <text x="320" y="395" fontSize="13" fill="#475569">Platform Support Cells</text>
        </g>
      )}

      {power && (
        <g>
          <line x1="530" y1="315" x2="690" y2="285" stroke="#111827" strokeWidth="16" strokeLinecap="round" />
          <circle r="5" fill={overload ? "#ef4444" : "#22c55e"}>
            <animateMotion dur="1.2s" repeatCount="indefinite" path="M530 315 L690 285" />
          </circle>
        </g>
      )}

      <rect x="690" y="230" width="150" height="110" rx="16" fill="#f8fafc" stroke="#94a3b8" filter="url(#shadow)" />
      <text x="720" y="260" fontSize="15" fontWeight="700" fill="#2563eb">AMPLIFIER</text>
      <text x="718" y="287" fontSize="13" fill="#475569">{mvSignal.toFixed(2)} mV</text>
      <text x="718" y="312" fontSize="13" fill="#475569">{current.toFixed(1)} mA</text>
      <circle cx="815" cy="260" r="6" fill={power ? "#22c55e" : "#64748b"} />
      <circle cx="815" cy="285" r="6" fill={overload ? "#ef4444" : "#22c55e"} />

      <path d="M840 285 C900 375 960 350 1000 405" fill="none" stroke="#111827" strokeWidth="18" strokeLinecap="round" />
      <rect x="980" y="370" width="105" height="80" rx="16" fill="#e5e7eb" stroke="#94a3b8" filter="url(#shadow)" />
      <text x="1010" y="405" fontSize="15" fontWeight="700" fill="#2563eb">PLC</text>
      <text x="995" y="430" fontSize="13" fill="#475569">Analog</text>

      {power && (
        <circle r="5" fill={overload ? "#ef4444" : "#22c55e"}>
          <animateMotion dur="1.3s" repeatCount="indefinite" path="M840 285 C900 375 960 350 1000 405" />
        </circle>
      )}

      <line x1="155" y1="145" x2="455" y2="145" stroke="#9ca3af" />
      <text x="305" y="135" textAnchor="middle" fill={overload ? "#dc2626" : "#2563eb"} fontSize="22" fontWeight="700">
        {loadKg} kg / {percent.toFixed(0)}%
      </text>
      <text x="305" y="170" textAnchor="middle" fill="#111" fontSize="13">Alarm Setpoint: {alarmSet} kg</text>

      {overload && <text x="500" y="150" fill="#dc2626" fontSize="24" fontWeight="700">OVERLOAD ALARM</text>}

      <text x="235" y="120" fontSize="13" fill="#475569">{application}</text>
      <text x="230" y="405" fontSize="13" fill="#64748b">{cellType}</text>
      <text x="80" y="505" fontSize="13" fill="#475569">Industrial weighing and force measurement station</text>
      <text x="80" y="530" fontSize="13" fill="#64748b">Load Cell → Bridge Signal → Amplifier / Transmitter → PLC</text>
    </svg>
  );
}

function LiveReadout({ loadKg, capacity, alarmSet, overload, mvSignal, current, voltage, percent, deformation, cellType, outputMode, application }: any) {
  return (
    <div className="absolute right-3 top-3 w-[238px] rounded-lg border bg-white shadow-lg sm:right-5 sm:top-16 sm:w-[300px]">
      <div className="flex h-12 items-center gap-3 border-b px-4 font-bold text-blue-600"><Activity size={20} /> LIVE READOUT</div>
      <div className="space-y-4 p-4 text-xs sm:text-sm">
        <Read label="Applied Load" value={`${loadKg} kg`} green={!overload} danger={overload} />
        <Read label="Capacity" value={`${capacity} kg`} />
        <Read label="Alarm Set" value={`${alarmSet} kg`} />
        <Read label="Load %" value={`${percent.toFixed(0)}%`} />
        <Read label="Bridge Signal" value={`${mvSignal.toFixed(2)} mV`} />
        <Read label="4-20mA" value={`${current.toFixed(1)} mA`} />
        <Read label="0-10V" value={`${voltage.toFixed(2)} V`} />
        <Read label="Deflection" value={`${deformation.toFixed(1)} px`} />
        <Read label="Cell Type" value={cellType} />
        <Read label="Output" value={outputMode} />
        <Read label="Application" value={application} />
      </div>
    </div>
  );
}

function WiringSvg({ outputMode, outputOn, mvSignal, current, voltage }: any) {
  return (
    <svg viewBox="0 0 620 190" className="h-[190px] w-full">
      <rect x="25" y="58" width="120" height="82" rx="14" fill="#94a3b8" stroke="#334155" />
      <text x="45" y="92" fontSize="13" fontWeight="700" fill="white">LOAD CELL</text>
      <text x="50" y="116" fontSize="12" fill="white">Bridge</text>
      <circle cx="125" cy="78" r="5" fill={outputOn ? "#22c55e" : "#64748b"} />

      <Wire y={28} color="#dc2626" label="EXC+" end="+10 V Excitation" />
      <Wire y={60} color="#111827" label="SIG+" end="Signal +" />
      <Wire y={95} color="#16a34a" label="SIG−" end={outputMode === "mV/V Signal" ? `${mvSignal.toFixed(2)} mV` : "Amplifier Input"} />
      <Wire y={130} color="#2563eb" label="EXC−" end="0 V Excitation" />
      <Wire y={162} color="#7c3aed" label="OUT" end={outputMode === "Transmitter 4-20mA" ? `${current.toFixed(1)} mA` : outputMode === "0-10V" ? `${voltage.toFixed(2)} V` : "PLC Analog"} active={outputOn} />

      <text x="35" y="184" fontSize="12" fill="#475569">6-wire/4-wire load cell bridge and transmitter output</text>
    </svg>
  );
}

function Wire({ y, color, label, end, active }: any) {
  return (
    <g>
      <line x1="145" y1="99" x2="205" y2={y} stroke={color} strokeWidth="2" />
      <line x1="205" y1={y} x2="410" y2={y} stroke={color} strokeWidth={active ? 4 : 2.5} />
      <polygon points={`410,${y - 6} 426,${y} 410,${y + 6}`} fill={color} />
      <text x="215" y={y - 6} fontSize="13" fill={color}>{label}</text>
      <text x="450" y={y + 5} fontSize="13">{end}</text>
      {active && (
        <circle r="5" fill="#22c55e">
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

function LearningTab({ tab, cellType, outputMode }: any) {
  const data: Record<string, { icon: any; title: string; points: string[] }> = {
    Theory: {
      icon: <BookOpen size={22} />,
      title: "Load Cell Theory",
      points: [
        "A load cell converts force or weight into a small electrical signal.",
        "Most industrial load cells use strain gauges arranged in a Wheatstone bridge.",
        "Bridge output is usually very small, commonly expressed in mV/V.",
        "A transmitter converts weak bridge signal into 4–20mA or 0–10V for PLC input.",
      ],
    },
    "Wiring Diagram": {
      icon: <Zap size={22} />,
      title: `${outputMode} Wiring Explanation`,
      points: [
        "EXC+ and EXC− provide excitation voltage to the bridge.",
        "SIG+ and SIG− carry the small differential bridge signal.",
        "Shielded cable is recommended to reduce noise.",
        "Amplifier output connects to PLC analog input.",
      ],
    },
    Quiz: {
      icon: <CheckCircle2 size={22} />,
      title: "Quick Quiz",
      points: [
        "Q1: What does a load cell measure?",
        "Q2: Why is an amplifier needed?",
        "Q3: What is mV/V output?",
        "Q4: Why should load cell wiring be shielded?",
      ],
    },
    Report: {
      icon: <FileText size={22} />,
      title: "Simulation Report",
      points: [
        `Selected load cell type: ${cellType}`,
        `Selected output mode: ${outputMode}`,
        "Recommended activity: increase load and observe bridge signal scaling.",
        "Observe overload behavior when load crosses setpoint.",
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