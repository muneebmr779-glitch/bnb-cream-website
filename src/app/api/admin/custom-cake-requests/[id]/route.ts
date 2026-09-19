import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, requireAdminApi } from "@/lib/api";
import { orderStatusSchema } from "@/lib/validation";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminApi();
    const { id } = await params;
    const body = await request.json();
    const { status } = orderStatusSchema.parse(body);
    const cakeRequest = await prisma.customCakeRequest.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json({ request: cakeRequest });
  } catch (error) {
    return handleApiError(error);
  }
}
