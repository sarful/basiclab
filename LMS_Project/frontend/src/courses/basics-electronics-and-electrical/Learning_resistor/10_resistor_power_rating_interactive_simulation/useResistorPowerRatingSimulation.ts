"use client";

import { useState } from "react";

import { getStatus, packages, recommendedPackage } from "./logic";

export function useResistorPowerRatingSimulation() {
  const [voltage, setVoltage] = useState(5);
  const [resistance, setResistance] = useState(220);
  const [rating, setRating] = useState(0.25);

  const selectedPackage = packages.find((item) => item.watt === rating) || packages[1];
  const current = voltage / resistance;
  const power = voltage * current;
  const powerByI2R = current * current * resistance;
  const powerByV2R = (voltage * voltage) / resistance;
  const status = getStatus(power, rating);
  const recommended = recommendedPackage(power);
  const safetyMargin = rating / Math.max(power, 0.000001);

  return {
    voltage,
    resistance,
    rating,
    selectedPackage,
    current,
    power,
    powerByI2R,
    powerByV2R,
    status,
    recommended,
    safetyMargin,
    setVoltage,
    setResistance,
    setRating,
  };
}
