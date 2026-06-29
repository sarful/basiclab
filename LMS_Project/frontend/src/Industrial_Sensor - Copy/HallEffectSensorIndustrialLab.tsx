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
type MagnetPole = "North" | "South";
type OutputType = "Digital Switch" | "Analog Linear" | "Latch";
type TargetMotion = "Linear Slide" | "Rotating Wheel";

export default function HallEffectSensorIndustrialLab() {
  const [tab, setTab] = useState<Tab>("Simulator");
  const [power, setPower] = useState(true);
  const [outputType, setOutputType] = useState<OutputType>("Digital Switch");
  const [magnetPole, setMagnetPole] = useState<MagnetPole>("North");
  const [motion, setMotion] = useState<TargetMotion>("Linear Slide");
  const [sensitivity, setSensitivity] = useState(35);
  const [magnetPosition, setMagnetPosition] = useState(42);
  const [detectCount, setDetectCount] = useState(6);

  const fieldStrength = Math.max(0, 100 - Math.abs(magnetPosition - 50) * 4);
  const detected = power && fieldStrength >= sensitivity;
  const outputOn =
    outputType === "Analog Linear"
      ? power && fieldStrength > 5
      : outputType === "Latch"
      ? power && magnetPosition >= 42 && magnetPosition <= 58
      : detected;

  const analogVoltage = power ? (fieldStrength / 100) * 5 : 0;

  function moveMagnet(v: number) {
    const next = Number(Math.max(5, Math.min(95, v)).toFixed(1));
    if (!detected && Math.max(0, 100 - Math.abs(next - 50) * 4) >= sensitivity && power) {
      setDetectCount((n) => n + 1);
    }
    setMagnetPosition(next);
  }

  function reset() {
    setPower(false);
    setOutputType("Digital Switch");
    setMagnetPole("North");
    setMotion("Linear Slide");
    setSensitivity(35);
    setMagnetPosition(42);
    setDetectCount(0);
    setTab("Simulator");
  }

  const logs = useMemo(() => {
    if (!power) return [["--:--", "Power OFF", "text-slate-500"]];
    return [
      ["10:24:15", "Hall Sensor Started", "text-slate-700"],
      detected
        ? ["10:24:18", "Magnetic Field Detected", "text-green-600"]
        : ["10:24:23", "Magnet Outside Range", "text-orange-500"],
      ["10:24:18", outputOn ? "Output Active" : "Output OFF", "text-slate-900"],
      ["LIVE", `${outputType} / ${magnetPole} Pole`, "text-blue-600"],
    ];
  }, [power, detected, outputOn, outputType, magnetPole]);

  return (
    <main className="min-h-screen bg-white p-3 text-slate-950 sm:p-4 lg:p-5">
      <div className="mx-auto max-w-[1560px] space-y-4">
        <Header tab={tab} setTab={setTab} />

        {tab !== "Simulator" ? (
          <LearningTab tab={tab} outputType={outputType} magnetPole={magnetPole} />
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <aside className="space-y-4 xl:col-span-3">
              <Panel title="HALL SENSOR CONFIGURATION" icon={<Settings size={20} />}>
                <Control label="Output Mode">
                  <Select value={outputType} onChange={(v) => setOutputType(v as OutputType)}>
                    <option>Digital Switch</option>
                    <option>Analog Linear</option>
                    <option>Latch</option>
                  </Select>
                </Control>

                <Control label="Sensitivity">
                  <div className="grid grid-cols-[1fr_42px_42px] gap-2">
                    <div className="input flex items-center justify-between">
                      <b>{sensitivity}</b>
                      <span>%</span>
                    </div>
                    <button className="miniBtn" onClick={() => setSensitivity(Math.max(5, sensitivity - 5))}>−</button>
                    <button className="miniBtn" onClick={() => setSensitivity(Math.min(95, sensitivity + 5))}>+</button>
                  </div>
                </Control>

                <Control label="Magnet Pole">
                  <Select value={magnetPole} onChange={(v) => setMagnetPole(v as MagnetPole)}>
                    <option>North</option>
                    <option>South</option>
                  </Select>
                </Control>

                <Control label="Target Motion">
                  <Select value={motion} onChange={(v) => setMotion(v as TargetMotion)}>
                    <option>Linear Slide</option>
                    <option>Rotating Wheel</option>
                  </Select>
                </Control>

                <Control label="Supply Voltage">
                  <div className="input flex items-center justify-between">
                    <span>5 V DC</span>
                    <Zap size={15} className="text-blue-600" />
                  </div>
                </Control>
              </Panel>

              <Panel title="HALL SENSOR STATUS" icon={<Activity size={20} />}>
                <Status label="Power" value={power ? "Active" : "OFF"} dot={power} />
                <Status label="Magnetic Field" value={detected ? "YES" : "NO"} badge={detected} />
                <Status label="Output State" value={outputOn ? "ACTIVE" : "OFF"} badge={outputOn} />
                <Status label="Field Strength" value={`${fieldStrength.toFixed(0)}%`} distance />
                <Status label="Analog Output" value={`${analogVoltage.toFixed(2)} V`} />
              </Panel>

              <Panel title="INSTRUCTIONS" icon={<Info size={20} />}>
                <ol className="space-y-3 text-sm leading-relaxed">
                  <li>1. Select digital, analog, or latch mode.</li>
                  <li>2. Move the magnet near the Hall IC.</li>
                  <li>3. Observe magnetic field lines and output state.</li>
                  <li>4. Compare North/South pole behavior.</li>
                </ol>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button onClick={() => setPower(true)} className="primaryBtn">
                    <Play size={17} /> Start
                  </button>
                  <button onClick={() => setPower(false)} className="secondaryBtn">
                    <Square size={15} /> Stop
                  </button>
                  <button onClick={reset} className="secondaryBtn col-span-2">
                    <RotateCcw size={17} /> Reset
                  </button>
                </div>
              </Panel>
            </aside>

            <section className="space-y-4 xl:col-span-9">
              <Panel title="HALL EFFECT SENSOR SIMULATION AREA" icon={<Monitor size={20} />}>
                <div className="relative h-[420px] overflow-hidden rounded-xl bg-white sm:h-[500px] lg:h-[575px]">
                  <HallScene
                    power={power}
                    outputType={outputType}
                    magnetPole={magnetPole}
                    motion={motion}
                    magnetPosition={magnetPosition}
                    sensitivity={sensitivity}
                    detected={detected}
                    outputOn={outputOn}
                    fieldStrength={fieldStrength}
                    moveMagnet={moveMagnet}
                  />

                  <LiveReadout
                    magnetPosition={magnetPosition}
                    detected={detected}
                    outputOn={outputOn}
                    outputType={outputType}
                    magnetPole={magnetPole}
                    sensitivity={sensitivity}
                    fieldStrength={fieldStrength}
                    analogVoltage={analogVoltage}
                  />

                  <div className="absolute bottom-4 left-1/2 w-[86%] max-w-xl -translate-x-1/2 rounded-xl border bg-white/95 p-3 shadow-sm">
                    <input
                      type="range"
                      min={5}
                      max={95}
                      step={0.1}
                      value={magnetPosition}
                      onChange={(e) => moveMagnet(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                    <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                      <span>Far Left</span>
                      <span>Move magnet across Hall sensor</span>
                      <span>Far Right</span>
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

                <Panel title="HALL SENSOR CONNECTION" icon={<Settings size={19} />} className="xl:col-span-5">
                  <WiringSvg outputType={outputType} outputOn={outputOn} analogVoltage={analogVoltage} />
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
        .miniBtn {
          height: 42px;
          width: 42px;
          border: 1px solid #dbe3ef;
          border-radius: 8px;
          background: white;
          font-size: 23px;
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

function Header({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const tabs: Tab[] = ["Simulator", "Theory", "Wiring Diagram", "Quiz", "Report"];

  return (
    <header className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-center">
      <div className="flex items-center gap-4 lg:col-span-3">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-600 text-white">
          <Cpu size={30} />
        </div>
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">INDUSTRIAL LAB</h1>
          <p className="text-base text-blue-600 sm:text-lg">Hall Effect Sensor Simulation</p>
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

function Panel({ title, icon, children, className = "" }: any) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
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
    <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
      {children}
    </select>
  );
}

function Status({ label, value, dot, badge, distance }: any) {
  return (
    <div className="mb-4 grid grid-cols-[1fr_120px] items-center text-sm">
      <span>{label}</span>
      <span
        className={`flex h-8 items-center justify-center rounded-md ${
          badge ? "bg-green-600 font-semibold text-white" : ""
        } ${distance ? "border text-lg font-semibold text-blue-600" : ""}`}
      >
        {dot && <span className="mr-2 h-3 w-3 rounded-full bg-green-500" />}
        {value}
      </span>
    </div>
  );
}

function HallScene({
  power,
  outputType,
  magnetPole,
  motion,
  magnetPosition,
  sensitivity,
  detected,
  outputOn,
  fieldStrength,
  moveMagnet,
}: any) {
  const magnetX = 110 + magnetPosition * 8.7;
  const sensorX = 560;

  function drag(e: React.PointerEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 1120;
    moveMagnet((x - 110) / 8.7);
  }

  return (
    <svg
      viewBox="0 0 1120 560"
      className="h-full w-full cursor-ew-resize touch-none"
      onPointerDown={drag}
      onPointerMove={(e) => e.buttons === 1 && drag(e)}
    >
      <defs>
        <filter id="shadow">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodOpacity=".2" />
        </filter>
        <linearGradient id="icBody" x1="0" x2="1">
          <stop offset="0" stopColor="#111827" />
          <stop offset=".5" stopColor="#374151" />
          <stop offset="1" stopColor="#030712" />
        </linearGradient>
      </defs>

      <rect x="80" y="420" width="960" height="42" rx="8" fill="#e5e7eb" stroke="#94a3b8" />
      <rect x="105" y="435" width="910" height="10" rx="5" fill="#cbd5e1" />
      {Array.from({ length: 20 }).map((_, i) => (
        <circle key={i} cx={125 + i * 46} cy="442" r="13" fill="#9ca3af" stroke="#64748b" />
      ))}

      <rect x="485" y="210" width="150" height="115" rx="14" fill="url(#icBody)" stroke="#111827" filter="url(#shadow)" />
      <circle cx="515" cy="240" r="7" fill={power ? "#22c55e" : "#64748b"} />
      <circle cx="605" cy="240" r="7" fill={outputOn ? "#22c55e" : "#64748b"} />
      <text x="518" y="285" fill="#f8fafc" fontSize="18" fontWeight="700">HALL IC</text>
      <text x="500" y="307" fill="#cbd5e1" fontSize="12">{outputType}</text>

      {[515, 560, 605].map((x) => (
        <line key={x} x1={x} y1="325" x2={x} y2="390" stroke="#334155" strokeWidth="8" />
      ))}
      <rect x="465" y="390" width="190" height="34" rx="6" fill="#d1d5db" stroke="#94a3b8" />

      <text x="490" y="195" fontSize="13" fill="#475569">Hall Effect Sensor Module</text>

      {Array.from({ length: 7 }).map((_, i) => {
        const offset = (i - 3) * 20;
        return (
          <path
            key={i}
            d={`M${magnetX + 55} ${210 + offset} C ${magnetX + 220} ${170 + offset}, ${sensorX - 100} ${165 + offset}, ${sensorX} ${245 + offset / 3}`}
            fill="none"
            stroke={magnetPole === "North" ? "#2563eb" : "#ef4444"}
            strokeWidth="2"
            strokeDasharray="8 8"
            opacity={power ? Math.min(0.9, fieldStrength / 80) : 0.1}
          />
        );
      })}

      {detected && (
        <>
          <circle cx="560" cy="265" r="35" fill="none" stroke="#22c55e" strokeWidth="3">
            <animate attributeName="r" from="25" to="65" dur="1s" repeatCount="indefinite" />
            <animate attributeName="opacity" from=".85" to="0" dur="1s" repeatCount="indefinite" />
          </circle>
          <text x="440" y="150" fill="#16a34a" fontSize="24" fontWeight="700">
            MAGNETIC FIELD DETECTED
          </text>
        </>
      )}

      {motion === "Linear Slide" ? (
        <g filter="url(#shadow)">
          <rect x={magnetX} y="210" width="120" height="100" rx="12" fill="#ef4444" stroke="#991b1b" />
          <rect x={magnetX + 60} y="210" width="60" height="100" rx="12" fill="#2563eb" />
          <text x={magnetX + 22} y="267" fill="white" fontSize="26" fontWeight="700">
            {magnetPole === "North" ? "N" : "S"}
          </text>
          <text x={magnetX + 78} y="267" fill="white" fontSize="26" fontWeight="700">
            {magnetPole === "North" ? "S" : "N"}
          </text>
        </g>
      ) : (
        <g transform={`translate(${magnetX + 60} 260)`} filter="url(#shadow)">
          <circle r="62" fill="#e5e7eb" stroke="#64748b" />
          <rect x="-16" y="-62" width="32" height="124" fill="#ef4444" />
          <rect x="-62" y="-16" width="124" height="32" fill="#2563eb" />
          <circle r="12" fill="#475569" />
          <text x="-8" y="-34" fill="white" fontSize="20" fontWeight="700">N</text>
          <text x="-8" y="48" fill="white" fontSize="20" fontWeight="700">S</text>
        </g>
      )}

      <line x1="250" y1="355" x2="850" y2="355" stroke="#9ca3af" />
      <line x1="560" y1="335" x2="560" y2="375" stroke="#22c55e" strokeDasharray="5 5" />
      <text x="560" y="348" textAnchor="middle" fill="#16a34a" fontSize="18" fontWeight="700">
        Field {fieldStrength.toFixed(0)}%
      </text>
      <text x="560" y="382" textAnchor="middle" fill="#111" fontSize="13">
        Sensitivity Threshold: {sensitivity}%
      </text>

      <text x={magnetX + 10} y="195" fontSize="13" fill="#475569">{magnetPole} Pole Magnet</text>
      <text x="80" y="505" fontSize="13" fill="#475569">Industrial magnetic position sensing station</text>
      <text x="80" y="530" fontSize="13" fill="#64748b">Motion: {motion}</text>
    </svg>
  );
}

function LiveReadout({
  magnetPosition,
  detected,
  outputOn,
  outputType,
  magnetPole,
  sensitivity,
  fieldStrength,
  analogVoltage,
}: any) {
  return (
    <div className="absolute right-3 top-3 w-[238px] rounded-lg border bg-white shadow-lg sm:right-5 sm:top-16 sm:w-[300px]">
      <div className="flex h-12 items-center gap-3 border-b px-4 font-bold text-blue-600">
        <Activity size={20} /> LIVE READOUT
      </div>
      <div className="space-y-4 p-4 text-xs sm:text-sm">
        <Read label="Magnet Position" value={`${magnetPosition.toFixed(1)} cm`} green />
        <Read label="Field Strength" value={`${fieldStrength.toFixed(0)}%`} green={detected} />
        <Read label="Supply Voltage" value="5 V DC" />
        <Read label="Magnetic Field" value={detected ? "Detected" : "Not Detected"} green={detected} />
        <Read label="Output State" value={outputOn ? "ACTIVE" : "OFF"} green={outputOn} />
        <Read label="Output Mode" value={outputType} />
        <Read label="Magnet Pole" value={magnetPole} />
        <Read label="Analog Output" value={`${analogVoltage.toFixed(2)} V`} />
        <Read label="Threshold" value={`${sensitivity}%`} />
      </div>
    </div>
  );
}

function Read({ label, value, green }: any) {
  return (
    <div className="flex justify-between gap-3">
      <span>{label}</span>
      <b className={green ? "text-green-600" : ""}>{value}</b>
    </div>
  );
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

function WiringSvg({ outputType, outputOn, analogVoltage }: any) {
  const analog = outputType === "Analog Linear";

  return (
    <svg viewBox="0 0 620 190" className="h-[190px] w-full">
      <rect x="25" y="62" width="95" height="70" rx="12" fill="#111827" stroke="#334155" />
      <text x="42" y="104" fill="white" fontSize="15" fontWeight="700">HALL</text>
      <circle cx="105" cy="82" r="5" fill={outputOn ? "#22c55e" : "#64748b"} />

      <polyline points="120,72 175,35 205,35" fill="none" stroke="#dc2626" strokeWidth="2" />
      <line x1="205" y1="35" x2="410" y2="35" stroke="#dc2626" strokeWidth="2" />
      <polygon points="410,29 426,35 410,41" fill="#dc2626" />

      <line x1="120" y1="95" x2="410" y2="95" stroke={outputOn ? "#16a34a" : "#111"} strokeWidth={outputOn ? 4 : 2} />
      <polygon points="410,88 426,95 410,102" fill={outputOn ? "#16a34a" : "#111"} />

      <polyline points="120,118 175,155 205,155" fill="none" stroke="#2563eb" strokeWidth="2" />
      <line x1="205" y1="155" x2="410" y2="155" stroke="#2563eb" strokeWidth="2" />
      <polygon points="410,149 426,155 410,161" fill="#2563eb" />

      {outputOn && (
        <circle r="5" fill="#22c55e">
          <animateMotion dur="1.2s" repeatCount="indefinite" path="M120 95 L410 95" />
        </circle>
      )}

      <text x="215" y="30" fontSize="14" fill="#7f1d1d">Red</text>
      <text x="215" y="88" fontSize="14">Signal</text>
      <text x="215" y="148" fontSize="14" fill="#2563eb">Black</text>

      <text x="450" y="40" fontSize="14">+5 V DC</text>
      <text x="450" y="100" fontSize="14">
        {analog ? `${analogVoltage.toFixed(2)} V Analog` : "Digital Output"}
      </text>
      <text x="450" y="160" fontSize="14">0 V DC</text>

      <text x="35" y="175" fontSize="12" fill="#475569">
        3-wire Hall effect sensor connection
      </text>
    </svg>
  );
}

function LearningTab({ tab, outputType, magnetPole }: any) {
  const data: Record<string, { icon: any; title: string; points: string[] }> = {
    Theory: {
      icon: <BookOpen size={22} />,
      title: "Hall Effect Sensor Theory",
      points: [
        "A Hall sensor detects magnetic field using the Hall effect.",
        "Digital Hall sensors switch ON/OFF when magnetic field reaches a threshold.",
        "Linear Hall sensors provide analog voltage proportional to magnetic field strength.",
        "Latch Hall sensors can remember magnetic pole state until the opposite pole appears.",
      ],
    },
    "Wiring Diagram": {
      icon: <Zap size={22} />,
      title: `${outputType} Wiring Explanation`,
      points: [
        "Red wire connects to +5 V DC.",
        "Black wire connects to 0 V DC.",
        "Signal wire sends digital or analog output to controller input.",
        "Analog mode output voltage changes with magnetic field strength.",
      ],
    },
    Quiz: {
      icon: <CheckCircle2 size={22} />,
      title: "Quick Quiz",
      points: [
        "Q1: What physical effect does a Hall sensor use?",
        "Q2: What is the difference between digital and analog Hall output?",
        "Q3: Why is a magnet required for this sensor?",
        "Q4: Where are Hall sensors used in motors and speed sensing?",
      ],
    },
    Report: {
      icon: <FileText size={22} />,
      title: "Simulation Report",
      points: [
        `Selected output mode: ${outputType}`,
        `Selected magnet pole: ${magnetPole}`,
        "Recommended activity: move magnet slowly and observe analog output.",
        "Observe how threshold changes digital detection point.",
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