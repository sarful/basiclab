"use client";

import { useState } from "react";

import type { LayerView, ProbeTarget } from "./types";

export function useDiodeConstructionSimulation() {
  const [view, setView] = useState<LayerView>("formation");
  const [showLabels, setShowLabels] = useState(true);
  const [showCarriers, setShowCarriers] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [showProbeTargets, setShowProbeTargets] = useState(true);
  const [selectedProbe, setSelectedProbe] = useState<ProbeTarget>("pn-junction");

  const reset = () => {
    setView("formation");
    setShowLabels(true);
    setShowCarriers(true);
    setAnimationSpeed(1);
    setShowProbeTargets(true);
    setSelectedProbe("pn-junction");
  };

  return {
    animationSpeed,
    reset,
    selectedProbe,
    setAnimationSpeed,
    setSelectedProbe,
    setShowCarriers,
    setShowLabels,
    setShowProbeTargets,
    showCarriers,
    showLabels,
    showProbeTargets,
    view,
    setView,
  };
}
