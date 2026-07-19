"use client";

import { useEffect, useState } from "react";

import { isSupabaseConfigured } from "@/src/lib/supabase/config";

export type BackendMode = "connected" | "disconnected" | "supabase";

const STORAGE_KEY = "lms-backend-mode";
const MODE_EVENT = "lms-backend-mode-change";
const DEFAULT_MODE: BackendMode =
  process.env.NEXT_PUBLIC_LMS_BACKEND_MODE === "disconnected"
    ? "disconnected"
    : process.env.NEXT_PUBLIC_LMS_BACKEND_MODE === "supabase"
      ? "supabase"
      : "connected";

function isBackendMode(value: string | null): value is BackendMode {
  return value === "connected" || value === "disconnected" || value === "supabase";
}

export function getBackendMode(): BackendMode {
  if (typeof window === "undefined") {
    return DEFAULT_MODE;
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEY);
  return isBackendMode(storedValue) ? storedValue : DEFAULT_MODE;
}

export function isBackendDisconnected() {
  return getBackendMode() === "disconnected";
}

export function isSupabaseMode() {
  return getBackendMode() === "supabase";
}

export function shouldUseSupabase() {
  return isSupabaseMode() && isSupabaseConfigured();
}

export function setBackendMode(mode: BackendMode) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, mode);
  window.dispatchEvent(new CustomEvent<BackendMode>(MODE_EVENT, { detail: mode }));
}

export function useBackendMode() {
  const [mode, setMode] = useState<BackendMode>(getBackendMode);

  useEffect(() => {
    function syncMode() {
      setMode(getBackendMode());
    }

    function handleStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEY) {
        syncMode();
      }
    }

    window.addEventListener(MODE_EVENT, syncMode as EventListener);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(MODE_EVENT, syncMode as EventListener);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return {
    mode,
    isDisconnected: mode === "disconnected",
    isSupabase: mode === "supabase",
    isSupabaseConfigured: isSupabaseConfigured(),
    setMode: setBackendMode,
  };
}
