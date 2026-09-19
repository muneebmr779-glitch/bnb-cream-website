import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";

export function About({ heading, text }: { heading: string; text: string }) {
  return (
    <section id="about" className="bg-cream-50 py-20 sm:py-28">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-xl">
              <Image
                src="/images/about-cakoo.svg"
                alt="Baker decorating a fresh cake at Cakoo"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 hidden rounded-2xl bg-chocolate-900 px-6 py-5 shadow-lg sm:block">
              <p className="font-display text-2xl text-cream-50">4.2★</p>
              <p className="text-xs uppercase tracking-wider text-cream-100/70">Google Rating</p>
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <SectionHeading
              align="left"
              eyebrow="Our Story"
              title={heading}
            />
            <Reveal delay={0.1}>
              <p className="mt-6 text-base leading-relaxed text-chocolate-700/85 sm:text-lg">
                {text}
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-10 grid grid-cols-2 gap-6 border-t border-chocolate-900/10 pt-8 sm:grid-cols-4">
                <AnimatedCounter label="4.2★" sublabel="Google Rating" />
                <AnimatedCounter label="38+" sublabel="Happy Reviews" />
                <AnimatedCounter label="Fresh" sublabel="Baked Every Day" />
                <AnimatedCounter label="100%" sublabel="Made With Love" />
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
