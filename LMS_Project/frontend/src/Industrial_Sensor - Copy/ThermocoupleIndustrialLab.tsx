"use client";

import React, { useMemo, useState } from "react";
import {
  Activity, BookOpen, CheckCircle2, ClipboardList, Cpu, FileText,
  Info, Maximize, Monitor, Play, RotateCcw, Settings, Square,
  Sun, Volume2, Zap,
} from "lucide-react";

type Tab = "Simulator" | "Theory" | "Wiring Diagram" | "Quiz" | "Report";
type TCType = "K Type" | "J Type" | "T Type" | "N Type";
type Process = "Furnace" | "Hot Water Tank" | "Steam Pipe" | "Ambient Air";
type OutputMode = "mV Signal" | "Transmitter 4-20mA" | "PLC Analog Input";

export default function ThermocoupleIndustrialLab() {
  const [tab, setTab] = useState<Tab>("Simulator");
  const [power, setPower] = useState(true);
  const [tcType, setTcType] = useState<TCType>("K Type");
  const [process, setProcess] = useState<Process>("Furnace");
  const [outputMode, setOutputMode] = useState<OutputMode>("Transmitter 4-20mA");
  const [setPoint, setSetPoint] = useState(250);
  const [temperature, setTemperature] = useState(185);
  const [alarmCount, setAlarmCount] = useState(2);

  const mvSignal = power ? temperature * 0.041 : 0;
  const current = power ? 4 + Math.min(16, Math.max(0, (temperature / 600) * 16)) : 0;
  const highAlarm = power && temperature >= setPoint;
  const outputActive = power && (outputMode === "mV Signal" ? mvSignal > 0 : current > 4);

  function moveTemp(v: number) {
    const next = Number(Math.max(-50, Math.min(600, v)).toFixed(0));
    if (!highAlarm && power && next >= setPoint) setAlarmCount((n) => n + 1);
    setTemperature(next);
  }

  function reset() {
    setPower(false);
    setTcType("K Type");
    setProcess("Furnace");
    setOutputMode("Transmitter 4-20mA");
    setSetPoint(250);
    setTemperature(185);
    setAlarmCount(0);
    setTab("Simulator");
  }

  const logs = useMemo(() => {
    if (!power) return [["--:--", "Power OFF", "text-slate-500"]];
    return [
      ["10:24:15", "Thermocouple Measurement Started", "text-slate-700"],
      highAlarm
        ? ["10:24:18", "High Temperature Alarm", "text-red-600"]
        : ["10:24:23", "Temperature Normal", "text-green-600"],
      ["10:24:18", `${mvSignal.toFixed(2)} mV / ${current.toFixed(1)} mA`, "text-slate-900"],
      ["LIVE", `${tcType} / ${process}`, "text-blue-600"],
    ];
  }, [power, highAlarm, mvSignal, current, tcType, process]);

  return (
    <main className="min-h-screen bg-white p-3 text-slate-950 sm:p-4 lg:p-5">
      <div className="mx-auto max-w-[1560px] space-y-4">
        <Header tab={tab} setTab={setTab} />

        {tab !== "Simulator" ? (
          <LearningTab tab={tab} tcType={tcType} outputMode={outputMode} />
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <aside className="space-y-4 xl:col-span-3">
              <Panel title="THERMOCOUPLE CONFIGURATION" icon={<Settings size={20} />}>
                <Control label="TC Type">
                  <Select value={tcType} onChange={(v) => setTcType(v as TCType)}>
                    <option>K Type</option>
                    <option>J Type</option>
                    <option>T Type</option>
                    <option>N Type</option>
                  </Select>
                </Control>

                <Control label="Process">
                  <Select value={process} onChange={(v) => setProcess(v as Process)}>
                    <option>Furnace</option>
                    <option>Hot Water Tank</option>
                    <option>Steam Pipe</option>
                    <option>Ambient Air</option>
                  </Select>
                </Control>

                <Control label="Output Mode">
                  <Select value={outputMode} onChange={(v) => setOutputMode(v as OutputMode)}>
                    <option>mV Signal</option>
                    <option>Transmitter 4-20mA</option>
                    <option>PLC Analog Input</option>
                  </Select>
                </Control>

                <Control label="Alarm Setpoint">
                  <div className="grid grid-cols-[1fr_42px_42px] gap-2">
                    <div className="input flex items-center justify-between">
                      <b>{setPoint}</b><span>°C</span>
                    </div>
                    <button className="miniBtn" onClick={() => setSetPoint(Math.max(0, setPoint - 10))}>−</button>
                    <button className="miniBtn" onClick={() => setSetPoint(Math.min(600, setPoint + 10))}>+</button>
                  </div>
                </Control>

                <Control label="Supply">
                  <div className="input flex items-center justify-between">
                    <span>24 V DC Transmitter</span>
                    <Zap size={15} className="text-blue-600" />
                  </div>
                </Control>
              </Panel>

              <Panel title="THERMOCOUPLE STATUS" icon={<Activity size={20} />}>
                <Status label="Power" value={power ? "Active" : "OFF"} dot={power} />
                <Status label="Alarm" value={highAlarm ? "HIGH" : "NORMAL"} badge={highAlarm} danger={highAlarm} />
                <Status label="Output" value={outputActive ? "ACTIVE" : "OFF"} badge={outputActive} />
                <Status label="Temp" value={`${temperature.toFixed(0)}°C`} distance />
                <Status label="mV Signal" value={`${mvSignal.toFixed(2)} mV`} />
              </Panel>

              <Panel title="INSTRUCTIONS" icon={<Info size={20} />}>
                <ol className="space-y-3 text-sm leading-relaxed">
                  <li>1. Select thermocouple type and process area.</li>
                  <li>2. Adjust process temperature with slider.</li>
                  <li>3. Observe hot junction, cold junction and signal output.</li>
                  <li>4. Compare mV signal and 4–20mA transmitter output.</li>
                </ol>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button onClick={() => setPower(true)} className="primaryBtn"><Play size={17} /> Start</button>
                  <button onClick={() => setPower(false)} className="secondaryBtn"><Square size={15} /> Stop</button>
                  <button onClick={reset} className="secondaryBtn col-span-2"><RotateCcw size={17} /> Reset</button>
                </div>
              </Panel>
            </aside>

            <section className="space-y-4 xl:col-span-9">
              <Panel title="THERMOCOUPLE SIMULATION AREA" icon={<Monitor size={20} />}>
                <div className="relative h-[420px] overflow-hidden rounded-xl bg-white sm:h-[500px] lg:h-[575px]">
                  <ThermocoupleScene
                    power={power}
                    tcType={tcType}
                    process={process}
                    temperature={temperature}
                    setPoint={setPoint}
                    highAlarm={highAlarm}
                    mvSignal={mvSignal}
                    current={current}
                    moveTemp={moveTemp}
                  />

                  <LiveReadout
                    temperature={temperature}
                    setPoint={setPoint}
                    highAlarm={highAlarm}
                    mvSignal={mvSignal}
                    current={current}
                    tcType={tcType}
                    outputMode={outputMode}
                    process={process}
                  />

                  <div className="absolute bottom-4 left-1/2 w-[86%] max-w-xl -translate-x-1/2 rounded-xl border bg-white/95 p-3 shadow-sm">
                    <input
                      type="range"
                      min={-50}
                      max={600}
                      step={1}
                      value={temperature}
                      onChange={(e) => moveTemp(Number(e.target.value))}
                      className="w-full accent-red-600"
                    />
                    <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                      <span>Cold</span>
                      <span>Adjust process temperature</span>
                      <span>Hot</span>
                    </div>
                  </div>
                </div>
              </Panel>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12">
                <Panel title="I/O INDICATOR" icon={<Cpu size={19} />} className="xl:col-span-3">
                  <div className="grid h-[190px] grid-cols-2 place-items-center">
                    <Lamp label="POWER" on={power} />
                    <Lamp label="ALARM" on={highAlarm} danger />
                  </div>
                </Panel>

                <Panel title="THERMOCOUPLE CONNECTION" icon={<Settings size={19} />} className="xl:col-span-5">
                  <WiringSvg outputMode={outputMode} mvSignal={mvSignal} current={current} highAlarm={highAlarm} />
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
                    High Alarm Count: <b>{alarmCount}</b>
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
          <p className="text-base text-blue-600 sm:text-lg">Thermocouple Simulation</p>
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

function ThermocoupleScene({ power, tcType, process, temperature, setPoint, highAlarm, mvSignal, current }: any) {
  const heat = Math.min(1, Math.max(0, temperature / 600));
  const flameOpacity = power ? Math.max(0.15, heat) : 0.05;

  return (
    <svg viewBox="0 0 1120 560" className="h-full w-full">
      <defs>
        <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="8" floodOpacity=".2" /></filter>
        <linearGradient id="probe" x1="0" x2="1">
          <stop offset="0" stopColor="#111827" /><stop offset=".25" stopColor="#e5e7eb" />
          <stop offset=".55" stopColor="#64748b" /><stop offset=".82" stopColor="#f8fafc" />
          <stop offset="1" stopColor="#111827" />
        </linearGradient>
        <radialGradient id="hotGlow">
          <stop offset="0" stopColor="#ef4444" stopOpacity=".9" />
          <stop offset="1" stopColor="#ef4444" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="70" y="420" width="980" height="42" rx="8" fill="#e5e7eb" stroke="#94a3b8" />
      <rect x="105" y="435" width="910" height="10" rx="5" fill="#cbd5e1" />

      <rect x="120" y="205" width="320" height="185" rx="18" fill="#334155" stroke="#111827" filter="url(#shadow)" />
      <rect x="145" y="230" width="270" height="130" rx="12" fill="#111827" />
      <path d="M190 340 C170 300 220 285 205 245 C250 285 235 310 270 340 C260 290 310 265 300 230 C365 290 350 330 330 340 Z"
        fill="#ef4444" opacity={flameOpacity} />
      <path d="M220 340 C220 305 255 300 250 270 C295 305 295 325 285 340 Z"
        fill="#f97316" opacity={flameOpacity} />
      <text x="150" y="195" fontSize="13" fill="#475569">{process}</text>

      <rect x="385" y="270" width="295" height="30" rx="15" fill="url(#probe)" stroke="#334155" filter="url(#shadow)" />
      <circle cx="390" cy="285" r="32" fill="url(#hotGlow)" opacity={flameOpacity} />
      <circle cx="390" cy="285" r="8" fill={highAlarm ? "#ef4444" : "#f97316"} />
      <text x="470" y="260" fontSize="13" fill="#475569">{tcType} Metal Probe</text>
      <text x="355" y="335" fontSize="13" fill="#ef4444">Hot Junction</text>

      <rect x="685" y="235" width="145" height="105" rx="16" fill="#f8fafc" stroke="#94a3b8" filter="url(#shadow)" />
      <text x="710" y="265" fontSize="15" fontWeight="700" fill="#2563eb">TRANSMITTER</text>
      <text x="715" y="292" fontSize="13" fill="#475569">{mvSignal.toFixed(2)} mV</text>
      <text x="715" y="315" fontSize="13" fill="#475569">{current.toFixed(1)} mA</text>
      <circle cx="805" cy="260" r="6" fill={power ? "#22c55e" : "#64748b"} />
      <circle cx="805" cy="285" r="6" fill={highAlarm ? "#ef4444" : "#22c55e"} />

      <path d="M680 285 C720 395 820 360 895 410" fill="none" stroke="#111827" strokeWidth="18" strokeLinecap="round" />
      <rect x="890" y="375" width="150" height="85" rx="16" fill="#e5e7eb" stroke="#94a3b8" filter="url(#shadow)" />
      <text x="925" y="410" fontSize="15" fontWeight="700" fill="#2563eb">PLC AI</text>
      <text x="915" y="435" fontSize="13" fill="#475569">Analog Input</text>

      {power && (
        <circle r="5" fill={highAlarm ? "#ef4444" : "#22c55e"}>
          <animateMotion dur="1.3s" repeatCount="indefinite" path="M680 285 C720 395 820 360 895 410" />
        </circle>
      )}

      <line x1="160" y1="145" x2="440" y2="145" stroke="#9ca3af" />
      <text x="300" y="135" textAnchor="middle" fill={highAlarm ? "#dc2626" : "#2563eb"} fontSize="20" fontWeight="700">
        {temperature.toFixed(0)}°C
      </text>
      <text x="300" y="170" textAnchor="middle" fill="#111" fontSize="13">
        Alarm Setpoint: {setPoint}°C
      </text>

      {highAlarm && (
        <text x="480" y="150" fill="#dc2626" fontSize="24" fontWeight="700">
          HIGH TEMPERATURE ALARM
        </text>
      )}

      <text x="80" y="505" fontSize="13" fill="#475569">Industrial temperature measurement loop</text>
      <text x="80" y="530" fontSize="13" fill="#64748b">Thermocouple → Transmitter → PLC Analog Input</text>
    </svg>
  );
}

function LiveReadout({ temperature, setPoint, highAlarm, mvSignal, current, tcType, outputMode, process }: any) {
  return (
    <div className="absolute right-3 top-3 w-[238px] rounded-lg border bg-white shadow-lg sm:right-5 sm:top-16 sm:w-[300px]">
      <div className="flex h-12 items-center gap-3 border-b px-4 font-bold text-blue-600"><Activity size={20} /> LIVE READOUT</div>
      <div className="space-y-4 p-4 text-xs sm:text-sm">
        <Read label="Temperature" value={`${temperature.toFixed(0)}°C`} green={!highAlarm} danger={highAlarm} />
        <Read label="Setpoint" value={`${setPoint}°C`} />
        <Read label="Alarm" value={highAlarm ? "HIGH" : "NORMAL"} danger={highAlarm} green={!highAlarm} />
        <Read label="mV Signal" value={`${mvSignal.toFixed(2)} mV`} />
        <Read label="Current" value={`${current.toFixed(1)} mA`} />
        <Read label="TC Type" value={tcType} />
        <Read label="Output Mode" value={outputMode} />
        <Read label="Process" value={process} />
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
      <div className="grid h-16 w-16 place-items-center rounded-full border-8 border-slate-200 bg-slate-100">
        <div className={`h-10 w-10 rounded-full ${on ? `${danger ? "bg-red-500 shadow-[0_0_20px_#ef4444]" : "bg-green-500 shadow-[0_0_20px_#22c55e]"}` : "bg-slate-300"}`} />
      </div>
    </div>
  );
}

function WiringSvg({ outputMode, mvSignal, current, highAlarm }: any) {
  return (
    <svg viewBox="0 0 620 190" className="h-[190px] w-full">
      <circle cx="55" cy="95" r="30" fill="#ef4444" opacity=".25" />
      <line x1="55" y1="95" x2="155" y2="95" stroke="#ef4444" strokeWidth="5" />
      <line x1="55" y1="112" x2="155" y2="112" stroke="#2563eb" strokeWidth="5" />
      <text x="25" y="150" fontSize="12" fill="#475569">Hot Junction</text>

      <rect x="170" y="58" width="120" height="82" rx="14" fill="#f8fafc" stroke="#94a3b8" />
      <text x="195" y="90" fontSize="14" fontWeight="700">TX</text>
      <text x="190" y="116" fontSize="12">{mvSignal.toFixed(2)} mV</text>

      <line x1="290" y1="95" x2="410" y2="95" stroke={highAlarm ? "#ef4444" : "#16a34a"} strokeWidth="4" />
      <polygon points="410,89 426,95 410,101" fill={highAlarm ? "#ef4444" : "#16a34a"} />

      <text x="315" y="82" fontSize="13">{outputMode}</text>
      <text x="450" y="100" fontSize="14">{outputMode === "mV Signal" ? `${mvSignal.toFixed(2)} mV` : `${current.toFixed(1)} mA`}</text>
      <text x="450" y="40" fontSize="14">+24 V DC</text>
      <text x="450" y="160" fontSize="14">0 V DC</text>

      <line x1="170" y1="35" x2="426" y2="35" stroke="#dc2626" strokeWidth="2" />
      <line x1="170" y1="155" x2="426" y2="155" stroke="#2563eb" strokeWidth="2" />

      <circle r="5" fill={highAlarm ? "#ef4444" : "#22c55e"}>
        <animateMotion dur="1.2s" repeatCount="indefinite" path="M290 95 L410 95" />
      </circle>

      <text x="35" y="180" fontSize="12" fill="#475569">Thermocouple temperature loop wiring</text>
    </svg>
  );
}

function LearningTab({ tab, tcType, outputMode }: any) {
  const data: Record<string, { icon: any; title: string; points: string[] }> = {
    Theory: {
      icon: <BookOpen size={22} />,
      title: "Thermocouple Theory",
      points: [
        "A thermocouple generates a small voltage when two different metals form hot and cold junctions.",
        "The generated mV signal changes according to temperature difference.",
        "A transmitter converts weak mV signal into industrial 4–20mA signal.",
        "Thermocouples are commonly used in furnace, boiler, pipe and process temperature measurement.",
      ],
    },
    "Wiring Diagram": {
      icon: <Zap size={22} />,
      title: `${outputMode} Wiring Explanation`,
      points: [
        "Thermocouple positive and negative wires connect to transmitter input.",
        "The transmitter requires 24 V DC loop power.",
        "4–20mA output connects to PLC analog input.",
        "Correct polarity and compensation cable are important for accurate measurement.",
      ],
    },
    Quiz: {
      icon: <CheckCircle2 size={22} />,
      title: "Quick Quiz",
      points: [
        "Q1: What is the hot junction?",
        "Q2: Why is a transmitter used with a thermocouple?",
        "Q3: What does 4–20mA represent?",
        "Q4: Why must thermocouple polarity be correct?",
      ],
    },
    Report: {
      icon: <FileText size={22} />,
      title: "Simulation Report",
      points: [
        `Selected thermocouple type: ${tcType}`,
        `Selected output mode: ${outputMode}`,
        "Recommended activity: increase temperature and observe mV and mA output.",
        "Observe alarm behavior when temperature crosses the setpoint.",
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