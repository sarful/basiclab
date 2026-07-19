import { redirect } from "next/navigation";

import { industrialSensorFirstLessonHref } from "../../src/courses/Industrial_Sensor/courseCatalog";

export default function IndustrialSensorLessonsIndexPage() {
  redirect(industrialSensorFirstLessonHref);
}
