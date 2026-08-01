import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';
import Card from './Card';

const StatCard = ({
                    icon: Icon,
                    label,
                    value,
                    color = 'primary',
                    delay = 0,
                    prefix = '',
                    suffix = '',
                    onClick
                  }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 2,
      delay: delay,
      onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
    });
    return () => controls.stop();
  }, [value, delay]);

  const colorVariants = {
    primary: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20 border-primary-500',
    success: 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-500',
    warning: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500',
    danger: 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-500',
    info: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-500',
  };
  // Fall back to 'primary' if an unrecognized color key is passed in,
  // so this never crashes on colorVariants[color] being undefined.
  const activeVariant = colorVariants[color] || colorVariants.primary;

  return (
      <Card
          animate={false}
          className={`h-full !p-0 overflow-hidden bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-800/50 border-l-4 ${activeVariant.split(' ').pop()} ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
          onClick={onClick}
      >
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay }}
            className="flex items-center space-x-4 p-5"
        >
          <div className={`p-3 rounded-2xl ${activeVariant.split(' ').slice(0, 2).join(' ')}`}>
            <Icon size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center">
              {prefix}{displayValue.toLocaleString()}{suffix}
            </h3>
          </div>
        </motion.div>
      </Card>
  );
};

export default StatCard;