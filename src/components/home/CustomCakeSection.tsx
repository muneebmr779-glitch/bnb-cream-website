import Image from "next/image";
import Link from "next/link";
import { PartyPopper } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/shared/Reveal";

const OCCASIONS = [
  "Birthdays",
  "Weddings",
  "Anniversaries",
  "Baby Showers",
  "Graduations",
  "Corporate Events",
];

export function CustomCakeSection() {
  return (
    <section id="cakes" className="bg-chocolate-900 py-20 sm:py-28">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-caramel-400">
              Custom Creations
            </p>
            <h2 className="font-display text-3xl leading-tight text-cream-50 sm:text-4xl md:text-5xl">
              Your Dream Cake, Made By Cakoo
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-cream-100/80 sm:text-lg">
              Have something special in mind? Our bakers work with you to design a
              one-of-a-kind cake — from flavor and filling to every last detail of the
              decoration — for any celebration worth remembering.
            </p>
            <ul className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {OCCASIONS.map((occasion) => (
                <li
                  key={occasion}
                  className="flex items-center gap-2 rounded-full bg-cream-50/5 px-4 py-2 text-sm text-cream-100/85 ring-1 ring-cream-50/10"
                >
                  <PartyPopper size={14} className="shrink-0 text-caramel-400" />
                  {occasion}
                </li>
              ))}
            </ul>
            <Link
              href="/custom-cakes"
              className="mt-9 inline-block rounded-full bg-accent-500 px-8 py-4 text-sm font-semibold text-cream-50 shadow-lg shadow-accent-500/20 transition-colors hover:bg-accent-600"
            >
              Create Your Custom Cake
            </Link>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src="/images/custom-cake.svg"
                alt="A beautifully decorated custom celebration cake"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
