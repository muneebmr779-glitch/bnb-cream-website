"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { format } from "date-fns";
import { formatPrice, statusColor, statusLabel } from "@/lib/format";
import { OrderDetailModal } from "@/components/admin/OrderDetailModal";
import type { AdminOrderDTO } from "@/types";

const STATUS_FILTERS = [
  "",
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "COMPLETED",
  "CANCELLED",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrderDTO[]>([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AdminOrderDTO | null>(null);

  async function load() {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (search) params.set("search", search);
    const res = await fetch(`/api/admin/orders?${params.toString()}`);
    const data = await res.json();
    setOrders(data.orders ?? []);
  }

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, search]);

  return (
    <div>
      <h1 className="font-display text-2xl text-chocolate-900 sm:text-3xl">Orders</h1>
      <p className="mt-1 text-sm text-chocolate-700/60">View and manage customer orders.</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-chocolate-700/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, name, phone…"
            className="input pl-10"
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="input sm:max-w-[220px]">
          {STATUS_FILTERS.map((s) => (
            <option key={s} value={s}>
              {s ? statusLabel(s) : "All Statuses"}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-chocolate-900/5">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-chocolate-900/10 text-xs uppercase tracking-wide text-chocolate-700/60">
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                onClick={() => setSelected(order)}
                className="cursor-pointer border-b border-chocolate-900/5 last:border-0 hover:bg-cream-100/50"
              >
                <td className="px-5 py-3 font-medium text-chocolate-900">{order.orderNumber}</td>
                <td className="px-5 py-3 text-chocolate-800">{order.customerName}</td>
                <td className="px-5 py-3 text-chocolate-700/70">
                  {order.deliveryType === "DELIVERY" ? "Delivery" : "Pickup"}
                </td>
                <td className="px-5 py-3">
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusColor(order.status)}`}>
                    {statusLabel(order.status)}
                  </span>
                </td>
                <td className="px-5 py-3 text-chocolate-800">{formatPrice(order.total)}</td>
                <td className="px-5 py-3 text-chocolate-700/70">
                  {format(new Date(order.createdAt), "MMM d, yyyy")}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-6 text-center text-chocolate-700/50">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <OrderDetailModal
        order={selected}
        onClose={() => setSelected(null)}
        onUpdated={() => {
          load();
          setSelected(null);
        }}
      />
    </div>
  );
}
