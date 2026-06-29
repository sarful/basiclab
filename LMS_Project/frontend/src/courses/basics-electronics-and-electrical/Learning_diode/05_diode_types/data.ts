import { diodeCatalog } from "./catalog";

export const diodeTypes = [...diodeCatalog];

export const diodeCategories = Array.from(new Set(diodeTypes.map((diode) => diode.category)));
