import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, requireAdminApi } from "@/lib/api";
import { orderStatusSchema } from "@/lib/validation";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminApi();
    const { id } = await params;
    const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
    return NextResponse.json({ order });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminApi();
    const { id } = await params;
    const body = await request.json();
    const { status } = orderStatusSchema.parse(body);
    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });
    return NextResponse.json({ order });
  } catch (error) {
    return handleApiError(error);
  }
}
