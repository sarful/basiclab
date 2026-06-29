import { backwardDiode } from "./backwardDiode";
import { bidirectionalPhotodiode } from "./bidirectionalPhotodiode";
import { commonCathodePhotodiode } from "./commonCathodePhotodiode";
import { genericDiode } from "./genericDiode";
import { laserDiode } from "./laserDiode";
import { ledBicolor } from "./ledBicolor";
import { ledLightEmittingDiode } from "./ledLightEmittingDiode";
import { magneticallySensitiveDiode } from "./magneticallySensitiveDiode";
import { photodiode } from "./photodiode";
import { pinDiode } from "./pinDiode";
import { schottkyDiode } from "./schottkyDiode";
import { scrSiliconControlledRectifier } from "./scrSiliconControlledRectifier";
import { shockleyDiode } from "./shockleyDiode";
import { stepRecoveryDiode } from "./stepRecoveryDiode";
import { thermalDiode } from "./thermalDiode";
import { tunnelDiode } from "./tunnelDiode";
import { tvsDiode } from "./tvsDiode";
import { varicapVaractorDiode } from "./varicapVaractorDiode";
import { zenerDiode } from "./zenerDiode";

export const diodeCatalog = [
  genericDiode,
  zenerDiode,
  schottkyDiode,
  backwardDiode,
  tunnelDiode,
  pinDiode,
  ledLightEmittingDiode,
  photodiode,
  bidirectionalPhotodiode,
  commonCathodePhotodiode,
  tvsDiode,
  thermalDiode,
  laserDiode,
  magneticallySensitiveDiode,
  stepRecoveryDiode,
  varicapVaractorDiode,
  shockleyDiode,
  ledBicolor,
  scrSiliconControlledRectifier,
] as const;
