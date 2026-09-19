"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Star,
  Images,
  Tag,
  Mail,
  Cake,
  Settings,
  LogOut,
  Tags,
} from "lucide-react";
import clsx from "clsx";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/custom-cakes", label: "Custom Cake Requests", icon: Cake },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/offers", label: "Offers", icon: Tag },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

export function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-chocolate-900/10 bg-white">
      <div className="border-b border-chocolate-900/10 p-5">
        <p className="font-display text-xl text-chocolate-900">CAKOO</p>
        <p className="text-xs text-chocolate-700/60">Admin Dashboard</p>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3 thin-scrollbar">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-chocolate-900 text-cream-50"
                  : "text-chocolate-700 hover:bg-chocolate-900/5"
              )}
            >
              <item.icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-chocolate-900/10 p-4">
        <p className="truncate text-xs text-chocolate-700/60">{adminName}</p>
        <button
          onClick={handleLogout}
          className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-accent-600 hover:bg-accent-500/10"
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>
    </aside>
  );
}
