import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  KeyRound,
  Lock,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  BookOpen,
  CalendarCheck,
} from 'lucide-react';
import { changePassword } from '../../api/authApi';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const features = [
  { icon: BookOpen, text: 'Plan and manage semester course offerings' },
  { icon: CalendarCheck, text: 'Track registration and enrollment in real time' },
  { icon: ShieldCheck, text: 'Secure, role-based access for staff and faculty' },
];

const formContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const formItem = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const featureContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.4 },
  },
};

const featureItem = {
  hidden: { opacity: 0, x: -16 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// Password field matched to Login page design language
const PasswordField = ({
                         id,
                         label,
                         icon: Icon,
                         placeholder,
                         registration,
                         error,
                         focusedField,
                         setFocusedField,
                       }) => {
  const [show, setShow] = useState(false);
  const isFocused = focusedField === id;

  return (
      <motion.div variants={formItem} className="space-y-1.5">
        <label htmlFor={id} className="mb-2 block text-xs font-bold text-slate-700">
          {label}
        </label>
        <motion.div
            animate={{
              boxShadow: isFocused
                  ? '0 0 0 4px rgba(0, 122, 85, 0.12)'
                  : '0 0 0 0px rgba(0, 122, 85, 0)',
            }}
            transition={{ duration: 0.25 }}
            className={`group relative rounded-2xl ${error ? 'ring-2 ring-red-200' : ''}`}
        >
          <Icon
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-[#007A55]"
          />
          <input
              id={id}
              type={show ? 'text' : 'password'}
              autoComplete="new-password"
              onFocus={() => setFocusedField(id)}
              onBlur={() => setFocusedField(null)}
              placeholder={placeholder}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-12 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-[#007A55] focus:bg-white focus:ring-4 focus:ring-[#007A55]/10"
              {...registration}
          />
          <button
              type="button"
              onClick={() => setShow(!show)}
              aria-label={show ? 'Hide password' : 'Show password'}
              className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#007A55]/30"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                  key={show ? 'hide' : 'show'}
                  initial={{ opacity: 0, rotate: -12 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 12 }}
                  transition={{ duration: 0.15 }}
                  className="flex"
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </motion.div>
        <AnimatePresence>
          {error && (
              <motion.p
                  initial={{ opacity: 0, y: -4, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-red-600"
              >
                <AlertCircle size={12} className="shrink-0" />
                {error}
              </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
  );
};

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();
  const setPasswordChanged = useAuthStore((state) => state.setPasswordChanged);
  const user = useAuthStore((state) => state.user);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const newPassword = watch('newPassword');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password updated successfully!');
      setPasswordChanged();
      const root = user?.role?.toLowerCase() || '';
      navigate(`/${root}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
      <main className="relative min-h-screen overflow-hidden bg-[#09101F]">
        {/* Same background as Login */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(16,185,129,0.22),transparent_30%),radial-gradient(circle_at_88%_78%,rgba(79,70,229,0.28),transparent_35%),linear-gradient(135deg,#09101f_0%,#101a35_52%,#09101f_100%)]" />
          <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                    'linear-gradient(rgba(255,255,255,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.35) 1px, transparent 1px)',
                backgroundSize: '52px 52px',
              }}
          />
          <motion.div
              animate={{ x: [0, 40, 0], y: [0, 25, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-emerald-400/15 blur-3xl"
          />
          <motion.div
              animate={{ x: [0, -35, 0], y: [0, -30, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-32 -right-32 h-[32rem] w-[32rem] rounded-full bg-indigo-500/20 blur-3xl"
          />
        </div>

        {/* Shell */}
        <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 grid min-h-screen w-full overflow-hidden border border-white/10 bg-white/[0.06] shadow-2xl shadow-black/30 backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]"
        >
          {/* Left panel */}
          <section className="relative hidden overflow-hidden p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent" />
            <div className="relative z-10">
              <motion.div
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55 }}
                  className="flex items-center gap-3"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white p-1.5 shadow-xl shadow-black/20">
                  <img src="/images/logo.png" alt="RBU Logo" className="h-full w-full object-contain" />
                </div>
                <div>
                  <h1 className="text-lg font-extrabold tracking-tight">Royal Bengal University</h1>
                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
                    Academic Management System
                  </p>
                </div>
              </motion.div>

              <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-24 max-w-lg xl:mt-32"
              >
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-100">
                  <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.9)]" />
                  Account Security
                </div>

                <h2 className="text-5xl font-black leading-[1.08] tracking-tight xl:text-6xl">
                  One more step for
                  <span className="mt-2 block bg-gradient-to-r from-emerald-200 to-cyan-200 bg-clip-text text-transparent">
                  your security.
                </span>
                </h2>

                <p className="mt-6 max-w-md text-base leading-7 text-white/65">
                  For your protection, you must set a new password before accessing your academic portal.
                </p>

                <motion.div
                    variants={featureContainer}
                    initial="hidden"
                    animate="show"
                    className="mt-10 space-y-3"
                >
                  {features.map((f, i) => (
                      <motion.div
                          key={i}
                          variants={featureItem}
                          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3.5"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-300/15 text-emerald-200">
                          <f.icon size={17} />
                        </div>
                        <span className="text-sm font-medium text-white/80">{f.text}</span>
                      </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>

            <p className="relative z-10 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
              © {new Date().getFullYear()} · Royal Bengal University
            </p>
          </section>

          {/* Right panel */}
          <section className="relative flex items-center justify-center bg-white/[0.97] px-6 py-12 sm:px-10 lg:bg-white/[0.95]">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#007A55] via-emerald-400 to-indigo-500 lg:hidden" />

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-sm"
            >
              {/* Mobile logo */}
              <div className="mb-10 flex items-center gap-3 lg:hidden">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0E2547] p-1.5 shadow-lg shadow-slate-900/15">
                  <img src="/images/logo.png" alt="RBU Logo" className="h-full w-full object-contain" />
                </div>
                <div>
                  <h1 className="font-extrabold tracking-tight text-slate-900">Royal Bengal University</h1>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">University Services</p>
                </div>
              </div>

              {/* Heading */}
              <div className="mb-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#007A55]">
                  <ShieldCheck size={23} />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#007A55]">Security Update</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                  Security update required
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  For your security, set a new password before continuing.
                </p>
              </div>

              <motion.form
                  onSubmit={handleSubmit(onSubmit)}
                  variants={formContainer}
                  initial="hidden"
                  animate="show"
                  className="space-y-5"
                  noValidate
              >
                <PasswordField
                    id="currentPassword"
                    label="Current Password"
                    icon={Lock}
                    placeholder="Enter temporary password"
                    registration={register('currentPassword', { required: 'This field is required' })}
                    error={errors.currentPassword?.message}
                    focusedField={focusedField}
                    setFocusedField={setFocusedField}
                />

                <PasswordField
                    id="newPassword"
                    label="New Password"
                    icon={KeyRound}
                    placeholder="Minimum 8 characters"
                    registration={register('newPassword', {
                      required: 'This field is required',
                      minLength: { value: 8, message: 'Minimum 8 characters' },
                    })}
                    error={errors.newPassword?.message}
                    focusedField={focusedField}
                    setFocusedField={setFocusedField}
                />

                <PasswordField
                    id="confirmPassword"
                    label="Confirm New Password"
                    icon={ShieldCheck}
                    placeholder="Repeat new password"
                    registration={register('confirmPassword', {
                      required: 'This field is required',
                      validate: (value) => value === newPassword || 'Passwords do not match',
                    })}
                    error={errors.confirmPassword?.message}
                    focusedField={focusedField}
                    setFocusedField={setFocusedField}
                />

                <motion.button
                    variants={formItem}
                    whileHover={loading ? {} : { scale: 1.015 }}
                    whileTap={loading ? {} : { scale: 0.985 }}
                    disabled={loading}
                    type="submit"
                    className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#007A55] to-[#00956A] py-3.5 text-sm font-extrabold text-white shadow-lg shadow-emerald-700/25 transition disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="absolute inset-0 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition duration-700 group-hover:translate-x-[120%]" />
                  <AnimatePresence mode="wait" initial={false}>
                    {loading ? (
                        <motion.span
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="relative flex items-center gap-2"
                        >
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                          Updating...
                        </motion.span>
                    ) : (
                        <motion.span
                            key="idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="relative flex items-center gap-2"
                        >
                          Update & Continue
                          <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                        </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.form>

              <p className="mt-9 text-center text-xs leading-6 text-slate-400">
                This step is required before accessing your account.
              </p>
            </motion.div>
          </section>
        </motion.div>
      </main>
  );
};

export default ChangePassword;
