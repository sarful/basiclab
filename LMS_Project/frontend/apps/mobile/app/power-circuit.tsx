import { useEffect, useRef, useState } from "react";
import { Link } from "expo-router";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Circle, Line, Rect, Text as SvgText } from "react-native-svg";
import {
  STAR_DELTA_IDLE_STATE,
  resolveCurrent,
  resolveDeltaPickupState,
  resolveElectricalMode,
  resolveFaultState,
  resolveModeLabel,
  resolveMotorSpeed,
  resolveStartState,
  resolveStoppedState,
  resolveTransferState,
  resolveTripReasonText,
  resolveTrippedState,
} from "../../../packages/core/src/star-delta";
import type {
  ElectricalMode,
  StarDeltaControlState,
} from "../../../packages/types/src";

const TRANSFER_GAP_MS = 350;
const SCREEN_WIDTH = Dimensions.get("window").width;
const POWER_CANVAS_WIDTH = Math.max(360, SCREEN_WIDTH - 56);
const POWER_CANVAS_HEIGHT = POWER_CANVAS_WIDTH * (560 / 360);

function PowerNode({
  x,
  y,
  active = false,
}: {
  x: number;
  y: number;
  active?: boolean;
}) {
  return (
    <Circle
      cx={x}
      cy={y}
      r={4.5}
      fill={active ? "#17944a" : "#111827"}
      stroke={active ? "#17944a" : "#111827"}
      strokeWidth={1.5}
    />
  );
}

function PowerCircuitStage({
  mcbOn,
  overloadTripped,
  mainOn,
  starOn,
  deltaOn,
  transferOpen,
}: StarDeltaControlState) {
  const line1 = mcbOn ? "#bf6b20" : "#8c97aa";
  const line2 = mcbOn ? "#111827" : "#8c97aa";
  const line3 = mcbOn ? "#7c8798" : "#8c97aa";
  const contact = "#18a43a";
  const red = "#ea3323";
  const blue = "#2850ff";
  const motorStroke = deltaOn ? "#8c38ff" : "#b9c2cf";

  return (
    <Svg width={POWER_CANVAS_WIDTH} height={POWER_CANVAS_HEIGHT} viewBox="0 0 360 560">
      <Rect x="10" y="10" width="340" height="540" rx="18" fill="#ffffff" stroke="#d8e2ee" />

      <SvgText x="26" y="52" fontSize="16" fontWeight="700" fill="#111827">L1</SvgText>
      <SvgText x="26" y="76" fontSize="16" fontWeight="700" fill="#111827">L2</SvgText>
      <SvgText x="26" y="100" fontSize="16" fontWeight="700" fill="#111827">L3</SvgText>
      <Line x1="54" y1="46" x2="138" y2="46" stroke={line1} strokeWidth="2.8" />
      <Line x1="54" y1="70" x2="138" y2="70" stroke={line2} strokeWidth="2.8" />
      <Line x1="54" y1="94" x2="138" y2="94" stroke={line3} strokeWidth="2.8" />

      <Line x1="138" y1="46" x2="138" y2="124" stroke={line1} strokeWidth="2.8" />
      <Line x1="166" y1="70" x2="166" y2="124" stroke={line2} strokeWidth="2.8" />
      <Line x1="194" y1="94" x2="194" y2="124" stroke={line3} strokeWidth="2.8" />
      <PowerNode x={138} y={46} active={mcbOn} />
      <PowerNode x={166} y={70} active={mcbOn} />
      <PowerNode x={194} y={94} active={mcbOn} />
      <SvgText x="52" y="138" fontSize="14" fontWeight="700" fill="#111827">3P MCB</SvgText>

      <Line x1="130" y1="124" x2="138" y2="140" stroke={line1} strokeWidth="2.4" />
      <Line x1="158" y1="124" x2="166" y2="140" stroke={line2} strokeWidth="2.4" />
      <Line x1="186" y1="124" x2="194" y2="140" stroke={line3} strokeWidth="2.4" />
      <Line x1="138" y1="140" x2="138" y2="186" stroke={line1} strokeWidth="2.8" />
      <Line x1="166" y1="140" x2="166" y2="186" stroke={line2} strokeWidth="2.8" />
      <Line x1="194" y1="140" x2="194" y2="186" stroke={line3} strokeWidth="2.8" />

      <PowerNode x={138} y={186} active={mainOn} />
      <PowerNode x={166} y={186} active={mainOn} />
      <PowerNode x={194} y={186} active={mainOn} />
      <Line x1="130" y1="194" x2="138" y2="210" stroke={contact} strokeWidth="2.4" />
      <Line x1="158" y1="194" x2="166" y2="210" stroke={contact} strokeWidth="2.4" />
      <Line x1="186" y1="194" x2="194" y2="210" stroke={contact} strokeWidth="2.4" />
      <Line x1="138" y1="210" x2="138" y2="270" stroke={line1} strokeWidth="2.8" />
      <Line x1="166" y1="210" x2="166" y2="270" stroke={line2} strokeWidth="2.8" />
      <Line x1="194" y1="210" x2="194" y2="270" stroke={line3} strokeWidth="2.8" />
      <SvgText x="78" y="214" fontSize="15" fontWeight="700" fill={blue}>K1</SvgText>
      <SvgText x="62" y="234" fontSize="14" fontWeight="700" fill={blue}>MAIN</SvgText>

      <Rect x="124" y="270" width="28" height="20" fill="none" stroke={red} strokeWidth="2" />
      <Rect x="152" y="270" width="28" height="20" fill="none" stroke={red} strokeWidth="2" />
      <Rect x="180" y="270" width="28" height="20" fill="none" stroke={red} strokeWidth="2" />
      <Line x1="138" y1="290" x2="138" y2="382" stroke={line1} strokeWidth="2.8" />
      <Line x1="166" y1="290" x2="166" y2="382" stroke={line2} strokeWidth="2.8" />
      <Line x1="194" y1="290" x2="194" y2="382" stroke={line3} strokeWidth="2.8" />
      <SvgText x="46" y="286" fontSize="14" fontWeight="700" fill={red}>O/L 1</SvgText>

      <Line x1="194" y1="112" x2="264" y2="112" stroke={line3} strokeWidth="2.8" />
      <Line x1="166" y1="158" x2="248" y2="158" stroke={line2} strokeWidth="2.8" />
      <Line x1="138" y1="204" x2="232" y2="204" stroke={line1} strokeWidth="2.8" />

      <Line x1="232" y1="204" x2="232" y2="270" stroke={line1} strokeWidth="2.8" />
      <Line x1="248" y1="158" x2="248" y2="270" stroke={line2} strokeWidth="2.8" />
      <Line x1="264" y1="112" x2="264" y2="270" stroke={line3} strokeWidth="2.8" />

      <PowerNode x={232} y={186} active={deltaOn} />
      <PowerNode x={248} y={186} active={deltaOn} />
      <PowerNode x={264} y={186} active={deltaOn} />
      <Line x1="224" y1="194" x2="232" y2="210" stroke={contact} strokeWidth="2.4" />
      <Line x1="240" y1="194" x2="248" y2="210" stroke={contact} strokeWidth="2.4" />
      <Line x1="256" y1="194" x2="264" y2="210" stroke={contact} strokeWidth="2.4" />
      <Line x1="232" y1="210" x2="232" y2="270" stroke={line1} strokeWidth="2.8" />
      <Line x1="248" y1="210" x2="248" y2="270" stroke={line2} strokeWidth="2.8" />
      <Line x1="264" y1="210" x2="264" y2="270" stroke={line3} strokeWidth="2.8" />
      <SvgText x="232" y="214" fontSize="15" fontWeight="700" fill={blue}>K2</SvgText>
      <SvgText x="220" y="234" fontSize="14" fontWeight="700" fill={blue}>DELTA</SvgText>

      <Rect x="218" y="270" width="28" height="20" fill="none" stroke={red} strokeWidth="2" />
      <Rect x="246" y="270" width="28" height="20" fill="none" stroke={red} strokeWidth="2" />
      <Rect x="274" y="270" width="28" height="20" fill="none" stroke={red} strokeWidth="2" />
      <Line x1="232" y1="290" x2="232" y2="382" stroke={line1} strokeWidth="2.8" />
      <Line x1="248" y1="290" x2="248" y2="382" stroke={line2} strokeWidth="2.8" />
      <Line x1="264" y1="290" x2="264" y2="382" stroke={line3} strokeWidth="2.8" />
      <SvgText x="206" y="286" fontSize="14" fontWeight="700" fill={red}>O/L 2</SvgText>

      <Line x1="292" y1="112" x2="316" y2="112" stroke={line3} strokeWidth="2.8" />
      <Line x1="292" y1="158" x2="316" y2="158" stroke={line2} strokeWidth="2.8" />
      <Line x1="292" y1="204" x2="316" y2="204" stroke={line1} strokeWidth="2.8" />
      <Line x1="316" y1="112" x2="316" y2="166" stroke={line3} strokeWidth="2.8" />
      <Line x1="316" y1="158" x2="316" y2="166" stroke={line2} strokeWidth="2.8" />
      <Line x1="316" y1="204" x2="316" y2="166" stroke={line1} strokeWidth="2.8" />
      <PowerNode x={292} y={186} active={starOn} />
      <PowerNode x={308} y={186} active={starOn} />
      <PowerNode x={324} y={186} active={starOn} />
      <Line x1="284" y1="194" x2="292" y2="210" stroke={contact} strokeWidth="2.4" />
      <Line x1="300" y1="194" x2="308" y2="210" stroke={contact} strokeWidth="2.4" />
      <Line x1="316" y1="194" x2="324" y2="210" stroke={contact} strokeWidth="2.4" />
      <Line x1="292" y1="210" x2="292" y2="254" stroke={line1} strokeWidth="2.8" />
      <Line x1="308" y1="210" x2="308" y2="254" stroke={line2} strokeWidth="2.8" />
      <Line x1="324" y1="210" x2="324" y2="254" stroke={line3} strokeWidth="2.8" />
      <SvgText x="290" y="214" fontSize="15" fontWeight="700" fill={blue}>K3</SvgText>
      <SvgText x="286" y="234" fontSize="14" fontWeight="700" fill={blue}>STAR</SvgText>

      <Line x1="138" y1="382" x2="138" y2="430" stroke={line1} strokeWidth="2.8" />
      <Line x1="166" y1="382" x2="166" y2="430" stroke={line2} strokeWidth="2.8" />
      <Line x1="194" y1="382" x2="194" y2="430" stroke={line3} strokeWidth="2.8" />
      <Line x1="232" y1="382" x2="152" y2="470" stroke={line1} strokeWidth="2.8" />
      <Line x1="248" y1="382" x2="180" y2="470" stroke={line2} strokeWidth="2.8" />
      <Line x1="264" y1="382" x2="208" y2="470" stroke={line3} strokeWidth="2.8" />
      <Line x1="292" y1="254" x2="236" y2="430" stroke={line1} strokeWidth="2.8" />
      <Line x1="308" y1="254" x2="264" y2="430" stroke={line2} strokeWidth="2.8" />
      <Line x1="324" y1="254" x2="292" y2="430" stroke={line3} strokeWidth="2.8" />

      <Circle cx={222} cy={450} r={46} fill="#ffffff" stroke={motorStroke} strokeWidth="3" />
      <SvgText x="210" y="445" fontSize="28" fontWeight="400" fill="#111827">M</SvgText>
      <SvgText
        x="252"
        y="462"
        fontSize="24"
        fontWeight="400"
        fill="#111827"
        transform="rotate(-90 252 462)"
      >
        3~
      </SvgText>
      <SvgText x="104" y="496" fontSize="14" fontWeight="700" fill="#111827">U1</SvgText>
      <SvgText x="132" y="496" fontSize="14" fontWeight="700" fill="#111827">V1</SvgText>
      <SvgText x="160" y="496" fontSize="14" fontWeight="700" fill="#111827">W1</SvgText>
      <SvgText x="244" y="496" fontSize="14" fontWeight="700" fill="#111827">U2</SvgText>
      <SvgText x="272" y="496" fontSize="14" fontWeight="700" fill="#111827">V2</SvgText>
      <SvgText x="300" y="496" fontSize="14" fontWeight="700" fill="#111827">W2</SvgText>

      {transferOpen ? (
        <SvgText x="118" y="526" fontSize="14" fontWeight="700" fill="#ea3323">
          Transfer gap active
        </SvgText>
      ) : null}
      {overloadTripped ? (
        <SvgText x="122" y="526" fontSize="14" fontWeight="700" fill="#ea3323">
          Overload tripped
        </SvgText>
      ) : null}
    </Svg>
  );
}

export default function PowerCircuitScreen() {
  const [controlState, setControlState] = useState<StarDeltaControlState>(
    STAR_DELTA_IDLE_STATE,
  );
  const [motorHorsepower] = useState(5);
  const [motorRpm] = useState(1440);
  const [currentLimit] = useState(12);
  const [loadPercent] = useState(45);
  const [timerDelayMs] = useState(2500);

  const starDeltaTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const changeoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    mcbOn,
    motorRunning,
    overloadTripped,
    mainOn,
    timerOn,
    starOn,
    deltaOn,
    transferOpen,
  } = controlState;

  const electricalMode: ElectricalMode = resolveElectricalMode({
    motorRunning,
    transferOpen,
    deltaOn,
    starOn,
  });

  const motorCurrent = resolveCurrent(
    motorHorsepower,
    loadPercent,
    motorRunning,
    electricalMode,
  );
  const motorSpeed = resolveMotorSpeed(
    motorRpm,
    loadPercent,
    motorRunning,
    electricalMode,
  );
  const modeLabel = resolveModeLabel({
    mcbOn,
    overloadTripped,
    transferOpen,
    deltaOn,
    starOn,
    mainOn,
  });
  const tripReason = resolveTripReasonText(
    overloadTripped,
    motorCurrent,
    currentLimit,
  );

  const clearTimers = () => {
    if (starDeltaTimerRef.current) {
      clearTimeout(starDeltaTimerRef.current);
      starDeltaTimerRef.current = null;
    }
    if (changeoverTimerRef.current) {
      clearTimeout(changeoverTimerRef.current);
      changeoverTimerRef.current = null;
    }
  };

  const tripSystem = () => {
    clearTimers();
    setControlState((current) => resolveTrippedState(current));
  };

  const handleStart = () => {
    if (!mcbOn || overloadTripped) return;
    if (resolveCurrent(motorHorsepower, loadPercent, true, "star") > currentLimit) {
      tripSystem();
      return;
    }

    clearTimers();
    setControlState((current) => resolveStartState(current));

    starDeltaTimerRef.current = setTimeout(() => {
      setControlState((current) => resolveTransferState(current));
      starDeltaTimerRef.current = null;

      changeoverTimerRef.current = setTimeout(() => {
        const deltaCurrent = resolveCurrent(
          motorHorsepower,
          loadPercent,
          true,
          "delta",
        );

        if (deltaCurrent > currentLimit) {
          tripSystem();
          return;
        }

        setControlState((current) => resolveDeltaPickupState(current));
        changeoverTimerRef.current = null;
      }, TRANSFER_GAP_MS);
    }, timerDelayMs);
  };

  const handleStop = () => {
    clearTimers();
    setControlState((current) => resolveStoppedState(current));
  };

  const handleReset = () => {
    clearTimers();
    setControlState((current) => resolveStoppedState(current));
  };

  const handleFault = () => {
    if (!mcbOn) return;
    clearTimers();
    setControlState((current) => resolveFaultState(current));
  };

  const handleMcbToggle = () => {
    if (mcbOn) clearTimers();
    setControlState((current) => {
      const nextMcbOn = !current.mcbOn;
      if (!nextMcbOn) {
        return { ...resolveStoppedState(current), mcbOn: false };
      }
      return { ...current, mcbOn: true };
    });
  };

  useEffect(() => () => clearTimers(), []);

  const actionButtons = [
    { label: mcbOn ? "MCB OFF" : "MCB ON", tone: styles.actionDark, onPress: handleMcbToggle },
    { label: "Start", tone: styles.actionGreen, onPress: handleStart },
    { label: "Stop", tone: styles.actionRed, onPress: handleStop },
    { label: "Reset", tone: styles.actionBlue, onPress: handleReset },
    { label: "Fault", tone: styles.actionAmber, onPress: handleFault },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.screenHeader}>
          <Link href="/" asChild>
            <Pressable style={styles.backButton}>
              <Text style={styles.backButtonText}>Back</Text>
            </Pressable>
          </Link>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>POWER CKT</Text>
          </View>
        </View>

        <Text style={styles.title}>Star-Delta Power Circuit</Text>
        <Text style={styles.subtitle}>
          This screen focuses on the 3-phase power path through MCB, main contactor,
          delta branch, star branch, overload relay, and motor.
        </Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryPill}>
            <Text style={styles.summaryLabel}>Mode</Text>
            <Text style={styles.summaryValue}>{modeLabel}</Text>
          </View>
          <View style={styles.summaryPill}>
            <Text style={styles.summaryLabel}>Current</Text>
            <Text style={styles.summaryValue}>{motorCurrent.toFixed(1)} A</Text>
          </View>
          <View style={styles.summaryPill}>
            <Text style={styles.summaryLabel}>Speed</Text>
            <Text style={styles.summaryValue}>{Math.round(motorSpeed)} RPM</Text>
          </View>
        </View>

        <View style={styles.stageCard}>
          <Text style={styles.stageTitle}>Live Power Diagram</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.stageScrollContent}
          >
            <View style={styles.svgStage}>
              <PowerCircuitStage {...controlState} />
            </View>
          </ScrollView>
        </View>

        <View style={styles.actionGrid}>
          {actionButtons.map((item) => (
            <Pressable
              key={item.label}
              onPress={item.onPress}
              style={[styles.actionButton, item.tone]}
            >
              <Text style={styles.actionText}>{item.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Trip Reason</Text>
          <Text style={styles.infoCopy}>{tripReason}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f9fc",
  },
  container: {
    padding: 18,
    gap: 16,
  },
  screenHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#eef3fb",
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#22324a",
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#dce6ff",
  },
  badgeText: {
    color: "#2850ff",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111827",
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 24,
    color: "#52637a",
  },
  summaryRow: {
    gap: 10,
  },
  summaryPill: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#d8e2ee",
    backgroundColor: "#ffffff",
    padding: 14,
    gap: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#5a6f8d",
    textTransform: "uppercase",
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "800",
    color: "#152236",
  },
  stageCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#d8e2ee",
    backgroundColor: "#ffffff",
    padding: 14,
    gap: 10,
  },
  svgStage: {
    width: POWER_CANVAS_WIDTH,
    minHeight: POWER_CANVAS_HEIGHT,
    alignItems: "center",
  },
  stageScrollContent: {
    paddingBottom: 4,
  },
  stageTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#152236",
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  actionButton: {
    minWidth: 100,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  actionDark: {
    backgroundColor: "#3b4a61",
  },
  actionGreen: {
    backgroundColor: "#1f8a3d",
  },
  actionRed: {
    backgroundColor: "#e72727",
  },
  actionBlue: {
    backgroundColor: "#1d89cc",
  },
  actionAmber: {
    backgroundColor: "#e48800",
  },
  actionText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },
  infoCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d8e2ee",
    backgroundColor: "#ffffff",
    padding: 16,
    gap: 8,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#152236",
  },
  infoCopy: {
    fontSize: 14,
    lineHeight: 22,
    color: "#52637a",
  },
});
