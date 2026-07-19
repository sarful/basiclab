"use client";

import { useEffect, useState } from "react";

import { fetchLessonProgress, saveLessonProgress } from "./api";
import type { LessonProgressRecord } from "./types";

export default function LessonProgressButton({
  lessonPath,
}: {
  lessonPath: string;
}) {
  const [progress, setProgress] = useState<LessonProgressRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const saved = await saveLessonProgress({
          lessonPath,
          status: "STARTED",
          progressPercent: 20,
        });

        if (!cancelled) {
          setProgress(saved.data);
        }

        const current = await fetchLessonProgress(lessonPath);
        if (!cancelled) {
          setProgress((current.data as LessonProgressRecord | null) ?? null);
          setError(null);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError instanceof Error ? requestError.message : "Unable to track lesson.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, [lessonPath]);

  async function handleComplete() {
    setSaving(true);
    setError(null);

    try {
      const response = await saveLessonProgress({
        lessonPath,
        status: "COMPLETED",
        progressPercent: 100,
      });
      setProgress(response.data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to complete lesson.");
    } finally {
      setSaving(false);
    }
  }

  const isCompleted = progress?.status === "COMPLETED";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          minHeight: 42,
          borderRadius: 14,
          border: "1px solid #d6dee8",
          background: isCompleted ? "#ecfdf5" : "#ffffff",
          padding: "10px 14px",
          color: isCompleted ? "#166534" : "#334155",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        {loading ? "Tracking lesson..." : isCompleted ? "Lesson completed" : "Lesson started"}
      </span>
      <button
        type="button"
        onClick={handleComplete}
        disabled={loading || saving || isCompleted}
        style={{
          minHeight: 42,
          borderRadius: 14,
          border: "1px solid #c9d7ea",
          background: isCompleted ? "#f8fafc" : "#0f172a",
          padding: "10px 14px",
          color: isCompleted ? "#94a3b8" : "#ffffff",
          fontSize: 13,
          fontWeight: 700,
          cursor: loading || saving || isCompleted ? "default" : "pointer",
        }}
      >
        {saving ? "Saving..." : isCompleted ? "Completed" : "Mark complete"}
      </button>
      {progress ? (
        <span style={{ color: "#64748b", fontSize: 12.5, fontWeight: 600 }}>
          {progress.progressPercent}% tracked
        </span>
      ) : null}
      {error ? (
        <span style={{ color: "#b91c1c", fontSize: 12.5, fontWeight: 600 }}>{error}</span>
      ) : null}
    </div>
  );
}
