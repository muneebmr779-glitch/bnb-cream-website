"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import { SiteSettingsDTO, SiteHours } from "@/types";
import { DEFAULT_SETTINGS } from "@/lib/constants";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettingsDTO>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
        setLoading(false);
      });
  }, []);

  function updateHour(index: number, patch: Partial<SiteHours>) {
    setSettings((s) => ({
      ...s,
      hours: s.hours.map((h, i) => (i === index ? { ...h, ...patch } : h)),
    }));
  }

  function addHour() {
    setSettings((s) => ({ ...s, hours: [...s.hours, { day: "", hours: "" }] }));
  }

  function removeHour(index: number) {
    setSettings((s) => ({ ...s, hours: s.hours.filter((_, i) => i !== index) }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not save settings");
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save settings");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-chocolate-700/60">Loading settings…</p>;
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl text-chocolate-900 sm:text-3xl">Site Settings</h1>
      <p className="mt-1 text-sm text-chocolate-700/60">
        Update the content shown across your public website.
      </p>

      <form onSubmit={handleSave} className="mt-8 space-y-8">
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-chocolate-900/5">
          <h2 className="font-display text-lg text-chocolate-900">Hero Section</h2>
          <div className="mt-4 space-y-3">
            <Field label="Headline">
              <input
                value={settings.heroHeadline}
                onChange={(e) => setSettings((s) => ({ ...s, heroHeadline: e.target.value }))}
                className="input"
              />
            </Field>
            <Field label="Subtext">
              <textarea
                rows={2}
                value={settings.heroSubtext}
                onChange={(e) => setSettings((s) => ({ ...s, heroSubtext: e.target.value }))}
                className="input resize-none"
              />
            </Field>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-chocolate-900/5">
          <h2 className="font-display text-lg text-chocolate-900">About Section</h2>
          <div className="mt-4 space-y-3">
            <Field label="Heading">
              <input
                value={settings.aboutHeading}
                onChange={(e) => setSettings((s) => ({ ...s, aboutHeading: e.target.value }))}
                className="input"
              />
            </Field>
            <Field label="Story">
              <textarea
                rows={5}
                value={settings.aboutText}
                onChange={(e) => setSettings((s) => ({ ...s, aboutText: e.target.value }))}
                className="input resize-none"
              />
            </Field>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-chocolate-900/5">
          <h2 className="font-display text-lg text-chocolate-900">Contact Information</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Address" className="sm:col-span-2">
              <input
                value={settings.address}
                onChange={(e) => setSettings((s) => ({ ...s, address: e.target.value }))}
                className="input"
              />
            </Field>
            <Field label="Phone">
              <input
                value={settings.phone}
                onChange={(e) => setSettings((s) => ({ ...s, phone: e.target.value }))}
                className="input"
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings((s) => ({ ...s, email: e.target.value }))}
                className="input"
              />
            </Field>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-chocolate-700">
                Opening Hours
              </span>
              <button
                type="button"
                onClick={addHour}
                className="flex items-center gap-1 text-xs font-medium text-accent-600 hover:underline"
              >
                <Plus size={14} /> Add Row
              </button>
            </div>
            <div className="mt-2 space-y-2">
              {settings.hours.map((h, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    placeholder="Day(s)"
                    value={h.day}
                    onChange={(e) => updateHour(i, { day: e.target.value })}
                    className="input"
                  />
                  <input
                    placeholder="Hours"
                    value={h.hours}
                    onChange={(e) => updateHour(i, { hours: e.target.value })}
                    className="input"
                  />
                  <button
                    type="button"
                    onClick={() => removeHour(i)}
                    className="shrink-0 text-chocolate-700/40 hover:text-accent-600"
                    aria-label="Remove row"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-chocolate-900/5">
          <h2 className="font-display text-lg text-chocolate-900">Social Links</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Facebook URL">
              <input
                value={settings.socialLinks.facebook}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    socialLinks: { ...s.socialLinks, facebook: e.target.value },
                  }))
                }
                className="input"
              />
            </Field>
            <Field label="Instagram URL">
              <input
                value={settings.socialLinks.instagram}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    socialLinks: { ...s.socialLinks, instagram: e.target.value },
                  }))
                }
                className="input"
              />
            </Field>
            <Field label="TikTok URL">
              <input
                value={settings.socialLinks.tiktok}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    socialLinks: { ...s.socialLinks, tiktok: e.target.value },
                  }))
                }
                className="input"
              />
            </Field>
            <Field label="Instagram Handle (display text)">
              <input
                value={settings.instagramHandle}
                onChange={(e) => setSettings((s) => ({ ...s, instagramHandle: e.target.value }))}
                className="input"
              />
            </Field>
          </div>
        </section>

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-chocolate-900 px-8 py-3.5 text-sm font-semibold text-cream-50 hover:bg-accent-600 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block text-sm ${className ?? ""}`}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-chocolate-700">
        {label}
      </span>
      {children}
    </label>
  );
}
