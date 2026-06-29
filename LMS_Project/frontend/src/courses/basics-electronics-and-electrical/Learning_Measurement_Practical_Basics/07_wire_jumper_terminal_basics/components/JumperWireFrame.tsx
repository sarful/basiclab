"use client";

import type { ReactNode } from "react";

type JumperWireFrameProps = {
  ariaLabel: string;
  children: ReactNode;
  viewBox: string;
};

export default function JumperWireFrame({
  ariaLabel,
  children,
  viewBox,
}: JumperWireFrameProps) {
  return (
    <div className="w-full rounded-xl bg-white p-4">
      <svg
        viewBox={viewBox}
        className="h-auto w-full"
        role="img"
        aria-label={ariaLabel}
      >
        {children}
      </svg>
    </div>
  );
}
