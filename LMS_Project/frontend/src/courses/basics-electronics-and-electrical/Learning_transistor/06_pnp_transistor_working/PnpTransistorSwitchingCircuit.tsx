"use client";

import type { CurrentFlowMode, PnpWorkingMode } from "./simulationTypes";
import {
  PNP_CIRCUIT_MODEL,
  STYLE,
} from "./PnpCircuitLayout";
import {
  ButtonBlock,
  CurrentFlowOverlay,
  DynamicTextLabels,
  LedBlock,
  LedGlow,
  NodeLayer,
  RailLabels,
  RotatedResistorBlock,
  SourceBlock,
  TransistorBlock,
  WireLayer,
} from "./PnpCircuitSvgBlocks";

type PnpTransistorSwitchingCircuitProps = {
  batteryVoltage?: number;
  rbOhms?: number;
  rpuOhms?: number;
  rLedOhms?: number;
  flowSpeed?: number;
  switchClosed?: boolean;
  emitterVoltage?: number;
  baseVoltage?: number;
  collectorVoltage?: number;
  baseCurrentMa?: number;
  collectorCurrentMa?: number;
  ledBrightness?: number;
  basePathActive?: boolean;
  loadPathActive?: boolean;
  mode?: PnpWorkingMode;
  flowMode?: CurrentFlowMode;
};

export default function PnpTransistorSwitchingCircuit({
  batteryVoltage = 5,
  rbOhms = 10000,
  rpuOhms = 100000,
  rLedOhms = 1000,
  flowSpeed = 1,
  switchClosed = false,
  emitterVoltage = batteryVoltage,
  baseVoltage = batteryVoltage,
  collectorVoltage = 0,
  baseCurrentMa = 0,
  collectorCurrentMa = 0,
  ledBrightness = 0,
  basePathActive = false,
  loadPathActive = false,
  mode = "cutoff",
  flowMode = "conventional",
}: PnpTransistorSwitchingCircuitProps) {
  const { COMPONENT, SCALE, VIEW_BOX, VIEW_BOX_VALUE } = PNP_CIRCUIT_MODEL;

  return (
    <div
      style={{
        background: STYLE.background,
        borderRadius: 24,
        border: `1px solid ${STYLE.boardBorder}`,
        padding: 16,
        minHeight: VIEW_BOX.height,
        width: "100%",
      }}
    >
      <svg
        width={VIEW_BOX.width}
        height={VIEW_BOX.height}
        viewBox={VIEW_BOX_VALUE}
        preserveAspectRatio="xMidYMin meet"
        role="img"
        aria-label="PNP transistor switching circuit with current flow"
        style={{
          display: "block",
          width: "100%",
          maxWidth: `${VIEW_BOX.width}px`,
          height: "auto",
          margin: "0 auto",
          overflow: "visible",
        }}
      >
        <g transform={`scale(${SCALE.canvas})`}>
          <RailLabels />
          <WireLayer />
          <CurrentFlowOverlay
            basePathActive={basePathActive}
            loadPathActive={loadPathActive}
            flowMode={flowMode}
            batteryVoltage={batteryVoltage}
            baseCurrentMa={baseCurrentMa}
            collectorCurrentMa={collectorCurrentMa}
            flowSpeed={flowSpeed}
          />
          <NodeLayer />
          <SourceBlock />
          <ButtonBlock switchClosed={switchClosed} />
          <RotatedResistorBlock
            component={COMPONENT.pullUpResistor}
            label="Pull-up resistor"
          />
          <RotatedResistorBlock
            component={COMPONENT.baseResistor}
            label="Base resistor"
          />
          <RotatedResistorBlock
            component={COMPONENT.ledResistor}
            label="Resistor"
          />
          <LedGlow ledBrightness={ledBrightness} />
          <LedBlock />
          <TransistorBlock />
          <DynamicTextLabels
            batteryVoltage={batteryVoltage}
            rbOhms={rbOhms}
            rpuOhms={rpuOhms}
            rLedOhms={rLedOhms}
            switchClosed={switchClosed}
            emitterVoltage={emitterVoltage}
            baseVoltage={baseVoltage}
            collectorVoltage={collectorVoltage}
            baseCurrentMa={baseCurrentMa}
            collectorCurrentMa={collectorCurrentMa}
            mode={mode}
            flowMode={flowMode}
          />
        </g>
      </svg>
    </div>
  );
}
