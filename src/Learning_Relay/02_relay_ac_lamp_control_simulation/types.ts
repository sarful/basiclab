export type RelayState = {
  coilEnergized: boolean;
  lampOn: boolean;
  contactState: "NC" | "NO";
};

export type RelayTest = {
  name: string;
  pressed: boolean;
  expectedContact: RelayState["contactState"];
  expectedLamp: boolean;
};
