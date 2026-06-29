export type DiodeType = "standard" | "fast" | "schottky";
export type ActiveDiode = "D1" | "D2" | "none";

export type DiodeProfile = {
  label: string;
  drop: number;
  recoveryDeg: number;
  leakageMA: number;
  maxCurrentA: number;
};

export type WavePoint = {
  t: number;
  vinTop: number;
  vinBottom: number;
  rectifiedVin: number;
  vout: number;
  filteredVout: number;
  current: number;
  filteredCurrent: number;
  diodeCurrent: number;
  capacitorCurrent: number;
  activeDiode: ActiveDiode;
  ledOn: boolean;
  ledBlown: boolean;
  ledIntensity: number;
  capacitorCharging: boolean;
};
