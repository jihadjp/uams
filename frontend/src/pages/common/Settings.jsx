import { useState } from 'react';
import {
  Lock,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Settings as SettingsIcon,
  ShieldAlert,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { changePassword } from '../../api/profileApi';
import toast from 'react-hot-toast';

const Settings = () => {
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
        newPassword: passwords.new,
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
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-[#007A55] dark:text-emerald-300 border border-emerald-100 dark:border-emerald-500/20">
            <SettingsIcon size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Account Settings</h1>
            <p className="text-sm font-medium text-slate-500 dark:text-white/40 mt-0.5">
              Manage your security and account preferences
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Password Section */}
          <Card title="Security & Password" icon={KeyRound}>
            <p className="text-xs font-medium text-slate-500 dark:text-white/40 mb-6 leading-relaxed">
              Update your password regularly to keep your account secure.
            </p>
            <form onSubmit={handleChangePassword} className="space-y-5">
              <Input
                  label="Current Password"
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  icon={Lock}
                  placeholder="••••••••"
                  required
              />
              <Input
                  label="New Password"
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  icon={KeyRound}
                  placeholder="••••••••"
                  required
              />
              <Input
                  label="Confirm New Password"
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
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
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Email Verification</p>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">Verified</p>
                </div>
                <CheckCircle2 size={20} className="text-emerald-500" />
              </div>
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/[0.06]">
                <Button variant="secondary" className="w-full opacity-60 cursor-not-allowed" disabled>
                  Enable 2FA (Coming Soon)
                </Button>
              </div>
            </Card>

            <Card className="bg-red-50/60 dark:bg-red-500/10 border-red-100 dark:border-red-500/20">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-300 mb-4">
                <AlertTriangle size={18} />
                <h4 className="font-bold text-sm tracking-tight">Danger Zone</h4>
              </div>
              <p className="text-xs font-medium text-red-600/70 dark:text-red-300/60 mb-6 leading-relaxed">
                Once you deactivate your account, you will lose access to all your academic data, results, and records. This action is
                not reversible.
              </p>
              <button
                  className="w-full py-3 px-4 bg-white dark:bg-[#0B1225] border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-300 rounded-2xl text-sm font-bold hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors shadow-sm"
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
