import type { DiodeLessonMeta } from "./types";

import { getLessonsForTrack } from "../../../shared/lessonRegistry";

export const diodeLessons = getLessonsForTrack("diode") as DiodeLessonMeta[];
