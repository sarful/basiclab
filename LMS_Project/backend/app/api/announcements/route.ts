import { NextResponse } from "next/server";

import { requireAuth } from "@/services/auth/auth-guards";
import { listPublishedAnnouncements } from "@/services/communication/communication-service";

export async function GET() {
  const auth = await requireAuth();
  const result = await listPublishedAnnouncements(auth?.user.role);
  return NextResponse.json(result.body, { status: result.status });
}
