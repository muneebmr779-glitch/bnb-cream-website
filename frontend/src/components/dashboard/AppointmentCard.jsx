import { Calendar, Clock, Car, MessageSquarePlus, RotateCcw, XCircle } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';

const AppointmentCard = ({ appointment, onCancel, onReschedule, onReview }) => {
  const canModify = ['pending', 'confirmed'].includes(appointment.status);
  const canReview = appointment.status === 'completed';

  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-charcoal-400">
            {appointment.bookingId}
          </p>
          <h3 className="mt-1 font-display text-lg font-bold">{appointment.service?.name}</h3>
        </div>
        <StatusBadge status={appointment.status} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-charcoal-500 dark:text-charcoal-400 sm:grid-cols-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-accent-600" />
          {new Date(appointment.date).toDateString()}
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-accent-600" />
          {appointment.time}
        </div>
        <div className="flex items-center gap-2">
          <Car className="h-4 w-4 text-accent-600" />
          {appointment.vehicle?.make} {appointment.vehicle?.model} ({appointment.vehicle?.registrationNumber})
        </div>
      </div>

      {appointment.message && (
        <p className="mt-3 rounded-lg bg-charcoal-50 p-3 text-sm text-charcoal-600 dark:bg-charcoal-800 dark:text-charcoal-300">
          &ldquo;{appointment.message}&rdquo;
        </p>
      )}

      {(canModify || canReview) && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-charcoal-100 pt-4 dark:border-charcoal-800">
          {canModify && (
            <>
              <button type="button" onClick={() => onReschedule(appointment)} className="btn-outline px-4 py-2 text-xs">
                <RotateCcw className="h-3.5 w-3.5" /> Reschedule
              </button>
              <button type="button" onClick={() => onCancel(appointment)} className="btn-ghost px-4 py-2 text-xs text-accent-600">
                <XCircle className="h-3.5 w-3.5" /> Cancel
              </button>
            </>
          )}
          {canReview && (
            <button type="button" onClick={() => onReview(appointment)} className="btn-outline px-4 py-2 text-xs">
              <MessageSquarePlus className="h-3.5 w-3.5" /> Leave a Review
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
