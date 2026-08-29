import { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import { rescheduleAppointment } from '../../services/appointmentService';
import { getErrorMessage } from '../../services/api';
import { isFutureDate, required } from '../../utils/validators';
import { TIME_SLOTS } from '../../utils/constants';

const minDate = new Date().toISOString().split('T')[0];

const RescheduleModal = ({ appointment, onClose, onSuccess }) => {
  const [form, setForm] = useState({ date: '', time: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!isFutureDate(form.date)) next.date = 'Please select a valid, future date';
    if (!required(form.time)) next.time = 'Please select a time';
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    try {
      await rescheduleAppointment(appointment._id, form);
      toast.success('Appointment rescheduled successfully');
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={!!appointment} onClose={onClose} title="Reschedule Appointment">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="reschedule-date">New Date</label>
          <input
            id="reschedule-date"
            type="date"
            min={minDate}
            value={form.date}
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            className="input"
          />
          {errors.date && <p className="field-error">{errors.date}</p>}
        </div>
        <div>
          <label className="label" htmlFor="reschedule-time">New Time</label>
          <select
            id="reschedule-time"
            value={form.time}
            onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
            className="input"
          >
            <option value="">Select a time...</option>
            {TIME_SLOTS.map((slot) => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
          {errors.time && <p className="field-error">{errors.time}</p>}
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost" disabled={submitting}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : 'Confirm New Time'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RescheduleModal;
