import type { CapacitorLessonMeta } from "./types";

import { getLessonsForTrack } from "../../../shared/lessonRegistry";

export const capacitorLessons = getLessonsForTrack("capacitor") as CapacitorLessonMeta[];
