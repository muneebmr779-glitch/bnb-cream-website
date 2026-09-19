"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore, cartSubtotal } from "@/store/cart";
import { formatPrice } from "@/lib/format";

const TIME_SLOTS = [
  "11:00 AM – 1:00 PM",
  "1:00 PM – 3:00 PM",
  "3:00 PM – 5:00 PM",
  "5:00 PM – 7:00 PM",
  "7:00 PM – 9:00 PM",
  "9:00 PM – 11:00 PM",
];

const DELIVERY_FEE = 250;

function todayISO() {
  const d = new Date();
  d.setDate(d.getDate() + 0);
  return d.toISOString().split("T")[0];
}

export function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    deliveryType: "PICKUP" as "PICKUP" | "DELIVERY",
    address: "",
    city: "",
    scheduledDate: todayISO(),
    scheduledTime: TIME_SLOTS[0],
    paymentMethod: "CASH" as "CASH" | "CARD_ON_DELIVERY" | "ONLINE",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const subtotal = cartSubtotal(items);
  const deliveryFee = form.deliveryType === "DELIVERY" ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  const canSubmit = useMemo(() => {
    if (items.length === 0) return false;
    if (!form.customerName.trim() || !form.customerPhone.trim()) return false;
    if (form.deliveryType === "DELIVERY" && (!form.address.trim() || !form.city.trim())) {
      return false;
    }
    return true;
  }, [items, form]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          customerEmail: form.customerEmail || null,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            variant: item.variant,
            specialInstructions: item.specialInstructions || null,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Could not place order");
      }
      clear();
      router.push(`/order-confirmation/${data.order.orderNumber}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <ShoppingBag size={40} className="text-chocolate-900/20" />
        <p className="text-chocolate-700/70">Your cart is empty.</p>
        <a
          href="/menu"
          className="rounded-full bg-chocolate-900 px-6 py-3 text-sm font-medium text-cream-50 hover:bg-accent-600"
        >
          Browse the Menu
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-10 lg:grid-cols-5">
      <div className="space-y-8 lg:col-span-3">
        <section>
          <h2 className="font-display text-xl text-chocolate-900">Customer Information</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full Name" required>
              <input
                required
                value={form.customerName}
                onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
                className="input"
              />
            </Field>
            <Field label="Phone Number" required>
              <input
                required
                type="tel"
                value={form.customerPhone}
                onChange={(e) => setForm((f) => ({ ...f, customerPhone: e.target.value }))}
                className="input"
              />
            </Field>
            <Field label="Email (optional)" className="sm:col-span-2">
              <input
                type="email"
                value={form.customerEmail}
                onChange={(e) => setForm((f) => ({ ...f, customerEmail: e.target.value }))}
                className="input"
              />
            </Field>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl text-chocolate-900">Pickup or Delivery</h2>
          <div className="mt-4 flex gap-3">
            {(["PICKUP", "DELIVERY"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setForm((f) => ({ ...f, deliveryType: type }))}
                className={`flex-1 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-colors ${
                  form.deliveryType === type
                    ? "border-chocolate-900 bg-chocolate-900 text-cream-50"
                    : "border-chocolate-900/15 text-chocolate-800"
                }`}
              >
                {type === "PICKUP" ? "Pickup at Bakery" : "Home Delivery"}
              </button>
            ))}
          </div>
          {form.deliveryType === "DELIVERY" && (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Delivery Address" required className="sm:col-span-2">
                <input
                  required
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  className="input"
                />
              </Field>
              <Field label="City" required>
                <input
                  required
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  className="input"
                />
              </Field>
            </div>
          )}
        </section>

        <section>
          <h2 className="font-display text-xl text-chocolate-900">Date &amp; Time</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Date" required>
              <input
                required
                type="date"
                min={todayISO()}
                value={form.scheduledDate}
                onChange={(e) => setForm((f) => ({ ...f, scheduledDate: e.target.value }))}
                className="input"
              />
            </Field>
            <Field label="Time Slot" required>
              <select
                value={form.scheduledTime}
                onChange={(e) => setForm((f) => ({ ...f, scheduledTime: e.target.value }))}
                className="input"
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl text-chocolate-900">Payment Method</h2>
          <div className="mt-4 space-y-2">
            <PaymentOption
              label="Cash on Pickup / Delivery"
              value="CASH"
              checked={form.paymentMethod === "CASH"}
              onChange={() => setForm((f) => ({ ...f, paymentMethod: "CASH" }))}
            />
            <PaymentOption
              label="Card on Delivery"
              value="CARD_ON_DELIVERY"
              checked={form.paymentMethod === "CARD_ON_DELIVERY"}
              onChange={() => setForm((f) => ({ ...f, paymentMethod: "CARD_ON_DELIVERY" }))}
            />
            <PaymentOption
              label="Pay Online"
              value="ONLINE"
              checked={form.paymentMethod === "ONLINE"}
              onChange={() => setForm((f) => ({ ...f, paymentMethod: "ONLINE" }))}
              disabled
              badge="Coming soon"
            />
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl text-chocolate-900">Order Notes</h2>
          <textarea
            rows={3}
            maxLength={1000}
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            placeholder="Anything else we should know?"
            className="input mt-4 resize-none"
          />
        </section>
      </div>

      <div className="lg:col-span-2">
        <div className="sticky top-28 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-chocolate-900/5">
          <h2 className="font-display text-xl text-chocolate-900">Order Summary</h2>
          <ul className="mt-4 max-h-72 space-y-4 overflow-y-auto thin-scrollbar">
            {items.map((item) => (
              <li key={item.key} className="flex gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-chocolate-800">
                  {item.image && (
                    <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-chocolate-900">{item.name}</p>
                      {item.variant && <p className="text-xs text-chocolate-700/60">{item.variant}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      className="text-chocolate-700/40 hover:text-accent-600"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-chocolate-900/15">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.key, item.quantity - 1)}
                        className="p-1 text-chocolate-800"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-5 text-center text-xs">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                        className="p-1 text-chocolate-800"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
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

          <div className="mt-5 space-y-2 border-t border-chocolate-900/10 pt-4 text-sm">
            <div className="flex justify-between text-chocolate-700/80">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-chocolate-700/80">
              <span>Delivery Fee</span>
              <span>{deliveryFee > 0 ? formatPrice(deliveryFee) : "Free"}</span>
            </div>
            <div className="flex justify-between border-t border-chocolate-900/10 pt-2 font-display text-lg text-chocolate-900">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className="mt-6 w-full rounded-full bg-accent-500 py-3.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Placing Order…" : "Place Order"}
          </button>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block text-sm ${className ?? ""}`}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-chocolate-700">
        {label} {required && <span className="text-accent-600">*</span>}
      </span>
      {children}
    </label>
  );
}

function PaymentOption({
  label,
  value,
  checked,
  onChange,
  disabled,
  badge,
}: {
  label: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  badge?: string;
}) {
  return (
    <label
      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition-colors ${
        disabled
          ? "cursor-not-allowed border-chocolate-900/10 text-chocolate-700/40"
          : checked
          ? "cursor-pointer border-chocolate-900 bg-chocolate-900/5"
          : "cursor-pointer border-chocolate-900/15 hover:border-chocolate-900/30"
      }`}
    >
      <span className="flex items-center gap-3">
        <input
          type="radio"
          name="paymentMethod"
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="accent-accent-500"
        />
        {label}
      </span>
      {badge && (
        <span className="rounded-full bg-beige-300/60 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-chocolate-700">
          {badge}
        </span>
      )}
    </label>
  );
}
