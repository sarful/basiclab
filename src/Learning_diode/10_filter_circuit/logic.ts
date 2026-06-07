import type { ActiveDiode, DiodeProfile, DiodeType, WavePoint } from "./types";

export const FIXED_FREQUENCY_HZ = 50;

export const diodeProfiles: Record<DiodeType, DiodeProfile> = {
  standard: { label: "Standard Silicon Diode", drop: 0.7, recoveryDeg: 14, leakageMA: 0.08, maxCurrentA: 1 },
  fast: { label: "Fast Recovery Diode", drop: 0.85, recoveryDeg: 5, leakageMA: 0.05, maxCurrentA: 1.5 },
  schottky: { label: "Schottky Diode", drop: 0.35, recoveryDeg: 0, leakageMA: 0.6, maxCurrentA: 2 },
};

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function getFilterCircuitState(
  acVoltage: number,
  loadOhm: number,
  diodeType: DiodeType,
  timeCursor: number,
  filterEnabled: boolean,
  capacitorUf: number,
) {
  const profile = diodeProfiles[diodeType];
  const safeLoad = Math.max(1, loadOhm);
  const ledSafeCurrentA = 0.02;
  const ledWarningCurrentA = 0.03;
  const ledBlowCurrentA = 0.045;
  const peak = acVoltage * Math.SQRT2;
  const samples = 720;
  const cyclesShown = 2;
  const totalTimeSeconds = cyclesShown / FIXED_FREQUENCY_HZ;
  const dt = totalTimeSeconds / samples;
  const capacitorF = Math.max(1e-9, capacitorUf / 1_000_000);
  let capacitorVoltage = 0;

  const waveform: WavePoint[] = Array.from({ length: samples }, (_, index) => {
    const t = index / (samples - 1);
    const phase = 2 * Math.PI * cyclesShown * t;
    const vinTop = peak * Math.sin(phase);
    const vinBottom = -vinTop;
    const rectifiedVin = Math.abs(vinTop);
    const rawAvailableVout = Math.max(0, rectifiedVin - profile.drop);

    let activeDiode: ActiveDiode = "none";
    let vout = 0;
    let filteredVout = 0;
    let current = 0;
    let filteredCurrent = 0;
    let diodeCurrent = 0;
    let capacitorCurrent = 0;
    let capacitorCharging = false;

    if (!filterEnabled) {
      const canConduct = rectifiedVin > profile.drop;
      activeDiode = canConduct ? (vinTop >= 0 ? "D1" : "D2") : "none";
      vout = canConduct ? rawAvailableVout : 0;
      filteredVout = vout;
      current = canConduct ? Math.max(0, vout / safeLoad) : 0;
      filteredCurrent = current;
      diodeCurrent = current;
      capacitorVoltage = 0;
    } else {
      const diodeCanChargeCap = rawAvailableVout > capacitorVoltage * 0.995;

      if (diodeCanChargeCap) {
        activeDiode = vinTop >= 0 ? "D1" : "D2";
        vout = rawAvailableVout;
        filteredVout = rawAvailableVout;
        capacitorCurrent = ((rawAvailableVout - capacitorVoltage) * capacitorF) / dt;
        filteredCurrent = Math.max(0, filteredVout / safeLoad);
        diodeCurrent = filteredCurrent + Math.max(0, capacitorCurrent);
        capacitorVoltage = rawAvailableVout;
        capacitorCharging = capacitorCurrent > 0.0001;
      } else {
        activeDiode = "none";
        vout = rawAvailableVout;
        filteredCurrent = Math.max(0, capacitorVoltage / safeLoad);
        capacitorCurrent = -filteredCurrent;
        capacitorVoltage = Math.max(0, capacitorVoltage - (filteredCurrent / capacitorF) * dt);
        filteredVout = capacitorVoltage;
        diodeCurrent = 0;
      }

      current = diodeCurrent;
    }

    const ledOn = filteredCurrent > 0.001;
    const ledBlown = filteredCurrent > ledBlowCurrentA;
    const ledIntensity = ledOn ? clamp(filteredCurrent / ledSafeCurrentA, 0.15, 1.6) : 0;

    return {
      t,
      vinTop,
      vinBottom,
      rectifiedVin,
      vout,
      filteredVout,
      current,
      filteredCurrent,
      diodeCurrent,
      capacitorCurrent,
      activeDiode,
      ledOn,
      ledBlown,
      ledIntensity,
      capacitorCharging,
    };
  });

  const avg = waveform.reduce((sum, point) => sum + point.filteredVout, 0) / samples;
  const rms = Math.sqrt(
    waveform.reduce((sum, point) => sum + point.filteredVout * point.filteredVout, 0) / samples,
  );
  const avgCurrent = waveform.reduce((sum, point) => sum + point.filteredCurrent, 0) / samples;
  const peakCurrent = Math.max(...waveform.map((point) => point.filteredCurrent));
  const peakDiodeCurrent = Math.max(...waveform.map((point) => point.diodeCurrent));
  const rawRipple =
    Math.max(...waveform.map((point) => point.vout)) - Math.min(...waveform.map((point) => point.vout));
  const filterRipple =
    Math.max(...waveform.map((point) => point.filteredVout)) -
    Math.min(...waveform.map((point) => point.filteredVout));
  const conductionPercent =
    (waveform.filter((point) => point.activeDiode !== "none").length / samples) * 100;
  const d1Percent =
    (waveform.filter((point) => point.activeDiode === "D1").length / samples) * 100;
  const d2Percent =
    (waveform.filter((point) => point.activeDiode === "D2").length / samples) * 100;
  const capacitorChargePercent =
    (waveform.filter((point) => point.capacitorCharging).length / samples) * 100;
  const cursorIndex = Math.floor(clamp(timeCursor, 0, 0.999) * (samples - 1));
  const cursorPoint = waveform[cursorIndex];
  const ledStatus =
    peakCurrent > ledBlowCurrentA
      ? "LED OVERCURRENT RISK"
      : peakCurrent > ledWarningCurrentA
        ? "LED HIGH CURRENT"
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
    peakDiodeCurrent,
    rawRipple,
    filterRipple,
    conductionPercent,
    d1Percent,
    d2Percent,
    capacitorChargePercent,
    cursorPoint,
    profile,
    ledBlowCurrentA,
    ledStatus,
    frequency: FIXED_FREQUENCY_HZ,
    filterEnabled,
    capacitorUf,
  };
}

export function runSimulationTests() {
  const standard = getFilterCircuitState(10, 1000, "standard", 0.1, false, 470);
  const filtered = getFilterCircuitState(10, 1000, "standard", 0.1, true, 1000);
  const lowVoltage = getFilterCircuitState(0.3, 1000, "standard", 0.1, false, 470);
  const highLoad = getFilterCircuitState(10, 5000, "standard", 0.1, false, 470);
  const schottky = getFilterCircuitState(10, 1000, "schottky", 0.1, false, 470);
  const highCurrent = getFilterCircuitState(50, 50, "standard", 0.1, false, 470);

  const tests = [
    { name: "Output never negative", pass: standard.waveform.every((point) => point.vout >= 0 && point.filteredVout >= 0) },
    { name: "Average voltage positive", pass: standard.avg > 0 },
    { name: "Current positive", pass: standard.avgCurrent > 0 },
    {
      name: "Both diodes conduct in different half cycles",
      pass:
        standard.waveform.some((point) => point.activeDiode === "D1") &&
        standard.waveform.some((point) => point.activeDiode === "D2"),
    },
    { name: "Low voltage below drops produces zero output", pass: lowVoltage.avg < 0.1 },
    { name: "Higher load resistance lowers current", pass: highLoad.avgCurrent < standard.avgCurrent },
    { name: "Schottky lower drop gives higher average output", pass: schottky.avg > standard.avg },
    { name: "Load current flows when output voltage exists", pass: standard.waveform.some((point) => point.filteredCurrent > 0) },
    { name: "High current risk appears at excessive current", pass: highCurrent.peakCurrent > highCurrent.ledBlowCurrentA },
    { name: "Full-wave conduction uses most positive half cycles", pass: standard.conductionPercent > 70 },
    { name: "Filter capacitor increases average output", pass: filtered.avg > standard.avg },
    { name: "Filter capacitor charges during peaks", pass: filtered.waveform.some((point) => point.capacitorCharging) },
    { name: "Filtered diode conduction is pulsed", pass: filtered.conductionPercent < standard.conductionPercent },
    { name: "RL current follows Ohm law", pass: Math.abs(standard.avgCurrent - standard.avg / 1000) < 0.002 },
    { name: "LED visualization turns on when load current exists", pass: standard.waveform.some((point) => point.ledOn) },
    { name: "Capacitor ripple is non-negative", pass: filtered.filterRipple >= 0 },
    { name: "Peak diode current is not below load peak current", pass: filtered.peakDiodeCurrent >= filtered.peakCurrent },
    { name: "Cursor point exists", pass: Boolean(standard.cursorPoint) },
    { name: "Fixed frequency is 50Hz", pass: standard.frequency === 50 },
  ];

  return {
    passed: tests.filter((test) => test.pass).length,
    failed: tests.filter((test) => !test.pass).length,
    tests,
  };
}
