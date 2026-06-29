"use client";

export type BreadboardHole = {
  group: string;
  id: string;
  kind: "power" | "terminal";
  label: string;
  x: number;
  y: number;
};

export type BreadboardWire = {
  color: string;
  from: string;
  to: string;
};

export const breadboardCanvasSize = {
  height: 620,
  width: 1200,
} as const;

export const simulatorOneRowsTop = ["A", "B", "C", "D", "E"] as const;
export const simulatorOneRowsBottom = ["F", "G", "H", "I", "J"] as const;
export const breadboardWireColors = [
  "#ef4444",
  "#2563eb",
  "#22c55e",
  "#f59e0b",
  "#111827",
] as const;

export function simulatorOneColX(col: number) {
  return 70 + (col - 1) * 17.55;
}

export function createSimulatorOneHoles(): BreadboardHole[] {
  const holes: BreadboardHole[] = [];

  for (let col = 1; col <= 60; col++) {
    simulatorOneRowsTop.forEach((row, rowIndex) => {
      holes.push({
        group: `top-${col}`,
        id: `${row}${col}`,
        kind: "terminal",
        label: `${row}${col}`,
        x: simulatorOneColX(col),
        y: 180 + rowIndex * 24,
      });
    });

    simulatorOneRowsBottom.forEach((row, rowIndex) => {
      holes.push({
        group: `bottom-${col}`,
        id: `${row}${col}`,
        kind: "terminal",
        label: `${row}${col}`,
        x: simulatorOneColX(col),
        y: 370 + rowIndex * 24,
      });
    });
  }

  const railCols = Array.from({ length: 50 }, (_, index) => index + 1);

  railCols.forEach((index) => {
    const x = 95 + (index - 1) * 20.5;

    holes.push({
      group: `top-plus-${Math.floor((index - 1) / 5)}`,
      id: `TP${index}`,
      kind: "power",
      label: `Top + Rail ${index}`,
      x,
      y: 85,
    });

    holes.push({
      group: `top-minus-${Math.floor((index - 1) / 5)}`,
      id: `TN${index}`,
      kind: "power",
      label: `Top - Rail ${index}`,
      x,
      y: 110,
    });

    holes.push({
      group: `bottom-minus-${Math.floor((index - 1) / 5)}`,
      id: `BN${index}`,
      kind: "power",
      label: `Bottom - Rail ${index}`,
      x,
      y: 535,
    });

    holes.push({
      group: `bottom-plus-${Math.floor((index - 1) / 5)}`,
      id: `BP${index}`,
      kind: "power",
      label: `Bottom + Rail ${index}`,
      x,
      y: 560,
    });
  });

  return holes;
}
