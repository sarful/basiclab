import type { ActiveDiode, DiodeProfile, DiodeType, WavePoint } from "./types";

export const FIXED_FREQUENCY_HZ = 50;

const MODEL = {
  ledForwardDropV: 2.0,
  ledSafeCurrentA: 0.02,
  ledWarningCurrentA: 0.03,
  ledBlowCurrentA: 0.045,
  samples: 360,
  cyclesShown: 2,
} as const;

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
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

function getLedStatus(peakCurrent: number) {
  if (peakCurrent > MODEL.ledBlowCurrentA) return "LED BLOWN RISK";
  if (peakCurrent > MODEL.ledWarningCurrentA) return "LED OVERCURRENT";
  if (peakCurrent > 0.001) return "LED GLOWING";
  return "LED OFF";
}

function getActiveDiode(vinTop: number, turnOnVoltage: number): ActiveDiode {
  if (Math.abs(vinTop) <= turnOnVoltage) return "none";
  return vinTop >= 0 ? "D1" : "D2";
}

export function getFullWaveState(
  acVoltage: number,
  loadOhm: number,
  diodeType: DiodeType,
  timeCursor: number,
) {
  const profile = diodeProfiles[diodeType];
  const safeVoltage = Math.max(0, acVoltage);
  const safeLoad = Math.max(1, loadOhm);
  const peak = safeVoltage * Math.SQRT2;
  const turnOnVoltage = profile.drop + MODEL.ledForwardDropV;

  const waveform: WavePoint[] = Array.from(
    { length: MODEL.samples },
    (_, index) => {
      const t = index / (MODEL.samples - 1);
      const phase = 2 * Math.PI * MODEL.cyclesShown * t;

      const vinTop = peak * Math.sin(phase);
      const vinBottom = -vinTop;
      const rectifiedVin = Math.abs(vinTop);

      const activeDiode = getActiveDiode(vinTop, turnOnVoltage);

      const conducting = activeDiode !== "none";
      const vout = conducting ? Math.max(0, rectifiedVin - profile.drop) : 0;

      const current = conducting
        ? Math.max(
            0,
            (rectifiedVin - profile.drop - MODEL.ledForwardDropV) / safeLoad,
          )
        : 0;

      const ledOn = current > 0.001;
      const ledBlown = current > MODEL.ledBlowCurrentA;
      const ledIntensity = ledOn
        ? clamp(current / MODEL.ledSafeCurrentA, 0.15, 1.6)
        : 0;

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
    },
  );

  const avg =
    waveform.reduce((sum, point) => sum + point.vout, 0) / MODEL.samples;

  const rms = Math.sqrt(
    waveform.reduce((sum, point) => sum + point.vout * point.vout, 0) /
      MODEL.samples,
  );

  const avgCurrent =
    waveform.reduce((sum, point) => sum + point.current, 0) / MODEL.samples;

  const peakCurrent = Math.max(...waveform.map((point) => point.current));

  const conductionPercent =
    (waveform.filter((point) => point.activeDiode !== "none").length /
      MODEL.samples) *
    100;

  const d1Percent =
    (waveform.filter((point) => point.activeDiode === "D1").length /
      MODEL.samples) *
    100;

  const d2Percent =
    (waveform.filter((point) => point.activeDiode === "D2").length /
      MODEL.samples) *
    100;

  const cursorIndex = Math.floor(
    clamp(timeCursor, 0, 0.999) * (MODEL.samples - 1),
  );

  const cursorPoint = waveform[cursorIndex];

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
    ledForwardDrop: MODEL.ledForwardDropV,
    ledSafeCurrentA: MODEL.ledSafeCurrentA,
    ledWarningCurrentA: MODEL.ledWarningCurrentA,
    ledBlowCurrentA: MODEL.ledBlowCurrentA,
    ledStatus: getLedStatus(peakCurrent),
    frequency: FIXED_FREQUENCY_HZ,
  };
}

export function runSimulationTests() {
  const standard = getFullWaveState(10, 1000, "standard", 0.1);
  const lowVoltage = getFullWaveState(0.3, 1000, "standard", 0.1);
  const highLoad = getFullWaveState(10, 5000, "standard", 0.1);
  const schottky = getFullWaveState(10, 1000, "schottky", 0.1);
  const blow = getFullWaveState(50, 50, "standard", 0.1);

  const tests = [
    {
      name: "Output never negative",
      pass: standard.waveform.every((point) => point.vout >= 0),
    },
    {
      name: "Average voltage positive",
      pass: standard.avg > 0,
    },
    {
      name: "Current positive",
      pass: standard.avgCurrent > 0,
    },
    {
      name: "Both diodes conduct in different half cycles",
      pass:
        standard.waveform.some((point) => point.activeDiode === "D1") &&
        standard.waveform.some((point) => point.activeDiode === "D2"),
    },
    {
      name: "Low voltage below drops produces zero output",
      pass: lowVoltage.avg < 0.1,
    },
    {
      name: "Higher load resistance lowers current",
      pass: highLoad.avgCurrent < standard.avgCurrent,
    },
    {
      name: "Schottky lower drop gives higher average output",
      pass: schottky.avg > standard.avg,
    },
    {
      name: "LED turns on when forward current flows",
      pass: standard.waveform.some((point) => point.ledOn),
    },
    {
      name: "LED blow risk appears at excessive current",
      pass: blow.waveform.some((point) => point.ledBlown),
    },
    {
      name: "D1 and D2 conduction are nearly balanced",
      pass: Math.abs(standard.d1Percent - standard.d2Percent) < 5,
    },
    {
      name: "Full-wave has high conduction percentage when voltage is enough",
      pass: standard.conductionPercent > 70,
    },
    {
      name: "Cursor point exists",
      pass: Boolean(standard.cursorPoint),
    },
    {
      name: "Fixed frequency is 50Hz",
      pass: standard.frequency === FIXED_FREQUENCY_HZ,
    },
  ];

  return {
    passed: tests.filter((test) => test.pass).length,
    failed: tests.filter((test) => !test.pass).length,
    tests,
  };
}
