import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, requireAdminApi } from "@/lib/api";
import { z } from "zod";

const updateSchema = z.object({ read: z.boolean() });

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminApi();
    const { id } = await params;
    const body = await request.json();
    const { read } = updateSchema.parse(body);
    const message = await prisma.contactMessage.update({ where: { id }, data: { read } });
    return NextResponse.json({ message });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminApi();
    const { id } = await params;
    await prisma.contactMessage.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
