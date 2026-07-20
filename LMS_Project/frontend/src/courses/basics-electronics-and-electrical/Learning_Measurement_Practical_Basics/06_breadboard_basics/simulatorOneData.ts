"use client";

export type BreadboardGroupType =
  | "terminal-top"
  | "terminal-bottom"
  | "power-top-positive"
  | "power-top-negative"
  | "power-bottom-positive"
  | "power-bottom-negative";

export type BreadboardHole = {
  column: number;
  group: string;
  groupType: BreadboardGroupType;
  id: string;
  kind: "power" | "terminal";
  label: string;
  row: string;
  x: number;
  y: number;
};

export type BreadboardWire = {
  color: string;
  from: string;
  id: string;
  taskId?: string;
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
        column: col,
        group: `top-${col}`,
        groupType: "terminal-top",
        id: `${row}${col}`,
        kind: "terminal",
        label: `${row}${col}`,
        row,
        x: simulatorOneColX(col),
        y: 180 + rowIndex * 24,
      });
    });

    simulatorOneRowsBottom.forEach((row, rowIndex) => {
      holes.push({
        column: col,
        group: `bottom-${col}`,
        groupType: "terminal-bottom",
        id: `${row}${col}`,
        kind: "terminal",
        label: `${row}${col}`,
        row,
        x: simulatorOneColX(col),
        y: 370 + rowIndex * 24,
      });
    });
  }

  const railCols = Array.from({ length: 50 }, (_, index) => index + 1);

  railCols.forEach((index) => {
    const x = 95 + (index - 1) * 20.5;

    holes.push({
      column: index,
      group: "top-plus",
      groupType: "power-top-positive",
      id: `TP${index}`,
      kind: "power",
      label: `Top + rail ${index}`,
      row: "TP+",
      x,
      y: 85,
    });

    holes.push({
      column: index,
      group: "top-minus",
      groupType: "power-top-negative",
      id: `TN${index}`,
      kind: "power",
      label: `Top - rail ${index}`,
      row: "TP-",
      x,
      y: 110,
    });

    holes.push({
      column: index,
      group: "bottom-minus",
      groupType: "power-bottom-negative",
      id: `BN${index}`,
      kind: "power",
      label: `Bottom - rail ${index}`,
      row: "BP-",
      x,
      y: 535,
    });

    holes.push({
      column: index,
      group: "bottom-plus",
      groupType: "power-bottom-positive",
      id: `BP${index}`,
      kind: "power",
      label: `Bottom + rail ${index}`,
      row: "BP+",
      x,
      y: 560,
    });
  });

  return holes;
}
