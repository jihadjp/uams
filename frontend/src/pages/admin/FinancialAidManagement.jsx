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
    getAllCirculars,
    getAllApplications,
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
            case 'APPROVED': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'REJECTED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            case 'REVIEWING': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            default: return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
        }
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white">Financial Aid Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Admin Portal</p>
                </div>
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl">
                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'applications' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400' : 'text-gray-500'}`}
                    >
                        Applications
                    </button>
                    <button
                        onClick={() => setActiveTab('circulars')}
                        className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'circulars' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400' : 'text-gray-500'}`}
                    >
                        Circulars
                    </button>
                </div>
            </div>

            {activeTab === 'applications' ? (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="!p-5 border-none bg-blue-500 text-white shadow-lg shadow-blue-500/20">
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-100">Pending</p>
                            <h3 className="text-3xl font-black mt-2">{applications?.filter(a => a.status === 'PENDING').length || 0}</h3>
                        </Card>
                        <Card className="!p-5 border-none bg-amber-500 text-white shadow-lg shadow-amber-500/20">
                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-100">Reviewing</p>
                            <h3 className="text-3xl font-black mt-2">{applications?.filter(a => a.status === 'REVIEWING').length || 0}</h3>
                        </Card>
                        <Card className="!p-5 border-none bg-green-500 text-white shadow-lg shadow-green-500/20">
                            <p className="text-[10px] font-black uppercase tracking-widest text-green-100">Approved</p>
                            <h3 className="text-3xl font-black mt-2">{applications?.filter(a => a.status === 'APPROVED').length || 0}</h3>
                        </Card>
                        <Card className="!p-5 border-none bg-red-500 text-white shadow-lg shadow-red-500/20">
                            <p className="text-[10px] font-black uppercase tracking-widest text-red-100">Rejected</p>
                            <h3 className="text-3xl font-black mt-2">{applications?.filter(a => a.status === 'REJECTED').length || 0}</h3>
                        </Card>
                    </div>

                    <Card className="!p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-100 dark:border-gray-800">
                                        <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Circular</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Income</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                                    {appLoading ? (
                                        <tr><td colSpan="5" className="py-20 text-center"><Loader /></td></tr>
                                    ) : applications?.length > 0 ? (
                                        applications.map((app) => (
                                            <tr key={app.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                                <td className="px-6 py-5">
                                                    <p className="text-sm font-black text-gray-900 dark:text-white">{app.studentName}</p>
                                                    <p className="text-[10px] text-gray-500 font-bold mt-1">{app.registrationNo}</p>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <p className="text-xs font-bold text-gray-600 dark:text-gray-400">{app.circularTitle}</p>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <p className="text-sm font-black text-gray-900 dark:text-white">${app.monthlyIncome}</p>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusBadge(app.status)}`}>
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-primary-600 text-xs font-black uppercase tracking-widest"
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
                                        <tr><td colSpan="5" className="py-20 text-center text-sm text-gray-500 italic font-bold">No applications found</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex justify-end px-1">
                        <Button
                            className="rounded-2xl font-black text-xs uppercase tracking-widest"
                            onClick={() => {
                                setEditingCirc(null);
                                setCircData({ title: '', description: '', eligibilityCriteria: '', benefitDetails: '', deadline: '', isActive: true });
                                setShowCircModal(true);
                            }}
                        >
                            <Plus size={16} className="mr-2" /> Create Circular
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {circLoading ? (
                            <div className="col-span-full py-20 text-center"><Loader /></div>
                        ) : circulars?.length > 0 ? (
                            circulars.map((circ) => (
                                <Card key={circ.id} className="relative flex flex-col group">
                                    <div className={`absolute top-0 right-0 p-3 rounded-bl-3xl text-[8px] font-black uppercase tracking-widest ${circ.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {circ.isActive ? 'Active' : 'Inactive'}
                                    </div>
                                    <h3 className="text-base font-black text-gray-900 dark:text-white mt-2">{circ.title}</h3>
                                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{circ.description}</p>

                                    <div className="mt-6 flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black uppercase text-gray-400">Deadline</span>
                                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{new Date(circ.deadline).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="p-2 bg-blue-50 text-blue-600 rounded-xl"
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
                                                className="p-2 bg-red-50 text-red-600 rounded-xl"
                                                onClick={() => handleDeleteCircular(circ.id)}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center text-sm text-gray-500 italic font-bold">No circulars created yet</div>
                        )}
                    </div>
                </div>
            )}

            {/* Circular Modal */}
            <AnimatePresence>
                {showCircModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-[#0f172a] rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 space-y-6">
                                <h2 className="text-xl font-black text-gray-900 dark:text-white">
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
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Description</label>
                                        <textarea
                                            className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none text-sm outline-none"
                                            rows="3"
                                            value={circData.description}
                                            onChange={e => setCircData({...circData, description: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Deadline"
                                            type="date"
                                            value={circData.deadline}
                                            onChange={e => setCircData({...circData, deadline: e.target.value})}
                                            required
                                        />
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Status</label>
                                            <select
                                                className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-none text-sm outline-none"
                                                value={circData.isActive}
                                                onChange={e => setCircData({...circData, isActive: e.target.value === 'true'})}
                                            >
                                                <option value="true">Active</option>
                                                <option value="false">Inactive</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="pt-4 flex gap-4">
                                        <Button type="submit" className="flex-1 rounded-2xl font-black text-xs uppercase tracking-widest">
                                            Save Circular
                                        </Button>
                                        <Button type="button" variant="ghost" className="rounded-2xl font-black text-xs uppercase tracking-widest px-8" onClick={() => setShowCircModal(false)}>
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
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-[#0f172a] rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-primary-50 dark:bg-primary-950/30 rounded-2xl text-primary-600">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black text-gray-900 dark:text-white">{selectedApp?.studentName}</h2>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{selectedApp?.registrationNo}</p>
                                    </div>
                                </div>

                                <div className="p-5 rounded-[2rem] bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Justification</p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed max-h-[200px] overflow-y-auto">
                                        {selectedApp?.justification}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Admin Remarks</label>
                                    <textarea
                                        className="w-full p-5 rounded-[2rem] bg-gray-50 dark:bg-gray-800 border-none text-sm outline-none"
                                        rows="3"
                                        placeholder="Add internal notes or feedback for the student..."
                                        value={appRemark}
                                        onChange={e => setAppRemark(e.target.value)}
                                    />
                                </div>

                                <div className="pt-4 grid grid-cols-2 gap-4">
                                    <Button
                                        className="bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest"
                                        onClick={() => handleUpdateStatus('APPROVED')}
                                    >
                                        <Check size={16} className="mr-2" /> Approve
                                    </Button>
                                    <Button
                                        className="bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest"
                                        onClick={() => handleUpdateStatus('REJECTED')}
                                    >
                                        <X size={16} className="mr-2" /> Reject
                                    </Button>
                                    <Button
                                        className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest"
                                        onClick={() => handleUpdateStatus('REVIEWING')}
                                    >
                                        <Clock size={16} className="mr-2" /> Mark as Reviewing
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="col-span-2 rounded-2xl font-black text-xs uppercase tracking-widest py-3"
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
