import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Search, CalendarClock, ChevronLeft, ChevronRight } from 'lucide-react';
import PageMeta from '../../components/ui/PageMeta';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';
import { getAppointments, updateAppointmentStatus } from '../../services/appointmentService';
import { getErrorMessage } from '../../services/api';
import { APPOINTMENT_STATUSES } from '../../utils/constants';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    getAppointments({ search, status, page, limit: 10 })
      .then((res) => {
        setAppointments(res.appointments);
        setPages(res.pages || 1);
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [search, status, page]);

  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [load]);

  const handleStatusChange = async (appointment, newStatus) => {
    setUpdatingId(appointment._id);
    try {
      await updateAppointmentStatus(appointment._id, { status: newStatus });
      toast.success(`Appointment marked as ${newStatus}`);
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <PageMeta title="Manage Appointments" />
      <h1 className="font-display text-2xl font-bold">Appointments</h1>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search by booking ID..."
            className="input pl-10"
          />
        </div>
        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className="input sm:max-w-[200px]"
        >
          <option value="all">All Statuses</option>
          {APPOINTMENT_STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </select>
      </div>

      <div className="mt-6">
        {loading ? (
          <Loader label="Loading appointments..." />
        ) : appointments.length === 0 ? (
          <EmptyState icon={CalendarClock} title="No appointments found" description="Try adjusting your search or filter." />
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b border-charcoal-100 text-xs uppercase tracking-wide text-charcoal-400 dark:border-charcoal-800">
                <tr>
                  <th className="px-5 py-3">Booking ID</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Service</th>
                  <th className="px-5 py-3">Date &amp; Time</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100 dark:divide-charcoal-800">
                {appointments.map((a) => (
                  <tr key={a._id}>
                    <td className="px-5 py-3 font-medium">{a.bookingId}</td>
                    <td className="px-5 py-3">
                      <p>{a.customer?.name}</p>
                      <p className="text-xs text-charcoal-400">{a.customer?.email}</p>
                    </td>
                    <td className="px-5 py-3">{a.service?.name}</td>
                    <td className="px-5 py-3">
                      {new Date(a.date).toLocaleDateString()} <span className="text-charcoal-400">{a.time}</span>
                    </td>
                    <td className="px-5 py-3"><StatusBadge status={a.status} /></td>
                    <td className="px-5 py-3">
                      <select
                        value={a.status}
                        disabled={updatingId === a._id}
                        onChange={(e) => handleStatusChange(a, e.target.value)}
                        className="input py-1.5 text-xs"
                      >
                        {APPOINTMENT_STATUSES.map((s) => (
                          <option key={s} value={s} className="capitalize">{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pages > 1 && (
          <div className="mt-5 flex items-center justify-center gap-3">
            <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-outline px-3 py-2">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-charcoal-500 dark:text-charcoal-400">Page {page} of {pages}</span>
            <button type="button" onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages} className="btn-outline px-3 py-2">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminAppointments;
