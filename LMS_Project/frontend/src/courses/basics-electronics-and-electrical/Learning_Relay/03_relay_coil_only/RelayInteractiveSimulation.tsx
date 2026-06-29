"use client";

import React, { useEffect, useMemo, useState } from "react";
import ACCircuit from "./ACCircuit";
import DCCircuit from "./DCCircuit";
import {
  ColorLegend,
  ControlPanel,
  StatusPanel,
} from "./RelayControlPanel";
import {
  VIEW_BOX,
  defaultSettings,
  getCircuitValues,
  type SimulationSettings,
} from "./RelayLogic";

export function RelaySimulation() {
  const [settings, setSettings] = useState<SimulationSettings>(defaultSettings);
  const [time, setTime] = useState(0);
  const [timeCursor, setTimeCursor] = useState(defaultSettings.powerOn ? 1 : 0);
  const [controlMode, setControlMode] = useState<"onOff" | "timeline">("onOff");

  useEffect(() => {
    let frameId = 0;
    const startTime = performance.now();

    const animate = () => {
      setTime((performance.now() - startTime) / 1000);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, []);

  const acValues = useMemo(
    () => getCircuitValues({ type: "AC", settings, time }),
    [settings, time]
  );

  const dcValues = useMemo(
    () => getCircuitValues({ type: "DC", settings, time }),
    [settings, time]
  );

  const updateTimeCursor = (value: number) => {
    const safeValue = Math.max(0, Math.min(0.999, value));
    setControlMode("timeline");
    setTimeCursor(safeValue);
    setSettings((current) => ({
      ...current,
      powerOn: safeValue >= 0.2,
    }));
  };

  const selectControlMode = (mode: "onOff" | "timeline") => {
    setControlMode(mode);
    setTimeCursor(settings.powerOn ? 1 : 0);
  };

  const wrapperStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: 0,
    background: "transparent",
    color: "#000000",
    fontFamily: "Arial, Helvetica, sans-serif",
  };

  const layoutStyle: React.CSSProperties = {
    alignItems: "flex-start",
  };

  const svgAreaStyle: React.CSSProperties = {
    minWidth: 0,
    boxSizing: "border-box",
    border: "1px solid #e2e8f0",
    borderRadius: 28,
    padding: 16,
    background: "rgba(248, 250, 252, 0.7)",
  };

  const svgCardStyle: React.CSSProperties = {
    border: "1px solid #e2e8f0",
    borderRadius: 24,
    padding: 12,
    background: "#ffffff",
    boxSizing: "border-box",
    boxShadow: "0 10px 24px rgba(15,23,42,0.05)",
  };

  const svgStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 1000,
    minWidth: 280,
    height: "auto",
    display: "block",
    margin: "0 auto",
  };

  const sidePanelStyle: React.CSSProperties = {
    display: "grid",
    gap: 16,
    alignSelf: "start",
  };

  const statusChipRowStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  };

  const statusChipStyle = (
    tone: "slate" | "emerald" | "blue"
  ): React.CSSProperties => {
    const tones = {
      slate: {
        border: "#e2e8f0",
        background: "#ffffff",
        color: "#334155",
      },
      emerald: {
        border: "#a7f3d0",
        background: "#ecfdf5",
        color: "#047857",
      },
      blue: {
        border: "#bfdbfe",
        background: "#eff6ff",
        color: "#1d4ed8",
      },
    }[tone];

    return {
      border: `1px solid ${tones.border}`,
      background: tones.background,
      color: tones.color,
      borderRadius: 999,
      padding: "4px 12px",
      fontSize: 12,
      fontWeight: 900,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
    };
  };

  return (
    <div style={wrapperStyle}>
      <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]" style={layoutStyle}>
        <div style={sidePanelStyle}>
          <ControlPanel
            settings={settings}
            onChange={setSettings}
            onReset={() => setSettings(defaultSettings)}
          />
          <StatusPanel
            settings={settings}
            acValues={acValues}
            dcValues={dcValues}
          />
        </div>

        <div style={svgAreaStyle}>
          <div style={statusChipRowStyle}>
            <span style={statusChipStyle(settings.powerOn ? "emerald" : "slate")}>
              Power {settings.powerOn ? "ON" : "OFF"}
            </span>
            <span style={statusChipStyle("blue")}>
              Circuit {settings.circuitMode}
            </span>
            <span style={statusChipStyle("slate")}>
              AC {acValues.status}
            </span>
            <span style={statusChipStyle("slate")}>
              DC {dcValues.status}
            </span>
          </div>

          <section className="mb-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
              Mode Select
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => selectControlMode("onOff")}
                className={`rounded-xl px-3 py-3 text-sm font-black transition ${
                  controlMode === "onOff"
                    ? "bg-purple-700 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                ON/OFF Mode
              </button>
              <button
                type="button"
                onClick={() => selectControlMode("timeline")}
                className={`rounded-xl px-3 py-3 text-sm font-black transition ${
                  controlMode === "timeline"
                    ? "bg-blue-700 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                Timeline Mode
              </button>
            </div>
          </section>

          <section className="mb-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Time Cursor / Switching Preview
                </h2>
              </div>
              <span className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-sm">
                {Math.round(timeCursor * 100)}%
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={0.999}
              step={0.001}
              value={timeCursor}
              onChange={(event) => updateTimeCursor(Number(event.target.value))}
              className="w-full accent-green-700"
            />
          </section>

          <div style={svgCardStyle}>
            <svg
              viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`}
              style={svgStyle}
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Interactive relay coil simulation for AC and DC circuits"
              preserveAspectRatio="xMidYMid meet"
            >
              <rect
                x={VIEW_BOX.x + 8}
                y={VIEW_BOX.y + 8}
                width={VIEW_BOX.width - 16}
                height={VIEW_BOX.height - 16}
                rx={10}
                ry={10}
                fill="#ffffff"
                stroke="#000000"
                strokeWidth={1.5}
              />

              <ACCircuit values={acValues} settings={settings} time={time} />

              <line
                x1={55}
                y1={292}
                x2={945}
                y2={292}
                stroke="#000000"
                strokeWidth={1}
                strokeDasharray="6 8"
                opacity={0.35}
              />

              <DCCircuit values={dcValues} settings={settings} time={time} />
            </svg>
          </div>

          <ColorLegend />
        </div>
      </div>
    </div>
  );
}

export default function RelayInteractiveSimulation() {
  return <RelaySimulation />;
}
