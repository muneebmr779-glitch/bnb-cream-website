import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';
import PageMeta from '../components/ui/PageMeta';
import useAuth from '../hooks/useAuth';
import { isValidEmail, isValidPhone, minLength, required } from '../utils/validators';

const initialState = { name: '', email: '', phone: '', password: '', confirmPassword: '' };

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!required(form.name)) next.name = 'Full name is required';
    if (!isValidEmail(form.email)) next.email = 'Please enter a valid email';
    if (!isValidPhone(form.phone)) next.phone = 'Please enter a valid phone number';
    if (!minLength(form.password, 8)) next.password = 'Password must be at least 8 characters';
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const res = await register({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
    });
    setSubmitting(false);

    if (res.success) {
      toast.success(`Welcome to AutoCare Pro, ${res.user.name.split(' ')[0]}!`);
      navigate('/dashboard', { replace: true });
    } else {
      toast.error(res.message);
    }
  };

  return (
    <>
      <PageMeta title="Create Account" />
      <AuthLayout title="Create Your Account" subtitle="Sign up to book services and track your appointments.">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="name">Full Name</label>
            <input id="name" name="name" value={form.name} onChange={handleChange} className="input" placeholder="John Doe" autoComplete="name" />
            {errors.name && <p className="field-error">{errors.name}</p>}
          </div>

          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} className="input" placeholder="you@example.com" autoComplete="email" />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>

          <div>
            <label className="label" htmlFor="phone">Phone</label>
            <input id="phone" name="phone" value={form.phone} onChange={handleChange} className="input" placeholder="+1 (555) 000-0000" autoComplete="tel" />
            {errors.phone && <p className="field-error">{errors.phone}</p>}
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
                placeholder="At least 8 characters"
                autoComplete="new-password"
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

          <div>
            <label className="label" htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={handleChange}
              className="input"
              placeholder="Re-enter your password"
              autoComplete="new-password"
            />
            {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Creating account...' : (<><UserPlus className="h-4 w-4" /> Create Account</>)}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-charcoal-500 dark:text-charcoal-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-accent-600 hover:underline">
            Log in
          </Link>
        </p>
      </AuthLayout>
    </>
  );
};

export default Register;
