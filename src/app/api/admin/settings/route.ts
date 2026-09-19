import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, requireAdminApi } from "@/lib/api";
import { siteSettingsSchema } from "@/lib/validation";

export async function GET() {
  try {
    await requireAdminApi();
    const settings = await prisma.siteSettings.findUnique({ where: { id: "main" } });
    return NextResponse.json({ settings });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdminApi();
    const body = await request.json();
    const data = siteSettingsSchema.parse(body);
    const settings = await prisma.siteSettings.upsert({
      where: { id: "main" },
      update: data,
      create: { id: "main", ...data },
    });
    return NextResponse.json({ settings });
  } catch (error) {
    return handleApiError(error);
  }
}
