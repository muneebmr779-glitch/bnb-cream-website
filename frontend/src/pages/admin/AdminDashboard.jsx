import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Users,
  CalendarClock,
  Clock,
  CheckCircle2,
  DollarSign,
  Star,
} from 'lucide-react';
import PageMeta from '../../components/ui/PageMeta';
import Loader from '../../components/ui/Loader';
import StatsCard from '../../components/admin/StatsCard';
import StatusBadge from '../../components/ui/StatusBadge';
import { getDashboardStats } from '../../services/userService';
import { getErrorMessage } from '../../services/api';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((res) => setData(res))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading dashboard stats..." />;
  if (!data) return null;

  const { stats, recentAppointments } = data;

  return (
    <>
      <PageMeta title="Admin Dashboard" />
      <h1 className="font-display text-2xl font-bold">Dashboard Overview</h1>
      <p className="mt-1 text-sm text-charcoal-500 dark:text-charcoal-400">
        A snapshot of your workshop&apos;s performance.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatsCard icon={Users} label="Total Customers" value={stats.totalCustomers} color="bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" />
        <StatsCard icon={CalendarClock} label="Total Appointments" value={stats.totalAppointments} color="bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400" />
        <StatsCard icon={Clock} label="Pending" value={stats.pendingAppointments} color="bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" />
        <StatsCard icon={CheckCircle2} label="Completed" value={stats.completedAppointments} color="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" />
        <StatsCard icon={DollarSign} label="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} color="bg-accent-100 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400" />
        <StatsCard icon={Star} label="Customer Reviews" value={stats.totalReviews} color="bg-pink-100 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400" />
      </div>

      <div className="mt-8">
        <h2 className="font-display text-lg font-bold">Recent Appointments</h2>
        <div className="card mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-charcoal-100 text-xs uppercase tracking-wide text-charcoal-400 dark:border-charcoal-800">
              <tr>
                <th className="px-5 py-3">Booking ID</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Service</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100 dark:divide-charcoal-800">
              {recentAppointments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-charcoal-400">
                    No appointments yet.
                  </td>
                </tr>
              ) : (
                recentAppointments.map((a) => (
                  <tr key={a._id}>
                    <td className="px-5 py-3 font-medium">{a.bookingId}</td>
                    <td className="px-5 py-3">{a.customer?.name}</td>
                    <td className="px-5 py-3">{a.service?.name}</td>
                    <td className="px-5 py-3"><StatusBadge status={a.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
