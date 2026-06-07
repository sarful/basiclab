export type CodeOption = {
  code: string;
  label: string;
};

export type DielectricOption = {
  name: string;
  stability: number;
  tempDrift: number;
  color: string;
  note: string;
};

export type CeramicSnapshot = {
  capacitancePf: number;
  voltageStress: number;
  safePercent: number;
  stabilityPercent: number;
  filterEffect: number;
  reactanceOhm: number;
};
