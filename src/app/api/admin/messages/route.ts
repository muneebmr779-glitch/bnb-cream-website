import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, requireAdminApi } from "@/lib/api";

export async function GET() {
  try {
    await requireAdminApi();
    const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ messages });
  } catch (error) {
    return handleApiError(error);
  }
}
