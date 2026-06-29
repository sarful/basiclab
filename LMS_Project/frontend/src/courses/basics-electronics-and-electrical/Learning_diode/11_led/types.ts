export type LedState = {
  isOn: boolean;
  isOverVoltage: boolean;
  isDangerVoltage: boolean;
  isDamaged: boolean;
  hasResistor: boolean;
  intensity: number;
  currentMA: number;
  safeVoltageLimit: number;
  dangerVoltageLimit: number;
  status: string;
  lightLevel: string;
};
