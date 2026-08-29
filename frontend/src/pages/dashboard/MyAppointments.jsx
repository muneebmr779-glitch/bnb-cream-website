import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CalendarClock } from 'lucide-react';
import PageMeta from '../../components/ui/PageMeta';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import AppointmentCard from '../../components/dashboard/AppointmentCard';
import RescheduleModal from '../../components/dashboard/RescheduleModal';
import ReviewModal from '../../components/dashboard/ReviewModal';
import { getMyAppointments, cancelAppointment } from '../../services/appointmentService';
import { getErrorMessage } from '../../services/api';

const FILTERS = ['all', 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [reviewTarget, setReviewTarget] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    getMyAppointments({ status: filter })
      .then((res) => setAppointments(res.appointments))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCancelConfirm = async () => {
    setCancelling(true);
    try {
      await cancelAppointment(cancelTarget._id);
      toast.success('Appointment cancelled');
      setCancelTarget(null);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setCancelling(false);
    }
  };

  return (
    <>
      <PageMeta title="My Appointments" />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold">My Appointments</h1>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition ${
              filter === f
                ? 'bg-accent-600 text-white'
                : 'bg-charcoal-100 text-charcoal-600 hover:bg-charcoal-200 dark:bg-charcoal-800 dark:text-charcoal-300'
            }`}
          >
            {f.replace('-', ' ')}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <Loader label="Loading your appointments..." />
        ) : appointments.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="No appointments found"
            description="You don't have any appointments in this category yet."
          />
        ) : (
          appointments.map((appointment) => (
            <AppointmentCard
              key={appointment._id}
              appointment={appointment}
              onCancel={setCancelTarget}
              onReschedule={setRescheduleTarget}
              onReview={setReviewTarget}
            />
          ))
        )}
      </div>

      <ConfirmDialog
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancelConfirm}
        title="Cancel Appointment"
        message={`Are you sure you want to cancel appointment ${cancelTarget?.bookingId}? This cannot be undone.`}
        confirmLabel="Cancel Appointment"
        danger
        loading={cancelling}
      />

      {rescheduleTarget && (
        <RescheduleModal
          appointment={rescheduleTarget}
          onClose={() => setRescheduleTarget(null)}
          onSuccess={() => {
            setRescheduleTarget(null);
            load();
          }}
        />
      )}

      {reviewTarget && (
        <ReviewModal
          appointment={reviewTarget}
          onClose={() => setReviewTarget(null)}
          onSuccess={() => {
            setReviewTarget(null);
            load();
          }}
        />
      )}
    </>
  );
};

export default MyAppointments;
