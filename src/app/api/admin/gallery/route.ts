import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, requireAdminApi } from "@/lib/api";
import { galleryImageSchema } from "@/lib/validation";

export async function GET() {
  try {
    await requireAdminApi();
    const images = await prisma.galleryImage.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ images });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminApi();
    const body = await request.json();
    const data = galleryImageSchema.parse(body);
    const image = await prisma.galleryImage.create({ data });
    return NextResponse.json({ image }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
