export type TransistorLevel =
  | "OFF"
  | "CUT-OFF"
  | "WEAK ACTIVE"
  | "ACTIVE"
  | "SATURATION";

export type CalculationTestCase = {
  name: string;
  switchOn: boolean;
  voltage: number;
  resistance: number;
  gain: number;
  load: number;
  expectedBaseCurrent?: number;
  minimumBiasCurrent?: number;
  expectedTransistorOn?: boolean;
  expectedMaxCollectorCurrent?: number;
  expectedLevel?: TransistorLevel;
};
