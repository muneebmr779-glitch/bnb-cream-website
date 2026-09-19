"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingBag, X } from "lucide-react";
import clsx from "clsx";
import { useCartStore, cartCount } from "@/store/cart";

const LINKS = [
  { href: "/#home", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/menu", label: "Menu" },
  { href: "/#cakes", label: "Cakes" },
  { href: "/gallery", label: "Gallery" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const items = useCartStore((s) => s.items);
  const openCart = useCartStore((s) => s.open);
  const count = cartCount(items);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isHome = pathname === "/";

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        scrolled || !isHome
          ? "bg-cream-50/95 shadow-sm backdrop-blur-md"
          : "bg-gradient-to-b from-chocolate-900/60 to-transparent"
      )}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between container-px" aria-label="Primary">
        <Link
          href="/"
          className={clsx(
            "font-display text-2xl tracking-[0.15em] transition-colors",
            scrolled || !isHome ? "text-chocolate-900" : "text-cream-50"
          )}
        >
          CAKOO
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={clsx(
                  "text-sm font-medium tracking-wide transition-colors hover:text-caramel-500",
                  scrolled || !isHome ? "text-chocolate-800" : "text-cream-50/90"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            onClick={openCart}
            aria-label={`Open cart, ${count} items`}
            className={clsx(
              "relative rounded-full p-2.5 transition-colors",
              scrolled || !isHome
                ? "text-chocolate-800 hover:bg-chocolate-900/5"
                : "text-cream-50 hover:bg-cream-50/10"
            )}
          >
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-cream-50">
                {count}
              </span>
            )}
          </button>
          <Link
            href="/menu"
            className="hidden rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-cream-50 shadow-sm transition-colors hover:bg-accent-600 sm:inline-block"
          >
            Order Now
          </Link>
          <button
            className={clsx(
              "rounded-full p-2.5 lg:hidden",
              scrolled || !isHome ? "text-chocolate-800" : "text-cream-50"
            )}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden bg-cream-50 shadow-lg lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-5 pb-6 pt-2">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-lg px-3 py-3 text-base font-medium text-chocolate-800 hover:bg-chocolate-900/5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2">
                <Link
                  href="/menu"
                  className="block rounded-full bg-accent-500 px-5 py-3 text-center text-sm font-semibold text-cream-50"
                >
                  Order Now
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
