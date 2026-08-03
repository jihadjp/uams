import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, Building2, Hash, Users, GraduationCap, PackageOpen, ChevronLeft, ChevronRight, ArrowUpDown, ShieldCheck, RefreshCw } from 'lucide-react';
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

  // Pagination & Sorting State
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
        search: search || undefined
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
      headsAssigned: list.filter(d => d.headFacultyName && d.headFacultyName !== 'Not Assigned').length
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
    setSort(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Departments</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage university departments and faculty heads.</p>
        </div>
        <div className="flex items-center gap-3">
            <Button onClick={fetchDepartments} variant="secondary" className="p-2.5">
                <RefreshCw size={20} className={loading || refreshing ? 'animate-spin' : ''} />
            </Button>
            <Button onClick={handleAddClick} className="flex items-center space-x-2">
                <Plus size={20} />
                <span>Add Department</span>
            </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Building2} label="Total Depts" value={stats.total} color="primary" />
        <StatCard icon={Users} label="Total Faculty" value={stats.totalFaculty} color="success" delay={0.1} />
        <StatCard icon={GraduationCap} label="Total Students" value={stats.totalStudents} color="info" delay={0.2} />
        <StatCard icon={ShieldCheck} label="Heads Assigned" value={stats.headsAssigned} color="warning" delay={0.3} />
      </div>

      <Card className="!p-0">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
           <Input
             placeholder="Search by department name or code..."
             icon={Search}
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>

        <div className="overflow-x-auto min-h-[400px] relative">
          {refreshing && (
                <div className="absolute inset-x-0 top-0 h-0.5 bg-primary-500/10 overflow-hidden z-20">
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        className="h-full w-1/3 bg-primary-500"
                    />
                </div>
            )}
          <table className={`w-full text-left transition-opacity duration-200 ${refreshing ? 'opacity-50' : 'opacity-100'}`}>
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4 cursor-pointer hover:text-primary-500 transition-colors" onClick={() => handleSort('deptNumber')}>
                  <div className="flex items-center space-x-1">
                    <span>#</span>
                    <ArrowUpDown size={12} className={sort.key === 'deptNumber' ? 'text-primary-500' : 'opacity-30'} />
                  </div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-primary-500 transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center space-x-1">
                    <span>Department Info</span>
                    <ArrowUpDown size={12} className={sort.key === 'name' ? 'text-primary-500' : 'opacity-30'} />
                  </div>
                </th>
                <th className="px-6 py-4 text-center">Stats</th>
                <th className="px-6 py-4">Head of Dept</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading && departments.length === 0 ? (
                 Array.from({ length: pageSize }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div><div className="h-2 bg-gray-100 dark:bg-gray-800 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div></td>
                    <td className="px-6 py-4"></td>
                  </tr>
                ))
              ) : departments.length > 0 ? departments.map((dept) => (
                <motion.tr key={dept.id} layout className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono font-black text-primary-500">{dept.deptNumber}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">{dept.name}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase mt-1 tracking-widest">{dept.code}</p>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex justify-center space-x-6">
                        <div className="text-center">
                           <div className="flex items-center text-gray-400 mb-0.5 justify-center">
                              <Users size={12} className="mr-1" />
                              <span className="text-[10px] font-bold uppercase">Faculty</span>
                           </div>
                           <p className="text-sm font-black text-gray-900 dark:text-white">{dept.totalFaculty}</p>
                        </div>
                        <div className="text-center">
                           <div className="flex items-center text-gray-400 mb-0.5 justify-center">
                              <GraduationCap size={12} className="mr-1" />
                              <span className="text-[10px] font-bold uppercase">Students</span>
                           </div>
                           <p className="text-sm font-black text-gray-900 dark:text-white">{dept.totalStudents}</p>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                       <div className={`w-2 h-2 rounded-full ${dept.headFacultyName === 'Not Assigned' ? 'bg-gray-300' : 'bg-green-500'}`} />
                       {dept.headFacultyId ? (
                           <Link to={`/portal/faculty/${dept.headFacultyId}`} className="text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors">
                               {dept.headFacultyName}
                           </Link>
                       ) : (
                           <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{dept.headFacultyName}</span>
                       )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleEditClick(dept)} className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all">
                        <Edit size={16} />
                      </button>
                      {isAdmin && (
                        <button onClick={() => handleDelete(dept.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <PackageOpen size={48} strokeWidth={1} className="mb-4 opacity-50" />
                      <p className="text-lg font-medium">No departments found</p>
                      <p className="text-sm">Try adjusting your search</p>
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
            Showing {departments.length} of {totalElements} Depts
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
        title={editingDept ? 'Edit Department' : 'Add New Department'}
      >
        <DepartmentForm
          department={editingDept}
          onSubmit={handleFormSubmit}
          isLoading={formLoading}
        />
      </Modal>
    </div>
  );
};

export default DepartmentList;
