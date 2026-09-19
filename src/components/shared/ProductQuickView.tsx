"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { ProductDTO } from "@/types";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/store/cart";
import { Modal } from "./Modal";

export function ProductQuickView({
  product,
  open,
  onClose,
}: {
  product: ProductDTO;
  open: boolean;
  onClose: () => void;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const [variantIndex, setVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState("");

  const variant = product.variants[variantIndex];
  const unitPrice = product.price + (variant?.priceModifier ?? 0);
  const image = product.images[0] ?? "/images/products/placeholder.svg";

  function handleAdd() {
    addItem(
      {
        productId: product.id,
        name: product.name,
        image,
        price: unitPrice,
        variant: variant?.name ?? null,
        specialInstructions: instructions,
      },
      quantity
    );
    toast.success(`${product.name} added to cart`);
    onClose();
    setQuantity(1);
    setInstructions("");
  }

  return (
    <Modal open={open} onClose={onClose} labelledBy="quickview-title" maxWidthClass="max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <div className="relative aspect-square sm:aspect-auto sm:h-full">
          <Image src={image} alt={product.name} fill className="object-cover" sizes="(min-width: 640px) 50vw, 100vw" />
        </div>
        <div className="flex flex-col p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-caramel-600">
            {product.category.name}
          </p>
          <h3 id="quickview-title" className="mt-1 font-display text-2xl text-chocolate-900">
            {product.name}
          </h3>
          <p className="mt-2 text-sm text-chocolate-700/80">{product.description}</p>
          <p className="mt-3 font-display text-xl text-accent-600">{formatPrice(unitPrice)}</p>

          {product.variants.length > 0 && (
            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-chocolate-700">
                Size / Variant
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, i) => (
                  <button
                    key={v.name}
                    onClick={() => setVariantIndex(i)}
                    className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                      i === variantIndex
                        ? "border-chocolate-900 bg-chocolate-900 text-cream-50"
                        : "border-chocolate-900/20 text-chocolate-800 hover:border-chocolate-900/40"
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4">
            <label htmlFor="qv-instructions" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-chocolate-700">
              Special instructions (optional)
            </label>
            <textarea
              id="qv-instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={2}
              maxLength={500}
              placeholder="e.g. Happy Birthday Sara, extra chocolate drip"
              className="w-full resize-none rounded-lg border border-chocolate-900/15 bg-white p-2.5 text-sm outline-none focus:border-caramel-500 focus:ring-1 focus:ring-caramel-500"
            />
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div className="flex items-center rounded-full border border-chocolate-900/15">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2.5 text-chocolate-800 hover:text-accent-600"
                aria-label="Decrease quantity"
              >
                <Minus size={15} />
              </button>
              <span className="w-8 text-center text-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(50, q + 1))}
                className="p-2.5 text-chocolate-800 hover:text-accent-600"
                aria-label="Increase quantity"
              >
                <Plus size={15} />
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={!product.available}
              className="flex items-center gap-2 rounded-full bg-chocolate-900 px-5 py-3 text-sm font-medium text-cream-50 transition-colors hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ShoppingBag size={16} />
              Add to Cart · {formatPrice(unitPrice * quantity)}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
