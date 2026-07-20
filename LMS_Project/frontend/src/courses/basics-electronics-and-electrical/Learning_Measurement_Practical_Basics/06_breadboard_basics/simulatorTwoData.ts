"use client";

import type { BreadboardHole } from "./simulatorOneData";

export type BreadboardStripHole = Omit<BreadboardHole, "kind"> & {
  type: "power" | "terminal";
};

export const simulatorTwoRowsLeft = ["A", "B", "C", "D", "E"] as const;
export const simulatorTwoRowsRight = ["F", "G", "H", "I", "J"] as const;
export const simulatorTwoColumns = Array.from({ length: 30 }, (_, index) => index + 1);

export function simulatorTwoRowY(rowNumber: number) {
  return 105 + (rowNumber - 1) * 28;
}

export function createSimulatorTwoHoles(): BreadboardStripHole[] {
  const holes: BreadboardStripHole[] = [];

  simulatorTwoColumns.forEach((column) => {
    simulatorTwoRowsLeft.forEach((row, index) => {
      holes.push({
        column,
        group: `left-${column}`,
        groupType: "terminal-top",
        id: `${row}${column}`,
        label: `${row}${column} connected with A-E column ${column}`,
        row,
        type: "terminal",
        x: 210 + index * 35,
        y: simulatorTwoRowY(column),
      });
    });

    simulatorTwoRowsRight.forEach((row, index) => {
      holes.push({
        column,
        group: `right-${column}`,
        groupType: "terminal-bottom",
        id: `${row}${column}`,
        label: `${row}${column} connected with F-J column ${column}`,
        row,
        type: "terminal",
        x: 420 + index * 35,
        y: simulatorTwoRowY(column),
      });
    });

    holes.push({
      column,
      group: "left-negative-rail",
      groupType: "power-top-negative",
      id: `L-${column}`,
      label: `Left negative rail ${column}`,
      row: "L-",
      type: "power",
      x: 95,
      y: simulatorTwoRowY(column),
    });

    holes.push({
      column,
      group: "left-positive-rail",
      groupType: "power-top-positive",
      id: `L+${column}`,
      label: `Left positive rail ${column}`,
      row: "L+",
      type: "power",
      x: 125,
      y: simulatorTwoRowY(column),
    });

    holes.push({
      column,
      group: "right-negative-rail",
      groupType: "power-bottom-negative",
      id: `R-${column}`,
      label: `Right negative rail ${column}`,
      row: "R-",
      type: "power",
      x: 635,
      y: simulatorTwoRowY(column),
    });

    holes.push({
      column,
      group: "right-positive-rail",
      groupType: "power-bottom-positive",
      id: `R+${column}`,
      label: `Right positive rail ${column}`,
      row: "R+",
      type: "power",
      x: 665,
      y: simulatorTwoRowY(column),
    });
  });

  return holes;
}
