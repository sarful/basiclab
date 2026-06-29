import type { CurrentVoltageLessonMeta } from "./types";

import { getLessonsForTrack } from "../../../shared/lessonRegistry";

export const currentVoltageLessons = getLessonsForTrack("current-voltage") as CurrentVoltageLessonMeta[];
