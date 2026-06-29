import type { MeasurementPracticalLessonMeta } from "./types";

import { getLessonsForTrack } from "../../../shared/lessonRegistry";

export const measurementPracticalLessons = getLessonsForTrack(
  "measurement-practical",
) as MeasurementPracticalLessonMeta[];
