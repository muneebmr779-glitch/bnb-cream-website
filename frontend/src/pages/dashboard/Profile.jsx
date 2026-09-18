import { useState } from 'react';
import toast from 'react-hot-toast';
import { Save, KeyRound } from 'lucide-react';
import PageMeta from '../../components/ui/PageMeta';
import useAuth from '../../hooks/useAuth';
import { updateProfile, updatePassword } from '../../services/authService';
import { getErrorMessage } from '../../services/api';
import { minLength, required } from '../../utils/validators';

const Profile = () => {
  const { user, updateUserData } = useAuth();
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [profileErrors, setProfileErrors] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!required(profileForm.name)) next.name = 'Name is required';
    if (!required(profileForm.phone)) next.phone = 'Phone is required';
    setProfileErrors(next);
    if (Object.keys(next).length) return;

    setSavingProfile(true);
    try {
      const res = await updateProfile(profileForm);
      updateUserData(res.user);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!required(passwordForm.currentPassword)) next.currentPassword = 'Current password is required';
    if (!minLength(passwordForm.newPassword, 8)) next.newPassword = 'New password must be at least 8 characters';
    if (passwordForm.confirmPassword !== passwordForm.newPassword) next.confirmPassword = 'Passwords do not match';
    setPasswordErrors(next);
    if (Object.keys(next).length) return;

    setSavingPassword(true);
    try {
      await updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password updated successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <>
      <PageMeta title="My Profile" />
      <h1 className="font-display text-2xl font-bold">My Profile</h1>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <form onSubmit={handleProfileSubmit} className="card space-y-4 p-6">
          <h2 className="font-display text-lg font-bold">Personal Information</h2>
          <div>
            <label className="label" htmlFor="name">Full Name</label>
            <input
              id="name"
              value={profileForm.name}
              onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
              className="input"
            />
            {profileErrors.name && <p className="field-error">{profileErrors.name}</p>}
          </div>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" value={user?.email} disabled className="input cursor-not-allowed opacity-60" />
          </div>
          <div>
            <label className="label" htmlFor="phone">Phone</label>
            <input
              id="phone"
              value={profileForm.phone}
              onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
              className="input"
            />
            {profileErrors.phone && <p className="field-error">{profileErrors.phone}</p>}
          </div>
          <button type="submit" disabled={savingProfile} className="btn-primary">
            {savingProfile ? 'Saving...' : (<><Save className="h-4 w-4" /> Save Changes</>)}
          </button>
        </form>

        <form onSubmit={handlePasswordSubmit} className="card space-y-4 p-6">
          <h2 className="font-display text-lg font-bold">Change Password</h2>
          <div>
            <label className="label" htmlFor="currentPassword">Current Password</label>
            <input
              id="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
              className="input"
            />
            {passwordErrors.currentPassword && <p className="field-error">{passwordErrors.currentPassword}</p>}
          </div>
          <div>
            <label className="label" htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
              className="input"
            />
            {passwordErrors.newPassword && <p className="field-error">{passwordErrors.newPassword}</p>}
          </div>
          <div>
            <label className="label" htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
              className="input"
            />
            {passwordErrors.confirmPassword && <p className="field-error">{passwordErrors.confirmPassword}</p>}
          </div>
          <button type="submit" disabled={savingPassword} className="btn-secondary">
            {savingPassword ? 'Updating...' : (<><KeyRound className="h-4 w-4" /> Update Password</>)}
          </button>
        </form>
      </div>
    </>
  );
};

export default Profile;
