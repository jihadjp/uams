import { useState, useEffect, useMemo } from 'react';
import { Plus, Edit, Trash2, Calendar, CheckCircle2, Circle, MoreVertical, Play, BookOpen, GraduationCap, Archive, Lock, ArrowUpDown, ChevronLeft, ChevronRight, PackageOpen, RefreshCw } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import StatCard from '../../components/common/StatCard';
import SemesterForm from './SemesterForm';
import AcademicCalendarManager from './AcademicCalendarManager';
import { getSemesters, createSemester, updateSemester, deleteSemester, updateSemesterStatus } from '../../api/semesterApi';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '../../utils/formatDate';
import useAuth from '../../hooks/useAuth';

const SemesterList = () => {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Pagination & Sorting State
  const [page, setPage] = useState(0);
  const [pageSize] = useState(8);
  const [totalElements, setTotalElements] = useState(0);
  const [sort, setSort] = useState({ key: 'academicYear', direction: 'desc' });

  const { isAdmin } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSemester, setEditingSemester] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Calendar Management State
  const [managingCalendar, setManagingCalendar] = useState(null);

  const fetchSemesters = async () => {
    const isInitial = semesters.length === 0;
    if (isInitial) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await getSemesters({
        page,
        size: pageSize,
        sort: `${sort.key},${sort.direction}`
      });
      setSemesters(res.data.content || res.data || []);
      setTotalElements(res.data.totalElements || (res.data.content ? res.data.content.length : 0));
    } catch (err) {
      toast.error('Failed to fetch semesters');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const stats = useMemo(() => {
    const list = Array.isArray(semesters) ? semesters : [];
    return {
      total: totalElements,
      ongoing: list.filter(s => s.status === 'ONGOING').length,
      registration: list.filter(s => s.status === 'REGISTRATION').length,
      upcoming: list.filter(s => s.status === 'UPCOMING').length
    };
  }, [semesters, totalElements]);

  useEffect(() => {
    fetchSemesters();
  }, [page, sort]);

  const handleSort = (key) => {
    setSort(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  if (managingCalendar) {
    return <AcademicCalendarManager semester={managingCalendar} onBack={() => setManagingCalendar(null)} />;
  }

  const handleAddClick = () => {
    setEditingSemester(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (semester) => {
    setEditingSemester(semester);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateSemesterStatus(id, status);
      toast.success(`Semester moved to ${status}`);
      fetchSemesters();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this semester? This will affect all associated offerings.')) return;
    try {
      await deleteSemester(id);
      toast.success('Semester deleted');
      fetchSemesters();
    } catch (err) {
      toast.error('Failed to delete semester');
    }
  };

  const handleFormSubmit = async (data) => {
    setFormLoading(true);
    try {
      if (editingSemester) {
        await updateSemester(editingSemester.id, data);
        toast.success('Semester updated');
      } else {
        await createSemester(data);
        toast.success('Semester created');
      }
      setIsModalOpen(false);
      fetchSemesters();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      UPCOMING: { color: 'bg-slate-100 text-slate-600 border-slate-200', icon: Calendar },
      REGISTRATION: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Play },
      ONGOING: { color: 'bg-green-100 text-green-700 border-green-200', icon: BookOpen },
      FINAL_EXAMS: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: GraduationCap },
      GRADING: { color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: Edit },
      COMPLETED: { color: 'bg-gray-100 text-gray-500 border-gray-200', icon: Archive }
    };
    const currentStatus = status || 'UPCOMING';
    const { color, icon: Icon } = config[currentStatus] || config.UPCOMING;
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black border uppercase tracking-widest ${color}`}>
        <Icon size={12} className="mr-1.5" /> {currentStatus.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-none uppercase">Semester Lifecycle</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-bold uppercase text-[10px] tracking-[0.2em]">Manage Academic Terms & Control Enrollment Phases</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={fetchSemesters} variant="secondary" className="p-2.5">
            <RefreshCw size={20} className={loading || refreshing ? 'animate-spin' : ''} />
          </Button>
          <Button onClick={handleAddClick} className="flex items-center space-x-2 bg-[#2D2A4F] text-white">
            <Plus size={20} />
            <span>Initialize Term</span>
          </Button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Calendar} label="Total Terms" value={stats.total} color="primary" />
        <StatCard icon={BookOpen} label="Ongoing" value={stats.ongoing} color="success" delay={0.1} />
        <StatCard icon={Play} label="Reg. Open" value={stats.registration} color="info" delay={0.2} />
        <StatCard icon={Calendar} label="Upcoming" value={stats.upcoming} color="warning" delay={0.3} />
      </div>

      <Card className="!p-0 border-none shadow-sm overflow-hidden bg-white dark:bg-gray-900 relative">
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
        <div className={`overflow-x-auto min-h-[400px] transition-opacity duration-200 ${refreshing ? 'opacity-50' : 'opacity-100'}`}>
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-400 uppercase text-[9px] font-black tracking-widest border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="px-6 py-5 cursor-pointer hover:text-primary-500 transition-colors" onClick={() => handleSort('term')}>
                  <div className="flex items-center space-x-1">
                    <span>Academic Term</span>
                    <ArrowUpDown size={12} className={sort.key === 'term' ? 'text-primary-500' : 'opacity-30'} />
                  </div>
                </th>
                <th className="px-6 py-5 text-center cursor-pointer hover:text-primary-500 transition-colors" onClick={() => handleSort('academicYear')}>
                  <div className="flex items-center justify-center space-x-1">
                    <span>Class Timeline</span>
                    <ArrowUpDown size={12} className={sort.key === 'academicYear' ? 'text-primary-500' : 'opacity-30'} />
                  </div>
                </th>
                <th className="px-6 py-5 text-center">Current Phase</th>
                <th className="px-6 py-5">Deadlines</th>
                <th className="px-6 py-5 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {loading && semesters.length === 0 ? (
                 Array.from({ length: pageSize }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div><div className="h-2 bg-gray-100 dark:bg-gray-800 rounded w-16"></div></td>
                    <td className="px-6 py-4 text-center"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto mb-2"></div><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto"></div></td>
                    <td className="px-6 py-4 text-center"><div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto"></div></td>
                    <td className="px-6 py-4"><div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div><div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div></td>
                    <td className="px-6 py-4"></td>
                  </tr>
                ))
              ) : semesters.length > 0 ? semesters.map((s) => (
                <motion.tr key={s.id} layout className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-gray-900 dark:text-white leading-none">{s.name}</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">Year: {s.academicYear}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                       <span className="text-xs font-black text-gray-700 dark:text-gray-300">{formatDate(s.startDate)}</span>
                       <div className="w-px h-2 bg-gray-200 my-0.5" />
                       <span className="text-xs font-black text-gray-700 dark:text-gray-300">{formatDate(s.endDate)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {getStatusBadge(s.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1.5">
                       <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-gray-400 uppercase">Reg:</span>
                          <span className="text-primary-600">{formatDate(s.registrationDeadline)}</span>
                       </div>
                       {s.addDropDeadline && (
                         <div className="flex items-center justify-between text-[10px] font-bold">
                            <span className="text-gray-400 uppercase">Add/Drop:</span>
                            <span className="text-amber-600">{formatDate(s.addDropDeadline)}</span>
                         </div>
                       )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center space-x-1">
                      {/* Lifecycle Controls */}
                      <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         {s.status === 'UPCOMING' && (
                           <button onClick={() => handleStatusUpdate(s.id, 'REGISTRATION')} title="Open Registration" className="p-1.5 text-blue-600 hover:bg-white rounded-lg transition-all"><Play size={14} /></button>
                         )}
                         {s.status === 'REGISTRATION' && (
                           <button onClick={() => handleStatusUpdate(s.id, 'ONGOING')} title="Start Classes" className="p-1.5 text-green-600 hover:bg-white rounded-lg transition-all"><BookOpen size={14} /></button>
                         )}
                         {s.status === 'ONGOING' && (
                           <button onClick={() => handleStatusUpdate(s.id, 'FINAL_EXAMS')} title="Final Exams" className="p-1.5 text-amber-600 hover:bg-white rounded-lg transition-all"><GraduationCap size={14} /></button>
                         )}
                         {s.status === 'FINAL_EXAMS' && (
                           <button onClick={() => handleStatusUpdate(s.id, 'GRADING')} title="Start Grading" className="p-1.5 text-indigo-600 hover:bg-white rounded-lg transition-all"><Edit size={14} /></button>
                         )}
                         {s.status === 'GRADING' && (
                           <button onClick={() => handleStatusUpdate(s.id, 'COMPLETED')} title="Complete Semester" className="p-1.5 text-gray-500 hover:bg-white rounded-lg transition-all"><Lock size={14} /></button>
                         )}
                      </div>

                      <button
                        onClick={() => setManagingCalendar(s)}
                        className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all"
                        title="Academic Calendar"
                      >
                        <Calendar size={16} />
                      </button>
                      <button onClick={() => handleEditClick(s)} className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-xl transition-all">
                        <Edit size={16} />
                      </button>
                      {isAdmin && (
                        <button onClick={() => handleDelete(s.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
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
                      <p className="text-lg font-medium">No semesters initialized</p>
                      <p className="text-sm">Click 'Initialize Term' to start a new academic period</p>
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
            Showing {semesters.length} of {totalElements} Terms
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
        title={editingSemester ? `Modify ${editingSemester.name}` : 'Initialize Academic Term'}
        size="lg"
      >
        <SemesterForm
          semester={editingSemester}
          onSubmit={handleFormSubmit}
          isLoading={formLoading}
        />
      </Modal>
    </div>
  );
};

export default SemesterList;
