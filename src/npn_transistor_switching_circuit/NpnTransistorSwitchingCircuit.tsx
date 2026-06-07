import BackgroundPixelGred from "../library/background_pixel_gred";
import LEDSymbol from "../library/electronics-symbol-library/diodes/LEDSymbol";
import ResistorSymbol from "../library/electronics-symbol-library/passive/ResistorSymbol";
import DCVoltageSourceV1Symbol from "../library/electronics-symbol-library/sources/DCVoltageSourceV1Symbol";
import SPSTSwitchSymbol from "../library/electronics-symbol-library/switch-topology/SPSTSwitchSymbol";
import NPNTransistorSymbol from "../library/electronics-symbol-library/transistors/NPNTransistorSymbol";

export default function NpnTransistorSwitchingCircuit() {
  const stageWidth = 760;
  const stageHeight = 700;
  const boardPadding = 16;
  const boardMinHeight = 700;

  // DC source placement and terminal anchors come from the shared symbol geometry.
  const sourceWidth = 110;
  const sourceHeight = 150;
  const sourceSvgX = 58;
  const sourceSvgY = 210;
  const positiveWireY = 100;
  const positiveWireEndX = 650;
  const sourcePositiveTerminalX = sourceSvgX + (57 / 150) * sourceWidth;
  const sourcePositiveTerminalY = sourceSvgY + (39 / 160) * sourceHeight;
  const sourceNegativeTerminalX = sourceSvgX + (57 / 150) * sourceWidth;
  const sourceNegativeTerminalY = sourceSvgY + (125 / 190) * sourceHeight;
  const positiveWireStrokeWidth = 1.5;

  // Output branch on the collector side: series resistor feeding the LED.
  const resistorX = 650;
  const resistorY = 40;
  const resistorWidth = 170;
  const resistorHeight = 130;
  const resistorTerminal1X = resistorX;
  const resistorTerminal1Y = resistorY + 110;
  const resistorTerminal2X = resistorX;
  const resistorTerminal2Y = resistorY + 100;
  const resistorLabelX = resistorX + 34;
  const resistorLabelY = resistorY + 68;
  const resistorValueX = resistorX + 34;
  const resistorValueY = resistorY + 92;
  const ledX = 658;
  const ledY = 145;
  const ledWidth = 130;
  const ledHeight = 110;
  const ledAnodeX = resistorX;
  const ledAnodeY = ledY;

  // Q1 placement is still driven from a collector target so manual tuning stays predictable.
  const transistorWidth = 180;
  const transistorHeight = 200;
  const transistorCollectorTargetX = 649;
  const transistorCollectorTargetY = 280;
  const transistorCollectorOffsetX = ((30 + 10) / 71) * transistorWidth;
  const transistorCollectorOffsetY = ((0 + 10) / 81) * transistorHeight;
  const transistorX = transistorCollectorTargetX - transistorCollectorOffsetX;
  const transistorY = transistorCollectorTargetY - transistorCollectorOffsetY;
  const transistorBaseTerminalX =
    transistorX + ((3 + 10) / 71) * transistorWidth;
  const transistorBaseTerminalY =
    transistorY + ((30 + 10) / 80) * transistorHeight;
  const transistorEmitterTerminalX =
    transistorX + ((30 + 10) / 71) * transistorWidth;
  const transistorEmitterTerminalY =
    transistorY + ((60 + 10) / 81) * transistorHeight;
  const negativeWireY = 530;

  // Base-drive branch starts at the switch and then drops into RB.
  const buttonX = 300;
  const buttonY = 40;
  const buttonWidth = 190;
  const buttonHeight = 130;
  const buttonUpperTerminalX = buttonX;
  const buttonUpperTerminalY = buttonY + 105;
  const buttonLowerTerminalX = buttonX;
  const buttonLowerTerminalY = buttonY + 155;
  const buttonOutputStubY = buttonLowerTerminalY + 40;
  const buttonOutputStubEndX = buttonLowerTerminalX;
  const buttonResistorX = 300;
  const buttonResistorY = 150;
  const buttonResistorWidth = 150;
  const buttonResistorHeight = 120;
  const buttonResistorTerminal1X = buttonResistorX;
  const buttonResistorTerminal1Y = buttonResistorY + 102;
  const buttonResistorTerminal2X = buttonResistorX;
  const buttonResistorTerminal2Y = buttonResistorY + 160;
  const buttonResistorLabelX = buttonResistorX + 30;
  const buttonResistorLabelY = buttonResistorY + 64;
  const buttonResistorValueX = buttonResistorX + 30;
  const buttonResistorValueY = buttonResistorY + 88;
  const baseNodeX = 370;
  const baseNodeY = transistorBaseTerminalY;

  // Pull-down branch holds the base low when the switch path is open.
  const pullDownResistorX = 400;
  const pullDownResistorY = 320;
  const pullDownResistorWidth = 150;
  const pullDownResistorHeight = 120;
  const pullDownResistorTerminalTopX = pullDownResistorX;
  const pullDownResistorTerminalTopY = pullDownResistorY + 109;
  const pullDownResistorTerminalBottomX = pullDownResistorX;
  const pullDownResistorTerminalBottomY = pullDownResistorY + 160;
  const pullDownResistorLabelX = pullDownResistorX + 44;
  const pullDownResistorLabelY = pullDownResistorY + 54;
  const pullDownResistorValueX = pullDownResistorX + 44;
  const pullDownResistorValueY = pullDownResistorY + 82;

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
        aria-label="NPN transistor switching circuit with 5V DC source and power rails"
        style={{
          display: "block",
          width: "100%",
          maxWidth: `${stageWidth}px`,
          height: "auto",
          margin: "0 auto",
        }}
      >
        {/* Reuses the shared pixel grid board so this canvas matches the project family. */}
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

        {/* Wiring is split into supply, collector/load, base-drive, and return paths. */}
        <g
          stroke="#111827"
          strokeWidth={positiveWireStrokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line
            x1={sourcePositiveTerminalX}
            y1={sourcePositiveTerminalY}
            x2={sourcePositiveTerminalX}
            y2={positiveWireY}
          />
          <line
            x1={sourcePositiveTerminalX}
            y1={positiveWireY}
            x2={positiveWireEndX}
            y2={positiveWireY}
          />
          <line
            x1={positiveWireEndX}
            y1={positiveWireY}
            x2={resistorTerminal1X}
            y2={positiveWireY}
          />
          <line
            x1={resistorTerminal1X}
            y1={positiveWireY}
            x2={resistorTerminal1X}
            y2={resistorTerminal1Y}
          />
          <line
            x1={resistorTerminal2X}
            y1={resistorTerminal2Y}
            x2={ledAnodeX}
            y2={ledAnodeY}
          />
          <line
            x1={buttonUpperTerminalX}
            y1={positiveWireY}
            x2={buttonUpperTerminalX}
            y2={buttonUpperTerminalY}
          />
          <line
            x1={buttonLowerTerminalX}
            y1={buttonLowerTerminalY}
            x2={buttonLowerTerminalX}
            y2={buttonOutputStubY}
          />
          <line
            x1={buttonLowerTerminalX}
            y1={buttonOutputStubY}
            x2={buttonOutputStubEndX}
            y2={buttonOutputStubY}
          />
          <line
            x1={buttonOutputStubEndX}
            y1={buttonOutputStubY}
            x2={buttonResistorTerminal1X}
            y2={buttonOutputStubY}
          />
          <line
            x1={buttonResistorTerminal1X}
            y1={buttonOutputStubY}
            x2={buttonResistorTerminal1X}
            y2={buttonResistorTerminal1Y}
          />
          <line
            x1={buttonResistorTerminal2X}
            y1={buttonResistorTerminal2Y}
            x2={buttonResistorTerminal2X}
            y2={baseNodeY}
          />
          <line
            x1={buttonResistorTerminal2X}
            y1={baseNodeY}
            x2={baseNodeX}
            y2={baseNodeY}
          />
          <line
            x1={baseNodeX}
            y1={baseNodeY}
            x2={transistorBaseTerminalX}
            y2={baseNodeY}
          />
          <line
            x1={baseNodeX}
            y1={baseNodeY}
            x2={pullDownResistorTerminalTopX}
            y2={baseNodeY}
          />
          <line
            x1={pullDownResistorTerminalTopX}
            y1={baseNodeY}
            x2={pullDownResistorTerminalTopX}
            y2={pullDownResistorTerminalTopY}
          />
          <line
            x1={sourceNegativeTerminalX}
            y1={sourceNegativeTerminalY}
            x2={sourceNegativeTerminalX}
            y2={negativeWireY}
          />
          <line
            x1={sourceNegativeTerminalX}
            y1={negativeWireY}
            x2={transistorEmitterTerminalX}
            y2={negativeWireY}
          />
          <line
            x1={transistorEmitterTerminalX}
            y1={negativeWireY}
            x2={transistorEmitterTerminalX}
            y2={transistorEmitterTerminalY}
          />
          <line
            x1={pullDownResistorTerminalBottomX}
            y1={pullDownResistorTerminalBottomY}
            x2={pullDownResistorTerminalBottomX}
            y2={negativeWireY}
          />
        </g>

        {/* Shared symbols stay separate from the wire layer so manual placement is easier to tune. */}
        <svg
          x={sourceSvgX}
          y={sourceSvgY}
          width={sourceWidth}
          height={sourceHeight}
          viewBox={`0 0 ${sourceWidth} ${sourceHeight}`}
          overflow="visible"
        >
          <DCVoltageSourceV1Symbol
            width={sourceWidth}
            height={sourceHeight}
            label="Vcc 5V DC source"
          />
        </svg>

        <svg
          x={resistorX}
          y={resistorY}
          width={resistorWidth}
          height={resistorHeight}
          viewBox={`0 0 ${resistorWidth} ${resistorHeight}`}
          overflow="visible"
        >
          <g
            transform={`translate(${resistorWidth / 2} ${resistorHeight / 2}) rotate(90)`}
          >
            <ResistorSymbol
              width={resistorHeight}
              height={resistorWidth}
              label="Resistor"
            />
          </g>
        </svg>

        <g
          fill="#111827"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="700"
          textAnchor="start"
        >
          <text x={resistorLabelX} y={resistorLabelY} fontSize="18">
            R_LED
          </text>
          <text x={resistorValueX} y={resistorValueY} fontSize="16">
            10kΩ
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
            transform={`translate(${ledWidth / 2} ${ledHeight / 2}) rotate(90)`}
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
          <NPNTransistorSymbol
            width={transistorWidth}
            height={transistorHeight}
            label="Q1 2N3904"
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
              label="Button"
            />
          </g>
        </svg>

        <svg
          x={buttonResistorX}
          y={buttonResistorY}
          width={buttonResistorWidth}
          height={buttonResistorHeight}
          viewBox={`0 0 ${buttonResistorWidth} ${buttonResistorHeight}`}
          overflow="visible"
        >
          <g
            transform={`translate(${buttonResistorWidth / 2} ${buttonResistorHeight / 2}) rotate(90)`}
          >
            <ResistorSymbol
              width={buttonResistorHeight}
              height={buttonResistorWidth}
              label="Base resistor"
            />
          </g>
        </svg>

        <g
          fill="#111827"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="700"
          textAnchor="start"
        >
          <text x={buttonResistorLabelX} y={buttonResistorLabelY} fontSize="18">
            RB
          </text>
          <text x={buttonResistorValueX} y={buttonResistorValueY} fontSize="16">
            10kΩ
          </text>
        </g>
        <svg
          x={pullDownResistorX}
          y={pullDownResistorY}
          width={pullDownResistorWidth}
          height={pullDownResistorHeight}
          viewBox={`0 0 ${pullDownResistorWidth} ${pullDownResistorHeight}`}
          overflow="visible"
        >
          <g
            transform={`translate(${pullDownResistorWidth / 2} ${pullDownResistorHeight / 2}) rotate(90)`}
          >
            <ResistorSymbol
              width={pullDownResistorHeight}
              height={pullDownResistorWidth}
              label="Pull-down resistor"
            />
          </g>
        </svg>

        <g
          fill="#111827"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="700"
          textAnchor="start"
        >
          <text
            x={pullDownResistorLabelX}
            y={pullDownResistorLabelY}
            fontSize="18"
          >
            RPD
          </text>
          <text
            x={pullDownResistorValueX}
            y={pullDownResistorValueY}
            fontSize="16"
          >
            100kÎ©
          </text>
        </g>
      </svg>
    </div>
  );
}
