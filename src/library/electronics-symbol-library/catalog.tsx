import {
  ACVoltageSourceSymbol,
  BatterySingleCellSymbol,
  BatterySymbol,
  DCVoltageSourceV1Symbol,
} from "./sources";
import { BridgeRectifierSymbol } from "./rectifiers";
import {
  DiacSymbol,
  TriacSymbol,
} from "./thyristors";
import {
  DiodeSymbol,
  DiodeZenerSymbol,
  LEDSymbol,
  PhotodiodeSymbol,
} from "./diodes";
import { EarthGroundSymbol } from "./grounds";
import { InductorSymbol } from "./inductors";
import {
  JFETNChannelSymbol,
  JFETPChannelSymbol,
} from "./jfets";
import {
  NChannelMosfetSymbol,
  PChannelMosfetSymbol,
} from "./mosfets";
import {
  OptocouplerTransistorOutputSymbol,
  OptocouplerTriacOutputSymbol,
} from "./optocouplers";
import {
  NPNTransistorSymbol,
  PNPTransistorSymbol,
} from "./transistors";
import {
  PhotoResistorSymbol,
  Potentiometer100OhmSymbol,
  PotentiometerSymbol,
  ResistorSymbol,
} from "./passive";
import { PolarizedCapacitorSymbol } from "./capacitors";
import {
  DPDTSwitchSymbol,
  DPDTSymbol,
  DPSTSwitchSymbol,
  DPSTSymbol,
  SPDTSwitchSymbol,
  SPDTSymbol,
  SPSTSwitchSymbol,
  SPSTSymbol,
} from "./switch-topology";
import {
  LM317VoltageRegulatorSymbol,
  OpAmpSymbol,
  PWMSymbol,
  Timer555Symbol,
  VoltageRegulatorSymbol,
} from "./control-ics";
import {
  Transformer1PCenterTappedSymbol,
  Transformer1PSymbol,
  TransformerCenterTapV1Symbol,
  TransformerV1Symbol,
} from "./transformers";
import type { ElectronicsSymbolEntry } from "./shared";

export const electronicsSymbolCatalog = [
  { title: "Diode", category: "Diodes", component: <DiodeSymbol /> },
  { title: "Diode - Light Emitting (LED)", category: "Diodes", component: <LEDSymbol /> },
  { title: "Diode - Photodiode", category: "Diodes", component: <PhotodiodeSymbol /> },
  { title: "Diode - Zener", category: "Diodes", component: <DiodeZenerSymbol /> },
  { title: "Diac", category: "Thyristor Family", component: <DiacSymbol /> },
  { title: "Triac", category: "Thyristor Family", component: <TriacSymbol /> },
  { title: "N Channel MOSFET", category: "MOSFETs", component: <NChannelMosfetSymbol /> },
  { title: "P Channel MOSFET", category: "MOSFETs", component: <PChannelMosfetSymbol /> },
  { title: "JFET N Channel", category: "JFETs", component: <JFETNChannelSymbol /> },
  { title: "JFET P Channel", category: "JFETs", component: <JFETPChannelSymbol /> },
  { title: "Transistor NPN", category: "Transistors", component: <NPNTransistorSymbol /> },
  { title: "Transistor PNP", category: "Transistors", component: <PNPTransistorSymbol /> },
  {
    title: "Optocoupler - Transistor Output",
    category: "Optocouplers",
    component: <OptocouplerTransistorOutputSymbol />,
  },
  {
    title: "Optocoupler - Triac Output",
    category: "Optocouplers",
    component: <OptocouplerTriacOutputSymbol />,
  },
  { title: "Resistor", category: "Passive Components", component: <ResistorSymbol /> },
  { title: "Potentiometer", category: "Passive Components", component: <PotentiometerSymbol /> },
  {
    title: "Potentiometer 100 Ohm",
    category: "Passive Components",
    component: <Potentiometer100OhmSymbol />,
  },
  {
    title: "Resistor - Light Dependent (Photo Resistor)",
    category: "Passive Components",
    component: <PhotoResistorSymbol />,
  },
  { title: "Inductor", category: "Passive Components", component: <InductorSymbol /> },
  {
    title: "Polarized Capacitor",
    category: "Passive Components",
    component: <PolarizedCapacitorSymbol />,
  },
  { title: "AC Voltage Source", category: "Sources", component: <ACVoltageSourceSymbol /> },
  { title: "Battery", category: "Sources", component: <BatterySymbol /> },
  { title: "Battery - Single Cell", category: "Sources", component: <BatterySingleCellSymbol /> },
  { title: "DC Voltage Source V1", category: "Sources", component: <DCVoltageSourceV1Symbol /> },
  { title: "Bridge Rectifier", category: "Rectifiers", component: <BridgeRectifierSymbol /> },
  { title: "Earth Ground", category: "Grounds", component: <EarthGroundSymbol /> },
  { title: "Transformer 1P", category: "Transformers", component: <Transformer1PSymbol /> },
  {
    title: "Transformer 1P - with Center Tapping",
    category: "Transformers",
    component: <Transformer1PCenterTappedSymbol />,
  },
  { title: "Transformer V1", category: "Transformers", component: <TransformerV1Symbol /> },
  {
    title: "Transformer Center Tap V1",
    category: "Transformers",
    component: <TransformerCenterTapV1Symbol />,
  },
  { title: "SPST Symbol", category: "Switch Topology", component: <SPSTSymbol /> },
  { title: "SPST Switch Symbol", category: "Switch Topology", component: <SPSTSwitchSymbol /> },
  { title: "SPDT Symbol", category: "Switch Topology", component: <SPDTSymbol /> },
  { title: "SPDT Switch Symbol", category: "Switch Topology", component: <SPDTSwitchSymbol /> },
  { title: "DPST Symbol", category: "Switch Topology", component: <DPSTSymbol /> },
  { title: "DPST Switch Symbol", category: "Switch Topology", component: <DPSTSwitchSymbol /> },
  { title: "DPDT Symbol", category: "Switch Topology", component: <DPDTSymbol /> },
  { title: "DPDT Switch Symbol", category: "Switch Topology", component: <DPDTSwitchSymbol /> },
  { title: "PWM", category: "Control ICs", component: <PWMSymbol /> },
  { title: "555 Timer", category: "Control ICs", component: <Timer555Symbol /> },
  {
    title: "Operational Amplifier",
    category: "Control ICs",
    component: <OpAmpSymbol />,
  },
  { title: "Voltage Regulator", category: "Control ICs", component: <VoltageRegulatorSymbol /> },
  {
    title: "LM317 Voltage Regulator",
    category: "Control ICs",
    component: <LM317VoltageRegulatorSymbol />,
  },
] satisfies ElectronicsSymbolEntry[];
