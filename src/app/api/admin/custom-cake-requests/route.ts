import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, requireAdminApi } from "@/lib/api";

export async function GET() {
  try {
    await requireAdminApi();
    const requests = await prisma.customCakeRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ requests });
  } catch (error) {
    return handleApiError(error);
  }
}
