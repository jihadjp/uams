import { Bus, Clock, AlertCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import { motion } from 'framer-motion';

const TransportCard = () => {
    return (
        <div className="max-w-4xl mx-auto py-20 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-8"
            >
                <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2.5rem] flex items-center justify-center mx-auto text-indigo-600 shadow-xl shadow-indigo-500/10">
                    <Bus size={48} />
                </div>

                <div className="space-y-3">
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Transport Card</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto font-medium">
                        Digital transport card application and route tracking system is coming soon.
                    </p>
                </div>

                <div className="flex flex-col items-center space-y-4 pt-4">
                    <div className="inline-flex items-center space-x-3 px-6 py-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                        <Clock size={18} />
                        <span>Expected Launch: Fall 2026</span>
                    </div>

                    <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 dark:bg-amber-900/10 px-4 py-2 rounded-xl text-xs font-bold">
                        <AlertCircle size={14} />
                        <span>Manual application is currently available at the Transport Office.</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default TransportCard;
