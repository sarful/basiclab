import {
  STAR_DELTA_CONTROL_COLORS,
  STAR_DELTA_CONTROL_GEOMETRY,
  STAR_DELTA_CONTROL_STAGE,
  STAR_DELTA_CONTROL_STROKES,
  buildStarDeltaControlPaths,
} from "./control-diagram-geometry";
import { resolveFlowStateLabel, resolveModeLabel } from "./state";

type WireState = "active" | "inactive" | "fault";

export type StarDeltaControlDiagramSvgOptions = {
  mcbOn?: boolean;
  overloadTripped?: boolean;
  mainOn?: boolean;
  timerOn?: boolean;
  starOn?: boolean;
  deltaOn?: boolean;
  transferOpen?: boolean;
  flowStateLabel?: string;
  startPressed?: boolean;
  stopPressed?: boolean;
};

function resolveWireColor(state: WireState) {
  if (state === "fault") return STAR_DELTA_CONTROL_COLORS.faultLineColor;
  if (state === "active") return STAR_DELTA_CONTROL_COLORS.activeLineColor;
  return STAR_DELTA_CONTROL_COLORS.inactiveLineColor;
}

function attrs(input: Record<string, string | number | boolean | undefined>) {
  return Object.entries(input)
    .filter(([, value]) => value !== undefined && value !== false)
    .map(([key, value]) => `${key}="${String(value)}"`)
    .join(" ");
}

function group(content: string, transform?: string) {
  return `<g${transform ? ` transform="${transform}"` : ""}>${content}</g>`;
}

function line(x1: number, y1: number, x2: number, y2: number, stroke: string, strokeWidth: number) {
  return `<line ${attrs({ x1, y1, x2, y2, stroke, "stroke-width": strokeWidth, "stroke-linecap": "round" })} />`;
}

function text(x: number, y: number, value: string, opts?: Record<string, string | number>) {
  return `<text ${attrs({
    x,
    y,
    fill: opts?.fill ?? "#111111",
    "font-size": opts?.fontSize ?? 12,
    "font-weight": opts?.fontWeight,
    "text-anchor": opts?.textAnchor,
  })}>${value}</text>`;
}

function circle(cx: number, cy: number, r: number, stroke: string, strokeWidth: number, fill = "#ffffff") {
  return `<circle ${attrs({ cx, cy, r, fill, stroke, "stroke-width": strokeWidth })} />`;
}

function path(d: string, stroke: string, strokeWidth: number, extra?: Record<string, string | number>) {
  return `<path ${attrs({
    d,
    fill: "none",
    stroke,
    "stroke-width": strokeWidth,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    ...extra,
  })} />`;
}

function activePath(d: string, state: WireState) {
  if (state === "inactive") return "";
  return path(d, resolveWireColor(state), STAR_DELTA_CONTROL_STROKES.wireStroke + 1, {
    opacity: 0.9,
  });
}

function renderMcb2P(x: number, y: number, scale: number, on: boolean) {
  const cableStroke = STAR_DELTA_CONTROL_STROKES.symbolStroke;
  const contactLift = on ? 0 : -6;
  const content = [
    path("M0 10h12.5", STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke),
    path("M50 10H37.5", STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke),
    circle(15, 10, 2.5, STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke),
    circle(35, 10, 2.5, STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke),
    path("M0 30h12.5", STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke),
    path("M50 30H37.5", STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke),
    circle(15, 30, 2.5, STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke),
    circle(35, 30, 2.5, STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke),
    path(`M35 ${5 + contactLift}q-5-2.5-10-2.5-5 0-10 2.5`, STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke),
    path("M25 2.5v20", STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke, { "stroke-dasharray": "1.5 2" }),
    path(`M35 ${25 + contactLift}q-5-2.5-10-2.5-5 0-10 2.5`, STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke),
    text(2, 6.81, "1", { fontSize: STAR_DELTA_CONTROL_STROKES.symbolTextSize, textAnchor: "start" }),
    text(48, 6.81, "2", { fontSize: STAR_DELTA_CONTROL_STROKES.symbolTextSize, textAnchor: "end" }),
    text(2, 26.81, "3", { fontSize: STAR_DELTA_CONTROL_STROKES.symbolTextSize, textAnchor: "start" }),
    text(48, 26.81, "4", { fontSize: STAR_DELTA_CONTROL_STROKES.symbolTextSize, textAnchor: "end" }),
  ].join("");
  return group(content, `translate(${x}, ${y}) scale(${scale})`);
}

function renderPushButtonNO(x: number, y: number, scale: number, pressed: boolean, terminalA = "13", terminalB = "14") {
  const cableStroke = STAR_DELTA_CONTROL_STROKES.symbolStroke;
  const content = [
    path("M0 10h12.5", STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke),
    path("M50 10H37.5", STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke),
    circle(15, 10, 2.5, STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke),
    circle(35, 10, 2.5, STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke),
    pressed
      ? path("M15 10h20", STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke)
      : path("M15 5h20", STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke),
    pressed
      ? path("M25 5v5", STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke)
      : path("M25 0v5", STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke),
    text(2, 6.81, terminalA, { fontSize: STAR_DELTA_CONTROL_STROKES.symbolTextSize, textAnchor: "start" }),
    text(48, 6.81, terminalB, { fontSize: STAR_DELTA_CONTROL_STROKES.symbolTextSize, textAnchor: "end" }),
  ].join("");
  return group(content, `translate(${x}, ${y}) scale(${scale}) rotate(-90 25 10)`);
}

function renderPushButtonNC(x: number, y: number, scale: number, pressed: boolean, terminalA = "11", terminalB = "12") {
  const cableStroke = STAR_DELTA_CONTROL_STROKES.symbolStroke;
  const content = [
    path("M0 10h12.5", STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke),
    path("M50 10H37.5", STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke),
    circle(15, 10, 2.5, STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke),
    circle(35, 10, 2.5, STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke),
    pressed
      ? path("M15 14h20", STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke)
      : path("M15 13h20", STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke),
    pressed
      ? path("M25 6v4", STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke)
      : path("M25 8v5", STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke),
    text(2, 6.81, terminalA, { fontSize: STAR_DELTA_CONTROL_STROKES.symbolTextSize, textAnchor: "start" }),
    text(48, 6.81, terminalB, { fontSize: STAR_DELTA_CONTROL_STROKES.symbolTextSize, textAnchor: "end" }),
  ].join("");
  return group(content, `translate(${x}, ${y}) scale(${scale}) rotate(-90 25 10)`);
}

function renderAuxiliaryNO(
  x: number,
  y: number,
  scale: number,
  closed: boolean,
  terminalA = "13",
  terminalB = "14",
) {
  const cableStroke = STAR_DELTA_CONTROL_STROKES.symbolStroke;
  const content = [
    path("M0 10h12.5", STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke),
    path("M50 10H37.5", STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke),
    circle(15, 10, 2.5, STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke),
    circle(35, 10, 2.5, STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke),
    closed
      ? path("M15 10h20", STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke)
      : `${path("M15 5h20", STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke)}${path("M25 0v5", STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke)}`,
    text(2, 6.81, terminalA, { fontSize: STAR_DELTA_CONTROL_STROKES.symbolTextSize, textAnchor: "start" }),
    text(48, 6.81, terminalB, { fontSize: STAR_DELTA_CONTROL_STROKES.symbolTextSize, textAnchor: "end" }),
  ].join("");
  return group(content, `translate(${x}, ${y}) scale(${scale}) rotate(-90 25 10)`);
}

function renderAuxiliaryNC(
  x: number,
  y: number,
  scale: number,
  closed: boolean,
  terminalA = "11",
  terminalB = "12",
) {
  const cableStroke = STAR_DELTA_CONTROL_STROKES.symbolStroke;
  const contactPart = closed
    ? `${path("M15 13h20", STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke)}${path("M25 8v5", STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke)}`
    : `${path("M15 14h20", STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke)}${path("M25 6v4", STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke)}`;
  const content = [
    path("M0 10h12.5", STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke),
    path("M50 10H37.5", STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke),
    circle(15, 10, 2.5, STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke),
    circle(35, 10, 2.5, STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke),
    contactPart,
    text(2, 6.81, terminalA, { fontSize: STAR_DELTA_CONTROL_STROKES.symbolTextSize, textAnchor: "start" }),
    text(48, 6.81, terminalB, { fontSize: STAR_DELTA_CONTROL_STROKES.symbolTextSize, textAnchor: "end" }),
  ].join("");
  return group(content, `translate(${x}, ${y}) scale(${scale}) rotate(-90 25 10)`);
}

function renderCoil(x: number, y: number, scale: number, label: string) {
  const cableStroke = STAR_DELTA_CONTROL_STROKES.symbolStroke;
  const content = [
    path("M10 30v20", STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke),
    path("M10 20V0", STAR_DELTA_CONTROL_COLORS.symbolColor, cableStroke),
    `<path ${attrs({ d: "M0 20h20v10H0z", fill: "white", stroke: STAR_DELTA_CONTROL_COLORS.symbolColor, "stroke-width": cableStroke })} />`,
    text(10, 27, label, { fontSize: STAR_DELTA_CONTROL_STROKES.symbolTextSize, fontWeight: 700, textAnchor: "middle" }),
    text(8, 9, "A1", { fontSize: STAR_DELTA_CONTROL_STROKES.symbolTextSize, textAnchor: "end" }),
    text(8, 46.81, "A2", { fontSize: STAR_DELTA_CONTROL_STROKES.symbolTextSize, textAnchor: "end" }),
  ].join("");
  return group(content, `translate(${x}, ${y}) scale(${scale})`);
}

export function renderStarDeltaControlDiagramSvg({
  mcbOn = true,
  overloadTripped = false,
  mainOn = false,
  timerOn = false,
  starOn = false,
  deltaOn = false,
  transferOpen = false,
  flowStateLabel,
  startPressed = false,
  stopPressed = false,
}: StarDeltaControlDiagramSvgOptions = {}) {
  const timerDone = timerOn && !starOn;
  const g = STAR_DELTA_CONTROL_GEOMETRY;
  const s = STAR_DELTA_CONTROL_STAGE;

  const upstreamState: WireState = !mcbOn
    ? "inactive"
    : overloadTripped
      ? "inactive"
      : mainOn || timerOn || starOn || deltaOn || transferOpen
        ? "active"
        : "inactive";
  const starState: WireState = !mcbOn ? "inactive" : overloadTripped ? "inactive" : starOn ? "active" : "inactive";
  const deltaState: WireState = !mcbOn ? "inactive" : overloadTripped ? "inactive" : deltaOn ? "active" : "inactive";
  const holdState: WireState = !mcbOn ? "inactive" : overloadTripped ? "inactive" : mainOn ? "active" : "inactive";
  const timerState: WireState = !mcbOn ? "inactive" : overloadTripped ? "inactive" : timerOn ? "active" : "inactive";
  const overloadState: WireState = !mcbOn ? "inactive" : overloadTripped ? "inactive" : mainOn || timerOn || starOn || deltaOn || transferOpen ? "active" : "inactive";
  const offState: WireState = !mcbOn ? "inactive" : overloadTripped ? "inactive" : mainOn || timerOn || starOn || deltaOn || transferOpen ? "active" : "inactive";
  const neutralState: WireState = !mcbOn ? "inactive" : overloadTripped ? "inactive" : mainOn || timerOn || starOn || deltaOn ? "active" : "inactive";
  const tripState: WireState = mcbOn && overloadTripped ? "fault" : "inactive";
  const paths = buildStarDeltaControlPaths();
  const stateLabel = flowStateLabel ?? resolveFlowStateLabel({ mcbOn, overloadTripped, transferOpen, deltaOn, starOn, timerOn, mainOn });
  const modeLabel = resolveModeLabel({ mcbOn, overloadTripped, transferOpen, deltaOn, starOn, mainOn });
  const contactsLabel = `${mainOn ? "K1 " : ""}${timerOn ? "T1 " : ""}${starOn ? "K3 " : ""}${deltaOn ? "K2" : ""}` || "Idle";

  return `
<svg viewBox="0 0 ${s.width} ${s.height}" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(${s.boardX}, ${s.boardY})">
    <rect x="0" y="0" width="${s.boardWidth}" height="${s.boardHeight}" rx="14" fill="#ffffff" stroke="#d1dae5" stroke-width="1" />
    ${activePath(paths.sourceToOnPath, upstreamState)}
    ${activePath(paths.onPushPath, upstreamState)}
    ${activePath(paths.holdSealPath, holdState)}
    ${activePath(paths.overloadFeedPath, overloadState)}
    ${activePath(paths.overloadContactPath, overloadState)}
    ${activePath(paths.offPath, offState)}
    ${activePath(paths.mainCoilPath, holdState)}
    ${activePath(paths.timerRungPath, timerState)}
    ${activePath(paths.starRungPath, starState)}
    ${activePath(paths.deltaRungPath, deltaState)}
    ${activePath(paths.deltaSealPath, deltaState)}
    ${activePath(paths.returnPath, neutralState)}
    ${activePath(paths.tripPath, tripState)}

    ${text(0, g.neutralTextY, "N", { fontSize: 18, fontWeight: 700 })}
    ${line(g.supplyLineStartX, g.neutralLineY, g.supplyLineEndX, g.neutralLineY, STAR_DELTA_CONTROL_COLORS.wireColor, STAR_DELTA_CONTROL_STROKES.wireStroke)}
    ${line(g.neutralRailStartX, g.neutralRailY, g.neutralRailEndX, g.neutralRailY, STAR_DELTA_CONTROL_COLORS.wireColor, STAR_DELTA_CONTROL_STROKES.wireStroke)}

    ${text(0, g.liveTextY, "L", { fontSize: 18, fontWeight: 700 })}
    ${line(g.supplyLineStartX, g.liveLineY, g.supplyLineEndX, g.liveLineY, STAR_DELTA_CONTROL_COLORS.wireColor, STAR_DELTA_CONTROL_STROKES.wireStroke)}

    ${renderMcb2P(g.mcbX, g.mcbY, 2, mcbOn)}
    ${text(116, 92, "MCB", { fontSize: 12, fontWeight: 700, fill: STAR_DELTA_CONTROL_COLORS.labelColor })}

    ${line(g.controlRiserX, g.liveLineY, g.controlRiserX, g.controlRiserEndY, STAR_DELTA_CONTROL_COLORS.wireColor, STAR_DELTA_CONTROL_STROKES.wireStroke)}

    ${renderPushButtonNO(g.onSwitchX, g.onSwitchY, 2, startPressed)}
    ${text(86, 182, "ON", { fontSize: 12, fontWeight: 700, fill: STAR_DELTA_CONTROL_COLORS.labelColor })}
    ${line(g.holdBranchStartX, g.holdBranchY, g.holdBranchEndX, g.holdBranchY, STAR_DELTA_CONTROL_COLORS.wireColor, STAR_DELTA_CONTROL_STROKES.wireStroke)}
    ${renderAuxiliaryNO(g.k1AuxX, g.k1AuxY, 2, mainOn, "13", "14")}
    ${text(246, 182, "K1", { fontSize: 12, fontWeight: 700, fill: STAR_DELTA_CONTROL_COLORS.labelColor })}
    ${line(g.holdReturnStartX, g.holdReturnY, g.holdReturnEndX, g.holdReturnY, STAR_DELTA_CONTROL_COLORS.wireColor, STAR_DELTA_CONTROL_STROKES.wireStroke)}
    ${line(g.controlRiserX, g.overloadRiserStartY, g.controlRiserX, g.overloadRiserEndY, STAR_DELTA_CONTROL_COLORS.wireColor, STAR_DELTA_CONTROL_STROKES.wireStroke)}

    ${renderAuxiliaryNC(g.overloadX, g.overloadY, 2, !overloadTripped, "95", "96")}
    ${text(110, 340, "O/L NC", { fontSize: 12, fontWeight: 700, fill: STAR_DELTA_CONTROL_COLORS.labelColor })}
    ${text(540, 850, stateLabel, { fontSize: 12, fontWeight: 700, fill: STAR_DELTA_CONTROL_COLORS.labelColor })}

    ${line(g.controlRiserX, g.offRiserStartY, g.controlRiserX, g.offRiserEndY, STAR_DELTA_CONTROL_COLORS.wireColor, STAR_DELTA_CONTROL_STROKES.wireStroke)}
    ${renderPushButtonNC(g.offSwitchX, g.offSwitchY, 2, stopPressed)}
    ${text(78, 462, "OFF", { fontSize: 12, fontWeight: 700, fill: STAR_DELTA_CONTROL_COLORS.labelColor })}

    ${line(g.controlRiserX, g.k1CoilRiserStartY, g.controlRiserX, g.k1CoilRiserEndY, STAR_DELTA_CONTROL_COLORS.wireColor, STAR_DELTA_CONTROL_STROKES.wireStroke)}
    ${line(g.k1BranchBusStartX, g.k1BranchBusY, g.k1BranchBusEndX, g.k1BranchBusY, STAR_DELTA_CONTROL_COLORS.wireColor, STAR_DELTA_CONTROL_STROKES.wireStroke)}
    ${renderCoil(g.k1CoilX, g.k1CoilY, 2, "K1")}
    ${text(166, 744, "K1", { fontSize: 12, fontWeight: 700, fill: STAR_DELTA_CONTROL_COLORS.labelColor })}
    ${renderCoil(g.t1CoilX, g.t1CoilY, 2, "T1")}
    ${text(288, 744, "T1", { fontSize: 12, fontWeight: 700, fill: STAR_DELTA_CONTROL_COLORS.labelColor })}
    ${line(g.t1A1WireX, g.t1A1WireStartY, g.t1A1WireX, g.t1A1WireEndY, STAR_DELTA_CONTROL_COLORS.wireColor, STAR_DELTA_CONTROL_STROKES.wireStroke)}
    <circle cx="${g.t1A1WireX}" cy="${g.t1A1WireStartY}" r="${STAR_DELTA_CONTROL_STROKES.wireStroke + 1}" fill="${STAR_DELTA_CONTROL_COLORS.wireColor}" />

    ${renderAuxiliaryNC(g.t1NcX, g.t1NcY, 2, !timerDone, "55", "56")}
    ${text(372, 592, "T", { fontSize: 12, fontWeight: 700, fill: STAR_DELTA_CONTROL_COLORS.labelColor })}
    ${line(g.t1NcFeedX, g.t1NcTopWireStartY, g.t1NcFeedX, g.t1NcTopWireEndY, STAR_DELTA_CONTROL_COLORS.wireColor, STAR_DELTA_CONTROL_STROKES.wireStroke)}

    ${renderCoil(g.k3CoilX, g.k3CoilY, 2, "K3")}
    ${text(426, 744, "K3", { fontSize: 12, fontWeight: 700, fill: STAR_DELTA_CONTROL_COLORS.labelColor })}
    ${line(g.k3A1WireX, g.k3A1WireStartY, g.k3A1WireX, g.k3A1WireEndY, STAR_DELTA_CONTROL_COLORS.wireColor, STAR_DELTA_CONTROL_STROKES.wireStroke)}
    <circle cx="${g.k3A1WireX}" cy="${g.k3A1WireStartY}" r="${STAR_DELTA_CONTROL_STROKES.wireStroke + 1}" fill="${STAR_DELTA_CONTROL_COLORS.wireColor}" />
    ${line(g.t1NcFeedX, g.t1NcBottomWireStartY, g.t1NcFeedX, g.t1NcBottomWireEndY, STAR_DELTA_CONTROL_COLORS.wireColor, STAR_DELTA_CONTROL_STROKES.wireStroke)}
    ${line(g.t1A2TerminalX, g.coilA2LinkY, g.k3A2TerminalX, g.coilA2LinkY, STAR_DELTA_CONTROL_COLORS.wireColor, STAR_DELTA_CONTROL_STROKES.wireStroke)}

    ${renderAuxiliaryNC(g.k2NcX, g.k2NcY, 2, !deltaOn, "11", "12")}
    ${text(392, 882, "K2", { fontSize: 12, fontWeight: 700, fill: STAR_DELTA_CONTROL_COLORS.labelColor })}
    ${line(g.k2NcFeedX, g.k2NcTopWireStartY, g.k2NcFeedX, g.k2NcTopWireEndY, STAR_DELTA_CONTROL_COLORS.wireColor, STAR_DELTA_CONTROL_STROKES.wireStroke)}

    ${renderAuxiliaryNO(g.t1NoX, g.t1NoY, 2, timerDone, "67", "68")}
    ${text(512, 592, "T", { fontSize: 12, fontWeight: 700, fill: STAR_DELTA_CONTROL_COLORS.labelColor })}
    ${line(g.t1NoFeedX, g.t1NoTopWireStartY, g.t1NoFeedX, g.t1NoTopWireEndY, STAR_DELTA_CONTROL_COLORS.wireColor, STAR_DELTA_CONTROL_STROKES.wireStroke)}
    ${line(g.t1NoFeedX, g.t1NoBottomWireStartY, g.t1NoFeedX, g.t1NoBottomWireEndY, STAR_DELTA_CONTROL_COLORS.wireColor, STAR_DELTA_CONTROL_STROKES.wireStroke)}

    ${renderAuxiliaryNO(g.k2NoX, g.k2NoY, 2, deltaOn, "13", "14")}
    ${text(636, 592, "K2", { fontSize: 12, fontWeight: 700, fill: STAR_DELTA_CONTROL_COLORS.labelColor })}
    ${line(g.k2NoTopLinkStartX, g.k2NoTopLinkY, g.k2NoTopLinkEndX, g.k2NoTopLinkY, STAR_DELTA_CONTROL_COLORS.wireColor, STAR_DELTA_CONTROL_STROKES.wireStroke)}
    ${line(g.k2NoBottomLinkStartX, g.k2NoBottomLinkY, g.k2NoBottomLinkEndX, g.k2NoBottomLinkY, STAR_DELTA_CONTROL_COLORS.wireColor, STAR_DELTA_CONTROL_STROKES.wireStroke)}

    ${renderCoil(g.k2CoilX, g.k2CoilY, 2, "K2")}
    ${text(548, 744, "K2", { fontSize: 12, fontWeight: 700, fill: STAR_DELTA_CONTROL_COLORS.labelColor })}
    ${line(g.k2A1WireX, g.k2A1WireStartY, g.k2A1WireX, g.k2A1WireEndY, STAR_DELTA_CONTROL_COLORS.wireColor, STAR_DELTA_CONTROL_STROKES.wireStroke)}
    <circle cx="${g.k2A1WireX}" cy="${g.k2A1WireStartY}" r="${STAR_DELTA_CONTROL_STROKES.wireStroke + 1}" fill="${STAR_DELTA_CONTROL_COLORS.wireColor}" />

    ${renderAuxiliaryNC(g.k3NcX, g.k3NcY, 2, !starOn, "11", "12")}
    ${text(512, 882, "K3", { fontSize: 12, fontWeight: 700, fill: STAR_DELTA_CONTROL_COLORS.labelColor })}
    ${line(g.k3NcFeedX, g.k3NcTopWireStartY, g.k3NcFeedX, g.k3NcTopWireEndY, STAR_DELTA_CONTROL_COLORS.wireColor, STAR_DELTA_CONTROL_STROKES.wireStroke)}
    ${line(g.k2NcFeedX, g.k2NcBottomWireStartY, g.k2NcFeedX, g.k2NcBottomWireEndY, STAR_DELTA_CONTROL_COLORS.wireColor, STAR_DELTA_CONTROL_STROKES.wireStroke)}
    ${line(g.k3NcFeedX, g.k3NcBottomWireStartY, g.k3NcFeedX, g.k3NcBottomWireEndY, STAR_DELTA_CONTROL_COLORS.wireColor, STAR_DELTA_CONTROL_STROKES.wireStroke)}

    ${line(g.neutralVerticalX, g.neutralVerticalStartY, g.neutralVerticalX, g.neutralVerticalEndY, STAR_DELTA_CONTROL_COLORS.wireColor, STAR_DELTA_CONTROL_STROKES.wireStroke)}
    ${line(g.controlRiserX, g.neutralReturnBusY, g.neutralVerticalX, g.neutralReturnBusY, STAR_DELTA_CONTROL_COLORS.wireColor, STAR_DELTA_CONTROL_STROKES.wireStroke)}
    ${line(g.controlRiserX, g.k1CoilBottomWireStartY, g.controlRiserX, g.k1CoilBottomWireEndY, STAR_DELTA_CONTROL_COLORS.wireColor, STAR_DELTA_CONTROL_STROKES.wireStroke)}
    ${line(g.controlRiserX, g.k1CoilBottomWireEndY, g.controlRiserX, g.neutralReturnBusY, STAR_DELTA_CONTROL_COLORS.wireColor, STAR_DELTA_CONTROL_STROKES.wireStroke)}

    ${text(0, s.boardHeight - 10, "Star-Delta Control Diagram Template", { fontSize: 11, fill: "#94a3b8" })}
    ${text(24, 834, "State", { fontSize: 14, fontWeight: 700 })}
    ${text(72, 834, stateLabel, { fontSize: 14, fill: overloadTripped ? STAR_DELTA_CONTROL_COLORS.faultLineColor : "#16a34a" })}
    ${text(24, 860, "Mode", { fontSize: 14, fontWeight: 700 })}
    ${text(72, 860, modeLabel, { fontSize: 14, fill: overloadTripped ? STAR_DELTA_CONTROL_COLORS.faultLineColor : "#16a34a" })}
    ${text(24, 886, "Contacts", { fontSize: 14, fontWeight: 700 })}
    ${text(88, 886, contactsLabel, { fontSize: 14, fill: "#52637a" })}
  </g>
</svg>`.trim();
}
