import type { RelayState, RelayTest } from "./types";

export function calculateRelay(pressed: boolean): RelayState {
  const coilEnergized = pressed;
  const contactState = coilEnergized ? "NO" : "NC";
  const lampOn = contactState === "NO";
  return { coilEnergized, contactState, lampOn };
}

export const relayTests: RelayTest[] = [
  {
    name: "released button keeps relay on NC",
    pressed: false,
    expectedContact: "NC",
    expectedLamp: false,
  },
  {
    name: "pressed button energizes relay and connects COM to NO",
    pressed: true,
    expectedContact: "NO",
    expectedLamp: true,
  },
  {
    name: "lamp state follows NO contact closure",
    pressed: true,
    expectedContact: "NO",
    expectedLamp: true,
  },
];

export function runRelayTests() {
  return relayTests.every((test) => {
    const result = calculateRelay(test.pressed);
    return (
      result.contactState === test.expectedContact &&
      result.lampOn === test.expectedLamp
    );
  });
}
