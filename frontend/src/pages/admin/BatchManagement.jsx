import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Trash2, Users, Layers, GraduationCap, ChevronRight, Hash, Building2, LayoutGrid, Sparkles } from 'lucide-react';
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
  const [selectedProgram, setSelectedProgram] = useState('');
  const [search, setSearch] = useState('');
  const { isAdmin } = useAuth();

  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [batchFormData, setBatchFormData] = useState({ batchNumber: '', programId: '' });
  const [sectionFormData, setSectionFormData] = useState({ name: '', batchId: '' });
  const [formLoading, setFormLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [progRes, batchRes] = await Promise.all([
        client.get('/programs'),
        client.get('/batches')
      ]);
      setPrograms(progRes.data.content || progRes.data || []);
      setBatches(batchRes.data || []);
    } catch (err) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await client.post('/batches', batchFormData);
      toast.success('Batch created successfully');
      setIsBatchModalOpen(false);
      setBatchFormData({ batchNumber: '', programId: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create batch');
    } finally {
      setFormLoading(false);
    }
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
    return batches.filter(b => {
      const matchesProgram = !selectedProgram || b.programId === selectedProgram;
      const matchesSearch = !search ||
        b.batchNumber.toLowerCase().includes(search.toLowerCase()) ||
        b.programName.toLowerCase().includes(search.toLowerCase());
      return matchesProgram && matchesSearch;
    });
  }, [batches, selectedProgram, search]);

  const stats = useMemo(() => {
    return {
      totalBatches: batches.length,
      totalSections: batches.reduce((acc, b) => acc + (b.sections?.length || 0), 0),
      programsWithBatches: new Set(batches.map(b => b.programId)).size,
      activePrograms: programs.length
    };
  }, [batches, programs]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Batch & Section Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Define available sections for academic batches by program.</p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search batches..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20 transition-all dark:text-white"
            />
          </div>
          <Button onClick={() => setIsBatchModalOpen(true)} className="flex items-center space-x-2 w-full md:w-auto">
            <Plus size={20} />
            <span>Create New Batch</span>
          </Button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Layers} label="Total Batches" value={stats.totalBatches} color="primary" />
        <StatCard icon={LayoutGrid} label="Total Sections" value={stats.totalSections} color="success" delay={0.1} />
        <StatCard icon={Building2} label="Programs" value={stats.programsWithBatches} color="info" delay={0.2} />
        <StatCard icon={Sparkles} label="Available" value={stats.activePrograms} color="warning" delay={0.3} />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Sidebar: Program Filter */}
        <div className="md:w-72 shrink-0 space-y-4">
           <Card className="p-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4 px-2">Filter by Program</h3>
              <div className="space-y-1">
                 <button
                   onClick={() => setSelectedProgram('')}
                   className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${!selectedProgram ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                 >
                   All Programs
                 </button>
                 {programs.map(p => (
                   <button
                     key={p.id}
                     onClick={() => setSelectedProgram(p.id)}
                     className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${selectedProgram === p.id ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                   >
                     {p.name}
                   </button>
                 ))}
              </div>
           </Card>
        </div>

        {/* Main Content: Batches Grid */}
        <div className="flex-1">
           {loading ? (
             <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl h-48 animate-pulse border border-gray-100 dark:border-gray-700">
                    <div className="h-14 bg-gray-100 dark:bg-gray-700 rounded-t-2xl"></div>
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-gray-50 dark:bg-gray-700 rounded w-1/4"></div>
                      <div className="flex gap-2">
                        <div className="h-8 bg-gray-50 dark:bg-gray-700 rounded w-16"></div>
                        <div className="h-8 bg-gray-50 dark:bg-gray-700 rounded w-16"></div>
                        <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded w-20 border-2 border-dashed border-gray-200"></div>
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
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                   >
                     <Card className="!p-0 overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 group/card">
                        <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-5 text-white flex justify-between items-center relative overflow-hidden">
                           <div className="absolute -right-4 -bottom-4 opacity-10 group-hover/card:scale-110 transition-transform duration-500">
                              <GraduationCap size={100} />
                           </div>
                           <div className="flex items-center space-x-4 relative z-10">
                              <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl shadow-inner">
                                 <GraduationCap size={22} />
                              </div>
                              <div>
                                 <h3 className="text-xl font-black leading-none tracking-tight">Batch {batch.batchNumber}</h3>
                                 <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 mt-1.5 flex items-center">
                                    <Building2 size={10} className="mr-1" />
                                    {batch.programName}
                                 </p>
                              </div>
                           </div>
                           <div className="flex items-center space-x-2 relative z-10">
                              {isAdmin && (
                                <button
                                  onClick={() => handleDeleteBatch(batch.id)}
                                  className="p-2 bg-white/10 hover:bg-red-500 rounded-xl transition-all duration-300 text-white/80 hover:text-white backdrop-blur-sm"
                                  title="Delete Batch"
                                >
                                   <Trash2 size={16} />
                                </button>
                              )}
                           </div>
                        </div>

                        <div className="p-6 space-y-5">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Manage Sections</span>
                              </div>
                              <span className="px-2.5 py-1 bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 rounded-lg text-[10px] font-black border border-gray-100 dark:border-gray-700">
                                {batch.sections?.length || 0} SECTIONS
                              </span>
                           </div>

                           <div className="flex flex-wrap gap-2.5">
                              {batch.sections?.map(section => (
                                <motion.div
                                  key={section.id}
                                  layout
                                  className="group/section relative"
                                >
                                   <div className="flex items-center space-x-2 px-3.5 py-2 bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:border-primary-200 dark:hover:border-primary-900/50 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200">
                                      <span className="text-primary-600 dark:text-primary-400">§</span>
                                      <span>Section {section.name}</span>
                                      {isAdmin && (
                                        <button
                                          onClick={() => handleDeleteSection(section.id)}
                                          className="opacity-0 group-hover/section:opacity-100 hover:text-red-500 transition-all ml-1 p-0.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
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
                                  className="px-4 py-2 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-xs font-black text-gray-400 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50/30 transition-all flex items-center group/add"
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
             <Card className="py-20 text-center border-dashed">
                <Users className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-lg font-bold text-gray-400">No batches found.</h3>
                <p className="text-sm text-gray-500 mt-1">Create a batch to start managing sections.</p>
             </Card>
           )}
        </div>
      </div>

      {/* Create Batch Modal */}
      <Modal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        title="Create New Batch"
      >
        <form onSubmit={handleCreateBatch} className="space-y-6">
           <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Academic Program</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Building2 size={18} />
                 </div>
                 <select
                   required
                   value={batchFormData.programId}
                   onChange={(e) => setBatchFormData({ ...batchFormData, programId: e.target.value })}
                   className="block w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
                 >
                   <option value="">Select Program</option>
                   {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                 </select>
              </div>
           </div>

           <Input
             label="Batch Number"
             required
             placeholder="e.g. 242"
             icon={Hash}
             value={batchFormData.batchNumber}
             onChange={(e) => setBatchFormData({ ...batchFormData, batchNumber: e.target.value })}
           />

           <div className="flex justify-end pt-4">
              <Button type="submit" isLoading={formLoading} className="px-12">Create Batch</Button>
           </div>
        </form>
      </Modal>

      {/* Add Section Modal */}
      <Modal
        isOpen={isSectionModalOpen}
        onClose={() => setIsSectionModalOpen(false)}
        title="Add New Section"
      >
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
           <div className="flex justify-end pt-4">
              <Button type="submit" isLoading={formLoading} className="px-12">Add Section</Button>
           </div>
        </form>
      </Modal>
    </div>
  );
};

export default BatchManagement;
