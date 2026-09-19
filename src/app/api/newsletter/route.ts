import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, jsonError } from "@/lib/api";
import { newsletterSchema } from "@/lib/validation";
import { rateLimit, clientKeyFromRequest } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    if (!rateLimit(clientKeyFromRequest(request, "newsletter"), 5, 60_000)) {
      return jsonError("Too many attempts. Please try again later.", 429);
    }
    const body = await request.json();
    const { email } = newsletterSchema.parse(body);
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {},
      create: { email },
    });
    return NextResponse.json({ message: "Subscribed!" }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
