"use client";

import { CarbonFixedResistorVisual } from "./CarbonFixedResistorVisual";
import { MetalFilmFixedResistorVisual } from "./MetalFilmFixedResistorVisual";
import type { FixedTypeVisualProps } from "./types";
import { WireWoundFixedResistorVisual } from "./WireWoundFixedResistorVisual";

export const fixedTypeVisuals = {
  carbon: CarbonFixedResistorVisual,
  metalFilm: MetalFilmFixedResistorVisual,
  wireWound: WireWoundFixedResistorVisual,
} satisfies Record<string, (props: FixedTypeVisualProps) => JSX.Element>;
