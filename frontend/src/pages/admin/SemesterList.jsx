import { useState, useEffect, useMemo } from 'react';
import { Plus, Edit, Trash2, Calendar, Play, BookOpen, GraduationCap, Archive, Lock, ArrowUpDown, ChevronLeft, ChevronRight, PackageOpen, RefreshCw } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import StatCard from '../../components/common/StatCard';
import SemesterForm from './SemesterForm';
import AcademicCalendarManager from './AcademicCalendarManager';
import { getSemesters, createSemester, updateSemester, deleteSemester, updateSemesterStatus } from '../../api/semesterApi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
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
      UPCOMING: { color: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-white/[0.06] dark:text-white/60 dark:border-white/10', icon: Calendar },
      REGISTRATION: { color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20', icon: Play },
      ONGOING: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20', icon: BookOpen },
      FINAL_EXAMS: { color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20', icon: GraduationCap },
      GRADING: { color: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20', icon: Edit },
      COMPLETED: { color: 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-white/[0.03] dark:text-white/40 dark:border-white/10', icon: Archive }
    };
    const currentStatus = status || 'UPCOMING';
    const { color, icon: Icon } = config[currentStatus] || config.UPCOMING;
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] sm:text-[10px] font-black border uppercase tracking-widest ${color}`}>
        <Icon size={12} className="mr-1.5 shrink-0" /> {currentStatus.replace('_', ' ')}
      </span>
    );
  };

  return (
      <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-20 pt-4">
        {/* Top Action Bar */}
        <div className="flex justify-end items-center gap-2 sm:gap-3">
          <Button onClick={fetchSemesters} variant="secondary" className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-white/10">
            <RefreshCw size={18} className={loading || refreshing ? 'animate-spin' : ''} />
          </Button>
          <Button onClick={handleAddClick} className="bg-[#2D2A4F] hover:bg-[#1E1C38] text-white flex items-center gap-2 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm py-2.5 px-4 border-none">
            <Plus size={16} />
            <span>Initialize Term</span>
          </Button>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard icon={Calendar} label="Total Terms" value={stats.total} color="primary" />
          <StatCard icon={BookOpen} label="Ongoing" value={stats.ongoing} color="success" delay={0.1} />
          <StatCard icon={Play} label="Reg. Open" value={stats.registration} color="info" delay={0.2} />
          <StatCard icon={Calendar} label="Upcoming" value={stats.upcoming} color="warning" delay={0.3} />
        </div>

        <Card className="!p-0 overflow-hidden border border-slate-200/80 dark:border-white/10 rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-800/80 relative">
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
          <div className={`overflow-x-auto min-h-[400px] transition-opacity duration-200 ${refreshing ? 'opacity-50' : 'opacity-100'}`}>
            <table className="w-full text-left">
              <thead className="bg-slate-50/80 dark:bg-white/[0.03] text-slate-500 dark:text-white/30 uppercase text-[10px] font-bold tracking-widest border-b border-slate-100 dark:border-white/[0.06]">
              <tr>
                <th className="px-4 sm:px-6 py-3.5 cursor-pointer hover:text-[#007A55] transition-colors whitespace-nowrap" onClick={() => handleSort('term')}>
                  <div className="flex items-center space-x-1">
                    <span>Academic Term</span>
                    <ArrowUpDown size={12} className={sort.key === 'term' ? 'text-[#007A55]' : 'opacity-30'} />
                  </div>
                </th>
                <th className="px-4 sm:px-6 py-3.5 text-center cursor-pointer hover:text-[#007A55] transition-colors whitespace-nowrap" onClick={() => handleSort('academicYear')}>
                  <div className="flex items-center justify-center space-x-1">
                    <span>Class Timeline</span>
                    <ArrowUpDown size={12} className={sort.key === 'academicYear' ? 'text-[#007A55]' : 'opacity-30'} />
                  </div>
                </th>
                <th className="px-4 sm:px-6 py-3.5 text-center whitespace-nowrap">Current Phase</th>
                <th className="px-4 sm:px-6 py-3.5 whitespace-nowrap">Deadlines</th>
                <th className="px-4 sm:px-6 py-3.5 text-right whitespace-nowrap">Administrative Actions</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
              {loading && semesters.length === 0 ? (
                  Array.from({ length: pageSize }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-4 sm:px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-24 mb-2"></div><div className="h-2 bg-slate-100 dark:bg-white/5 rounded w-16"></div></td>
                        <td className="px-4 sm:px-6 py-4 text-center"><div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-20 mx-auto mb-2"></div><div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-20 mx-auto"></div></td>
                        <td className="px-4 sm:px-6 py-4 text-center"><div className="h-5 bg-slate-200 dark:bg-white/10 rounded w-24 mx-auto"></div></td>
                        <td className="px-4 sm:px-6 py-4"><div className="h-3 bg-slate-200 dark:bg-white/10 rounded w-24 mb-2"></div><div className="h-3 bg-slate-200 dark:bg-white/10 rounded w-24"></div></td>
                        <td className="px-4 sm:px-6 py-4"></td>
                      </tr>
                  ))
              ) : semesters.length > 0 ? semesters.map((s) => (
                  <motion.tr key={s.id} layout className="hover:bg-slate-50/60 dark:hover:bg-white/[0.04] transition-colors group">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-none">{s.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-white/30 mt-1 uppercase tracking-tighter">Year: {s.academicYear}</p>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center whitespace-nowrap">
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-black text-slate-700 dark:text-white/80">{formatDate(s.startDate)}</span>
                        <div className="w-px h-2 bg-slate-200 dark:bg-white/10 my-0.5" />
                        <span className="text-xs font-black text-slate-700 dark:text-white/80">{formatDate(s.endDate)}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center whitespace-nowrap">
                      {getStatusBadge(s.status)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-bold gap-2">
                          <span className="text-slate-400 uppercase">Reg:</span>
                          <span className="text-[#007A55] dark:text-emerald-400">{formatDate(s.registrationDeadline)}</span>
                        </div>
                        {s.addDropDeadline && (
                            <div className="flex items-center justify-between text-[10px] font-bold gap-2">
                              <span className="text-slate-400 uppercase">Add/Drop:</span>
                              <span className="text-amber-600 dark:text-amber-400">{formatDate(s.addDropDeadline)}</span>
                            </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex justify-end items-center space-x-1">
                        {/* Lifecycle Controls */}
                        <div className="flex items-center bg-slate-100 dark:bg-gray-900 rounded-xl p-1 mr-1 border border-slate-200/60 dark:border-gray-700">
                          {s.status === 'UPCOMING' && (
                              <button onClick={() => handleStatusUpdate(s.id, 'REGISTRATION')} title="Open Registration" className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all"><Play size={13} /></button>
                          )}
                          {s.status === 'REGISTRATION' && (
                              <button onClick={() => handleStatusUpdate(s.id, 'ONGOING')} title="Start Classes" className="p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all"><BookOpen size={13} /></button>
                          )}
                          {s.status === 'ONGOING' && (
                              <button onClick={() => handleStatusUpdate(s.id, 'FINAL_EXAMS')} title="Final Exams" className="p-1.5 text-amber-600 dark:text-amber-400 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all"><GraduationCap size={13} /></button>
                          )}
                          {s.status === 'FINAL_EXAMS' && (
                              <button onClick={() => handleStatusUpdate(s.id, 'GRADING')} title="Start Grading" className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all"><Edit size={13} /></button>
                          )}
                          {s.status === 'GRADING' && (
                              <button onClick={() => handleStatusUpdate(s.id, 'COMPLETED')} title="Complete Semester" className="p-1.5 text-slate-500 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all"><Lock size={13} /></button>
                          )}
                        </div>

                        <button
                            onClick={() => setManagingCalendar(s)}
                            className="p-1.5 sm:p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-xl transition-all border border-transparent hover:border-amber-100 dark:hover:border-amber-500/20"
                            title="Academic Calendar"
                        >
                          <Calendar size={16} />
                        </button>
                        <button onClick={() => handleEditClick(s)} className="p-1.5 sm:p-2 text-slate-400 hover:text-[#007A55] hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-all border border-transparent hover:border-emerald-100 dark:hover:border-emerald-500/20" title="Edit Semester">
                          <Edit size={16} />
                        </button>
                        {isAdmin && (
                            <button onClick={() => handleDelete(s.id)} className="p-1.5 sm:p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-100 dark:hover:border-red-500/20" title="Delete Semester">
                              <Trash2 size={16} />
                            </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
              )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 sm:py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400 dark:text-white/20">
                        <PackageOpen size={40} strokeWidth={1} className="mb-3 opacity-50" />
                        <p className="text-base sm:text-lg font-bold text-slate-600 dark:text-white/40">No semesters initialized</p>
                        <p className="text-xs sm:text-sm text-slate-400 dark:text-white/30 mt-0.5">Click 'Initialize Term' to start a new academic period</p>
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
              Showing {semesters.length} of {totalElements} Terms
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