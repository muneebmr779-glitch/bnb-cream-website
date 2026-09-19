"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Star } from "lucide-react";
import { Modal } from "@/components/shared/Modal";

export function ReviewForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName: name, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Thanks! Your review will appear once approved.");
      setName("");
      setRating(5);
      setComment("");
      onClose();
    } catch {
      toast.error("Couldn't submit your review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} labelledBy="review-form-title" maxWidthClass="max-w-md">
      <form onSubmit={handleSubmit} className="p-6">
        <h3 id="review-form-title" className="font-display text-2xl text-chocolate-900">
          Share Your Experience
        </h3>
        <p className="mt-1 text-sm text-chocolate-700/70">
          We would love to hear about your Cakoo order.
        </p>

        <div className="mt-5">
          <label htmlFor="review-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-chocolate-700">
            Your Name
          </label>
          <input
            id="review-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-chocolate-900/15 bg-white p-2.5 text-sm outline-none focus:border-caramel-500 focus:ring-1 focus:ring-caramel-500"
          />
        </div>

        <div className="mt-4">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-chocolate-700">
            Rating
          </span>
          <div className="flex gap-1" role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                onClick={() => setRating(n)}
                className="p-1"
              >
                <Star
                  size={26}
                  className={n <= rating ? "fill-caramel-500 text-caramel-500" : "fill-beige-300 text-beige-300"}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="review-comment" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-chocolate-700">
            Your Review
          </label>
          <textarea
            id="review-comment"
            required
            rows={4}
            maxLength={1000}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full resize-none rounded-lg border border-chocolate-900/15 bg-white p-2.5 text-sm outline-none focus:border-caramel-500 focus:ring-1 focus:ring-caramel-500"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-5 w-full rounded-full bg-chocolate-900 py-3 text-sm font-semibold text-cream-50 transition-colors hover:bg-accent-600 disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Submit Review"}
        </button>
      </form>
    </Modal>
  );
}
