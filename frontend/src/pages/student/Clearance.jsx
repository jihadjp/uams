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
      <div
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border transition-all ${
              cleared
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/20'
                  : 'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/20'
          }`}
      >
        {cleared ? (
            <Check size={16} className="sm:w-4 sm:h-4" strokeWidth={3} />
        ) : (
            <X size={16} className="sm:w-4 sm:h-4" strokeWidth={3} />
        )}
      </div>
  );

  if (loading)
    return (
        <div className="h-[60vh] flex items-center justify-center">
          <Loader size="lg" />
        </div>
    );

  return (
      <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-20 pt-4">


        {/* Table Card */}
        <Card className="overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg !p-0 rounded-2xl sm:rounded-[22px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
              <tr className="bg-slate-50 dark:bg-white/[0.04] border-b border-slate-100 dark:border-white/[0.06]">
                <th className="px-4 sm:px-8 py-4 sm:py-5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 whitespace-nowrap">
                  Semester
                </th>
                <th className="px-4 sm:px-8 py-4 sm:py-5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 text-center whitespace-nowrap">
                  Registration
                </th>
                <th className="px-4 sm:px-8 py-4 sm:py-5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 text-center whitespace-nowrap">
                  Midterm Exam
                </th>
                <th className="px-4 sm:px-8 py-4 sm:py-5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 text-center whitespace-nowrap">
                  Final Exam
                </th>
              </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
              {clearances.length > 0 ? (
                  clearances.map((c, idx) => (
                      <motion.tr
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.06 }}
                          className="hover:bg-slate-50/70 dark:hover:bg-white/[0.03] transition-colors group"
                      >
                        <td className="px-4 sm:px-8 py-4 sm:py-5 whitespace-nowrap">
                          <div className="flex items-center gap-2.5 sm:gap-3">
                            <div className="p-1.5 sm:p-2 rounded-xl bg-[#09101F] dark:bg-white/[0.06] text-white dark:text-white/70 border border-white/10 shrink-0">
                              <Calendar size={15} className="sm:w-4 sm:h-4" />
                            </div>
                            <span className="font-bold tracking-tight text-slate-900 dark:text-white text-xs sm:text-sm">
                          {c.semesterName}
                        </span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-8 py-4 sm:py-5">
                          <div className="flex justify-center">
                            <StatusIcon cleared={c.registrationCleared} />
                          </div>
                        </td>
                        <td className="px-4 sm:px-8 py-4 sm:py-5">
                          <div className="flex justify-center">
                            <StatusIcon cleared={c.midtermCleared} />
                          </div>
                        </td>
                        <td className="px-4 sm:px-8 py-4 sm:py-5">
                          <div className="flex justify-center">
                            <StatusIcon cleared={c.finalExamCleared} />
                          </div>
                        </td>
                      </motion.tr>
                  ))
              ) : (
                  <tr>
                    <td colSpan={4} className="px-4 sm:px-8 py-16 sm:py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400 dark:text-white/20">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.06] flex items-center justify-center mb-4">
                          <ShieldCheck size={28} className="opacity-40" />
                        </div>
                        <p className="font-bold text-slate-600 dark:text-white/40 text-sm sm:text-base">
                          No clearance data available
                        </p>
                        <p className="text-xs sm:text-sm mt-1 font-medium">
                          Please check back later or contact the registrar office.
                        </p>
                      </div>
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Info Legend */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="!p-0 overflow-hidden border border-emerald-100 dark:border-emerald-500/20 bg-emerald-50/60 dark:bg-emerald-500/10 rounded-2xl sm:rounded-[20px]">
              <div className="p-4 sm:p-6 flex items-start gap-3.5 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-white dark:bg-[#0B1225] rounded-xl sm:rounded-2xl shadow-sm text-emerald-600 dark:text-emerald-300 border border-emerald-100 dark:border-white/10 shrink-0">
                  <Check size={18} className="sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-[15px] font-black tracking-tight text-emerald-900 dark:text-emerald-100">
                    Cleared
                  </h4>
                  <p className="text-xs sm:text-[13px] text-emerald-700/70 dark:text-emerald-300/60 font-medium mt-1 leading-relaxed">
                    You have met all requirements (payments, attendance, etc.) for this stage.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="!p-0 overflow-hidden border border-red-100 dark:border-red-500/20 bg-red-50/60 dark:bg-red-500/10 rounded-2xl sm:rounded-[20px]">
              <div className="p-4 sm:p-6 flex items-start gap-3.5 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-white dark:bg-[#0B1225] rounded-xl sm:rounded-2xl shadow-sm text-red-500 dark:text-red-300 border border-red-100 dark:border-white/10 shrink-0">
                  <AlertCircle size={18} className="sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-[15px] font-black tracking-tight text-red-900 dark:text-red-100">
                    Not Cleared
                  </h4>
                  <p className="text-xs sm:text-[13px] text-red-700/70 dark:text-red-300/60 font-medium mt-1 leading-relaxed">
                    Please ensure your fees are paid and other requirements are fulfilled to get clearance.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
  );
};

export default Clearance;