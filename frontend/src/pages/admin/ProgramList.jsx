import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, GraduationCap, Building2, Award, PackageOpen, ChevronLeft, ChevronRight, ArrowUpDown, RefreshCw } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import StatCard from '../../components/common/StatCard';
import ProgramForm from './ProgramForm';
import { getPrograms, createProgram, updateProgram, deleteProgram } from '../../api/programApi';
import client from '../../api/client';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import useAuth from '../../hooks/useAuth';

const ProgramList = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [departments, setDepartments] = useState([]);

  // Pagination & Sorting State
  const [page, setPage] = useState(0);
  const [pageSize] = useState(8);
  const [totalElements, setTotalElements] = useState(0);
  const [sort, setSort] = useState({ key: 'name', direction: 'asc' });

  const { isAdmin } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchPrograms = async () => {
    const isInitial = programs.length === 0;
    if (isInitial) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await getPrograms({
        page,
        size: pageSize,
        sort: `${sort.key},${sort.direction}`,
        search: search || undefined,
        departmentId: selectedDept || undefined
      });
      setPrograms(res.data.content || res.data || []);
      setTotalElements(res.data.totalElements || (res.data.content ? res.data.content.length : 0));
    } catch (err) {
      toast.error('Failed to fetch programs');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const stats = useMemo(() => {
    const list = Array.isArray(programs) ? programs : [];
    return {
      total: totalElements,
      bachelors: list.filter(p => p.degreeLevel === 'BACHELOR').length,
      masters: list.filter(p => p.degreeLevel === 'MASTERS').length,
      phd: list.filter(p => p.degreeLevel === 'PHD').length
    };
  }, [programs, totalElements]);

  const fetchDepts = async () => {
    try {
      const res = await client.get('/departments');
      setDepartments(res.data.content || res.data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchPrograms();
  }, [selectedDept, page, sort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 0) fetchPrograms();
      else setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSort = (key) => {
    setSort(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  useEffect(() => {
    fetchDepts();
  }, []);

  const handleAddClick = () => {
    setEditingProgram(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (program) => {
    const deptId = program.departmentId || departments.find(d => d.name === program.departmentName)?.id;
    setEditingProgram({
      ...program,
      departmentId: deptId || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this program?')) return;
    try {
      await deleteProgram(id);
      toast.success('Program deleted successfully');
      fetchPrograms();
    } catch (err) {
      toast.error('Failed to delete program');
    }
  };

  const handleFormSubmit = async (data) => {
    setFormLoading(true);
    try {
      if (editingProgram) {
        await updateProgram(editingProgram.id, data);
        toast.success('Program updated successfully');
      } else {
        await createProgram(data);
        toast.success('Program created successfully');
      }
      setIsModalOpen(false);
      fetchPrograms();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  return (
      <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-20 pt-4">
        {/* Top Action Bar */}
        <div className="flex justify-end items-center gap-2 sm:gap-3">
          <Button onClick={fetchPrograms} variant="secondary" className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-white/10">
            <RefreshCw size={18} className={loading || refreshing ? 'animate-spin' : ''} />
          </Button>
          <Button onClick={handleAddClick} className="bg-[#2D2A4F] hover:bg-[#1E1C38] text-white flex items-center gap-2 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm py-2.5 px-4 border-none">
            <Plus size={16} />
            <span>Add Program</span>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard icon={GraduationCap} label="Total Programs" value={stats.total} color="primary" />
          <StatCard icon={Award} label="Bachelors" value={stats.bachelors} color="success" delay={0.1} />
          <StatCard icon={Award} label="Masters" value={stats.masters} color="info" delay={0.2} />
          <StatCard icon={Award} label="PhD Programs" value={stats.phd} color="warning" delay={0.3} />
        </div>

        <Card className="!p-0 overflow-hidden border border-slate-200/80 dark:border-white/10 rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-800/80">
          <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-white/[0.06] flex flex-col md:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <Input
                  placeholder="Search programs..."
                  icon={Search}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 sm:gap-3">
              <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="px-3.5 py-2.5 sm:py-3 bg-slate-50/70 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium outline-none dark:text-white transition-all cursor-pointer"
              >
                <option value="">All Departments</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[400px] relative">
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
            <table className={`w-full text-left transition-opacity duration-200 ${refreshing ? 'opacity-50' : 'opacity-100'}`}>
              <thead className="bg-slate-50/80 dark:bg-white/[0.03] text-slate-500 dark:text-white/30 uppercase text-[10px] font-bold tracking-widest border-b border-slate-100 dark:border-white/[0.06]">
              <tr>
                <th className="px-4 sm:px-6 py-3.5 cursor-pointer hover:text-[#007A55] transition-colors whitespace-nowrap" onClick={() => handleSort('name')}>
                  <div className="flex items-center space-x-1">
                    <span>Program Info</span>
                    <ArrowUpDown size={12} className={sort.key === 'name' ? 'text-[#007A55]' : 'opacity-30'} />
                  </div>
                </th>
                <th className="px-4 sm:px-6 py-3.5 whitespace-nowrap">Department</th>
                <th className="px-4 sm:px-6 py-3.5 text-center cursor-pointer hover:text-[#007A55] transition-colors whitespace-nowrap" onClick={() => handleSort('degreeLevel')}>
                  <div className="flex items-center justify-center space-x-1">
                    <span>Level</span>
                    <ArrowUpDown size={12} className={sort.key === 'degreeLevel' ? 'text-[#007A55]' : 'opacity-30'} />
                  </div>
                </th>
                <th className="px-4 sm:px-6 py-3.5 text-center cursor-pointer hover:text-[#007A55] transition-colors whitespace-nowrap" onClick={() => handleSort('durationYears')}>
                  <div className="flex items-center justify-center space-x-1">
                    <span>Duration</span>
                    <ArrowUpDown size={12} className={sort.key === 'durationYears' ? 'text-[#007A55]' : 'opacity-30'} />
                  </div>
                </th>
                <th className="px-4 sm:px-6 py-3.5 text-center cursor-pointer hover:text-[#007A55] transition-colors whitespace-nowrap" onClick={() => handleSort('totalCredits')}>
                  <div className="flex items-center justify-center space-x-1">
                    <span>Credits</span>
                    <ArrowUpDown size={12} className={sort.key === 'totalCredits' ? 'text-[#007A55]' : 'opacity-30'} />
                  </div>
                </th>
                <th className="px-4 sm:px-6 py-3.5 text-right whitespace-nowrap">Actions</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
              {loading && programs.length === 0 ? (
                  Array.from({ length: pageSize }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-4 sm:px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-32 mb-2"></div><div className="h-2 bg-slate-100 dark:bg-white/5 rounded w-20"></div></td>
                        <td className="px-4 sm:px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-24"></div></td>
                        <td className="px-4 sm:px-6 py-4"><div className="h-5 bg-slate-200 dark:bg-white/10 rounded w-16 mx-auto"></div></td>
                        <td className="px-4 sm:px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-8 mx-auto"></div></td>
                        <td className="px-4 sm:px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-8 mx-auto"></div></td>
                        <td className="px-4 sm:px-6 py-4"></td>
                      </tr>
                  ))
              ) : programs.length > 0 ? programs.map((p) => (
                  <motion.tr key={p.id} layout className="hover:bg-slate-50/60 dark:hover:bg-white/[0.04] transition-colors group">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-none">{p.name}</p>
                      <p className="text-[10px] font-medium text-slate-400 dark:text-white/30 mt-1 uppercase tracking-tighter">Academic Program</p>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-slate-500 dark:text-white/70">
                        <Building2 size={12} className="mr-1.5 shrink-0 opacity-70" />
                        <span className="text-xs font-medium">{p.departmentName}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center whitespace-nowrap">
                    <span className="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 text-[10px] font-black rounded uppercase">
                      {p.degreeLevel}
                    </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center whitespace-nowrap">
                      <div className="flex flex-col items-center">
                        <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">{p.durationYears}</span>
                        <span className="text-[8px] font-bold text-slate-400 dark:text-white/30 uppercase">Years</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center whitespace-nowrap">
                      <div className="flex flex-col items-center">
                        <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">{p.totalCredits}</span>
                        <span className="text-[8px] font-bold text-slate-400 dark:text-white/30 uppercase">Credits</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => handleEditClick(p)} className="p-1.5 sm:p-2 text-slate-400 hover:text-[#007A55] hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-all border border-transparent hover:border-emerald-100 dark:hover:border-emerald-500/20" title="Edit Program">
                          <Edit size={16} />
                        </button>
                        {isAdmin && (
                            <button onClick={() => handleDelete(p.id)} className="p-1.5 sm:p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-100 dark:hover:border-red-500/20" title="Delete Program">
                              <Trash2 size={16} />
                            </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
              )) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 sm:py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400 dark:text-white/20">
                        <PackageOpen size={40} strokeWidth={1} className="mb-3 opacity-50" />
                        <p className="text-base sm:text-lg font-bold text-slate-600 dark:text-white/40">No programs found</p>
                        <p className="text-xs sm:text-sm text-slate-400 dark:text-white/30 mt-0.5">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50/60 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500 dark:text-white/30">
              Showing {programs.length} of {totalElements} Programs
            </p>
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-white/30">Page {page + 1}</span>
              <div className="flex gap-1.5 sm:gap-2">
                <button
                    disabled={page === 0 || loading}
                    onClick={() => setPage(p => p - 1)}
                    className="p-2 sm:p-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 disabled:opacity-30 hover:bg-white dark:hover:bg-white/[0.06] transition-all text-slate-600 dark:text-white/50"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                    disabled={(page + 1) * pageSize >= totalElements || loading}
                    onClick={() => setPage(p => p + 1)}
                    className="p-2 sm:p-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 disabled:opacity-30 hover:bg-white dark:hover:bg-white/[0.06] transition-all text-slate-600 dark:text-white/50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </Card>

        <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={editingProgram ? 'Edit Program' : 'Add New Program'}
        >
          <ProgramForm
              program={editingProgram}
              onSubmit={handleFormSubmit}
              isLoading={formLoading}
          />
        </Modal>
      </div>
  );
};

export default ProgramList;