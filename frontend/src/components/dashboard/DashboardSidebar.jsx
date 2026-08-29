import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarClock, Car, User } from 'lucide-react';

const LINKS = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/appointments', label: 'My Appointments', icon: CalendarClock },
  { to: '/dashboard/vehicles', label: 'My Vehicles', icon: Car },
  { to: '/dashboard/profile', label: 'Profile', icon: User },
];

const DashboardSidebar = () => (
  <nav className="flex gap-2 overflow-x-auto pb-2 lg:sticky lg:top-24 lg:w-56 lg:shrink-0 lg:flex-col lg:overflow-visible lg:pb-0">
    {LINKS.map((link) => (
      <NavLink
        key={link.to}
        to={link.to}
        end={link.end}
        className={({ isActive }) =>
          `flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
            isActive
              ? 'bg-accent-600 text-white shadow-lg shadow-accent-600/25'
              : 'text-charcoal-600 hover:bg-charcoal-100 dark:text-charcoal-300 dark:hover:bg-charcoal-800'
          }`
        }
      >
        <link.icon className="h-4 w-4" /> {link.label}
      </NavLink>
    ))}
  </nav>
);

export default DashboardSidebar;
