"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { Modal } from "@/components/shared/Modal";
import { formatPrice, statusColor, statusLabel } from "@/lib/format";
import type { AdminOrderDTO } from "@/types";

const STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "COMPLETED",
  "CANCELLED",
];

type Order = AdminOrderDTO;

export function OrderDetailModal({
  order,
  onClose,
  onUpdated,
}: {
  order: Order | null;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [updating, setUpdating] = useState(false);

  if (!order) return null;

  async function handleStatusChange(status: string) {
    if (!order) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      toast.success("Order status updated");
      onUpdated();
    } catch {
      toast.error("Could not update status");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <Modal open={!!order} onClose={onClose} labelledBy="order-detail-title" maxWidthClass="max-w-lg">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h2 id="order-detail-title" className="font-display text-2xl text-chocolate-900">
            {order.orderNumber}
          </h2>
          <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusColor(order.status)}`}>
            {statusLabel(order.status)}
          </span>
        </div>
        <p className="mt-1 text-xs text-chocolate-700/60">
          Placed {format(new Date(order.createdAt), "MMM d, yyyy 'at' h:mm a")}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs uppercase tracking-wide text-chocolate-700/60">Customer</p>
            <p className="text-chocolate-900">{order.customerName}</p>
            <p className="text-chocolate-700/70">{order.customerPhone}</p>
            {order.customerEmail && <p className="text-chocolate-700/70">{order.customerEmail}</p>}
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-chocolate-700/60">
              {order.deliveryType === "DELIVERY" ? "Delivery" : "Pickup"}
            </p>
            <p className="text-chocolate-900">
              {order.deliveryType === "DELIVERY" ? `${order.address}, ${order.city}` : "Cakoo Bakery"}
            </p>
            <p className="text-chocolate-700/70">
              {format(new Date(order.scheduledDate), "MMM d, yyyy")} · {order.scheduledTime}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-xs uppercase tracking-wide text-chocolate-700/60">Items</p>
          <ul className="mt-2 space-y-2">
            {order.items.map((item) => (
              <li key={item.id} className="rounded-lg bg-cream-100/60 p-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-chocolate-900">
                    {item.quantity}× {item.productName}
                    {item.variant ? ` (${item.variant})` : ""}
                  </span>
                  <span className="font-medium text-chocolate-900">
                    {formatPrice(item.totalPrice)}
                  </span>
                </div>
                {item.specialInstructions && (
                  <p className="mt-1 text-xs italic text-chocolate-700/70">
                    “{item.specialInstructions}”
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>

        {order.notes && (
          <div className="mt-4">
            <p className="text-xs uppercase tracking-wide text-chocolate-700/60">Order Notes</p>
            <p className="mt-1 text-sm text-chocolate-800">{order.notes}</p>
          </div>
        )}

        <div className="mt-4 space-y-1 border-t border-chocolate-900/10 pt-4 text-sm">
          <div className="flex justify-between text-chocolate-700/80">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-chocolate-700/80">
            <span>Delivery Fee</span>
            <span>{Number(order.deliveryFee) > 0 ? formatPrice(order.deliveryFee) : "Free"}</span>
          </div>
          <div className="flex justify-between font-display text-base text-chocolate-900">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="order-status" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-chocolate-700">
            Update Status
          </label>
          <select
            id="order-status"
            value={order.status}
            disabled={updating}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="input"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Modal>
  );
}
