"use client";

import type { IconProps } from "./types";

function iconClassName(className?: string) {
  return className ?? "h-5 w-5";
}

export function Activity({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClassName(className)}>
      <path d="M3 12h4l2-4 4 8 2-4h6" />
    </svg>
  );
}

export function Gauge({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClassName(className)}>
      <path d="M5 16a7 7 0 1 1 14 0" />
      <path d="M12 12l4-3" />
      <circle cx="12" cy="16" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Info({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClassName(className)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6" />
      <circle cx="12" cy="7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Pause({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={iconClassName(className)}>
      <path d="M7 6h4v12H7zM13 6h4v12h-4z" />
    </svg>
  );
}

export function Play({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={iconClassName(className)}>
      <path d="M8 6v12l10-6z" />
    </svg>
  );
}

export function RotateCcw({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClassName(className)}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  );
}

export function SlidersHorizontal({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconClassName(className)}>
      <path d="M4 7h16" />
      <path d="M4 17h16" />
      <circle cx="9" cy="7" r="2" fill="white" />
      <circle cx="15" cy="17" r="2" fill="white" />
    </svg>
  );
}

