import { useState } from 'react';
import {
  Lock,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Settings as SettingsIcon,
  ShieldAlert
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { changePassword } from '../../api/profileApi';
import toast from 'react-hot-toast';

const Settings = () => {
  // Password states
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [passLoading, setPassLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      return toast.error('Passwords do not match');
    }
    if (passwords.new.length < 6) {
      return toast.error('New password must be at least 6 characters long');
    }

    setPassLoading(true);
    try {
      await changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.new
      });
      toast.success('Password changed successfully');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center space-x-4 mb-2">
        <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-2xl text-primary-600">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Account Settings</h1>
          <p className="text-sm text-gray-500">Manage your security and account preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Password Section */}
        <Card title="Security & Password" icon={KeyRound}>
          <p className="text-xs text-gray-500 mb-6">
            Update your password regularly to keep your account secure.
          </p>
          <form onSubmit={handleChangePassword} className="space-y-5">
            <Input
              label="Current Password"
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords({...passwords, current: e.target.value})}
              icon={Lock}
              placeholder="••••••••"
              required
            />
            <Input
              label="New Password"
              type="password"
              value={passwords.new}
              onChange={(e) => setPasswords({...passwords, new: e.target.value})}
              icon={KeyRound}
              placeholder="••••••••"
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
              icon={CheckCircle2}
              placeholder="••••••••"
              required
            />
            <Button type="submit" isLoading={passLoading} className="w-full">
              Update Password
            </Button>
          </form>
        </Card>

        {/* Account Actions Section */}
        <div className="space-y-8">
          <Card title="Two-Factor Authentication" icon={ShieldAlert}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Email Verification</p>
                <p className="text-xs text-green-600 font-medium">Verified</p>
              </div>
              <CheckCircle2 size={20} className="text-green-500" />
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
              <Button variant="secondary" className="w-full opacity-50 cursor-not-allowed" disabled>
                Enable 2FA (Coming Soon)
              </Button>
            </div>
          </Card>

          <Card className="bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20">
            <div className="flex items-center space-x-2 text-red-600 mb-4">
              <AlertTriangle size={18} />
              <h4 className="font-bold text-sm">Danger Zone</h4>
            </div>
            <p className="text-xs text-red-500/70 mb-6">
              Once you deactivate your account, you will lose access to all your academic data, results, and records. This action is not reversible.
            </p>
            <button
              className="w-full py-3 px-4 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900/30 text-red-600 rounded-2xl text-sm font-bold hover:bg-red-50 transition-colors shadow-sm"
              onClick={() => toast.error('Please contact the Registrar Office for account deactivation.')}
            >
              Request Account Deactivation
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
