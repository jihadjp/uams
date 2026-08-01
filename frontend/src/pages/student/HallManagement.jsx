import { Home, Clock, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const HallManagement = () => {
    return (
        <div className="max-w-4xl mx-auto py-20 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-8"
            >
                <div className="w-24 h-24 bg-rose-50 dark:bg-red-900/20 rounded-[2.5rem] flex items-center justify-center mx-auto text-rose-600 shadow-xl shadow-rose-500/10">
                    <Home size={48} />
                </div>

                <div className="space-y-3">
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Hall Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto font-medium">
                        The centralized dormitory booking and room allocation portal is under development.
                    </p>
                </div>

                <div className="flex flex-col items-center space-y-4 pt-4">
                    <div className="inline-flex items-center space-x-3 px-6 py-3 bg-rose-50 dark:bg-rose-900/20 rounded-2xl text-rose-600 dark:text-rose-400 font-bold text-sm">
                        <Clock size={18} />
                        <span>System Integration in Progress</span>
                    </div>

                    <div className="flex items-center space-x-2 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/10 px-4 py-2 rounded-xl text-xs font-bold">
                        <Info size={14} />
                        <span>Contact Hall Provost for emergency accommodation requests.</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default HallManagement;
