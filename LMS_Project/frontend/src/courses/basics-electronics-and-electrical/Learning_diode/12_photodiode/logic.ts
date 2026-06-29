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
  const rawPhotocurrentUA = opticalPowerW * safeResponsivityAW * 1e6;
  const loadOhm = safeLoadKOhm * 1000;
  const hasLight = safeLux > 0;
  const normalizedLight = clamp(safeLux / 10000, 0, 1);

  const modeState = isReverseBias
    ? (() => {
    const collectionFactor = clamp(0.78 + safeReverseVoltage / 26, 0.78, 1.35);
    const maxSensorCurrentUA = Math.max((safeReverseVoltage / loadOhm) * 1e6, 0.2);
    const darkCurrentUA = clamp(0.05 + safeReverseVoltage * 0.03, 0.05, 1.2);
    const photocurrentUA = clamp(
      rawPhotocurrentUA * collectionFactor,
      0,
      Math.max(maxSensorCurrentUA * 0.94, 0.18),
    );
    const totalCurrentUA = darkCurrentUA + photocurrentUA;
    const loadCurrentUA = totalCurrentUA;
    const outputVoltage = clamp(loadCurrentUA * 1e-6 * loadOhm, 0, safeReverseVoltage * 0.96);
    const photodiodeVoltage = clamp(safeReverseVoltage - outputVoltage, 0, safeReverseVoltage);
    const forwardDropVoltage = 0;
    const saturationCurrentUA = Math.max(maxSensorCurrentUA, totalCurrentUA, 0.2);
    const isActive = hasLight && photocurrentUA > darkCurrentUA;
    const status = hasLight
      ? "REVERSE BIAS: LIGHT SENSING ACTIVE"
      : "REVERSE BIAS: DARK CURRENT ONLY";
    const conductionLabel = hasLight ? "Photocurrent flowing" : "Dark current only";
    const biasDescription = "Reverse-biased sensor";

    return {
      photocurrentUA,
      darkCurrentUA,
      totalCurrentUA,
      loadCurrentUA,
      outputVoltage,
      photodiodeVoltage,
      forwardDropVoltage,
      saturationCurrentUA,
      isActive,
      status,
      conductionLabel,
      biasDescription,
    };
  })()
    : (() => {
    const forwardDropVoltage = clamp(0.58 + (1 - normalizedLight) * 0.1, 0.58, 0.68);
    const baseForwardCurrentUA =
      safeReverseVoltage > forwardDropVoltage
        ? ((safeReverseVoltage - forwardDropVoltage) / loadOhm) * 1e6
        : 0;
    const lightAssistUA = hasLight ? clamp(rawPhotocurrentUA * 0.12, 0, 60) : 0;
    const darkCurrentUA = 0.01;
    const photocurrentUA = lightAssistUA;
    const totalCurrentUA = baseForwardCurrentUA + lightAssistUA + darkCurrentUA;
    const loadCurrentUA = totalCurrentUA;
    const outputVoltage = clamp(loadCurrentUA * 1e-6 * loadOhm, 0, safeReverseVoltage);
    const photodiodeVoltage = totalCurrentUA > 0 ? forwardDropVoltage : safeReverseVoltage;
    const saturationCurrentUA = Math.max(((Math.max(safeReverseVoltage, 0.1)) / loadOhm) * 1e6, totalCurrentUA, 1);
    const isActive = totalCurrentUA > 0.02;
    const status = totalCurrentUA > 0
      ? "FORWARD BIAS: DIODE CONDUCTING"
      : "FORWARD BIAS: BELOW THRESHOLD";
    const conductionLabel = totalCurrentUA > 0 ? "Forward conduction" : "No forward conduction";
    const biasDescription = "Forward-biased junction";

    return {
      photocurrentUA,
      darkCurrentUA,
      totalCurrentUA,
      loadCurrentUA,
      outputVoltage,
      photodiodeVoltage,
      forwardDropVoltage,
      saturationCurrentUA,
      isActive,
      status,
      conductionLabel,
      biasDescription,
    };
  })();

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
    isActive: modeState.isActive,
    isReverseBias,
    normalizedLight,
    irradianceWM2,
    opticalPowerUW: opticalPowerW * 1e6,
    darkCurrentUA: modeState.darkCurrentUA,
    photocurrentUA: modeState.photocurrentUA,
    totalCurrentUA: modeState.totalCurrentUA,
    loadCurrentUA: modeState.loadCurrentUA,
    outputVoltage: modeState.outputVoltage,
    photodiodeVoltage: modeState.photodiodeVoltage,
    forwardDropVoltage: modeState.forwardDropVoltage,
    saturationCurrentUA: modeState.saturationCurrentUA,
    lightLabel,
    status: modeState.status,
    conductionLabel: modeState.conductionLabel,
    biasDescription: modeState.biasDescription,
    outputLevel: `${Math.round(clamp(modeState.outputVoltage / Math.max(safeReverseVoltage || 1, 1), 0, 1) * 100)}%`,
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
    { name: "Forward bias creates conduction when supply exceeds threshold", pass: getPhotodiodeState(1000, 5, 100, 0.45, 7.5, false).totalCurrentUA > 0 },
    { name: "Reverse bias with light is active", pass: getPhotodiodeState(...args).isActive === true },
    { name: "Lux is clamped at high values", pass: getPhotodiodeState(150000, 5, 100, 0.45, 7.5, true).lux === 100000 },
    { name: "Dark current exists in reverse bias", pass: getPhotodiodeState(0, 5, 100, 0.45, 7.5, true).darkCurrentUA > 0 },
    { name: "Total current includes dark current", pass: getPhotodiodeState(0, 5, 100, 0.45, 7.5, true).totalCurrentUA === getPhotodiodeState(0, 5, 100, 0.45, 7.5, true).darkCurrentUA },
    { name: "Higher lux increases photocurrent", pass: getPhotodiodeState(5000, 5, 100, 0.45, 7.5, true).photocurrentUA > getPhotodiodeState(500, 5, 100, 0.45, 7.5, true).photocurrentUA },
    { name: "Higher load increases output voltage", pass: getPhotodiodeState(1000, 5, 200, 0.45, 7.5, true).outputVoltage > getPhotodiodeState(1000, 5, 50, 0.45, 7.5, true).outputVoltage },
    { name: "Forward mode keeps a real diode drop", pass: getPhotodiodeState(1000, 5, 100, 0.45, 7.5, false).forwardDropVoltage > 0.5 },
    { name: "Photocurrent saturates", pass: getPhotodiodeState(100000, 30, 100, 0.8, 20, true).photocurrentUA <= getPhotodiodeState(100000, 30, 100, 0.8, 20, true).saturationCurrentUA },
    { name: "Graph has multiple points", pass: getGraphPoints(5, 100, 0.45, 7.5, true).length >= 10 },
  ];

  return {
    passed: tests.filter((test) => test.pass).length,
    failed: tests.filter((test) => !test.pass).length,
    tests,
  };
}
