import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/shared/Reveal";

type OfferItem = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
};

export function OffersSection({ offers }: { offers: OfferItem[] }) {
  const headline = offers[0]?.title ?? "Something Sweet Is Waiting";
  const description =
    offers[0]?.description ??
    "Discover our seasonal creations and special bakery offers.";

  return (
    <section className="relative overflow-hidden bg-chocolate-900 py-20 sm:py-24">
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={offers[0]?.imageUrl || "/images/offer-banner.svg"}
          alt=""
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-chocolate-900 via-chocolate-900/80 to-chocolate-900/40" />
      </div>
      <Container className="relative">
        <Reveal className="max-w-xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-caramel-400">
            Limited Time
          </p>
          <h2 className="font-display text-3xl leading-tight text-cream-50 sm:text-4xl md:text-5xl">
            {headline}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-cream-100/80 sm:text-lg">
            {description}
          </p>
          <Link
            href="/menu"
            className="mt-8 inline-block rounded-full bg-accent-500 px-7 py-3.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-accent-600"
          >
            View Special Offers
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
