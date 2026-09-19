"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { statusColor, statusLabel } from "@/lib/format";

const STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "COMPLETED",
  "CANCELLED",
];

type CustomCakeRequest = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  occasion: string;
  servings: string | null;
  budget: string | null;
  dateNeeded: string;
  details: string;
  status: string;
  createdAt: string;
};

export default function AdminCustomCakesPage() {
  const [requests, setRequests] = useState<CustomCakeRequest[]>([]);

  async function load() {
    const res = await fetch("/api/admin/custom-cake-requests");
    const data = await res.json();
    setRequests(data.requests ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/custom-cake-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-chocolate-900 sm:text-3xl">Custom Cake Requests</h1>
      <p className="mt-1 text-sm text-chocolate-700/60">
        Inquiries submitted through the custom cake request form.
      </p>

      <div className="mt-6 space-y-3">
        {requests.map((req) => (
          <div key={req.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-chocolate-900/5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <p className="font-medium text-chocolate-900">
                  {req.name} · {req.occasion}
                </p>
                <p className="text-xs text-chocolate-700/60">
                  {req.phone} {req.email && `· ${req.email}`}
                </p>
                <p className="mt-1 text-xs text-chocolate-700/60">
                  Needed by {format(new Date(req.dateNeeded), "MMM d, yyyy")}
                  {req.servings && ` · ${req.servings}`}
                  {req.budget && ` · Budget: ${req.budget}`}
                </p>
              </div>
              <select
                value={req.status}
                onChange={(e) => updateStatus(req.id, e.target.value)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium ${statusColor(req.status)}`}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {statusLabel(s)}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-3 text-sm text-chocolate-800">{req.details}</p>
          </div>
        ))}
        {requests.length === 0 && (
          <p className="py-6 text-center text-chocolate-700/50">No custom cake requests yet.</p>
        )}
      </div>
    </div>
  );
}
