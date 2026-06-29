"use client";

import { useMemo, useState } from "react";

import {
  formatResistance,
  getDigit,
  getMultiplier,
  getTemp,
  getTolerance,
} from "./logic";
import type { BandMode } from "./types";

export function useResistorColorCodeSimulation() {
  const [mode, setMode] = useState<BandMode>(4);
  const [band1, setBand1] = useState("Brown");
  const [band2, setBand2] = useState("Black");
  const [band3, setBand3] = useState("Red");
  const [multiplier, setMultiplier] = useState("Brown");
  const [tolerance, setTolerance] = useState("Gold");
  const [temp, setTemp] = useState("Brown");

  const d1 = getDigit(band1);
  const d2 = getDigit(band2);
  const d3 = getDigit(band3);
  const mult = getMultiplier(multiplier);
  const tol = getTolerance(tolerance);
  const tc = getTemp(temp);

  const significant =
    mode === 4 ? d1.value * 10 + d2.value : d1.value * 100 + d2.value * 10 + d3.value;
  const resistance = significant * mult.multiplier;
  const minResistance = resistance * (1 - tol.tolerance / 100);
  const maxResistance = resistance * (1 + tol.tolerance / 100);

  const bands = useMemo(() => {
    const base = [
      { label: "Band 1", color: d1.hex, name: d1.name, value: `Digit = ${d1.value}` },
      { label: "Band 2", color: d2.hex, name: d2.name, value: `Digit = ${d2.value}` },
    ];

    if (mode >= 5) {
      base.push({ label: "Band 3", color: d3.hex, name: d3.name, value: `Digit = ${d3.value}` });
    }

    base.push({
      label: mode === 4 ? "Band 3" : "Band 4",
      color: mult.hex,
      name: mult.name,
      value: `Multiplier = x${mult.multiplier}`,
    });
    base.push({
      label: mode === 4 ? "Band 4" : "Band 5",
      color: tol.hex,
      name: tol.name,
      value: `Tolerance = +/-${tol.tolerance}%`,
    });

    if (mode === 6) {
      base.push({
        label: "Band 6",
        color: tc.hex,
        name: tc.name,
        value: `Temp = ${tc.ppm} ppm/degC`,
      });
    }

    return base;
  }, [mode, d1, d2, d3, mult, tol, tc]);

  const formulaText =
    mode === 4
      ? `${d1.value}${d2.value} x ${mult.multiplier} = ${formatResistance(resistance)}`
      : `${d1.value}${d2.value}${d3.value} x ${mult.multiplier} = ${formatResistance(resistance)}`;

  function applyPreset(value: string) {
    if (value === "220") {
      setMode(4);
      setBand1("Red");
      setBand2("Red");
      setMultiplier("Brown");
      setTolerance("Gold");
    }
    if (value === "1k") {
      setMode(4);
      setBand1("Brown");
      setBand2("Black");
      setMultiplier("Red");
      setTolerance("Gold");
    }
    if (value === "10k") {
      setMode(4);
      setBand1("Brown");
      setBand2("Black");
      setMultiplier("Orange");
      setTolerance("Gold");
    }
    if (value === "precision") {
      setMode(5);
      setBand1("Brown");
      setBand2("Black");
      setBand3("Black");
      setMultiplier("Brown");
      setTolerance("Brown");
    }
  }

  return {
    mode,
    band1,
    band2,
    band3,
    multiplier,
    tolerance,
    temp,
    d1,
    tol,
    tc,
    resistance,
    minResistance,
    maxResistance,
    bands,
    formulaText,
    setMode,
    setBand1,
    setBand2,
    setBand3,
    setMultiplier,
    setTolerance,
    setTemp,
    applyPreset,
  };
}
