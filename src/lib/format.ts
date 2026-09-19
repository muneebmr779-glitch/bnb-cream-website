export function formatPrice(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return `Rs ${num.toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  READY: "Ready",
  OUT_FOR_DELIVERY: "Out for Delivery",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export function statusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800 border-amber-200",
  CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200",
  PREPARING: "bg-purple-100 text-purple-800 border-purple-200",
  READY: "bg-teal-100 text-teal-800 border-teal-200",
  OUT_FOR_DELIVERY: "bg-indigo-100 text-indigo-800 border-indigo-200",
  COMPLETED: "bg-emerald-100 text-emerald-800 border-emerald-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
};

export function statusColor(status: string): string {
  return STATUS_COLORS[status] ?? "bg-neutral-100 text-neutral-800 border-neutral-200";
}
