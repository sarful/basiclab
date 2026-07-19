import type { User } from "@supabase/supabase-js";

import type { RegisterPayload, UserRole } from "@/src/auth/types";

import { getBrowserSupabaseClient } from "./client";
import {
  normalizeProfileToAuthUser,
  type SupabaseProfileRow,
} from "./lms-shared";

function toFriendlyAuthError(error: { message?: string } | null | undefined) {
  const message = error?.message?.trim() ?? "Supabase authentication failed.";
  const normalized = message.toLowerCase();

  if (normalized.includes("email not confirmed")) {
    return "Email not confirmed. Check your inbox, confirm the email, then login again.";
  }

  if (normalized.includes("invalid login credentials")) {
    return "Wrong email or password. Please try again.";
  }

  if (normalized.includes("user already registered")) {
    return "This email is already registered. Try logging in instead.";
  }

  if (normalized.includes("email rate limit exceeded") || normalized.includes("security purposes")) {
    return "Too many verification emails were requested. Please wait 5-10 minutes, then try again. If this email already has an account, use Login or Forgot password instead.";
  }

  if (normalized.includes("email address") && normalized.includes("invalid")) {
    return "This email address is not valid. Please use a real email address and try again.";
  }

  if (normalized.includes("signup is disabled")) {
    return "Supabase signup is disabled for this project. Enable Email provider in Authentication > Providers.";
  }

  return message;
}

function getAuthRedirectUrl(path: string) {
  if (typeof window === "undefined") {
    return undefined;
  }

  return `${window.location.origin}${path}`;
}

async function fetchProfile(userId: string) {
  const supabase = getBrowserSupabaseClient();
  const response = await supabase
    .from("profiles")
    .select("id, full_name, username, mobile_number, date_of_birth, gender, country, address, occupation, engineering_discipline, institution_or_company_name, identity_number, role, account_state, preferred_language, is_suspended, created_at, updated_at")
    .eq("id", userId)
    .maybeSingle();

  if (response.error) {
    return null;
  }

  return (response.data as SupabaseProfileRow | null) ?? null;
}

export async function fetchSupabaseCurrentUser() {
  const supabase = getBrowserSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(toFriendlyAuthError(error));
  }

  if (!user) {
    throw new Error("Unauthorized");
  }

  const profile = await fetchProfile(user.id);
  return normalizeProfileToAuthUser(user as User, profile);
}

export async function loginWithSupabase(email: string, password: string) {
  const supabase = getBrowserSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw new Error(toFriendlyAuthError(error));
  }

  return fetchSupabaseCurrentUser();
}

export async function requestSupabasePasswordReset(email: string) {
  const supabase = getBrowserSupabaseClient();
  const redirectTo = getAuthRedirectUrl("/reset-password");
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    throw new Error(toFriendlyAuthError(error));
  }
}

export async function prepareSupabasePasswordRecovery() {
  const supabase = getBrowserSupabaseClient();
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const accessToken = hashParams.get("access_token");
  const refreshToken = hashParams.get("refresh_token");

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      throw new Error(toFriendlyAuthError(error));
    }

    return;
  }

  if (accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (error) {
      throw new Error(toFriendlyAuthError(error));
    }

    return;
  }

  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(toFriendlyAuthError(error));
  }

  if (!data.session) {
    throw new Error("Password reset link is missing or expired. Request a new reset email.");
  }
}

export async function updateSupabasePassword(password: string) {
  const supabase = getBrowserSupabaseClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    throw new Error(toFriendlyAuthError(error));
  }
}

export async function resendSupabaseVerificationEmail(email: string) {
  const supabase = getBrowserSupabaseClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: getAuthRedirectUrl("/login?verified=1"),
    },
  });

  if (error) {
    throw new Error(toFriendlyAuthError(error));
  }
}

export async function registerWithSupabase(input: RegisterPayload & {
  role: UserRole;
}) {
  const supabase = getBrowserSupabaseClient();
  const preferredLanguage = input.preferredLanguage;
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: getAuthRedirectUrl("/login?verified=1"),
      data: {
        full_name: input.fullName,
        username: input.username,
        mobile_number: input.mobileNumber,
        date_of_birth: input.dateOfBirth || null,
        gender: input.gender || null,
        country: input.country,
        address: input.address || null,
        occupation: input.occupation,
        engineering_discipline: input.engineeringDiscipline,
        institution_or_company_name: input.institutionOrCompanyName,
        identity_number: input.identityNumber || null,
        role: input.role,
        preferred_language: preferredLanguage,
      },
    },
  });

  if (error) {
    throw new Error(toFriendlyAuthError(error));
  }

  if (!data.session && data.user) {
    return normalizeProfileToAuthUser(data.user as User, null);
  }

  return fetchSupabaseCurrentUser();
}

export async function logoutFromSupabase() {
  const supabase = getBrowserSupabaseClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(toFriendlyAuthError(error));
  }
}
