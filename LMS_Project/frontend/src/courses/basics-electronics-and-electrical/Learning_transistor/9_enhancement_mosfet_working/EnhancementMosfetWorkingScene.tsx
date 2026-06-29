"use client";

import { useEffect, useMemo, useState } from "react";

import EnhancementMosfetControlPanel from "./EnhancementMosfetControlPanel";
import EnhancementMosfetEquationPanel from "./EnhancementMosfetEquationPanel";
import EnhancementMosfetWorkingDashboard from "./EnhancementMosfetWorkingDashboard";
import {
  AUTOPLAY_STAGES,
  COMPONENT,
  MAIN,
  MOSFET_LOGIC,
  NODE,
  PATH,
  VIEW_BOX,
  WIRE,
} from "./enhancementMosfetConstants";
import {
  calculateDrainCurrent,
  getChannelStrength,
  getRegionState,
  getStateColor,
  getVdsSat,
} from "./enhancementMosfetLogic";
import { ActiveWire, EnhancementMosfetSvgDefinitions, MainMosfetStructure, Meter, SvgPanel, TopGateSlider } from "./enhancementMosfetSvgComponents";
import type { FlowMode, LearningMode } from "./enhancementMosfetTypes";

export default function EnhancementMosfetWorkingScene() {
  const [gateVoltage, setGateVoltage] = useState(5);
  const [drainVoltage, setDrainVoltage] = useState(8);
  const [thresholdVoltage, setThresholdVoltage] = useState(
    MOSFET_LOGIC.defaultThresholdVoltage
  );
  const [temperature, setTemperature] = useState(25);
  const [loadResistance, setLoadResistance] = useState(220);
  const [flowMode, setFlowMode] = useState<FlowMode>("Both");
  const [learningMode, setLearningMode] = useState<LearningMode>("Advanced");
  const [trainingStep, setTrainingStep] = useState(3);
  const [autoplay, setAutoplay] = useState(false);
  const [isRunning, setIsRunning] = useState(true);
  const [scopeRunning, setScopeRunning] = useState(true);
  const [autoScale, setAutoScale] = useState(true);

  useEffect(() => {
    if (!autoplay) return;

    const stage = AUTOPLAY_STAGES[trainingStep];
    setGateVoltage(stage.gateVoltage);
    setDrainVoltage(stage.drainVoltage);

    const timer = window.setTimeout(() => {
      setTrainingStep((prev) => (prev + 1) % AUTOPLAY_STAGES.length);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [autoplay, trainingStep]);

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
      }),
    [gateVoltage, thresholdVoltage, drainVoltage, loadResistance, temperature]
  );

  const regionState = useMemo(
    () => getRegionState(gateVoltage, thresholdVoltage, drainVoltage, channelStrength),
    [gateVoltage, thresholdVoltage, drainVoltage, channelStrength]
  );

  const active = regionState !== "OFF";
  const stateColor = getStateColor(regionState);
  const saturationVoltage = getVdsSat(gateVoltage, thresholdVoltage);
  const power = drainVoltage * drainCurrent;
  const junctionTemp = temperature + power * MOSFET_LOGIC.thermalResistance;

  const resetSimulation = () => {
    setGateVoltage(0);
    setDrainVoltage(8);
    setThresholdVoltage(MOSFET_LOGIC.defaultThresholdVoltage);
    setTemperature(25);
    setLoadResistance(220);
    setFlowMode("Both");
    setLearningMode("Advanced");
    setTrainingStep(0);
    setAutoplay(false);
    setIsRunning(false);
  };

  return (
    <div className="w-full bg-white p-3 sm:p-4">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
          <EnhancementMosfetControlPanel
            autoScale={autoScale}
            drainCurrent={drainCurrent}
            gateVoltage={gateVoltage}
            drainVoltage={drainVoltage}
            thresholdVoltage={thresholdVoltage}
            temperature={temperature}
            loadResistance={loadResistance}
            flowMode={flowMode}
            learningMode={learningMode}
            trainingStep={trainingStep}
            autoplay={autoplay}
            running={scopeRunning}
            setGateVoltage={setGateVoltage}
            setDrainVoltage={setDrainVoltage}
            setThresholdVoltage={setThresholdVoltage}
            setTemperature={setTemperature}
            setLoadResistance={setLoadResistance}
            setFlowMode={setFlowMode}
            setLearningMode={setLearningMode}
            setTrainingStep={setTrainingStep}
            setRunning={setScopeRunning}
            setAutoScale={setAutoScale}
            onRun={() => setIsRunning(true)}
            onPause={() => setIsRunning(false)}
            onReset={resetSimulation}
            onAuto={() => {
              setAutoplay((value) => !value);
              setIsRunning(true);
            }}
          />

          <section className="space-y-6">
            <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white p-3 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:rounded-[28px] sm:p-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1 sm:px-2">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-green-700">
                    Simulation Canvas
                  </p>
                  <h2 className="mt-2 text-xl font-black leading-tight text-slate-900 sm:text-2xl">
                    Enhancement MOSFET Working View
                  </h2>
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 sm:text-sm">
                  {regionState}
                </div>
              </div>

              <svg
                viewBox={`${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.width} ${VIEW_BOX.height}`}
                className="h-auto w-full"
                preserveAspectRatio="xMidYMin meet"
                xmlns="http://www.w3.org/2000/svg"
              >
                <EnhancementMosfetSvgDefinitions />
                <rect width={VIEW_BOX.width} height={VIEW_BOX.height} fill={COMPONENT.background} />
                <SvgPanel {...PATH.mainPanel} />
                <TopGateSlider
                  gateVoltage={gateVoltage}
                  thresholdVoltage={thresholdVoltage}
                  regionState={regionState}
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
                  regionState={regionState}
                  gateVoltage={gateVoltage}
                  junctionTemp={junctionTemp}
                  power={power}
                  flowMode={flowMode}
                  isRunning={isRunning}
                  learningMode={learningMode}
                />
              </svg>
            </div>

            <EnhancementMosfetEquationPanel
              visible={learningMode === "Advanced"}
              gateVoltage={gateVoltage}
              thresholdVoltage={thresholdVoltage}
              drainCurrent={drainCurrent}
            />

            <EnhancementMosfetWorkingDashboard
              gateVoltage={gateVoltage}
              thresholdVoltage={thresholdVoltage}
              drainVoltage={drainVoltage}
              saturationVoltage={saturationVoltage}
              drainCurrent={drainCurrent}
              power={power}
              junctionTemp={junctionTemp}
              regionState={regionState}
              flowMode={flowMode}
              learningMode={learningMode}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
