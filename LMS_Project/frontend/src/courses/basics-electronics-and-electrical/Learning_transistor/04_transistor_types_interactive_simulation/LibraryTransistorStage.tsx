"use client";

import type { ReactNode } from "react";

import {
  JFETNChannelSymbol,
  JFETPChannelSymbol,
  NChannelMosfetSymbol,
  NPNTransistorSymbol,
  PChannelMosfetSymbol,
  PNPTransistorSymbol,
} from "@/src/library";

import ElectronFlowOverlay from "./ElectronFlowOverlay";
import type { BjtType, Family, FetChannel, FetType } from "./types";

type LibraryTransistorStageProps = {
  family: Family;
  bjtType: BjtType;
  fetType: FetType;
  fetChannel: FetChannel;
  active: boolean;
};

function SelectedSymbol({
  family,
  bjtType,
  fetType,
  fetChannel,
}: LibraryTransistorStageProps) {
  if (family === "BJT") {
    return bjtType === "NPN" ? (
      <NPNTransistorSymbol width={340} height={340} />
    ) : (
      <PNPTransistorSymbol width={340} height={340} />
    );
  }

  if (fetType === "JFET") {
    return fetChannel === "N-Channel" ? (
      <JFETNChannelSymbol width={340} height={340} />
    ) : (
      <JFETPChannelSymbol width={340} height={340} />
    );
  }

  return fetChannel === "N-Channel" ? (
    <NChannelMosfetSymbol width={340} height={320} />
  ) : (
    <PChannelMosfetSymbol width={340} height={320} />
  );
}

function SymbolFrame({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative flex h-[340px] w-[340px] items-center justify-center">
      {children}
    </div>
  );
}

export default function LibraryTransistorStage(
  props: LibraryTransistorStageProps,
) {
  return (
    <div className="flex min-h-[430px] items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-inner">
      <div className="flex w-full items-center justify-center rounded-[2rem] bg-white p-6 shadow-sm">
        <SymbolFrame>
          <SelectedSymbol {...props} />
          <ElectronFlowOverlay {...props} />
        </SymbolFrame>
      </div>
    </div>
  );
}
