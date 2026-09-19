import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api";

export async function GET() {
  try {
    const now = new Date();
    const offers = await prisma.offer.findMany({
      where: {
        active: true,
        OR: [{ startDate: null }, { startDate: { lte: now } }],
        AND: [{ OR: [{ endDate: null }, { endDate: { gte: now } }] }],
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ offers });
  } catch (error) {
    return handleApiError(error);
  }
}
