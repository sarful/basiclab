"use client";

import { useMemo, useState } from "react";

import {
  COMPONENT,
  MAIN,
  MOSFET_LOGIC,
  NODE,
  PATH,
  VIEW_BOX,
  WIRE,
} from "./mosfetSimulatorConstants";
import {
  ActiveWire,
  LoadVisualizer,
  MainMosfetStructure,
  Meter,
  MosfetSvgDefinitions,
  SvgPanel,
  TopGateSlider,
} from "./mosfetSimulatorComponents";
import MosfetControlPanel from "./MosfetControlPanel";
import MosfetIndustrialDashboardPane from "./MosfetIndustrialDashboardPane";
import MosfetTO220Package from "./MosfetTO220Package";
import PChannelMosfetSymbol from "./PChannelMosfetSymbol";
import {
  calculateDrainCurrent,
  clamp,
  getChannelStrength,
  getState,
  getStateColor,
  getVdsSat,
} from "./mosfetSimulatorLogic";
import type { FlowMode, LoadType } from "./mosfetSimulatorTypes";

export default function MosfetSimulatorSketch() {
  const [gateVoltage, setGateVoltage] = useState(5);
  const [drainVoltage, setDrainVoltage] = useState(8);
  const [temperature, setTemperature] = useState(25);
  const [loadResistance, setLoadResistance] = useState(220);
  const [flowMode, setFlowMode] = useState<FlowMode>("Both");
  const [loadType, setLoadType] = useState<LoadType>("Resistor");
  const [speed, setSpeed] = useState(1);
  const [trainingStep, setTrainingStep] = useState(3);
  const [scopeRunning, setScopeRunning] = useState(true);
  const [autoScale, setAutoScale] = useState(true);

  const thresholdVoltage = MOSFET_LOGIC.thresholdVoltage;

  const channelStrength = useMemo(
    () => getChannelStrength(gateVoltage, thresholdVoltage, temperature),
    [gateVoltage, thresholdVoltage, temperature]
  );

  const drainCurrent = useMemo(
    () =>
      calculateDrainCurrent({
        gateVoltage,
        thresholdVoltage,
        drainVoltage,
        loadResistance,
        temperature,
        loadType,
      }),
    [gateVoltage, thresholdVoltage, drainVoltage, loadResistance, temperature, loadType]
  );

  const mosfetState = useMemo(
    () => getState(gateVoltage, thresholdVoltage, drainVoltage, channelStrength),
    [gateVoltage, thresholdVoltage, drainVoltage, channelStrength]
  );

  const active = mosfetState !== "OFF";
  const stateColor = getStateColor(mosfetState);
  const power = drainVoltage * drainCurrent;
  const junctionTemp = temperature + power * MOSFET_LOGIC.thermalResistance;
  const efficiency = clamp(100 - power * 22 - Math.max(0, junctionTemp - 70) * 0.5, 0, 100);
  const saturationVoltage = getVdsSat(gateVoltage, thresholdVoltage);

  return (
    <div className="w-full bg-white p-3 sm:p-4">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
          <MosfetControlPanel
            autoScale={autoScale}
            drainCurrent={drainCurrent}
            gateVoltage={gateVoltage}
            drainVoltage={drainVoltage}
            temperature={temperature}
            loadResistance={loadResistance}
            flowMode={flowMode}
            loadType={loadType}
            speed={speed}
            scopeRunning={scopeRunning}
            trainingStep={trainingStep}
            setGateVoltage={setGateVoltage}
            setDrainVoltage={setDrainVoltage}
            setTemperature={setTemperature}
            setLoadResistance={setLoadResistance}
            setFlowMode={setFlowMode}
            setLoadType={setLoadType}
            setSpeed={setSpeed}
            setTrainingStep={setTrainingStep}
            setAutoScale={setAutoScale}
            setScopeRunning={setScopeRunning}
          />

          <section className="space-y-6">
            <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white p-3 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:rounded-[28px] sm:p-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1 sm:px-2">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-green-700">
                    Simulation Canvas
                  </p>
                  <h2 className="mt-2 text-xl font-black leading-tight text-slate-900 sm:text-2xl">
                    MOSFET Structure and Waveform View
                  </h2>
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 sm:text-sm">
                  {mosfetState}
                </div>
              </div>

              <svg
                viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`}
                className="h-auto w-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                <MosfetSvgDefinitions />

                <rect width={VIEW_BOX.width} height={VIEW_BOX.height} fill={COMPONENT.background} />

                <SvgPanel {...PATH.mainPanel} />

                <TopGateSlider
                  gateVoltage={gateVoltage}
                  thresholdVoltage={thresholdVoltage}
                  mosfetState={mosfetState}
                  onChange={setGateVoltage}
                />

                <circle
                  cx={MAIN.topNode.cx}
                  cy={MAIN.topNode.cy}
                  r={NODE.terminal}
                  fill="#fff"
                  stroke={COMPONENT.black}
                  strokeWidth={4}
                />

                <ActiveWire
                  d={`M${MAIN.topNode.cx} ${MAIN.topNode.cy} H${MAIN.mainAmmeter.cx}`}
                  active={active}
                  strength={channelStrength}
                  color={stateColor}
                />

                <Meter {...MAIN.mainAmmeter} label="A" color={stateColor} />

                <ActiveWire
                  d={`M894 180 H${MAIN.drainWireEnd.x} V${MAIN.drainWireEnd.y}`}
                  active={active}
                  strength={channelStrength}
                  color={stateColor}
                />

                <path
                  d={`M${MAIN.gateWire.x} ${MAIN.gateWire.y1} V${MAIN.gateWire.y2}`}
                  stroke={WIRE.color}
                  strokeWidth={WIRE.width}
                  fill="none"
                />

                <MainMosfetStructure
                  channelStrength={channelStrength}
                  mosfetState={mosfetState}
                  junctionTemp={junctionTemp}
                  power={power}
                  flowMode={flowMode}
                  isPlaying={scopeRunning}
                  speed={speed}
                />

                <LoadVisualizer type={loadType} current={drainCurrent} />
              </svg>

              <div className="-mt-[100px] border-t border-slate-100 px-2 pt-4 sm:mt-4 sm:px-4 sm:pt-5 lg:-mt-[100px]">
                <div className="grid grid-cols-1 items-end gap-5 sm:grid-cols-2 sm:gap-8 lg:px-6">
                  <div className="flex justify-center">
                    <MosfetTO220Package
                      active={active}
                      className="h-auto w-full max-w-[150px] sm:max-w-[170px] xl:max-w-[190px]"
                      drainVoltage={drainVoltage}
                      flowMode={flowMode}
                      gateVoltage={gateVoltage}
                      label="IRLB3034 TO-220 MOSFET package"
                      mosfetState={mosfetState}
                      stateColor={stateColor}
                      temperature={temperature}
                    />
                  </div>

                  <div className="flex justify-center">
                    <PChannelMosfetSymbol
                      width={132}
                      height={132}
                      label="P-Channel MOSFET symbol"
                      active={active}
                      flowMode={flowMode}
                      highlightColor={stateColor}
                      className="overflow-visible sm:h-[140px] sm:w-[140px] xl:h-[156px] xl:w-[156px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <MosfetIndustrialDashboardPane
              gateVoltage={gateVoltage}
              thresholdVoltage={thresholdVoltage}
              drainVoltage={drainVoltage}
              saturationVoltage={saturationVoltage}
              drainCurrent={drainCurrent}
              power={power}
              junctionTemp={junctionTemp}
              efficiency={efficiency}
              mosfetState={mosfetState}
              loadType={loadType}
              flowMode={flowMode}
              speed={speed}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
