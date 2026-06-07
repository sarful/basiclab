import type { RelayResult, RelayState, RelayTest, RelayType } from "./types";

export function getRelayResult(
  relayType: RelayType,
  energized: boolean,
): RelayResult {
  if (relayType === "SPST") {
    return {
      coilEnergized: energized,
      contactLabel: energized ? "CLOSED" : "OPEN",
      loadOn: energized,
    };
  }

  return {
    coilEnergized: energized,
    contactLabel: energized ? "NO" : "NC",
    loadOn: energized,
  };
}

export function getSpdtRelayState(energized: boolean): RelayState {
  const contactState = energized ? "NO" : "NC";
  const lampOn = contactState === "NO";
  return { coilEnergized: energized, contactState, lampOn };
}

export const relayTests: RelayTest[] = [
  { type: "SPST", energized: false, contact: "OPEN", loadOn: false },
  { type: "SPST", energized: true, contact: "CLOSED", loadOn: true },
  { type: "SPDT", energized: false, contact: "NC", loadOn: false },
  { type: "SPDT", energized: true, contact: "NO", loadOn: true },
  { type: "DPDT", energized: false, contact: "NC", loadOn: false },
  { type: "DPDT", energized: true, contact: "NO", loadOn: true },
];

export function runRelayTests() {
  return relayTests.every((test) => {
    const result = getRelayResult(test.type, test.energized);
    return result.contactLabel === test.contact && result.loadOn === test.loadOn;
  });
}

export function getRelayDescription(
  relayType: RelayType,
  energized: boolean,
) {
  if (relayType === "SPST") {
    return energized
      ? "When the SPST relay coil is energized, the single contact closes and completes the load path."
      : "An SPST relay behaves like a single on-off switch. With the coil off, the contact stays open.";
  }

  return energized
    ? "Current through the coil creates a magnetic field. The armature moves and COM switches to the NO contact, turning the load on."
    : "A relay is an electrically operated switch. With the coil off, COM stays on the NC side in the normal state.";
}
