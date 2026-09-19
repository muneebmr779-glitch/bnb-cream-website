import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, requireAdminApi } from "@/lib/api";
import { reviewCreateSchema } from "@/lib/validation";

export async function GET() {
  try {
    await requireAdminApi();
    const reviews = await prisma.review.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ reviews });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminApi();
    const body = await request.json();
    const data = reviewCreateSchema.parse(body);
    const review = await prisma.review.create({ data: { ...data, approved: true } });
    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
