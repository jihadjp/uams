import { motion } from 'framer-motion';

const ProgressRing = ({
  value,
  maxValue = 4.0,
  label = "CGPA",
  size = 120,
  strokeWidth = 8,
  color = "text-primary-500"
}) => {
  const radius = (size / 2) - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / maxValue) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className="text-gray-100 dark:text-gray-700"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: `${progress} ${circumference}` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
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
        <span className="text-2xl font-black text-gray-900 dark:text-white">{value.toFixed(2)}</span>
        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
      </div>
    </div>
  );
};

export default ProgressRing;
