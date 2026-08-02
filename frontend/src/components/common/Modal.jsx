import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
      <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop - matches Navbar overlay */}
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={onClose}
                  className="absolute inset-0 bg-[#09101F]/70 dark:bg-black/70 backdrop-blur-sm"
              />

              {/* Modal Container - Royal Bengal theme */}
              <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className={`relative w-full ${sizes[size]} bg-white dark:bg-[#0B1225] rounded-[24px] shadow-2xl overflow-hidden z-10 border border-slate-200 dark:border-white/10`}
              >
                {/* Top emerald accent like Login */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#007A55] via-emerald-400 to-indigo-500" />

                {/* Header */}
                <div className="px-7 sm:px-8 py-5 sm:py-6 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between gap-4">
                  <h2 className="text-[18px] font-black tracking-tight text-slate-900 dark:text-white">
                    {title}
                  </h2>
                  <button
                      onClick={onClose}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.06] hover:bg-slate-100 dark:hover:bg-white/[0.1] text-slate-400 dark:text-white/40 hover:text-slate-700 dark:hover:text-white transition-colors border border-transparent dark:border-white/5 shrink-0"
                      aria-label="Close modal"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Content */}
                <div className="px-7 sm:px-8 py-7 max-h-[75vh] overflow-y-auto custom-scrollbar">
                  {children}
                </div>
              </motion.div>
            </div>
        )}
      </AnimatePresence>
  );
};

export default Modal;
