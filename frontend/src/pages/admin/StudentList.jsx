import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Copy,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  ArrowUpDown,
  PackageOpen,
  UserCheck,
  GraduationCap,
  UserX,
  RefreshCw,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import StatCard from '../../components/common/StatCard';
import StudentForm from './StudentForm';
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getPrograms,
  updateClearance,
} from '../../api/studentApi';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const navigate = useNavigate();
  const { isAdmin, isRegistrar } = useAuth();

  const [search, setSearch] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sort, setSort] = useState({ key: 'user.name', direction: 'asc' });
  const [programs, setPrograms] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [generatedIdInfo, setGeneratedIdInfo] = useState(null);

  const [clearanceConfirm, setClearanceConfirm] = useState({ isOpen: false, student: null });

  const fetchStudents = async () => {
    const isInitial = students.length === 0;
    if (isInitial) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await getStudents({
        page,
        size: pageSize,
        sort: `${sort.key},${sort.direction}`,
        search: search || undefined,
        programId: selectedProgram || undefined,
        status: selectedStatus || undefined,
      });
      setStudents(res.data?.content || res.data || []);
      setTotalElements(res.data?.totalElements || 0);
    } catch (err) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const stats = useMemo(() => {
    const list = Array.isArray(students) ? students : [];
    return {
      total: totalElements,
      active: list.filter((s) => s.status === 'ACTIVE').length,
      graduated: list.filter((s) => s.status === 'GRADUATED').length,
      other: list.filter((s) => s.status !== 'ACTIVE' && s.status !== 'GRADUATED').length,
    };
  }, [students, totalElements]);

  const fetchMeta = async () => {
    try {
      const res = await getPrograms();
      setPrograms(res.data?.content || res.data || []);
    } catch (err) {}
  };

  useEffect(() => {
    fetchStudents();
  }, [page, selectedProgram, selectedStatus, sort]);

  const handleSort = (key) => {
    setSort((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 0) fetchStudents();
      else setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchMeta();
  }, []);

  const handleAddClick = () => {
    setEditingStudent(null);
    setGeneratedIdInfo(null);
    setIsModalOpen(true);
  };

  const handleEditClick = async (student) => {
    try {
      setEditingStudent(student);
      setGeneratedIdInfo(null);
      setIsModalOpen(true);
      setFormLoading(true);
      const res = await getStudentById(student.id);
      const studentData = res?.data || res;
      setEditingStudent(studentData);
    } catch (err) {
      toast.error('Failed to fetch student details');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await deleteStudent(id);
      toast.success('Student deleted');
      fetchStudents();
    } catch (err) {
      toast.error('Failed to delete student');
    }
  };

  const handleToggleClearance = async (student) => {
    const isCleared = student.isRegistrationCleared ?? student.registrationCleared;
    if (isCleared) {
      setClearanceConfirm({ isOpen: true, student });
      return;
    }
    try {
      await updateClearance(student.id, true);
      toast.success('Student cleared for registration');
      fetchStudents();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const confirmBlock = async () => {
    const student = clearanceConfirm.student;
    if (!student) return;
    try {
      await updateClearance(student.id, false);
      toast.success('Student registration blocked');
      setClearanceConfirm({ isOpen: false, student: null });
      fetchStudents();
    } catch (err) {
      toast.error('Failed to block student');
    }
  };

  const handleFormSubmit = async (data) => {
    setFormLoading(true);
    const payload = {
      ...data,
      programId: data.programId || null,
      advisorId: data.advisorId || null,
      currentSemester: parseInt(data.currentSemester) || 1,
      guardianRelation: data.guardianRelation || null,
      guardianOtherRelation: data.guardianRelation === 'OTHER' ? data.guardianOtherRelation : null,
    };
    try {
      if (editingStudent?.id) {
        await updateStudent(editingStudent.id, payload);
        toast.success('Student updated successfully');
        setIsModalOpen(false);
        setEditingStudent(null);
      } else {
        const res = await createStudent(payload);
        const newStudent = res.data || res;
        if (newStudent?.registrationNo) {
          setGeneratedIdInfo({
            name: newStudent.name,
            studentId: newStudent.studentId,
            registrationNo: newStudent.registrationNo,
            password: newStudent.temporaryPassword,
          });
          toast.success('Student registered successfully!');
        } else {
          toast.success('Student registered successfully');
          setIsModalOpen(false);
        }
      }
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = status?.toUpperCase();
    const styles = {
      ACTIVE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20',
      DROPPED: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300 border-red-200 dark:border-red-500/20',
      GRADUATED: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/20',
      ON_LEAVE: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 border-amber-200 dark:border-amber-500/20',
    };
    return styles[s] || 'bg-slate-100 text-slate-700 dark:bg-white/[0.06] dark:text-white/40 border-slate-200 dark:border-white/10';
  };

  return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Student Management</h1>
            <p className="text-slate-500 dark:text-white/40 mt-1 text-sm font-medium">
              View, search and manage Royal Bengal University students.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button onClick={fetchStudents} variant="secondary" className="p-2.5">
              <RefreshCw size={20} className={loading || refreshing ? 'animate-spin' : ''} />
            </Button>
            <Button onClick={handleAddClick} className="flex items-center gap-2 flex-1 md:flex-none justify-center">
              <Plus size={18} />
              <span>Add Student</span>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={GraduationCap} label="Total Students" value={stats.total} color="primary" />
          <StatCard icon={UserCheck} label="Active Now" value={stats.active} color="success" delay={0.1} />
          <StatCard icon={GraduationCap} label="Graduated" value={stats.graduated} color="info" delay={0.2} />
          <StatCard icon={UserX} label="Dropped/Leave" value={stats.other} color="danger" delay={0.3} />
        </div>

        <Card className="!p-0 overflow-visible">
          <div className="p-6 border-b border-slate-100 dark:border-white/[0.06] flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                  placeholder="Search by name, email or Student ID..."
                  icon={Search}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="px-4 py-3 bg-slate-50 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-medium outline-none focus:border-[#007A55] focus:ring-4 focus:ring-[#007A55]/10 dark:text-white transition-all"
              >
                <option value="">All Programs</option>
                {programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                ))}
              </select>
              <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-3 bg-slate-50 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-medium outline-none focus:border-[#007A55] focus:ring-4 focus:ring-[#007A55]/10 dark:text-white transition-all"
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="DROPPED">Dropped</option>
                <option value="GRADUATED">Graduated</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[420px] relative">
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
              <thead className="bg-slate-50 dark:bg-white/[0.03] text-slate-500 dark:text-white/30 uppercase text-[10px] font-bold tracking-widest">
              <tr>
                <th className="px-6 py-4 cursor-pointer hover:text-[#007A55] transition-colors" onClick={() => handleSort('registrationNo')}>
                  <div className="flex items-center gap-1">
                    <span>IDs (Reg / System)</span>
                    <ArrowUpDown size={12} className={sort.key === 'registrationNo' ? 'text-[#007A55]' : 'opacity-30'} />
                  </div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-[#007A55] transition-colors" onClick={() => handleSort('user.name')}>
                  <div className="flex items-center gap-1">
                    <span>Personal Info</span>
                    <ArrowUpDown size={12} className={sort.key === 'user.name' ? 'text-[#007A55]' : 'opacity-30'} />
                  </div>
                </th>
                <th className="px-6 py-4">Academic</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
              {loading && students.length === 0 ? (
                  Array.from({ length: pageSize }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4">
                          <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-24 mb-2" />
                          <div className="h-3 bg-slate-100 dark:bg-white/5 rounded w-16" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 dark:bg-white/10 rounded-xl" />
                            <div className="space-y-2">
                              <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-32" />
                              <div className="h-3 bg-slate-100 dark:bg-white/5 rounded w-24" />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-40" />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="h-6 bg-slate-100 dark:bg-white/10 rounded-full w-20 mx-auto" />
                        </td>
                        <td className="px-6 py-4" />
                      </tr>
                  ))
              ) : students.length > 0 ? (
                  students.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors group">
                        <td className="px-6 py-4">
                          {student.registrationNo ? (
                              <div className="flex flex-col">
                          <span className="font-mono font-bold text-slate-900 dark:text-white leading-none">
                            {student.registrationNo}
                          </span>
                                <span className="text-[10px] font-medium text-slate-400 mt-1">{student.studentId}</span>
                              </div>
                          ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 border border-amber-200 dark:border-amber-500/20">
                          <AlertCircle size={10} className="mr-1" /> Profile Incomplete
                        </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Link to={`/portal/students/${student.id}`} className="shrink-0 group/img overflow-hidden w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm transition-transform active:scale-95">
                              {student.profileImage ? (
                                <img
                                  src={student.profileImage.startsWith('/api') ? student.profileImage : `/api/uploads/${student.profileImage}`}
                                  alt={student.name}
                                  className="w-full h-full object-cover transition-transform group-hover/img:scale-110"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#007A55] dark:text-emerald-300 font-black text-sm bg-emerald-50 dark:bg-emerald-500/15">
                                  {student.name ? student.name.charAt(0).toUpperCase() : '?'}
                                </div>
                              )}
                            </Link>
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-2">
                                <Link to={`/portal/students/${student.id}`} className="text-sm font-bold text-slate-900 dark:text-white truncate hover:text-[#007A55] transition-colors">
                                  {student.name}
                                </Link>
                                {student.isRegistrationCleared && (
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20 uppercase tracking-tighter">
                                Paid
                              </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 font-medium mt-0.5 truncate">{student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="text-xs font-bold text-slate-700 dark:text-white/70">{student.programName || 'N/A'}</p>
                              <p className="text-[10px] text-slate-400">Batch: {student.batch || 'N/A'}</p>
                            </div>
                            <div className="h-8 w-px bg-slate-100 dark:bg-white/10 mx-2" />
                            <div className="text-center">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">CGPA</p>
                              <p className="text-xs font-black text-[#007A55] dark:text-emerald-300">{student.cgpa || '0.00'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                      <span
                          className={`inline-flex items-center justify-center px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusBadge(student.status)}`}
                      >
                        {student.status}
                      </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            {(isAdmin || isRegistrar) && (
                                <button
                                    onClick={() => handleToggleClearance(student)}
                                    className={`p-2 rounded-xl transition-all flex items-center justify-center border ${
                                        student.isRegistrationCleared
                                            ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/15 border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-100'
                                            : 'text-amber-600 bg-amber-50 dark:bg-amber-500/15 border-amber-200 dark:border-amber-500/20 hover:bg-amber-100'
                                    }`}
                                    title={student.isRegistrationCleared ? 'Dues Cleared (Click to Block)' : 'Clear Dues Manually'}
                                >
                                  {student.isRegistrationCleared ? <ShieldCheck size={18} strokeWidth={2.5} /> : <ShieldAlert size={18} strokeWidth={2.5} />}
                                </button>
                            )}
                            <button
                                onClick={() => navigate(`/portal/students/${student.id}`)}
                                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/15 rounded-xl transition-all border border-transparent hover:border-blue-100 dark:hover:border-blue-500/20"
                                title="View Detail"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                                onClick={() => handleEditClick(student)}
                                className="p-2 text-slate-500 hover:text-[#007A55] hover:bg-emerald-50 dark:hover:bg-emerald-500/15 rounded-xl transition-all border border-transparent hover:border-emerald-100 dark:hover:border-emerald-500/20"
                                title="Edit Profile"
                            >
                              <Edit size={18} />
                            </button>
                            {isAdmin && (
                                <button
                                    onClick={() => handleDelete(student.id)}
                                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/15 rounded-xl transition-all border border-transparent hover:border-red-100 dark:hover:border-red-500/20"
                                    title="Delete Student"
                                >
                                  <Trash2 size={18} />
                                </button>
                            )}
                          </div>
                        </td>
                      </tr>
                  ))
              ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400 dark:text-white/20">
                        <PackageOpen size={48} strokeWidth={1} className="mb-4 opacity-50" />
                        <p className="text-lg font-bold text-slate-600 dark:text-white/40">No students found</p>
                        <p className="text-sm">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 bg-slate-50/60 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-white/30 font-medium">
              Showing {students.length} of {totalElements} students
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-400 dark:text-white/30 font-bold uppercase tracking-widest">Page {page + 1}</span>
              <div className="flex gap-2">
                <button
                    disabled={page === 0}
                    onClick={() => setPage((p) => p - 1)}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 disabled:opacity-30 hover:bg-white dark:hover:bg-white/[0.06] transition-all text-slate-600 dark:text-white/50"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                    disabled={(page + 1) * pageSize >= totalElements}
                    onClick={() => setPage((p) => p + 1)}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 disabled:opacity-30 hover:bg-white dark:hover:bg-white/[0.06] transition-all text-slate-600 dark:text-white/50"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </Card>

        <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={generatedIdInfo ? 'Registration Success' : editingStudent ? 'Edit Student Profile' : 'Register New Student'}
            size="lg"
        >
          {generatedIdInfo ? (
              <div className="text-center py-2 space-y-6">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/15 text-[#007A55] dark:text-emerald-300 rounded-full flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-500/20">
                  <Plus size={36} />
                </div>
                <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">{generatedIdInfo.name} registered!</h3>

                <div className="space-y-3 text-left">
                  <div className="bg-slate-50 dark:bg-white/[0.04] p-4 rounded-2xl border border-slate-200 dark:border-white/10 relative">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/30 mb-1">Registration No (Short)</p>
                    <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">{generatedIdInfo.registrationNo}</h3>
                    <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedIdInfo.registrationNo);
                          toast.success('Copied');
                        }}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-[#007A55] transition"
                    >
                      <Copy size={16} />
                    </button>
                  </div>

                  <div className="bg-slate-50 dark:bg-white/[0.04] p-4 rounded-2xl border border-slate-200 dark:border-white/10 relative">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/30 mb-1">Student ID (Long)</p>
                    <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white break-all">{generatedIdInfo.studentId}</h3>
                    <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedIdInfo.studentId);
                          toast.success('Copied');
                        }}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-[#007A55] transition"
                    >
                      <Copy size={16} />
                    </button>
                  </div>

                  <div className="bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 relative text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#007A55] dark:text-emerald-300 mb-1">Temporary Password</p>
                    <h3 className="text-xl font-black tracking-wider font-mono text-[#007A55] dark:text-emerald-300">{generatedIdInfo.password}</h3>
                    <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedIdInfo.password);
                          toast.success('Copied');
                        }}
                        className="absolute top-4 right-4 p-2 text-emerald-600/60 hover:text-[#007A55] transition"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-500/10 rounded-2xl flex items-start gap-3 text-left border border-amber-100 dark:border-amber-500/20">
                  <AlertTriangle className="text-amber-600 dark:text-amber-400 shrink-0" size={18} />
                  <p className="text-xs text-amber-700 dark:text-amber-300 font-medium leading-relaxed">
                    This password will not be shown again. Please copy or share it with the student immediately.
                  </p>
                </div>

                <Button
                    className="w-full"
                    onClick={() => {
                      setIsModalOpen(false);
                      setGeneratedIdInfo(null);
                    }}
                >
                  Done
                </Button>
              </div>
          ) : (
              <StudentForm student={editingStudent} onSubmit={handleFormSubmit} isLoading={formLoading} />
          )}
        </Modal>

        <Modal isOpen={clearanceConfirm.isOpen} onClose={() => setClearanceConfirm({ isOpen: false, student: null })} title="Confirm Block Registration" size="sm">
          <div className="text-center space-y-5 py-2">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-300 rounded-full flex items-center justify-center mx-auto border border-red-200 dark:border-red-500/20">
              <ShieldAlert size={32} />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">Block {clearanceConfirm.student?.name}?</h3>
              <p className="text-xs text-slate-500 dark:text-white/40 mt-2 font-medium leading-relaxed">
                Are you sure you want to block registration access for this student? This will prevent them from adding or dropping courses.
              </p>
            </div>
            <div className="flex flex-col gap-3 pt-2">
              <Button variant="danger" className="w-full" onClick={confirmBlock}>
                Confirm Block
              </Button>
              <Button variant="secondary" className="w-full bg-transparent border-none" onClick={() => setClearanceConfirm({ isOpen: false, student: null })}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </motion.div>
  );
};

export default StudentList;
