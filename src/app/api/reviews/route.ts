import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, jsonError } from "@/lib/api";
import { reviewCreateSchema } from "@/lib/validation";
import { rateLimit, clientKeyFromRequest } from "@/lib/rate-limit";

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
      take: 30,
    });
    return NextResponse.json({ reviews });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!rateLimit(clientKeyFromRequest(request, "review-submit"), 5, 60_000)) {
      return jsonError("Too many submissions. Please try again later.", 429);
    }
    const body = await request.json();
    const data = reviewCreateSchema.parse(body);
    const review = await prisma.review.create({
      data: { ...data, approved: false },
    });
    return NextResponse.json(
      {
        review,
        message: "Thanks! Your review has been submitted and will appear once approved.",
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
