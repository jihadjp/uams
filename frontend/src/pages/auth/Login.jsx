import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  LogIn,
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { loginApi } from '../../api/authApi';
import { useAuthStore } from '../../store/authStore';
import Loader from '../../components/common/Loader';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [searchParams] = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('expired')) {
      setError('Your session has expired. Please sign in again.');
      toast.error('Session expired', { id: 'session-expired' });
    }
  }, [searchParams]);

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!identifier.trim() || !password) {
      setError('Please enter your University ID or email address and password.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const data = await loginApi({
        identifier: identifier.trim(),
        password,
        rememberMe,
      });

      setAuth(
          {
            id: data.userId,
            name: data.name,
            role: data.role,
            mustChangePassword: data.mustChangePassword,
          },
          data.token
      );

      toast.success(`Welcome back, ${data.name}!`);
      navigate('/');
    } catch (requestError) {
      const message =
          requestError.response?.data?.message ||
          'The University ID/email address or password is incorrect.';

      setError(message);
      toast.error(message, { id: 'login-error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <main className="relative min-h-screen overflow-hidden bg-[#09101F]">
        {/* Modern background */}
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
              animate={{
                x: [0, 40, 0],
                y: [0, 25, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 14,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-emerald-400/15 blur-3xl"
          />

          <motion.div
              animate={{
                x: [0, -35, 0],
                y: [0, -30, 0],
                scale: [1, 1.08, 1],
              }}
              transition={{
                duration: 17,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -bottom-32 -right-32 h-[32rem] w-[32rem] rounded-full bg-indigo-500/20 blur-3xl"
          />
        </div>

        {/* Main login shell */}
        <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 grid min-h-screen w-full overflow-hidden border border-white/10 bg-white/[0.06] shadow-2xl shadow-black/30 backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]"
        >
          {/* Left branding panel */}
          <section className="relative hidden overflow-hidden p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent" />

            <div className="relative z-10">
              {/* Logo */}
              <motion.div
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55 }}
                  className="flex items-center gap-3"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white p-1.5 shadow-xl shadow-black/20">
                  <img
                      src="/images/logo.png"
                      alt="UAMS Logo"
                      className="h-full w-full object-contain"
                  />
                </div>

                <div>
                  <h1 className="text-lg font-extrabold tracking-tight">
                    Royal Bengal University
                  </h1>
                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
                    Academic Management System
                  </p>
                </div>
              </motion.div>

              {/* Brand content */}
              <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.65,
                    delay: 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="mt-24 max-w-lg xl:mt-32"
              >
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-100">
                  <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.9)]" />
                  Digital Service
                </div>

                <h2 className="text-3xl font-black leading-snug tracking-tight xl:text-4xl">
                  Empowering Education,
                  <span className="mt-1.5 block bg-gradient-to-r from-emerald-200 to-cyan-200 bg-clip-text text-transparent">
    Inspiring Excellence.
  </span>
                </h2>

                <p className="mt-6 max-w-md text-base leading-7 text-white/65">
                  A modern and secure platform for students, faculty, and staff
                  to manage university academic services in one place.
                </p>

                <div className="mt-10 space-y-3">
                  {[
                    'Academic records and semester services',
                    'Fast course registration and enrollment',
                    'Secure role-based university access',
                  ].map((feature, index) => (
                      <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.45,
                            delay: 0.3 + index * 0.1,
                          }}
                          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3.5"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-300/15 text-emerald-200">
                          <CheckCircle2 size={17} />
                        </div>

                        <span className="text-sm font-medium text-white/80">
                      {feature}
                    </span>
                      </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            <p className="relative z-10 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
              © {new Date().getFullYear()} · Royal Bengal University
            </p>
          </section>

          {/* Right login form */}
          <section className="relative flex items-center justify-center bg-white/[0.97] px-6 py-12 sm:px-10 lg:bg-white/[0.95]">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#007A55] via-emerald-400 to-indigo-500 lg:hidden" />

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  ...(error ? { x: [0, -6, 6, -4, 4, 0] } : {}),
                }}
                transition={{
                  duration: error ? 0.35 : 0.65,
                  delay: error ? 0 : 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="w-full max-w-sm"
            >
              {/* Mobile logo */}
              <div className="mb-10 flex items-center gap-3 lg:hidden">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0E2547] p-1.5 shadow-lg shadow-slate-900/15">
                  <img
                      src="/images/logo.png"
                      alt="UAMS Logo"
                      className="h-full w-full object-contain"
                  />
                </div>

                <div>
                  <h1 className="font-extrabold tracking-tight text-slate-900">
                    Royal Bengal University
                  </h1>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    University Services
                  </p>
                </div>
              </div>

              {/* Heading */}
              <div className="mb-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#007A55]">
                  <ShieldCheck size={23} />
                </div>

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#007A55]">
                  Secure Access
                </p>

                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Sign in to continue to your academic dashboard.
                </p>
              </div>

              <form onSubmit={handleLogin} noValidate className="space-y-5">
                <AnimatePresence>
                  {error && (
                      <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.25 }}
                          role="alert"
                          aria-live="assertive"
                          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
                      >
                        <AlertCircle size={19} className="mt-0.5 shrink-0" />
                        <span>{error}</span>
                      </motion.div>
                  )}
                </AnimatePresence>

                {/* ID / Email */}
                <div>
                  <label
                      htmlFor="identifier"
                      className="mb-2 block text-xs font-bold text-slate-700"
                  >
                    University ID or Email Address
                  </label>

                  <div className="group relative">
                    <User
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-[#007A55]"
                    />

                    <input
                        id="identifier"
                        type="text"
                        required
                        autoComplete="username"
                        value={identifier}
                        onChange={(event) => {
                          setIdentifier(event.target.value);
                          if (error) setError('');
                        }}
                        placeholder="Enter ID or email address"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-[#007A55] focus:bg-white focus:ring-4 focus:ring-[#007A55]/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label
                        htmlFor="password"
                        className="block text-xs font-bold text-slate-700"
                    >
                      Password
                    </label>

                    <Link
                        to="/forgot-password"
                        className="text-xs font-bold text-[#0B5EA8] transition hover:text-[#007A55]"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="group relative">
                    <Lock
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-[#007A55]"
                    />

                    <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) => {
                          setPassword(event.target.value);
                          if (error) setError('');
                        }}
                        placeholder="Enter your password"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-12 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-[#007A55] focus:bg-white focus:ring-4 focus:ring-[#007A55]/10"
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#007A55]/30"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <label className="flex w-fit cursor-pointer items-center gap-2.5 text-xs font-semibold text-slate-600">
                  <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-[#007A55] focus:ring-[#007A55]"
                  />
                  Remember me on this device
                </label>

                {/* Submit */}
                <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={isLoading ? {} : { scale: 1.015 }}
                    whileTap={isLoading ? {} : { scale: 0.985 }}
                    className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#007A55] to-[#00956A] py-3.5 text-sm font-extrabold text-white shadow-lg shadow-emerald-700/25 transition disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="absolute inset-0 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition duration-700 group-hover:translate-x-[120%]" />

                  {isLoading ? (
                      <span className="relative">
                    <Loader size="sm" color="white" />
                  </span>
                  ) : (
                      <>
                        <span className="relative">Sign In to Portal</span>
                        <LogIn
                            size={18}
                            className="relative transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </>
                  )}
                </motion.button>
              </form>

              <p className="mt-9 text-center text-xs leading-6 text-slate-400">
                Need access or support? Contact your department office or system
                administrator.
              </p>
            </motion.div>
          </section>
        </motion.div>
      </main>
  );
};

export default Login;
