import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import ReviewCard from '../reviews/ReviewCard';
import Loader from '../ui/Loader';
import { getReviews } from '../../services/reviewService';

const TestimonialsPreview = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReviews()
      .then((res) => setReviews(res.reviews.slice(0, 3)))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && reviews.length === 0) return null;

  return (
    <section className="section bg-charcoal-50 dark:bg-charcoal-900/40">
      <div className="container-page">
        <SectionHeading
          eyebrow="Testimonials"
          title="What Our Customers Say"
          description="Real feedback from drivers who trust us with their vehicles."
        />

        {loading ? (
          <Loader label="Loading reviews..." />
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, idx) => (
              <ReviewCard key={review._id} review={review} index={idx} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link to="/reviews" className="btn-outline">
            Read All Reviews <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsPreview;
