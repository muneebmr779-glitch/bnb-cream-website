import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CheckCircle2, Calendar } from 'lucide-react';
import { getServices } from '../../services/serviceService';
import { createAppointment } from '../../services/appointmentService';
import { getErrorMessage } from '../../services/api';
import { required, isValidYear, isFutureDate } from '../../utils/validators';
import { TIME_SLOTS } from '../../utils/constants';
import useAuth from '../../hooks/useAuth';
import Loader from '../ui/Loader';

const initialState = {
  vehicleMake: '',
  vehicleModel: '',
  vehicleYear: '',
  registrationNumber: '',
  serviceId: '',
  date: '',
  time: '',
  message: '',
};

const minDate = new Date().toISOString().split('T')[0];

const BookingForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [form, setForm] = useState({
    ...initialState,
    serviceId: searchParams.get('service') || '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    getServices()
      .then((res) => setServices(res.services))
      .catch(() => setServices([]))
      .finally(() => setLoadingServices(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!required(form.vehicleMake)) next.vehicleMake = 'Vehicle make is required';
    if (!required(form.vehicleModel)) next.vehicleModel = 'Vehicle model is required';
    if (!isValidYear(form.vehicleYear)) next.vehicleYear = 'Enter a valid vehicle year';
    if (!required(form.registrationNumber)) next.registrationNumber = 'Registration number is required';
    if (!required(form.serviceId)) next.serviceId = 'Please select a service';
    if (!isFutureDate(form.date)) next.date = 'Please select a valid, future date';
    if (!required(form.time)) next.time = 'Please select a preferred time';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await createAppointment({
        ...form,
        vehicleYear: Number(form.vehicleYear),
      });
      setConfirmation(res.appointment);
      toast.success('Appointment booked successfully!');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmation) {
    return (
      <div className="card mx-auto max-w-lg p-8 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
        <h3 className="mt-4 font-display text-2xl font-bold">Appointment Confirmed!</h3>
        <p className="mt-2 text-sm text-charcoal-500 dark:text-charcoal-400">
          We&apos;ve sent a confirmation to your email. Here are your booking details:
        </p>
        <div className="mt-6 space-y-2 rounded-xl bg-charcoal-50 p-5 text-left text-sm dark:bg-charcoal-800">
          <div className="flex justify-between">
            <span className="text-charcoal-500 dark:text-charcoal-400">Booking ID</span>
            <span className="font-semibold">{confirmation.bookingId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-charcoal-500 dark:text-charcoal-400">Service</span>
            <span className="font-semibold">{confirmation.service?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-charcoal-500 dark:text-charcoal-400">Date</span>
            <span className="font-semibold">{new Date(confirmation.date).toDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-charcoal-500 dark:text-charcoal-400">Time</span>
            <span className="font-semibold">{confirmation.time}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-charcoal-500 dark:text-charcoal-400">Status</span>
            <span className="font-semibold capitalize">{confirmation.status}</span>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={() => navigate('/dashboard/appointments')} className="btn-primary w-full">
            View My Appointments
          </button>
          <button
            type="button"
            onClick={() => {
              setConfirmation(null);
              setForm(initialState);
            }}
            className="btn-outline w-full"
          >
            Book Another Service
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-6 p-6 sm:p-8">
      <div className="rounded-xl bg-charcoal-50 p-4 text-sm dark:bg-charcoal-800">
        Booking as <span className="font-semibold">{user?.name}</span> ({user?.email})
      </div>

      <div>
        <h3 className="font-display text-lg font-bold">Vehicle Information</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="vehicleMake">Vehicle Make</label>
            <input id="vehicleMake" name="vehicleMake" value={form.vehicleMake} onChange={handleChange} className="input" placeholder="e.g. Toyota" />
            {errors.vehicleMake && <p className="field-error">{errors.vehicleMake}</p>}
          </div>
          <div>
            <label className="label" htmlFor="vehicleModel">Vehicle Model</label>
            <input id="vehicleModel" name="vehicleModel" value={form.vehicleModel} onChange={handleChange} className="input" placeholder="e.g. Corolla" />
            {errors.vehicleModel && <p className="field-error">{errors.vehicleModel}</p>}
          </div>
          <div>
            <label className="label" htmlFor="vehicleYear">Vehicle Year</label>
            <input id="vehicleYear" name="vehicleYear" type="number" value={form.vehicleYear} onChange={handleChange} className="input" placeholder="e.g. 2020" />
            {errors.vehicleYear && <p className="field-error">{errors.vehicleYear}</p>}
          </div>
          <div>
            <label className="label" htmlFor="registrationNumber">Registration Number</label>
            <input id="registrationNumber" name="registrationNumber" value={form.registrationNumber} onChange={handleChange} className="input" placeholder="e.g. ABC-1234" />
            {errors.registrationNumber && <p className="field-error">{errors.registrationNumber}</p>}
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-display text-lg font-bold">Service Details</h3>
        <div className="mt-4 grid grid-cols-1 gap-4">
          <div>
            <label className="label" htmlFor="serviceId">Select Service</label>
            {loadingServices ? (
              <Loader label="Loading services..." />
            ) : (
              <select id="serviceId" name="serviceId" value={form.serviceId} onChange={handleChange} className="input">
                <option value="">Choose a service...</option>
                {services.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} — from ${s.price}
                  </option>
                ))}
              </select>
            )}
            {errors.serviceId && <p className="field-error">{errors.serviceId}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="date">Preferred Date</label>
              <input id="date" name="date" type="date" min={minDate} value={form.date} onChange={handleChange} className="input" />
              {errors.date && <p className="field-error">{errors.date}</p>}
            </div>
            <div>
              <label className="label" htmlFor="time">Preferred Time</label>
              <select id="time" name="time" value={form.time} onChange={handleChange} className="input">
                <option value="">Select a time...</option>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
              {errors.time && <p className="field-error">{errors.time}</p>}
            </div>
          </div>

          <div>
            <label className="label" htmlFor="message">Additional Message (optional)</label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={form.message}
              onChange={handleChange}
              className="input resize-none"
              placeholder="Describe any specific issues or requests..."
            />
          </div>
        </div>
      </div>

      <button type="submit" disabled={submitting} className="btn-primary w-full text-base">
        {submitting ? 'Booking...' : (<><Calendar className="h-4 w-4" /> Confirm Service Appointment</>)}
      </button>
    </form>
  );
};

export default BookingForm;
