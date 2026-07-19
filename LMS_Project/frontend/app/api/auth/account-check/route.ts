import { NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/src/lib/supabase/admin";
import { errorResponse, successResponse } from "@/src/lib/supabase/lms-server";

type AuthEmailLookup = {
  authEmailExists: boolean;
  authUserId: string | null;
  authEmailConfirmed: boolean;
};

async function findAuthEmail(email: string): Promise<AuthEmailLookup> {
  const admin = getSupabaseAdminClient();
  const normalizedEmail = email.trim().toLowerCase();
  const perPage = 1000;

  for (let page = 1; page <= 10; page += 1) {
    const response = await admin.auth.admin.listUsers({ page, perPage });

    if (response.error) {
      throw response.error;
    }

    const users = response.data.users ?? [];
    const found = users.find(
      (user) => user.email?.trim().toLowerCase() === normalizedEmail,
    );

    if (found) {
      return {
        authEmailExists: true,
        authUserId: found.id,
        authEmailConfirmed: Boolean(found.email_confirmed_at),
      };
    }

    if (users.length < perPage) {
      return {
        authEmailExists: false,
        authUserId: null,
        authEmailConfirmed: false,
      };
    }
  }

  return {
    authEmailExists: false,
    authUserId: null,
    authEmailConfirmed: false,
  };
}

async function profileExistsForUser(userId: string | null) {
  if (!userId) {
    return false;
  }

  const admin = getSupabaseAdminClient();
  const response = await admin
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .limit(1);

  if (response.error) {
    throw response.error;
  }

  return Boolean(response.data?.length);
}

async function usernameExists(username: string) {
  const admin = getSupabaseAdminClient();
  const response = await admin
    .from("profiles")
    .select("id")
    .ilike("username", username.trim())
    .limit(1);

  if (response.error) {
    throw response.error;
  }

  return Boolean(response.data?.length);
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      email?: string;
      username?: string;
    };
    const email = payload.email?.trim() ?? "";
    const username = payload.username?.trim() ?? "";

    if (!email && !username) {
      return NextResponse.json(
        errorResponse("Email or username is required."),
        { status: 400 },
      );
    }

    const [emailLookup, usernameFound] = await Promise.all([
      email
        ? findAuthEmail(email)
        : Promise.resolve({
            authEmailExists: false,
            authUserId: null,
            authEmailConfirmed: false,
          }),
      username ? usernameExists(username) : Promise.resolve(false),
    ]);
    const profileFound = await profileExistsForUser(emailLookup.authUserId);

    return NextResponse.json(
      successResponse("Account availability checked.", {
        emailExists: emailLookup.authEmailExists,
        authEmailExists: emailLookup.authEmailExists,
        profileExistsForEmail: profileFound,
        authEmailConfirmed: emailLookup.authEmailConfirmed,
        usernameExists: usernameFound,
      }),
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to check account.";
    return NextResponse.json(errorResponse(message), { status: 400 });
  }
}
