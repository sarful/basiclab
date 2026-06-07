"use client";

import { useMemo, useState } from "react";

import type { MultimeterJackId } from "./DigitalMultimeterProbeJacks";
import {
  getMultimeterMode,
  getSuggestedDisplayValue,
  validateMultimeterLeadSetup,
} from "./multimeterModes";
import type { MultimeterDialStopId } from "./DigitalMultimeterRotaryDial";
import { multimeterDialStopsClockwise } from "./DigitalMultimeterRotaryDial";

type UseMultimeterDialOptions = {
  initialBlackLeadJack?: MultimeterJackId;
  initialDialStopId?: MultimeterDialStopId;
  initialRedLeadJack?: MultimeterJackId;
};

export function useMultimeterDial({
  initialBlackLeadJack = "jack_com",
  initialDialStopId = "off",
  initialRedLeadJack = "jack_voma",
}: UseMultimeterDialOptions = {}) {
  const [selectedDialStopId, setSelectedDialStopId] =
    useState<MultimeterDialStopId>(initialDialStopId);
  const [redLeadJack, setRedLeadJack] =
    useState<MultimeterJackId>(initialRedLeadJack);
  const [blackLeadJack, setBlackLeadJack] =
    useState<MultimeterJackId>(initialBlackLeadJack);

  const selectedMode = useMemo(
    () => getMultimeterMode(selectedDialStopId),
    [selectedDialStopId],
  );

  const validation = useMemo(
    () =>
      validateMultimeterLeadSetup({
        blackLeadJack,
        dialStopId: selectedDialStopId,
        redLeadJack,
      }),
    [blackLeadJack, redLeadJack, selectedDialStopId],
  );

  const displayValue = useMemo(() => {
    if (!validation.isSetupCorrect) {
      if (validation.severity === "danger") return "Err";
      return "---";
    }

    return getSuggestedDisplayValue(selectedDialStopId);
  }, [selectedDialStopId, validation.isSetupCorrect, validation.severity]);

  function setDialStop(id: MultimeterDialStopId) {
    setSelectedDialStopId(id);
  }

  function moveDial(direction: "next" | "prev") {
    const currentIndex = multimeterDialStops.findIndex(
      (stop) => stop.id === selectedDialStopId,
    );

    if (currentIndex < 0) return;

    const delta = direction === "next" ? 1 : -1;
    const nextIndex =
      (currentIndex + delta + multimeterDialStopsClockwise.length) %
      multimeterDialStopsClockwise.length;

    setSelectedDialStopId(multimeterDialStopsClockwise[nextIndex].id);
  }

  function resetToSafeDefault() {
    setSelectedDialStopId("off");
    setRedLeadJack("jack_voma");
    setBlackLeadJack("jack_com");
  }

  function setLeadJack(lead: "red" | "black", jackId: MultimeterJackId) {
    if (lead === "red") {
      setRedLeadJack(jackId);
      return;
    }

    setBlackLeadJack(jackId);
  }

  return {
    blackLeadJack,
    displayValue,
    moveDial,
    redLeadJack,
    resetToSafeDefault,
    selectedDialStopId,
    selectedMode,
    setBlackLeadJack,
    setDialStop,
    setLeadJack,
    setRedLeadJack,
    validation,
  };
}
