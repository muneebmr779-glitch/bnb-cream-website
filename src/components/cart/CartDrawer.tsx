"use client";

import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCartStore, cartSubtotal } from "@/store/cart";
import { formatPrice } from "@/lib/format";

export function CartDrawer() {
  const [mounted, setMounted] = useState(false);
  const isOpen = useCartStore((s) => s.isOpen);
  const close = useCartStore((s) => s.close);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;

  const subtotal = cartSubtotal(items);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-chocolate-900/60 backdrop-blur-sm"
            onClick={close}
            aria-hidden="true"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex h-full w-full max-w-md flex-col bg-cream-50 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-chocolate-900/10 px-5 py-4">
              <h2 className="font-display text-xl text-chocolate-900">Your Cart</h2>
              <button
                onClick={close}
                aria-label="Close cart"
                className="rounded-full p-2 text-chocolate-700 hover:bg-chocolate-900/5"
              >
                <X size={20} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
                <ShoppingBag size={40} className="text-chocolate-900/20" />
                <p className="text-chocolate-700/70">Your cart is empty.</p>
                <Link
                  href="/menu"
                  onClick={close}
                  className="mt-2 rounded-full bg-chocolate-900 px-5 py-2.5 text-sm font-medium text-cream-50 hover:bg-accent-600"
                >
                  Browse the Menu
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-5 py-4 thin-scrollbar">
                  {items.map((item) => (
                    <li key={item.key} className="flex gap-3 border-b border-chocolate-900/10 py-4 last:border-0">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-chocolate-800">
                        {item.image && (
                          <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-chocolate-900">{item.name}</p>
                            {item.variant && (
                              <p className="text-xs text-chocolate-700/60">{item.variant}</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item.key)}
                            aria-label={`Remove ${item.name} from cart`}
                            className="text-chocolate-700/40 hover:text-accent-600"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-chocolate-900/15">
                            <button
                              onClick={() => updateQuantity(item.key, item.quantity - 1)}
                              className="p-1.5 text-chocolate-800"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.key, item.quantity + 1)}
                              className="p-1.5 text-chocolate-800"
                              aria-label="Increase quantity"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          <span className="text-sm font-semibold text-accent-600">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-chocolate-900/10 p-5">
                  <div className="mb-4 flex items-center justify-between text-sm">
                    <span className="text-chocolate-700/70">Subtotal</span>
                    <span className="font-display text-lg text-chocolate-900">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={close}
                    className="block w-full rounded-full bg-accent-500 py-3.5 text-center text-sm font-semibold text-cream-50 transition-colors hover:bg-accent-600"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
