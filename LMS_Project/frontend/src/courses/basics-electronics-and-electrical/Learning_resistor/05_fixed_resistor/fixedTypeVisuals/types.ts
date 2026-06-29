"use client";

import type { FixedType } from "../types";

export type FixedTypeVisualProps = {
  type: FixedType;
  resistance: number;
  tolerance: number;
  powerRating: number;
  voltage: number;
  heatLevel: number;
};
