import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, CheckCircle2 } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';
import PageMeta from '../components/ui/PageMeta';
import { forgotPassword } from '../services/authService';
import { getErrorMessage } from '../services/api';
import { isValidEmail } from '../utils/validators';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError('Please enter a valid email');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta title="Forgot Password" />
      <AuthLayout title="Reset Your Password" subtitle="Enter your email and we'll send you a reset link.">
        {sent ? (
          <div className="rounded-xl bg-emerald-50 p-5 text-center dark:bg-emerald-500/10">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
            <p className="mt-3 text-sm font-medium">
              If an account exists for <strong>{email}</strong>, a reset link has been sent.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="input"
                placeholder="you@example.com"
              />
              {error && <p className="field-error">{error}</p>}
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Sending...' : (<><Mail className="h-4 w-4" /> Send Reset Link</>)}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-charcoal-500 dark:text-charcoal-400">
          Remembered your password?{' '}
          <Link to="/login" className="font-semibold text-accent-600 hover:underline">
            Back to login
          </Link>
        </p>
      </AuthLayout>
    </>
  );
};

export default ForgotPassword;
