import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MessageSquareText } from 'lucide-react';
import PageMeta from '../components/ui/PageMeta';
import SectionHeading from '../components/ui/SectionHeading';
import ReviewCard from '../components/reviews/ReviewCard';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import useAuth from '../hooks/useAuth';
import { getReviews } from '../services/reviewService';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    getReviews()
      .then((res) => setReviews(res.reviews))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  const average = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <>
      <PageMeta
        title="Customer Reviews"
        description="See what our customers say about AutoCare Pro's car repair and auto service quality."
      />
      <section className="bg-charcoal-950 py-16 text-white sm:py-20">
        <div className="container-page text-center">
          <SectionHeading
            eyebrow="Testimonials"
            title="Customer Reviews & Ratings"
            description="Honest feedback from real customers who trust us with their vehicles."
          />
          {average && (
            <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              <span className="font-display text-lg font-bold">{average}</span>
              <span className="text-sm text-charcoal-300">
                out of 5 ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
              </span>
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          {loading ? (
            <Loader label="Loading reviews..." />
          ) : reviews.length === 0 ? (
            <EmptyState
              icon={MessageSquareText}
              title="No reviews yet"
              description="Be the first to share your experience after your service is completed."
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review, idx) => (
                <ReviewCard key={review._id} review={review} index={idx} />
              ))}
            </div>
          )}

          {!isAdmin && (
            <div className="mt-14 rounded-2xl bg-charcoal-50 p-8 text-center dark:bg-charcoal-900/40">
              <h3 className="font-display text-xl font-bold">Had a service with us?</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-charcoal-500 dark:text-charcoal-400">
                Share your experience — reviews can be submitted from your dashboard after a
                completed appointment.
              </p>
              <Link to={isAuthenticated ? '/dashboard/appointments' : '/login'} className="btn-primary mt-5">
                {isAuthenticated ? 'Go to My Appointments' : 'Login to Leave a Review'}
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Reviews;
