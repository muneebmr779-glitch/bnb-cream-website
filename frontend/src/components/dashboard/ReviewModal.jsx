import { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import StarRating from '../ui/StarRating';
import { createReview } from '../../services/reviewService';
import { getErrorMessage } from '../../services/api';
import { required } from '../../utils/validators';

const ReviewModal = ({ appointment, onClose, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!required(comment)) {
      setError('Please share a few words about your experience');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await createReview({ appointmentId: appointment._id, rating, comment });
      toast.success('Thanks for your review!');
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={!!appointment} onClose={onClose} title="Leave a Review">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-charcoal-500 dark:text-charcoal-400">
          How was your <strong>{appointment?.service?.name}</strong> service?
        </p>
        <div>
          <label className="label">Rating</label>
          <StarRating rating={rating} onChange={setRating} size={28} />
        </div>
        <div>
          <label className="label" htmlFor="comment">Your Review</label>
          <textarea
            id="comment"
            rows={4}
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              setError('');
            }}
            className="input resize-none"
            placeholder="Tell us about your experience..."
          />
          {error && <p className="field-error">{error}</p>}
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost" disabled={submitting}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ReviewModal;
