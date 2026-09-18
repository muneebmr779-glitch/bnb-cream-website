import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';
import PageMeta from '../components/ui/PageMeta';
import useAuth from '../hooks/useAuth';
import { isValidEmail, required } from '../utils/validators';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!isValidEmail(form.email)) next.email = 'Please enter a valid email';
    if (!required(form.password)) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const res = await login({ email: form.email, password: form.password });
    setSubmitting(false);

    if (res.success) {
      toast.success(`Welcome back, ${res.user.name.split(' ')[0]}!`);
      const redirectTo = location.state?.from?.pathname || (res.user.role === 'admin' ? '/admin' : '/dashboard');
      navigate(redirectTo, { replace: true });
    } else {
      toast.error(res.message);
    }
  };

  return (
    <>
      <PageMeta title="Login" />
      <AuthLayout title="Welcome Back" subtitle="Log in to manage your appointments and vehicles.">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} className="input" placeholder="you@example.com" autoComplete="email" />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>

          <div>
            <label className="label" htmlFor="password">Password</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                className="input pr-10"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-charcoal-600 dark:text-charcoal-300">
              <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} className="rounded border-charcoal-300 text-accent-600 focus:ring-accent-500" />
              Remember me
            </label>
            <Link to="/forgot-password" className="font-medium text-accent-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Logging in...' : (<><LogIn className="h-4 w-4" /> Login</>)}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-charcoal-500 dark:text-charcoal-400">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-accent-600 hover:underline">
            Sign up
          </Link>
        </p>
      </AuthLayout>
    </>
  );
};

export default Login;
