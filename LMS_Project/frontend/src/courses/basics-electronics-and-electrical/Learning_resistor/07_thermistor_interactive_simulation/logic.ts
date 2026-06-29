"use client";

import type { ThermistorMode } from "./types";

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function formatNumber(value: number, digits = 2) {
  if (!Number.isFinite(value)) return "0";
  return Number(value.toFixed(digits)).toString();
}

export function formatResistance(value: number) {
  if (value >= 1000000) return `${formatNumber(value / 1000000, 2)} MΩ`;
  if (value >= 1000) return `${formatNumber(value / 1000, 2)} kΩ`;
  return `${formatNumber(value, 1)} Ω`;
}

export function formatCurrent(value: number) {
  if (value >= 1) return `${formatNumber(value, 3)} A`;
  return `${formatNumber(value * 1000, 2)} mA`;
}

export function calculateThermistorResistance(mode: ThermistorMode, nominalResistance: number, temperature: number) {
  const delta = temperature - 25;
  if (mode === "ntc") return nominalResistance * Math.exp(-0.045 * delta);
  return nominalResistance * Math.exp(0.028 * delta);
}
