"use client";

import { useState } from "react";

import CircuitVisual from "../CircuitVisual";
import ControlsPanel from "./ControlsPanel";
import { COLORS, SCALE, VIEW_BOX } from "./constants";
import {
  FlowMeter,
  FlowParticles,
  Handle,
  LeftPipe,
  OutletDroplets,
  RightPipe,
  SvgDefs,
  TapValve,
  TransistorMappingPanel,
  TransistorPanel,
  WaterFlowLabel,
  WaterTank,
} from "./diagram-parts";
import { getStatus } from "./logic";
import type { Mode } from "./types";

type TransistorAnalogyProps = {
  controlSignal?: number;
  mode?: Mode;
  onControlSignalChange?: (value: number) => void;
  onModeChange?: (value: Mode) => void;
  baseVoltage?: number;
  baseResistance?: number;
  loadResistance?: number;
  gain?: number;
  switchOn?: boolean;
  hidePageChrome?: boolean;
  panelOnly?: boolean;
  visualOnly?: boolean;
};

export default function TransistorAnalogy({
  controlSignal: externalControlSignal,
  mode: externalMode,
  onControlSignalChange,
  onModeChange,
  baseVoltage: externalBaseVoltage,
  baseResistance: externalBaseResistance,
  loadResistance: externalLoadResistance,
  gain: externalGain,
  switchOn: externalSwitchOn,
  hidePageChrome = false,
  panelOnly = false,
  visualOnly = false,
}: TransistorAnalogyProps) {
  const [internalControlSignal, setInternalControlSignal] =
    useState<number>(50);
  const [internalMode, setInternalMode] = useState<Mode>("ON");

  const controlSignal = externalControlSignal ?? internalControlSignal;
  const mode = externalMode ?? internalMode;
  const effectiveSignal = mode === "ON" ? controlSignal : 0;
  const status = getStatus(effectiveSignal, mode);
  const flowSpeed = Math.max(0.45, 2.3 - effectiveSignal / 58);
  const transistorRegion =
    effectiveSignal === 0
      ? "Cutoff Region"
      : effectiveSignal < 70
        ? "Active Region"
        : "Saturation Region";

  const baseVoltage = externalBaseVoltage ?? 9;
  const loadResistance = externalLoadResistance ?? 300;
  const gain = externalGain ?? 80 + Math.round(effectiveSignal * 0.6);
  const baseResistance =
    externalBaseResistance ?? Math.max(1200, 12000 - effectiveSignal * 100);
  const switchOn = externalSwitchOn ?? (mode === "ON" && effectiveSignal > 0);

  const showLocalControls =
    externalControlSignal === undefined || externalMode === undefined;
  const setControlSignal = onControlSignalChange ?? setInternalControlSignal;
  const setMode = onModeChange ?? setInternalMode;

  const analogyVisual = (
    <div className="lessonPanel">
      <div className="panelHeader">
        <div>
          <h2 className="panelTitle">Water Tap Analogy</h2>
        </div>
      </div>

      <div className="svgWrap">
        <svg
          viewBox={`0 0 ${VIEW_BOX.width} ${VIEW_BOX.height}`}
          style={{
            width: "100%",
            height: "auto",
            transform: `scale(${SCALE.canvas})`,
            transformOrigin: "top left",
          }}
        >
          <SvgDefs />
          <WaterTank />
          <LeftPipe signal={effectiveSignal} flowSpeed={flowSpeed} />
          <TapValve signal={effectiveSignal} status={status} />
          <Handle signal={effectiveSignal} />
          <RightPipe signal={effectiveSignal} flowSpeed={flowSpeed} />
          <FlowParticles signal={effectiveSignal} flowSpeed={flowSpeed} />
          <OutletDroplets signal={effectiveSignal} />
          <FlowMeter signal={effectiveSignal} status={status} />
          <TransistorPanel signal={effectiveSignal} status={status} />
          <WaterFlowLabel />
          <TransistorMappingPanel />
        </svg>
      </div>

      {/* <div className="explainGrid">
        <div className="explainCard">
          <b>Step 1</b>
          <span>Move the handle to simulate the transistor control signal.</span>
        </div>
        <div className="explainCard">
          <b>Step 2</b>
          <span>The valve throat opens and the current path becomes easier to pass through.</span>
        </div>
        <div className="explainCard">
          <b>Step 3</b>
          <span>More water flows out, matching the increase in collector current.</span>
        </div>
      </div> */}
    </div>
  );

  const analogyControls = (
    <div className="space-y-4">
      <ControlsPanel
        controlSignal={controlSignal}
        effectiveSignal={effectiveSignal}
        mode={mode}
        status={status}
        onModeToggle={() => setMode(mode === "ON" ? "OFF" : "ON")}
        onSignalChange={setControlSignal}
        onReset={() => {
          setControlSignal(0);
          setMode("ON");
        }}
      />

      {/* <div className="lessonPanel">
        <div className="panelHeader">
          <div>
            <h2 className="panelTitle">Analogy Mapping</h2>
            <p className="panelText">
              Use the panel to connect each physical object to the transistor
              concept.
            </p>
          </div>
          <span className="panelBadge">Concept Map</span>
        </div>

        <div className="infoGrid" style={{ marginTop: 0 }}>
          <div className="infoItem">
            <b>Water Tank</b>
            <span>Power supply source</span>
          </div>
          <div className="infoItem">
            <b>Handle</b>
            <span>Base or gate control signal</span>
          </div>
          <div className="infoItem">
            <b>Valve Opening</b>
            <span>Amount of transistor conduction</span>
          </div>
          <div className="infoItem">
            <b>Water Flow</b>
            <span>Collector current through the load</span>
          </div>
          <div className="infoItem">
            <b>Current Region</b>
            <span>{transistorRegion}</span>
          </div>
        </div>
      </div> */}
    </div>
  );

  if (panelOnly) {
    return analogyControls;
  }

  if (visualOnly) {
    return analogyVisual;
  }

  return (
    <div className="page">
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: ${hidePageChrome ? "#ffffff" : "#ecfdf5"}; }

        .page {
          min-height: ${hidePageChrome ? "auto" : "100vh"};
          background: ${
            hidePageChrome
              ? "#ffffff"
              : `
            radial-gradient(circle at top, rgba(187, 247, 208, 0.55), transparent 30%),
            linear-gradient(180deg, #f7fef9 0%, #eefbf3 100%)`
          };
          padding: ${hidePageChrome ? "0" : "18px"};
          font-family: Arial, sans-serif;
        }

        .frame {
          max-width: 1500px;
          margin: 0 auto;
          border: ${hidePageChrome ? "none" : "1px solid rgba(22, 163, 74, 0.18)"};
          border-radius: ${hidePageChrome ? "0" : "34px"};
          padding: ${hidePageChrome ? "0" : "22px"};
          background: ${hidePageChrome ? "transparent" : "rgba(255, 255, 255, 0.88)"};
          box-shadow: ${hidePageChrome ? "none" : "0 28px 80px rgba(21, 128, 61, 0.12)"};
        }

        .hero {
          display: grid;
          gap: 18px;
          grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.95fr);
          align-items: stretch;
        }

        .heroCard {
          border-radius: 30px;
          padding: 28px;
          background: linear-gradient(135deg, #0f172a 0%, #14532d 58%, #16a34a 100%);
          color: white;
          overflow: hidden;
          position: relative;
        }

        .heroCard::after {
          content: "";
          position: absolute;
          inset: auto -30px -30px auto;
          width: 220px;
          height: 220px;
          border-radius: 999px;
          background: rgba(255,255,255,0.09);
          filter: blur(2px);
        }

        .heroInfo {
          border-radius: 30px;
          padding: 24px;
          background: linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%);
          border: 1px solid #bbf7d0;
        }

        .eyebrow {
          color: ${COLORS.green};
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          margin: 0;
        }

        .title {
          color: white;
          font-size: 44px;
          font-weight: 900;
          letter-spacing: 0.02em;
          margin: 10px 0 12px;
        }

        .subtitle {
          max-width: 760px;
          margin: 0;
          color: rgba(255,255,255,0.88);
          font-size: 17px;
          line-height: 1.7;
          font-weight: 700;
        }

        .heroGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-top: 22px;
        }

        .heroStat {
          border-radius: 20px;
          padding: 14px;
          background: rgba(255,255,255,0.11);
          border: 1px solid rgba(255,255,255,0.16);
          backdrop-filter: blur(8px);
        }

        .heroLabel {
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 900;
          color: rgba(255,255,255,0.72);
        }

        .heroValue {
          margin-top: 8px;
          font-size: 28px;
          font-weight: 900;
        }

        .heroNote {
          margin-top: 4px;
          font-size: 12px;
          color: rgba(255,255,255,0.78);
          font-weight: 700;
        }

        .infoTitle {
          margin: 0;
          color: #052e16;
          font-size: 24px;
          font-weight: 900;
        }

        .infoLead {
          margin: 10px 0 0;
          color: #475569;
          line-height: 1.7;
          font-size: 14px;
          font-weight: 700;
        }

        .infoGrid {
          display: grid;
          gap: 12px;
          margin-top: 18px;
        }

        .infoItem {
          border-radius: 18px;
          border: 1px solid #dcfce7;
          background: #ffffff;
          padding: 14px 16px;
        }

        .infoItem b {
          display: block;
          color: #166534;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          margin-bottom: 6px;
        }

        .infoItem span {
          color: #0f172a;
          font-size: 14px;
          font-weight: 800;
          line-height: 1.55;
        }

        .contentGrid {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
          gap: 18px;
          margin-top: 18px;
        }

        .lessonPanel {
          border-radius: 30px;
          padding: 18px;
          background: #ffffff;
          border: 1px solid #dcfce7;
          box-shadow: 0 14px 36px rgba(15, 23, 42, 0.06);
        }

        .panelHeader {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }

        .panelTitle {
          margin: 0;
          color: #052e16;
          font-size: 22px;
          font-weight: 900;
        }

        .panelText {
          margin: 6px 0 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.65;
          font-weight: 700;
        }

        .panelBadge {
          white-space: nowrap;
          border-radius: 999px;
          padding: 8px 12px;
          background: #dcfce7;
          color: #166534;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 900;
        }

        .svgWrap {
          width: 100%;
          overflow-x: auto;
          border-radius: 24px;
          border: 1px solid #d1fae5;
          background: linear-gradient(180deg, #ffffff 0%, #f0fdf9 100%);
          padding: 10px;
        }

        .explainGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-top: 16px;
        }

        .explainCard {
          border-radius: 20px;
          padding: 14px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        .explainCard b {
          display: block;
          color: #166534;
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .explainCard span {
          color: #334155;
          font-size: 14px;
          line-height: 1.65;
          font-weight: 700;
        }

        .bottomGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-top: 18px;
        }

        .bottomCard {
          border-radius: 24px;
          padding: 18px;
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid #dbeafe;
        }

        .bottomCard h3 {
          margin: 0 0 8px;
          color: #0f172a;
          font-size: 18px;
          font-weight: 900;
        }

        .bottomCard p {
          margin: 0;
          color: #475569;
          font-size: 14px;
          line-height: 1.7;
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .page { padding: 10px; }
          .frame { padding: 12px; border-radius: 24px; }
          .hero,
          .contentGrid,
          .bottomGrid,
          .explainGrid {
            grid-template-columns: 1fr;
          }
          .heroGrid {
            grid-template-columns: 1fr;
          }
          .title { font-size: 28px; line-height: 1.2; }
          .subtitle { font-size: 14px; }
          .svgWrap svg { min-width: 920px; }
        }
      `}</style>

      <div className="frame">
        {!hidePageChrome ? (
          <section className="hero">
            <div className="heroCard">
              <p className="eyebrow">Lesson 01</p>
              <h1 className="title">What is a Transistor</h1>
              <p className="subtitle">
                Learn transistor behavior through two synchronized views: a
                water-tap analogy for intuition and a circuit diagram for the
                real electronics model.
              </p>

              <div className="heroGrid">
                <div className="heroStat">
                  <div className="heroLabel">Control Signal</div>
                  <div className="heroValue">{effectiveSignal}%</div>
                  <div className="heroNote">Base input controls the device</div>
                </div>

                <div className="heroStat">
                  <div className="heroLabel">Transistor State</div>
                  <div className="heroValue" style={{ fontSize: "22px" }}>
                    {transistorRegion}
                  </div>
                  <div className="heroNote">{status.transistor}</div>
                </div>

                <div className="heroStat">
                  <div className="heroLabel">Collector Flow</div>
                  <div className="heroValue">{effectiveSignal}%</div>
                  <div className="heroNote">Larger output current response</div>
                </div>
              </div>
            </div>

            <aside className="heroInfo">
              <h2 className="infoTitle">Analogy to Circuit Mapping</h2>
              <p className="infoLead">
                A transistor does not create energy. It uses a small control
                signal to regulate a larger current path from the supply to the
                load.
              </p>

              <div className="infoGrid">
                <div className="infoItem">
                  <b>Water Tank</b>
                  <span>Represents the power supply that provides energy.</span>
                </div>
                <div className="infoItem">
                  <b>Tap Handle</b>
                  <span>Represents the base or gate control signal.</span>
                </div>
                <div className="infoItem">
                  <b>Water Flow</b>
                  <span>
                    Represents collector current flowing through the load.
                  </span>
                </div>
                <div className="infoItem">
                  <b>Valve Opening</b>
                  <span>
                    Represents how strongly the transistor is turned on.
                  </span>
                </div>
              </div>
            </aside>
          </section>
        ) : null}

        <section className="contentGrid">
          {analogyVisual}

          {!hidePageChrome ? (
            <div className="lessonPanel">
              <div className="panelHeader">
                <div>
                  <h2 className="panelTitle">Circuit Visual</h2>
                  <p className="panelText">
                    The same lesson state is shown as an electronics circuit so
                    learners can connect the analogy to real transistor
                    behavior.
                  </p>
                </div>
                <span className="panelBadge">Circuit View</span>
              </div>

              <CircuitVisual
                baseVoltage={baseVoltage}
                baseResistance={baseResistance}
                loadResistance={loadResistance}
                switchOn={switchOn}
                gain={gain}
              />
            </div>
          ) : null}
        </section>

        {!hidePageChrome ? (
          <>
            <section className="bottomGrid">
              <article className="bottomCard">
                <h3>Why this works</h3>
                <p>
                  A transistor uses a small base current to control a larger
                  collector current, just like a tap handle controls the larger
                  flow of water in a pipe.
                </p>
              </article>

              <article className="bottomCard">
                <h3>Reading the state</h3>
                <p>
                  When the control signal is low, the transistor stays near
                  cutoff. As the signal rises, it enters the active region and
                  then saturation.
                </p>
              </article>

              <article className="bottomCard">
                <h3>Lesson focus</h3>
                <p>
                  Use the controls below to compare cause and effect across both
                  views at the same time, which makes the transistor easier to
                  explain and remember.
                </p>
              </article>
            </section>

            {showLocalControls ? (
              <div style={{ marginTop: "18px" }}>
                <ControlsPanel
                  controlSignal={controlSignal}
                  effectiveSignal={effectiveSignal}
                  mode={mode}
                  status={status}
                  onModeToggle={() => setMode(mode === "ON" ? "OFF" : "ON")}
                  onSignalChange={setControlSignal}
                  onReset={() => {
                    setControlSignal(0);
                    setMode("ON");
                  }}
                />
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
