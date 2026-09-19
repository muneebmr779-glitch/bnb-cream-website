"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle2 } from "lucide-react";

const OCCASIONS = [
  "Birthday",
  "Wedding",
  "Anniversary",
  "Baby Shower",
  "Graduation",
  "Corporate Event",
  "Other",
];

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export function CustomCakeForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    occasion: OCCASIONS[0],
    servings: "",
    budget: "",
    dateNeeded: todayISO(),
    details: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/custom-cake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, email: form.email || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSubmitted(true);
    } catch {
      toast.error("Couldn't submit your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-chocolate-900/5">
        <CheckCircle2 size={44} className="text-emerald-500" />
        <h2 className="mt-4 font-display text-2xl text-chocolate-900">Request Received!</h2>
        <p className="mt-2 max-w-md text-chocolate-700/70">
          Thank you for sharing your vision. Our team will reach out shortly to discuss design,
          pricing, and timeline for your custom cake.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-5 rounded-2xl bg-white p-7 shadow-sm ring-1 ring-chocolate-900/5 sm:grid-cols-2 sm:p-9"
    >
      <Field label="Full Name" required>
        <input
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="input"
        />
      </Field>
      <Field label="Phone Number" required>
        <input
          required
          type="tel"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          className="input"
        />
      </Field>
      <Field label="Email (optional)">
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="input"
        />
      </Field>
      <Field label="Occasion" required>
        <select
          value={form.occasion}
          onChange={(e) => setForm((f) => ({ ...f, occasion: e.target.value }))}
          className="input"
        >
          {OCCASIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Approx. Servings">
        <input
          value={form.servings}
          onChange={(e) => setForm((f) => ({ ...f, servings: e.target.value }))}
          placeholder="e.g. 20-25 people"
          className="input"
        />
      </Field>
      <Field label="Budget (optional)">
        <input
          value={form.budget}
          onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
          placeholder="e.g. Rs 5,000 - 8,000"
          className="input"
        />
      </Field>
      <Field label="Date Needed" required>
        <input
          required
          type="date"
          min={todayISO()}
          value={form.dateNeeded}
          onChange={(e) => setForm((f) => ({ ...f, dateNeeded: e.target.value }))}
          className="input"
        />
      </Field>
      <Field label="Design Details" required className="sm:col-span-2">
        <textarea
          required
          rows={4}
          maxLength={2000}
          value={form.details}
          onChange={(e) => setForm((f) => ({ ...f, details: e.target.value }))}
          placeholder="Tell us about flavors, theme, colors, tiers, or anything you have in mind"
          className="input resize-none"
        />
      </Field>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-accent-500 py-3.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-accent-600 disabled:opacity-60 sm:col-span-2"
      >
        {submitting ? "Sending Request…" : "Submit Custom Cake Request"}
      </button>
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
