"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, Package, ShoppingCart, Star, Wallet } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { formatPrice, statusColor, statusLabel } from "@/lib/format";
import { format } from "date-fns";

type DashboardData = {
  stats: {
    totalOrders: number;
    pendingOrders: number;
    totalProducts: number;
    unreadMessages: number;
    pendingReviews: number;
    totalRevenue: number;
  };
  recentOrders: {
    id: string;
    orderNumber: string;
    customerName: string;
    status: string;
    total: string;
    createdAt: string;
  }[];
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl text-chocolate-900 sm:text-3xl">Dashboard</h1>
      <p className="mt-1 text-sm text-chocolate-700/60">
        A quick overview of what is happening at Cakoo.
      </p>

      {data && (
        <>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
            <StatCard label="Total Orders" value={data.stats.totalOrders} icon={ShoppingCart} />
            <StatCard label="Pending Orders" value={data.stats.pendingOrders} icon={Package} />
            <StatCard label="Revenue" value={formatPrice(data.stats.totalRevenue)} icon={Wallet} />
            <StatCard label="Unread Messages" value={data.stats.unreadMessages} icon={Mail} />
            <StatCard label="Reviews to Approve" value={data.stats.pendingReviews} icon={Star} />
          </div>

          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-chocolate-900/5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg text-chocolate-900">Recent Orders</h2>
              <Link href="/admin/orders" className="text-sm font-medium text-accent-600 hover:underline">
                View all
              </Link>
            </div>
            <div className="mt-4 overflow-x-auto thin-scrollbar">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-chocolate-900/10 text-xs uppercase tracking-wide text-chocolate-700/60">
                    <th className="py-2 pr-4">Order</th>
                    <th className="py-2 pr-4">Customer</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Total</th>
                    <th className="py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-chocolate-900/5 last:border-0">
                      <td className="py-3 pr-4 font-medium text-chocolate-900">{order.orderNumber}</td>
                      <td className="py-3 pr-4 text-chocolate-800">{order.customerName}</td>
                      <td className="py-3 pr-4">
                        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusColor(order.status)}`}>
                          {statusLabel(order.status)}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-chocolate-800">{formatPrice(order.total)}</td>
                      <td className="py-3 text-chocolate-700/70">
                        {format(new Date(order.createdAt), "MMM d, yyyy")}
                      </td>
                    </tr>
                  ))}
                  {data.recentOrders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-chocolate-700/50">
                        No orders yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
