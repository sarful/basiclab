import { multimeterGeometry } from "./multimeterGeometry";

const MICRO = "\u03bc";

export type MultimeterDialStopId =
  | "off"
  | "dcv_1000"
  | "dcv_200"
  | "dcv_20"
  | "dcv_2000m"
  | "dcv_200m"
  | "ohm_2000k"
  | "ohm_200k"
  | "ohm_20k"
  | "ohm_2000"
  | "ohm_200"
  | "diode"
  | "acv_750"
  | "acv_200"
  | "dca_200u"
  | "dca_2000u"
  | "dca_20m"
  | "dca_200m"
  | "dca_10a";

export type MultimeterDialTone = "neutral" | "green" | "red";

export type MultimeterDialStopLayout = {
  dotX: number;
  dotY: number;
  id: MultimeterDialStopId;
  label: string;
  labelAngle?: number;
  labelRadius?: number;
  labelSize?: number;
  legendText?: string;
  tone?: MultimeterDialTone;
};

export function getDialStopAngle(dotX: number, dotY: number) {
  const { center } = multimeterGeometry.dial;
  return (Math.atan2(dotY - center.y, dotX - center.x) * 180) / Math.PI;
}

function roundStop(value: number) {
  return Number(value.toFixed(4));
}

function buildAngleSeries(startAngle: number, endAngle: number, count: number) {
  if (count <= 1) return [startAngle];

  const step = (endAngle - startAngle) / (count - 1);

  return Array.from({ length: count }, (_, index) =>
    roundStop(startAngle + step * index),
  );
}

function dialStopPoint(angle: number) {
  const { center, outerRadius } = multimeterGeometry.dial;
  const radius = outerRadius * 1.015;
  const radians = (angle * Math.PI) / 180;

  return {
    dotX: roundStop(center.x + Math.cos(radians) * radius),
    dotY: roundStop(center.y + Math.sin(radians) * radius),
  };
}

const globalStopAngles = buildAngleSeries(-165, 177, 19);

export const multimeterStopLayout: MultimeterDialStopLayout[] = [
  {
    id: "dcv_1000",
    label: "1000V",
    legendText: "1000",
    ...dialStopPoint(globalStopAngles[3]),
    labelAngle: globalStopAngles[3],
    labelRadius: 232,
    labelSize: 10,
    tone: "neutral",
  },
  {
    id: "off",
    label: "OFF",
    ...dialStopPoint(globalStopAngles[4]),
    tone: "red",
  },
  {
    id: "acv_750",
    label: "750V AC",
    legendText: "750",
    ...dialStopPoint(globalStopAngles[5]),
    labelAngle: globalStopAngles[5],
    labelRadius: 234,
    labelSize: 10,
    tone: "neutral",
  },
  {
    id: "dcv_200",
    label: "200V",
    legendText: "200",
    ...dialStopPoint(globalStopAngles[2]),
    labelAngle: globalStopAngles[2],
    labelRadius: 232,
    labelSize: 10,
    tone: "neutral",
  },
  {
    id: "acv_200",
    label: "200V AC",
    legendText: "200",
    ...dialStopPoint(globalStopAngles[6]),
    labelAngle: globalStopAngles[6],
    labelRadius: 234,
    labelSize: 10,
    tone: "neutral",
  },
  {
    id: "dcv_20",
    label: "20V",
    legendText: "20",
    ...dialStopPoint(globalStopAngles[1]),
    labelAngle: globalStopAngles[1],
    labelRadius: 232,
    labelSize: 10,
    tone: "neutral",
  },
  {
    id: "dca_200u",
    label: "200uA",
    legendText: `200${MICRO}`,
    ...dialStopPoint(globalStopAngles[7]),
    labelAngle: globalStopAngles[7],
    labelRadius: 238,
    labelSize: 10,
    tone: "green",
  },
  {
    id: "dcv_2000m",
    label: "2000mV",
    legendText: "2000m",
    ...dialStopPoint(globalStopAngles[0]),
    labelAngle: globalStopAngles[0],
    labelRadius: 232,
    labelSize: 10,
    tone: "neutral",
  },
  {
    id: "dca_2000u",
    label: "2000uA",
    legendText: `2000${MICRO}`,
    ...dialStopPoint(globalStopAngles[8]),
    labelAngle: globalStopAngles[8],
    labelRadius: 236,
    labelSize: 10,
    tone: "green",
  },
  {
    id: "dcv_200m",
    label: "200mV",
    legendText: "200m",
    ...dialStopPoint(globalStopAngles[18]),
    labelAngle: globalStopAngles[18],
    labelRadius: 232,
    labelSize: 10,
    tone: "neutral",
  },
  {
    id: "dca_20m",
    label: "20mA",
    legendText: "20m",
    ...dialStopPoint(globalStopAngles[9]),
    labelAngle: globalStopAngles[9],
    labelRadius: 238,
    labelSize: 10,
    tone: "green",
  },
  {
    id: "ohm_2000k",
    label: "2000k",
    legendText: "2000k",
    ...dialStopPoint(globalStopAngles[17]),
    labelAngle: globalStopAngles[17],
    labelRadius: 232,
    labelSize: 10,
    tone: "green",
  },
  {
    id: "dca_200m",
    label: "200mA",
    legendText: "200m",
    ...dialStopPoint(globalStopAngles[10]),
    labelAngle: globalStopAngles[10],
    labelRadius: 238,
    labelSize: 10,
    tone: "green",
  },
  {
    id: "ohm_200k",
    label: "200k",
    legendText: "200k",
    ...dialStopPoint(globalStopAngles[16]),
    labelAngle: globalStopAngles[16],
    labelRadius: 232,
    labelSize: 10,
    tone: "green",
  },
  {
    id: "ohm_20k",
    label: "20k",
    legendText: "20k",
    ...dialStopPoint(globalStopAngles[15]),
    labelAngle: globalStopAngles[15],
    labelRadius: 232,
    labelSize: 10,
    tone: "green",
  },
  {
    id: "dca_10a",
    label: "10A",
    ...dialStopPoint(globalStopAngles[11]),
    tone: "red",
  },
  {
    id: "ohm_2000",
    label: "2000 ohm",
    legendText: "2000",
    ...dialStopPoint(globalStopAngles[14]),
    labelAngle: globalStopAngles[14],
    labelRadius: 232,
    labelSize: 10,
    tone: "green",
  },
  {
    id: "ohm_200",
    label: "200 ohm",
    legendText: "200",
    ...dialStopPoint(globalStopAngles[13]),
    labelAngle: globalStopAngles[13],
    labelRadius: 232,
    labelSize: 10,
    tone: "green",
  },
  {
    id: "diode",
    label: "Diode",
    ...dialStopPoint(globalStopAngles[12]),
    tone: "red",
  },
] as const;
