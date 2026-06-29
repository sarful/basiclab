"use client";

import { motion } from "framer-motion";
import { useMemo, type ReactNode } from "react";

import {
  BASE_COMPONENT,
  COLORS,
  COMPONENT,
  LABEL,
  PATH,
  STROKE,
  WIRE,
} from "./constants";
import type { Status } from "./types";

export function SvgDefs() {
  return (
    <defs>
      <marker
        id="arrow"
        markerWidth="14"
        markerHeight="14"
        refX="12"
        refY="5"
        orient="auto"
      >
        <path d="M0,0 L12,5 L0,10 Z" fill={COLORS.outline} />
      </marker>

      <linearGradient id="pipeGrad" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor={COLORS.pipeLight} />
        <stop offset="48%" stopColor={COLORS.pipeMid} />
        <stop offset="100%" stopColor={COLORS.pipeDark} />
      </linearGradient>

      <linearGradient id="waterGrad" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#dbeafe" />
        <stop offset="100%" stopColor="#bfdbfe" />
      </linearGradient>

      <clipPath id="leftPipeClip">
        <rect
          x={COMPONENT.leftPipe.x}
          y={COMPONENT.leftPipe.y}
          width={COMPONENT.leftPipe.width}
          height={COMPONENT.leftPipe.height}
        />
      </clipPath>

      <clipPath id="rightPipeClip">
        <path d="M938 305 H1258 V365 H938 Z M1258 300 H1360 Q1425 300 1425 390 V510 H1350 V390 Q1350 370 1330 370 H1258 Z" />
      </clipPath>
    </defs>
  );
}

function TextLabel({
  x,
  y,
  children,
  size = 26,
  color = COLORS.outline,
  anchor = "middle",
}: {
  x: number;
  y: number;
  children: ReactNode;
  size?: number;
  color?: string;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill={color}
      fontSize={size}
      fontWeight={900}
    >
      {children}
    </text>
  );
}

function flowWidth(signal: number) {
  return signal <= 0 ? 0 : 4 + signal * 0.25;
}

function regionName(signal: number) {
  if (signal <= 0) return "Cutoff Region";
  if (signal < 70) return "Active Region";
  return "Saturation Region";
}

export function WaterTank() {
  return (
    <>
      <rect
        x={BASE_COMPONENT.tank.x}
        y={BASE_COMPONENT.tank.y}
        width={BASE_COMPONENT.tank.width}
        height={BASE_COMPONENT.tank.height}
        rx={BASE_COMPONENT.tank.rx}
        fill={COLORS.tankBody}
        stroke={COLORS.outline}
        strokeWidth={STROKE.outline}
      />

      <ellipse
        cx={COMPONENT.tank.lidCx}
        cy={COMPONENT.tank.lidCy}
        rx={COMPONENT.tank.lidRx}
        ry={COMPONENT.tank.lidRy}
        fill="#f1f5f9"
        stroke={COLORS.outline}
        strokeWidth={STROKE.outline}
      />

      <rect
        x={COMPONENT.tank.waterX}
        y={COMPONENT.tank.waterY}
        width={COMPONENT.tank.waterWidth}
        height={COMPONENT.tank.waterHeight}
        rx={16}
        fill="url(#waterGrad)"
        opacity={0.92}
      />

      <motion.path
        d={PATH.tankWaterWave}
        fill="none"
        stroke={COLORS.waterDark}
        strokeWidth={6}
        strokeLinecap="round"
        animate={{ pathLength: [0.96, 1, 0.96] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />

      <rect
        x={COMPONENT.tank.capX}
        y={COMPONENT.tank.capY}
        width={75}
        height={30}
        rx={7}
        fill="#dbeafe"
        stroke={COLORS.outline}
        strokeWidth={4}
      />

      <rect
        x={COMPONENT.tank.capX + 15}
        y={COMPONENT.tank.capY + 30}
        width={45}
        height={34}
        rx={7}
        fill={COLORS.pipeMid}
        stroke={COLORS.outline}
        strokeWidth={4}
      />

      <TextLabel x={LABEL.tank.titleX} y={LABEL.tank.titleY} size={32}>
        WATER TANK
      </TextLabel>

      <TextLabel x={LABEL.tank.titleX} y={LABEL.tank.subY} size={26}>
        (POWER SUPPLY)
      </TextLabel>
    </>
  );
}

export function LeftPipe({
  signal,
  flowSpeed,
}: {
  signal: number;
  flowSpeed: number;
}) {
  return (
    <>
      <rect
        x={COMPONENT.leftPipe.connectorX}
        y={COMPONENT.leftPipe.connectorY}
        width={COMPONENT.leftPipe.connectorWidth}
        height={COMPONENT.leftPipe.connectorHeight}
        rx={6}
        fill={COLORS.pipeDark}
        stroke={COLORS.outline}
        strokeWidth={STROKE.outline}
      />

      <rect
        x={COMPONENT.leftPipe.x}
        y={COMPONENT.leftPipe.y}
        width={COMPONENT.leftPipe.width}
        height={COMPONENT.leftPipe.height}
        fill="url(#pipeGrad)"
        stroke={COLORS.outline}
        strokeWidth={STROKE.outline}
      />

      <line
        x1={415}
        y1={322}
        x2={615}
        y2={322}
        stroke="#ffffff"
        strokeWidth={9}
        strokeLinecap="round"
        opacity={0.9}
      />

      <g clipPath="url(#leftPipeClip)">
        <motion.path
          d={WIRE.leftPipeFlow}
          fill="none"
          stroke={COLORS.cyan}
          strokeWidth={flowWidth(signal)}
          strokeLinecap="round"
          strokeDasharray="16 18"
          animate={{ strokeDashoffset: signal > 0 ? [60, 0] : 0 }}
          transition={{ duration: flowSpeed, repeat: Infinity, ease: "linear" }}
          opacity={signal / 115}
        />
      </g>

      <line
        x1={LABEL.pipe.arrowX}
        y1={LABEL.pipe.arrowY1}
        x2={LABEL.pipe.arrowX}
        y2={LABEL.pipe.arrowY2}
        stroke={COLORS.outline}
        strokeWidth={STROKE.wire}
        markerEnd="url(#arrow)"
      />

      <TextLabel x={LABEL.pipe.arrowX} y={LABEL.pipe.titleY} size={36}>
        PIPE
      </TextLabel>
      <TextLabel x={LABEL.pipe.arrowX} y={LABEL.pipe.subY} size={27}>
        (CIRCUIT PATH)
      </TextLabel>
    </>
  );
}

export function TapValve({
  signal,
  status,
}: {
  signal: number;
  status: Status;
}) {
  const open = signal / 100;

  const cx = COMPONENT.valve.centerX;
  const throatGap = 2 + open * 196;
  const leftGap = cx - throatGap / 2;
  const rightGap = cx + throatGap / 2;

  const bodyLeft = 705;
  const bodyRight = 911;
  const top = 292;
  const bottom = 365;
  const centerTop = 314;
  const centerBottom = 344;

  const plugY = 270 + open * 44;
  const plugHeight = 95 - open * 75;

  const waterOpacity = signal <= 0 ? 0.03 : 0.35 + open * 0.35;

  const leftSeat = `
    M${bodyLeft} ${top}
    C760 ${top}, 792 ${centerTop}, ${leftGap} ${centerTop}
    L${leftGap} ${centerBottom}
    C792 ${centerBottom}, 760 ${bottom}, ${bodyLeft} ${bottom}
    Z
  `;

  const rightSeat = `
    M${bodyRight} ${top}
    C856 ${top}, 824 ${centerTop}, ${rightGap} ${centerTop}
    L${rightGap} ${centerBottom}
    C824 ${centerBottom}, 856 ${bottom}, ${bodyRight} ${bottom}
    Z
  `;

  const waterPassage = `
    M${bodyLeft} 312
    C755 312, 780 ${327 - open * 6}, ${leftGap} ${327 - open * 2}
    L${rightGap} ${327 - open * 2}
    C836 ${327 - open * 6}, 861 312, ${bodyRight} 312
    L${bodyRight} 348
    C861 348, 836 ${331 + open * 6}, ${rightGap} ${331 + open * 2}
    L${leftGap} ${331 + open * 2}
    C780 ${331 + open * 6}, 755 348, ${bodyLeft} 348
    Z
  `;

  return (
    <>
      <rect
        x={COMPONENT.valve.connectorX}
        y={COMPONENT.valve.connectorY}
        width={COMPONENT.valve.connectorWidth}
        height={COMPONENT.valve.connectorHeight}
        rx={7}
        fill={COLORS.pipeDark}
        stroke={COLORS.outline}
        strokeWidth={STROKE.outline}
      />

      <rect
        x={BASE_COMPONENT.valve.x}
        y={BASE_COMPONENT.valve.y}
        width={BASE_COMPONENT.valve.width}
        height={BASE_COMPONENT.valve.height}
        rx={BASE_COMPONENT.valve.rx}
        fill={COLORS.pipeMid}
        stroke={COLORS.outline}
        strokeWidth={STROKE.thick}
      />

      <rect
        x={COMPONENT.valve.innerX}
        y={COMPONENT.valve.innerY}
        width={COMPONENT.valve.innerWidth}
        height={COMPONENT.valve.innerHeight}
        rx={26}
        fill="#ffffff"
        stroke="#94a3b8"
        strokeWidth={4}
      />

      <motion.path
        d={waterPassage}
        animate={{ d: waterPassage }}
        transition={{ type: "spring", stiffness: 140, damping: 18 }}
        fill={COLORS.cyan}
        opacity={waterOpacity}
      />

      <motion.path
        d={leftSeat}
        animate={{ d: leftSeat }}
        transition={{ type: "spring", stiffness: 140, damping: 18 }}
        fill={COLORS.pipeDark}
        opacity={0.98}
      />

      <motion.path
        d={rightSeat}
        animate={{ d: rightSeat }}
        transition={{ type: "spring", stiffness: 140, damping: 18 }}
        fill={COLORS.pipeDark}
        opacity={0.98}
      />

      <motion.path
        d={`M718 301 C760 301, 790 ${centerTop}, ${leftGap} ${centerTop}`}
        animate={{
          d: `M718 301 C760 301, 790 ${centerTop}, ${leftGap} ${centerTop}`,
        }}
        fill="none"
        stroke="#ffffff"
        strokeWidth={5}
        strokeLinecap="round"
        opacity={0.75}
      />

      <motion.path
        d={`M898 301 C856 301, 826 ${centerTop}, ${rightGap} ${centerTop}`}
        animate={{
          d: `M898 301 C856 301, 826 ${centerTop}, ${rightGap} ${centerTop}`,
        }}
        fill="none"
        stroke="#ffffff"
        strokeWidth={5}
        strokeLinecap="round"
        opacity={0.75}
      />

      <motion.line
        x1={808}
        y1={215}
        x2={808}
        y2={plugY + plugHeight}
        stroke={COLORS.outline}
        strokeWidth={7}
        strokeLinecap="round"
        animate={{ y2: plugY + plugHeight }}
        transition={{ type: "spring", stiffness: 150, damping: 18 }}
      />

      <motion.rect
        x={795}
        y={plugY}
        width={26}
        height={plugHeight}
        rx={8}
        fill={signal === 0 ? "#94a3b8" : "#86efac"}
        stroke={COLORS.outline}
        strokeWidth={3}
        animate={{ y: plugY, height: plugHeight }}
        transition={{ type: "spring", stiffness: 150, damping: 18 }}
      />

      <TextLabel
        x={LABEL.valve.titleX}
        y={LABEL.valve.statusY}
        size={22}
        color={status.color}
      >
        {signal === 0 ? "VALVE CLOSED" : `PIPE OPEN ${signal}%`}
      </TextLabel>
    </>
  );
}

export function Handle({ signal }: { signal: number }) {
  const handleAngle = -45 + (signal / 100) * 90;

  return (
    <>
      <line
        x1={COMPONENT.handle.centerX}
        y1={COMPONENT.handle.stemBottomY}
        x2={COMPONENT.handle.centerX}
        y2={COMPONENT.handle.stemTopY}
        stroke={COLORS.outline}
        strokeWidth={22}
        strokeLinecap="round"
      />

      <rect
        x={COMPONENT.handle.baseX}
        y={COMPONENT.handle.baseY}
        width={COMPONENT.handle.baseWidth}
        height={COMPONENT.handle.baseHeight}
        rx={9}
        fill="#dbe3ec"
        stroke={COLORS.outline}
        strokeWidth={STROKE.outline}
      />

      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        animate={{ rotate: handleAngle }}
        transition={{ type: "spring", stiffness: 130, damping: 16 }}
      >
        <rect
          x={COMPONENT.handle.barX}
          y={COMPONENT.handle.barY}
          width={COMPONENT.handle.barWidth}
          height={COMPONENT.handle.barHeight}
          rx={23}
          fill="#dbe3ec"
          stroke={COLORS.outline}
          strokeWidth={STROKE.outline}
        />

        <circle
          cx={COMPONENT.handle.centerX}
          cy={COMPONENT.handle.topY}
          r={32}
          fill="#dbe3ec"
          stroke={COLORS.outline}
          strokeWidth={STROKE.outline}
        />
      </motion.g>

      <path
        d={PATH.handleArrow}
        fill="none"
        stroke={COLORS.outline}
        strokeWidth={STROKE.wire}
        markerEnd="url(#arrow)"
      />

      <TextLabel x={LABEL.handle.x} y={LABEL.handle.titleY} size={34}>
        HANDLE
      </TextLabel>
      <TextLabel x={LABEL.handle.x} y={LABEL.handle.subY} size={26}>
        (CONTROL SIGNAL)
      </TextLabel>
    </>
  );
}

export function RightPipe({
  signal,
  flowSpeed,
}: {
  signal: number;
  flowSpeed: number;
}) {
  return (
    <>
      <rect
        x={COMPONENT.rightPipe.x}
        y={COMPONENT.rightPipe.y}
        width={COMPONENT.rightPipe.width}
        height={COMPONENT.rightPipe.height}
        rx={14}
        fill="url(#pipeGrad)"
        stroke={COLORS.outline}
        strokeWidth={STROKE.outline}
      />

      <path
        d={COMPONENT.rightPipe.bendPath}
        fill="none"
        stroke={COLORS.outline}
        strokeWidth={STROKE.pipeOuter}
        strokeLinecap="round"
      />

      <path
        d={COMPONENT.rightPipe.innerBendPath}
        fill="none"
        stroke="url(#pipeGrad)"
        strokeWidth={STROKE.pipeInner}
        strokeLinecap="round"
      />

      <g clipPath="url(#rightPipeClip)">
        <motion.path
          d={WIRE.rightPipeFlow}
          fill="none"
          stroke={COLORS.cyan}
          strokeWidth={flowWidth(signal)}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="16 18"
          animate={{ strokeDashoffset: signal > 0 ? [60, 0] : 0 }}
          transition={{ duration: flowSpeed, repeat: Infinity, ease: "linear" }}
          opacity={signal / 115}
        />
      </g>

      <path
        d={COMPONENT.rightPipe.highlightPath}
        fill="none"
        stroke="#ffffff"
        strokeWidth={8}
        strokeLinecap="round"
        opacity={0.9}
      />

      <rect
        x={COMPONENT.rightPipe.outletX}
        y={COMPONENT.rightPipe.outletY}
        width={COMPONENT.rightPipe.outletWidth}
        height={COMPONENT.rightPipe.outletHeight}
        rx={7}
        fill={COLORS.pipeDark}
        stroke={COLORS.outline}
        strokeWidth={STROKE.outline}
      />
    </>
  );
}

export function FlowParticles({
  signal,
  flowSpeed,
}: {
  signal: number;
  flowSpeed: number;
}) {
  const particles = useMemo(() => Array.from({ length: 28 }), []);

  if (signal <= 0) return null;

  const open = signal / 100;
  const throatOffset = 14 - open * 10;

  const path = `
    M400 335
    H650
    C700 335, 735 ${329 + throatOffset}, 775 ${329}
    H841
    C881 ${329}, 918 335, 950 335
    H1360
    Q1390 335 1390 390
    V525
  `;

  return (
    <>
      {particles.map((_, i) => (
        <circle key={i} r={3.2 + signal / 65} fill={COLORS.cyan} opacity={0.9}>
          <animateMotion
            dur={`${flowSpeed}s`}
            repeatCount="indefinite"
            begin={`${i * 0.07}s`}
            path={path}
          />
        </circle>
      ))}
    </>
  );
}

export function OutletDroplets({ signal }: { signal: number }) {
  const smallDrops = useMemo(() => Array.from({ length: 20 }), []);

  if (signal <= 0) return null;

  const jetWidth = 7 + signal * 0.26;
  const opacity = Math.min(0.92, 0.28 + signal / 105);

  return (
    <>
      <motion.rect
        x={1390 - jetWidth / 2}
        y={520}
        width={jetWidth}
        height={100}
        rx={10}
        fill={COLORS.water}
        opacity={opacity}
        animate={{ height: [92, 106, 92] }}
        transition={{ duration: 0.65, repeat: Infinity, ease: "easeInOut" }}
      />

      {smallDrops.map((_, i) => {
        const col = i % 5;
        const row = Math.floor(i / 5);
        const spread = (col - 2) * (signal > 65 ? 10 : 5);

        return (
          <motion.ellipse
            key={i}
            cx={1390 + spread}
            cy={628 + row * 17}
            rx={2.8 + signal / 140}
            ry={5.5 + signal / 100}
            fill={COLORS.water}
            stroke={COLORS.waterDark}
            strokeWidth={1.2}
            opacity={opacity}
            animate={{ cy: [628 + row * 17, 640 + row * 17, 628 + row * 17] }}
            transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.04 }}
          />
        );
      })}
    </>
  );
}

export function FlowMeter({
  signal,
  status,
}: {
  signal: number;
  status: Status;
}) {
  const meter = COMPONENT.flowMeter;
  const needleAngle = -70 + signal * 1.4;

  return (
    <g>
      {/* <rect
        x={meter.x}
        y={meter.y}
        width={meter.width}
        height={meter.height}
        rx={18}
        fill="#f8fafc"
        stroke={COLORS.green}
        strokeWidth={4}
      />

      <TextLabel x={meter.cx} y={462} size={22} color={COLORS.green}>
        FLOW METER
      </TextLabel>

      <circle
        cx={meter.cx}
        cy={meter.cy}
        r={31}
        fill="#ffffff"
        stroke={COLORS.outline}
        strokeWidth={4}
      />

      <path
        d={`M${meter.cx - 24} ${meter.cy + 10} A26 26 0 0 1 ${meter.cx + 24} ${meter.cy + 10}`}
        fill="none"
        stroke="#94a3b8"
        strokeWidth={3}
      />

      <text
        x={meter.cx - 27}
        y={meter.cy + 21}
        fill={COLORS.outline}
        fontSize={10}
        fontWeight={900}
      >
        0
      </text>
      <text
        x={meter.cx - 6}
        y={meter.cy - 20}
        fill={COLORS.outline}
        fontSize={10}
        fontWeight={900}
      >
        50
      </text>
      <text
        x={meter.cx + 14}
        y={meter.cy + 21}
        fill={COLORS.outline}
        fontSize={10}
        fontWeight={900}
      >
        100
      </text>

      <motion.line
        x1={meter.cx}
        y1={meter.cy}
        x2={meter.cx}
        y2={meter.cy - 23}
        stroke={status.color}
        strokeWidth={5}
        strokeLinecap="round"
        animate={{ rotate: needleAngle }}
        style={{ transformOrigin: `${meter.cx}px ${meter.cy}px` }}
      />

      <circle cx={meter.cx} cy={meter.cy} r={5} fill={COLORS.outline} />

      <TextLabel x={meter.cx} y={529} size={18}>
        {signal}%
      </TextLabel> */}
    </g>
  );
}

export function TransistorPanel({
  signal,
  status,
}: {
  signal: number;
  status: Status;
}) {
  const panel = COMPONENT.transistorPanel;

  return (
    <g>
      {/* <rect
        x={panel.x}
        y={panel.y}
        width={panel.width + 20}
        height={panel.height + 18}
        rx={18}
        fill="#f8fafc"
        stroke={COLORS.green}
        strokeWidth={4}
      />

      <TextLabel x={230} y={615} size={22} color={COLORS.green}>
        TRANSISTOR SIDE
      </TextLabel>

      <text x={90} y={643} fill={COLORS.outline} fontSize={15} fontWeight={900}>
        Base/Gate: {signal}% = Handle Signal
      </text>

      <text x={90} y={665} fill={COLORS.outline} fontSize={15} fontWeight={900}>
        Current: {signal}% = Water Flow
      </text>

      <text x={90} y={687} fill={status.color} fontSize={15} fontWeight={900}>
        {regionName(signal)}
      </text> */}
    </g>
  );
}

export function TransistorMappingPanel() {
  return (
    <g>
      {/* <rect
        x={930}
        y={548}
        width={390}
        height={135}
        rx={18}
        fill="#ffffff"
        stroke={COLORS.green}
        strokeWidth={4}
      />

      <TextLabel x={1125} y={578} size={20} color={COLORS.green}>
        ANALOGY MAP
      </TextLabel>

      <text
        x={955}
        y={608}
        fill={COLORS.outline}
        fontSize={16}
        fontWeight={900}
      >
        Water Tank = Power Supply
      </text>
      <text
        x={955}
        y={632}
        fill={COLORS.outline}
        fontSize={16}
        fontWeight={900}
      >
        Pipe = Circuit Path
      </text>
      <text
        x={955}
        y={656}
        fill={COLORS.outline}
        fontSize={16}
        fontWeight={900}
      >
        Handle = Base/Gate Signal
      </text>
      <text
        x={955}
        y={678}
        fill={COLORS.outline}
        fontSize={16}
        fontWeight={900}
      >
        Water Flow = Collector Current
      </text> */}
    </g>
  );
}

export function WaterFlowLabel() {
  return (
    <>
      <line
        x1={LABEL.waterFlow.arrowX1}
        y1={LABEL.waterFlow.arrowY1}
        x2={LABEL.waterFlow.arrowX2}
        y2={LABEL.waterFlow.arrowY2}
        stroke={COLORS.outline}
        strokeWidth={STROKE.wire}
        markerEnd="url(#arrow)"
      />

      <text
        x={LABEL.waterFlow.titleX}
        y={LABEL.waterFlow.titleY}
        fill={COLORS.outline}
        fontSize={33}
        fontWeight={900}
      >
        WATER FLOW
      </text>

      <text
        x={LABEL.waterFlow.titleX}
        y={LABEL.waterFlow.subY}
        fill={COLORS.outline}
        fontSize={25}
        fontWeight={900}
      >
        (CURRENT FLOW)
      </text>
    </>
  );
}
