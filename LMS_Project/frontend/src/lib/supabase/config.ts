const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ??
  "";
const supabaseSecretKey =
  process.env.SUPABASE_SECRET_KEY?.trim() ??
  process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ??
  "";

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabasePublishableKey);
}

export function getSupabaseUrl() {
  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured.");
  }

  return supabaseUrl;
}

export function getSupabasePublishableKey() {
  if (!supabasePublishableKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not configured.",
    );
  }

  return supabasePublishableKey;
}

export function getSupabaseSecretKey() {
  if (!supabaseSecretKey) {
    throw new Error("SUPABASE_SECRET_KEY is not configured.");
  }

  return supabaseSecretKey;
}

export function getSupabaseProjectHost() {
  if (!supabaseUrl) {
    return null;
  }

  try {
    return new URL(supabaseUrl).host;
  } catch {
    return supabaseUrl;
  }
}
