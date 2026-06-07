import type { PhotodiodeState } from "./types";

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function luxToIrradiance(lux: number) {
  return clamp(lux, 0, 100000) / 120;
}

export function getPhotodiodeState(
  lux: number,
  reverseVoltage: number,
  loadKOhm: number,
  responsivityAW: number,
  activeAreaMM2: number,
  isReverseBias: boolean,
): PhotodiodeState {
  const safeLux = clamp(lux, 0, 100000);
  const safeReverseVoltage = clamp(reverseVoltage, 0, 30);
  const safeLoadKOhm = clamp(loadKOhm, 1, 1000);
  const safeResponsivityAW = clamp(responsivityAW, 0.05, 0.8);
  const safeAreaMM2 = clamp(activeAreaMM2, 0.1, 20);

  const irradianceWM2 = luxToIrradiance(safeLux);
  const opticalPowerW = irradianceWM2 * (safeAreaMM2 * 1e-6);
  const rawPhotocurrentA = opticalPowerW * safeResponsivityAW;
  const biasGain = isReverseBias ? clamp(0.25 + safeReverseVoltage / 5, 0.25, 1.35) : 0.03;
  const saturationCurrentUA = isReverseBias ? 120 : 2;
  const photocurrentUA = clamp(rawPhotocurrentA * 1e6 * biasGain, 0, saturationCurrentUA);
  const darkCurrentUA = isReverseBias
    ? clamp(0.08 + safeReverseVoltage * 0.035, 0.08, 1.2)
    : 0.01;
  const totalCurrentUA = darkCurrentUA + photocurrentUA;
  const outputVoltage = clamp((totalCurrentUA * 1e-6) * (safeLoadKOhm * 1000), 0, 12);
  const hasLight = safeLux > 0;
  const isActive = isReverseBias && hasLight;
  const normalizedLight = clamp(safeLux / 10000, 0, 1);

  let lightLabel = "Dark";
  if (safeLux >= 50000) lightLabel = "Direct sunlight / very bright";
  else if (safeLux >= 10000) lightLabel = "Daylight";
  else if (safeLux >= 1000) lightLabel = "Bright indoor";
  else if (safeLux >= 100) lightLabel = "Room light";
  else if (safeLux > 0) lightLabel = "Dim light";

  return {
    lux: safeLux,
    reverseVoltage: safeReverseVoltage,
    loadKOhm: safeLoadKOhm,
    responsivityAW: safeResponsivityAW,
    activeAreaMM2: safeAreaMM2,
    hasLight,
    isActive,
    isReverseBias,
    normalizedLight,
    irradianceWM2,
    opticalPowerUW: opticalPowerW * 1e6,
    darkCurrentUA,
    photocurrentUA,
    totalCurrentUA,
    outputVoltage,
    saturationCurrentUA,
    lightLabel,
    status: !isReverseBias
      ? "FORWARD MODE: NOT SENSOR MODE"
      : hasLight
        ? "LIGHT DETECTED"
        : "DARK / DARK CURRENT ONLY",
    outputLevel: `${Math.round(clamp(outputVoltage / 5, 0, 1) * 100)}%`,
  };
}

export function getGraphPoints(
  reverseVoltage: number,
  loadKOhm: number,
  responsivityAW: number,
  activeAreaMM2: number,
  isReverseBias: boolean,
) {
  const luxSamples = [0, 50, 100, 300, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000];
  return luxSamples.map((lux) =>
    getPhotodiodeState(
      lux,
      reverseVoltage,
      loadKOhm,
      responsivityAW,
      activeAreaMM2,
      isReverseBias,
    ),
  );
}

export function runSimulationTests() {
  const args: [number, number, number, number, number, boolean] = [1000, 5, 100, 0.45, 7.5, true];
  const tests = [
    { name: "No light gives no photocurrent", pass: getPhotodiodeState(0, 5, 100, 0.45, 7.5, true).photocurrentUA === 0 },
    { name: "Light creates photocurrent in reverse bias", pass: getPhotodiodeState(...args).photocurrentUA > 0 },
    { name: "Forward mode is not sensor mode", pass: getPhotodiodeState(1000, 5, 100, 0.45, 7.5, false).isActive === false },
    { name: "Reverse bias with light is active", pass: getPhotodiodeState(...args).isActive === true },
    { name: "Lux is clamped at high values", pass: getPhotodiodeState(150000, 5, 100, 0.45, 7.5, true).lux === 100000 },
    { name: "Dark current exists in reverse bias", pass: getPhotodiodeState(0, 5, 100, 0.45, 7.5, true).darkCurrentUA > 0 },
    { name: "Total current includes dark current", pass: getPhotodiodeState(0, 5, 100, 0.45, 7.5, true).totalCurrentUA === getPhotodiodeState(0, 5, 100, 0.45, 7.5, true).darkCurrentUA },
    { name: "Higher lux increases photocurrent", pass: getPhotodiodeState(5000, 5, 100, 0.45, 7.5, true).photocurrentUA > getPhotodiodeState(500, 5, 100, 0.45, 7.5, true).photocurrentUA },
    { name: "Higher load increases output voltage", pass: getPhotodiodeState(1000, 5, 200, 0.45, 7.5, true).outputVoltage > getPhotodiodeState(1000, 5, 50, 0.45, 7.5, true).outputVoltage },
    { name: "Photocurrent saturates", pass: getPhotodiodeState(100000, 30, 100, 0.8, 20, true).photocurrentUA <= getPhotodiodeState(100000, 30, 100, 0.8, 20, true).saturationCurrentUA },
    { name: "Graph has multiple points", pass: getGraphPoints(5, 100, 0.45, 7.5, true).length >= 10 },
  ];

  return {
    passed: tests.filter((test) => test.pass).length,
    failed: tests.filter((test) => !test.pass).length,
    tests,
  };
}
