"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { ComponentType } from "react";

import ACMotorIndustrialLab from "../../../src/courses/Industrial_Sensor/ACMotorIndustrialLab";
import CurrentSensorIndustrialLab from "../../../src/courses/Industrial_Sensor/CurrentSensorIndustrialLab";
import FlowSensorIndustrialLab from "../../../src/courses/Industrial_Sensor/FlowSensorIndustrialLab";
import HallEffectSensorIndustrialLab from "../../../src/courses/Industrial_Sensor/HallEffectSensorIndustrialLab";
import LaserSensorIndustrialLab from "../../../src/courses/Industrial_Sensor/LaserSensorIndustrialLab";
import LevelSensorIndustrialLab from "../../../src/courses/Industrial_Sensor/LevelSensorIndustrialLab";
import LoadCellIndustrialLab from "../../../src/courses/Industrial_Sensor/LoadCellIndustrialLab";
import PhotoelectricSensorIndustrialLab from "../../../src/courses/Industrial_Sensor/PhotoelectricSensorIndustrialLab";
import PressureSensorIndustrialLab from "../../../src/courses/Industrial_Sensor/PressureSensorIndustrialLab";
import ProximitySensorIndustrialLab from "../../../src/courses/Industrial_Sensor/ProximitySensorIndustrialLab";
import ReedSwitchSensorIndustrialLab from "../../../src/courses/Industrial_Sensor/ReedSwitchSensorIndustrialLab";
import RotaryEncoderIndustrialLab from "../../../src/courses/Industrial_Sensor/RotaryEncoderIndustrialLab";
import RTDPT100IndustrialLab from "../../../src/courses/Industrial_Sensor/RTDPT100IndustrialLab";
import ServoMotorIndustrialLab from "../../../src/courses/Industrial_Sensor/ServoMotorIndustrialLab";
import StepperMotorIndustrialLab from "../../../src/courses/Industrial_Sensor/StepperMotorIndustrialLab";
import ThermistorIndustrialLab from "../../../src/courses/Industrial_Sensor/ThermistorIndustrialLab";
import ThermocoupleIndustrialLab from "../../../src/courses/Industrial_Sensor/ThermocoupleIndustrialLab";
import UltrasonicSensorIndustrialLab from "../../../src/courses/Industrial_Sensor/UltrasonicSensorIndustrialLab";
import VoltageSensorIndustrialLab from "../../../src/courses/Industrial_Sensor/VoltageSensorIndustrialLab";
import { industrialSensorCourseModules } from "../../../src/courses/Industrial_Sensor/courseCatalog";
import UniversalLessonHeader from "../../../src/courses/basics-electronics-and-electrical/shared/UniversalLessonHeader";

const lessonComponents: Record<string, ComponentType> = {
  "ac-motor": ACMotorIndustrialLab,
  "current-sensor": CurrentSensorIndustrialLab,
  "flow-sensor": FlowSensorIndustrialLab,
  "hall-effect-sensor": HallEffectSensorIndustrialLab,
  "laser-sensor": LaserSensorIndustrialLab,
  "level-sensor": LevelSensorIndustrialLab,
  "load-cell": LoadCellIndustrialLab,
  "photoelectric-sensor": PhotoelectricSensorIndustrialLab,
  "pressure-sensor": PressureSensorIndustrialLab,
  "proximity-sensor": ProximitySensorIndustrialLab,
  "reed-switch-sensor": ReedSwitchSensorIndustrialLab,
  "rotary-encoder": RotaryEncoderIndustrialLab,
  "rtd-pt100": RTDPT100IndustrialLab,
  "servo-motor": ServoMotorIndustrialLab,
  "stepper-motor": StepperMotorIndustrialLab,
  thermistor: ThermistorIndustrialLab,
  thermocouple: ThermocoupleIndustrialLab,
  "ultrasonic-sensor": UltrasonicSensorIndustrialLab,
  "voltage-sensor": VoltageSensorIndustrialLab,
};

const industrialSensorHeaderNavItems = [
  { href: "/", label: "Home" },
  { href: "/courses/industrial-sensor", label: "My Course" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function IndustrialSensorLessonPage() {
  const params = useParams<{ lessonSlug: string }>();
  const lessonSlug = params.lessonSlug;
  const LessonComponent = lessonComponents[lessonSlug];
  const currentIndex = industrialSensorCourseModules.findIndex((module) =>
    module.href.endsWith(`/${lessonSlug}`),
  );
  const currentLesson = industrialSensorCourseModules[currentIndex];
  const previousLesson = industrialSensorCourseModules[currentIndex - 1];
  const nextLesson = industrialSensorCourseModules[currentIndex + 1];

  if (!LessonComponent || !currentLesson) {
    return (
      <main className="dashboard-page">
        <section className="dashboard-shell course-page-shell">
          <div className="dashboard-surface-card course-surface-card">
            <p className="dashboard-section-kicker">Industrial Sensor</p>
            <h1>Lesson not found</h1>
            <p className="dashboard-copy">
              This Industrial Sensor lesson route is not available in the course catalog.
            </p>
            <div className="dashboard-actions">
              <Link href="/courses/industrial-sensor" className="dashboard-primary-link">
                Back to course
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <header
        style={{
          padding: "16px",
          background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
          position: "sticky",
          top: 0,
          zIndex: 40,
          boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
        }}
      >
        <UniversalLessonHeader
          lessonLabel="Industrial Sensor"
          tabs={[
            {
              id: "current-lesson",
              label: `Lesson ${currentIndex + 1}: ${currentLesson.shortTitle}`,
            },
          ]}
          activeTab="current-lesson"
          navItems={industrialSensorHeaderNavItems}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            maxWidth: 1240,
            margin: "12px auto 0",
          }}
        >
          {previousLesson ? (
            <Link href={previousLesson.href} className="dashboard-secondary-link">
              Previous Lesson
            </Link>
          ) : (
            <span
              className="dashboard-secondary-link"
              aria-disabled="true"
              style={{ opacity: 0.55 }}
            >
              Previous Lesson
            </span>
          )}
          {nextLesson ? (
            <Link href={nextLesson.href} className="dashboard-primary-link">
              Next Lesson
            </Link>
          ) : (
            <Link href="/courses/industrial-sensor" className="dashboard-primary-link">
              Course Page
            </Link>
          )}
        </div>
      </header>
      <LessonComponent />
    </main>
  );
}
