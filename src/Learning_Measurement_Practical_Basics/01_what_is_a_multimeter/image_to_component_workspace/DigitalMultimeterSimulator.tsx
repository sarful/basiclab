"use client";

import { useState } from "react";

import DigitalMultimeterCanvas, {
  type DigitalMultimeterCanvasSizeMode,
} from "./DigitalMultimeterCanvas";
import DigitalMultimeterTrainerControls from "./DigitalMultimeterTrainerControls";
import { useMultimeterDial } from "./useMultimeterDial";

type DigitalMultimeterSimulatorProps = {
  className?: string;
};

export default function DigitalMultimeterSimulator({
  className,
}: DigitalMultimeterSimulatorProps) {
  const [viewMode, setViewMode] =
    useState<DigitalMultimeterCanvasSizeMode>("fit");
  const {
    blackLeadJack,
    displayValue,
    moveDial,
    redLeadJack,
    resetToSafeDefault,
    selectedDialStopId,
    selectedMode,
    setDialStop,
    setLeadJack,
    validation,
  } = useMultimeterDial();

  return (
    <div className={className}>
      <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)] md:p-5">
        <DigitalMultimeterTrainerControls
          blackLeadJack={blackLeadJack}
          canvas={
            <DigitalMultimeterCanvas
              blackLeadJack={blackLeadJack}
              displayValue={displayValue}
              redLeadJack={redLeadJack}
              selectedStopId={selectedDialStopId}
              sizeMode={viewMode}
            />
          }
          moveDial={moveDial}
          onSetDialStop={setDialStop}
          onSetLeadJack={setLeadJack}
          onSetViewMode={setViewMode}
          redLeadJack={redLeadJack}
          resetToSafeDefault={resetToSafeDefault}
          selectedDialStopId={selectedDialStopId}
          selectedMode={selectedMode}
          validation={validation}
          viewMode={viewMode}
        />
      </section>
    </div>
  );
}
