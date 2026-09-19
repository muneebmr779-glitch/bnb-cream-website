"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { ProductDTO } from "@/types";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/store/cart";
import { Reveal } from "./Reveal";
import { ProductQuickView } from "./ProductQuickView";

export function ProductCard({ product, index = 0 }: { product: ProductDTO; index?: number }) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const image = product.images[0] ?? `/images/products/placeholder.svg`;

  function handleQuickAdd() {
    addItem(
      {
        productId: product.id,
        name: product.name,
        image,
        price: product.price + (product.variants[0]?.priceModifier ?? 0),
        variant: product.variants[0]?.name ?? null,
        specialInstructions: "",
      },
      1
    );
    toast.success(`${product.name} added to cart`);
  }

  return (
    <>
      <Reveal delay={Math.min(index, 6) * 0.05} className="group h-full">
        <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-chocolate-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="relative aspect-square overflow-hidden bg-chocolate-800">
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {!product.available && (
              <div className="absolute inset-0 flex items-center justify-center bg-chocolate-900/60">
                <span className="rounded-full bg-cream-50 px-3 py-1 text-xs font-semibold text-chocolate-900">
                  Currently unavailable
                </span>
              </div>
            )}
            <button
              onClick={() => setQuickViewOpen(true)}
              className="absolute right-3 top-3 rounded-full bg-cream-50/95 p-2 text-chocolate-800 opacity-0 shadow transition-opacity duration-300 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-500"
              aria-label={`Quick view ${product.name}`}
            >
              <Eye size={17} />
            </button>
          </div>

          <div className="flex flex-1 flex-col p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-caramel-600">
              {product.category.name}
            </p>
            <h3 className="mt-1 font-display text-lg text-chocolate-900">{product.name}</h3>
            <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-chocolate-700/75">
              {product.description}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-display text-lg text-accent-600">
                {formatPrice(product.price)}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuickViewOpen(true)}
                  className="rounded-full border border-chocolate-900/15 px-3 py-2 text-xs font-medium text-chocolate-800 transition-colors hover:border-chocolate-900/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-500"
                >
                  Quick View
                </button>
                <button
                  onClick={handleQuickAdd}
                  disabled={!product.available}
                  className="flex items-center gap-1.5 rounded-full bg-chocolate-900 px-3.5 py-2 text-xs font-medium text-cream-50 transition-colors hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-500"
                >
                  <ShoppingBag size={14} />
                  Add
                </button>
              </div>
            </div>
          </div>
        </article>
      </Reveal>
      <ProductQuickView
        product={product}
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
}
