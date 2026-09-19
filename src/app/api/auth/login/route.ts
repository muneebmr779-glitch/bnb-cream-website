import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSessionToken, sessionCookieOptions, verifyPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { handleApiError, jsonError } from "@/lib/api";
import { rateLimit, clientKeyFromRequest } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    if (!rateLimit(clientKeyFromRequest(request, "login"), 10, 60_000)) {
      return jsonError("Too many attempts. Please try again shortly.", 429);
    }

    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return jsonError("Invalid email or password", 401);
    }

    const valid = await verifyPassword(password, admin.passwordHash);
    if (!valid) {
      return jsonError("Invalid email or password", 401);
    }

    const token = await createSessionToken({
      adminId: admin.id,
      email: admin.email,
      name: admin.name,
    });

    const response = NextResponse.json({
      admin: { id: admin.id, name: admin.name, email: admin.email },
    });
    response.cookies.set(sessionCookieOptions.name, token, sessionCookieOptions);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
