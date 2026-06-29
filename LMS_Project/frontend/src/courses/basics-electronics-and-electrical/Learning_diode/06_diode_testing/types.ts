export type DisplayMode = "digital" | "analog";
export type MeterMode = "diode" | "continuity" | "resistance" | "off";
export type DiodeType = "good" | "short" | "open";
export type Terminal = "free" | "anode" | "cathode";

export type ReadingInput = {
  connected: boolean;
  meterMode: MeterMode;
  diodeType: DiodeType;
  forward: boolean;
};
