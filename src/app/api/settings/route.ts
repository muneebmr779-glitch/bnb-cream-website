import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api";

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: "main" } });
    return NextResponse.json({ settings });
  } catch (error) {
    return handleApiError(error);
  }
}
