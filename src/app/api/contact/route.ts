import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, jsonError } from "@/lib/api";
import { contactMessageSchema } from "@/lib/validation";
import { rateLimit, clientKeyFromRequest } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    if (!rateLimit(clientKeyFromRequest(request, "contact"), 5, 60_000)) {
      return jsonError("Too many messages sent. Please try again later.", 429);
    }
    const body = await request.json();
    const data = contactMessageSchema.parse(body);
    const message = await prisma.contactMessage.create({ data });
    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
