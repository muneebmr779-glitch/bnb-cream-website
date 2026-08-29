import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, Clock, CheckCircle2, XCircle, ArrowRight, PlusCircle } from 'lucide-react';
import PageMeta from '../../components/ui/PageMeta';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';
import useAuth from '../../hooks/useAuth';
import { getMyAppointments } from '../../services/appointmentService';

const StatTile = ({ icon: Icon, label, value, color }) => (
  <div className="card p-5">
    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
      <Icon className="h-5 w-5" />
    </div>
    <p className="mt-3 font-display text-2xl font-extrabold">{value}</p>
    <p className="text-xs text-charcoal-500 dark:text-charcoal-400">{label}</p>
  </div>
);

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyAppointments()
      .then((res) => setAppointments(res.appointments))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    upcoming: appointments.filter((a) => ['pending', 'confirmed', 'in-progress'].includes(a.status)).length,
    completed: appointments.filter((a) => a.status === 'completed').length,
    pending: appointments.filter((a) => a.status === 'pending').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
  };

  return (
    <>
      <PageMeta title="My Dashboard" />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p className="mt-1 text-sm text-charcoal-500 dark:text-charcoal-400">
            Here&apos;s an overview of your service activity.
          </p>
        </div>
        <Link to="/booking" className="btn-primary">
          <PlusCircle className="h-4 w-4" /> Book New Service
        </Link>
      </div>

      {loading ? (
        <Loader label="Loading your dashboard..." />
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatTile icon={CalendarClock} label="Upcoming" value={counts.upcoming} color="bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" />
            <StatTile icon={Clock} label="Pending" value={counts.pending} color="bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" />
            <StatTile icon={CheckCircle2} label="Completed" value={counts.completed} color="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" />
            <StatTile icon={XCircle} label="Cancelled" value={counts.cancelled} color="bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400" />
          </div>

          <div className="mt-8 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Recent Appointments</h2>
            <Link to="/dashboard/appointments" className="flex items-center gap-1 text-sm font-semibold text-accent-600 hover:underline">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {appointments.length === 0 ? (
              <EmptyState
                icon={CalendarClock}
                title="No appointments yet"
                description="Book your first service to see it here."
                action={<Link to="/booking" className="btn-primary">Book a Service</Link>}
              />
            ) : (
              appointments.slice(0, 5).map((appointment) => (
                <div key={appointment._id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <p className="text-sm font-semibold">{appointment.service?.name}</p>
                    <p className="mt-0.5 text-xs text-charcoal-500 dark:text-charcoal-400">
                      {new Date(appointment.date).toDateString()} &middot; {appointment.time}
                    </p>
                  </div>
                  <StatusBadge status={appointment.status} />
                </div>
              ))
            )}
          </div>
        </>
      )}
    </>
  );
};

export default CustomerDashboard;
