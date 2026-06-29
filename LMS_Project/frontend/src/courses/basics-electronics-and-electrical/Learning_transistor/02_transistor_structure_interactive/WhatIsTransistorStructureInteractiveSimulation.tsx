"use client";

import ControlPanelSection from "./ControlPanelSection";
import NpnStructureVisual from "./NpnStructureVisual";
import PnpStructureVisual from "./PnpStructureVisual";
import TransistorLayerOverview from "./TransistorLayerOverview";
import TransistorMetrics from "./TransistorMetrics";
import TransistorStructureHero from "./TransistorStructureHero";
import { useTransistorStructureSimulation } from "./useTransistorStructureSimulation";

export default function WhatIsTransistorStructureInteractiveSimulation() {
  const simulation = useTransistorStructureSimulation();

  return (
    <div className="min-h-screen overflow-x-hidden bg-white p-3 text-slate-800 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
        <TransistorStructureHero />

        <TransistorMetrics
          transistorType={simulation.transistorType}
          transistorGain={simulation.transistorGain}
          active={simulation.active}
          isBiased={simulation.isBiased}
          collectorCurrent={simulation.collectorCurrent}
        />

        <div className="grid gap-4 xl:grid-cols-3">
          <ControlPanelSection
            transistorType={simulation.transistorType}
            setTransistorType={simulation.setTransistorType}
            active={simulation.active}
            setActive={simulation.setActive}
            dopingLevel={simulation.dopingLevel}
            setDopingLevel={simulation.setDopingLevel}
            collectorVoltage={simulation.collectorVoltage}
            setCollectorVoltage={simulation.setCollectorVoltage}
            baseVoltage={simulation.baseVoltage}
            setBaseVoltage={simulation.setBaseVoltage}
            baseResistance={simulation.baseResistance}
            setBaseResistance={simulation.setBaseResistance}
            loadResistance={simulation.loadResistance}
            setLoadResistance={simulation.setLoadResistance}
            showPhysics={simulation.showPhysics}
            setShowPhysics={simulation.setShowPhysics}
            showCurrent={simulation.showCurrent}
            setShowCurrent={simulation.setShowCurrent}
            showCarrierFlow={simulation.showElectronFlow}
            setShowCarrierFlow={simulation.setShowElectronFlow}
          />

          <div className="space-y-4 xl:col-span-2">
            {simulation.transistorType === "NPN" ? (
              <NpnStructureVisual
                active={simulation.active}
                dopingLevel={simulation.dopingLevel}
                collectorVoltage={simulation.collectorVoltage}
                baseVoltage={simulation.baseVoltage}
                baseResistance={simulation.baseResistance}
                loadResistance={simulation.loadResistance}
                showPhysics={simulation.showPhysics}
                showCurrent={simulation.showCurrent}
                showElectronFlow={simulation.showElectronFlow}
              />
            ) : (
              <PnpStructureVisual
                active={simulation.active}
                dopingLevel={simulation.dopingLevel}
                collectorVoltage={simulation.collectorVoltage}
                baseVoltage={simulation.baseVoltage}
                baseResistance={simulation.baseResistance}
                loadResistance={simulation.loadResistance}
                showPhysics={simulation.showPhysics}
                showCurrent={simulation.showCurrent}
                showElectronFlow={simulation.showElectronFlow}
              />
            )}
          </div>
        </div>

        <TransistorLayerOverview />
      </div>
    </div>
  );
}
