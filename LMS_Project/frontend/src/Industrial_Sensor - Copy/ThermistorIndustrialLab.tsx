"use client";

import React, { useMemo, useState } from "react";
import {
  Activity, BookOpen, CheckCircle2, ClipboardList, Cpu, FileText,
  Info, Maximize, Monitor, Play, RotateCcw, Settings, Square,
  Sun, Volume2, Zap,
} from "lucide-react";

type Tab = "Simulator" | "Theory" | "Wiring Diagram" | "Quiz" | "Report";
type ThermistorType = "NTC" | "PTC";
type Application = "Motor Winding" | "Battery Pack" | "HVAC Air Duct" | "Heater Plate";
type OutputMode = "Resistance Ω" | "Voltage Divider" | "PLC Analog Input";

export default function ThermistorIndustrialLab() {
  const [tab, setTab] = useState<Tab>("Simulator");
  const [power, setPower] = useState(true);
  const [thermistorType, setThermistorType] = useState<ThermistorType>("NTC");
  const [application, setApplication] = useState<Application>("Motor Winding");
  const [outputMode, setOutputMode] = useState<OutputMode>("Voltage Divider");
  const [setPoint, setSetPoint] = useState(85);
  const [temperature, setTemperature] = useState(45);
  const [alarmCount, setAlarmCount] = useState(1);

  const nominalR = 10000;
  const resistance =
    thermistorType === "NTC"
      ? nominalR * Math.exp(3950 * (1 / (temperature + 273.15) - 1 / 298.15))
      : nominalR * (1 + 0.018 * Math.max(0, temperature - 25));

  const voltage = power ? 5 * (resistance / (resistance + 10000)) : 0;
  const highAlarm =
    power &&
    (thermistorType === "NTC"
      ? temperature >= setPoint
      : resistance >= nominalR * 1.5);

  const outputActive = power && voltage > 0;

  function moveTemp(v: number) {
    const next = Number(Math.max(-20, Math.min(180, v)).toFixed(0));
    if (!highAlarm && power && next >= setPoint) setAlarmCount((n) => n + 1);
    setTemperature(next);
  }

  function reset() {
    setPower(false);
    setThermistorType("NTC");
    setApplication("Motor Winding");
    setOutputMode("Voltage Divider");
    setSetPoint(85);
    setTemperature(45);
    setAlarmCount(0);
    setTab("Simulator");
  }

  const logs = useMemo(() => {
    if (!power) return [["--:--", "Power OFF", "text-slate-500"]];
    return [
      ["10:24:15", "Thermistor Measurement Started", "text-slate-700"],
      highAlarm
        ? ["10:24:18", "Temperature Alarm Triggered", "text-red-600"]
        : ["10:24:23", "Temperature Normal", "text-green-600"],
      ["10:24:18", `${resistance.toFixed(0)} Ω / ${voltage.toFixed(2)} V`, "text-slate-900"],
      ["LIVE", `${thermistorType} / ${application}`, "text-blue-600"],
    ];
  }, [power, highAlarm, resistance, voltage, thermistorType, application]);

  return (
    <main className="min-h-screen bg-white p-3 text-slate-950 sm:p-4 lg:p-5">
      <div className="mx-auto max-w-[1560px] space-y-4">
        <Header tab={tab} setTab={setTab} />

        {tab !== "Simulator" ? (
          <LearningTab tab={tab} thermistorType={thermistorType} outputMode={outputMode} />
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <aside className="space-y-4 xl:col-span-3">
              <Panel title="THERMISTOR CONFIGURATION" icon={<Settings size={20} />}>
                <Control label="Type">
                  <Select value={thermistorType} onChange={(v) => setThermistorType(v as ThermistorType)}>
                    <option>NTC</option>
                    <option>PTC</option>
                  </Select>
                </Control>

                <Control label="Application">
                  <Select value={application} onChange={(v) => setApplication(v as Application)}>
                    <option>Motor Winding</option>
                    <option>Battery Pack</option>
                    <option>HVAC Air Duct</option>
                    <option>Heater Plate</option>
                  </Select>
                </Control>

                <Control label="Output Mode">
                  <Select value={outputMode} onChange={(v) => setOutputMode(v as OutputMode)}>
                    <option>Resistance Ω</option>
                    <option>Voltage Divider</option>
                    <option>PLC Analog Input</option>
                  </Select>
                </Control>

                <Control label="Alarm Setpoint">
                  <div className="grid grid-cols-[1fr_42px_42px] gap-2">
                    <div className="input flex items-center justify-between">
                      <b>{setPoint}</b><span>°C</span>
                    </div>
                    <button className="miniBtn" onClick={() => setSetPoint(Math.max(0, setPoint - 5))}>−</button>
                    <button className="miniBtn" onClick={() => setSetPoint(Math.min(180, setPoint + 5))}>+</button>
                  </div>
                </Control>

                <Control label="Supply">
                  <div className="input flex items-center justify-between">
                    <span>5 V DC Divider</span>
                    <Zap size={15} className="text-blue-600" />
                  </div>
                </Control>
              </Panel>

              <Panel title="THERMISTOR STATUS" icon={<Activity size={20} />}>
                <Status label="Power" value={power ? "Active" : "OFF"} dot={power} />
                <Status label="Alarm" value={highAlarm ? "HIGH" : "NORMAL"} badge={highAlarm} danger={highAlarm} />
                <Status label="Output" value={outputActive ? "ACTIVE" : "OFF"} badge={outputActive} />
                <Status label="Temp" value={`${temperature.toFixed(0)}°C`} distance />
                <Status label="Resistance" value={`${resistance.toFixed(0)} Ω`} />
              </Panel>

              <Panel title="INSTRUCTIONS" icon={<Info size={20} />}>
                <ol className="space-y-3 text-sm leading-relaxed">
                  <li>1. Select NTC or PTC thermistor.</li>
                  <li>2. Adjust process temperature.</li>
                  <li>3. Observe resistance and voltage divider output.</li>
                  <li>4. Compare NTC resistance drop and PTC resistance rise.</li>
                </ol>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button onClick={() => setPower(true)} className="primaryBtn"><Play size={17} /> Start</button>
                  <button onClick={() => setPower(false)} className="secondaryBtn"><Square size={15} /> Stop</button>
                  <button onClick={reset} className="secondaryBtn col-span-2"><RotateCcw size={17} /> Reset</button>
                </div>
              </Panel>
            </aside>

            <section className="space-y-4 xl:col-span-9">
              <Panel title="THERMISTOR SIMULATION AREA" icon={<Monitor size={20} />}>
                <div className="relative h-[420px] overflow-hidden rounded-xl bg-white sm:h-[500px] lg:h-[575px]">
                  <ThermistorScene
                    power={power}
                    thermistorType={thermistorType}
                    application={application}
                    temperature={temperature}
                    setPoint={setPoint}
                    highAlarm={highAlarm}
                    resistance={resistance}
                    voltage={voltage}
                  />

                  <LiveReadout
                    temperature={temperature}
                    setPoint={setPoint}
                    highAlarm={highAlarm}
                    resistance={resistance}
                    voltage={voltage}
                    thermistorType={thermistorType}
                    outputMode={outputMode}
                    application={application}
                  />

                  <div className="absolute bottom-4 left-1/2 w-[86%] max-w-xl -translate-x-1/2 rounded-xl border bg-white/95 p-3 shadow-sm">
                    <input
                      type="range"
                      min={-20}
                      max={180}
                      step={1}
                      value={temperature}
                      onChange={(e) => moveTemp(Number(e.target.value))}
                      className="w-full accent-red-600"
                    />
                    <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                      <span>Cold</span>
                      <span>Adjust thermistor temperature</span>
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

                <Panel title="THERMISTOR CONNECTION" icon={<Settings size={19} />} className="xl:col-span-5">
                  <WiringSvg
                    outputMode={outputMode}
                    resistance={resistance}
                    voltage={voltage}
                    highAlarm={highAlarm}
                  />
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
                    Alarm Count: <b>{alarmCount}</b>
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
          <p className="text-base text-blue-600 sm:text-lg">Thermistor Simulation</p>
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

function ThermistorScene({ power, thermistorType, application, temperature, setPoint, highAlarm, resistance, voltage }: any) {
  const heat = Math.min(1, Math.max(0, (temperature + 20) / 200));

  return (
    <svg viewBox="0 0 1120 560" className="h-full w-full">
      <defs>
        <filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="8" floodOpacity=".2" /></filter>
        <radialGradient id="heatGlow">
          <stop offset="0" stopColor="#ef4444" stopOpacity=".8" />
          <stop offset="1" stopColor="#ef4444" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="70" y="420" width="980" height="42" rx="8" fill="#e5e7eb" stroke="#94a3b8" />
      <rect x="105" y="435" width="910" height="10" rx="5" fill="#cbd5e1" />

      <rect x="125" y="210" width="300" height="180" rx="18" fill="#334155" stroke="#111827" filter="url(#shadow)" />
      <rect x="155" y="240" width="240" height="115" rx="12" fill="#111827" />
      <circle cx="275" cy="298" r="92" fill="url(#heatGlow)" opacity={power ? heat : 0.05} />
      <path d="M195 340 C175 305 222 285 208 250 C252 285 238 310 272 340 C263 295 312 265 303 235 C365 290 350 330 330 340 Z"
        fill="#ef4444" opacity={power ? Math.max(0.12, heat) : 0.05} />
      <text x="155" y="198" fontSize="13" fill="#475569">{application}</text>

      <rect x="435" y="230" width="170" height="120" rx="16" fill="#f8fafc" stroke="#94a3b8" filter="url(#shadow)" />
      <circle cx="520" cy="290" r="38" fill={thermistorType === "NTC" ? "#2563eb" : "#ef4444"} opacity=".85" />
      <path d="M480 290 C495 260 545 320 560 290" fill="none" stroke="white" strokeWidth="5" />
      <text x="492" y="297" fill="white" fontSize="18" fontWeight="700">{thermistorType}</text>
      <text x="438" y="215" fontSize="13" fill="#475569">{thermistorType} Thermistor Bead</text>

      <line x1="425" y1="290" x2="320" y2="290" stroke="#ef4444" strokeWidth="5" />
      <line x1="605" y1="290" x2="710" y2="290" stroke="#2563eb" strokeWidth="5" />

      <rect x="715" y="235" width="150" height="105" rx="16" fill="#f8fafc" stroke="#94a3b8" filter="url(#shadow)" />
      <text x="740" y="265" fontSize="15" fontWeight="700" fill="#2563eb">DIVIDER</text>
      <text x="735" y="292" fontSize="13" fill="#475569">{resistance.toFixed(0)} Ω</text>
      <text x="735" y="315" fontSize="13" fill="#475569">{voltage.toFixed(2)} V</text>
      <circle cx="840" cy="260" r="6" fill={power ? "#22c55e" : "#64748b"} />
      <circle cx="840" cy="285" r="6" fill={highAlarm ? "#ef4444" : "#22c55e"} />

      <path d="M865 290 C910 395 965 360 1010 410" fill="none" stroke="#111827" strokeWidth="18" strokeLinecap="round" />
      <rect x="990" y="375" width="100" height="85" rx="16" fill="#e5e7eb" stroke="#94a3b8" filter="url(#shadow)" />
      <text x="1018" y="410" fontSize="15" fontWeight="700" fill="#2563eb">PLC</text>
      <text x="1005" y="435" fontSize="13" fill="#475569">Analog</text>

      {power && (
        <circle r="5" fill={highAlarm ? "#ef4444" : "#22c55e"}>
          <animateMotion dur="1.3s" repeatCount="indefinite" path="M865 290 C910 395 965 360 1010 410" />
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
        <text x="485" y="150" fill="#dc2626" fontSize="24" fontWeight="700">
          TEMPERATURE ALARM
        </text>
      )}

      <text x="80" y="505" fontSize="13" fill="#475569">Industrial thermistor temperature protection loop</text>
      <text x="80" y="530" fontSize="13" fill="#64748b">Thermistor → Voltage Divider → PLC Analog Input / Alarm</text>
    </svg>
  );
}

function LiveReadout({ temperature, setPoint, highAlarm, resistance, voltage, thermistorType, outputMode, application }: any) {
  return (
    <div className="absolute right-3 top-3 w-[238px] rounded-lg border bg-white shadow-lg sm:right-5 sm:top-16 sm:w-[300px]">
      <div className="flex h-12 items-center gap-3 border-b px-4 font-bold text-blue-600"><Activity size={20} /> LIVE READOUT</div>
      <div className="space-y-4 p-4 text-xs sm:text-sm">
        <Read label="Temperature" value={`${temperature.toFixed(0)}°C`} green={!highAlarm} danger={highAlarm} />
        <Read label="Setpoint" value={`${setPoint}°C`} />
        <Read label="Alarm" value={highAlarm ? "HIGH" : "NORMAL"} danger={highAlarm} green={!highAlarm} />
        <Read label="Resistance" value={`${resistance.toFixed(0)} Ω`} green />
        <Read label="Divider Voltage" value={`${voltage.toFixed(2)} V`} />
        <Read label="Type" value={thermistorType} />
        <Read label="Output Mode" value={outputMode} />
        <Read label="Application" value={application} />
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

function WiringSvg({ outputMode, resistance, voltage, highAlarm }: any) {
  return (
    <svg viewBox="0 0 620 190" className="h-[190px] w-full">
      <line x1="55" y1="95" x2="135" y2="95" stroke="#ef4444" strokeWidth="4" />
      <circle cx="155" cy="95" r="30" fill="#e5e7eb" stroke="#64748b" />
      <path d="M130 95 C140 70 170 120 182 95" fill="none" stroke="#2563eb" strokeWidth="5" />
      <line x1="185" y1="95" x2="275" y2="95" stroke="#2563eb" strokeWidth="4" />

      <rect x="285" y="58" width="120" height="82" rx="14" fill="#f8fafc" stroke="#94a3b8" />
      <text x="305" y="88" fontSize="14" fontWeight="700">Divider</text>
      <text x="303" y="113" fontSize="12">{resistance.toFixed(0)} Ω</text>

      <line x1="405" y1="95" x2="500" y2="95" stroke={highAlarm ? "#ef4444" : "#16a34a"} strokeWidth="4" />
      <polygon points="500,89 516,95 500,101" fill={highAlarm ? "#ef4444" : "#16a34a"} />

      <text x="420" y="82" fontSize="13">{outputMode}</text>
      <text x="535" y="100" fontSize="14">{voltage.toFixed(2)} V</text>
      <text x="535" y="40" fontSize="14">+5 V</text>
      <text x="535" y="160" fontSize="14">0 V</text>

      <circle r="5" fill={highAlarm ? "#ef4444" : "#22c55e"}>
        <animateMotion dur="1.2s" repeatCount="indefinite" path="M405 95 L500 95" />
      </circle>

      <text x="35" y="180" fontSize="12" fill="#475569">Thermistor voltage-divider wiring</text>
    </svg>
  );
}

function LearningTab({ tab, thermistorType, outputMode }: any) {
  const data: Record<string, { icon: any; title: string; points: string[] }> = {
    Theory: {
      icon: <BookOpen size={22} />,
      title: "Thermistor Theory",
      points: [
        "A thermistor is a temperature-sensitive resistor.",
        "NTC thermistor resistance decreases as temperature rises.",
        "PTC thermistor resistance increases as temperature rises.",
        "Thermistors are widely used for motor protection, battery monitoring and HVAC sensing.",
      ],
    },
    "Wiring Diagram": {
      icon: <Zap size={22} />,
      title: `${outputMode} Wiring Explanation`,
      points: [
        "Thermistors are commonly used in a voltage-divider circuit.",
        "The divider output voltage changes as thermistor resistance changes.",
        "PLC analog input or microcontroller ADC reads the voltage.",
        "Alarm logic can be created using temperature threshold values.",
      ],
    },
    Quiz: {
      icon: <CheckCircle2 size={22} />,
      title: "Quick Quiz",
      points: [
        "Q1: What happens to NTC resistance when temperature increases?",
        "Q2: What happens to PTC resistance when temperature increases?",
        "Q3: Why is a voltage divider used?",
        "Q4: Where are thermistors used in industry?",
      ],
    },
    Report: {
      icon: <FileText size={22} />,
      title: "Simulation Report",
      points: [
        `Selected thermistor type: ${thermistorType}`,
        `Selected output mode: ${outputMode}`,
        "Recommended activity: compare NTC and PTC resistance curves.",
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