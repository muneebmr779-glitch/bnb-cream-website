import { Link } from 'react-router-dom';
import { Wrench } from 'lucide-react';

const AuthLayout = ({ title, subtitle, children }) => (
  <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
    <div className="relative hidden flex-col justify-between overflow-hidden bg-charcoal-950 p-12 text-white lg:flex">
      <div className="absolute inset-0 bg-grid-pattern bg-[size:40px_40px] opacity-30" />
      <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-accent-600/20 blur-[100px]" />
      <Link to="/" className="relative flex items-center gap-2.5 font-display text-xl font-extrabold">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-accent-600">
          <Wrench className="h-5 w-5" />
        </span>
        Auto<span className="text-accent-500">Care</span> Pro
      </Link>
      <div className="relative">
        <h2 className="heading-lg max-w-md">Professional Car Repair & Auto Care You Can Trust</h2>
        <p className="mt-4 max-w-sm text-charcoal-300">
          Manage your appointments, track service history, and book your next visit — all in one
          place.
        </p>
      </div>
      <p className="relative text-xs text-charcoal-500">&copy; {new Date().getFullYear()} AutoCare Pro. All rights reserved.</p>
    </div>

    <div className="flex items-center justify-center px-4 py-12 sm:px-8">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center gap-2.5 font-display text-xl font-extrabold lg:hidden">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-charcoal-900 text-accent-500">
            <Wrench className="h-5 w-5" />
          </span>
          Auto<span className="text-accent-600">Care</span> Pro
        </Link>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-charcoal-500 dark:text-charcoal-400">{subtitle}</p>}
        <div className="mt-8">{children}</div>
      </div>
    </div>
  </div>
);

export default AuthLayout;
