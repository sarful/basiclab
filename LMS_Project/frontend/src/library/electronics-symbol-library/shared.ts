import type { ReactNode } from "react";

export type ElectronicsSymbolProps = {
  className?: string;
  label?: string;
  width?: number;
  height?: number;
  showTerminalLabels?: boolean;
};

export type ElectronicsSymbolTerminalPoint = {
  x: number;
  y: number;
};

export type ElectronicsSymbolTerminalMap = Record<
  string,
  ElectronicsSymbolTerminalPoint
>;

export type ElectronicsSymbolViewBox = {
  minX: number;
  minY: number;
  width: number;
  height: number;
};

export function resolveTerminalPointFromViewBox(
  point: ElectronicsSymbolTerminalPoint,
  viewBox: ElectronicsSymbolViewBox,
  width: number,
  height: number,
): ElectronicsSymbolTerminalPoint {
  return {
    x: ((point.x - viewBox.minX) / viewBox.width) * width,
    y: ((point.y - viewBox.minY) / viewBox.height) * height,
  };
}

export function resolveTerminalMapFromViewBox<T extends ElectronicsSymbolTerminalMap>(
  terminals: T,
  viewBox: ElectronicsSymbolViewBox,
  width: number,
  height: number,
): T {
  return Object.fromEntries(
    Object.entries(terminals).map(([key, point]) => [
      key,
      resolveTerminalPointFromViewBox(point, viewBox, width, height),
    ]),
  ) as T;
}

export type ElectronicsSymbolEntry = {
  title: string;
  category: string;
  component: ReactNode;
};

export function groupElectronicsSymbols(
  entries: ElectronicsSymbolEntry[],
): Array<[string, ElectronicsSymbolEntry[]]> {
  return Object.entries(
    entries.reduce<Record<string, ElectronicsSymbolEntry[]>>((groups, entry) => {
      groups[entry.category] ??= [];
      groups[entry.category].push(entry);
      return groups;
    }, {}),
  );
}
