import { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-chocolate-900/5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-chocolate-700/60">
          {label}
        </p>
        <Icon size={18} className="text-caramel-500" />
      </div>
      <p className="mt-3 font-display text-3xl text-chocolate-900">{value}</p>
    </div>
  );
}
