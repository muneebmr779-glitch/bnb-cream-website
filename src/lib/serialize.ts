import type { Category, Product } from "@prisma/client";
import type { ProductVariant } from "@/types";

type ProductWithCategory = Product & { category: Category };

export function serializeProduct(product: ProductWithCategory) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: Number(product.price),
    images: product.images,
    variants: (product.variants as ProductVariant[] | null) ?? [],
    available: product.available,
    featured: product.featured,
    categoryId: product.categoryId,
    category: {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug,
    },
  };
}
