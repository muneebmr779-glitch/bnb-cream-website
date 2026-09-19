import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serialize";
import { handleApiError, requireAdminApi } from "@/lib/api";
import { productSchema } from "@/lib/validation";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminApi();
    const { id } = await params;
    const body = await request.json();
    const data = productSchema.partial().parse(body);
    const product = await prisma.product.update({
      where: { id },
      data,
      include: { category: true },
    });
    return NextResponse.json({ product: serializeProduct(product) });
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
    const usedInOrders = await prisma.orderItem.findFirst({ where: { productId: id } });
    if (usedInOrders) {
      await prisma.product.update({ where: { id }, data: { available: false } });
      return NextResponse.json({
        message: "Product has existing orders, so it was marked unavailable instead of deleted.",
      });
    }
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
