export type FuseRating = "0.5A" | "1A" | "2A" | "5A";
export type FuseState = "GOOD" | "BLOWN";

export type SimulationResult = {
  currentA: number;
  fuseLimitA: number;
  overloadPercent: number;
  shouldBlow: boolean;
  loadPowerW: number;
  statusText: string;
};

export type SimulationTest = {
  name: string;
  input: {
    supplyVoltage: number;
    loadResistance: number;
    fuseRating: FuseRating;
    fuseState: FuseState;
  };
  expectedShouldBlow?: boolean;
  expectedCurrentA?: number;
};
