"use client";

import { motion } from "framer-motion";

import { BASE_COMPONENT, COLORS } from "./constants";
import type { Mode, Status } from "./types";

type ControlsPanelProps = {
  controlSignal: number;
  effectiveSignal: number;
  mode: Mode;
  status: Status;
  onModeToggle: () => void;
  onSignalChange: (value: number) => void;
  onReset: () => void;
};

function getRegion(signal: number, mode: Mode) {
  if (mode === "OFF" || signal === 0) return "Cutoff Region";
  if (signal < 70) return "Active Region";
  return "Saturation Region";
}

function getValveOpening(signal: number, mode: Mode) {
  if (mode === "OFF") return 0;
  return signal;
}

export default function ControlsPanel({
  controlSignal,
  effectiveSignal,
  mode,
  status,
  onModeToggle,
  onSignalChange,
  onReset,
}: ControlsPanelProps) {
  const valveOpening = getValveOpening(effectiveSignal, mode);
  const region = getRegion(effectiveSignal, mode);

  return (
    <div className="controlBox">
      <div className="topRow">
        <div>
          <h2 className="controlTitle">Interactive Controls</h2>
          {/* <p className="controlSub">
            Control signal changes valve opening and current flow
          </p> */}
        </div>

        <button
          onClick={onModeToggle}
          className="toggleBtn"
          style={{
            color: mode === "ON" ? COLORS.green : COLORS.muted,
            borderColor: mode === "ON" ? COLORS.green : "#94a3b8",
          }}
        >
          {mode}
        </button>
      </div>

      <div className="signalText">
        Control Signal:{" "}
        <span style={{ color: status.color }}>{effectiveSignal}%</span>
      </div>

      <input
        className="slider"
        type="range"
        min="0"
        max="100"
        value={controlSignal}
        onChange={(event) => onSignalChange(Number(event.target.value))}
      />

      <div className="scale">
        <span>0%</span>
        <span>Cutoff</span>
        <span>Active</span>
        <span>Saturation</span>
        <span>100%</span>
      </div>

      <div className="meterGrid">
        <MeterCard
          title="Base / Gate Signal"
          value={effectiveSignal}
          color={status.color}
          sub="Small control input"
        />

        <MeterCard
          title="Valve Opening"
          value={valveOpening}
          color={status.color}
          sub="Mechanical restriction"
        />

        <MeterCard
          title="Output Current Flow"
          value={effectiveSignal}
          color={status.color}
          sub="Collector current analogy"
        />

        <MeterCard
          title="Flow Region"
          value={effectiveSignal}
          color={status.color}
          sub={region}
          showPercent={false}
        />
      </div>

      <div className="statusBox" style={{ borderColor: status.color }}>
        <div className="statusMain" style={{ color: status.color }}>
          {status.label}
        </div>

        <div className="statusSub" style={{ color: status.color }}>
          {status.transistor}
        </div>
      </div>

      <div className="mappingBox">
        <div className="mappingTitle">Transistor Analogy</div>
        <div className="mappingGrid">
          <span>Handle</span>
          <b>= Base / Gate Signal</b>
          <span>Valve Throat</span>
          <b>= Control Junction</b>
          <span>Water Flow</span>
          <b>= Collector Current</b>
        </div>
      </div>

      <button onClick={onReset} className="resetBtn">
        Reset Simulator
      </button>

      <style>{`
        .controlBox {
          width: ${BASE_COMPONENT.controlBox.width}px;
          max-width: 100%;
          margin: 8px auto 0;
          border: 4px solid ${COLORS.green};
          border-radius: 24px;
          padding: 22px;
          text-align: center;
          background: #ffffff;
        }

        .topRow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .controlTitle {
          margin: 0;
          color: ${COLORS.green};
          font-size: 29px;
          font-weight: 900;
          text-align: left;
        }

        .controlSub {
          margin: 4px 0 0;
          color: #64748b;
          font-size: 13px;
          font-weight: 800;
          text-align: left;
        }

        .toggleBtn {
          min-width: 98px;
          padding: 10px 24px;
          border-radius: 999px;
          background: #ffffff;
          border: 4px solid ${COLORS.green};
          font-size: 19px;
          font-weight: 900;
          cursor: pointer;
        }

        .signalText {
          margin: 18px 0 10px;
          color: ${COLORS.outline};
          font-size: 23px;
          font-weight: 900;
        }

        .slider {
          width: 100%;
          accent-color: ${COLORS.green};
          cursor: pointer;
        }

        .scale {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          margin-top: 7px;
          color: #64748b;
          font-size: 11px;
          font-weight: 900;
        }

        .meterGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 16px;
        }

        .meterCard {
          border: 2px solid #bbf7d0;
          border-radius: 16px;
          padding: 12px;
          background: #f8fafc;
        }

        .meterLabel {
          font-size: 13px;
          font-weight: 900;
          color: #475569;
        }

        .meterSub {
          margin-top: 3px;
          font-size: 11px;
          font-weight: 800;
          color: #64748b;
        }

        .meterValue {
          margin-top: 5px;
          font-size: 20px;
          font-weight: 900;
        }

        .bar {
          height: 12px;
          background: #e5e7eb;
          border-radius: 999px;
          overflow: hidden;
          margin-top: 10px;
          border: 1px solid #94a3b8;
        }

        .fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #38bdf8, ${COLORS.green});
        }

        .statusBox {
          margin-top: 15px;
          padding: 12px;
          border: 3px solid;
          border-radius: 16px;
          background: #f8fafc;
        }

        .statusMain {
          font-size: 18px;
          font-weight: 900;
        }

        .statusSub {
          margin-top: 5px;
          font-size: 15px;
          font-weight: 900;
        }

        .mappingBox {
          margin-top: 14px;
          border: 2px solid #bbf7d0;
          border-radius: 16px;
          padding: 12px;
          background: #ffffff;
        }

        .mappingTitle {
          color: ${COLORS.green};
          font-size: 15px;
          font-weight: 900;
          margin-bottom: 8px;
        }

        .mappingGrid {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 5px 10px;
          text-align: left;
          font-size: 12px;
          color: ${COLORS.outline};
        }

        .mappingGrid span,
        .mappingGrid b {
          font-weight: 900;
        }

        .resetBtn {
          width: 90%;
          margin-top: 18px;
          padding: 13px;
          border-radius: 16px;
          border: 4px solid ${COLORS.green};
          background: #ffffff;
          color: ${COLORS.green};
          font-size: 21px;
          font-weight: 900;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .topRow { flex-direction: column; }
          .controlTitle { text-align: center; font-size: 25px; }
          .controlSub { text-align: center; }
          .signalText { font-size: 19px; }
          .meterGrid { grid-template-columns: 1fr; }
          .scale { font-size: 9px; }
        }
      `}</style>
    </div>
  );
}

function MeterCard({
  title,
  value,
  color,
  sub,
  showPercent = true,
}: {
  title: string;
  value: number;
  color: string;
  sub: string;
  showPercent?: boolean;
}) {
  return (
    <div className="meterCard">
      <div className="meterLabel">{title}</div>
      <div className="meterSub">{sub}</div>

      <div className="meterValue" style={{ color }}>
        {showPercent ? `${value}%` : sub}
      </div>

      <div className="bar">
        <motion.div
          className="fill"
          animate={{ width: `${showPercent ? value : Math.max(value, 8)}%` }}
          transition={{ type: "spring", stiffness: 130, damping: 18 }}
        />
      </div>
    </div>
  );
}
