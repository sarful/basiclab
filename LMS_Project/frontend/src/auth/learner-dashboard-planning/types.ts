export type LearnerDashboardSectionId =
  | "my-courses"
  | "lessons"
  | "assignments"
  | "exams"
  | "progress"
  | "certificates"
  | "calendar"
  | "messages"
  | "settings";

export type LearnerDashboardSectionPlan = {
  id: LearnerDashboardSectionId;
  label: string;
  status: "placeholder";
  route: string;
  summary: string;
  dataSources: string[];
  notes: string[];
};
