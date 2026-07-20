"use client";

import type { ReactElement } from "react";

import { CarbonCompositionResistorVisual } from "./CarbonCompositionResistorVisual";
import { LightDependentResistorVisual } from "./LightDependentResistorVisual";
import { MetalFilmResistorVisual } from "./MetalFilmResistorVisual";
import { PotentiometerVisual } from "./PotentiometerVisual";
import { ThermistorVisual } from "./ThermistorVisual";
import type { ResistorTypeVisualProps } from "./types";
import { WireWoundResistorVisual } from "./WireWoundResistorVisual";

export const resistorTypeVisuals = {
  carbon: CarbonCompositionResistorVisual,
  metalFilm: MetalFilmResistorVisual,
  wireWound: WireWoundResistorVisual,
  potentiometer: PotentiometerVisual,
  thermistor: ThermistorVisual,
  ldr: LightDependentResistorVisual,
} satisfies Record<string, (props: ResistorTypeVisualProps) => ReactElement>;
