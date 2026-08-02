import { motion } from 'framer-motion';
import { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const Input = forwardRef(({ label, error, icon: Icon, className = '', type = 'text', ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
      <div className={`w-full space-y-1.5 ${className}`}>
        {label && (
            <label className="mb-2 block text-xs font-bold text-slate-700 dark:text-white/70">
              {label}
            </label>
        )}
        <div className="group relative">
          {Icon && (
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30 transition-colors group-focus-within:text-[#007A55]">
                <Icon size={18} />
              </div>
          )}
          <motion.input
              ref={ref}
              type={inputType}
              className={`block w-full rounded-2xl border bg-slate-50 dark:bg-white/[0.06] py-3.5 text-sm font-medium text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-white/30 hover:border-slate-300 dark:hover:border-white/15 focus:bg-white dark:focus:bg-[#0B1225] focus:ring-4
            ${Icon ? 'pl-12' : 'pl-4'} ${isPassword ? 'pr-12' : 'pr-4'}
            ${
                  error
                      ? 'border-red-300 bg-red-50/50 dark:bg-red-500/10 dark:border-red-500/30 focus:border-red-400 focus:ring-red-500/10'
                      : 'border-slate-200 dark:border-white/10 focus:border-[#007A55] focus:ring-[#007A55]/10'
              }`}
              {...props}
          />
          {isPassword && (
              <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center rounded-xl text-slate-400 dark:text-white/30 transition hover:bg-slate-100 dark:hover:bg-white/[0.08] hover:text-slate-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-[#007A55]/20"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
          )}
        </div>
        {error && (
            <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400"
            >
              <AlertCircle size={12} className="shrink-0" />
              {error}
            </motion.p>
        )}
      </div>
  );
});

Input.displayName = 'Input';

export default Input;
