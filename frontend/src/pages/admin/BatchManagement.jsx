import { useState, useEffect, useMemo } from 'react';
import {
    Search,
    Plus,
    Trash2,
    Users,
    Layers,
    GraduationCap,
    Hash,
    Building2,
    LayoutGrid,
    Sparkles,
    RefreshCw,
    Edit2,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import StatCard from '../../components/common/StatCard';
import client from '../../api/client';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../../hooks/useAuth';

const BatchManagement = () => {
    const [programs, setPrograms] = useState([]);
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedProgram, setSelectedProgram] = useState('');
    const [search, setSearch] = useState('');
    const { isAdmin } = useAuth();

    const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
    const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
    const [editingBatch, setEditingBatch] = useState(null);
    const [batchFormData, setBatchFormData] = useState({
        batchNumber: '',
        programId: '',
        admissionYear: new Date().getFullYear(),
        term: 'SPRING',
    });
    const [sectionFormData, setSectionFormData] = useState({ name: '', batchId: '' });
    const [formLoading, setFormLoading] = useState(false);
    const [loadingNextNumber, setLoadingNextNumber] = useState(false);

    const resetBatchForm = () => {
        setBatchFormData({
            batchNumber: '',
            programId: '',
            admissionYear: new Date().getFullYear(),
            term: 'SPRING',
        });
        setEditingBatch(null);
    };

    const fetchData = async () => {
        const isInitial = batches.length === 0;
        if (isInitial) setLoading(true);
        else setRefreshing(true);

        try {
            const [progRes, batchRes] = await Promise.all([client.get('/programs'), client.get('/batches')]);
            setPrograms(progRes.data.content || progRes.data || []);
            setBatches(batchRes.data || []);
        } catch (err) {
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Dynamic Batch Number
    useEffect(() => {
        let isMounted = true;
        const fetchNextBatchNumber = async () => {
            if (batchFormData.programId && !editingBatch && isBatchModalOpen) {
                setLoadingNextNumber(true);
                try {
                    const res = await client.get(`/batches/next-number?programId=${batchFormData.programId}`);
                    if (isMounted) {
                        setBatchFormData((prev) => ({ ...prev, batchNumber: res.data.toString() }));
                    }
                } catch (err) {
                    console.error('Failed to fetch next batch number', err);
                } finally {
                    if (isMounted) setLoadingNextNumber(false);
                }
            }
        };
        fetchNextBatchNumber();
        return () => {
            isMounted = false;
        };
    }, [batchFormData.programId, editingBatch, isBatchModalOpen]);

    const handleCreateBatch = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            if (editingBatch) {
                await client.put(`/batches/${editingBatch.id}`, batchFormData);
                toast.success('Batch updated successfully');
            } else {
                await client.post('/batches', batchFormData);
                toast.success('Batch created successfully');
            }
            setIsBatchModalOpen(false);
            resetBatchForm();
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save batch');
        } finally {
            setFormLoading(false);
        }
    };

    const handleEditBatch = (batch) => {
        setEditingBatch(batch);
        setBatchFormData({
            batchNumber: batch.batchNumber,
            programId: batch.programId,
            admissionYear: batch.admissionYear || new Date().getFullYear(),
            term: batch.term || 'SPRING',
        });
        setIsBatchModalOpen(true);
    };

    const handleAddSection = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            await client.post('/batches/sections', sectionFormData);
            toast.success('Section added successfully');
            setIsSectionModalOpen(false);
            setSectionFormData({ name: '', batchId: '' });
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add section');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteBatch = async (id) => {
        if (!window.confirm('Delete this batch and all its sections?')) return;
        try {
            await client.delete(`/batches/${id}`);
            toast.success('Batch deleted');
            fetchData();
        } catch (err) {
            toast.error('Failed to delete batch');
        }
    };

    const handleDeleteSection = async (id) => {
        if (!window.confirm('Delete this section?')) return;
        try {
            await client.delete(`/batches/sections/${id}`);
            toast.success('Section deleted');
            fetchData();
        } catch (err) {
            toast.error('Failed to delete section');
        }
    };

    const filteredBatches = useMemo(() => {
        return batches.filter((b) => {
            const matchesProgram = !selectedProgram || b.programId === selectedProgram;
            const matchesSearch =
                !search ||
                b.batchNumber.toLowerCase().includes(search.toLowerCase()) ||
                b.programName.toLowerCase().includes(search.toLowerCase());
            return matchesProgram && matchesSearch;
        });
    }, [batches, selectedProgram, search]);

    const stats = useMemo(() => {
        return {
            totalBatches: batches.length,
            totalSections: batches.reduce((acc, b) => acc + (b.sections?.length || 0), 0),
            programsWithBatches: new Set(batches.map((b) => b.programId)).size,
            activePrograms: programs.length,
        };
    }, [batches, programs]);

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Batch & Section Management</h1>
                    <p className="text-slate-500 dark:text-white/40 mt-1 text-sm font-medium">Define available sections for academic batches by program — Royal Bengal University</p>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-64 group">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30 group-focus-within:text-[#007A55] transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search batches..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-[#0B1225] border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-medium outline-none focus:border-[#007A55] focus:ring-4 focus:ring-[#007A55]/10 transition-all dark:text-white"
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Button onClick={fetchData} variant="secondary" className="p-2.5">
                            <RefreshCw size={18} className={loading || refreshing ? 'animate-spin' : ''} />
                        </Button>
                        <Button
                            onClick={() => {
                                resetBatchForm();
                                setIsBatchModalOpen(true);
                            }}
                            className="flex items-center gap-2 flex-1 md:flex-none justify-center"
                        >
                            <Plus size={18} />
                            <span>Create New Batch</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Layers} label="Total Batches" value={stats.totalBatches} color="primary" />
                <StatCard icon={LayoutGrid} label="Total Sections" value={stats.totalSections} color="success" delay={0.1} />
                <StatCard icon={Building2} label="Programs" value={stats.programsWithBatches} color="info" delay={0.2} />
                <StatCard icon={Sparkles} label="Available" value={stats.activePrograms} color="warning" delay={0.3} />
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-72 shrink-0 space-y-4">
                    <Card className="!p-4">
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 mb-4 px-2">Filter by Program</h3>
                        <div className="space-y-1">
                            <button
                                onClick={() => setSelectedProgram('')}
                                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                    !selectedProgram
                                        ? 'bg-gradient-to-r from-[#007A55] to-[#00956A] text-white shadow-lg shadow-emerald-700/20'
                                        : 'text-slate-500 dark:text-white/40 hover:bg-slate-50 dark:hover:bg-white/[0.06]'
                                }`}
                            >
                                All Programs
                            </button>
                            {programs.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => setSelectedProgram(p.id)}
                                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all truncate ${
                                        selectedProgram === p.id
                                            ? 'bg-gradient-to-r from-[#007A55] to-[#00956A] text-white shadow-lg shadow-emerald-700/20'
                                            : 'text-slate-500 dark:text-white/40 hover:bg-slate-50 dark:hover:bg-white/[0.06]'
                                    }`}
                                >
                                    {p.name}
                                </button>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="flex-1 relative">
                    {refreshing && (
                        <div className="absolute inset-x-0 top-0 h-0.5 bg-emerald-500/10 overflow-hidden z-20">
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                className="h-full w-1/3 bg-[#007A55]"
                            />
                        </div>
                    )}
                    <div className={`transition-opacity duration-200 ${refreshing ? 'opacity-50' : 'opacity-100'}`}>
                        {loading && batches.length === 0 ? (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="bg-white dark:bg-[#0B1225] rounded-2xl h-48 animate-pulse border border-slate-200 dark:border-white/10">
                                        <div className="h-14 bg-slate-100 dark:bg-white/[0.06] rounded-t-2xl" />
                                        <div className="p-6 space-y-3">
                                            <div className="h-4 bg-slate-50 dark:bg-white/[0.04] rounded w-1/4" />
                                            <div className="flex gap-2">
                                                <div className="h-8 bg-slate-50 dark:bg-white/[0.04] rounded w-16" />
                                                <div className="h-8 bg-slate-50 dark:bg-white/[0.04] rounded w-16" />
                                                <div className="h-8 bg-slate-100 dark:bg-white/[0.06] rounded w-20 border-2 border-dashed border-slate-200" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredBatches.length > 0 ? (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                <AnimatePresence mode="popLayout">
                                    {filteredBatches.map((batch) => (
                                        <motion.div
                                            key={batch.id}
                                            initial={{ opacity: 0, scale: 0.96 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.96 }}
                                            transition={{ ease: [0.22, 1, 0.36, 1] }}
                                        >
                                            <Card className="!p-0 overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 group/card">
                                                <div className="bg-gradient-to-r from-[#007A55] to-[#00956A] p-5 text-white flex justify-between items-center relative overflow-hidden">
                                                    <div className="absolute -right-6 -bottom-6 opacity-10 group-hover/card:scale-110 transition-transform duration-500">
                                                        <GraduationCap size={90} />
                                                    </div>
                                                    <div className="flex items-center gap-4 relative z-10">
                                                        <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl shadow-inner border border-white/10">
                                                            <GraduationCap size={20} />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-[18px] font-black leading-none tracking-tight">Batch {batch.batchNumber}</h3>
                                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/20 px-2 py-0.5 rounded mt-2 w-fit border border-white/10">
                                                                Initial: {batch.batchInitial}
                                                            </p>
                                                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-80 mt-2 flex items-center">
                                                                <Building2 size={10} className="mr-1" />
                                                                {batch.programName}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 relative z-10">
                                                        {isAdmin && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleEditBatch(batch)}
                                                                    className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white/80 hover:text-white backdrop-blur-sm border border-white/10"
                                                                    title="Edit Batch"
                                                                >
                                                                    <Edit2 size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteBatch(batch.id)}
                                                                    className="p-2 bg-white/10 hover:bg-red-500 rounded-xl transition-all text-white/80 hover:text-white backdrop-blur-sm border border-white/10"
                                                                    title="Delete Batch"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="p-6 space-y-5 bg-white dark:bg-[#0B1225]">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[#007A55]" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30">Manage Sections</span>
                                                        </div>
                                                        <span className="px-2.5 py-1 bg-slate-50 dark:bg-white/[0.06] text-slate-500 dark:text-white/40 rounded-lg text-[10px] font-black border border-slate-100 dark:border-white/10">
                              {batch.sections?.length || 0} SECTIONS
                            </span>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2.5">
                                                        {batch.sections?.map((section) => (
                                                            <motion.div key={section.id} layout className="group/section relative">
                                                                <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-700 dark:text-white/70 hover:border-[#007A55]/30 hover:bg-white dark:hover:bg-white/[0.06] transition-all">
                                                                    <span className="text-[#007A55]">§</span>
                                                                    <span>Section {section.name}</span>
                                                                    {isAdmin && (
                                                                        <button
                                                                            onClick={() => handleDeleteSection(section.id)}
                                                                            className="opacity-0 group-hover/section:opacity-100 hover:text-red-500 transition-all ml-1 p-0.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded"
                                                                        >
                                                                            <Trash2 size={12} />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                        {isAdmin && (
                                                            <button
                                                                onClick={() => {
                                                                    setSectionFormData({ ...sectionFormData, batchId: batch.id });
                                                                    setIsSectionModalOpen(true);
                                                                }}
                                                                className="px-4 py-2 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl text-xs font-black tracking-wider text-slate-400 dark:text-white/30 hover:border-[#007A55] hover:text-[#007A55] hover:bg-emerald-50/50 dark:hover:bg-emerald-500/10 transition-all flex items-center group/add"
                                                            >
                                                                <Plus size={14} className="mr-1.5 group-hover/add:rotate-90 transition-transform" />
                                                                ADD SECTION
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Card className="py-20 text-center border-dashed border-slate-300 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
                                <Users className="mx-auto text-slate-300 dark:text-white/10 mb-4" size={44} />
                                <h3 className="text-[16px] font-bold tracking-tight text-slate-500 dark:text-white/40">No batches found.</h3>
                                <p className="text-sm text-slate-400 dark:text-white/30 mt-1">Create a batch to start managing sections.</p>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {/* Create/Edit Batch Modal */}
            <Modal isOpen={isBatchModalOpen} onClose={() => setIsBatchModalOpen(false)} title={editingBatch ? 'Edit Batch' : 'Create New Batch'}>
                <form onSubmit={handleCreateBatch} className="space-y-6">
                    <div>
                        <label className="mb-2 block text-xs font-bold text-slate-700 dark:text-white/60 ml-1">Academic Program</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                <Building2 size={18} />
                            </div>
                            <select
                                required
                                value={batchFormData.programId}
                                onChange={(e) => setBatchFormData({ ...batchFormData, programId: e.target.value })}
                                className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-medium outline-none focus:border-[#007A55] focus:ring-4 focus:ring-[#007A55]/10 dark:text-white transition-all"
                            >
                                <option value="">Select Program</option>
                                {programs.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Admission Year"
                            type="number"
                            required
                            value={batchFormData.admissionYear}
                            onChange={(e) => setBatchFormData({ ...batchFormData, admissionYear: e.target.value })}
                        />
                        <div>
                            <label className="mb-2 block text-xs font-bold text-slate-700 dark:text-white/60 ml-1">Admission Term</label>
                            <select
                                required
                                value={batchFormData.term}
                                onChange={(e) => setBatchFormData({ ...batchFormData, term: e.target.value })}
                                className="block w-full px-4 py-3.5 bg-slate-50 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-medium outline-none focus:border-[#007A55] focus:ring-4 focus:ring-[#007A55]/10 dark:text-white transition-all"
                            >
                                <option value="SPRING">SPRING (1)</option>
                                <option value="SUMMER">SUMMER (2)</option>
                                <option value="FALL">FALL (3)</option>
                            </select>
                        </div>
                    </div>

                    <div className="relative">
                        <Input
                            label="Ordinal Batch Number"
                            required
                            placeholder={loadingNextNumber ? 'Fetching...' : 'e.g. 67'}
                            icon={Hash}
                            value={batchFormData.batchNumber}
                            onChange={(e) => setBatchFormData({ ...batchFormData, batchNumber: e.target.value })}
                            className={loadingNextNumber ? 'opacity-70' : ''}
                        />
                        {loadingNextNumber && (
                            <div className="absolute right-4 top-[38px]">
                                <RefreshCw size={14} className="animate-spin text-[#007A55]" />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button type="submit" isLoading={formLoading} className="px-10">
                            {editingBatch ? 'Update Batch' : 'Create Batch'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Add Section Modal */}
            <Modal isOpen={isSectionModalOpen} onClose={() => setIsSectionModalOpen(false)} title="Add New Section">
                <form onSubmit={handleAddSection} className="space-y-6">
                    <Input
                        label="Section Name"
                        required
                        placeholder="e.g. A, B, C or 1, 2, 3"
                        icon={Layers}
                        value={sectionFormData.name}
                        onChange={(e) => setSectionFormData({ ...sectionFormData, name: e.target.value })}
                        autoFocus
                    />
                    <div className="flex justify-end pt-2">
                        <Button type="submit" isLoading={formLoading} className="px-10">
                            Add Section
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default BatchManagement;
