import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Wallet,
    CheckCircle2,
    AlertTriangle,
    History,
    Info,
    DollarSign,
    Download,
    ShieldCheck,
    FileText,
    Building2
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { getMyFees } from '../../api/feeApi';
import { getMyProfile } from '../../api/profileApi';
import { formatDate } from '../../utils/formatDate';
import toast from 'react-hot-toast';

const Fees = () => {
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const profileRes = await getMyProfile();
            const sId = profileRes.data.student?.id;

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
        {
            label: 'Total Payable',
            value: totalPayable.toLocaleString(),
            icon: DollarSign,
            color: 'text-indigo-600 dark:text-indigo-400',
            bg: 'bg-indigo-50/60 dark:bg-indigo-900/10',
            border: 'border-indigo-100 dark:border-indigo-900/20'
        },
        {
            label: 'Total Paid',
            value: totalPaid.toLocaleString(),
            icon: CheckCircle2,
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-50/60 dark:bg-emerald-900/10',
            border: 'border-emerald-100 dark:border-emerald-900/20'
        },
        {
            label: 'Total Due',
            value: totalDue.toLocaleString(),
            icon: AlertTriangle,
            color: 'text-rose-600 dark:text-rose-400',
            bg: 'bg-rose-50/60 dark:bg-rose-900/10',
            border: 'border-rose-100 dark:border-rose-900/20'
        },
        {
            label: 'Other Charges',
            value: '0.00',
            icon: History,
            color: 'text-slate-600 dark:text-slate-400',
            bg: 'bg-slate-50/60 dark:bg-slate-800/30',
            border: 'border-slate-200/80 dark:border-gray-700/50'
        },
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
        <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-20 pt-4">
            {/* Top Action Bar */}
            <div className="flex justify-end">
                <Button variant="secondary" className="flex items-center space-x-2 border-slate-200/80 dark:border-white/10 text-xs sm:text-sm font-bold">
                    <Download size={15} />
                    <span>Download Statement</span>
                </Button>
            </div>

            {/* Financial Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((s, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08 }}
                    >
                        <Card className={`${s.bg} ${s.border} border shadow-sm !p-5 sm:!p-6 rounded-2xl sm:rounded-3xl relative overflow-hidden group transition-all`}>
                            <div className="relative z-10 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">{s.label}</span>
                                    <div className={`p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm ${s.color}`}>
                                        <s.icon size={16} />
                                    </div>
                                </div>
                                <div className="flex items-baseline space-x-1.5">
                                    <span className="text-xs font-bold text-gray-400">BDT</span>
                                    <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tabular-nums">{s.value}</span>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Manual Payment Procedure */}
            <section className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-2.5">
                    <div className="w-1.5 h-5 bg-amber-500 rounded-full" />
                    <h2 className="text-base sm:text-lg font-black text-[#2D2A4F] dark:text-white uppercase tracking-tight">
                        Payment Procedure
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    {[
                        { step: "01", title: "Collect Slip", desc: "Download or collect your semester fee slip from the portal or department.", icon: FileText },
                        { step: "02", title: "Office Deposit", desc: "Pay the exact amount at the University Accounts Office or designated bank counters.", icon: Building2 },
                        { step: "03", title: "Get Clearance", desc: "Present your receipt to the Registrar Office for digital verification and registration clearance.", icon: ShieldCheck }
                    ].map((item, i) => (
                        <Card key={i} className="relative overflow-hidden group border border-dashed border-slate-200/80 dark:border-white/10 hover:border-primary-500/50 transition-colors shadow-sm rounded-2xl sm:rounded-3xl !p-5 sm:!p-6">
                            <span className="absolute -right-2 -top-2 text-5xl font-black text-gray-100 dark:text-gray-800/40 select-none group-hover:text-primary-500/10 transition-colors">{item.step}</span>
                            <div className="relative z-10 flex items-start space-x-3.5 sm:space-x-4">
                                <div className="p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-xl sm:rounded-2xl text-gray-500 dark:text-gray-400 group-hover:text-primary-500 transition-colors shrink-0">
                                    <item.icon size={22} />
                                </div>
                                <div>
                                    <h4 className="font-black text-[#2D2A4F] dark:text-white uppercase tracking-wider text-xs sm:text-sm">{item.title}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Ledger Table */}
            <section className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-2.5">
                    <div className="w-1.5 h-5 bg-indigo-500 rounded-full" />
                    <h2 className="text-base sm:text-lg font-black text-[#2D2A4F] dark:text-white uppercase tracking-tight">
                        Semester Wise Ledger
                    </h2>
                </div>

                <Card className="!p-0 overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-sm rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-800/50">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 dark:bg-gray-800/80 text-[#2D2A4F] dark:text-gray-300 uppercase text-[10px] font-black tracking-widest border-b border-gray-100 dark:border-gray-700">
                            <tr>
                                <th className="px-4 sm:px-6 py-4 w-12 text-center whitespace-nowrap">SL</th>
                                <th className="px-4 sm:px-6 py-4 whitespace-nowrap">Semester</th>
                                <th className="px-4 sm:px-6 py-4 whitespace-nowrap">Due Date</th>
                                <th className="px-4 sm:px-6 py-4 text-right whitespace-nowrap">Total Payable</th>
                                <th className="px-4 sm:px-6 py-4 text-right whitespace-nowrap">Paid Amount</th>
                                <th className="px-4 sm:px-6 py-4 text-right whitespace-nowrap">Balance</th>
                                <th className="px-4 sm:px-6 py-4 text-center whitespace-nowrap">Status</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                            {fees.length > 0 ? fees.map((fee, idx) => {
                                const balance = (fee.amountDue || 0) - (fee.amountPaid || 0);
                                return (
                                    <tr key={fee.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all font-medium">
                                        <td className="px-4 sm:px-6 py-4 sm:py-5 text-center text-xs sm:text-sm text-gray-400 whitespace-nowrap">{idx + 1}</td>
                                        <td className="px-4 sm:px-6 py-4 sm:py-5 whitespace-nowrap">
                        <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white uppercase">
                          {fee.semesterName}
                        </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 sm:py-5 whitespace-nowrap">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {fee.dueDate ? formatDate(fee.dueDate) : 'No Deadline'}
                        </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 sm:py-5 text-right font-mono text-xs sm:text-sm text-gray-900 dark:text-white whitespace-nowrap">
                                            {fee.amountDue?.toLocaleString()}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 sm:py-5 text-right font-mono text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-bold whitespace-nowrap">
                                            {fee.amountPaid?.toLocaleString()}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 sm:py-5 text-right font-mono text-xs sm:text-sm text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap">
                                            {balance.toLocaleString()}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 sm:py-5 text-center whitespace-nowrap">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${getStatusBadge(fee.status)}`}>
                          {fee.status}
                        </span>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="7" className="py-20 text-center">
                                        <div className="flex flex-col items-center space-y-3 opacity-40">
                                            <Wallet size={40} className="text-gray-300" />
                                            <p className="text-xs sm:text-sm font-black uppercase tracking-widest italic text-gray-400">No financial records found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </section>

            {/* Footer Support Banner */}
            <div className="p-4 sm:p-6 bg-slate-50 dark:bg-gray-900/50 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-gray-800 flex flex-col md:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 shadow-sm">
                <div className="flex items-start space-x-3.5 sm:space-x-4">
                    <div className="p-2.5 sm:p-3 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm text-indigo-500 shrink-0 border border-slate-100 dark:border-gray-700">
                        <Info size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">Need financial assistance?</h4>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">Contact the accounts office for waiver applications or installment requests.</p>
                    </div>
                </div>
                <button className="w-full sm:w-auto px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs sm:text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors shadow-sm">
                    Contact Accounts
                </button>
            </div>
        </div>
    );
};

export default Fees;