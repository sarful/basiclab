"use client";

import type { FixedType } from "./types";

export const fixedTypes: FixedType[] = [
  {
    key: "carbon",
    name: "Carbon Composition",
    bn: "কার্বন রেজিস্টর",
    bodyColor: "#d6b27b",
    layerColor: "#334155",
    description: "কম খরচের fixed resistor, সাধারণ circuit ও learning lab-এ ব্যবহৃত হয়।",
    whatIs: "কার্বন ও binding material দিয়ে তৈরি একটি fixed resistor, যা সাধারণ electronic circuit-এ current control করার জন্য ব্যবহৃত হয়।",
    toleranceOptions: [5, 10, 20],
    powerOptions: [0.25, 0.5, 1],
    accuracy: 35,
    noise: 75,
    heatHandling: 45,
    application: "Basic LED circuit, school lab, simple electronics",
    limitation: "Noise বেশি এবং precision কম।",
  },
  {
    key: "metalFilm",
    name: "Metal Film",
    bn: "মেটাল ফিল্ম রেজিস্টর",
    bodyColor: "#e6d5b8",
    layerColor: "#2563eb",
    description: "উচ্চ নির্ভুলতা, কম noise এবং stable performance-এর fixed resistor।",
    whatIs: "Metal film layer ব্যবহার করে তৈরি উচ্চ accuracy ও stable performance-এর fixed resistor।",
    toleranceOptions: [0.1, 0.5, 1, 2],
    powerOptions: [0.125, 0.25, 0.5, 1],
    accuracy: 92,
    noise: 15,
    heatHandling: 55,
    application: "Sensor signal, amplifier, measuring circuit",
    limitation: "High power load-এর জন্য সবসময় best choice নয়।",
  },
  {
    key: "wireWound",
    name: "Wire Wound",
    bn: "ওয়্যার ওয়াউন্ড রেজিস্টর",
    bodyColor: "#f1c27d",
    layerColor: "#f97316",
    description: "Resistance wire wound করে তৈরি high-power fixed resistor।",
    whatIs: "Resistance wire coil আকারে wound করে তৈরি high-power fixed resistor, যা বেশি heat ও power handle করতে পারে।",
    toleranceOptions: [1, 2, 5],
    powerOptions: [1, 2, 5, 10],
    accuracy: 80,
    noise: 20,
    heatHandling: 95,
    application: "Power supply, braking resistor, heater load",
    limitation: "Size বড় এবং inductance effect থাকতে পারে।",
  },
];

export const standardValues = [10, 22, 47, 100, 150, 220, 330, 470, 680, 1000, 2200, 4700, 10000, 22000, 47000, 100000];

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function formatNumber(value: number, digits = 3) {
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
