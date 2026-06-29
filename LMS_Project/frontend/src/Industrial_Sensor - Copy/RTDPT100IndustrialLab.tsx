"use client";

import React, { useMemo, useState } from "react";
import {
  Activity, BookOpen, CheckCircle2, ClipboardList, Cpu, FileText,
  Info, Maximize, Monitor, Play, RotateCcw, Settings, Square,
  Sun, Volume2, Zap,
} from "lucide-react";

type Tab = "Simulator" | "Theory" | "Wiring Diagram" | "Quiz" | "Report";
type RTDType = "PT100" | "PT1000";
type WireMode = "2-Wire" | "3-Wire" | "4-Wire";
type Process = "Bearing Housing" | "Pipe Surface" | "Liquid Tank" | "Oven Chamber";
type OutputMode = "Resistance Ω" | "Transmitter 4-20mA" | "PLC RTD Input";

export default function RTDPT100IndustrialLab() {
  const [tab, setTab] = useState<Tab>("Simulator");
  const [power, setPower] = useState(true);
  const [rtdType, setRtdType] = useState<RTDType>("PT100");
  const [wireMode, setWireMode] = useState<WireMode>("3-Wire");
  const [process, setProcess] = useState<Process>("Bearing Housing");
  const [outputMode, setOutputMode] = useState<OutputMode>("Transmitter 4-20mA");
  const [setPoint, setSetPoint] = useState(120);
  const [temperature, setTemperature] = useState(75);
  const [alarmCount, setAlarmCount] = useState(1);

  const baseR = rtdType === "PT100" ? 100 : 1000;
  const resistance = power ? baseR * (1 + 0.00385 * temperature) : baseR;
  const leadError = wireMode === "2-Wire" ? 1.8 : wireMode === "3-Wire" ? 0.25 : 0.03;
  const measuredResistance = resistance + leadError;
  const current = power ? 4 + Math.min(16, Math.max(0, ((temperature + 50) / 350) * 16)) : 0;
  const highAlarm = power && temperature >= setPoint;
  const outputActive = power && (outputMode === "Resistance Ω" ? resistance > baseR : current > 4);

  function moveTemp(v: number) {
    const next = Number(Math.max(-50, Math.min(300, v)).toFixed(0));
    if (!highAlarm && power && next >= setPoint) setAlarmCount((n) => n + 1);
    setTemperature(next);
  }

  function reset() {
    setPower(false);
    setRtdType("PT100");
    setWireMode("3-Wire");
    setProcess("Bearing Housing");
    setOutputMode("Transmitter 4-20mA");
    setSetPoint(120);
    setTemperature(75);
    setAlarmCount(0);
    setTab("Simulator");
  }

  const logs = useMemo(() => {
    if (!power) return [["--:--", "Power OFF", "text-slate-500"]];
    return [
      ["10:24:15", "RTD Measurement Started", "text-slate-700"],
      highAlarm
        ? ["10:24:18", "High Temperature Alarm", "text-red-600"]
        : ["10:24:23", "Temperature Normal", "text-green-600"],
      ["10:24:18", `${measuredResistance.toFixed(2)} Ω / ${current.toFixed(1)} mA`, "text-slate-900"],
      ["LIVE", `${rtdType} / ${wireMode}`, "text-blue-600"],
    ];
  }, [power, highAlarm, measuredResistance, current, rtdType, wireMode]);

  return (
    <main className="min-h-screen bg-white p-3 text-slate-950 sm:p-4 lg:p-5">
      <div className="mx-auto max-w-[1560px] space-y-4">
        <Header tab={tab} setTab={setTab} />

        {tab !== "Simulator" ? (
          <LearningTab tab={tab} rtdType={rtdType} wireMode={wireMode} outputMode={outputMode} />
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <aside className="space-y-4 xl:col-span-3">
              <Panel title="RTD CONFIGURATION" icon={<Settings size={20} />}>
                <Control label="RTD Type">
                  <Select value={rtdType} onChange={(v) => setRtdType(v as RTDType)}>
                    <option>PT100</option>
                    <option>PT1000</option>
                  </Select>
                </Control>

                <Control label="Wiring">
                  <Select value={wireMode} onChange={(v) => setWireMode(v as WireMode)}>
                    <option>2-Wire</option>
                    <option>3-Wire</option>
                    <option>4-Wire</option>
                  </Select>
                </Control>

                <Control label="Process">
                  <Select value={process} onChange={(v) => setProcess(v as Process)}>
                    <option>Bearing Housing</option>
                    <option>Pipe Surface</option>
                    <option>Liquid Tank</option>
                    <option>Oven Chamber</option>
                  </Select>
                </Control>

                <Control label="Output Mode">
                  <Select value={outputMode} onChange={(v) => setOutputMode(v as OutputMode)}>
                    <option>Resistance Ω</option>
                    <option>Transmitter 4-20mA</option>
                    <option>PLC RTD Input</option>
                  </Select>
                </Control>

                <Control label="Alarm Setpoint">
                  <div className="grid grid-cols-[1fr_42px_42px] gap-2">
                    <div className="input flex items-center justify-between">
                      <b>{setPoint}</b><span>°C</span>
                    </div>
                    <button className="miniBtn" onClick={() => setSetPoint(Math.max(-20, setPoint - 5))}>−</button>
                    <button className="miniBtn" onClick={() => setSetPoint(Math.min(300, setPoint + 5))}>+</button>
                  </div>
                </Control>

                <Control label="Supply">
                  <div className="input flex items-center justify-between">
                    <span>24 V DC / RTD Input</span>
                    <Zap size={15} className="text-blue-600" />
                  </div>
                </Control>
              </Panel>

              <Panel title="RTD STATUS" icon={<Activity size={20} />}>
                <Status label="Power" value={power ? "Active" : "OFF"} dot={power} />
                <Status label="Alarm" value={highAlarm ? "HIGH" : "NORMAL"} badge={highAlarm} danger={highAlarm} />
                <Status label="Output" value={outputActive ? "ACTIVE" : "OFF"} badge={outputActive} />
                <Status label="Temp" value={`${temperature.toFixed(0)}°C`} distance />
                <Status label="Resistance" value={`${measuredResistance.toFixed(2)} Ω`} />
              </Panel>

              <Panel title="INSTRUCTIONS" icon={<Info size={20} />}>
                <ol className="space-y-3 text-sm leading-relaxed">
                  <li>1. Select PT100/PT1000 and wiring method.</li>
                  <li>2. Adjust process temperature.</li>
                  <li>3. Observe resistance increase with temperature.</li>
                  <li>4. Compare 2-wire, 3-wire and 4-wire lead error.</li>
                </ol>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button onClick={() => setPower(true)} className="primaryBtn"><Play size={17} /> Start</button>
                  <button onClick={() => setPower(false)} className="secondaryBtn"><Square size={15} /> Stop</button>
                  <button onClick={reset} className="secondaryBtn col-span-2"><RotateCcw size={17} /> Reset</button>
                </div>
              </Panel>
            </aside>

            <section className="space-y-4 xl:col-span-9">
              <Panel title="RTD PT100 / PT1000 SIMULATION AREA" icon={<Monitor size={20} />}>
                <div className="relative h-[420px] overflow-hidden rounded-xl bg-white sm:h-[500px] lg:h-[575px]">
                  <RTDScene
                    power={power}
                    rtdType={rtdType}
                    wireMode={wireMode}
                    process={process}
                    temperature={temperature}
                    setPoint={setPoint}
                    highAlarm={highAlarm}
                    measuredResistance={measuredResistance}
                    current={current}
                  />

                  <LiveReadout
                    temperature={temperature}
                    setPoint={setPoint}
                    highAlarm={highAlarm}
                    resistance={resistance}
                    measuredResistance={measuredResistance}
                    current={current}
                    rtdType={rtdType}
                    wireMode={wireMode}
                    outputMode={outputMode}
                    leadError={leadError}
                  />

                  <div className="absolute bottom-4 left-1/2 w-[86%] max-w-xl -translate-x-1/2 rounded-xl border bg-white/95 p-3 shadow-sm">
                    <input
                      type="range"
                      min={-50}
                      max={300}
                      step={1}
                      value={temperature}
                      onChange={(e) => moveTemp(Number(e.target.value))}
                      className="w-full accent-red-600"
                    />
                    <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                      <span>Cold</span>
                      <span>Adjust RTD process temperature</span>
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

                <Panel title="RTD CONNECTION" icon={<Settings size={19} />} className="xl:col-span-5">
                  <WiringSvg wireMode={wireMode} outputMode={outputMode} current={current} measuredResistance={measuredResistance} highAlarm={highAlarm} />
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
          <p className="text-base text-blue-600 sm:text-lg">RTD PT100 / PT1000 Simulation</p>
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

function RTDScene({ power, rtdType, wireMode, process, temperature, setPoint, highAlarm, measuredResistance, current }: any) {
  const heat = Math.min(1, Math.max(0, (temperature + 50) / 350));

  return (
    <svg viewBox="0 0 1120 560" className="h-full w-full">
      <defs>
        <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="8" floodOpacity=".2" /></filter>
        <linearGradient id="probe" x1="0" x2="1">
          <stop offset="0" stopColor="#111827" /><stop offset=".25" stopColor="#e5e7eb" />
          <stop offset=".55" stopColor="#64748b" /><stop offset=".82" stopColor="#f8fafc" />
          <stop offset="1" stopColor="#111827" />
        </linearGradient>
        <radialGradient id="heatGlow">
          <stop offset="0" stopColor="#ef4444" stopOpacity=".8" />
          <stop offset="1" stopColor="#ef4444" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="70" y="420" width="980" height="42" rx="8" fill="#e5e7eb" stroke="#94a3b8" />
      <rect x="105" y="435" width="910" height="10" rx="5" fill="#cbd5e1" />

      <rect x="125" y="210" width="305" height="180" rx="18" fill="#334155" stroke="#111827" filter="url(#shadow)" />
      <rect x="155" y="238" width="245" height="118" rx="12" fill="#111827" />
      <circle cx="280" cy="295" r="92" fill="#ef4444" opacity={power ? heat * 0.22 : 0.04} />
      <path d="M190 338 C170 300 220 285 205 250 C250 285 235 310 270 338 C260 290 310 265 300 235 C365 290 350 330 330 338 Z"
        fill="#ef4444" opacity={power ? Math.max(0.1, heat) : 0.05} />
      <text x="155" y="198" fontSize="13" fill="#475569">{process}</text>

      <rect x="365" y="276" width="330" height="26" rx="13" fill="url(#probe)" stroke="#334155" filter="url(#shadow)" />
      <circle cx="375" cy="289" r="32" fill="url(#heatGlow)" opacity={heat} />
      <circle cx="375" cy="289" r="8" fill={highAlarm ? "#ef4444" : "#f97316"} />
      <text x="465" y="262" fontSize="13" fill="#475569">{rtdType} Platinum Resistance Probe</text>
      <text x="340" y="340" fontSize="13" fill="#ef4444">Sensing Element</text>

      <rect x="705" y="235" width="145" height="105" rx="16" fill="#f8fafc" stroke="#94a3b8" filter="url(#shadow)" />
      <text x="730" y="265" fontSize="15" fontWeight="700" fill="#2563eb">RTD TX</text>
      <text x="726" y="292" fontSize="13" fill="#475569">{measuredResistance.toFixed(2)} Ω</text>
      <text x="728" y="315" fontSize="13" fill="#475569">{current.toFixed(1)} mA</text>
      <circle cx="825" cy="260" r="6" fill={power ? "#22c55e" : "#64748b"} />
      <circle cx="825" cy="285" r="6" fill={highAlarm ? "#ef4444" : "#22c55e"} />

      <path d="M700 289 C745 395 835 360 915 410" fill="none" stroke="#111827" strokeWidth="18" strokeLinecap="round" />
      <rect x="910" y="375" width="150" height="85" rx="16" fill="#e5e7eb" stroke="#94a3b8" filter="url(#shadow)" />
      <text x="943" y="410" fontSize="15" fontWeight="700" fill="#2563eb">PLC AI</text>
      <text x="935" y="435" fontSize="13" fill="#475569">RTD / 4-20mA</text>

      {power && (
        <circle r="5" fill={highAlarm ? "#ef4444" : "#22c55e"}>
          <animateMotion dur="1.3s" repeatCount="indefinite" path="M700 289 C745 395 835 360 915 410" />
        </circle>
      )}

      <line x1="160" y1="145" x2="440" y2="145" stroke="#9ca3af" />
      <text x="300" y="135" textAnchor="middle" fill={highAlarm ? "#dc2626" : "#2563eb"} fontSize="20" fontWeight="700">
        {temperature.toFixed(0)}°C
      </text>
      <text x="300" y="170" textAnchor="middle" fill="#111" fontSize="13">
        Alarm Setpoint: {setPoint}°C
      </text>

      <text x="705" y="360" fontSize="13" fill="#475569">Wiring Compensation: {wireMode}</text>

      {highAlarm && (
        <text x="485" y="150" fill="#dc2626" fontSize="24" fontWeight="700">
          HIGH TEMPERATURE ALARM
        </text>
      )}

      <text x="80" y="505" fontSize="13" fill="#475569">Industrial RTD temperature measurement loop</text>
      <text x="80" y="530" fontSize="13" fill="#64748b">RTD Probe → Transmitter / PLC RTD Input → Temperature Control</text>
    </svg>
  );
}

function LiveReadout({ temperature, setPoint, highAlarm, resistance, measuredResistance, current, rtdType, wireMode, outputMode, leadError }: any) {
  return (
    <div className="absolute right-3 top-3 w-[238px] rounded-lg border bg-white shadow-lg sm:right-5 sm:top-16 sm:w-[300px]">
      <div className="flex h-12 items-center gap-3 border-b px-4 font-bold text-blue-600"><Activity size={20} /> LIVE READOUT</div>
      <div className="space-y-4 p-4 text-xs sm:text-sm">
        <Read label="Temperature" value={`${temperature.toFixed(0)}°C`} green={!highAlarm} danger={highAlarm} />
        <Read label="Setpoint" value={`${setPoint}°C`} />
        <Read label="Alarm" value={highAlarm ? "HIGH" : "NORMAL"} danger={highAlarm} green={!highAlarm} />
        <Read label="Ideal R" value={`${resistance.toFixed(2)} Ω`} />
        <Read label="Measured R" value={`${measuredResistance.toFixed(2)} Ω`} green />
        <Read label="Lead Error" value={`+${leadError.toFixed(2)} Ω`} />
        <Read label="Current" value={`${current.toFixed(1)} mA`} />
        <Read label="RTD Type" value={rtdType} />
        <Read label="Wiring" value={wireMode} />
        <Read label="Output" value={outputMode} />
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

function WiringSvg({ wireMode, outputMode, current, measuredResistance, highAlarm }: any) {
  const wires = wireMode === "2-Wire" ? 2 : wireMode === "3-Wire" ? 3 : 4;

  return (
    <svg viewBox="0 0 620 190" className="h-[190px] w-full">
      <rect x="30" y="70" width="130" height="55" rx="26" fill="#e5e7eb" stroke="#64748b" />
      <line x1="50" y1="97" x2="140" y2="97" stroke="#ef4444" strokeWidth="5" />
      <text x="48" y="155" fontSize="12" fill="#475569">RTD Element</text>

      {Array.from({ length: wires }).map((_, i) => {
        const y = 35 + i * 35;
        const color = i === 0 ? "#dc2626" : i === wires - 1 ? "#2563eb" : "#111";
        return (
          <g key={i}>
            <line x1="160" y1="97" x2="210" y2={y} stroke={color} strokeWidth="2" />
            <line x1="210" y1={y} x2="410" y2={y} stroke={color} strokeWidth="2.5" />
            <polygon points={`410,${y - 6} 426,${y} 410,${y + 6}`} fill={color} />
            <text x="225" y={y - 6} fontSize="13" fill={color}>
              {i === 0 ? "RTD +" : i === wires - 1 ? "RTD −" : "Compensation"}
            </text>
          </g>
        );
      })}

      <text x="450" y="45" fontSize="14">RTD / TX Input</text>
      <text x="450" y="85" fontSize="14">{measuredResistance.toFixed(2)} Ω</text>
      <text x="450" y="125" fontSize="14">{outputMode === "Resistance Ω" ? "Resistance" : `${current.toFixed(1)} mA`}</text>
      <text x="450" y="165" fontSize="14">{highAlarm ? "High Alarm" : "Normal"}</text>

      <circle r="5" fill={highAlarm ? "#ef4444" : "#22c55e"}>
        <animateMotion dur="1.2s" repeatCount="indefinite" path="M210 85 L410 85" />
      </circle>

      <text x="35" y="180" fontSize="12" fill="#475569">{wireMode} RTD wiring compensation</text>
    </svg>
  );
}

function LearningTab({ tab, rtdType, wireMode, outputMode }: any) {
  const data: Record<string, { icon: any; title: string; points: string[] }> = {
    Theory: {
      icon: <BookOpen size={22} />,
      title: "RTD PT100 / PT1000 Theory",
      points: [
        "RTD means Resistance Temperature Detector.",
        "PT100 has 100 Ω resistance at 0°C; PT1000 has 1000 Ω at 0°C.",
        "Resistance increases almost linearly as temperature increases.",
        "RTD sensors are more accurate and stable than thermocouples for many industrial ranges.",
      ],
    },
    "Wiring Diagram": {
      icon: <Zap size={22} />,
      title: `${wireMode} / ${outputMode} Wiring Explanation`,
      points: [
        "2-wire RTD is simple but has more lead-wire error.",
        "3-wire RTD compensates most cable resistance and is common in industry.",
        "4-wire RTD gives the highest measurement accuracy.",
        "RTD can connect directly to PLC RTD input or through a 4–20mA transmitter.",
      ],
    },
    Quiz: {
      icon: <CheckCircle2 size={22} />,
      title: "Quick Quiz",
      points: [
        "Q1: What is the resistance of PT100 at 0°C?",
        "Q2: Why is 3-wire RTD commonly used?",
        "Q3: Which wiring gives highest accuracy?",
        "Q4: What happens to RTD resistance when temperature increases?",
      ],
    },
    Report: {
      icon: <FileText size={22} />,
      title: "Simulation Report",
      points: [
        `Selected RTD type: ${rtdType}`,
        `Selected wiring: ${wireMode}`,
        `Selected output mode: ${outputMode}`,
        "Recommended activity: compare measured resistance in 2-wire, 3-wire and 4-wire modes.",
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