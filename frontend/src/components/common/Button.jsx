import { motion } from 'framer-motion';

const Button = ({
                    children,
                    variant = 'primary',
                    size = 'md',
                    isLoading = false,
                    disabled = false,
                    className = '',
                    ...props
                }) => {
    const variants = {
        // Matches Login's Sign In button
        primary:
            'bg-gradient-to-r from-[#007A55] to-[#00956A] text-white hover:from-[#006747] hover:to-[#00875D] shadow-lg shadow-emerald-700/25 border border-emerald-600/10',
        secondary:
            'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/[0.06] dark:text-white/70 dark:hover:bg-white/[0.1] border border-transparent dark:border-white/[0.06]',
        danger:
            'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 border border-red-500/10',
        outline:
            'border-2 border-[#007A55] text-[#007A55] hover:bg-emerald-50 dark:hover:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-400/40 bg-transparent',
        ghost:
            'bg-transparent text-slate-600 hover:bg-slate-100 dark:text-white/60 dark:hover:bg-white/[0.06]',
    };

    const sizes = {
        sm: 'px-3.5 py-2 text-xs font-bold',
        md: 'px-5 py-2.5 text-sm font-bold',
        lg: 'px-8 py-3.5 text-sm font-extrabold',
    };

    return (
        <motion.button
            whileHover={disabled || isLoading ? {} : { scale: 1.015 }}
            whileTap={disabled || isLoading ? {} : { scale: 0.985 }}
            disabled={disabled || isLoading}
            className={`relative inline-flex items-center justify-center rounded-2xl font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden group ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {/* Shine effect for primary - same as Login */}
            {variant === 'primary' && (
                <span className="absolute inset-0 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition duration-700 group-hover:translate-x-[120%] pointer-events-none" />
            )}

            {isLoading ? (
                <div className="flex items-center gap-2.5 relative">
                    <svg
                        className="animate-spin h-4 w-4 text-current"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    <span>Loading...</span>
                </div>
            ) : (
                <span className="relative flex items-center gap-2">{children}</span>
            )}
        </motion.button>
    );
};

export default Button;
