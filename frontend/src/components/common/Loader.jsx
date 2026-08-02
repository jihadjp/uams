import { motion } from 'framer-motion';

const Loader = ({ size = 'md', color = 'emerald' }) => {
    const sizes = {
        sm: 'w-5 h-5 border-2',
        md: 'w-8 h-8 border-[3px]',
        lg: 'w-12 h-12 border-4',
    };

    // emerald = default for pages, white = for buttons like Login's Sign In
    const colors = {
        emerald: 'border-[#007A55]/20 border-t-[#007A55] dark:border-white/10 dark:border-t-emerald-400',
        white: 'border-white/30 border-t-white',
        slate: 'border-slate-200 border-t-slate-700 dark:border-white/10 dark:border-t-white',
    };

    return (
        <div className="flex items-center justify-center">
            <motion.div
                className={`${sizes[size]} ${colors[color] || colors.emerald} rounded-full`}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
        </div>
    );
};

export default Loader;
