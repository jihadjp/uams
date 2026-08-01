import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  History,
  Calendar,
  ChevronDown,
  Info,
  DollarSign,
  Download, ShieldCheck,
  FileText, Building2
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { getMyFees } from '../../api/feeApi';
import { getMyProfile } from '../../api/profileApi';
import { useAuthStore } from '../../store/authStore';
import { formatDate } from '../../utils/formatDate';
import toast from 'react-hot-toast';

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const profileRes = await getMyProfile();
      const sId = profileRes.data.student?.id;
      setStudentId(sId);

      if (sId) {
        const feesRes = await getMyFees(sId);
        setFees(feesRes.data || []);
      }
    } catch (err) {
      toast.error('Failed to load financial records');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalPayable = fees.reduce((sum, f) => sum + (f.amountDue || 0), 0);
  const totalPaid = fees.reduce((sum, f) => sum + (f.amountPaid || 0), 0);
  const totalDue = totalPayable - totalPaid;

  const stats = [
    { label: 'Total Payable', value: totalPayable.toLocaleString(), icon: DollarSign, color: 'bg-indigo-600' },
    { label: 'Total Paid', value: totalPaid.toLocaleString(), icon: CheckCircle2, color: 'bg-emerald-600' },
    { label: 'Total Due', value: totalDue.toLocaleString(), icon: AlertTriangle, color: 'bg-rose-600' },
    { label: 'Other Charges', value: '0.00', icon: History, color: 'bg-slate-600' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAID': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'PARTIAL': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
    }
  };

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
            <h1 className="text-3xl font-black text-[#2D2A4F] dark:text-white tracking-tight">Payment Ledger</h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mt-1">Financial History & Records</p>
        </div>
        <Button variant="secondary" className="flex items-center space-x-2 border-gray-200">
            <Download size={16} />
            <span>Download Statement</span>
        </Button>
      </div>

      {/* Financial Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {stats.map((s, idx) => (
           <motion.div
             key={idx}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: idx * 0.1 }}
           >
             <Card className={`${s.color} border-none text-white !p-6 shadow-xl relative overflow-hidden group`}>
                <div className="absolute -right-4 -bottom-4 text-white/10 group-hover:scale-110 transition-transform duration-500">
                    <s.icon size={100} strokeWidth={1} />
                </div>
                <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{s.label}</span>
                        <div className="p-2 bg-white/20 rounded-xl">
                            <s.icon size={16} />
                        </div>
                    </div>
                    <div className="flex items-baseline space-x-1">
                        <span className="text-xs font-bold opacity-60">BDT</span>
                        <span className="text-3xl font-black tabular-nums">{s.value}</span>
                    </div>
                </div>
             </Card>
           </motion.div>
         ))}
      </div>

      {/* Manual Payment Procedure */}
      <section className="space-y-6">
          <div className="flex items-center space-x-3 px-1">
              <div className="w-2 h-6 bg-amber-500 rounded-full" />
              <h2 className="text-xl font-black text-[#2D2A4F] dark:text-white uppercase tracking-tight">Payment Procedure</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                  { step: "01", title: "Collect Slip", desc: "Download or collect your semester fee slip from the portal or department.", icon: FileText },
                  { step: "02", title: "Office Deposit", desc: "Pay the exact amount at the University Accounts Office or designated bank counters.", icon: Building2 },
                  { step: "03", title: "Get Clearance", desc: "Present your receipt to the Registrar Office for digital verification and registration clearance.", icon: ShieldCheck }
              ].map((item, i) => (
                  <Card key={i} className="relative overflow-hidden group border-dashed hover:border-primary-500 transition-colors">
                      <span className="absolute -right-2 -top-2 text-6xl font-black text-gray-50 dark:text-gray-800/50 group-hover:text-primary-500/10 transition-colors">{item.step}</span>
                      <div className="relative z-10 flex items-start space-x-4">
                          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-400 group-hover:text-primary-500 transition-colors">
                              <item.icon size={24} />
                          </div>
                          <div>
                              <h4 className="font-black text-[#2D2A4F] dark:text-white uppercase tracking-wider text-sm">{item.title}</h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium leading-relaxed">{item.desc}</p>
                          </div>
                      </div>
                  </Card>
              ))}
          </div>
      </section>

      {/* Ledger Table */}
      <section className="space-y-6">
          <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-3">
                  <div className="w-2 h-6 bg-indigo-500 rounded-full" />
                  <h2 className="text-xl font-black text-[#2D2A4F] dark:text-white uppercase tracking-tight">Semester Wise Ledger</h2>
              </div>
          </div>

          <Card className="!p-0 overflow-hidden border border-gray-100 dark:border-gray-800 shadow-xl rounded-2xl bg-white dark:bg-gray-800/50">
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead className="bg-gray-50 dark:bg-gray-800/80 text-[#2D2A4F] dark:text-gray-300 uppercase text-[11px] font-black tracking-widest border-b border-gray-100 dark:border-gray-700">
                      <tr>
                         <th className="px-6 py-5 w-16 text-center">SL</th>
                         <th className="px-6 py-5">Semester</th>
                         <th className="px-6 py-5">Due Date</th>
                         <th className="px-6 py-5 text-right">Total Payable</th>
                         <th className="px-6 py-5 text-right">Paid Amount</th>
                         <th className="px-6 py-5 text-right">Balance</th>
                         <th className="px-6 py-5 text-center">Status</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                      {fees.length > 0 ? fees.map((fee, idx) => {
                          const balance = (fee.amountDue || 0) - (fee.amountPaid || 0);
                          return (
                            <tr key={fee.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all font-medium">
                               <td className="px-6 py-5 text-center text-sm text-gray-400">{idx + 1}</td>
                               <td className="px-6 py-5">
                                  <span className="text-sm font-bold text-gray-900 dark:text-white uppercase">
                                     {fee.semesterName}
                                  </span>
                               </td>
                               <td className="px-6 py-5">
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                     {fee.dueDate ? formatDate(fee.dueDate) : 'No Deadline'}
                                  </span>
                               </td>
                               <td className="px-6 py-5 text-right font-mono text-gray-900 dark:text-white">
                                  {fee.amountDue?.toLocaleString()}
                               </td>
                               <td className="px-6 py-5 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                                  {fee.amountPaid?.toLocaleString()}
                               </td>
                               <td className="px-6 py-5 text-right font-mono text-rose-600 dark:text-rose-400 font-bold">
                                  {balance.toLocaleString()}
                               </td>
                               <td className="px-6 py-5 text-center">
                                  <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusBadge(fee.status)}`}>
                                     {fee.status}
                                  </span>
                               </td>
                            </tr>
                          );
                      }) : (
                        <tr>
                           <td colSpan="7" className="py-24 text-center">
                              <div className="flex flex-col items-center space-y-3 opacity-40">
                                 <Wallet size={48} className="text-gray-300" />
                                 <p className="text-sm font-black uppercase tracking-widest italic text-gray-400">No financial records found</p>
                              </div>
                           </td>
                        </tr>
                      )}
                   </tbody>
                </table>
             </div>
          </Card>
      </section>

      {/* Footer Support */}
      <div className="p-6 bg-slate-50 dark:bg-gray-900/50 rounded-3xl border border-slate-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm text-indigo-500">
                  <Info size={24} />
              </div>
              <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Need financial assistance?</h4>
                  <p className="text-sm text-gray-500">Contact the accounts office for waiver applications or installment requests.</p>
              </div>
          </div>
          <button className="px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">
              Contact Accounts
          </button>
      </div>
    </div>
  );
};

export default Fees;
