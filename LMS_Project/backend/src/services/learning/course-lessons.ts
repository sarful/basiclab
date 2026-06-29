import type { DerivedLesson } from "@/services/learning/learning-types";
import type { UserRole } from "@/types/auth";
import { filterDerivedLessonsForRole } from "@/services/learning/lesson-variant-access";

type CourseShape = {
  logicTheoryEn?: string;
  logicTheoryBn?: string;
  udemyScriptEn?: string;
  udemyScriptBn?: string;
  simulationUrl?: string;
  resourcePdfUrl?: string;
  videoUrl?: string;
  downloadableUrl?: string;
};

export function deriveCourseLessons(course: CourseShape): DerivedLesson[] {
  const lessons: DerivedLesson[] = [];

  if (course.logicTheoryEn) {
    lessons.push({
      id: "logic-theory-en",
      title: "Logic & Theory (English)",
      type: "logic-theory",
      language: "en",
      content: course.logicTheoryEn,
    });
  }

  if (course.logicTheoryBn) {
    lessons.push({
      id: "logic-theory-bn",
      title: "Logic & Theory (Bangla)",
      type: "logic-theory",
      language: "bn",
      content: course.logicTheoryBn,
    });
  }

  if (course.udemyScriptEn) {
    lessons.push({
      id: "udemy-script-en",
      title: "Udemy Script (English)",
      type: "udemy-script",
      language: "en",
      content: course.udemyScriptEn,
    });
  }

  if (course.udemyScriptBn) {
    lessons.push({
      id: "udemy-script-bn",
      title: "Udemy Script (Bangla)",
      type: "udemy-script",
      language: "bn",
      content: course.udemyScriptBn,
    });
  }

  if (course.simulationUrl) {
    lessons.push({
      id: "simulation",
      title: "Simulation",
      type: "simulation",
      url: course.simulationUrl,
    });
  }

  if (course.resourcePdfUrl) {
    lessons.push({
      id: "pdf-resource",
      title: "PDF Resource",
      type: "pdf",
      url: course.resourcePdfUrl,
    });
  }

  if (course.videoUrl) {
    lessons.push({
      id: "video-lesson",
      title: "Video Lesson",
      type: "video",
      url: course.videoUrl,
    });
  }

  if (course.downloadableUrl) {
    lessons.push({
      id: "downloadable-file",
      title: "Downloadable File",
      type: "download",
      url: course.downloadableUrl,
    });
  }

  return lessons;
}

export function deriveCourseLessonsForRole(course: CourseShape, role: UserRole) {
  return filterDerivedLessonsForRole(deriveCourseLessons(course), role);
}
