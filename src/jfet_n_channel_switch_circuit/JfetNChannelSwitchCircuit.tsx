"use client";

import BackgroundPixelGred from "../library/background_pixel_gred";
import LEDSymbol from "../library/electronics-symbol-library/diodes/LEDSymbol";
import NChannelMosfetSymbol from "../library/electronics-symbol-library/mosfets/NChannelMosfetSymbol";
import ResistorSymbol from "../library/electronics-symbol-library/passive/ResistorSymbol";
import DCVoltageSourceV1Symbol from "../library/electronics-symbol-library/sources/DCVoltageSourceV1Symbol";
import SPSTSwitchSymbol from "../library/electronics-symbol-library/switch-topology/SPSTSwitchSymbol";

export default function JfetNChannelSwitchCircuit() {
  const stageWidth = 760;
  const stageHeight = 700;
  const boardPadding = 16;
  const boardMinHeight = 700;

  // Source and shared rails.
  const sourceWidth = 110;
  const sourceHeight = 150;
  const sourceX = 64;
  const sourceY = 210;
  const sourceTerminalX = sourceX + (57 / 150) * sourceWidth;
  const sourceTopEdgeY = sourceY;
  const sourceBottomEdgeY = sourceY + sourceHeight;
  const positiveRailY = 96;
  const negativeRailY = 580;
  const wireStroke = 1.6;

  // Right-side load branch.
  const rLedX = 550;
  const rLedY = 28;
  const rLedWidth = 150;
  const rLedHeight = 120;
  const rLedTerminalX = rLedX + 76.46;
  const rLedTopTerminalY = rLedY + 90;
  const rLedBottomTerminalY = rLedY + 151.76;
  const rLedLabelX = rLedX + 30;
  const rLedLabelY = rLedY + 66;
  const rLedValueX = rLedX + 30;
  const rLedValueY = rLedY + 90;

  const ledX = 499;
  const ledY = 250;
  const ledWidth = 130;
  const ledHeight = 110;
  const ledCenterX = ledX + 86.45;
  const ledTopTerminalY = ledY;
  const ledBottomTerminalY = ledY + 104.51;

  // N-channel MOSFET placement with real G, D, and S anchor calculations.
  const mosfetWidth = 190;
  const mosfetHeight = 240;
  const mosfetX = 500;
  const mosfetY = 345;
  const gateTerminalX = mosfetX + ((0 + 10) / 61) * mosfetWidth;
  const gateTerminalY = mosfetY + ((25 + 10) / 71) * mosfetHeight;
  const drainTerminalX = mosfetX + ((30 + 10) / 61) * mosfetWidth;
  const drainTerminalY = mosfetY + ((0 + 10) / 71) * mosfetHeight;
  const sourceTerminalMosfetX = mosfetX + ((30 + 10) / 61) * mosfetWidth;
  const sourceTerminalMosfetY = mosfetY + ((50 + 10) / 71) * mosfetHeight;
  const mosfetLabelX = mosfetX + 120;
  const mosfetLabelY = mosfetY + 128;
  const mosfetModelY = mosfetY + 152;

  // Gate-drive branch.
  const gateResistorX = 340;
  const gateResistorY = 120;
  const gateResistorWidth = 150;
  const gateResistorHeight = 120;
  const gateResistorTerminalX = gateResistorX + 76.46;
  const gateResistorTopTerminalY = gateResistorY + 16.13;
  const gateResistorBottomTerminalY = gateResistorY + 111.76;
  const gateResistorLabelX = gateResistorX + 30;
  const gateResistorLabelY = gateResistorY + 64;
  const gateResistorValueX = gateResistorX + 30;
  const gateResistorValueY = gateResistorY + 88;

  const buttonX = 340;
  const buttonY = 360;
  const buttonWidth = 190;
  const buttonHeight = 130;
  const buttonTerminalX = buttonX;
  const buttonUpperTerminalY = buttonY + 150;
  const buttonLowerTerminalY = buttonY + 62.1;

  const gateNodeX = gateResistorTerminalX;
  const gateNodeY = gateTerminalY;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 24,
        border: "1px solid #dbe3ef",
        padding: boardPadding,
        minHeight: boardMinHeight,
        width: "100%",
      }}
    >
      <svg
        width={stageWidth}
        height={stageHeight}
        viewBox={`0 0 ${stageWidth} ${stageHeight}`}
        preserveAspectRatio="xMidYMin meet"
        role="img"
        aria-label="N-channel MOSFET switch circuit"
        style={{
          display: "block",
          width: "100%",
          maxWidth: `${stageWidth}px`,
          height: "auto",
          margin: "0 auto",
        }}
      >
        <BackgroundPixelGred
          width={stageWidth}
          height={stageHeight}
          backgroundColor="#ffffff"
          minor={20}
          major={100}
          showLabels={true}
          showBorder={true}
          borderColor="#dbe3ef"
          borderStrokeWidth={1}
        />

        {/* Main rails and MOSFET switch path */}
        <g
          stroke="#111827"
          strokeWidth={wireStroke}
          fill="none"
          strokeLinecap="round"
        >
          <line
            x1={sourceTerminalX}
            y1={sourceTopEdgeY + 35}
            x2={sourceTerminalX}
            y2={positiveRailY}
          />
          <line
            x1={sourceTerminalX}
            y1={positiveRailY}
            x2={rLedTerminalX}
            y2={positiveRailY}
          />
          <line
            x1={sourceTerminalX}
            y1={sourceBottomEdgeY - 45}
            x2={sourceTerminalX}
            y2={negativeRailY}
          />
          <line
            x1={sourceTerminalX}
            y1={negativeRailY}
            x2={sourceTerminalMosfetX}
            y2={negativeRailY}
          />
          <line
            x1={sourceTerminalMosfetX + 1}
            y1={sourceTerminalMosfetY - 90}
            x2={sourceTerminalMosfetX + 1}
            y2={negativeRailY}
          />
          <line
            x1={rLedTerminalX}
            y1={positiveRailY}
            x2={rLedTerminalX}
            y2={rLedTopTerminalY}
          />
          <line
            x1={rLedTerminalX}
            y1={rLedBottomTerminalY}
            x2={rLedTerminalX}
            y2={ledTopTerminalY}
          />

          {/* Gate-control branch */}
          <line
          // x1={gateResistorTerminalX - 77}
          // y1={positiveRailY}
          // x2={gateResistorTerminalX - 77}
          // y2={gateResistorTopTerminalY + 65}
          />

          <line
          // x1={buttonTerminalX}
          // y1={buttonLowerTerminalY - 140}
          // x2={buttonTerminalX}
          // y2={gateNodeY - 40}
          />
          <line
          // x1={buttonTerminalX}
          // y1={gateNodeY - 63}
          // x2={gateNodeX + 130}
          // y2={gateNodeY - 63}
          />
          <line
            x1={buttonTerminalX}
            y1={buttonUpperTerminalY - 40}
            x2={buttonTerminalX}
            y2={negativeRailY}
          />
        </g>

        <svg
          x={sourceX}
          y={sourceY}
          width={sourceWidth}
          height={sourceHeight}
          viewBox={`0 0 ${sourceWidth} ${sourceHeight}`}
          overflow="visible"
        >
          <DCVoltageSourceV1Symbol
            width={sourceWidth}
            height={sourceHeight}
            label="VDD source"
          />
        </svg>

        <svg
          x={gateResistorX}
          y={gateResistorY}
          width={gateResistorWidth}
          height={gateResistorHeight}
          viewBox={`0 0 ${gateResistorWidth} ${gateResistorHeight}`}
          overflow="visible"
        >
          <g
            transform={`translate(${gateResistorWidth / 2} ${gateResistorHeight / 2}) rotate(90)`}
          >
            <ResistorSymbol
              width={gateResistorHeight}
              height={gateResistorWidth}
              label="RG"
            />
          </g>
        </svg>
        <g
          fill="#111827"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="700"
        >
          <text x={gateResistorLabelX} y={gateResistorLabelY} fontSize="18">
            RG
          </text>
          <text x={gateResistorValueX} y={gateResistorValueY} fontSize="16">
            1M
          </text>
        </g>

        <svg
          x={buttonX + 0.5}
          y={buttonY - 40}
          width={buttonWidth}
          height={buttonHeight}
          viewBox={`0 0 ${buttonWidth} ${buttonHeight}`}
          overflow="visible"
        >
          <g
            transform={`translate(${buttonWidth / 2} ${buttonHeight / 2}) rotate(90)`}
          >
            <SPSTSwitchSymbol
              width={buttonHeight}
              height={buttonWidth}
              label="SW1"
            />
          </g>
        </svg>

        <svg
          x={rLedX + 76}
          y={rLedY}
          width={rLedWidth}
          height={rLedHeight}
          viewBox={`0 0 ${rLedWidth} ${rLedHeight}`}
          overflow="visible"
        >
          <g
            transform={`translate(${rLedWidth / 2} ${rLedHeight / 2}) rotate(90)`}
          >
            <ResistorSymbol
              width={rLedHeight}
              height={rLedWidth}
              label="RLED"
            />
          </g>
        </svg>
        <g
          fill="#111827"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="700"
        >
          <text x={rLedLabelX} y={rLedLabelY} fontSize="18">
            R_LED
          </text>
          <text x={rLedValueX} y={rLedValueY} fontSize="16">
            330
          </text>
        </g>

        <svg
          x={ledX + 135}
          y={ledY - 80}
          width={ledWidth}
          height={ledHeight}
          viewBox={`0 0 ${ledWidth} ${ledHeight}`}
          overflow="visible"
        >
          <g
            transform={`translate(${ledWidth / 2} ${ledHeight / 2}) rotate(90)`}
          >
            <LEDSymbol width={ledHeight} height={ledWidth} label="LED" />
          </g>
        </svg>

        <svg
          x={mosfetX}
          y={mosfetY - 80}
          width={mosfetWidth}
          height={mosfetHeight}
          viewBox={`0 0 ${mosfetWidth} ${mosfetHeight}`}
          overflow="visible"
        >
          <NChannelMosfetSymbol
            width={mosfetWidth}
            height={mosfetHeight}
            label="Q1 N-Channel MOSFET"
          />
        </svg>
        <g
          fill="#111827"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="700"
        >
          <text x={mosfetLabelX} y={mosfetLabelY} fontSize="20">
            Q1
          </text>
          <text x={mosfetLabelX} y={mosfetModelY} fontSize="18">
            MOSFET N
          </text>
        </g>
      </svg>
    </div>
  );
}
