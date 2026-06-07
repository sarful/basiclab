import { useEffect, useRef, useState } from "react";
import { Link } from "expo-router";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  STAR_DELTA_IDLE_STATE,
  resolveCurrent,
  resolveDeltaPickupState,
  resolveElectricalMode,
  resolveFaultState,
  resolveFlowStateLabel,
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

export default function HomeScreen() {
  const [controlState, setControlState] = useState<StarDeltaControlState>(
    STAR_DELTA_IDLE_STATE,
  );
  const [motorRpm, setMotorRpm] = useState(1440);
  const [motorHorsepower, setMotorHorsepower] = useState(5);
  const [currentLimit, setCurrentLimit] = useState(12);
  const [loadPercent, setLoadPercent] = useState(45);
  const [timerDelayMs, setTimerDelayMs] = useState(2500);

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

  const checkForOverload = (
    horsepower: number,
    load: number,
    limit: number,
    running: boolean,
    mode: ElectricalMode = electricalMode,
  ) => {
    if (!running || !mcbOn) return false;
    return resolveCurrent(horsepower, load, true, mode) > limit;
  };

  const handleStart = () => {
    if (!mcbOn || overloadTripped) return;

    if (checkForOverload(motorHorsepower, loadPercent, currentLimit, true, "star")) {
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
    if (mcbOn) {
      clearTimers();
    }
    setControlState((current) => {
      const nextMcbOn = !current.mcbOn;
      if (!nextMcbOn) {
        return { ...resolveStoppedState(current), mcbOn: false };
      }
      return { ...current, mcbOn: true };
    });
  };

  const adjustLoad = (delta: number) => {
    const nextLoad = Math.max(0, Math.min(140, loadPercent + delta));
    setLoadPercent(nextLoad);
    if (checkForOverload(motorHorsepower, nextLoad, currentLimit, motorRunning)) {
      tripSystem();
    }
  };

  const adjustHorsepower = (delta: number) => {
    const nextHorsepower = Math.max(1, Math.min(25, motorHorsepower + delta));
    setMotorHorsepower(nextHorsepower);
    if (checkForOverload(nextHorsepower, loadPercent, currentLimit, motorRunning)) {
      tripSystem();
    }
  };

  const adjustCurrentLimit = (delta: number) => {
    const nextLimit = Math.max(2, Math.min(60, currentLimit + delta));
    setCurrentLimit(nextLimit);
    if (checkForOverload(motorHorsepower, loadPercent, nextLimit, motorRunning)) {
      tripSystem();
    }
  };

  const adjustTimerDelay = (delta: number) => {
    setTimerDelayMs((current) => Math.max(500, Math.min(10000, current + delta)));
  };

  const adjustRpm = (delta: number) => {
    const nextRpm = Math.max(720, Math.min(3600, motorRpm + delta));
    setMotorRpm(nextRpm);
  };

  useEffect(() => () => clearTimers(), []);

  const quickStats = [
    { label: "Supply", value: mcbOn ? "ON" : "OFF", tone: mcbOn ? "live" : "idle" },
    {
      label: "Motor",
      value: motorRunning ? "RUN" : "STOP",
      tone: motorRunning ? "live" : "idle",
    },
    {
      label: "Trip",
      value: overloadTripped ? "ACTIVE" : "OK",
      tone: overloadTripped ? "trip" : "idle",
    },
  ];

  const actions = [
    { label: mcbOn ? "MCB OFF" : "MCB ON", tone: "dark", onPress: handleMcbToggle },
    { label: "Start", tone: "green", onPress: handleStart },
    { label: "Stop", tone: "red", onPress: handleStop },
    { label: "Reset", tone: "blue", onPress: handleReset },
    { label: "Fault", tone: "amber", onPress: handleFault },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>STAR DELTA</Text>
        </View>

        <Text style={styles.title}>Electrical Training Platform Mobile</Text>
        <Text style={styles.subtitle}>
          First mobile simulator screen is now using the shared star-delta core
          logic. This is the base for the real training app.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>System Status</Text>
          <View style={styles.statRow}>
            {quickStats.map((item) => (
              <View
                key={item.label}
                style={[
                  styles.statPill,
                  item.tone === "live" && styles.statLive,
                  item.tone === "trip" && styles.statTrip,
                ]}
              >
                <Text style={styles.statLabel}>{item.label}</Text>
                <Text style={styles.statValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            {actions.map((item) => (
              <Pressable
                key={item.label}
                onPress={item.onPress}
                style={[
                  styles.actionButton,
                  item.tone === "dark" && styles.actionDark,
                  item.tone === "green" && styles.actionGreen,
                  item.tone === "red" && styles.actionRed,
                  item.tone === "blue" && styles.actionBlue,
                  item.tone === "amber" && styles.actionAmber,
                ]}
              >
                <Text style={styles.actionText}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Link href="./control-circuit" asChild>
          <Pressable style={styles.primaryLink}>
            <Text style={styles.primaryLinkText}>Open Control Circuit Screen</Text>
          </Pressable>
        </Link>

        <Link href="./power-circuit" asChild>
          <Pressable style={styles.secondaryLink}>
            <Text style={styles.secondaryLinkText}>Open Power Circuit Screen</Text>
          </Pressable>
        </Link>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Live Telemetry</Text>
          <View style={styles.telemetryGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Mode</Text>
              <Text style={styles.metricValue}>{modeLabel}</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Flow</Text>
              <Text style={styles.metricValue}>{flowStateLabel}</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Current</Text>
              <Text style={styles.metricValue}>{motorCurrent.toFixed(1)} A</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Speed</Text>
              <Text style={styles.metricValue}>{Math.round(motorSpeed)} RPM</Text>
            </View>
          </View>
          <Text style={styles.infoText}>{tripReason}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Motor Setup</Text>
          <View style={styles.adjustGroup}>
            <Text style={styles.adjustLabel}>Horsepower</Text>
            <View style={styles.adjustRow}>
              <Pressable style={styles.adjustButton} onPress={() => adjustHorsepower(-1)}>
                <Text style={styles.adjustButtonText}>-</Text>
              </Pressable>
              <Text style={styles.adjustValue}>{motorHorsepower} HP</Text>
              <Pressable style={styles.adjustButton} onPress={() => adjustHorsepower(1)}>
                <Text style={styles.adjustButtonText}>+</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.adjustGroup}>
            <Text style={styles.adjustLabel}>Rated RPM</Text>
            <View style={styles.adjustRow}>
              <Pressable style={styles.adjustButton} onPress={() => adjustRpm(-60)}>
                <Text style={styles.adjustButtonText}>-</Text>
              </Pressable>
              <Text style={styles.adjustValue}>{motorRpm}</Text>
              <Pressable style={styles.adjustButton} onPress={() => adjustRpm(60)}>
                <Text style={styles.adjustButtonText}>+</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.adjustGroup}>
            <Text style={styles.adjustLabel}>Current Limit</Text>
            <View style={styles.adjustRow}>
              <Pressable style={styles.adjustButton} onPress={() => adjustCurrentLimit(-1)}>
                <Text style={styles.adjustButtonText}>-</Text>
              </Pressable>
              <Text style={styles.adjustValue}>{currentLimit} A</Text>
              <Pressable style={styles.adjustButton} onPress={() => adjustCurrentLimit(1)}>
                <Text style={styles.adjustButtonText}>+</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.adjustGroup}>
            <Text style={styles.adjustLabel}>Star to Delta Timer</Text>
            <View style={styles.adjustRow}>
              <Pressable style={styles.adjustButton} onPress={() => adjustTimerDelay(-250)}>
                <Text style={styles.adjustButtonText}>-</Text>
              </Pressable>
              <Text style={styles.adjustValue}>{(timerDelayMs / 1000).toFixed(1)} s</Text>
              <Pressable style={styles.adjustButton} onPress={() => adjustTimerDelay(250)}>
                <Text style={styles.adjustButtonText}>+</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Load Control</Text>
          <View style={styles.adjustRow}>
            <Pressable style={styles.adjustButton} onPress={() => adjustLoad(-5)}>
              <Text style={styles.adjustButtonText}>-</Text>
            </Pressable>
            <Text style={styles.adjustValue}>{loadPercent}%</Text>
            <Pressable style={styles.adjustButton} onPress={() => adjustLoad(5)}>
              <Text style={styles.adjustButtonText}>+</Text>
            </Pressable>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.min(loadPercent, 100)}%` }]} />
          </View>
          <Text style={styles.infoText}>
            Higher load increases running current. If current exceeds the set limit,
            the overload trip state will activate automatically.
          </Text>
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
    padding: 20,
    gap: 16,
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
    letterSpacing: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111827",
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 24,
    color: "#52637a",
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#d8e2ee",
    backgroundColor: "#ffffff",
    padding: 18,
    gap: 14,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#18263a",
  },
  statRow: {
    gap: 10,
  },
  statPill: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d8e2ee",
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: "#f9fbff",
  },
  statLive: {
    backgroundColor: "#ecfff1",
  },
  statTrip: {
    backgroundColor: "#fff1f1",
  },
  statLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#5a6f8d",
  },
  statValue: {
    fontSize: 15,
    fontWeight: "800",
    color: "#17944a",
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  actionButton: {
    minWidth: 110,
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
  listItem: {
    fontSize: 15,
    lineHeight: 24,
    color: "#3b4a61",
  },
  telemetryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metricCard: {
    minWidth: "47%",
    flexGrow: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d8e2ee",
    backgroundColor: "#f9fbff",
    padding: 14,
    gap: 6,
  },
  metricLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#5a6f8d",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#152236",
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#52637a",
  },
  adjustGroup: {
    gap: 8,
  },
  adjustLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#5a6f8d",
  },
  adjustRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  adjustButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eff4fb",
    borderWidth: 1,
    borderColor: "#d8e2ee",
  },
  adjustButtonText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#22324a",
  },
  adjustValue: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  progressTrack: {
    height: 14,
    borderRadius: 999,
    backgroundColor: "#e6edf6",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#1d89cc",
  },
  primaryLink: {
    borderRadius: 18,
    backgroundColor: "#111827",
    paddingHorizontal: 20,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryLinkText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
  secondaryLink: {
    borderRadius: 18,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d8e2ee",
    paddingHorizontal: 20,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryLinkText: {
    color: "#152236",
    fontSize: 16,
    fontWeight: "800",
  },
});
