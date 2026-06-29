// RelayControlPanel.tsx
// Control panel + live status panel + color legend.
// This file depends on RelayLogic.ts and Framer Motion.
//
// Required install:
// npm install framer-motion

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  COLORS,
  CURRENT_THRESHOLD,
  type CircuitMode,
  type CircuitValues,
  type SimulationSettings,
  clamp,
  formatNumber,
} from "./RelayLogic";

type ControlPanelProps = {
  settings: SimulationSettings;
  onChange: (nextSettings: SimulationSettings) => void;
  onReset: () => void;
};

type StatusPanelProps = {
  settings: SimulationSettings;
  acValues: CircuitValues;
  dcValues: CircuitValues;
};

function StatusBadge({ status }: { status: CircuitValues["status"] }) {
  const badgeStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "3px 8px",
    border: "1px solid #000",
    borderRadius: 999,
    background:
      status === "Energized"
        ? "#e5eefc"
        : status === "Weak"
          ? "#fff4df"
          : "#f2f2f2",
    fontWeight: 700,
    fontSize: 12,
  };

  return <span style={badgeStyle}>{status}</span>;
}

export function ColorLegend() {
  const itemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    whiteSpace: "nowrap",
  };

  const boxStyle = (color: string, dashed = false): React.CSSProperties => ({
    width: 30,
    height: 0,
    borderTop: `4px ${dashed ? "dashed" : "solid"} ${color}`,
  });

  const legendStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px 16px",
    border: "1px solid #e2e8f0",
    borderRadius: 20,
    padding: 10,
    marginTop: 10,
    background: COLORS.white,
    boxSizing: "border-box",
    boxShadow: "0 10px 24px rgba(15,23,42,0.05)",
  };

  return (
    <div style={legendStyle} aria-label="color legend">
      <div style={itemStyle}>
        <span style={boxStyle(COLORS.dcPositive)} /> Red = DC positive / active wire
      </div>

      <div style={itemStyle}>
        <span style={boxStyle(COLORS.dcNegative)} /> Black/gray = DC negative
      </div>

      <div style={itemStyle}>
        <span style={boxStyle(COLORS.acLive)} /> Brown = AC live
      </div>

      <div style={itemStyle}>
        <span style={boxStyle(COLORS.acNeutral)} /> Blue = AC neutral
      </div>

      <div style={itemStyle}>
        <span style={boxStyle(COLORS.coilCopper)} /> Copper = relay coil winding
      </div>

      <div style={itemStyle}>
        <span style={boxStyle(COLORS.acField, true)} /> Blue/Purple dashed = magnetic field
      </div>

      <div style={itemStyle}>
        <span style={boxStyle(COLORS.warning)} /> Orange glow = coil heating warning
      </div>
    </div>
  );
}

export function StatusPanel({
  settings,
  acValues,
  dcValues,
}: StatusPanelProps) {
  const panelStyle: React.CSSProperties = {
    border: "1px solid #e2e8f0",
    borderRadius: 24,
    padding: 16,
    background: COLORS.white,
    boxSizing: "border-box",
    boxShadow: "0 10px 24px rgba(15,23,42,0.05)",
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 13,
  };

  const cellStyle: React.CSSProperties = {
    borderTop: "1px solid #ddd",
    padding: "7px 4px",
    textAlign: "left",
    verticalAlign: "middle",
  };

  const warningMessages = [
    acValues.highCurrentWarning ? "AC High current: coil may overheat" : "",
    dcValues.highCurrentWarning ? "DC High current: coil may overheat" : "",
  ].filter(Boolean);

  const rows: Array<{
    label: string;
    value: React.ReactNode;
  }> = [
    {
      label: "Main power",
      value: settings.powerOn ? "ON" : "OFF",
    },
    {
      label: "Circuit selected",
      value: settings.circuitMode,
    },
    {
      label: "AC voltage",
      value: `${formatNumber(acValues.voltage, 1)} V RMS`,
    },
    {
      label: "DC voltage",
      value: `${formatNumber(dcValues.voltage, 1)} V`,
    },
    {
      label: "Resistance",
      value: `${formatNumber(settings.resistance, 0)} Ω`,
    },
    {
      label: "AC current",
      value: `${formatNumber(acValues.current, 3)} A`,
    },
    {
      label: "DC current",
      value: `${formatNumber(dcValues.current, 3)} A`,
    },
    {
      label: "AC power",
      value: `${formatNumber(acValues.power, 2)} W`,
    },
    {
      label: "DC power",
      value: `${formatNumber(dcValues.power, 2)} W`,
    },
    {
      label: "AC magnetic strength",
      value: `${formatNumber(acValues.displayMagneticStrength * 100, 0)}%`,
    },
    {
      label: "DC magnetic strength",
      value: `${formatNumber(dcValues.displayMagneticStrength * 100, 0)}%`,
    },
    {
      label: "AC coil status",
      value: <StatusBadge status={acValues.status} />,
    },
    {
      label: "DC coil status",
      value: <StatusBadge status={dcValues.status} />,
    },
    {
      label: "Current threshold",
      value: `${formatNumber(CURRENT_THRESHOLD, 2)} A`,
    },
  ];

  return (
    <div style={panelStyle}>
      <p
        style={{
          margin: "0 0 4px",
          color: "#047857",
          fontSize: 11,
          fontWeight: 900,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
        }}
      >
        Live Data
      </p>
      <h3 style={{ margin: "0 0 10px", fontSize: 18, color: "#020617" }}>
        Coil Status
      </h3>

      <table style={tableStyle}>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <td style={cellStyle}>{row.label}</td>
              <td style={cellStyle}>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <AnimatePresence>
        {warningMessages.length > 0 && (
          <motion.div
            key="high-current-warning"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            style={{
              marginTop: 10,
              padding: 9,
              border: `1px solid ${COLORS.warning}`,
              borderRadius: 6,
              color: COLORS.warning,
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            {warningMessages.map((message) => (
              <div key={message}>{message}</div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ControlPanel({
  settings,
  onChange,
  onReset,
}: ControlPanelProps) {
  const updateSetting = <K extends keyof SimulationSettings>(
    key: K,
    value: SimulationSettings[K]
  ) => {
    onChange({ ...settings, [key]: value });
  };

  const panelStyle: React.CSSProperties = {
    border: "1px solid #e2e8f0",
    borderRadius: 24,
    padding: 16,
    background: COLORS.white,
    boxSizing: "border-box",
    boxShadow: "0 10px 24px rgba(15,23,42,0.05)",
  };

  const rowStyle: React.CSSProperties = {
    display: "grid",
    gap: 6,
    marginBottom: 12,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 600,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
  };

  const switchButtonStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    border: settings.powerOn ? "1px solid #a7f3d0" : "1px solid #e2e8f0",
    borderRadius: 14,
    background: settings.powerOn ? "#ecfdf5" : COLORS.white,
    color: settings.powerOn ? "#047857" : "#334155",
    fontWeight: 900,
    cursor: "pointer",
  };

  return (
    <div style={panelStyle}>
      <p
        style={{
          margin: "0 0 4px",
          color: "#047857",
          fontSize: 11,
          fontWeight: 900,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
        }}
      >
        Control Panel
      </p>
      <h3 style={{ margin: "0 0 14px", fontSize: 20, color: "#020617" }}>
        Relay Coil Trainer
      </h3>

      <div style={rowStyle}>
        <button
          type="button"
          style={switchButtonStyle}
          onClick={() => updateSetting("powerOn", !settings.powerOn)}
        >
          Power: {settings.powerOn ? "ON" : "OFF"}
        </button>
      </div>

      <div style={rowStyle}>
        <label style={labelStyle} htmlFor="circuitMode">
          Circuit Selector
        </label>

        <select
          id="circuitMode"
          value={settings.circuitMode}
          style={{ ...inputStyle, padding: 7 }}
          onChange={(event) =>
            updateSetting("circuitMode", event.target.value as CircuitMode)
          }
        >
          <option value="AC">AC</option>
          <option value="DC">DC</option>
          <option value="Both">Both</option>
        </select>
      </div>

      <div style={rowStyle}>
        <label style={labelStyle} htmlFor="acVoltage">
          AC Voltage: {settings.acVoltage} V
        </label>

        <input
          id="acVoltage"
          type="range"
          min={0}
          max={240}
          step={1}
          value={settings.acVoltage}
          style={inputStyle}
          onChange={(event) =>
            updateSetting("acVoltage", Number(event.target.value))
          }
        />
      </div>

      <div style={rowStyle}>
        <label style={labelStyle} htmlFor="dcVoltage">
          DC Voltage: {settings.dcVoltage} V
        </label>

        <input
          id="dcVoltage"
          type="range"
          min={0}
          max={24}
          step={1}
          value={settings.dcVoltage}
          style={inputStyle}
          onChange={(event) =>
            updateSetting("dcVoltage", Number(event.target.value))
          }
        />
      </div>

      <div style={rowStyle}>
        <label style={labelStyle} htmlFor="resistance">
          Coil Resistance: {settings.resistance} Ω
        </label>

        <input
          id="resistance"
          type="range"
          min={10}
          max={1000}
          step={10}
          value={settings.resistance}
          style={inputStyle}
          onChange={(event) =>
            updateSetting("resistance", Number(event.target.value))
          }
        />

        <input
          aria-label="Coil resistance input"
          type="number"
          min={1}
          max={5000}
          step={1}
          value={settings.resistance}
          style={{ ...inputStyle, padding: 7 }}
          onChange={(event) => {
            const value = clamp(Number(event.target.value), 1, 5000);
            updateSetting("resistance", value);
          }}
        />
      </div>

      <div style={rowStyle}>
        <label style={labelStyle} htmlFor="acFrequency">
          AC Frequency: {settings.acFrequency} Hz
        </label>

        <input
          id="acFrequency"
          type="range"
          min={1}
          max={60}
          step={1}
          value={settings.acFrequency}
          style={inputStyle}
          onChange={(event) =>
            updateSetting("acFrequency", Number(event.target.value))
          }
        />
      </div>

      <div style={rowStyle}>
        <label style={labelStyle} htmlFor="animationSpeed">
          Animation Speed: {settings.animationSpeed.toFixed(1)}x
        </label>

        <input
          id="animationSpeed"
          type="range"
          min={0.2}
          max={3}
          step={0.1}
          value={settings.animationSpeed}
          style={inputStyle}
          onChange={(event) =>
            updateSetting("animationSpeed", Number(event.target.value))
          }
        />
      </div>

      <label style={{ display: "block", marginBottom: 8 }}>
        <input
          type="checkbox"
          checked={settings.showElectronFlow}
          onChange={(event) =>
            updateSetting("showElectronFlow", event.target.checked)
          }
        />{" "}
        Show electron flow
      </label>

      <label style={{ display: "block", marginBottom: 8 }}>
        <input
          type="checkbox"
          checked={settings.showMagneticField}
          onChange={(event) =>
            updateSetting("showMagneticField", event.target.checked)
          }
        />{" "}
        Show magnetic field
      </label>

      <label style={{ display: "block", marginBottom: 8 }}>
        <input
          type="checkbox"
          checked={settings.showLabels}
          onChange={(event) => updateSetting("showLabels", event.target.checked)}
        />{" "}
        Show labels
      </label>

      <label style={{ display: "block", marginBottom: 14 }}>
        <input
          type="checkbox"
          checked={settings.showDirectionArrows}
          onChange={(event) =>
            updateSetting("showDirectionArrows", event.target.checked)
          }
        />{" "}
        Show direction arrows
      </label>

      <button
        type="button"
        onClick={onReset}
        style={{
          width: "100%",
          padding: "9px 12px",
          border: "1px solid #e2e8f0",
          borderRadius: 14,
          background: COLORS.white,
          color: "#334155",
          fontWeight: 900,
          cursor: "pointer",
        }}
      >
        Reset
      </button>
    </div>
  );
}

export default ControlPanel;
