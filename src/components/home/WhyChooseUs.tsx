import { CalendarClock, Heart, Leaf, Sparkles } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";

const FEATURES = [
  {
    icon: CalendarClock,
    title: "Fresh Every Day",
    description: "Our products are prepared with freshness and quality in mind.",
  },
  {
    icon: Leaf,
    title: "Premium Ingredients",
    description: "We use carefully selected ingredients for exceptional taste.",
  },
  {
    icon: Sparkles,
    title: "Crafted With Care",
    description: "Every creation receives thoughtful, hands-on attention to detail.",
  },
  {
    icon: Heart,
    title: "Made For Your Moments",
    description: "From everyday treats to unforgettable celebrations.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-cream-50 py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Why Cakoo" title="Why Choose Cakoo" />
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.08}>
              <div className="group h-full rounded-2xl border border-chocolate-900/10 bg-white p-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-caramel-400/15 text-caramel-600 transition-colors duration-300 group-hover:bg-accent-500 group-hover:text-cream-50">
                  <feature.icon size={26} />
                </div>
                <h3 className="mt-5 font-display text-lg text-chocolate-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-chocolate-700/75">
                  {feature.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
