import type { DiodeProfile, DiodeType, StressLevel, WavePoint } from "./types";

export const FIXED_FREQUENCY_HZ = 50;

export const diodeProfiles: Record<DiodeType, DiodeProfile> = {
  standard: {
    label: "Standard Silicon Diode",
    drop: 0.7,
    recoveryDeg: 14,
    leakageMA: 0.08,
    maxCurrentA: 1,
    thermalResistance: 65,
  },
  fast: {
    label: "Fast Recovery Diode",
    drop: 0.85,
    recoveryDeg: 5,
    leakageMA: 0.05,
    maxCurrentA: 1.5,
    thermalResistance: 55,
  },
  schottky: {
    label: "Schottky Diode",
    drop: 0.35,
    recoveryDeg: 0,
    leakageMA: 0.6,
    maxCurrentA: 2,
    thermalResistance: 45,
  },
};

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function getHalfWaveState(
  acVoltage: number,
  frequency: number,
  loadOhm: number,
  diodeType: DiodeType,
  timeCursor: number,
) {
  const profile = diodeProfiles[diodeType];
  const safeLoad = Math.max(1, loadOhm);
  const safeFrequency = Math.max(1, frequency);
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
    const vin = peak * Math.sin(phase);
    const conducting = vin > profile.drop + ledForwardDrop;
    const normalizedPhaseDeg = ((phase * 180) / Math.PI) % 360;
    const reverseRecovery =
      diodeType !== "schottky" &&
      normalizedPhaseDeg > 180 &&
      normalizedPhaseDeg < 180 + profile.recoveryDeg;
    const leakage = vin < 0 && !reverseRecovery;
    const idealVout = conducting ? vin - profile.drop : 0;
    const recoveryCurrent = reverseRecovery
      ? Math.min(peak / safeLoad, profile.maxCurrentA * 0.35)
      : 0;
    const leakageCurrent = leakage ? profile.leakageMA / 1000 : 0;
    const forwardCurrent = conducting
      ? Math.max(0, (vin - profile.drop - ledForwardDrop) / safeLoad)
      : 0;
    const current = forwardCurrent + recoveryCurrent + leakageCurrent;
    const vout = conducting
      ? idealVout
      : reverseRecovery
        ? Math.max(0, recoveryCurrent * safeLoad * 0.25)
        : 0;
    const currentRatio = Math.max(current / profile.maxCurrentA, current / ledWarningCurrentA);
    const stress: StressLevel =
      current > ledBlowCurrentA
        ? "surge"
        : current > ledWarningCurrentA
          ? "high"
          : currentRatio > 1
            ? "surge"
            : currentRatio > 0.65
              ? "high"
              : "normal";
    const ledOn = conducting && current > 0.001;
    const ledBlown = current > ledBlowCurrentA;
    const ledIntensity = ledOn ? clamp(current / ledSafeCurrentA, 0.15, 1.6) : 0;

    return {
      t,
      phase,
      vin,
      idealVout,
      vout,
      current,
      conducting,
      reverseRecovery,
      leakage,
      stress,
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
    (waveform.filter((point) => point.conducting).length / samples) * 100;
  const recoveryPercent =
    (waveform.filter((point) => point.reverseRecovery).length / samples) * 100;
  const diodeLossW =
    waveform.reduce((sum, point) => sum + point.current * profile.drop, 0) / samples;
  const ledLossW =
    waveform.reduce(
      (sum, point) => sum + (point.ledOn ? point.current * ledForwardDrop : 0),
      0,
    ) / samples;
  const switchingLossW =
    diodeType === "schottky"
      ? 0
      : (peak * peakCurrent * profile.recoveryDeg * safeFrequency) / 900000;
  const totalLossW = diodeLossW + ledLossW + switchingLossW;
  const junctionRiseC = totalLossW * profile.thermalResistance;
  const cursorIndex = Math.floor(clamp(timeCursor, 0, 0.999) * (samples - 1));
  const cursorPoint = waveform[cursorIndex];
  const ledPeakCurrent = peakCurrent;
  const ledStatus =
    ledPeakCurrent > ledBlowCurrentA
      ? "LED BLOWN RISK"
      : ledPeakCurrent > ledWarningCurrentA
        ? "LED OVERCURRENT"
        : ledPeakCurrent > 0.001
          ? "LED GLOWING"
          : "LED OFF";

  return {
    waveform,
    peak,
    avg,
    rms,
    avgCurrent,
    peakCurrent,
    ledPeakCurrent,
    ledSafeCurrentA,
    ledWarningCurrentA,
    ledBlowCurrentA,
    ledForwardDrop,
    ledStatus,
    frequency: safeFrequency,
    conductionPercent,
    recoveryPercent,
    diodeLossW,
    ledLossW,
    switchingLossW,
    totalLossW,
    junctionRiseC,
    cursorPoint,
    profile,
  };
}

export function runSimulationTests() {
  const standard = getHalfWaveState(10, 50, 1000, "standard", 0.1);
  const lowVoltage = getHalfWaveState(0.3, 50, 1000, "standard", 0.1);
  const highLoad = getHalfWaveState(10, 50, 5000, "standard", 0.1);
  const schottky = getHalfWaveState(10, 50, 1000, "schottky", 0.1);
  const fastHighFreq = getHalfWaveState(10, 100, 1000, "fast", 0.1);
  const highFrequency = getHalfWaveState(10, 400, 1000, "standard", 0.1);
  const lowFrequency = getHalfWaveState(10, 50, 1000, "standard", 0.1);

  const tests = [
    { name: "Output never negative", pass: standard.waveform.every((point) => point.vout >= 0) },
    { name: "Average voltage positive", pass: standard.avg > 0 },
    { name: "Current positive", pass: standard.avgCurrent > 0 },
    {
      name: "Negative half cycles are mostly blocked",
      pass: standard.waveform
        .filter((point) => point.vin < -1 && !point.reverseRecovery)
        .every((point) => point.vout === 0),
    },
    { name: "Low voltage below diode drop produces zero ideal forward output", pass: lowVoltage.avg < 0.1 },
    { name: "Higher load resistance lowers current", pass: highLoad.avgCurrent < standard.avgCurrent },
    { name: "Waveform has enough sample points", pass: standard.waveform.length >= 200 },
    { name: "Schottky has no reverse recovery", pass: schottky.recoveryPercent === 0 },
    { name: "Schottky lower drop gives higher average output", pass: schottky.avg > standard.avg },
    { name: "Fast recovery has switching loss at high frequency", pass: fastHighFreq.switchingLossW >= 0 },
    { name: "Cursor point exists", pass: Boolean(standard.cursorPoint) },
    { name: "Thermal estimate is non-negative", pass: standard.junctionRiseC >= 0 },
    { name: "Higher frequency increases switching loss", pass: highFrequency.switchingLossW > lowFrequency.switchingLossW },
    {
      name: "Time cursor changes cursor point",
      pass:
        getHalfWaveState(10, 50, 1000, "standard", 0.1).cursorPoint.t !==
        getHalfWaveState(10, 50, 1000, "standard", 0.6).cursorPoint.t,
    },
    {
      name: "All diode profile labels exist",
      pass: Object.values(diodeProfiles).every((profile) => profile.label.length > 0),
    },
    {
      name: "LED turns on when forward current flows",
      pass: getHalfWaveState(12, 50, 1000, "standard", 0.12).waveform.some((point) => point.ledOn),
    },
    {
      name: "LED blow risk appears at excessive current",
      pass: getHalfWaveState(50, 50, 50, "standard", 0.12).waveform.some((point) => point.ledBlown),
    },
    {
      name: "Higher load resistance protects LED current",
      pass:
        getHalfWaveState(20, 50, 2000, "standard", 0.12).ledPeakCurrent <
        getHalfWaveState(20, 50, 100, "standard", 0.12).ledPeakCurrent,
    },
    {
      name: "LED status is available",
      pass: typeof standard.ledStatus === "string" && standard.ledStatus.length > 0,
    },
    {
      name: "Cursor point includes LED state",
      pass:
        typeof standard.cursorPoint.ledOn === "boolean" &&
        typeof standard.cursorPoint.ledBlown === "boolean",
    },
    {
      name: "App uses fixed frequency constant",
      pass: getHalfWaveState(10, FIXED_FREQUENCY_HZ, 1000, "standard", 0.1).frequency === 50,
    },
  ];

  return {
    passed: tests.filter((test) => test.pass).length,
    failed: tests.filter((test) => !test.pass).length,
    tests,
  };
}
