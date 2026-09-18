import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Star, Check, Trash2 } from 'lucide-react';
import PageMeta from '../../components/ui/PageMeta';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import StarRating from '../../components/ui/StarRating';
import { getReviews, updateReviewStatus, deleteReview } from '../../services/reviewService';
import { getErrorMessage } from '../../services/api';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    getReviews({ all: 'true' })
      .then((res) => setReviews(res.reviews))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleApprove = async (review) => {
    try {
      await updateReviewStatus(review._id, !review.approved);
      toast.success(review.approved ? 'Review unapproved' : 'Review approved');
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteReview(deleteTarget._id);
      toast.success('Review deleted');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageMeta title="Manage Reviews" />
      <h1 className="font-display text-2xl font-bold">Reviews</h1>

      <div className="mt-6">
        {loading ? (
          <Loader label="Loading reviews..." />
        ) : reviews.length === 0 ? (
          <EmptyState icon={Star} title="No reviews yet" description="Customer reviews will appear here once submitted." />
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{review.customer?.name}</p>
                    <p className="text-xs text-charcoal-400">{review.service?.name} &middot; {new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`badge ${review.approved ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'}`}>
                    {review.approved ? 'Approved' : 'Pending Approval'}
                  </span>
                </div>
                <div className="mt-2"><StarRating rating={review.rating} readOnly size={16} /></div>
                <p className="mt-2 text-sm text-charcoal-600 dark:text-charcoal-300">{review.comment}</p>
                <div className="mt-4 flex gap-2 border-t border-charcoal-100 pt-4 dark:border-charcoal-800">
                  <button type="button" onClick={() => handleApprove(review)} className="btn-outline px-4 py-2 text-xs">
                    <Check className="h-3.5 w-3.5" /> {review.approved ? 'Unapprove' : 'Approve'}
                  </button>
                  <button type="button" onClick={() => setDeleteTarget(review)} className="btn-ghost px-4 py-2 text-xs text-accent-600">
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Review"
        message="Are you sure you want to permanently delete this review?"
        confirmLabel="Delete"
        danger
        loading={deleting}
      />
    </>
  );
};

export default AdminReviews;
