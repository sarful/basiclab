"use client";

import DigitalMultimeterDisplay from "./DigitalMultimeterDisplay";
import DigitalMultimeterFaceV2 from "./DigitalMultimeterFaceV2";
import DigitalMultimeterProbeJacks from "./DigitalMultimeterProbeJacks";
import type { MultimeterJackId } from "./DigitalMultimeterProbeJacks";
import DigitalMultimeterRotaryDial from "./DigitalMultimeterRotaryDial";
import type { MultimeterDialStopId } from "./DigitalMultimeterRotaryDial";
import DigitalMultimeterVectorBoard from "./DigitalMultimeterVectorBoard";

export type DigitalMultimeterCanvasSizeMode = "fit" | "actual";

export type DigitalMultimeterCanvasProps = {
  blackLeadJack?: MultimeterJackId;
  className?: string;
  displayValue?: string;
  redLeadJack?: MultimeterJackId;
  selectedStopId?: MultimeterDialStopId;
  showLeadRoutes?: boolean;
  sizeMode?: DigitalMultimeterCanvasSizeMode;
};

export default function DigitalMultimeterCanvas({
  blackLeadJack = "jack_com",
  className,
  displayValue = "000",
  redLeadJack = "jack_voma",
  selectedStopId = "off",
  showLeadRoutes = false,
  sizeMode = "fit",
}: DigitalMultimeterCanvasProps) {
  return (
    <div
      className={`relative mx-auto aspect-[558/966] w-full overflow-hidden rounded-[28px] xl:mx-0 ${
        sizeMode === "fit"
          ? "max-w-[440px] max-h-[calc(100vh-260px)] sm:max-w-[480px] sm:max-h-[calc(100vh-240px)] md:max-w-[520px] lg:max-w-[540px] xl:max-w-[560px]"
          : "max-w-[558px]"
      } ${className ?? ""}`}
    >
      <DigitalMultimeterVectorBoard className="absolute inset-0 h-full w-full" />
      <DigitalMultimeterDisplay
        className="absolute inset-0 h-full w-full"
        value={displayValue}
      />
      <DigitalMultimeterFaceV2
        className="absolute inset-0 h-full w-full"
        selectedStopId={selectedStopId}
      />
      <DigitalMultimeterRotaryDial
        className="absolute inset-0 h-full w-full"
        selectedStopId={selectedStopId}
        showStopMarkers={false}
        showTicks={false}
      />
      <DigitalMultimeterProbeJacks
        className="absolute inset-0 h-full w-full"
        redLeadJack={redLeadJack}
        blackLeadJack={blackLeadJack}
        showLeadRoutes={showLeadRoutes}
      />
    </div>
  );
}
