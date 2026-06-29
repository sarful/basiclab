export type DerivedLessonType =
  | "logic-theory"
  | "udemy-script"
  | "simulation"
  | "pdf"
  | "video"
  | "download";

export type DerivedLesson = {
  id: string;
  title: string;
  type: DerivedLessonType;
  language?: "en" | "bn";
  content?: string;
  url?: string;
};
