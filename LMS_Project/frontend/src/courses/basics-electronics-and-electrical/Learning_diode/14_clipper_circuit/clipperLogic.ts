import type {
  ClipperMode,
  ClipperState,
  ClipperWavePoint,
  FlowMode,
} from "./clipperTypes";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function getClipperState({
  clipLevel,
  flowMode,
  inputAmplitude,
  mode,
  resistorValue,
  timeCursor,
}: {
  clipLevel: number;
  flowMode: FlowMode;
  inputAmplitude: number;
  mode: ClipperMode;
  resistorValue: number;
  timeCursor: number;
}): ClipperState {
  const limitedAmplitude = clamp(inputAmplitude, 0.2, 12);
  const limitedClipLevel = clamp(clipLevel, 0.2, 6);
  const limitedResistance = clamp(resistorValue, 220, 4700);
  const diodeDrop = 0.7;
  const positiveClipThreshold = limitedClipLevel + diodeDrop;
  const negativeClipThreshold = -(limitedClipLevel + diodeDrop);
  const clipThresholdMagnitude = positiveClipThreshold;
  const clippedPeak = Math.min(limitedAmplitude, clipThresholdMagnitude);
  const positiveClipExcess = Math.max(limitedAmplitude - positiveClipThreshold, 0);
  const negativeClipExcess = Math.max(
    limitedAmplitude - Math.abs(negativeClipThreshold),
    0,
  );
  const positiveConductionState =
    positiveClipExcess > 0 ? "Conducting" : "Blocking";
  const negativeConductionState =
    negativeClipExcess > 0 ? "Conducting" : "Blocking";
  const conductionState =
    mode === "positive"
      ? positiveConductionState
      : mode === "negative"
        ? negativeConductionState
        : positiveClipExcess > 0 || negativeClipExcess > 0
          ? "Selective Clipping"
          : "No Clipping";
  const positiveOutputMaximum = Math.min(limitedAmplitude, positiveClipThreshold);
  const negativeOutputMinimum = -Math.min(
    limitedAmplitude,
    Math.abs(negativeClipThreshold),
  );
  const loadCurrentMilliAmps =
    ((mode === "negative" ? negativeClipExcess : positiveClipExcess) /
      limitedResistance) *
    1000;
  const positiveConductionCurrentMilliAmps =
    (positiveClipExcess / limitedResistance) * 1000;
  const negativeConductionCurrentMilliAmps =
    (negativeClipExcess / limitedResistance) * 1000;
  const inputRmsVoltage = limitedAmplitude / Math.SQRT2;
  const samples = 240;
  const waveform: ClipperWavePoint[] = Array.from({ length: samples }, (_, index) => {
    const t = index / (samples - 1);
    const phase = 2 * Math.PI * t;
    const vin = Math.sin(phase) * limitedAmplitude;
    const positiveClipped = vin > positiveClipThreshold;
    const negativeClipped = vin < negativeClipThreshold;
    const voutPositive = Math.min(vin, positiveClipThreshold);
    const voutNegative = Math.max(vin, negativeClipThreshold);

    return {
      conducting: positiveClipped || negativeClipped,
      negativeClipped,
      positiveClipped,
      t,
      vin,
      voutNegative,
      voutPositive,
    };
  });
  const cursorIndex = Math.floor(clamp(timeCursor, 0, 0.999) * (samples - 1));
  const timeCursorPoint = waveform[cursorIndex];
  const activeHalfCycleLabel =
    mode === "positive"
      ? "Positive half-cycle clip region"
      : mode === "negative"
        ? "Negative half-cycle clip region"
        : "Positive and negative half-cycle comparison";
  const biasStateLabel =
    mode === "positive"
      ? positiveConductionState === "Conducting"
        ? "Forward Bias on positive peaks"
        : "Reverse/idle below positive threshold"
      : mode === "negative"
        ? negativeConductionState === "Conducting"
          ? "Forward Bias on negative peaks"
          : "Reverse/idle above negative threshold"
        : "Bias depends on which half-cycle reaches the clip threshold";
  const currentDirectionLabel =
    flowMode === "conventional"
      ? mode === "negative"
        ? "Conventional current leaves the source, reaches the resistor, and is shunted during the negative clipping half-cycle."
        : "Conventional current leaves the source, reaches the resistor, and is shunted during the positive clipping half-cycle."
      : mode === "negative"
        ? "Electron flow returns opposite to conventional current while the negative clipping branch becomes the active shunt path."
        : "Electron flow returns opposite to conventional current while the positive clipping branch becomes the active shunt path.";
  const positiveEquation = `Vout+ = min(Vin(pk), Vref + Vd) = min(${limitedAmplitude.toFixed(1)}V, ${limitedClipLevel.toFixed(1)}V + ${diodeDrop.toFixed(1)}V)`;
  const negativeEquation = `Vout- = max(-Vin(pk), -(Vref + Vd)) = max(-${limitedAmplitude.toFixed(1)}V, -(${limitedClipLevel.toFixed(1)}V + ${diodeDrop.toFixed(1)}V))`;
  const switchingPreviewLabel =
    timeCursorPoint.positiveClipped
      ? "Positive clipper branch is shunting the peak"
      : timeCursorPoint.negativeClipped
        ? "Negative clipper branch is shunting the peak"
        : timeCursorPoint.vin >= 0
          ? "Positive half-cycle is below the clipping threshold"
          : "Negative half-cycle is below the clipping threshold";

  return {
    activeHalfCycleLabel,
    biasStateLabel,
    clipLevel: limitedClipLevel,
    clipThresholdMagnitude,
    clippedPeak,
    conductionState,
    currentDirectionLabel,
    diodeDrop,
    focusLabel:
      mode === "positive"
        ? "Positive Diode Clipping"
        : mode === "negative"
          ? "Negative Diode Clipping"
        : "Dual Clipper Comparison",
    inputPeakToPeak: limitedAmplitude * 2,
    inputRmsVoltage,
    inputAmplitude: limitedAmplitude,
    inputTypeLabel: "AC Sine Input",
    loadCurrentMilliAmps,
    mode,
    negativeClipThreshold,
    negativeConductionCurrentMilliAmps,
    negativeConductionState,
    negativeEquation,
    negativeOutputMinimum,
    positiveClipThreshold,
    positiveConductionCurrentMilliAmps,
    positiveConductionState,
    positiveEquation,
    positiveOutputMaximum,
    outputTypeLabel:
      mode === "positive"
        ? `Positive peaks limit at +${positiveOutputMaximum.toFixed(1)}V`
        : mode === "negative"
          ? `Negative peaks limit at ${negativeOutputMinimum.toFixed(1)}V`
          : `+${positiveOutputMaximum.toFixed(1)}V / ${negativeOutputMinimum.toFixed(1)}V clip limits`,
    resistorValue: limitedResistance,
    summaryLine: `Vin(pk) ${limitedAmplitude.toFixed(1)}V | Vin(rms) ${inputRmsVoltage.toFixed(2)}V | Vclip ${clipThresholdMagnitude.toFixed(1)}V | R ${limitedResistance} Ohm`,
    switchingPreviewLabel,
    timeCursor: clamp(timeCursor, 0, 0.999),
    timeCursorPoint,
    waveform,
  };
}
