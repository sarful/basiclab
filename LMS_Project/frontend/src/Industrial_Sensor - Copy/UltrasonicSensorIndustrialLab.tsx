"use client";

import React, { useMemo, useState } from "react";
import {
  Activity, BookOpen, CheckCircle2, ClipboardList, Cpu, FileText,
  Info, Maximize, Monitor, Play, RotateCcw, Settings, Square,
  Sun, Volume2, Zap,
} from "lucide-react";

type Tab = "Simulator" | "Theory" | "Wiring Diagram" | "Quiz" | "Report";
type OutputType = "PNP NO" | "PNP NC" | "NPN NO" | "NPN NC" | "Analog 4-20mA";
type TargetType = "Flat Plate" | "Box" | "Bottle" | "Foam" | "Liquid Level";
type Mode = "Distance Measurement" | "Object Detection" | "Tank Level";

export default function UltrasonicSensorIndustrialLab() {
  const [tab, setTab] = useState<Tab>("Simulator");
  const [power, setPower] = useState(true);
  const [mode, setMode] = useState<Mode>("Distance Measurement");
  const [outputType, setOutputType] = useState<OutputType>("PNP NO");
  const [targetType, setTargetType] = useState<TargetType>("Flat Plate");
  const [setRange, setSetRange] = useState(80);
  const [distance, setDistance] = useState(45);
  const [detectCount, setDetectCount] = useState(8);

  const weakEcho = targetType === "Foam" || targetType === "Bottle";
  const echoStrength = Math.max(0, Math.min(100, 110 - distance * 1.15 - (weakEcho ? 25 : 0)));
  const detected = power && distance <= setRange && echoStrength > 18;
  const noMode = outputType.includes("NO");
  const analogMode = outputType === "Analog 4-20mA";
  const outputOn = power && (analogMode || (noMode ? detected : !detected));
  const analogCurrent = power ? 4 + Math.min(16, Math.max(0, (distance / 120) * 16)) : 0;

  function moveTarget(v: number) {
    const next = Number(Math.max(10, Math.min(120, v)).toFixed(1));
    if (!detected && power && next <= setRange) setDetectCount((n) => n + 1);
    setDistance(next);
  }

  function reset() {
    setPower(false);
    setMode("Distance Measurement");
    setOutputType("PNP NO");
    setTargetType("Flat Plate");
    setSetRange(80);
    setDistance(45);
    setDetectCount(0);
    setTab("Simulator");
  }

  const logs = useMemo(() => {
    if (!power) return [["--:--", "Power OFF", "text-slate-500"]];
    return [
      ["10:24:15", "Ultrasonic Sensor Started", "text-slate-700"],
      detected
        ? ["10:24:18", "Echo Received / Target Detected", "text-green-600"]
        : ["10:24:23", "No Valid Echo", "text-orange-500"],
      ["10:24:18", outputOn ? "Output Active" : "Output OFF", "text-slate-900"],
      ["LIVE", `${mode} / ${targetType}`, "text-blue-600"],
    ];
  }, [power, detected, outputOn, mode, targetType]);

  return (
    <main className="min-h-screen bg-white p-3 text-slate-950 sm:p-4 lg:p-5">
      <div className="mx-auto max-w-[1560px] space-y-4">
        <Header tab={tab} setTab={setTab} />

        {tab !== "Simulator" ? (
          <LearningTab tab={tab} mode={mode} outputType={outputType} />
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <aside className="space-y-4 xl:col-span-3">
              <Panel title="ULTRASONIC CONFIGURATION" icon={<Settings size={20} />}>
                <Control label="Mode">
                  <Select value={mode} onChange={(v) => setMode(v as Mode)}>
                    <option>Distance Measurement</option>
                    <option>Object Detection</option>
                    <option>Tank Level</option>
                  </Select>
                </Control>

                <Control label="Set Range">
                  <div className="grid grid-cols-[1fr_42px_42px] gap-2">
                    <div className="input flex items-center justify-between">
                      <b>{setRange}</b><span>cm</span>
                    </div>
                    <button className="miniBtn" onClick={() => setSetRange(Math.max(20, setRange - 5))}>−</button>
                    <button className="miniBtn" onClick={() => setSetRange(Math.min(120, setRange + 5))}>+</button>
                  </div>
                </Control>

                <Control label="Output Type">
                  <Select value={outputType} onChange={(v) => setOutputType(v as OutputType)}>
                    <option>PNP NO</option>
                    <option>PNP NC</option>
                    <option>NPN NO</option>
                    <option>NPN NC</option>
                    <option>Analog 4-20mA</option>
                  </Select>
                </Control>

                <Control label="Target Type">
                  <Select value={targetType} onChange={(v) => setTargetType(v as TargetType)}>
                    <option>Flat Plate</option>
                    <option>Box</option>
                    <option>Bottle</option>
                    <option>Foam</option>
                    <option>Liquid Level</option>
                  </Select>
                </Control>

                <Control label="Supply Voltage">
                  <div className="input flex items-center justify-between">
                    <span>24 V DC</span>
                    <Zap size={15} className="text-blue-600" />
                  </div>
                </Control>
              </Panel>

              <Panel title="ULTRASONIC STATUS" icon={<Activity size={20} />}>
                <Status label="Power" value={power ? "Active" : "OFF"} dot={power} />
                <Status label="Echo Status" value={detected ? "VALID" : "NO ECHO"} badge={detected} />
                <Status label="Output State" value={outputOn ? "ON" : "OFF"} badge={outputOn} />
                <Status label="Distance" value={`${distance.toFixed(1)} cm`} distance />
                <Status label="Echo Strength" value={`${echoStrength.toFixed(0)}%`} />
              </Panel>

              <Panel title="INSTRUCTIONS" icon={<Info size={20} />}>
                <ol className="space-y-3 text-sm leading-relaxed">
                  <li>1. Select distance, object, or tank level mode.</li>
                  <li>2. Move the target and watch ultrasonic echo waves.</li>
                  <li>3. Compare flat, bottle, foam and liquid targets.</li>
                  <li>4. Observe digital output or 4–20mA analog signal.</li>
                </ol>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button onClick={() => setPower(true)} className="primaryBtn"><Play size={17} /> Start</button>
                  <button onClick={() => setPower(false)} className="secondaryBtn"><Square size={15} /> Stop</button>
                  <button onClick={reset} className="secondaryBtn col-span-2"><RotateCcw size={17} /> Reset</button>
                </div>
              </Panel>
            </aside>

            <section className="space-y-4 xl:col-span-9">
              <Panel title="ULTRASONIC SENSOR SIMULATION AREA" icon={<Monitor size={20} />}>
                <div className="relative h-[420px] overflow-hidden rounded-xl bg-white sm:h-[500px] lg:h-[575px]">
                  <UltrasonicScene
                    power={power}
                    mode={mode}
                    targetType={targetType}
                    distance={distance}
                    setRange={setRange}
                    detected={detected}
                    outputOn={outputOn}
                    echoStrength={echoStrength}
                    moveTarget={moveTarget}
                  />

                  <LiveReadout
                    distance={distance}
                    detected={detected}
                    outputOn={outputOn}
                    outputType={outputType}
                    mode={mode}
                    setRange={setRange}
                    echoStrength={echoStrength}
                    analogCurrent={analogCurrent}
                  />

                  <div className="absolute bottom-4 left-1/2 w-[86%] max-w-xl -translate-x-1/2 rounded-xl border bg-white/95 p-3 shadow-sm">
                    <input
                      type="range"
                      min={10}
                      max={120}
                      step={0.1}
                      value={distance}
                      onChange={(e) => moveTarget(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                    <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                      <span>Near</span>
                      <span>Move target / simulate echo distance</span>
                      <span>Far</span>
                    </div>
                  </div>
                </div>
              </Panel>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12">
                <Panel title="I/O INDICATOR" icon={<Cpu size={19} />} className="xl:col-span-3">
                  <div className="grid h-[190px] grid-cols-2 place-items-center">
                    <Lamp label="POWER" on={power} />
                    <Lamp label="OUTPUT" on={outputOn} />
                  </div>
                </Panel>

                <Panel title="ULTRASONIC CONNECTION" icon={<Settings size={19} />} className="xl:col-span-5">
                  <WiringSvg outputType={outputType} outputOn={outputOn} analogCurrent={analogCurrent} />
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
                    Detection Count: <b>{detectCount}</b>
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
          <p className="text-base text-blue-600 sm:text-lg">Ultrasonic Sensor Simulation</p>
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

function Status({ label, value, dot, badge, distance }: any) {
  return (
    <div className="mb-4 grid grid-cols-[1fr_120px] items-center text-sm">
      <span>{label}</span>
      <span className={`flex h-8 items-center justify-center rounded-md ${badge ? "bg-green-600 font-semibold text-white" : ""} ${distance ? "border text-lg font-semibold text-blue-600" : ""}`}>
        {dot && <span className="mr-2 h-3 w-3 rounded-full bg-green-500" />}{value}
      </span>
    </div>
  );
}

function UltrasonicScene({ power, mode, targetType, distance, setRange, detected, outputOn, echoStrength, moveTarget }: any) {
  const targetX = 280 + distance * 5.8;

  function drag(e: React.PointerEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 1120;
    moveTarget((x - 280) / 5.8);
  }

  return (
    <svg viewBox="0 0 1120 560" className="h-full w-full cursor-ew-resize touch-none" onPointerDown={drag} onPointerMove={(e) => e.buttons === 1 && drag(e)}>
      <defs>
        <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="8" floodOpacity=".2" /></filter>
        <linearGradient id="metal" x1="0" x2="1">
          <stop offset="0" stopColor="#111827" /><stop offset=".25" stopColor="#e5e7eb" />
          <stop offset=".55" stopColor="#64748b" /><stop offset=".82" stopColor="#f8fafc" />
          <stop offset="1" stopColor="#111827" />
        </linearGradient>
      </defs>

      <rect x="80" y="420" width="960" height="42" rx="8" fill="#e5e7eb" stroke="#94a3b8" />
      <rect x="105" y="435" width="910" height="10" rx="5" fill="#cbd5e1" />
      {Array.from({ length: 20 }).map((_, i) => <circle key={i} cx={125 + i * 46} cy="442" r="13" fill="#9ca3af" stroke="#64748b" />)}

      <rect x="120" y="205" width="155" height="120" rx="18" fill="url(#metal)" stroke="#111827" filter="url(#shadow)" />
      <circle cx="245" cy="245" r="24" fill="#111827" />
      <circle cx="245" cy="245" r="14" fill="#64748b" />
      <circle cx="245" cy="285" r="24" fill="#111827" />
      <circle cx="245" cy="285" r="14" fill="#64748b" />
      <circle cx="150" cy="230" r="7" fill={power ? "#22c55e" : "#64748b"} />
      <circle cx="172" cy="230" r="7" fill={outputOn ? "#22c55e" : "#64748b"} />

      <rect x="155" y="325" width="32" height="85" fill="#9ca3af" stroke="#64748b" />
      <rect x="115" y="405" width="115" height="28" rx="6" fill="#d1d5db" stroke="#94a3b8" />

      {[1, 2, 3, 4, 5].map((n) => (
        <path
          key={n}
          d={`M250 ${265 - n * 18} Q ${250 + n * 70} 265 ${250} ${265 + n * 18}`}
          fill="none"
          stroke="#2563eb"
          strokeWidth="2"
          strokeDasharray="8 8"
          opacity={power ? Math.max(0.15, echoStrength / 120) : 0.08}
        >
          {power && <animate attributeName="stroke-dashoffset" from="0" to="-32" dur="1s" repeatCount="indefinite" />}
        </path>
      ))}

      {detected && (
        <>
          <text x="470" y="150" fill="#16a34a" fontSize="24" fontWeight="700">VALID ECHO DETECTED</text>
          <line x1={targetX} y1="200" x2="250" y2="265" stroke="#22c55e" strokeWidth="3" strokeDasharray="10 8" />
        </>
      )}

      {mode === "Tank Level" ? (
        <g filter="url(#shadow)">
          <rect x={targetX} y="190" width="145" height="185" rx="12" fill="#e0f2fe" stroke="#0284c7" />
          <rect x={targetX + 10} y={235 + distance * 0.35} width="125" height={130 - distance * 0.35} fill="#38bdf8" opacity=".65" />
          <text x={targetX + 18} y="180" fontSize="13" fill="#475569">Liquid Level</text>
        </g>
      ) : (
        <g filter="url(#shadow)">
          <rect
            x={targetX}
            y={targetType === "Bottle" ? 200 : 220}
            width={targetType === "Bottle" ? 70 : 120}
            height={targetType === "Bottle" ? 155 : 120}
            rx={targetType === "Bottle" ? 26 : 10}
            fill={targetType === "Foam" ? "#fef3c7" : targetType === "Flat Plate" ? "#cbd5e1" : "#a3a3a3"}
            stroke={detected ? "#16a34a" : "#475569"}
            strokeWidth={detected ? 4 : 2}
            opacity={targetType === "Bottle" ? 0.75 : 1}
          />
          <text x={targetX} y="200" fontSize="13" fill="#475569">{targetType}</text>
        </g>
      )}

      <line x1="250" y1="360" x2={250 + setRange * 5.8} y2="360" stroke="#9ca3af" />
      <polygon points="250,360 262,353 262,367" fill="#9ca3af" />
      <polygon points={`${250 + setRange * 5.8},360 ${250 + setRange * 5.8 - 12},353 ${250 + setRange * 5.8 - 12},367`} fill="#9ca3af" />
      <text x={250 + setRange * 2.9} y="352" textAnchor="middle" fill="#2563eb" fontSize="18" fontWeight="700">Set Range {setRange} cm</text>

      <text x="120" y="190" fontSize="13" fill="#475569">Ultrasonic Sensor Head</text>
      <text x="80" y="505" fontSize="13" fill="#475569">Industrial ultrasonic distance / level sensing station</text>
      <text x="80" y="530" fontSize="13" fill="#64748b">Mode: {mode}</text>
    </svg>
  );
}

function LiveReadout({ distance, detected, outputOn, outputType, mode, setRange, echoStrength, analogCurrent }: any) {
  return (
    <div className="absolute right-3 top-3 w-[238px] rounded-lg border bg-white shadow-lg sm:right-5 sm:top-16 sm:w-[300px]">
      <div className="flex h-12 items-center gap-3 border-b px-4 font-bold text-blue-600"><Activity size={20} /> LIVE READOUT</div>
      <div className="space-y-4 p-4 text-xs sm:text-sm">
        <Read label="Distance" value={`${distance.toFixed(1)} cm`} green />
        <Read label="Echo Status" value={detected ? "Valid Echo" : "No Echo"} green={detected} />
        <Read label="Echo Strength" value={`${echoStrength.toFixed(0)}%`} green={detected} />
        <Read label="Output State" value={outputOn ? "ON" : "OFF"} green={outputOn} />
        <Read label="Output Type" value={outputType} />
        <Read label="Analog Signal" value={`${analogCurrent.toFixed(1)} mA`} />
        <Read label="Mode" value={mode} />
        <Read label="Set Range" value={`${setRange} cm`} />
      </div>
    </div>
  );
}

function Read({ label, value, green }: any) {
  return <div className="flex justify-between gap-3"><span>{label}</span><b className={green ? "text-green-600" : ""}>{value}</b></div>;
}

function Lamp({ label, on }: any) {
  return (
    <div className="text-center">
      <p className="mb-5 text-sm">{label}</p>
      <div className="grid h-16 w-16 place-items-center rounded-full border-8 border-slate-200 bg-slate-100">
        <div className={`h-10 w-10 rounded-full ${on ? "bg-green-500 shadow-[0_0_20px_#22c55e]" : "bg-slate-300"}`} />
      </div>
    </div>
  );
}

function WiringSvg({ outputType, outputOn, analogCurrent }: any) {
  const analog = outputType === "Analog 4-20mA";
  return (
    <svg viewBox="0 0 620 190" className="h-[190px] w-full">
      <rect x="25" y="62" width="105" height="72" rx="14" fill="#94a3b8" stroke="#334155" />
      <circle cx="112" cy="84" r="13" fill="#111827" />
      <circle cx="112" cy="112" r="13" fill="#111827" />
      <circle cx="55" cy="82" r="5" fill={outputOn ? "#22c55e" : "#64748b"} />

      <polyline points="130,72 175,35 205,35" fill="none" stroke="#dc2626" strokeWidth="2" />
      <line x1="205" y1="35" x2="410" y2="35" stroke="#dc2626" strokeWidth="2" />
      <polygon points="410,29 426,35 410,41" fill="#dc2626" />

      <line x1="130" y1="95" x2="410" y2="95" stroke={outputOn ? "#16a34a" : "#111"} strokeWidth={outputOn ? 4 : 2} />
      <polygon points="410,88 426,95 410,102" fill={outputOn ? "#16a34a" : "#111"} />

      <polyline points="130,118 175,155 205,155" fill="none" stroke="#2563eb" strokeWidth="2" />
      <line x1="205" y1="155" x2="410" y2="155" stroke="#2563eb" strokeWidth="2" />
      <polygon points="410,149 426,155 410,161" fill="#2563eb" />

      {outputOn && <circle r="5" fill="#22c55e"><animateMotion dur="1.2s" repeatCount="indefinite" path="M130 95 L410 95" /></circle>}

      <text x="215" y="30" fontSize="14" fill="#7f1d1d">Brown</text>
      <text x="215" y="88" fontSize="14">Black / Signal</text>
      <text x="215" y="148" fontSize="14" fill="#2563eb">Blue</text>

      <text x="450" y="40" fontSize="14">+24 V DC</text>
      <text x="450" y="100" fontSize="14">{analog ? `${analogCurrent.toFixed(1)} mA` : "PLC Input"}</text>
      <text x="450" y="160" fontSize="14">0 V DC</text>
      <text x="35" y="175" fontSize="12" fill="#475569">3-wire ultrasonic sensor connection</text>
    </svg>
  );
}

function LearningTab({ tab, mode, outputType }: any) {
  const data: Record<string, { icon: any; title: string; points: string[] }> = {
    Theory: {
      icon: <BookOpen size={22} />,
      title: "Ultrasonic Sensor Theory",
      points: [
        "Ultrasonic sensors emit high-frequency sound waves and measure returning echo time.",
        "Distance is calculated from time-of-flight between transmit and receive echo.",
        "Soft, angled, or narrow targets can reduce echo strength.",
        "They are useful for distance measurement, object detection, and liquid level sensing.",
      ],
    },
    "Wiring Diagram": {
      icon: <Zap size={22} />,
      title: `${outputType} Wiring Explanation`,
      points: [
        "Brown wire connects to +24 V DC.",
        "Blue wire connects to 0 V DC.",
        "Black wire sends switching or analog signal to PLC input.",
        "Analog 4–20mA output changes according to measured distance.",
      ],
    },
    Quiz: {
      icon: <CheckCircle2 size={22} />,
      title: "Quick Quiz",
      points: [
        "Q1: What does time-of-flight mean?",
        "Q2: Why can foam be difficult to detect?",
        "Q3: Which output is used for continuous distance measurement?",
        "Q4: Where are ultrasonic sensors used in tank level measurement?",
      ],
    },
    Report: {
      icon: <FileText size={22} />,
      title: "Simulation Report",
      points: [
        `Selected mode: ${mode}`,
        `Selected output type: ${outputType}`,
        "Recommended activity: compare flat plate, bottle, foam and liquid level.",
        "Observe how echo strength changes with distance and target surface.",
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