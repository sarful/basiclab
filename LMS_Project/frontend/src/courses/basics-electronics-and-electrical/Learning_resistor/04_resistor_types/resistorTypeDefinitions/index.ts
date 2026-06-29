"use client";

import { carbonCompositionResistor } from "./CarbonCompositionResistor";
import { lightDependentResistor } from "./LightDependentResistor";
import { metalFilmResistor } from "./MetalFilmResistor";
import { potentiometerResistor } from "./Potentiometer";
import { thermistorResistor } from "./Thermistor";
import { wireWoundResistor } from "./WireWoundResistor";

export const resistorTypes = [
  carbonCompositionResistor,
  metalFilmResistor,
  wireWoundResistor,
  potentiometerResistor,
  thermistorResistor,
  lightDependentResistor,
];
