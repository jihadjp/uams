import { motion } from 'framer-motion';
import React, { forwardRef } from 'react';

// Merges default utility classes with custom ones, letting custom classes
// override defaults that target the same property (bg-, border-, text-,
// rounded-, shadow-, ring-) instead of both landing in the class list and
// fighting for specificity based on unpredictable stylesheet order.
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

  const filteredDefaults = defaultClasses
      .split(/\s+/)
      .filter((tok) => {
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
          className={mergeClasses('bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden', className)}
      >
        {(title || subtitle || Icon) && (
            <div className="p-6 border-b border-gray-50 dark:border-gray-700/50 flex items-center justify-between">
              <div>
                {title && <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>}
                {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
              </div>
              {Icon && (
                  <div className="p-2.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-xl">
                    <Icon size={24} />
                  </div>
              )}
            </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
  );

  if (!animate) return content;

  return (
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -4, shadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
          transition={{ duration: 0.3 }}
      >
        {content}
      </motion.div>
  );
});

export default Card;