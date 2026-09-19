import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, jsonError } from "@/lib/api";
import { customCakeRequestSchema } from "@/lib/validation";
import { rateLimit, clientKeyFromRequest } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    if (!rateLimit(clientKeyFromRequest(request, "custom-cake"), 5, 60_000)) {
      return jsonError("Too many requests sent. Please try again later.", 429);
    }
    const body = await request.json();
    const data = customCakeRequestSchema.parse(body);
    const cakeRequest = await prisma.customCakeRequest.create({
      data: {
        ...data,
        email: data.email || null,
        dateNeeded: new Date(data.dateNeeded),
      },
    });
    return NextResponse.json({ request: cakeRequest }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
