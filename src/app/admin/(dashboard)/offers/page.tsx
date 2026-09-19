"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import { Modal } from "@/components/shared/Modal";
import { ImageUploader } from "@/components/admin/ImageUploader";

type Offer = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  active: boolean;
};

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", imageUrl: null as string | null });
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/offers");
    const data = await res.json();
    setOffers(data.offers ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, active: true }),
      });
      if (!res.ok) throw new Error();
      toast.success("Offer created");
      setModalOpen(false);
      setForm({ title: "", description: "", imageUrl: null });
      load();
    } catch {
      toast.error("Could not create offer");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(offer: Offer) {
    await fetch(`/api/admin/offers/${offer.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !offer.active }),
    });
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this offer?")) return;
    await fetch(`/api/admin/offers/${id}`, { method: "DELETE" });
    toast.success("Offer deleted");
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-chocolate-900 sm:text-3xl">Offers</h1>
          <p className="mt-1 text-sm text-chocolate-700/60">
            Promote seasonal specials on the homepage.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 rounded-full bg-chocolate-900 px-4 py-2.5 text-sm font-medium text-cream-50 hover:bg-accent-600"
        >
          <Plus size={16} />
          New Offer
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-chocolate-900/5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium text-chocolate-900">{offer.title}</p>
              <p className="mt-1 max-w-lg text-sm text-chocolate-700/80">{offer.description}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <button
                onClick={() => toggleActive(offer)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  offer.active ? "bg-emerald-100 text-emerald-800" : "bg-chocolate-900/10 text-chocolate-700"
                }`}
              >
                {offer.active ? "Active" : "Inactive"}
              </button>
              <button
                onClick={() => handleDelete(offer.id)}
                className="text-chocolate-700/40 hover:text-accent-600"
                aria-label="Delete offer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {offers.length === 0 && (
          <p className="py-6 text-center text-chocolate-700/50">No offers yet.</p>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} labelledBy="offer-form-title" maxWidthClass="max-w-md">
        <form onSubmit={handleCreate} className="p-6">
          <h2 id="offer-form-title" className="font-display text-xl text-chocolate-900">
            New Offer
          </h2>
          <div className="mt-4 space-y-3">
            <ImageUploader
              value={form.imageUrl}
              onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
              label="Banner Image (optional)"
            />
            <input
              required
              placeholder="Offer title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="input"
            />
            <textarea
              required
              rows={3}
              placeholder="Offer description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="input resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-4 w-full rounded-full bg-chocolate-900 py-3 text-sm font-semibold text-cream-50 hover:bg-accent-600 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Create Offer"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
