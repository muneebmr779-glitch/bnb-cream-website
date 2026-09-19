"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { StarRating } from "@/components/shared/StarRating";
import { Reveal } from "@/components/shared/Reveal";
import { ReviewForm } from "./ReviewForm";

type ReviewItem = {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  imageUrl: string | null;
};

export function Testimonials({ reviews }: { reviews: ReviewItem[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [formOpen, setFormOpen] = useState(false);

  function scrollByCard(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-review-card]");
    const amount = (card?.offsetWidth ?? 320) + 24;
    el.scrollBy({ left: amount * direction, behavior: "smooth" });
  }

  return (
    <section id="reviews" className="bg-cream-100/60 py-20 sm:py-28">
      <Container>
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            align="left"
            eyebrow="Testimonials"
            title="Loved By Our Customers"
          />
          <Reveal delay={0.1}>
            <button
              onClick={() => setFormOpen(true)}
              className="whitespace-nowrap rounded-full border border-chocolate-900/20 px-5 py-2.5 text-sm font-semibold text-chocolate-900 transition-colors hover:border-chocolate-900 hover:bg-chocolate-900 hover:text-cream-50"
            >
              Write a Review
            </button>
          </Reveal>
        </div>

        {reviews.length === 0 ? (
          <p className="mt-12 text-center text-chocolate-700/60">
            Be the first to share your Cakoo experience.
          </p>
        ) : (
          <div className="relative mt-12">
            <div
              ref={scrollerRef}
              className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 thin-scrollbar"
            >
              {reviews.map((review) => (
                <div
                  key={review.id}
                  data-review-card
                  className="flex w-[85%] shrink-0 snap-start flex-col rounded-2xl bg-white p-7 shadow-sm ring-1 ring-chocolate-900/5 sm:w-[46%] lg:w-[31%]"
                >
                  <Quote size={28} className="text-caramel-400/50" />
                  <StarRating rating={review.rating} className="mt-3" />
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-chocolate-700/85">
                    “{review.comment}”
                  </p>
                  <p className="mt-5 font-display text-base text-chocolate-900">
                    {review.customerName}
                  </p>
                </div>
              ))}
            </div>

            {reviews.length > 1 && (
              <div className="mt-6 flex justify-center gap-3">
                <button
                  onClick={() => scrollByCard(-1)}
                  aria-label="Previous reviews"
                  className="rounded-full border border-chocolate-900/15 p-2.5 text-chocolate-800 transition-colors hover:border-chocolate-900/40"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => scrollByCard(1)}
                  aria-label="Next reviews"
                  className="rounded-full border border-chocolate-900/15 p-2.5 text-chocolate-800 transition-colors hover:border-chocolate-900/40"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </Container>
      <ReviewForm open={formOpen} onClose={() => setFormOpen(false)} />
    </section>
  );
}
