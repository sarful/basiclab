import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "expo-router";
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SvgXml } from "react-native-svg";

import {
  STAR_DELTA_CONTROL_STAGE,
  STAR_DELTA_IDLE_STATE,
  renderStarDeltaControlDiagramSvg,
  resolveCurrent,
  resolveDeltaPickupState,
  resolveElectricalMode,
  resolveFaultState,
  resolveFlowStateLabel,
  resolveModeLabel,
  resolveStartState,
  resolveStoppedState,
  resolveTransferState,
  resolveTripReasonText,
  resolveTrippedState,
} from "../../../packages/core/src/star-delta";
import type { ElectricalMode, StarDeltaControlState } from "../../../packages/types/src";

const TRANSFER_GAP_MS = 350;
const SCREEN_WIDTH = Dimensions.get("window").width;
const CONTROL_CANVAS_WIDTH = Math.max(520, SCREEN_WIDTH - 40);
const CONTROL_CANVAS_HEIGHT =
  CONTROL_CANVAS_WIDTH *
  (STAR_DELTA_CONTROL_STAGE.height / STAR_DELTA_CONTROL_STAGE.width);

function CircuitStage(props: StarDeltaControlState) {
  const xml = useMemo(
    () =>
      renderStarDeltaControlDiagramSvg({
        mcbOn: props.mcbOn,
        overloadTripped: props.overloadTripped,
        mainOn: props.mainOn,
        timerOn: props.timerOn,
        starOn: props.starOn,
        deltaOn: props.deltaOn,
        transferOpen: props.transferOpen,
      }),
    [
      props.mcbOn,
      props.overloadTripped,
      props.mainOn,
      props.timerOn,
      props.starOn,
      props.deltaOn,
      props.transferOpen,
    ],
  );

  return (
    <SvgXml
      xml={xml}
      width={CONTROL_CANVAS_WIDTH}
      height={CONTROL_CANVAS_HEIGHT}
    />
  );
}

export default function ControlCircuitScreen() {
  const [controlState, setControlState] = useState<StarDeltaControlState>(
    STAR_DELTA_IDLE_STATE,
  );
  const [motorHorsepower] = useState(5);
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
  const modeLabel = resolveModeLabel({
    mcbOn,
    overloadTripped,
    transferOpen,
    deltaOn,
    starOn,
    mainOn,
  });
  const flowStateLabel = resolveFlowStateLabel({
    mcbOn,
    overloadTripped,
    transferOpen,
    deltaOn,
    starOn,
    timerOn,
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
            <Text style={styles.badgeText}>CONTROL CKT</Text>
          </View>
        </View>

        <Text style={styles.title}>Star-Delta Control Circuit</Text>
        <Text style={styles.subtitle}>
          Mobile live ladder view matched to the web control circuit layout with the same
          star-delta sequence, timer branch, and interlock structure.
        </Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryPill}>
            <Text style={styles.summaryLabel}>Mode</Text>
            <Text style={styles.summaryValue}>{modeLabel}</Text>
          </View>
          <View style={styles.summaryPill}>
            <Text style={styles.summaryLabel}>Flow</Text>
            <Text style={styles.summaryValue}>{flowStateLabel}</Text>
          </View>
        </View>

        <View style={styles.stageCard}>
          <Text style={styles.stageTitle}>Live Diagram</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.stageScrollContent}
          >
            <View style={styles.svgStage}>
              <CircuitStage {...controlState} />
            </View>
          </ScrollView>
        </View>

        <View style={styles.actionGrid}>
          <Pressable onPress={handleMcbToggle} style={[styles.actionButton, styles.actionDark]}>
            <Text style={styles.actionText}>{mcbOn ? "MCB OFF" : "MCB ON"}</Text>
          </Pressable>
          <Pressable onPress={handleStart} style={[styles.actionButton, styles.actionGreen]}>
            <Text style={styles.actionText}>Start</Text>
          </Pressable>
          <Pressable onPress={handleStop} style={[styles.actionButton, styles.actionRed]}>
            <Text style={styles.actionText}>Stop</Text>
          </Pressable>
          <Pressable onPress={handleReset} style={[styles.actionButton, styles.actionBlue]}>
            <Text style={styles.actionText}>Reset</Text>
          </Pressable>
          <Pressable onPress={handleFault} style={[styles.actionButton, styles.actionAmber]}>
            <Text style={styles.actionText}>Fault</Text>
          </Pressable>
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
    flexDirection: "row",
    gap: 10,
  },
  summaryPill: {
    flex: 1,
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
    width: CONTROL_CANVAS_WIDTH,
    minHeight: CONTROL_CANVAS_HEIGHT,
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
