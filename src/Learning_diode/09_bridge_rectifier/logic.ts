import type { ActiveDiode, DiodeProfile, DiodeType, WavePoint } from "./types";

export const FIXED_FREQUENCY_HZ = 50;

export const diodeProfiles: Record<DiodeType, DiodeProfile> = {
  standard: {
    label: "Standard Silicon Diode",
    drop: 0.7,
    recoveryDeg: 14,
    leakageMA: 0.08,
    maxCurrentA: 1,
  },
  fast: {
    label: "Fast Recovery Diode",
    drop: 0.85,
    recoveryDeg: 5,
    leakageMA: 0.05,
    maxCurrentA: 1.5,
  },
  schottky: {
    label: "Schottky Diode",
    drop: 0.35,
    recoveryDeg: 0,
    leakageMA: 0.6,
    maxCurrentA: 2,
  },
};

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function getBridgeRectifierState(
  acVoltage: number,
  loadOhm: number,
  diodeType: DiodeType,
  timeCursor: number,
) {
  const profile = diodeProfiles[diodeType];
  const safeLoad = Math.max(1, loadOhm);
  const ledForwardDrop = 2.0;
  const ledSafeCurrentA = 0.02;
  const ledWarningCurrentA = 0.03;
  const ledBlowCurrentA = 0.045;
  const peak = acVoltage * Math.SQRT2;
  const samples = 360;
  const cyclesShown = 2;

  const waveform: WavePoint[] = Array.from({ length: samples }, (_, index) => {
    const t = index / (samples - 1);
    const phase = 2 * Math.PI * cyclesShown * t;
    const vinTop = peak * Math.sin(phase);
    const vinBottom = -vinTop;
    const rectifiedVin = Math.abs(vinTop);
    const activeDiode: ActiveDiode =
      Math.abs(vinTop) > 2 * profile.drop + ledForwardDrop
        ? vinTop >= 0
          ? "D1D4"
          : "D2D3"
        : "none";
    const vout = activeDiode === "none" ? 0 : rectifiedVin - 2 * profile.drop;
    const current =
      activeDiode === "none"
        ? 0
        : Math.max(0, (rectifiedVin - 2 * profile.drop - ledForwardDrop) / safeLoad);
    const ledOn = current > 0.001;
    const ledBlown = current > ledBlowCurrentA;
    const ledIntensity = ledOn ? clamp(current / ledSafeCurrentA, 0.15, 1.6) : 0;

    return {
      t,
      vinTop,
      vinBottom,
      rectifiedVin,
      vout,
      current,
      activeDiode,
      ledOn,
      ledBlown,
      ledIntensity,
    };
  });

  const avg = waveform.reduce((sum, point) => sum + point.vout, 0) / samples;
  const rms = Math.sqrt(
    waveform.reduce((sum, point) => sum + point.vout * point.vout, 0) / samples,
  );
  const avgCurrent = waveform.reduce((sum, point) => sum + point.current, 0) / samples;
  const peakCurrent = Math.max(...waveform.map((point) => point.current));
  const conductionPercent =
    (waveform.filter((point) => point.activeDiode !== "none").length / samples) * 100;
  const d1Percent =
    (waveform.filter((point) => point.activeDiode === "D1D4").length / samples) * 100;
  const d2Percent =
    (waveform.filter((point) => point.activeDiode === "D2D3").length / samples) * 100;
  const cursorIndex = Math.floor(clamp(timeCursor, 0, 0.999) * (samples - 1));
  const cursorPoint = waveform[cursorIndex];
  const ledStatus =
    peakCurrent > ledBlowCurrentA
      ? "LED BLOWN RISK"
      : peakCurrent > ledWarningCurrentA
        ? "LED OVERCURRENT"
        : peakCurrent > 0.001
          ? "LED GLOWING"
          : "LED OFF";

  return {
    waveform,
    peak,
    avg,
    rms,
    avgCurrent,
    peakCurrent,
    conductionPercent,
    d1Percent,
    d2Percent,
    cursorPoint,
    profile,
    ledForwardDrop,
    ledBlowCurrentA,
    ledStatus,
    frequency: FIXED_FREQUENCY_HZ,
  };
}

export function runSimulationTests() {
  const standard = getBridgeRectifierState(10, 1000, "standard", 0.1);
  const lowVoltage = getBridgeRectifierState(0.3, 1000, "standard", 0.1);
  const highLoad = getBridgeRectifierState(10, 5000, "standard", 0.1);
  const schottky = getBridgeRectifierState(10, 1000, "schottky", 0.1);
  const blow = getBridgeRectifierState(50, 50, "standard", 0.1);

  const tests = [
    { name: "Output never negative", pass: standard.waveform.every((point) => point.vout >= 0) },
    { name: "Average voltage positive", pass: standard.avg > 0 },
    { name: "Current positive", pass: standard.avgCurrent > 0 },
    {
      name: "Both bridge diode pairs conduct in different half cycles",
      pass:
        standard.waveform.some((point) => point.activeDiode === "D1D4") &&
        standard.waveform.some((point) => point.activeDiode === "D2D3"),
    },
    { name: "Low voltage below drops produces zero output", pass: lowVoltage.avg < 0.1 },
    { name: "Higher load resistance lowers current", pass: highLoad.avgCurrent < standard.avgCurrent },
    { name: "Schottky lower drop gives higher average output", pass: schottky.avg > standard.avg },
    { name: "LED turns on when forward current flows", pass: standard.waveform.some((point) => point.ledOn) },
    { name: "LED blow risk appears at excessive current", pass: blow.waveform.some((point) => point.ledBlown) },
    { name: "Full-wave conduction uses most positive half cycles", pass: standard.conductionPercent > 70 },
    { name: "Cursor point exists", pass: Boolean(standard.cursorPoint) },
    { name: "Fixed frequency is 50Hz", pass: standard.frequency === 50 },
  ];

  return {
    passed: tests.filter((test) => test.pass).length,
    failed: tests.filter((test) => !test.pass).length,
    tests,
  };
}
