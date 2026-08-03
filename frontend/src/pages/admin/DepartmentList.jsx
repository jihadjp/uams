import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Building2,
  Hash,
  Users,
  GraduationCap,
  PackageOpen,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import StatCard from '../../components/common/StatCard';
import DepartmentForm from './DepartmentForm';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../../api/departmentApi';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const [page, setPage] = useState(0);
  const [pageSize] = useState(8);
  const [totalElements, setTotalElements] = useState(0);
  const [sort, setSort] = useState({ key: 'name', direction: 'asc' });

  const { isAdmin } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchDepartments = async () => {
    const isInitial = departments.length === 0;
    if (isInitial) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await getDepartments({
        page,
        size: pageSize,
        sort: `${sort.key},${sort.direction}`,
        search: search || undefined,
      });
      setDepartments(res.data.content || res.data || []);
      setTotalElements(res.data?.totalElements || (res.data.content ? res.data.content.length : 0));
    } catch (err) {
      toast.error('Failed to fetch departments');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const stats = useMemo(() => {
    const list = Array.isArray(departments) ? departments : [];
    return {
      total: totalElements,
      totalFaculty: list.reduce((acc, curr) => acc + (curr.totalFaculty || 0), 0),
      totalStudents: list.reduce((acc, curr) => acc + (curr.totalStudents || 0), 0),
      headsAssigned: list.filter((d) => d.headFacultyName && d.headFacultyName !== 'Not Assigned').length,
    };
  }, [departments, totalElements]);

  useEffect(() => {
    fetchDepartments();
  }, [page, sort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 0) fetchDepartments();
      else setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSort = (key) => {
    setSort((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleAddClick = () => {
    setEditingDept(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (dept) => {
    setEditingDept(dept);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this department? This may affect associated programs and courses.')) return;
    try {
      await deleteDepartment(id);
      toast.success('Department deleted');
      fetchDepartments();
    } catch (err) {
      toast.error('Failed to delete department');
    }
  };

  const handleFormSubmit = async (data) => {
    setFormLoading(true);
    try {
      if (editingDept) {
        await updateDepartment(editingDept.id, data);
        toast.success('Department updated');
      } else {
        await createDepartment(data);
        toast.success('Department created');
      }
      setIsModalOpen(false);
      fetchDepartments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  return (
      <div className="space-y-6 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Departments</h1>
            <p className="text-slate-500 dark:text-white/40 mt-1 text-sm font-medium">Manage university departments and faculty heads.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={fetchDepartments} variant="secondary" className="p-2.5">
              <RefreshCw size={18} className={loading || refreshing ? 'animate-spin' : ''} />
            </Button>
            <Button onClick={handleAddClick} className="flex items-center gap-2">
              <Plus size={18} />
              <span>Add Department</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Building2} label="Total Depts" value={stats.total} color="primary" />
          <StatCard icon={Users} label="Total Faculty" value={stats.totalFaculty} color="success" delay={0.1} />
          <StatCard icon={GraduationCap} label="Total Students" value={stats.totalStudents} color="info" delay={0.2} />
          <StatCard icon={ShieldCheck} label="Heads Assigned" value={stats.headsAssigned} color="warning" delay={0.3} />
        </div>

        <Card className="!p-0 overflow-visible">
          <div className="p-6 border-b border-slate-100 dark:border-white/[0.06]">
            <Input
                placeholder="Search by department name or code..."
                icon={Search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
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
              <thead className="bg-slate-50 dark:bg-white/[0.03] text-slate-500 dark:text-white/30 uppercase text-[10px] font-bold tracking-widest">
              <tr>
                <th className="px-6 py-4 cursor-pointer hover:text-[#007A55] transition-colors" onClick={() => handleSort('deptNumber')}>
                  <div className="flex items-center gap-1">
                    <span>#</span>
                    <ArrowUpDown size={12} className={sort.key === 'deptNumber' ? 'text-[#007A55]' : 'opacity-30'} />
                  </div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-[#007A55] transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">
                    <span>Department Info</span>
                    <ArrowUpDown size={12} className={sort.key === 'name' ? 'text-[#007A55]' : 'opacity-30'} />
                  </div>
                </th>
                <th className="px-6 py-4 text-center">Stats</th>
                <th className="px-6 py-4">Head of Dept</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
              {loading && departments.length === 0 ? (
                  Array.from({ length: pageSize }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4">
                          <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-8" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-32 mb-2" />
                          <div className="h-2 bg-slate-100 dark:bg-white/5 rounded w-16" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-24 mx-auto" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-24" />
                        </td>
                        <td className="px-6 py-4" />
                      </tr>
                  ))
              ) : departments.length > 0 ? (
                  departments.map((dept) => (
                      <motion.tr key={dept.id} layout className="hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors group">
                        <td className="px-6 py-4">
                          <span className="font-mono font-black text-[#007A55] dark:text-emerald-300">{dept.deptNumber}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-none">{dept.name}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 mt-1">{dept.code}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-6">
                            <div className="text-center">
                              <div className="flex items-center gap-1 text-slate-400 dark:text-white/30 mb-0.5 justify-center">
                                <Users size={12} />
                                <span className="text-[10px] font-bold uppercase">Faculty</span>
                              </div>
                              <p className="text-sm font-black tracking-tight text-slate-900 dark:text-white">{dept.totalFaculty}</p>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center gap-1 text-slate-400 dark:text-white/30 mb-0.5 justify-center">
                                <GraduationCap size={12} />
                                <span className="text-[10px] font-bold uppercase">Students</span>
                              </div>
                              <p className="text-sm font-black tracking-tight text-slate-900 dark:text-white">{dept.totalStudents}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${dept.headFacultyName === 'Not Assigned' ? 'bg-slate-300' : 'bg-emerald-500'}`} />
                            {dept.headFacultyId ? (
                                <Link to={`/portal/faculty/${dept.headFacultyId}`} className="text-sm font-bold text-slate-700 dark:text-white/70 hover:text-[#007A55] transition-colors">
                                  {dept.headFacultyName}
                                </Link>
                            ) : (
                                <span className="text-sm font-medium text-slate-600 dark:text-white/40">{dept.headFacultyName}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            <button
                                onClick={() => handleEditClick(dept)}
                                className="p-2 text-slate-400 hover:text-[#007A55] hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-all border border-transparent hover:border-emerald-100 dark:hover:border-emerald-500/20"
                            >
                              <Edit size={16} />
                            </button>
                            {isAdmin && (
                                <button
                                    onClick={() => handleDelete(dept.id)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-100 dark:hover:border-red-500/20"
                                >
                                  <Trash2 size={16} />
                                </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                  ))
              ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.06] flex items-center justify-center mb-4 text-slate-300 dark:text-white/10">
                          <PackageOpen size={28} />
                        </div>
                        <p className="text-[15px] font-bold text-slate-600 dark:text-white/40">No departments found</p>
                        <p className="text-sm text-slate-400 dark:text-white/30 mt-1">Try adjusting your search</p>
                      </div>
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-slate-50/60 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-white/30">Showing {departments.length} of {totalElements} Depts</p>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400 dark:text-white/30">Page {page + 1}</span>
              <div className="flex gap-2">
                <button
                    disabled={page === 0 || loading}
                    onClick={() => setPage((p) => p - 1)}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 disabled:opacity-30 hover:bg-white dark:hover:bg-white/[0.06] transition-all text-slate-600 dark:text-white/50"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                    disabled={(page + 1) * pageSize >= totalElements || loading}
                    onClick={() => setPage((p) => p + 1)}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 disabled:opacity-30 hover:bg-white dark:hover:bg-white/[0.06] transition-all text-slate-600 dark:text-white/50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </Card>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingDept ? 'Edit Department' : 'Add New Department'}>
          <DepartmentForm department={editingDept} onSubmit={handleFormSubmit} isLoading={formLoading} />
        </Modal>
      </div>
  );
};

export default DepartmentList;
