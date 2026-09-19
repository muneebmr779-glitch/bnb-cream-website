import { Star } from "lucide-react";
import clsx from "clsx";

export function StarRating({
  rating,
  size = 16,
  className,
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  return (
    <div className={clsx("flex items-center gap-0.5", className)} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < rating ? "fill-caramel-500 text-caramel-500" : "fill-beige-300 text-beige-300"}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
