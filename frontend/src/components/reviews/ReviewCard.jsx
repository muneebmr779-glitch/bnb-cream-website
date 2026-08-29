import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import StarRating from '../ui/StarRating';

const ReviewCard = ({ review, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.4, delay: (index % 6) * 0.06 }}
    className="card flex h-full flex-col p-6"
  >
    <Quote className="h-7 w-7 text-accent-600/30" />
    <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal-600 dark:text-charcoal-300">
      {review.comment}
    </p>
    <StarRating rating={review.rating} readOnly size={16} />
    <div className="mt-4 flex items-center justify-between border-t border-charcoal-100 pt-4 dark:border-charcoal-800">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-600/10 text-sm font-bold text-accent-600 dark:text-accent-400">
          {review.customer?.name?.charAt(0)?.toUpperCase() || 'A'}
        </span>
        <div>
          <p className="text-sm font-semibold">{review.customer?.name || 'Anonymous'}</p>
          <p className="text-xs text-charcoal-400">{review.service?.name}</p>
        </div>
      </div>
      <p className="text-xs text-charcoal-400">{new Date(review.createdAt).toLocaleDateString()}</p>
    </div>
  </motion.div>
);

export default ReviewCard;
