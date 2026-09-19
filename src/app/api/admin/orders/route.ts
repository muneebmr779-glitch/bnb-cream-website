import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, requireAdminApi } from "@/lib/api";
import type { OrderStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    await requireAdminApi();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as OrderStatus | null;
    const search = searchParams.get("search")?.trim();

    const orders = await prisma.order.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(search
          ? {
              OR: [
                { orderNumber: { contains: search, mode: "insensitive" } },
                { customerName: { contains: search, mode: "insensitive" } },
                { customerPhone: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    return NextResponse.json({ orders });
  } catch (error) {
    return handleApiError(error);
  }
}
