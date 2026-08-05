import { useState, useEffect } from 'react';
import {
    Award,
    Clock,
    CheckCircle,
    XCircle,
    Info,
    ArrowRight
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import useFetch from '../../hooks/useFetch';
import Loader from '../../components/common/Loader';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const ScholarshipWaiver = () => {
    const navigate = useNavigate();
    const user = useAuthStore(state => state.user);
    const { data: applications, loading: appsLoading } = useFetch('/financial-aid/my-applications');
    const { data: activeCirculars, loading: circularsLoading } = useFetch('/financial-aid/circulars/active');

    const getRolePath = (subPath) => {
        if (!user?.role) return `/student${subPath}`;
        return `/${user.role.toLowerCase()}${subPath}`;
    };

    if (appsLoading || circularsLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    const getStatusStyles = (status) => {
        switch (status) {
            case 'APPROVED': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-900/50';
            case 'REJECTED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-900/50';
            case 'REVIEWING': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-900/50';
            default: return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-900/50';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'APPROVED': return <CheckCircle size={13} className="mr-1.5 shrink-0" />;
            case 'REJECTED': return <XCircle size={13} className="mr-1.5 shrink-0" />;
            case 'REVIEWING': return <Clock size={13} className="mr-1.5 shrink-0" />;
            default: return <Clock size={13} className="mr-1.5 shrink-0" />;
        }
    };

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-20 pt-4">
            {/* Top Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <Card className="bg-indigo-50/60 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/20 shadow-sm rounded-2xl sm:rounded-3xl !p-5 sm:!p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest">Active Applications</p>
                            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-1.5">
                                {applications?.filter(a => a.status === 'PENDING' || a.status === 'REVIEWING').length || 0}
                            </h3>
                        </div>
                        <div className="p-2.5 sm:p-3 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 rounded-xl sm:rounded-2xl shadow-sm border border-indigo-100/50 dark:border-gray-700">
                            <Clock size={20} className="sm:w-6 sm:h-6" />
                        </div>
                    </div>
                </Card>

                <Card className="bg-emerald-50/60 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 shadow-sm rounded-2xl sm:rounded-3xl !p-5 sm:!p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest">Approved Aid</p>
                            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-1.5">
                                {applications?.filter(a => a.status === 'APPROVED').length || 0}
                            </h3>
                        </div>
                        <div className="p-2.5 sm:p-3 bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 rounded-xl sm:rounded-2xl shadow-sm border border-emerald-100/50 dark:border-gray-700">
                            <Award size={20} className="sm:w-6 sm:h-6" />
                        </div>
                    </div>
                </Card>

                <Card className="bg-amber-50/60 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 shadow-sm rounded-2xl sm:rounded-3xl !p-5 sm:!p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest">Available Circulars</p>
                            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-1.5">
                                {activeCirculars?.length || 0}
                            </h3>
                        </div>
                        <div className="p-2.5 sm:p-3 bg-white dark:bg-gray-800 text-amber-600 dark:text-amber-400 rounded-xl sm:rounded-2xl shadow-sm border border-amber-100/50 dark:border-gray-700">
                            <Info size={20} className="sm:w-6 sm:h-6" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Active Circulars */}
            <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center space-x-2.5">
                        <div className="w-1.5 h-5 bg-amber-500 rounded-full" />
                        <h2 className="text-base sm:text-lg font-black text-[#2D2A4F] dark:text-white uppercase tracking-tight">
                            Active Financial Aid Circulars
                        </h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary-600 dark:text-emerald-400 text-xs font-bold hover:bg-transparent p-0"
                        onClick={() => navigate(getRolePath('/scholarship/circulars'))}
                    >
                        View All <ArrowRight size={14} className="ml-1" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {activeCirculars?.length > 0 ? (
                        activeCirculars.slice(0, 3).map((circular) => (
                            <motion.div
                                key={circular.id}
                                whileHover={{ y: -3 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 dark:border-white/10 flex flex-col hover:shadow-md transition-all"
                            >
                                <div className="flex items-start justify-between mb-4 gap-2">
                                    <div className="p-2.5 sm:p-3 bg-primary-50 dark:bg-emerald-500/15 text-primary-600 dark:text-emerald-400 rounded-xl sm:rounded-2xl shrink-0 border border-primary-100 dark:border-emerald-500/20">
                                        <Award size={20} className="sm:w-6 sm:h-6" />
                                    </div>
                                    <div className="px-2.5 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest border border-amber-100 dark:border-amber-900/40">
                                        Ends {new Date(circular.deadline).toLocaleDateString()}
                                    </div>
                                </div>
                                <h3 className="text-sm sm:text-base font-black text-gray-900 dark:text-white line-clamp-1">{circular.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1.5 line-clamp-3 leading-relaxed font-medium">
                                    {circular.description}
                                </p>
                                <div className="mt-auto pt-5">
                                    <Button
                                        className="w-full bg-[#2D2A4F] hover:bg-[#1E1C38] text-white border-none rounded-xl sm:rounded-2xl font-bold transition-all text-xs uppercase tracking-widest py-3"
                                        onClick={() => navigate(getRolePath(`/scholarship/apply/${circular.id}`))}
                                    >
                                        Apply Now
                                    </Button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-12 sm:py-16 text-center bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl sm:rounded-3xl border border-dashed border-slate-200 dark:border-white/10">
                            <p className="text-xs sm:text-sm text-gray-400 font-bold italic">No active circulars at the moment.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* My Applications */}
            <section className="space-y-4">
                <div className="flex items-center space-x-2.5">
                    <div className="w-1.5 h-5 bg-indigo-500 rounded-full" />
                    <h2 className="text-base sm:text-lg font-black text-[#2D2A4F] dark:text-white uppercase tracking-tight">
                        My Applications
                    </h2>
                </div>

                <Card className="!p-0 overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-sm rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-800/50">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 dark:bg-gray-800/80 text-[#2D2A4F] dark:text-gray-300 uppercase text-[10px] font-black tracking-widest border-b border-gray-100 dark:border-gray-700">
                            <tr>
                                <th className="px-4 sm:px-6 py-4 whitespace-nowrap">Circular</th>
                                <th className="px-4 sm:px-6 py-4 whitespace-nowrap">Applied On</th>
                                <th className="px-4 sm:px-6 py-4 whitespace-nowrap">Status</th>
                                <th className="px-4 sm:px-6 py-4 text-right whitespace-nowrap">Remarks</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                            {applications?.length > 0 ? (
                                applications.map((app) => (
                                    <tr key={app.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors font-medium">
                                        <td className="px-4 sm:px-6 py-4 sm:py-5 whitespace-nowrap">
                                            <p className="text-xs sm:text-sm font-black text-gray-900 dark:text-white">{app.circularTitle}</p>
                                            <p className="text-[10px] text-gray-400 font-bold font-mono mt-0.5">Ref: {app.id.substring(0, 8).toUpperCase()}</p>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 sm:py-5 text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                            {new Date(app.appliedAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 sm:py-5 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(app.status)}`}>
                                                    {getStatusIcon(app.status)}
                                                    {app.status}
                                                </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 sm:py-5 text-right whitespace-nowrap">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 italic max-w-xs ml-auto">
                                                {app.adminRemarks || 'No remarks yet'}
                                            </p>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-16 text-center text-gray-400 text-xs sm:text-sm font-bold italic">
                                        You haven't applied for any financial aid yet.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </section>
        </div>
    );
};

export default ScholarshipWaiver;