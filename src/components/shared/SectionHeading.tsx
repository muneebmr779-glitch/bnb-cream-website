import clsx from "clsx";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
  level = "h2",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  light?: boolean;
  /** Use "h1" when this is the primary heading for the page (no other h1 present). */
  level?: "h1" | "h2";
}) {
  const Heading = level;
  return (
    <Reveal
      className={clsx(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left"
      )}
    >
      {eyebrow && (
        <p
          className={clsx(
            "mb-3 text-xs font-semibold uppercase tracking-[0.3em]",
            light ? "text-beige-300" : "text-caramel-600"
          )}
        >
          {eyebrow}
        </p>
      )}
      <Heading
        className={clsx(
          "font-display text-3xl sm:text-4xl md:text-5xl leading-tight",
          light ? "text-cream-50" : "text-chocolate-900"
        )}
      >
        {title}
      </Heading>
      {description && (
        <p
          className={clsx(
            "mt-4 text-base sm:text-lg leading-relaxed",
            light ? "text-cream-100/80" : "text-chocolate-700/80"
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
