import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Building2,
  Copy,
  AlertTriangle,
  ArrowUpDown,
  PackageOpen,
  Award,
  Users,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import StatCard from '../../components/common/StatCard';
import FacultyForm from './FacultyForm';
import { getFaculty, createFaculty, updateFaculty, deleteFaculty, getDepartments } from '../../api/facultyApi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate';
import useAuth from '../../hooks/useAuth';

const FacultyList = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [sort, setSort] = useState({ key: 'user.name', direction: 'asc' });
  const [departments, setDepartments] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [generatedIdInfo, setGeneratedIdInfo] = useState(null);

  const fetchFaculty = async () => {
    const isInitial = facultyList.length === 0;
    if (isInitial) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await getFaculty({
        page,
        size: pageSize,
        sort: `${sort.key},${sort.direction}`,
        search: search || undefined,
        departmentId: selectedDept || undefined,
      });
      setFacultyList(res.data.content || []);
      setTotalElements(res.data.totalElements || 0);
    } catch (err) {
      toast.error('Failed to fetch faculty');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const stats = useMemo(() => {
    const list = Array.isArray(facultyList) ? facultyList : [];
    return {
      total: totalElements,
      senior: list.filter((f) => f.designation?.toUpperCase().includes('PROFESSOR')).length,
      depts: new Set(list.map((f) => f.departmentName)).size,
      recent: list.filter((f) => {
        const joinDate = new Date(f.joinedAt);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return joinDate >= thirtyDaysAgo;
      }).length,
    };
  }, [facultyList, totalElements]);

  const fetchDepts = async () => {
    try {
      const res = await getDepartments();
      setDepartments(res.data.content || res.data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchFaculty();
  }, [page, selectedDept, sort]);

  const handleSort = (key) => {
    setSort((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 0) fetchFaculty();
      else setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchDepts();
  }, []);

  const handleAddClick = () => {
    setEditingFaculty(null);
    setGeneratedIdInfo(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this faculty member?')) return;
    try {
      await deleteFaculty(id);
      toast.success('Faculty deleted');
      fetchFaculty();
    } catch (err) {
      toast.error('Failed to delete faculty');
    }
  };

  const handleEditClick = (faculty) => {
    const deptId = faculty.departmentId || departments.find((d) => d.name === faculty.departmentName)?.id;
    setEditingFaculty({
      ...faculty,
      departmentId: deptId || '',
    });
    setGeneratedIdInfo(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data) => {
    setFormLoading(true);
    try {
      if (editingFaculty) {
        await updateFaculty(editingFaculty.id, data);
        toast.success('Faculty updated successfully');
        setIsModalOpen(false);
      } else {
        const res = await createFaculty(data);
        const newFaculty = res.data || res;
        if (newFaculty?.employeeId) {
          setGeneratedIdInfo({
            name: newFaculty.name,
            id: newFaculty.employeeId,
            password: newFaculty.temporaryPassword,
          });
          toast.success('Faculty added successfully!');
        } else {
          toast.success('Faculty added successfully');
          setIsModalOpen(false);
        }
      }
      fetchFaculty();
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
          <Button onClick={fetchFaculty} variant="secondary" className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-white/10">
            <RefreshCw size={18} className={loading || refreshing ? 'animate-spin' : ''} />
          </Button>
          <Button onClick={handleAddClick} className="bg-[#2D2A4F] hover:bg-[#1E1C38] text-white flex items-center gap-2 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm py-2.5 px-4 border-none">
            <Plus size={16} />
            <span>Add Faculty</span>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard icon={Users} label="Total Faculty" value={stats.total} color="primary" />
          <StatCard icon={Award} label="Senior Staff" value={stats.senior} color="success" delay={0.1} />
          <StatCard icon={Building2} label="Departments" value={stats.depts} color="info" delay={0.2} />
          <StatCard icon={ShieldCheck} label="Recent Joins" value={stats.recent} color="warning" delay={0.3} />
        </div>

        <Card className="!p-0 overflow-hidden border border-slate-200/80 dark:border-white/10 rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-800/80">
          <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-white/[0.06] flex flex-col md:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <Input
                  placeholder="Search by name, email or employee ID..."
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
                {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[420px] relative">
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
                <th className="px-4 sm:px-6 py-3.5 text-center cursor-pointer hover:text-[#007A55] transition-colors whitespace-nowrap" onClick={() => handleSort('employeeId')}>
                  <div className="flex items-center justify-center gap-1">
                    <span>Emp ID</span>
                    <ArrowUpDown size={12} className={sort.key === 'employeeId' ? 'text-[#007A55]' : 'opacity-30'} />
                  </div>
                </th>
                <th className="px-4 sm:px-6 py-3.5 cursor-pointer hover:text-[#007A55] transition-colors whitespace-nowrap" onClick={() => handleSort('user.name')}>
                  <div className="flex items-center gap-1">
                    <span>Faculty Info</span>
                    <ArrowUpDown size={12} className={sort.key === 'user.name' ? 'text-[#007A55]' : 'opacity-30'} />
                  </div>
                </th>
                <th className="px-4 sm:px-6 py-3.5 whitespace-nowrap">Department & Role</th>
                <th className="px-4 sm:px-6 py-3.5 whitespace-nowrap">Contact</th>
                <th className="px-4 sm:px-6 py-3.5 text-right whitespace-nowrap">Actions</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
              {loading && facultyList.length === 0 ? (
                  Array.from({ length: pageSize }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-4 sm:px-6 py-4 text-center">
                          <div className="h-5 bg-slate-100 dark:bg-white/10 rounded w-16 mx-auto" />
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 dark:bg-white/10 rounded-xl" />
                            <div className="space-y-2">
                              <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-32" />
                              <div className="h-3 bg-slate-100 dark:bg-white/5 rounded w-24" />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-24 mb-2" />
                          <div className="h-3 bg-slate-100 dark:bg-white/5 rounded w-16" />
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-20" />
                        </td>
                        <td className="px-4 sm:px-6 py-4" />
                      </tr>
                  ))
              ) : facultyList.length > 0 ? (
                  facultyList.map((f) => (
                      <motion.tr
                          key={f.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-slate-50/60 dark:hover:bg-white/[0.04] transition-colors group"
                      >
                        <td className="px-4 sm:px-6 py-4 text-center whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-900 dark:text-white px-2.5 py-1 bg-slate-100 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 rounded-lg text-[10px]">
                        {f.employeeId}
                      </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <Link
                                to={`/portal/faculty/${f.id}`}
                                className="shrink-0 group/img overflow-hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 transition-transform active:scale-95"
                            >
                              {f.profileImage ? (
                                  <img
                                      src={f.profileImage.startsWith('/api') ? f.profileImage : `/api/uploads/${f.profileImage}`}
                                      alt={f.name}
                                      className="w-full h-full object-cover transition-transform group-hover/img:scale-110"
                                  />
                              ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[#007A55] font-bold text-xs sm:text-sm bg-emerald-50 dark:bg-emerald-500/10">
                                    {f.name?.charAt(0) || 'F'}
                                  </div>
                              )}
                            </Link>
                            <div className="min-w-0">
                              <Link
                                  to={`/portal/faculty/${f.id}`}
                                  className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-none hover:text-[#007A55] transition-colors truncate block"
                              >
                                {f.name}
                              </Link>
                              <p className="text-[10px] sm:text-[11px] text-slate-400 dark:text-white/30 mt-1 truncate">{f.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-[#007A55] dark:text-emerald-300 mb-0.5">
                            <Building2 size={12} className="opacity-70 shrink-0" />
                            <span className="text-[10px] font-black uppercase tracking-tight">{f.departmentName}</span>
                          </div>
                          <p className="text-xs font-bold text-slate-500 dark:text-white/40">{f.designation}</p>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <p className="text-xs font-bold text-slate-700 dark:text-white/70">{f.phone || 'Not Provided'}</p>
                          <p className="text-[10px] text-slate-400 dark:text-white/30 mt-0.5 italic">Joined: {formatDate(f.joinedAt)}</p>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex justify-end gap-1">
                            <button
                                onClick={() => navigate(`/portal/faculty/${f.id}`)}
                                className="p-1.5 sm:p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all border border-transparent hover:border-blue-100 dark:hover:border-blue-500/20"
                                title="View Detail"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                                onClick={() => handleEditClick(f)}
                                className="p-1.5 sm:p-2 text-slate-400 hover:text-[#007A55] hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-all border border-transparent hover:border-emerald-100 dark:hover:border-emerald-500/20"
                                title="Edit Profile"
                            >
                              <Edit size={16} />
                            </button>
                            {isAdmin && (
                                <button
                                    onClick={() => handleDelete(f.id)}
                                    className="p-1.5 sm:p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-100 dark:hover:border-red-500/20"
                                    title="Delete Account"
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
                    <td colSpan={5} className="px-6 py-16 sm:py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400 dark:text-white/20">
                        <PackageOpen size={40} strokeWidth={1} className="mb-3 opacity-50" />
                        <p className="text-base sm:text-lg font-bold text-slate-600 dark:text-white/40">No faculty members found</p>
                        <p className="text-xs sm:text-sm mt-0.5">Try adjusting your search or department filter</p>
                      </div>
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>

          <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50/60 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500 dark:text-white/30">Showing {facultyList.length} of {totalElements} members</p>
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-white/30">Page {page + 1}</span>
              <div className="flex gap-1.5 sm:gap-2">
                <button
                    disabled={page === 0}
                    onClick={() => setPage((p) => p - 1)}
                    className="p-2 sm:p-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 disabled:opacity-30 hover:bg-white dark:hover:bg-white/[0.06] transition-all text-slate-600 dark:text-white/50"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                    disabled={(page + 1) * pageSize >= totalElements}
                    onClick={() => setPage((p) => p + 1)}
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
            title={generatedIdInfo ? 'Registration Success' : editingFaculty ? 'Edit Faculty Profile' : 'Add New Faculty'}
        >
          {generatedIdInfo ? (
              <div className="text-center py-2 space-y-5 sm:space-y-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 dark:bg-emerald-500/15 text-[#007A55] dark:text-emerald-300 rounded-full flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-500/20">
                  <Plus size={32} />
                </div>
                <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">{generatedIdInfo.name} added!</h3>

                <div className="space-y-3 text-left">
                  <div className="bg-slate-50 dark:bg-white/[0.04] p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 relative">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/30 mb-0.5">Employee ID</p>
                    <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">{generatedIdInfo.id}</h3>
                    <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedIdInfo.id);
                          toast.success('Copied');
                        }}
                        className="absolute top-3.5 right-3.5 p-2 text-slate-400 hover:text-[#007A55] transition"
                    >
                      <Copy size={16} />
                    </button>
                  </div>

                  <div className="bg-emerald-50 dark:bg-emerald-500/10 p-3.5 sm:p-4 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 relative text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#007A55] dark:text-emerald-300 mb-0.5">Temporary Password</p>
                    <h3 className="text-lg sm:text-xl font-black tracking-wider font-mono text-[#007A55] dark:text-emerald-300">{generatedIdInfo.password}</h3>
                    <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedIdInfo.password);
                          toast.success('Copied');
                        }}
                        className="absolute top-3.5 right-3.5 p-2 text-emerald-600/60 hover:text-[#007A55] transition"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 bg-amber-50 dark:bg-amber-500/10 rounded-2xl flex items-start gap-3 text-left border border-amber-100 dark:border-amber-500/20">
                  <AlertTriangle className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" size={18} />
                  <p className="text-xs font-medium text-amber-700 dark:text-amber-300 leading-relaxed">
                    This password will not be shown again. Please copy or share it with the faculty member immediately.
                  </p>
                </div>

                <Button
                    className="w-full bg-[#2D2A4F] hover:bg-[#1E1C38] text-white font-bold text-xs sm:text-sm py-3 rounded-xl sm:rounded-2xl border-none"
                    onClick={() => {
                      setIsModalOpen(false);
                      setGeneratedIdInfo(null);
                    }}
                >
                  Done
                </Button>
              </div>
          ) : (
              <FacultyForm faculty={editingFaculty} onSubmit={handleFormSubmit} isLoading={formLoading} />
          )}
        </Modal>
      </div>
  );
};

export default FacultyList;