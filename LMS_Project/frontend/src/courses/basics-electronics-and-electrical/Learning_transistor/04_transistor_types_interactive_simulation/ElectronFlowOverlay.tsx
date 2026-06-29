"use client";

import type { ReactNode } from "react";

import type { BjtType, Family, FetChannel, FetType } from "./types";

type ElectronFlowOverlayProps = {
  family: Family;
  bjtType: BjtType;
  fetType: FetType;
  fetChannel: FetChannel;
  active: boolean;
};

type FlowSpec = {
  title: string;
  direction: string;
  path: string;
  labelX: number;
  labelY: number;
  track?: ReactNode;
};

function getElectronFlowSpec({
  family,
  bjtType,
  fetType,
  fetChannel,
}: Omit<ElectronFlowOverlayProps, "active">): FlowSpec {
  if (family === "BJT") {
    if (bjtType === "NPN") {
      return {
        title: "Conventional Current",
        direction: "C -> E",
        path: "M192 42 L192 143 L158 158 L158 178 L192 197 L192 294",
        labelX: 246,
        labelY: 34,
        track: (
          <>
            <path d="M192 42 L192 143 L158 158" />
            <path d="M158 158 L158 178" />
            <path d="M158 178 L192 197 L192 294" />
          </>
        ),
      };
    }

    return {
      title: "Conventional Current",
      direction: "E -> C",
      path: "M192 294 L192 197 L158 178 L158 158 L192 143 L192 42",
      labelX: 246,
      labelY: 34,
      track: (
        <>
          <path d="M192 294 L192 197 L158 178" />
          <path d="M158 178 L158 158" />
          <path d="M158 158 L192 143 L192 42" />
        </>
      ),
    };
  }

  if (fetType === "JFET") {
    return fetChannel === "N-Channel"
      ? {
          title: "Conventional Current",
          direction: "D -> S",
          path: "M223 42 L223 143 L194 143 L194 185 L223 185 L223 294",
          labelX: 252,
          labelY: 34,
          track: (
            <>
              <path d="M223 42 L223 143 L194 143" />
              <path d="M194 143 L194 185" />
              <path d="M194 185 L223 185 L223 294" />
            </>
          ),
        }
      : {
          title: "Conventional Current",
          direction: "S -> D",
          path: "M223 294 L223 185 L194 185 L194 143 L223 143 L223 42",
          labelX: 252,
          labelY: 34,
          track: (
            <>
              <path d="M223 294 L223 185 L194 185" />
              <path d="M194 185 L194 143" />
              <path d="M194 143 L223 143 L223 42" />
            </>
          ),
        };
  }

  return fetChannel === "N-Channel"
    ? {
        title: "Conventional Current",
        direction: "D -> S",
        path: "M223 55 L223 145 L184 145 L184 190 L223 190 L223 280",
        labelX: 250,
        labelY: 34,
        track: (
          <>
            <path d="M223 55 L223 145 L184 145" />
            <path d="M184 145 L184 190" />
            <path d="M184 190 L223 190 L223 280" />
          </>
        ),
      }
    : {
        title: "Conventional Current",
        direction: "S -> D",
        path: "M223 280 L223 190 L184 190 L184 145 L223 145 L223 55",
        labelX: 250,
        labelY: 34,
        track: (
          <>
            <path d="M223 280 L223 190 L184 190" />
            <path d="M184 190 L184 145" />
            <path d="M184 145 L223 145 L223 55" />
          </>
        ),
      };
}

export default function ElectronFlowOverlay({
  family,
  bjtType,
  fetType,
  fetChannel,
  active,
}: ElectronFlowOverlayProps) {
  const spec = getElectronFlowSpec({ family, bjtType, fetType, fetChannel });

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        viewBox="0 0 340 340"
        className="h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <filter id="electron-flow-glow">
            <feGaussianBlur stdDeviation="2.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <marker
            id="electron-flow-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0 0L10 5L0 10z" fill="#f97316" />
          </marker>
        </defs>

        <path
          d={spec.path}
          fill="none"
          stroke={active ? "#fdba74" : "#cbd5e1"}
          strokeWidth="4"
          strokeDasharray="8 10"
          strokeLinecap="round"
          markerEnd="url(#electron-flow-arrow)"
          opacity={active ? 0.95 : 0.55}
          filter="url(#electron-flow-glow)"
        />

        {spec.track ? (
          <g
            fill="none"
            stroke={active ? "#f97316" : "#cbd5e1"}
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity={active ? 0.7 : 0.35}
          >
            {spec.track}
          </g>
        ) : null}

        {active ? (
          <>
            <circle r="5" fill="#f97316" filter="url(#electron-flow-glow)">
              <animateMotion dur="1.8s" repeatCount="indefinite" path={spec.path} />
            </circle>
            <circle r="4" fill="#ffedd5" filter="url(#electron-flow-glow)">
              <animateMotion
                dur="1.8s"
                begin="-0.6s"
                repeatCount="indefinite"
                path={spec.path}
              />
            </circle>
            <circle r="4" fill="#fb923c" filter="url(#electron-flow-glow)">
              <animateMotion
                dur="1.8s"
                begin="-1.2s"
                repeatCount="indefinite"
                path={spec.path}
              />
            </circle>
          </>
        ) : null}

        <g transform={`translate(${spec.labelX} ${spec.labelY})`}>
          <rect
            x="-54"
            y="-18"
            width="108"
            height="36"
            rx="16"
            fill="rgba(255,255,255,0.92)"
            stroke="#bae6fd"
          />
          <text
            x="0"
            y="-2"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="#c2410c"
          >
            {spec.title}
          </text>
          <text
            x="0"
            y="12"
            textAnchor="middle"
            fontSize="12"
            fontWeight="800"
            fill="#0f172a"
          >
            {spec.direction}
          </text>
        </g>
      </svg>
    </div>
  );
}
