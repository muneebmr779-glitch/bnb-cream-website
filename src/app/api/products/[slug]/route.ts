import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serialize";
import { handleApiError, jsonError } from "@/lib/api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });
    if (!product || !product.available) {
      return jsonError("Product not found", 404);
    }
    return NextResponse.json({ product: serializeProduct(product) });
  } catch (error) {
    return handleApiError(error);
  }
}
