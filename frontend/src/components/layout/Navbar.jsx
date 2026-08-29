import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Moon, Sun, Wrench, ChevronDown, LayoutDashboard, LogOut, User } from 'lucide-react';
import { NAV_LINKS } from '../../utils/constants';
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [navigate]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'glass shadow-sm'
          : 'bg-white dark:bg-charcoal-950 border-b border-transparent'
      }`}
    >
      <nav className="container-page flex h-[4.5rem] items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2.5 font-display text-xl font-extrabold">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-charcoal-900 text-accent-500 dark:bg-white dark:text-accent-600">
            <Wrench className="h-5 w-5" />
          </span>
          <span>
            Auto<span className="text-accent-600">Care</span> Pro
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'text-accent-600'
                    : 'text-charcoal-600 hover:text-accent-600 dark:text-charcoal-300 dark:hover:text-accent-400'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg p-2 text-charcoal-500 transition hover:bg-charcoal-100 dark:text-charcoal-300 dark:hover:bg-charcoal-800"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-semibold transition hover:bg-charcoal-100 dark:hover:bg-charcoal-800"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-600 text-xs font-bold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
                <span className="max-w-[100px] truncate">{user?.name?.split(' ')[0]}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="card absolute right-0 mt-2 w-52 overflow-hidden p-1.5"
                  >
                    <Link
                      to={isAdmin ? '/admin' : '/dashboard'}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-charcoal-100 dark:hover:bg-charcoal-800"
                    >
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    {!isAdmin && (
                      <Link
                        to="/dashboard/profile"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-charcoal-100 dark:hover:bg-charcoal-800"
                      >
                        <User className="h-4 w-4" /> Profile
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-accent-600 hover:bg-accent-50 dark:hover:bg-accent-500/10"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="btn-ghost">
              Login / Register
            </Link>
          )}
          <Link to="/booking" className="btn-primary">
            Book Service
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg p-2 text-charcoal-500 dark:text-charcoal-300"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="rounded-lg p-2 text-charcoal-700 dark:text-white"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-charcoal-100 bg-white lg:hidden dark:border-charcoal-800 dark:bg-charcoal-950"
          >
            <div className="container-page flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2.5 text-sm font-medium ${
                      isActive ? 'bg-accent-600/10 text-accent-600' : 'text-charcoal-700 dark:text-charcoal-200'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="my-2 border-t border-charcoal-100 dark:border-charcoal-800" />
              {isAuthenticated ? (
                <>
                  <Link
                    to={isAdmin ? '/admin' : '/dashboard'}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-charcoal-700 dark:text-charcoal-200"
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-accent-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-charcoal-700 dark:text-charcoal-200"
                >
                  Login / Register
                </Link>
              )}
              <Link to="/booking" onClick={() => setMobileOpen(false)} className="btn-primary mt-2 w-full">
                Book Service
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
