import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, onChange, size = 18, readOnly = false }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        disabled={readOnly}
        onClick={() => onChange && onChange(star)}
        className={readOnly ? 'cursor-default' : 'cursor-pointer transition hover:scale-110'}
        aria-label={`${star} star${star > 1 ? 's' : ''}`}
      >
        <Star
          size={size}
          className={star <= rating ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-charcoal-300 dark:text-charcoal-600'}
        />
      </button>
    ))}
  </div>
);

export default StarRating;
