import { useState, useEffect } from 'react';
import { Check, X, ShieldCheck, AlertCircle, Calendar } from 'lucide-react';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { getMyClearance } from '../../api/clearanceApi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Clearance = () => {
  const [clearances, setClearances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMyClearance();
        setClearances(res.data || []);
      } catch (err) {
        toast.error('Failed to load clearance status');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const StatusIcon = ({ cleared }) => (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${cleared ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'}`}>
      {cleared ? <Check size={18} strokeWidth={3} /> : <X size={18} strokeWidth={3} />}
    </div>
  );

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-black text-[#2D2A4F] dark:text-white tracking-tight">Exam Clearance</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">Check your eligibility for registration and exams</p>
      </motion.div>

      <Card className="overflow-hidden border-none shadow-xl bg-white dark:bg-gray-800 rounded-[2rem]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Semester</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Registration</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Midterm Exam</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Final Exam</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {clearances.length > 0 ? clearances.map((c, idx) => (
                <motion.tr
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600">
                        <Calendar size={18} />
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">{c.semesterName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <StatusIcon cleared={c.registrationCleared} />
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <StatusIcon cleared={c.midtermCleared} />
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <StatusIcon cleared={c.finalExamCleared} />
                    </div>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <ShieldCheck size={48} className="mb-4 opacity-20" />
                      <p className="font-bold">No clearance data available</p>
                      <p className="text-sm">Please check back later or contact the registrar office.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Info Legend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <Card className="p-8 border-none bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm text-emerald-500 shrink-0">
                <Check size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-200">Cleared</h4>
                <p className="text-sm text-emerald-700/70 dark:text-emerald-400 font-medium mt-1">You have met all requirements (payments, attendance, etc.) for this stage.</p>
              </div>
            </div>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
          <Card className="p-8 border-none bg-rose-50 dark:bg-rose-900/10 rounded-3xl">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm text-rose-500 shrink-0">
                <AlertCircle size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-rose-900 dark:text-rose-200">Not Cleared</h4>
                <p className="text-sm text-rose-700/70 dark:text-rose-400 font-medium mt-1">Please ensure your fees are paid and other requirements are fulfilled to get clearance.</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Clearance;
