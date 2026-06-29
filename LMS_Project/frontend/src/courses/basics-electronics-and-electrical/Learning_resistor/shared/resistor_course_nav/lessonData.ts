import type { ResistorLessonMeta } from "./types";

import { getLessonsForTrack } from "../../../shared/lessonRegistry";

export const resistorLessons = getLessonsForTrack("resistor") as ResistorLessonMeta[];
