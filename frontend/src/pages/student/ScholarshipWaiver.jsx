import React from 'react';
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
import { getMyApplications, getActiveCirculars } from '../../api/financialAidApi';

const ScholarshipWaiver = () => {
    const navigate = useNavigate();
    const { data: applications, loading: appsLoading } = useFetch('/financial-aid/my-applications');
    const { data: activeCirculars, loading: circularsLoading } = useFetch('/financial-aid/circulars/active');

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
            case 'APPROVED': return <CheckCircle size={14} className="mr-1.5" />;
            case 'REJECTED': return <XCircle size={14} className="mr-1.5" />;
            case 'REVIEWING': return <Clock size={14} className="mr-1.5" />;
            default: return <Clock size={14} className="mr-1.5" />;
        }
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">Scholarship & Waiver</h1>
                <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Financial Aid System</p>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white border-none shadow-indigo-200 dark:shadow-none">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-indigo-100 text-[10px] font-black uppercase tracking-widest">Active Applications</p>
                            <h3 className="text-3xl font-black mt-2">{applications?.filter(a => a.status === 'PENDING' || a.status === 'REVIEWING').length || 0}</h3>
                        </div>
                        <div className="p-3 bg-white/10 rounded-2xl">
                            <Clock size={24} />
                        </div>
                    </div>
                </Card>
                <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white border-none shadow-emerald-200 dark:shadow-none">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-emerald-100 text-[10px] font-black uppercase tracking-widest">Approved Aid</p>
                            <h3 className="text-3xl font-black mt-2">{applications?.filter(a => a.status === 'APPROVED').length || 0}</h3>
                        </div>
                        <div className="p-3 bg-white/10 rounded-2xl">
                            <Award size={24} />
                        </div>
                    </div>
                </Card>
                <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-none shadow-amber-200 dark:shadow-none">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-amber-100 text-[10px] font-black uppercase tracking-widest">Available Circulars</p>
                            <h3 className="text-3xl font-black mt-2">{activeCirculars?.length || 0}</h3>
                        </div>
                        <div className="p-3 bg-white/10 rounded-2xl">
                            <Info size={24} />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Active Circulars */}
            <section className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-lg font-black text-gray-900 dark:text-white">Active Financial Aid Circulars</h2>
                    <Button variant="ghost" size="sm" className="text-primary-600 text-xs font-bold" onClick={() => navigate('/student/scholarship/circulars')}>
                        View All <ArrowRight size={14} className="ml-1" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeCirculars?.length > 0 ? (
                        activeCirculars.slice(0, 3).map((circular) => (
                            <motion.div
                                key={circular.id}
                                whileHover={{ y: -4 }}
                                className="bg-white dark:bg-[#1e293b] rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-primary-50 dark:bg-primary-950/30 rounded-2xl text-primary-600 shrink-0">
                                        <Award size={24} />
                                    </div>
                                    <div className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100">
                                        Ends {new Date(circular.deadline).toLocaleDateString()}
                                    </div>
                                </div>
                                <h3 className="text-base font-black text-gray-900 dark:text-white line-clamp-1">{circular.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-xs mt-2 line-clamp-3 leading-relaxed">
                                    {circular.description}
                                </p>
                                <div className="mt-auto pt-6">
                                    <Button
                                        className="w-full rounded-2xl font-black text-xs uppercase tracking-widest"
                                        onClick={() => navigate(`/student/scholarship/apply/${circular.id}`)}
                                    >
                                        Apply Now
                                    </Button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center bg-gray-50 dark:bg-gray-800/20 rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
                            <p className="text-sm text-gray-500 font-bold italic">No active circulars at the moment.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* My Applications */}
            <section className="space-y-4">
                <h2 className="text-lg font-black text-gray-900 dark:text-white px-1">My Applications</h2>
                <Card className="!p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-800">
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Circular</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Applied On</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                                {applications?.length > 0 ? (
                                    applications.map((app) => (
                                        <tr key={app.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                            <td className="px-6 py-5">
                                                <p className="text-sm font-black text-gray-900 dark:text-white">{app.circularTitle}</p>
                                                <p className="text-[10px] text-gray-500 font-bold mt-1">Ref: {app.id.substring(0, 8).toUpperCase()}</p>
                                            </td>
                                            <td className="px-6 py-5 text-sm text-gray-600 dark:text-gray-400 font-medium">
                                                {new Date(app.appliedAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(app.status)}`}>
                                                    {getStatusIcon(app.status)}
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <p className="text-xs text-gray-500 italic max-w-xs ml-auto">
                                                    {app.adminRemarks || 'No remarks yet'}
                                                </p>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center">
                                            <p className="text-sm text-gray-500 font-medium italic">You haven't applied for any financial aid yet.</p>
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
