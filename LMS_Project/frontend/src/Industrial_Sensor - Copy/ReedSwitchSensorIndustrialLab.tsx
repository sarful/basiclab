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
type ReedType = "Normally Open" | "Normally Closed" | "Changeover";
type MagnetType = "Bar Magnet" | "Ring Magnet" | "Door Magnet";
type MotionType = "Linear Slide" | "Door Open/Close" | "Rotating Magnet";

export default function ReedSwitchSensorIndustrialLab() {
  const [tab, setTab] = useState<Tab>("Simulator");
  const [power, setPower] = useState(true);
  const [reedType, setReedType] = useState<ReedType>("Normally Open");
  const [magnetType, setMagnetType] = useState<MagnetType>("Bar Magnet");
  const [motionType, setMotionType] = useState<MotionType>("Linear Slide");
  const [activationGap, setActivationGap] = useState(18);
  const [magnetPosition, setMagnetPosition] = useState(45);
  const [detectCount, setDetectCount] = useState(5);

  const gap = Math.abs(magnetPosition - 55);
  const magneticField = Math.max(0, 100 - gap * 6);
  const magnetNear = power && gap <= activationGap;

  const contactClosed =
    reedType === "Normally Open"
      ? magnetNear
      : reedType === "Normally Closed"
      ? !magnetNear
      : magnetNear;

  const outputOn = power && contactClosed;

  function moveMagnet(v: number) {
    const next = Number(Math.max(5, Math.min(95, v)).toFixed(1));
    const nextNear = Math.abs(next - 55) <= activationGap;
    if (!magnetNear && nextNear && power) setDetectCount((n) => n + 1);
    setMagnetPosition(next);
  }

  function reset() {
    setPower(false);
    setReedType("Normally Open");
    setMagnetType("Bar Magnet");
    setMotionType("Linear Slide");
    setActivationGap(18);
    setMagnetPosition(45);
    setDetectCount(0);
    setTab("Simulator");
  }

  const logs = useMemo(() => {
    if (!power) return [["--:--", "Power OFF", "text-slate-500"]];
    return [
      ["10:24:15", "Reed Switch Simulation Started", "text-slate-700"],
      magnetNear
        ? ["10:24:18", "Magnet Entered Activation Zone", "text-green-600"]
        : ["10:24:23", "Magnet Outside Activation Zone", "text-orange-500"],
      ["10:24:18", contactClosed ? "Contact CLOSED" : "Contact OPEN", "text-slate-900"],
      ["LIVE", `${reedType} / ${magnetType}`, "text-blue-600"],
    ];
  }, [power, magnetNear, contactClosed, reedType, magnetType]);

  return (
    <main className="min-h-screen bg-white p-3 text-slate-950 sm:p-4 lg:p-5">
      <div className="mx-auto max-w-[1560px] space-y-4">
        <Header tab={tab} setTab={setTab} />

        {tab !== "Simulator" ? (
          <LearningTab tab={tab} reedType={reedType} />
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <aside className="space-y-4 xl:col-span-3">
              <Panel title="REED SWITCH CONFIGURATION" icon={<Settings size={20} />}>
                <Control label="Reed Type">
                  <Select value={reedType} onChange={(v) => setReedType(v as ReedType)}>
                    <option>Normally Open</option>
                    <option>Normally Closed</option>
                    <option>Changeover</option>
                  </Select>
                </Control>

                <Control label="Activation Gap">
                  <div className="grid grid-cols-[1fr_42px_42px] gap-2">
                    <div className="input flex items-center justify-between">
                      <b>{activationGap}</b>
                      <span>cm</span>
                    </div>
                    <button className="miniBtn" onClick={() => setActivationGap(Math.max(5, activationGap - 2))}>−</button>
                    <button className="miniBtn" onClick={() => setActivationGap(Math.min(35, activationGap + 2))}>+</button>
                  </div>
                </Control>

                <Control label="Magnet Type">
                  <Select value={magnetType} onChange={(v) => setMagnetType(v as MagnetType)}>
                    <option>Bar Magnet</option>
                    <option>Ring Magnet</option>
                    <option>Door Magnet</option>
                  </Select>
                </Control>

                <Control label="Motion Type">
                  <Select value={motionType} onChange={(v) => setMotionType(v as MotionType)}>
                    <option>Linear Slide</option>
                    <option>Door Open/Close</option>
                    <option>Rotating Magnet</option>
                  </Select>
                </Control>

                <Control label="Supply Voltage">
                  <div className="input flex items-center justify-between">
                    <span>24 V DC</span>
                    <Zap size={15} className="text-blue-600" />
                  </div>
                </Control>
              </Panel>

              <Panel title="REED SWITCH STATUS" icon={<Activity size={20} />}>
                <Status label="Power" value={power ? "Active" : "OFF"} dot={power} />
                <Status label="Magnet Near" value={magnetNear ? "YES" : "NO"} badge={magnetNear} />
                <Status label="Contact State" value={contactClosed ? "CLOSED" : "OPEN"} badge={contactClosed} />
                <Status label="Field Strength" value={`${magneticField.toFixed(0)}%`} distance />
                <Status label="Output" value={outputOn ? "ON" : "OFF"} badge={outputOn} />
              </Panel>

              <Panel title="INSTRUCTIONS" icon={<Info size={20} />}>
                <ol className="space-y-3 text-sm leading-relaxed">
                  <li>1. Select NO, NC, or changeover reed switch.</li>
                  <li>2. Move the magnet near the glass reed capsule.</li>
                  <li>3. Observe contact blade movement and output lamp.</li>
                  <li>4. Compare activation gap and magnetic field strength.</li>
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
              <Panel title="REED SWITCH SENSOR SIMULATION AREA" icon={<Monitor size={20} />}>
                <div className="relative h-[420px] overflow-hidden rounded-xl bg-white sm:h-[500px] lg:h-[575px]">
                  <ReedScene
                    power={power}
                    reedType={reedType}
                    magnetType={magnetType}
                    motionType={motionType}
                    magnetPosition={magnetPosition}
                    activationGap={activationGap}
                    magnetNear={magnetNear}
                    contactClosed={contactClosed}
                    magneticField={magneticField}
                    moveMagnet={moveMagnet}
                  />

                  <LiveReadout
                    magnetPosition={magnetPosition}
                    magnetNear={magnetNear}
                    contactClosed={contactClosed}
                    outputOn={outputOn}
                    reedType={reedType}
                    activationGap={activationGap}
                    magneticField={magneticField}
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
                      <span>Magnet Far</span>
                      <span>Move magnet toward reed switch</span>
                      <span>Magnet Far</span>
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

                <Panel title="REED SWITCH CONNECTION" icon={<Settings size={19} />} className="xl:col-span-5">
                  <WiringSvg reedType={reedType} contactClosed={contactClosed} outputOn={outputOn} />
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
          <p className="text-base text-blue-600 sm:text-lg">Reed Switch Sensor Simulation</p>
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

function ReedScene({
  power,
  reedType,
  magnetType,
  motionType,
  magnetPosition,
  activationGap,
  magnetNear,
  contactClosed,
  magneticField,
  moveMagnet,
}: any) {
  const magnetX = 110 + magnetPosition * 8.7;
  const reedX = 565;

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
        <linearGradient id="glass" x1="0" x2="1">
          <stop offset="0" stopColor="#dbeafe" />
          <stop offset=".5" stopColor="#ffffff" />
          <stop offset="1" stopColor="#bfdbfe" />
        </linearGradient>
      </defs>

      <rect x="80" y="420" width="960" height="42" rx="8" fill="#e5e7eb" stroke="#94a3b8" />
      <rect x="105" y="435" width="910" height="10" rx="5" fill="#cbd5e1" />
      {Array.from({ length: 20 }).map((_, i) => (
        <circle key={i} cx={125 + i * 46} cy="442" r="13" fill="#9ca3af" stroke="#64748b" />
      ))}

      <rect x="425" y="220" width="290" height="82" rx="40" fill="url(#glass)" stroke="#60a5fa" strokeWidth="2" filter="url(#shadow)" />
      <rect x="405" y="245" width="45" height="30" rx="8" fill="#94a3b8" stroke="#475569" />
      <rect x="690" y="245" width="45" height="30" rx="8" fill="#94a3b8" stroke="#475569" />

      <line x1="450" y1="260" x2="558" y2="260" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
      <line
        x1="582"
        y1={contactClosed ? 260 : 242}
        x2="690"
        y2="260"
        stroke={contactClosed ? "#16a34a" : "#64748b"}
        strokeWidth="8"
        strokeLinecap="round"
      />

      <circle cx="570" cy="260" r="8" fill={contactClosed ? "#16a34a" : "#64748b"} />
      <circle cx="402" cy="260" r="8" fill={power ? "#22c55e" : "#64748b"} />
      <circle cx="738" cy="260" r="8" fill={contactClosed ? "#22c55e" : "#64748b"} />

      {magnetNear && (
        <>
          <text x="450" y="155" fill="#16a34a" fontSize="24" fontWeight="700">
            REED CONTACT {contactClosed ? "CLOSED" : "OPEN"}
          </text>
          <rect x="420" y="212" width="300" height="98" rx="45" fill="none" stroke="#22c55e" strokeWidth="3">
            <animate attributeName="opacity" from="1" to=".25" dur="0.8s" repeatCount="indefinite" />
          </rect>
        </>
      )}

      {Array.from({ length: 8 }).map((_, i) => (
        <path
          key={i}
          d={`M${magnetX + 60} ${205 + i * 16} C ${magnetX + 230} ${165 + i * 10}, ${reedX - 130} ${170 + i * 10}, ${reedX} ${238 + i * 4}`}
          fill="none"
          stroke={i % 2 === 0 ? "#ef4444" : "#2563eb"}
          strokeWidth="2"
          strokeDasharray="8 8"
          opacity={power ? Math.min(0.9, magneticField / 90) : 0.1}
        />
      ))}

      {motionType === "Rotating Magnet" ? (
        <g transform={`translate(${magnetX + 60} 260)`} filter="url(#shadow)">
          <circle r="60" fill="#e5e7eb" stroke="#64748b" />
          <rect x="-15" y="-60" width="30" height="120" fill="#ef4444" />
          <rect x="-60" y="-15" width="120" height="30" fill="#2563eb" />
          <text x="-9" y="-30" fill="white" fontSize="20" fontWeight="700">N</text>
          <text x="-9" y="45" fill="white" fontSize="20" fontWeight="700">S</text>
        </g>
      ) : (
        <g filter="url(#shadow)">
          <rect x={magnetX} y="210" width="125" height="100" rx="12" fill="#ef4444" stroke="#991b1b" />
          <rect x={magnetX + 62} y="210" width="63" height="100" rx="12" fill="#2563eb" />
          <text x={magnetX + 23} y="267" fill="white" fontSize="26" fontWeight="700">N</text>
          <text x={magnetX + 82} y="267" fill="white" fontSize="26" fontWeight="700">S</text>
        </g>
      )}

      {motionType === "Door Open/Close" && (
        <g>
          <rect x={magnetX - 20} y="160" width="12" height="220" fill="#94a3b8" />
          <path d={`M${magnetX - 8} 175 L${magnetX + 120} 215 L${magnetX + 120} 350 L${magnetX - 8} 380 Z`} fill="#f8fafc" stroke="#94a3b8" />
          <text x={magnetX + 12} y="395" fontSize="12" fill="#475569">Door panel</text>
        </g>
      )}

      <line x1="405" y1="350" x2="735" y2="350" stroke="#9ca3af" />
      <text x="570" y="342" textAnchor="middle" fill="#16a34a" fontSize="18" fontWeight="700">
        Activation Gap {activationGap} cm
      </text>
      <text x="570" y="378" textAnchor="middle" fill="#111" fontSize="13">
        Magnetic Field: {magneticField.toFixed(0)}%
      </text>

      <text x={magnetX + 5} y="195" fontSize="13" fill="#475569">{magnetType}</text>
      <text x="470" y="205" fontSize="13" fill="#475569">{reedType} Glass Reed Capsule</text>
      <text x="80" y="505" fontSize="13" fill="#475569">Industrial magnetic door / position sensing station</text>
      <text x="80" y="530" fontSize="13" fill="#64748b">Motion: {motionType}</text>
    </svg>
  );
}

function LiveReadout({ magnetPosition, magnetNear, contactClosed, outputOn, reedType, activationGap, magneticField }: any) {
  return (
    <div className="absolute right-3 top-3 w-[238px] rounded-lg border bg-white shadow-lg sm:right-5 sm:top-16 sm:w-[300px]">
      <div className="flex h-12 items-center gap-3 border-b px-4 font-bold text-blue-600">
        <Activity size={20} /> LIVE READOUT
      </div>
      <div className="space-y-4 p-4 text-xs sm:text-sm">
        <Read label="Magnet Position" value={`${magnetPosition.toFixed(1)} cm`} green />
        <Read label="Magnetic Field" value={`${magneticField.toFixed(0)}%`} green={magnetNear} />
        <Read label="Magnet Near" value={magnetNear ? "YES" : "NO"} green={magnetNear} />
        <Read label="Contact State" value={contactClosed ? "CLOSED" : "OPEN"} green={contactClosed} />
        <Read label="Output" value={outputOn ? "ON" : "OFF"} green={outputOn} />
        <Read label="Reed Type" value={reedType} />
        <Read label="Activation Gap" value={`${activationGap} cm`} />
        <Read label="Supply Voltage" value="24 V DC" />
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

function WiringSvg({ reedType, contactClosed, outputOn }: any) {
  return (
    <svg viewBox="0 0 620 190" className="h-[190px] w-full">
      <rect x="30" y="65" width="150" height="58" rx="28" fill="#dbeafe" stroke="#60a5fa" />
      <line x1="58" y1="94" x2="100" y2="94" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
      <line
        x1="110"
        y1={contactClosed ? 94 : 78}
        x2="154"
        y2="94"
        stroke={contactClosed ? "#16a34a" : "#64748b"}
        strokeWidth="6"
        strokeLinecap="round"
      />

      <line x1="180" y1="94" x2="320" y2="94" stroke={outputOn ? "#16a34a" : "#111"} strokeWidth={outputOn ? 4 : 2} />
      <polygon points="320,88 336,94 320,100" fill={outputOn ? "#16a34a" : "#111"} />

      {outputOn && (
        <circle r="5" fill="#22c55e">
          <animateMotion dur="1.2s" repeatCount="indefinite" path="M180 94 L320 94" />
        </circle>
      )}

      <line x1="30" y1="94" x2="30" y2="35" stroke="#dc2626" strokeWidth="2" />
      <line x1="30" y1="35" x2="410" y2="35" stroke="#dc2626" strokeWidth="2" />
      <polygon points="410,29 426,35 410,41" fill="#dc2626" />

      <line x1="30" y1="94" x2="30" y2="155" stroke="#2563eb" strokeWidth="2" />
      <line x1="30" y1="155" x2="410" y2="155" stroke="#2563eb" strokeWidth="2" />
      <polygon points="410,149 426,155 410,161" fill="#2563eb" />

      <text x="210" y="88" fontSize="14">Switch Output</text>
      <text x="450" y="40" fontSize="14">+24 V DC</text>
      <text x="450" y="100" fontSize="14">PLC Input / Load</text>
      <text x="450" y="160" fontSize="14">0 V DC</text>

      <text x="35" y="175" fontSize="12" fill="#475569">
        {reedType} reed switch contact wiring
      </text>
    </svg>
  );
}

function LearningTab({ tab, reedType }: any) {
  const data: Record<string, { icon: any; title: string; points: string[] }> = {
    Theory: {
      icon: <BookOpen size={22} />,
      title: "Reed Switch Sensor Theory",
      points: [
        "A reed switch uses two magnetic metal reeds sealed inside a glass capsule.",
        "When a magnet comes near, the reeds attract each other and change contact state.",
        "Normally Open reed switches close when a magnet is near.",
        "Normally Closed reed switches open when a magnet is near.",
      ],
    },
    "Wiring Diagram": {
      icon: <Zap size={22} />,
      title: `${reedType} Wiring Explanation`,
      points: [
        "Reed switches are passive magnetic contacts.",
        "They can be connected in series with a PLC input or relay circuit.",
        "NO contact closes when magnet is near.",
        "NC contact opens when magnet is near.",
      ],
    },
    Quiz: {
      icon: <CheckCircle2 size={22} />,
      title: "Quick Quiz",
      points: [
        "Q1: What activates a reed switch?",
        "Q2: What happens to an NO reed contact when a magnet approaches?",
        "Q3: Why is the reed capsule made of glass?",
        "Q4: Where are reed switches used in industry?",
      ],
    },
    Report: {
      icon: <FileText size={22} />,
      title: "Simulation Report",
      points: [
        `Selected reed type: ${reedType}`,
        "Recommended activity: adjust activation gap and observe switching point.",
        "Test linear motion and door open/close motion.",
        "Observe contact open/close behavior under magnetic field.",
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