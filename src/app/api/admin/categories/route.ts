import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, requireAdminApi } from "@/lib/api";
import { categorySchema } from "@/lib/validation";

export async function GET() {
  try {
    await requireAdminApi();
    const categories = await prisma.category.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
      include: { _count: { select: { products: true } } },
    });
    return NextResponse.json({ categories });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminApi();
    const body = await request.json();
    const data = categorySchema.parse(body);
    const category = await prisma.category.create({ data });
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
