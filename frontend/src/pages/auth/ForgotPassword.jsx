import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  ChevronLeft,
  CheckCircle2,
  Send,
  ShieldCheck,
  BookOpen,
  CalendarCheck,
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

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

const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
      <main className="relative min-h-screen overflow-hidden bg-[#09101F]">
        {/* Modern background - Same as Login */}
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

        {/* Main shell - Same as Login */}
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
                  <h1 className="text-lg font-extrabold tracking-tight">Royal Bengal University</h1>
                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">
                    Academic Management System
                  </p>
                </div>
              </motion.div>

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
                  Account Recovery
                </div>

                <h2 className="text-5xl font-black leading-[1.08] tracking-tight xl:text-6xl">
                  Locked out?
                  <span className="mt-2 block bg-gradient-to-r from-emerald-200 to-cyan-200 bg-clip-text text-transparent">
                  Let&apos;s fix that.
                </span>
                </h2>

                <p className="mt-6 max-w-md text-base leading-7 text-white/65">
                  Don&apos;t worry. It happens. Enter your University ID or email and
                  we&apos;ll send you secure instructions to reset your password.
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
                        <span className="text-sm font-medium text-white/80">
                      {f.text}
                    </span>
                      </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>

            <p className="relative z-10 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
              © {new Date().getFullYear()} · Royal Bengal University
            </p>
          </section>

          {/* Right form panel - Same card style as Login */}
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
                  <img
                      src="/images/logo.png"
                      alt="UAMS Logo"
                      className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="font-extrabold tracking-tight text-slate-900">Royal Bengal University</h1>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    University Services
                  </p>
                </div>
              </div>

              <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
              >
                <Link
                    to="/login"
                    className="inline-flex items-center text-slate-400 hover:text-slate-700 mb-6 text-xs font-bold uppercase tracking-widest transition-colors group"
                >
                  <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                  Back to Login
                </Link>
              </motion.div>

              {/* Heading */}
              <div className="mb-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#007A55]">
                  <ShieldCheck size={23} />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#007A55]">
                  Account Recovery
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                  Forgot your password?
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Enter your ID or email and we&apos;ll send reset instructions.
                </p>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                {!isSubmitted ? (
                    <motion.form
                        key="form"
                        onSubmit={handleSubmit}
                        variants={formContainer}
                        initial="hidden"
                        animate="show"
                        exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
                        className="space-y-5"
                        noValidate
                    >
                      <motion.div variants={formItem}>
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
                              onChange={(e) => setIdentifier(e.target.value)}
                              placeholder="Enter ID or email address"
                              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-[#007A55] focus:bg-white focus:ring-4 focus:ring-[#007A55]/10"
                          />
                        </div>
                      </motion.div>

                      <motion.button
                          variants={formItem}
                          whileHover={isLoading ? {} : { scale: 1.015 }}
                          whileTap={isLoading ? {} : { scale: 0.985 }}
                          disabled={isLoading}
                          type="submit"
                          className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#007A55] to-[#00956A] py-3.5 text-sm font-extrabold text-white shadow-lg shadow-emerald-700/25 transition disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <span className="absolute inset-0 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition duration-700 group-hover:translate-x-[120%]" />

                        <AnimatePresence mode="wait" initial={false}>
                          {isLoading ? (
                              <motion.span
                                  key="loading"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="relative flex items-center gap-2"
                              >
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                Sending...
                              </motion.span>
                          ) : (
                              <motion.span
                                  key="idle"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="relative flex items-center gap-2"
                              >
                                Reset Password
                                <Send size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                              </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    </motion.form>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.96, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="text-center"
                    >
                      <motion.div
                          initial={{ scale: 0, rotate: -20 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            duration: 0.55,
                            type: 'spring',
                            stiffness: 220,
                            damping: 14,
                          }}
                          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-green-200 bg-green-50 text-green-600"
                      >
                        <CheckCircle2 size={32} />
                      </motion.div>
                      <h3 className="text-xl font-black tracking-tight text-slate-900">Request sent!</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        You should receive an email or SMS shortly with further instructions to reset your
                        password.
                      </p>
                      <motion.button
                          whileHover={{ scale: 1.015 }}
                          whileTap={{ scale: 0.985 }}
                          onClick={() => navigate('/login')}
                          className="mt-8 flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 py-3.5 text-sm font-extrabold text-slate-700 transition hover:bg-slate-100"
                      >
                        Back to Sign In
                      </motion.button>
                    </motion.div>
                )}
              </AnimatePresence>

              <p className="mt-9 text-center text-xs leading-6 text-slate-400">
                Contact department or system admin
                <br />
                for account creation.
              </p>
            </motion.div>
          </section>
        </motion.div>
      </main>
  );
};

export default ForgotPassword;
