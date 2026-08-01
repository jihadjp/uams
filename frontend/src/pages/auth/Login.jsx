import { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { User, Lock, LogIn, GraduationCap, Eye, EyeOff, AlertCircle, CheckCircle2, ShieldCheck, BookOpen, CalendarCheck } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginApi } from '../../api/authApi';
import { useAuthStore } from '../../store/authStore';
import Loader from '../../components/common/Loader';

const features = [
  { icon: BookOpen, text: 'Plan and manage semester course offerings' },
  { icon: CalendarCheck, text: 'Track registration and enrollment in real time' },
  { icon: ShieldCheck, text: 'Secure, role-based access for staff and faculty' },
];

// Staggered container for the right-hand form column
const formContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
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

// Staggered container for the left brand panel features
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

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  // Mouse-tracked parallax for the left brand panel — cursor position drives
  // multiple depth layers (blobs move most, logo/text move least) for a
  // subtle 3D "living" feel instead of a flat static panel.
  const panelRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 120, damping: 20, mass: 0.4 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Depth layers: bigger multiplier = moves more = feels "closer" to the cursor
  const blob1X = useTransform(smoothX, (v) => v * 28);
  const blob1Y = useTransform(smoothY, (v) => v * 22);
  const blob2X = useTransform(smoothX, (v) => v * -22);
  const blob2Y = useTransform(smoothY, (v) => v * -18);
  const contentX = useTransform(smoothX, (v) => v * 8);
  const contentY = useTransform(smoothY, (v) => v * 6);
  const logoRotateY = useTransform(smoothX, (v) => v * 10);
  const logoRotateX = useTransform(smoothY, (v) => v * -10);

  const handlePanelMouseMove = (e) => {
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;
    // Normalize to -0.5..0.5 range relative to panel center
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(relX);
    mouseY.set(relY);
  };

  const handlePanelMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = await loginApi({ identifier, password, rememberMe });
      setAuth({
        id: data.userId,
        name: data.name,
        role: data.role,
        mustChangePassword: data.mustChangePassword
      }, data.token);

      toast.success(`Welcome back, ${data.name}!`);
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid ID or password';
      setError(message);
      toast.error(message, { id: 'login-error' });
    } finally {
      setIsLoading(false);
    }
  };

  const shakeAnimation = {
    x: [0, -8, 8, -8, 8, 0],
    transition: { duration: 0.4 }
  };

  return (
    <div className="min-h-screen flex bg-white overflow-hidden">
      {/* Left brand panel — desktop only */}
      <div
        ref={panelRef}
        onMouseMove={handlePanelMouseMove}
        onMouseLeave={handlePanelMouseLeave}
        className="hidden lg:flex lg:w-[45%] xl:w-[40%] relative bg-[#2D2A4F] overflow-hidden"
        style={{ perspective: 1000 }}
      >
        {/* Subtle dot-grid texture, not busy enough to fight with text contrast */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* Ambient floating gradient blobs — slow, continuous drift for a "living" premium feel */}
        {/* Parallax wrapper (cursor-driven) → ambient wrapper (slow idle drift) → visible blob */}
        <motion.div className="absolute -top-24 -right-24 w-96 h-96" style={{ x: blob1X, y: blob1Y }}>
          <motion.div
            className="w-full h-full bg-primary-500/10 rounded-full blur-3xl"
            animate={{ x: [0, 24, 0], y: [0, 18, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
        <motion.div className="absolute -bottom-32 -left-16 w-96 h-96" style={{ x: blob2X, y: blob2Y }}>
          <motion.div
            className="w-full h-full bg-primary-500/10 rounded-full blur-3xl"
            animate={{ x: [0, -20, 0], y: [0, -14, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
        </motion.div>

        <motion.div
          className="relative z-10 flex flex-col justify-between p-12 xl:p-16 text-white w-full"
          style={{ x: contentX, y: contentY }}
        >
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center space-x-3"
          >
            <motion.div
              className="w-11 h-11 bg-white rounded-xl flex items-center justify-center p-1.5 shrink-0"
              initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1, type: 'spring', stiffness: 200, damping: 16 }}
              style={{ rotateX: logoRotateX, rotateY: logoRotateY, transformStyle: 'preserve-3d' }}
            >
              <img src="/images/logo.png" alt="UAMS Logo" className="w-full h-full object-contain" />
            </motion.div>
            <span className="text-lg font-black tracking-tight">UAMS Portal</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8 max-w-sm"
          >
            <h1 className="text-4xl font-black leading-tight tracking-tight">
              University, in one place.
            </h1>
            <motion.div
              variants={featureContainer}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              {features.map((f, i) => (
                <motion.div key={i} variants={featureItem} className="flex items-start space-x-3">
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5"
                  >
                    <f.icon size={16} className="text-primary-300" />
                  </motion.div>
                  <p className="text-sm font-medium text-white/70 leading-relaxed pt-1">{f.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-[11px] font-bold text-white/40 uppercase tracking-[0.2em]"
          >
            © {new Date().getFullYear()} UAMS · University Academic Management System
          </motion.p>
        </motion.div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={error ? { ...shakeAnimation, opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          {/* Mobile-only brand header, since the left panel is hidden below lg */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex lg:hidden flex-col items-center text-center mb-10"
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1, type: 'spring', stiffness: 200, damping: 16 }}
              className="w-16 h-16 mb-4 flex items-center justify-center p-1.5 bg-[#2D2A4F] rounded-2xl shadow-sm"
            >
              <img src="/images/logo.png" alt="UAMS Logo" className="w-full h-full object-contain" />
            </motion.div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">UAMS</h1>
            <p className="text-gray-400 mt-1 text-xs font-bold uppercase tracking-[0.2em]">University Portal</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="hidden lg:block mb-10"
          >
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Welcome back</h2>
            <p className="text-gray-500 text-sm mt-1.5">Sign in with your university ID to continue.</p>
          </motion.div>

          <motion.form
            onSubmit={handleLogin}
            variants={formContainer}
            initial="hidden"
            animate="show"
            className="space-y-5"
            noValidate
          >
            <motion.div variants={formItem} className="space-y-1.5">
              <label htmlFor="identifier" className="block text-xs font-bold text-gray-700 ml-0.5">(ID / Email)
              </label>
              <motion.div
                animate={{
                  boxShadow: focusedField === 'identifier'
                    ? '0 0 0 4px rgba(99, 91, 255, 0.12)'
                    : '0 0 0 0px rgba(99, 91, 255, 0)',
                }}
                transition={{ duration: 0.25 }}
                className={`relative rounded-xl ${error ? 'ring-2 ring-red-200' : ''}`}
              >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input
                  id="identifier"
                  type="text"
                  required
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  onFocus={() => setFocusedField('identifier')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="ID No or Email Address"
                  className="block w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all outline-none text-sm font-medium"
                />
              </motion.div>
            </motion.div>

            <motion.div variants={formItem} className="space-y-1.5">
              <div className="flex items-center justify-between ml-0.5">
                <label htmlFor="password" className="block text-xs font-bold text-gray-700">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <motion.div
                animate={{
                  boxShadow: focusedField === 'password'
                    ? '0 0 0 4px rgba(99, 91, 255, 0.12)'
                    : '0 0 0 0px rgba(99, 91, 255, 0)',
                }}
                transition={{ duration: 0.25 }}
                className={`relative rounded-xl ${error ? 'ring-2 ring-red-200' : ''}`}
              >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  className="block w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all outline-none text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={showPassword ? 'hide' : 'show'}
                      initial={{ opacity: 0, rotate: -45 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 45 }}
                      transition={{ duration: 0.15 }}
                      className="flex"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </motion.div>
            </motion.div>

            <motion.label variants={formItem} className="flex items-center space-x-2.5 cursor-pointer group w-fit">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-5 h-5 border-2 border-gray-300 rounded-md peer-checked:bg-primary-600 peer-checked:border-primary-600 transition-all" />
                <motion.span
                  initial={false}
                  animate={{ scale: rememberMe ? 1 : 0, opacity: rememberMe ? 1 : 0 }}
                  transition={{ duration: 0.2, type: 'spring', stiffness: 400, damping: 20 }}
                  className="absolute left-[5px] text-white"
                >
                  <CheckCircle2 size={12} />
                </motion.span>
              </div>
              <span className="text-xs font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Remember me on this device</span>
            </motion.label>

            <motion.button
              variants={formItem}
              whileHover={{ scale: 1.015, boxShadow: '0 12px 28px -8px rgba(99, 91, 255, 0.45)' }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              type="submit"
              className="relative w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-black rounded-xl shadow-lg shadow-primary-600/20 flex items-center justify-center space-x-2.5 transition-colors disabled:opacity-70 group overflow-hidden"
            >
              {/* Diagonal shine sweep on hover, subtle premium touch */}
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12"
                initial={{ x: '-120%' }}
                whileHover={{ x: '120%' }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
              />
              <AnimatePresence mode="wait" initial={false}>
                {isLoading ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative z-10"
                  >
                    <Loader size="sm" color="white" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative z-10 flex items-center space-x-2.5"
                  >
                    <span className="text-sm">Sign In</span>
                    <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.form>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="mt-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2.5 text-red-700 text-xs font-bold"
              >
                <motion.span
                  animate={{ rotate: [0, -10, 10, -6, 6, 0] }}
                  transition={{ duration: 0.5 }}
                  className="shrink-0"
                >
                  <AlertCircle size={18} />
                </motion.span>
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 text-center text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed"
          >
            Contact department or system admin<br />for account creation.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;