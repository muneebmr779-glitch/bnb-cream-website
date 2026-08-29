import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { KeyRound } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';
import PageMeta from '../components/ui/PageMeta';
import { resetPassword } from '../services/authService';
import { getErrorMessage } from '../services/api';
import { minLength } from '../utils/validators';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!minLength(form.password, 8)) next.password = 'Password must be at least 8 characters';
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await resetPassword(token, form.password);
      toast.success('Password reset successfully. Please log in.');
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta title="Reset Password" />
      <AuthLayout title="Choose a New Password" subtitle="Enter a new password for your account.">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="password">New Password</label>
            <input id="password" name="password" type="password" value={form.password} onChange={handleChange} className="input" placeholder="At least 8 characters" />
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>
          <div>
            <label className="label" htmlFor="confirmPassword">Confirm Password</label>
            <input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} className="input" placeholder="Re-enter your password" />
            {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Resetting...' : (<><KeyRound className="h-4 w-4" /> Reset Password</>)}
          </button>
        </form>
      </AuthLayout>
    </>
  );
};

export default ResetPassword;
