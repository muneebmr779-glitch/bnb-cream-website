import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, requireAdminApi } from "@/lib/api";
import { offerSchema } from "@/lib/validation";

export async function GET() {
  try {
    await requireAdminApi();
    const offers = await prisma.offer.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ offers });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminApi();
    const body = await request.json();
    const data = offerSchema.parse(body);
    const offer = await prisma.offer.create({
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });
    return NextResponse.json({ offer }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
