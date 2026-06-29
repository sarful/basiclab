import { CourseModel } from "@/db/models/Course";

export const DEFAULT_BASICS_COURSE_SLUG = "basics-electronics-and-electrical";

export async function ensureDefaultBasicsCourse() {
  const existing = await CourseModel.findOne({ slug: DEFAULT_BASICS_COURSE_SLUG });

  if (existing) {
    if (!existing.description) {
      existing.description =
        "Basics Electronics and Electrical course with current, voltage, resistor, capacitor, diode, and measurement lesson modules.";
      await existing.save();
    }

    return existing;
  }

  return CourseModel.create({
    title: "Basics Electronics and Electrical",
    slug: DEFAULT_BASICS_COURSE_SLUG,
    description:
      "Basics Electronics and Electrical course with current, voltage, resistor, capacitor, diode, transformer, relay, and measurement lesson modules.",
    status: "PUBLISHED",
  });
}
