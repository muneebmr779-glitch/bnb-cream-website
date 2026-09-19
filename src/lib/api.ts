import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getAdminSession } from "./session";

export function jsonError(message: string, status = 400, extra?: Record<string, unknown>) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return jsonError("Validation failed", 422, { issues: error.flatten() });
  }
  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return jsonError("Unauthorized", 401);
  }
  console.error(error);
  return jsonError("Something went wrong", 500);
}

export async function requireAdminApi() {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}
