import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarClock, Wrench, Star, Mail } from 'lucide-react';

const LINKS = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/appointments', label: 'Appointments', icon: CalendarClock },
  { to: '/admin/services', label: 'Services', icon: Wrench },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/messages', label: 'Messages', icon: Mail },
];

const AdminSidebar = () => (
  <nav className="flex gap-2 overflow-x-auto pb-2 lg:sticky lg:top-24 lg:w-56 lg:shrink-0 lg:flex-col lg:overflow-visible lg:pb-0">
    {LINKS.map((link) => (
      <NavLink
        key={link.to}
        to={link.to}
        end={link.end}
        className={({ isActive }) =>
          `flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
            isActive
              ? 'bg-charcoal-900 text-white dark:bg-accent-600'
              : 'text-charcoal-600 hover:bg-charcoal-100 dark:text-charcoal-300 dark:hover:bg-charcoal-800'
          }`
        }
      >
        <link.icon className="h-4 w-4" /> {link.label}
      </NavLink>
    ))}
  </nav>
);

export default AdminSidebar;
