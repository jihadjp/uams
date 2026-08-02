import { motion } from 'framer-motion';

const ProgressRing = ({
                        value,
                        maxValue = 4.0,
                        label = 'CGPA',
                        size = 120,
                        strokeWidth = 8,
                        color = 'text-[#007A55] dark:text-emerald-400',
                      }) => {
  const radius = size / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const clampedValue = Math.min(Math.max(value, 0), maxValue);
  const progress = (clampedValue / maxValue) * circumference;

  return (
      <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Track */}
          <circle
              className="text-slate-200 dark:text-white/10"
              strokeWidth={strokeWidth}
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx={size / 2}
              cy={size / 2}
          />
          {/* Progress */}
          <motion.circle
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${progress} ${circumference}` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx={size / 2}
              cy={size / 2}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          {Number(value).toFixed(2)}
        </span>
          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-white/30 mt-0.5">
          {label}
        </span>
        </div>
      </div>
  );
};

export default ProgressRing;
