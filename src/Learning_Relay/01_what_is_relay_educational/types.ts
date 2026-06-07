export type RelayType = "SPST" | "SPDT" | "DPDT";

export type RelayResult = {
  coilEnergized: boolean;
  contactLabel: string;
  loadOn: boolean;
};

export type RelayState = {
  coilEnergized: boolean;
  lampOn: boolean;
  contactState: "NC" | "NO";
};

export type RelayTest = {
  type: RelayType;
  energized: boolean;
  contact: string;
  loadOn: boolean;
};
