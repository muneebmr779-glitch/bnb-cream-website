import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Cakoo collects, uses, and protects your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-28 pb-20">
      <Container className="max-w-3xl">
        <h1 className="font-display text-4xl text-chocolate-900">Privacy Policy</h1>
        <p className="mt-3 text-sm text-chocolate-700/60">Last updated: 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-chocolate-800/90">
          <p>
            Cakoo (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) respects your privacy. This
            policy explains what information we collect when you use our website and place
            orders, and how we use it.
          </p>
          <section>
            <h2 className="font-display text-xl text-chocolate-900">Information We Collect</h2>
            <p className="mt-2">
              When you place an order, request a custom cake, submit a review, or contact us, we
              collect the information you provide: your name, phone number, email address,
              delivery address, and order details.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl text-chocolate-900">How We Use It</h2>
            <p className="mt-2">
              We use this information to process and fulfil your orders, respond to inquiries,
              and — only if you subscribe — send occasional updates about new products and offers.
              We never sell your personal information to third parties.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl text-chocolate-900">Data Storage</h2>
            <p className="mt-2">
              Order and contact information is stored securely and is only accessible to
              authorized Cakoo staff for the purpose of managing your order.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl text-chocolate-900">Contact Us</h2>
            <p className="mt-2">
              If you have any questions about this policy or would like your information removed,
              please reach out via our contact page.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
