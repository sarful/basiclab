import { assignmentsPlan } from "./AssignmentsPlan";
import { calendarPlan } from "./CalendarPlan";
import { certificatesPlan } from "./CertificatesPlan";
import { examsPlan } from "./ExamsPlan";
import { lessonsPlan } from "./LessonsPlan";
import { messagesPlan } from "./MessagesPlan";
import { myCoursesPlan } from "./MyCoursesPlan";
import { progressPlan } from "./ProgressPlan";
import { settingsPlan } from "./SettingsPlan";

export const learnerDashboardSections = [
  myCoursesPlan,
  lessonsPlan,
  assignmentsPlan,
  examsPlan,
  progressPlan,
  certificatesPlan,
  calendarPlan,
  messagesPlan,
  settingsPlan,
] as const;
