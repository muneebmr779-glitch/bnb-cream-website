import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { prisma } from "@/lib/prisma";
import { formatPrice, statusLabel } from "@/lib/format";
import { format } from "date-fns";

export const metadata = {
  title: "Order Confirmed",
};

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="pt-28 pb-20 sm:pt-32">
      <Container className="max-w-2xl">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-chocolate-900/5 sm:p-12">
          <CheckCircle2 size={52} className="mx-auto text-emerald-500" />
          <h1 className="mt-5 font-display text-3xl text-chocolate-900 sm:text-4xl">
            Order Confirmed!
          </h1>
          <p className="mt-2 text-chocolate-700/70">
            Thank you, {order.customerName}. We have received your order and will reach out if
            anything needs confirming.
          </p>

          <div className="mt-8 rounded-2xl bg-cream-100/60 p-6 text-left">
            <div className="flex items-center justify-between border-b border-chocolate-900/10 pb-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-chocolate-700/60">Order Number</p>
                <p className="font-display text-lg text-chocolate-900">{order.orderNumber}</p>
              </div>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                {statusLabel(order.status)}
              </span>
            </div>

            <ul className="mt-4 space-y-3">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between text-sm">
                  <span className="text-chocolate-800">
                    {item.quantity}× {item.productName}
                    {item.variant ? ` (${item.variant})` : ""}
                  </span>
                  <span className="font-medium text-chocolate-900">
                    {formatPrice(Number(item.totalPrice))}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 space-y-1.5 border-t border-chocolate-900/10 pt-4 text-sm">
              <div className="flex justify-between text-chocolate-700/80">
                <span>Subtotal</span>
                <span>{formatPrice(Number(order.subtotal))}</span>
              </div>
              <div className="flex justify-between text-chocolate-700/80">
                <span>Delivery Fee</span>
                <span>{Number(order.deliveryFee) > 0 ? formatPrice(Number(order.deliveryFee)) : "Free"}</span>
              </div>
              <div className="flex justify-between font-display text-base text-chocolate-900">
                <span>Total</span>
                <span>{formatPrice(Number(order.total))}</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-chocolate-900/10 pt-4 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-chocolate-700/60">
                  {order.deliveryType === "DELIVERY" ? "Delivery" : "Pickup"}
                </p>
                <p className="text-chocolate-800">
                  {order.deliveryType === "DELIVERY" ? order.address : "Cakoo Bakery"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-chocolate-700/60">Scheduled</p>
                <p className="text-chocolate-800">
                  {format(order.scheduledDate, "MMM d, yyyy")} · {order.scheduledTime}
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/menu"
            className="mt-8 inline-block rounded-full bg-chocolate-900 px-7 py-3.5 text-sm font-semibold text-cream-50 hover:bg-accent-600"
          >
            Continue Browsing
          </Link>
        </div>
      </Container>
    </div>
  );
}
