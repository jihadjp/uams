import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, GraduationCap, Building2, Clock, Award, PackageOpen, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import StatCard from '../../components/common/StatCard';
import ProgramForm from './ProgramForm';
import { getPrograms, createProgram, updateProgram, deleteProgram } from '../../api/programApi';
import client from '../../api/client';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../../hooks/useAuth';

const ProgramList = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Programs</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage academic degree programs and requirements.</p>
        </div>
        <Button onClick={handleAddClick} className="flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Program</span>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={GraduationCap} label="Total Programs" value={stats.total} color="primary" />
        <StatCard icon={Award} label="Bachelors" value={stats.bachelors} color="success" delay={0.1} />
        <StatCard icon={Award} label="Masters" value={stats.masters} color="info" delay={0.2} />
        <StatCard icon={Award} label="PhD Programs" value={stats.phd} color="warning" delay={0.3} />
      </div>

      <Card className="!p-0">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4">
           <div className="flex-1">
             <Input
               placeholder="Search programs..."
               icon={Search}
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
           </div>
           <div className="flex gap-4">
             <select
               value={selectedDept}
               onChange={(e) => setSelectedDept(e.target.value)}
               className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
             >
               <option value="">All Departments</option>
               {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
             </select>
           </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4 cursor-pointer hover:text-primary-500 transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center space-x-1">
                    <span>Program Info</span>
                    <ArrowUpDown size={12} className={sort.key === 'name' ? 'text-primary-500' : 'opacity-30'} />
                  </div>
                </th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4 text-center cursor-pointer hover:text-primary-500 transition-colors" onClick={() => handleSort('degreeLevel')}>
                  <div className="flex items-center justify-center space-x-1">
                    <span>Level</span>
                    <ArrowUpDown size={12} className={sort.key === 'degreeLevel' ? 'text-primary-500' : 'opacity-30'} />
                  </div>
                </th>
                <th className="px-6 py-4 text-center cursor-pointer hover:text-primary-500 transition-colors" onClick={() => handleSort('durationYears')}>
                  <div className="flex items-center justify-center space-x-1">
                    <span>Duration</span>
                    <ArrowUpDown size={12} className={sort.key === 'durationYears' ? 'text-primary-500' : 'opacity-30'} />
                  </div>
                </th>
                <th className="px-6 py-4 text-center cursor-pointer hover:text-primary-500 transition-colors" onClick={() => handleSort('totalCredits')}>
                  <div className="flex items-center justify-center space-x-1">
                    <span>Credits</span>
                    <ArrowUpDown size={12} className={sort.key === 'totalCredits' ? 'text-primary-500' : 'opacity-30'} />
                  </div>
                </th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                Array.from({ length: pageSize }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div><div className="h-2 bg-gray-100 dark:bg-gray-800 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8 mx-auto"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8 mx-auto"></div></td>
                    <td className="px-6 py-4"></td>
                  </tr>
                ))
              ) : programs.length > 0 ? programs.map((p) => (
                <motion.tr key={p.id} layout className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">{p.name}</p>
                    <p className="text-[10px] font-medium text-gray-400 mt-1 uppercase tracking-tighter">Academic Program</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                       <Building2 size={12} className="mr-1.5" />
                       <span className="text-xs font-medium">{p.departmentName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 text-[10px] font-black rounded uppercase">
                      {p.degreeLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                       <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{p.durationYears}</span>
                       <span className="text-[8px] font-bold text-gray-400 uppercase">Years</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                       <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{p.totalCredits}</span>
                       <span className="text-[8px] font-bold text-gray-400 uppercase">Credits</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleEditClick(p)} className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all">
                        <Edit size={16} />
                      </button>
                      {isAdmin && (
                        <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <PackageOpen size={48} strokeWidth={1} className="mb-4 opacity-50" />
                      <p className="text-lg font-medium">No programs found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/20 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">
            Showing {programs.length} of {totalElements} Programs
          </p>
          <div className="flex items-center space-x-4">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Page {page + 1}</span>
            <div className="flex space-x-2">
              <button
                disabled={page === 0 || loading}
                onClick={() => setPage(p => p - 1)}
                className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-white dark:hover:bg-gray-800 transition-all text-gray-600 dark:text-gray-400"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={(page + 1) * pageSize >= totalElements || loading}
                onClick={() => setPage(p => p + 1)}
                className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-white dark:hover:bg-gray-800 transition-all text-gray-600 dark:text-gray-400"
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
