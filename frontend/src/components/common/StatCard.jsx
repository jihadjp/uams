import { motion, animate } from 'framer-motion';
import { useEffect, useState } from 'react';
import Card from './Card';

const StatCard = ({ icon: Icon, label, value, color = 'primary', delay = 0, prefix = '', suffix = '', onClick }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const controls = animate(0, value, {
            duration: 1.6,
            delay: delay,
            ease: [0.22, 1, 0.36, 1],
            onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
        });
        return () => controls.stop();
    }, [value, delay]);

    const colorVariants = {
        primary: {
            icon: 'text-[#007A55] bg-emerald-50 dark:bg-emerald-500/15 dark:text-emerald-300 border-emerald-100 dark:border-emerald-500/20',
            border: 'border-[#007A55]',
            gradient: 'from-white to-emerald-50/50 dark:from-[#0B1225] dark:to-emerald-500/[0.07]',
        },
        success: {
            icon: 'text-green-600 bg-green-50 dark:bg-green-500/15 dark:text-green-300 border-green-100 dark:border-green-500/20',
            border: 'border-green-500',
            gradient: 'from-white to-green-50/50 dark:from-[#0B1225] dark:to-green-500/[0.07]',
        },
        warning: {
            icon: 'text-amber-600 bg-amber-50 dark:bg-amber-500/15 dark:text-amber-300 border-amber-100 dark:border-amber-500/20',
            border: 'border-amber-500',
            gradient: 'from-white to-amber-50/50 dark:from-[#0B1225] dark:to-amber-500/[0.07]',
        },
        danger: {
            icon: 'text-red-600 bg-red-50 dark:bg-red-500/15 dark:text-red-300 border-red-100 dark:border-red-500/20',
            border: 'border-red-500',
            gradient: 'from-white to-red-50/50 dark:from-[#0B1225] dark:to-red-500/[0.07]',
        },
        info: {
            icon: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/15 dark:text-indigo-300 border-indigo-100 dark:border-indigo-500/20',
            border: 'border-indigo-500',
            gradient: 'from-white to-indigo-50/50 dark:from-[#0B1225] dark:to-indigo-500/[0.07]',
        },
    };

    const activeVariant = colorVariants[color] || colorVariants.primary;

    return (
        <Card
            animate={false}
            className={`h-full !p-0 overflow-hidden bg-gradient-to-br ${activeVariant.gradient} border-l-4 ${activeVariant.border} ${onClick ? 'cursor-pointer hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 hover:border-l-[5px] transition-all' : ''}`}
            onClick={onClick}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-4 p-5"
            >
                <div className={`p-3 rounded-2xl border ${activeVariant.icon} shrink-0`}>
                    <Icon size={22} />
                </div>
                <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-white/30 leading-none mb-2">
                        {label}
                    </p>
                    <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center">
                        {prefix}
                        {displayValue.toLocaleString()}
                        {suffix}
                    </h3>
                </div>
            </motion.div>
        </Card>
    );
};

export default StatCard;
