"use client";

import { createClient as createBrowserClient } from "@/utils/supabase/client";
export const createClient = createBrowserClient;

let browserClient: ReturnType<typeof createClient> | null = null;

export function getBrowserSupabaseClient() {
  if (!browserClient) {
    browserClient = createClient();
  }

  return browserClient;
}
