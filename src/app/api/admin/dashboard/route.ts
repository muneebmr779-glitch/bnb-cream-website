import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, requireAdminApi } from "@/lib/api";

export async function GET() {
  try {
    await requireAdminApi();

    const [
      totalOrders,
      pendingOrders,
      totalProducts,
      unreadMessages,
      pendingReviews,
      revenueAgg,
      recentOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({
        where: { status: { in: ["PENDING", "CONFIRMED", "PREPARING"] } },
      }),
      prisma.product.count(),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.review.count({ where: { approved: false } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: "CANCELLED" } },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalOrders,
        pendingOrders,
        totalProducts,
        unreadMessages,
        pendingReviews,
        totalRevenue: Number(revenueAgg._sum.total ?? 0),
      },
      recentOrders,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
