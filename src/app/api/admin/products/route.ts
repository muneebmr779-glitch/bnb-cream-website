import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serialize";
import { handleApiError, requireAdminApi } from "@/lib/api";
import { productSchema } from "@/lib/validation";

export async function GET() {
  try {
    await requireAdminApi();
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ products: products.map(serializeProduct) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminApi();
    const body = await request.json();
    const data = productSchema.parse(body);
    const product = await prisma.product.create({
      data,
      include: { category: true },
    });
    return NextResponse.json({ product: serializeProduct(product) }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
