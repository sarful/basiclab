import type { ReactNode } from "react";

export type ElectronicsSymbolProps = {
  className?: string;
  label?: string;
  width?: number;
  height?: number;
};

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
