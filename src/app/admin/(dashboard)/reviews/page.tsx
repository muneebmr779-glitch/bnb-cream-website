"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Check, Plus, Star, Trash2 } from "lucide-react";
import { StarRating } from "@/components/shared/StarRating";
import { Modal } from "@/components/shared/Modal";

type Review = {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ customerName: "", rating: 5, comment: "" });
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/reviews");
    const data = await res.json();
    setReviews(data.reviews ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleApprove(id: string, approved: boolean) {
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved }),
    });
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this review?")) return;
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    toast.success("Review deleted");
    load();
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Review added");
      setModalOpen(false);
      setForm({ customerName: "", rating: 5, comment: "" });
      load();
    } catch {
      toast.error("Could not add review");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-chocolate-900 sm:text-3xl">Reviews</h1>
          <p className="mt-1 text-sm text-chocolate-700/60">
            Approve customer reviews before they appear on the site.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 rounded-full bg-chocolate-900 px-4 py-2.5 text-sm font-medium text-cream-50 hover:bg-accent-600"
        >
          <Plus size={16} />
          Add Review
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-chocolate-900/5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-chocolate-900">{review.customerName}</p>
                <StarRating rating={review.rating} size={14} />
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    review.approved ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {review.approved ? "Approved" : "Pending"}
                </span>
              </div>
              <p className="mt-1 max-w-xl text-sm text-chocolate-700/80">{review.comment}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              {!review.approved && (
                <button
                  onClick={() => handleApprove(review.id, true)}
                  className="flex items-center gap-1.5 rounded-full bg-emerald-500 px-3.5 py-2 text-xs font-medium text-white hover:bg-emerald-600"
                >
                  <Check size={14} />
                  Approve
                </button>
              )}
              {review.approved && (
                <button
                  onClick={() => handleApprove(review.id, false)}
                  className="rounded-full border border-chocolate-900/15 px-3.5 py-2 text-xs font-medium text-chocolate-800 hover:border-chocolate-900/30"
                >
                  Unapprove
                </button>
              )}
              <button
                onClick={() => handleDelete(review.id)}
                className="rounded-full p-2 text-chocolate-700/40 hover:text-accent-600"
                aria-label="Delete review"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="py-6 text-center text-chocolate-700/50">No reviews yet.</p>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} labelledBy="add-review-title" maxWidthClass="max-w-md">
        <form onSubmit={handleCreate} className="p-6">
          <h2 id="add-review-title" className="font-display text-xl text-chocolate-900">
            Add Review
          </h2>
          <div className="mt-4 space-y-3">
            <input
              required
              placeholder="Customer name"
              value={form.customerName}
              onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
              className="input"
            />
            <div className="flex gap-1" role="radiogroup" aria-label="Rating">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={form.rating === n}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  onClick={() => setForm((f) => ({ ...f, rating: n }))}
                  className="p-0.5"
                >
                  <Star
                    size={22}
                    className={n <= form.rating ? "fill-caramel-500 text-caramel-500" : "fill-beige-300 text-beige-300"}
                  />
                </button>
              ))}
            </div>
            <textarea
              required
              rows={3}
              placeholder="Review text"
              value={form.comment}
              onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
              className="input resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-4 w-full rounded-full bg-chocolate-900 py-3 text-sm font-semibold text-cream-50 hover:bg-accent-600 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Add Review"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
