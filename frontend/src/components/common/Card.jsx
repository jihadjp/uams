import { motion } from 'framer-motion';
import React, { forwardRef } from 'react';

// Merges default utility classes with custom ones, letting custom classes
// override defaults that target the same property (bg-, border-, text-,
// rounded-, shadow-, ring-) instead of both landing in the class list.
const mergeClasses = (defaultClasses, customClasses = '') => {
    if (!customClasses) return defaultClasses;
    const overridablePrefixes = ['bg-', 'border-', 'text-', 'rounded-', 'shadow-', 'ring-', 'p-', 'px-', 'py-'];
    const stripVariants = (token) => token.replace(/^([a-zA-Z0-9-]+:)+/, '').replace(/^!/, '');

    const customTokens = customClasses.split(/\s+/).filter(Boolean);
    const customPrefixes = new Set();
    customTokens.forEach((tok) => {
        const base = stripVariants(tok);
        overridablePrefixes.forEach((p) => {
            if (base.startsWith(p)) customPrefixes.add(p);
        });
    });

    const filteredDefaults = defaultClasses.split(/\s+/).filter((tok) => {
        const base = stripVariants(tok);
        return ![...customPrefixes].some((p) => base.startsWith(p));
    });

    return [...filteredDefaults, ...customTokens].join(' ');
};

const Card = forwardRef(({ children, title, subtitle, icon: Icon, className = '', animate = true, onClick }, ref) => {
    const content = (
        <div
            ref={ref}
            onClick={onClick}
            className={mergeClasses(
                `bg-white dark:bg-[#0B1225] rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 overflow-hidden transition-colors ${onClick ? 'cursor-pointer hover:border-[#007A55]/30 dark:hover:border-emerald-500/20' : ''}`,
                className
            )}
        >
            {(title || subtitle || Icon) && (
                <div className="p-6 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between gap-4">
                    <div className="min-w-0">
                        {title && <h3 className="text-[15px] font-bold tracking-tight text-slate-900 dark:text-white truncate">{title}</h3>}
                        {subtitle && <p className="text-[13px] text-slate-500 dark:text-white/40 mt-0.5 leading-snug">{subtitle}</p>}
                    </div>
                    {Icon && (
                        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 text-[#007A55] dark:text-emerald-300 rounded-xl border border-emerald-100 dark:border-emerald-500/20 shrink-0">
                            <Icon size={20} />
                        </div>
                    )}
                </div>
            )}
            <div className="p-6">{children}</div>
        </div>
    );

    if (!animate) return content;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={
                onClick
                    ? { y: -3, boxShadow: '0 16px 32px -10px rgba(0, 122, 85, 0.15), 0 8px 16px -8px rgba(0,0,0,0.08)' }
                    : { y: -2 }
            }
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
            {content}
        </motion.div>
    );
});

Card.displayName = 'Card';

export default Card;
