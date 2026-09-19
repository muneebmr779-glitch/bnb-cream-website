"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";

export function AdminShell({
  adminName,
  children,
}: {
  adminName: string;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-cream-100/40">
      <div className="hidden lg:block">
        <AdminSidebar adminName={adminName} />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="absolute inset-0 bg-chocolate-900/50" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10">
            <AdminSidebar adminName={adminName} />
          </div>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-chocolate-900/10 bg-white px-5 py-4 lg:hidden">
          <p className="font-display text-lg text-chocolate-900">CAKOO Admin</p>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="rounded-lg p-2 text-chocolate-800 hover:bg-chocolate-900/5"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>
        <main className="flex-1 p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
