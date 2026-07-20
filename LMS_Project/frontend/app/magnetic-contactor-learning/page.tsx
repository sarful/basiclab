"use client";

import Link from "next/link";

import { getLessonTrackConfig } from "../../src/courses/basics-electronics-and-electrical/shared/lessonRegistry";

export default function MagneticContactorLearningPage() {
  const track = getLessonTrackConfig("magnetic-contactor");
  const firstLesson = track.lessons[0];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-700">
            Basics Electronics and Electrical
          </p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">
            {track.label}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            {track.summary}
          </p>

          {firstLesson ? (
            <Link
              href={firstLesson.href}
              className="mt-5 inline-flex rounded-2xl bg-sky-700 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-sky-800"
            >
              Start Lesson {firstLesson.id}
            </Link>
          ) : null}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                Active Lessons
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">
                Render lessons one by one
              </h2>
            </div>
            <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-black text-sky-800">
              {track.lessons.length} lessons
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {track.lessons.map((lesson) => (
              <Link
                key={lesson.id}
                href={lesson.href}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-950 transition hover:border-sky-200 hover:bg-white hover:shadow-sm"
              >
                <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-700">
                  Lesson {lesson.id}
                </p>
                <h3 className="mt-2 text-lg font-black">{lesson.title}</h3>
                <p className="mt-3 text-sm font-bold text-slate-600">
                  Open lesson
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
