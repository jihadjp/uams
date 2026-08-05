import React, { useState } from 'react';
import {
    Plus,
    Edit2,
    Trash2,
    Check,
    X,
    Clock,
    FileText,
    ArrowRight
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import useFetch from '../../hooks/useFetch';
import Loader from '../../components/common/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import {
    createCircular,
    updateCircular,
    deleteCircular,
    updateApplicationStatus
} from '../../api/financialAidApi';
import toast from 'react-hot-toast';

const FinancialAidManagement = () => {
    const [activeTab, setActiveTab] = useState('applications');
    const { data: circulars, loading: circLoading, refetch: refreshCircs } = useFetch('/financial-aid/admin/circulars');
    const { data: applications, loading: appLoading, refetch: refreshApps } = useFetch('/financial-aid/admin/applications');

    const [showCircModal, setShowCircModal] = useState(false);
    const [editingCirc, setEditingCirc] = useState(null);
    const [circData, setCircData] = useState({
        title: '',
        description: '',
        eligibilityCriteria: '',
        benefitDetails: '',
        deadline: '',
        isActive: true
    });

    const [showAppModal, setShowAppModal] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);
    const [appRemark, setAppRemark] = useState('');

    const handleSaveCircular = async (e) => {
        e.preventDefault();
        try {
            if (editingCirc) {
                await updateCircular(editingCirc.id, circData);
                toast.success('Circular updated');
            } else {
                await createCircular(circData);
                toast.success('Circular created');
            }
            setShowCircModal(false);
            refreshCircs();
        } catch (error) {
            toast.error('Operation failed');
        }
    };

    const handleDeleteCircular = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await deleteCircular(id);
            toast.success('Circular deleted');
            refreshCircs();
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    const handleUpdateStatus = async (status) => {
        try {
            await updateApplicationStatus(selectedApp.id, {
                status,
                adminRemarks: appRemark
            });
            toast.success(`Application ${status.toLowerCase()}`);
            setShowAppModal(false);
            refreshApps();
        } catch (error) {
            toast.error('Status update failed');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'APPROVED': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
            case 'REJECTED': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20';
            case 'REVIEWING': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
            default: return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
        }
    };

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-20 pt-4">
            {/* Top Bar with Tabs and Action Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex bg-slate-100 dark:bg-gray-800/80 p-1 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-white/10 w-fit">
                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'applications' ? 'bg-white dark:bg-gray-700 text-[#007A55] dark:text-emerald-400' : 'text-slate-500 dark:text-white/50'}`}
                    >
                        Applications
                    </button>
                    <button
                        onClick={() => setActiveTab('circulars')}
                        className={`px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'circulars' ? 'bg-white dark:bg-gray-700 text-[#007A55] dark:text-emerald-400' : 'text-slate-500 dark:text-white/50'}`}
                    >
                        Circulars
                    </button>
                </div>

                {activeTab === 'circulars' && (
                    <Button
                        className="bg-[#2D2A4F] hover:bg-[#1E1C38] text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm py-2.5 px-4 border-none flex items-center justify-center"
                        onClick={() => {
                            setEditingCirc(null);
                            setCircData({ title: '', description: '', eligibilityCriteria: '', benefitDetails: '', deadline: '', isActive: true });
                            setShowCircModal(true);
                        }}
                    >
                        <Plus size={16} className="mr-1.5" /> Create Circular
                    </Button>
                )}
            </div>

            {activeTab === 'applications' ? (
                <div className="space-y-6 sm:space-y-8">
                    {/* Flat Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-blue-200 dark:border-blue-500/20 bg-blue-50/60 dark:bg-blue-500/10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">Pending</p>
                            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">{applications?.filter(a => a.status === 'PENDING').length || 0}</h3>
                        </div>
                        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-amber-200 dark:border-amber-500/20 bg-amber-50/60 dark:bg-amber-500/10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">Reviewing</p>
                            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">{applications?.filter(a => a.status === 'REVIEWING').length || 0}</h3>
                        </div>
                        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50/60 dark:bg-emerald-500/10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Approved</p>
                            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">{applications?.filter(a => a.status === 'APPROVED').length || 0}</h3>
                        </div>
                        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-red-200 dark:border-red-500/20 bg-red-50/60 dark:bg-red-500/10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400">Rejected</p>
                            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">{applications?.filter(a => a.status === 'REJECTED').length || 0}</h3>
                        </div>
                    </div>

                    {/* Table Card */}
                    <Card className="!p-0 overflow-hidden border border-slate-200/80 dark:border-white/10 rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-800/80">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50/80 dark:bg-white/[0.03] text-slate-500 dark:text-white/30 uppercase text-[10px] font-bold tracking-widest border-b border-slate-100 dark:border-white/[0.06]">
                                <tr>
                                    <th className="px-4 sm:px-6 py-3.5 whitespace-nowrap">Student</th>
                                    <th className="px-4 sm:px-6 py-3.5 whitespace-nowrap">Circular</th>
                                    <th className="px-4 sm:px-6 py-3.5 whitespace-nowrap">Income</th>
                                    <th className="px-4 sm:px-6 py-3.5 whitespace-nowrap">Status</th>
                                    <th className="px-4 sm:px-6 py-3.5 text-right whitespace-nowrap">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
                                {appLoading ? (
                                    <tr><td colSpan="5" className="py-20 text-center"><Loader /></td></tr>
                                ) : applications?.length > 0 ? (
                                    applications.map((app) => (
                                        <tr key={app.id} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.04] transition-colors">
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">{app.studentName}</p>
                                                <p className="text-[10px] text-slate-400 font-bold font-mono mt-0.5">{app.registrationNo}</p>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                <p className="text-xs font-bold text-slate-600 dark:text-white/70">{app.circularTitle}</p>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">${app.monthlyIncome}</p>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest border ${getStatusBadge(app.status)}`}>
                                                        {app.status}
                                                    </span>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 text-right whitespace-nowrap">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-[#007A55] dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-xs font-black uppercase tracking-widest rounded-xl"
                                                    onClick={() => {
                                                        setSelectedApp(app);
                                                        setAppRemark(app.adminRemarks || '');
                                                        setShowAppModal(true);
                                                    }}
                                                >
                                                    Process <ArrowRight size={14} className="ml-1" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="5" className="py-16 text-center text-xs sm:text-sm text-slate-400 dark:text-white/30 italic font-bold">No applications found</td></tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {circLoading ? (
                            <div className="col-span-full py-20 text-center"><Loader /></div>
                        ) : circulars?.length > 0 ? (
                            circulars.map((circ) => (
                                <Card key={circ.id} className="relative flex flex-col justify-between border border-slate-200/80 dark:border-white/10 rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-800/80 !p-5 sm:!p-6 hover:border-indigo-500/30 transition-colors">
                                    <div>
                                        <div className="flex justify-between items-start gap-2 mb-3">
                                            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white pr-2">{circ.title}</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border shrink-0 ${circ.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-white/[0.06] dark:text-white/40 dark:border-white/10'}`}>
                                                {circ.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-white/40 line-clamp-2">{circ.description}</p>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/[0.06]">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black uppercase text-slate-400 dark:text-white/30">Deadline</span>
                                            <span className="text-xs font-bold text-slate-700 dark:text-white/80">{new Date(circ.deadline).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex gap-1.5">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all border border-transparent hover:border-blue-100"
                                                onClick={() => {
                                                    setEditingCirc(circ);
                                                    setCircData(circ);
                                                    setShowCircModal(true);
                                                }}
                                            >
                                                <Edit2 size={16} />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-100"
                                                onClick={() => handleDeleteCircular(circ.id)}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full py-16 text-center text-xs sm:text-sm text-slate-400 dark:text-white/30 italic font-bold">No circulars created yet</div>
                        )}
                    </div>
                </div>
            )}

            {/* Circular Modal */}
            <AnimatePresence>
                {showCircModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-[#0f172a] rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/10 w-full max-w-2xl overflow-hidden"
                        >
                            <div className="p-5 sm:p-6 space-y-4 sm:space-y-5">
                                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                                    {editingCirc ? 'Edit Circular' : 'Create New Circular'}
                                </h2>
                                <form onSubmit={handleSaveCircular} className="space-y-4">
                                    <Input
                                        label="Title"
                                        placeholder="Circular Title"
                                        value={circData.title}
                                        onChange={e => setCircData({...circData, title: e.target.value})}
                                        required
                                    />
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 dark:text-white/70 ml-1">Description</label>
                                        <textarea
                                            className="w-full p-3 bg-slate-50 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 rounded-xl text-xs sm:text-sm outline-none dark:text-white"
                                            rows="3"
                                            value={circData.description}
                                            onChange={e => setCircData({...circData, description: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Input
                                            label="Deadline"
                                            type="date"
                                            value={circData.deadline}
                                            onChange={e => setCircData({...circData, deadline: e.target.value})}
                                            required
                                        />
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-700 dark:text-white/70 ml-1">Status</label>
                                            <select
                                                className="w-full p-3 bg-slate-50 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 rounded-xl text-xs sm:text-sm outline-none dark:text-white cursor-pointer"
                                                value={circData.isActive}
                                                onChange={e => setCircData({...circData, isActive: e.target.value === 'true'})}
                                            >
                                                <option value="true">Active</option>
                                                <option value="false">Inactive</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="pt-3 flex gap-3">
                                        <Button type="submit" className="flex-1 bg-[#2D2A4F] hover:bg-[#1E1C38] text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm py-3 border-none">
                                            Save Circular
                                        </Button>
                                        <Button type="button" variant="secondary" className="rounded-xl sm:rounded-2xl font-bold text-xs text-slate-500 bg-transparent border-none px-6" onClick={() => setShowCircModal(false)}>
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Application Process Modal */}
            <AnimatePresence>
                {showAppModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-[#0f172a] rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/10 w-full max-w-xl overflow-hidden"
                        >
                            <div className="p-5 sm:p-6 space-y-4 sm:space-y-5">
                                <div className="flex items-center space-x-3.5">
                                    <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-100 dark:border-indigo-800 shrink-0">
                                        <FileText size={20} />
                                    </div>
                                    <div className="min-w-0">
                                        <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">{selectedApp?.studentName}</h2>
                                        <p className="text-[10px] text-slate-400 font-bold font-mono uppercase tracking-widest">{selectedApp?.registrationNo}</p>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl sm:rounded-2xl bg-slate-50/70 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10">
                                    <p className="text-[10px] font-black uppercase text-slate-400 dark:text-white/30 tracking-widest mb-1">Justification</p>
                                    <p className="text-xs sm:text-sm text-slate-700 dark:text-white/80 leading-relaxed max-h-[160px] overflow-y-auto font-medium">
                                        {selectedApp?.justification}
                                    </p>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-white/70 ml-1">Admin Remarks</label>
                                    <textarea
                                        className="w-full p-3 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 text-xs sm:text-sm outline-none dark:text-white"
                                        rows="3"
                                        placeholder="Add internal notes or feedback for the student..."
                                        value={appRemark}
                                        onChange={e => setAppRemark(e.target.value)}
                                    />
                                </div>

                                <div className="pt-2 grid grid-cols-2 gap-2.5">
                                    <Button
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl sm:rounded-2xl font-bold text-xs py-2.5 border-none"
                                        onClick={() => handleUpdateStatus('APPROVED')}
                                    >
                                        <Check size={15} className="mr-1.5" /> Approve
                                    </Button>
                                    <Button
                                        className="bg-red-600 hover:bg-red-700 text-white rounded-xl sm:rounded-2xl font-bold text-xs py-2.5 border-none"
                                        onClick={() => handleUpdateStatus('REJECTED')}
                                    >
                                        <X size={15} className="mr-1.5" /> Reject
                                    </Button>
                                    <Button
                                        className="col-span-2 bg-[#2D2A4F] hover:bg-[#1E1C38] text-white rounded-xl sm:rounded-2xl font-bold text-xs py-2.5 border-none"
                                        onClick={() => handleUpdateStatus('REVIEWING')}
                                    >
                                        <Clock size={15} className="mr-1.5" /> Mark as Reviewing
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        className="col-span-2 rounded-xl sm:rounded-2xl font-bold text-xs text-slate-500 bg-transparent border-none py-2"
                                        onClick={() => setShowAppModal(false)}
                                    >
                                        Close
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FinancialAidManagement;