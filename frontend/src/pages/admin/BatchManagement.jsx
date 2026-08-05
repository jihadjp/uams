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
        <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-20 pt-4">
            {/* Top Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="relative w-full sm:w-80 group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30 group-focus-within:text-[#007A55] transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="Search batches..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0B1225] border border-slate-200/80 dark:border-white/10 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium outline-none transition-all dark:text-white"
                    />
                </div>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <Button onClick={fetchData} variant="secondary" className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-white/10">
                        <RefreshCw size={18} className={loading || refreshing ? 'animate-spin' : ''} />
                    </Button>
                    <Button
                        onClick={() => {
                            resetBatchForm();
                            setIsBatchModalOpen(true);
                        }}
                        className="bg-[#2D2A4F] hover:bg-[#1E1C38] text-white flex items-center gap-2 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm py-2.5 px-4 border-none"
                    >
                        <Plus size={16} />
                        <span>Create New Batch</span>
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatCard icon={Layers} label="Total Batches" value={stats.totalBatches} color="primary" />
                <StatCard icon={LayoutGrid} label="Total Sections" value={stats.totalSections} color="success" delay={0.1} />
                <StatCard icon={Building2} label="Programs" value={stats.programsWithBatches} color="info" delay={0.2} />
                <StatCard icon={Sparkles} label="Available" value={stats.activePrograms} color="warning" delay={0.3} />
            </div>

            {/* Main Content Layout */}
            <div className="flex flex-col md:flex-row gap-6">
                {/* Program Filter Sidebar */}
                <div className="md:w-72 shrink-0 space-y-4">
                    <Card className="border border-slate-200/80 dark:border-white/10 rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-800/80 !p-4 sm:!p-5">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 mb-3 px-1">Filter by Program</h3>
                        <div className="space-y-1">
                            <button
                                onClick={() => setSelectedProgram('')}
                                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                                    !selectedProgram
                                        ? 'bg-[#007A55] text-white'
                                        : 'text-slate-600 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/[0.06]'
                                }`}
                            >
                                All Programs
                            </button>
                            {programs.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => setSelectedProgram(p.id)}
                                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all truncate ${
                                        selectedProgram === p.id
                                            ? 'bg-[#007A55] text-white'
                                            : 'text-slate-600 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/[0.06]'
                                    }`}
                                >
                                    {p.name}
                                </button>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Batches Grid */}
                <div className="flex-1 relative min-w-0">
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
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="bg-white dark:bg-[#0B1225] rounded-2xl sm:rounded-3xl h-48 animate-pulse border border-slate-200/80 dark:border-white/10">
                                        <div className="h-14 bg-slate-100 dark:bg-white/[0.06] rounded-t-2xl sm:rounded-t-3xl" />
                                        <div className="p-5 space-y-3">
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
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                                <AnimatePresence mode="popLayout">
                                    {filteredBatches.map((batch) => (
                                        <motion.div
                                            key={batch.id}
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.98 }}
                                            transition={{ ease: [0.22, 1, 0.36, 1] }}
                                        >
                                            <Card className="!p-0 overflow-hidden border border-slate-200/80 dark:border-white/10 rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-800/80 hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-colors group/card">
                                                {/* Header Banner */}
                                                <div className="bg-[#0B1225] p-4 sm:p-5 text-white flex justify-between items-center relative overflow-hidden border-b border-slate-200/80 dark:border-white/10">
                                                    <div className="absolute -right-6 -bottom-6 opacity-10 group-hover/card:scale-110 transition-transform duration-500">
                                                        <GraduationCap size={90} />
                                                    </div>
                                                    <div className="flex items-center gap-3.5 relative z-10">
                                                        <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 shrink-0">
                                                            <GraduationCap size={20} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h3 className="text-base sm:text-lg font-black leading-none tracking-tight">Batch {batch.batchNumber}</h3>
                                                            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded mt-1.5 w-fit border border-white/10">
                                                                Initial: {batch.batchInitial}
                                                            </p>
                                                            <p className="text-[10px] font-bold uppercase tracking-wider opacity-80 mt-1 flex items-center truncate">
                                                                <Building2 size={10} className="mr-1 shrink-0" />
                                                                <span className="truncate">{batch.programName}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 relative z-10 shrink-0">
                                                        {isAdmin && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleEditBatch(batch)}
                                                                    className="p-1.5 sm:p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white/80 hover:text-white border border-white/10"
                                                                    title="Edit Batch"
                                                                >
                                                                    <Edit2 size={15} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteBatch(batch.id)}
                                                                    className="p-1.5 sm:p-2 bg-white/10 hover:bg-red-500 rounded-xl transition-all text-white/80 hover:text-white border border-white/10"
                                                                    title="Delete Batch"
                                                                >
                                                                    <Trash2 size={15} />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="p-4 sm:p-5 space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[#007A55]" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30">Manage Sections</span>
                                                        </div>
                                                        <span className="px-2.5 py-0.5 bg-slate-50 dark:bg-white/[0.06] text-slate-500 dark:text-white/40 rounded-lg text-[9px] sm:text-[10px] font-black border border-slate-100 dark:border-white/10">
                                                            {batch.sections?.length || 0} SECTIONS
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2">
                                                        {batch.sections?.map((section) => (
                                                            <motion.div key={section.id} layout className="group/section relative">
                                                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50/70 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-white/70 hover:border-[#007A55]/30 transition-all">
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
                                                                className="px-3 py-1.5 border border-dashed border-slate-200 dark:border-white/10 rounded-xl text-xs font-black tracking-wider text-slate-400 dark:text-white/30 hover:border-[#007A55] hover:text-[#007A55] transition-all flex items-center group/add"
                                                            >
                                                                <Plus size={14} className="mr-1 group-hover/add:rotate-90 transition-transform" />
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
                            <Card className="py-16 text-center border border-dashed border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] rounded-2xl sm:rounded-3xl">
                                <Users className="mx-auto text-slate-300 dark:text-white/10 mb-3" size={36} />
                                <h3 className="text-sm sm:text-base font-bold tracking-tight text-slate-500 dark:text-white/40">No batches found.</h3>
                                <p className="text-xs text-slate-400 dark:text-white/30 mt-0.5">Create a batch to start managing sections.</p>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {/* Create/Edit Batch Modal */}
            <Modal isOpen={isBatchModalOpen} onClose={() => setIsBatchModalOpen(false)} title={editingBatch ? 'Edit Batch' : 'Create New Batch'}>
                <form onSubmit={handleCreateBatch} className="space-y-4 sm:space-y-5">
                    <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-white/60 ml-1">Academic Program</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <Building2 size={16} />
                            </div>
                            <select
                                required
                                value={batchFormData.programId}
                                onChange={(e) => setBatchFormData({ ...batchFormData, programId: e.target.value })}
                                className="block w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium outline-none dark:text-white transition-all cursor-pointer"
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="Admission Year"
                            type="number"
                            required
                            value={batchFormData.admissionYear}
                            onChange={(e) => setBatchFormData({ ...batchFormData, admissionYear: e.target.value })}
                        />
                        <div>
                            <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-white/60 ml-1">Admission Term</label>
                            <select
                                required
                                value={batchFormData.term}
                                onChange={(e) => setBatchFormData({ ...batchFormData, term: e.target.value })}
                                className="block w-full px-4 py-3 bg-slate-50 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium outline-none dark:text-white transition-all cursor-pointer"
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
                            <div className="absolute right-4 top-[36px]">
                                <RefreshCw size={14} className="animate-spin text-[#007A55]" />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button type="submit" isLoading={formLoading} className="w-full sm:w-auto px-8 bg-[#2D2A4F] hover:bg-[#1E1C38] text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm py-3 border-none">
                            {editingBatch ? 'Update Batch' : 'Create Batch'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Add Section Modal */}
            <Modal isOpen={isSectionModalOpen} onClose={() => setIsSectionModalOpen(false)} title="Add New Section">
                <form onSubmit={handleAddSection} className="space-y-4 sm:space-y-5">
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
                        <Button type="submit" isLoading={formLoading} className="w-full sm:w-auto px-8 bg-[#2D2A4F] hover:bg-[#1E1C38] text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm py-3 border-none">
                            Add Section
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default BatchManagement;