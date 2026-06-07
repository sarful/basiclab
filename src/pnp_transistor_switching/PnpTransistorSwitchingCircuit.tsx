import BackgroundPixelGred from "../library/background_pixel_gred";
import LEDSymbol from "../library/electronics-symbol-library/diodes/LEDSymbol";
import ResistorSymbol from "../library/electronics-symbol-library/passive/ResistorSymbol";
import DCVoltageSourceV1Symbol from "../library/electronics-symbol-library/sources/DCVoltageSourceV1Symbol";
import SPSTSwitchSymbol from "../library/electronics-symbol-library/switch-topology/SPSTSwitchSymbol";
import PNPTransistorSymbol from "../library/electronics-symbol-library/transistors/PNPTransistorSymbol";

export default function PnpTransistorSwitchingCircuit() {
  const stageWidth = 760;
  const stageHeight = 700;
  const boardPadding = 16;
  const boardMinHeight = 700;
  const rightBranchOffsetX = 40;

  // Source placement.
  const sourceWidth = 110;
  const sourceHeight = 150;
  const sourceX = 64;
  const sourceY = 210;
  const sourceTerminalX = sourceX + (57 / 150) * sourceWidth;
  const sourceTopEdgeY = sourceY;
  const sourcePositiveTerminalY = sourceY + (24 / 160) * sourceHeight;
  const sourceNegativeTerminalY = sourceY + (125 / 160) * sourceHeight;
  const sourceBottomEdgeY = sourceY + sourceHeight;

  // PNP transistor placement.
  const transistorWidth = 200;
  const transistorHeight = 200;
  const transistorEmitterTargetX = 580 + rightBranchOffsetX;
  const transistorEmitterTargetY = 440;
  const transistorEmitterOffsetX = ((30 + 10) / 71) * transistorWidth;
  const transistorEmitterOffsetY = ((60 + 10) / 81) * transistorHeight;
  const transistorX = transistorEmitterTargetX - transistorEmitterOffsetX;
  const transistorY = transistorEmitterTargetY - transistorEmitterOffsetY;
  const transistorBaseTerminalX =
    transistorX + ((4 + 10) / 71) * transistorWidth;
  const transistorBaseTerminalY =
    transistorY + ((30.5 + 10) / 81) * transistorHeight;
  const transistorCollectorTerminalX =
    transistorX + ((10 + 10) / 71) * transistorWidth;
  const transistorCollectorTerminalY =
    transistorY + ((10 + 10) / 81) * transistorHeight;
  const transistorEmitterTerminalX =
    transistorX + ((30 + 10) / 71) * transistorWidth;
  const transistorEmitterTerminalY =
    transistorY + ((10 - 88) / 91) * transistorHeight;
  const transistorLabelX = transistorX + 144;
  const transistorLabelY = transistorY + 102;
  const transistorModelY = transistorY + 126;

  // Load branch symbol placement.
  const ledX = 443 + rightBranchOffsetX;
  const ledY = 230;
  const ledWidth = 130;
  const ledHeight = 110;
  const ledCenterX = ledX + 86.45;
  const ledTopTerminalY = ledY;
  const ledBottomTerminalY = ledY + 104.51;

  const rLedX = 580 + rightBranchOffsetX;
  const rLedY = 20;
  const rLedWidth = 150;
  const rLedHeight = 120;
  const rLedTerminalX = rLedX + 76.46;
  const rLedTopTerminalY = rLedY + 16.13;
  const rLedBottomTerminalY = rLedY + 111.76;
  const rLedLabelX = rLedX + 36;
  const rLedLabelY = rLedY + 64;
  const rLedValueX = rLedX + 36;
  const rLedValueY = rLedY + 88;

  // Base control symbol placement.
  const pullUpX = 340;
  const pullUpY = 20;
  const pullUpWidth = 150;
  const pullUpHeight = 180;
  const pullUpTerminalX = pullUpX;
  const pullUpTopTerminalY = pullUpY + 130;
  const pullUpBottomTerminalY = pullUpY + 240;
  const pullUpLabelX = pullUpX + 34;
  const pullUpLabelY = pullUpY + 62;
  const pullUpValueX = pullUpX + 34;
  const pullUpValueY = pullUpY + 88;

  const buttonX = 340;
  const buttonY = 300;
  const buttonWidth = 190;
  const buttonHeight = 130;
  const buttonTerminalX = buttonX;
  const buttonUpperTerminalY = buttonY + 150;
  const buttonLowerTerminalY = buttonY + 62.1;

  // Shared wire geometry for the current PNP layout.
  const positiveRailY = 96;
  const negativeRailY = 560;
  const baseNodeX = pullUpTerminalX + 0;
  const baseNodeY = transistorBaseTerminalY;
  const wireStroke = 1.6;
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
        aria-label="PNP transistor switching circuit"
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
            x2={transistorEmitterTerminalX}
            y2={positiveRailY}
          />
          <line
            x1={transistorEmitterTerminalX}
            y1={positiveRailY}
            x2={transistorEmitterTerminalX}
            y2={transistorEmitterTerminalY}
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
            x2={rLedTerminalX - 77}
            y2={negativeRailY}
          />
          <line
            x1={rLedTerminalX - 77}
            y1={rLedBottomTerminalY + 300}
            x2={rLedTerminalX - 77}
            y2={negativeRailY}
          />
          <line
            x1={transistorCollectorTerminalX + 57}
            y1={transistorCollectorTerminalY - 5}
            x2={transistorCollectorTerminalX + 57}
            y2={ledBottomTerminalY - 70}
          />
          <line
            x1={transistorCollectorTerminalX + 57}
            y1={transistorCollectorTerminalY - 120}
            x2={transistorCollectorTerminalX + 57}
            y2={ledBottomTerminalY - 180}
          />

          <line
            x1={pullUpTerminalX}
            y1={pullUpTopTerminalY}
            x2={pullUpTerminalX}
            y2={positiveRailY}
          />
          <line
            x1={pullUpTerminalX}
            y1={pullUpBottomTerminalY}
            x2={pullUpTerminalX}
            y2={baseNodeY}
          />
          <line
            x1={baseNodeX}
            y1={baseNodeY}
            x2={transistorBaseTerminalX}
            y2={baseNodeY}
          />
          <line
            x1={buttonTerminalX}
            y1={buttonLowerTerminalY}
            x2={buttonTerminalX}
            y2={baseNodeY + 40}
          />

          <line
            x1={buttonTerminalX}
            y1={buttonUpperTerminalY}
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
            label="Vcc source"
          />
        </svg>

        <svg
          x={buttonX}
          y={buttonY}
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
          x={pullUpX}
          y={pullUpY}
          width={pullUpWidth}
          height={pullUpHeight}
          viewBox={`0 0 ${pullUpWidth} ${pullUpHeight}`}
          overflow="visible"
        >
          <g
            transform={`translate(${pullUpWidth / 2} ${pullUpHeight / 2}) rotate(90)`}
          >
            <ResistorSymbol
              width={pullUpHeight}
              height={pullUpWidth}
              label="RPU"
            />
          </g>
        </svg>
        <g
          fill="#111827"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="700"
        >
          <text x={pullUpLabelX} y={pullUpLabelY} fontSize="18">
            RPU
          </text>
          <text x={pullUpValueX} y={pullUpValueY} fontSize="16">
            100kΩ
          </text>
        </g>

        <svg
          x={rLedX}
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
            330Ω
          </text>
        </g>

        <svg
          x={ledX}
          y={ledY}
          width={ledWidth}
          height={ledHeight}
          viewBox={`0 0 ${ledWidth} ${ledHeight}`}
          overflow="visible"
        >
          <g
            transform={`translate(${ledWidth / 2} ${ledHeight / 2}) rotate(-90)`}
          >
            <LEDSymbol width={ledHeight} height={ledWidth} label="LED" />
          </g>
        </svg>

        <svg
          x={transistorX}
          y={transistorY}
          width={transistorWidth}
          height={transistorHeight}
          viewBox={`0 0 ${transistorWidth} ${transistorHeight}`}
          overflow="visible"
        >
          <PNPTransistorSymbol
            width={transistorWidth}
            height={transistorHeight}
            label="Q1 PNP transistor"
          />
        </svg>
        <g
          fill="#111827"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="700"
        >
          <text x={transistorLabelX} y={transistorLabelY} fontSize="20">
            Q1
          </text>
          <text x={transistorLabelX} y={transistorModelY} fontSize="18">
            PNP
          </text>
        </g>
      </svg>
    </div>
  );
}
