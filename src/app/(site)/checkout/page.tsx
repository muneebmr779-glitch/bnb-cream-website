import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Review your order and complete checkout at Cakoo.",
};

export default function CheckoutPage() {
  return (
    <div className="pt-28 pb-20 sm:pt-32">
      <Container className="max-w-6xl">
        <h1 className="font-display text-3xl text-chocolate-900 sm:text-4xl">Checkout</h1>
        <p className="mt-2 text-chocolate-700/70">
          Almost there — just a few details and your order is on its way.
        </p>
        <div className="mt-10">
          <CheckoutForm />
        </div>
      </Container>
    </div>
  );
}
