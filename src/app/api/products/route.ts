import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serialize";
import { handleApiError } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");
    const search = searchParams.get("search")?.trim();
    const featured = searchParams.get("featured");

    const products = await prisma.product.findMany({
      where: {
        available: true,
        ...(categorySlug && categorySlug !== "all"
          ? { category: { slug: categorySlug } }
          : {}),
        ...(featured === "true" ? { featured: true } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: { category: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ products: products.map(serializeProduct) });
  } catch (error) {
    return handleApiError(error);
  }
}
