import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for ordering from Cakoo.",
};

export default function TermsPage() {
  return (
    <div className="pt-28 pb-20">
      <Container className="max-w-3xl">
        <h1 className="font-display text-4xl text-chocolate-900">Terms &amp; Conditions</h1>
        <p className="mt-3 text-sm text-chocolate-700/60">Last updated: 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-chocolate-800/90">
          <section>
            <h2 className="font-display text-xl text-chocolate-900">Orders</h2>
            <p className="mt-2">
              All orders are subject to availability. We will confirm your order by phone if any
              details need clarification. Prices shown at checkout are final at the time of order.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl text-chocolate-900">Custom Cakes</h2>
            <p className="mt-2">
              Custom cake requests are quoted individually based on design, size, and timeline.
              Please submit requests with as much notice as possible to guarantee availability.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl text-chocolate-900">Payment</h2>
            <p className="mt-2">
              We accept cash on pickup or delivery. Additional payment methods, where offered, will
              be clearly indicated at checkout.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl text-chocolate-900">Cancellations</h2>
            <p className="mt-2">
              Please contact us as early as possible if you need to cancel or reschedule an order.
              Custom and large celebration cake orders may require advance notice for cancellation.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
