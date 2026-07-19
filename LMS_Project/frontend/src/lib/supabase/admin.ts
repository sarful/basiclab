import { createClient } from "@supabase/supabase-js";

import { getSupabaseSecretKey, getSupabaseUrl } from "./config";

let adminClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseAdminClient() {
  if (!adminClient) {
    adminClient = createClient(getSupabaseUrl(), getSupabaseSecretKey(), {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return adminClient;
}
