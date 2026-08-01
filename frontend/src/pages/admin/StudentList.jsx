import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, Eye, ChevronLeft, ChevronRight, AlertCircle, Copy, AlertTriangle, ShieldCheck, ShieldAlert, ArrowUpDown, PackageOpen, UserCheck, GraduationCap, UserX } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import StatCard from '../../components/common/StatCard';
import StudentForm from './StudentForm';
import { getStudents, getStudentById, createStudent, updateStudent, deleteStudent, getPrograms, updateClearance } from '../../api/studentApi';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const navigate = useNavigate();
  const { isAdmin, isRegistrar } = useAuth();

  // Filters & Sorting
  const [search, setSearch] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sort, setSort] = useState({ key: 'user.name', direction: 'asc' });
  const [programs, setPrograms] = useState([]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [generatedIdInfo, setGeneratedIdInfo] = useState(null);

  // Clearance Confirm State
  const [clearanceConfirm, setClearanceConfirm] = useState({ isOpen: false, student: null });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await getStudents({
        page,
        size: pageSize,
        sort: `${sort.key},${sort.direction}`,
        search: search || undefined,
        programId: selectedProgram || undefined,
        status: selectedStatus || undefined
      });
      setStudents(res.data?.content || res.data || []);
      setTotalElements(res.data?.totalElements || 0);
    } catch (err) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const list = Array.isArray(students) ? students : [];
    return {
      total: totalElements,
      active: list.filter(s => s.status === 'ACTIVE').length,
      graduated: list.filter(s => s.status === 'GRADUATED').length,
      other: list.filter(s => s.status !== 'ACTIVE' && s.status !== 'GRADUATED').length
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
    setSort(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Debounced search
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
      setEditingStudent(student); // প্রাথমিক ডাটা দিয়ে মোডাল ওপেন হবে
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
      guardianOtherRelation: data.guardianRelation === 'OTHER' ? data.guardianOtherRelation : null
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
            password: newStudent.temporaryPassword
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
      ACTIVE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      DROPPED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      GRADUATED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      ON_LEAVE: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    };
    return styles[s] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  };

  return (
      <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Student Management</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">View, search and manage university students.</p>
          </div>
          <Button onClick={handleAddClick} className="flex items-center space-x-2">
            <Plus size={20} />
            <span>Add Student</span>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={GraduationCap} label="Total Students" value={stats.total} color="primary" />
          <StatCard icon={UserCheck} label="Active Now" value={stats.active} color="success" delay={0.1} />
          <StatCard icon={GraduationCap} label="Graduated" value={stats.graduated} color="info" delay={0.2} />
          <StatCard icon={UserX} label="Dropped/Leave" value={stats.other} color="danger" delay={0.3} />
        </div>

        <Card className="!p-0 overflow-visible">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                  placeholder="Search by name, email or Student ID..."
                  icon={Search}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
              >
                <option value="">All Programs</option>
                {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="DROPPED">Dropped</option>
                <option value="GRADUATED">Graduated</option>
              </select>
            </div>
          </div>

          {/* min-h-[420px] যোগ করায় টেবিলের উচ্চতা হঠাৎ ছোট-বড় হয়ে লাফ দেবে না */}
          <div className="overflow-x-auto min-h-[420px]">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4 cursor-pointer hover:text-primary-500 transition-colors" onClick={() => handleSort('registrationNo')}>
                  <div className="flex items-center space-x-1">
                    <span>IDs (Reg / System)</span>
                    <ArrowUpDown size={12} className={sort.key === 'registrationNo' ? 'text-primary-500' : 'opacity-30'} />
                  </div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-primary-500 transition-colors" onClick={() => handleSort('user.name')}>
                  <div className="flex items-center space-x-1">
                    <span>Personal Info</span>
                    <ArrowUpDown size={12} className={sort.key === 'user.name' ? 'text-primary-500' : 'opacity-30'} />
                  </div>
                </th>
                <th className="px-6 py-4">Academic</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                  Array.from({ length: pageSize }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div><div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-16"></div></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl" />
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-24"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40"></div></td>
                      <td className="px-6 py-4 text-center"><div className="h-6 bg-gray-100 dark:bg-gray-700 rounded-full w-20 mx-auto"></div></td>
                      <td className="px-6 py-4"></td>
                    </tr>
                  ))
              ) : students.length > 0 ? (
                  students.map((student) => (
                      <tr
                          key={student.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          {student.registrationNo ? (
                              <div className="flex flex-col">
                                <span className="font-mono font-bold text-gray-900 dark:text-white leading-none">{student.registrationNo}</span>
                                <span className="text-[10px] font-medium text-gray-400 mt-1">{student.studentId}</span>
                              </div>
                          ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
                          <AlertCircle size={10} className="mr-1" /> Profile Incomplete
                        </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold text-sm">
                              {student.name ? student.name.charAt(0) : '?'}
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center space-x-2">
                                <p className="text-sm font-bold text-gray-900 dark:text-white">{student.name}</p>
                                {student.isRegistrationCleared && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800 uppercase tracking-tighter">
                                    Paid
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-gray-400 font-medium mt-0.5">{student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-4">
                            <div>
                              <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{student.programName || 'N/A'}</p>
                              <p className="text-[10px] text-gray-400">Batch: {student.batch || 'N/A'}</p>
                            </div>
                            <div className="h-8 w-px bg-gray-100 dark:bg-gray-700 mx-2"></div>
                            <div className="text-center">
                              <p className="text-[10px] font-bold text-gray-400 uppercase">CGPA</p>
                              <p className="text-xs font-black text-primary-600">{student.cgpa || '0.00'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest ${getStatusBadge(student.status)}`}>
                        {student.status}
                      </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-1">
                            {(isAdmin || isRegistrar) && (
                              <button
                                onClick={() => handleToggleClearance(student)}
                                className={`p-2 rounded-lg transition-all flex items-center justify-center ${student.isRegistrationCleared ? 'text-green-600 bg-green-50 dark:bg-green-900/20 hover:bg-green-100' : 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100'}`}
                                title={student.isRegistrationCleared ? "Dues Cleared (Click to Block)" : "Clear Dues Manually"}
                              >
                                {student.isRegistrationCleared ? <ShieldCheck size={18} strokeWidth={2.5} /> : <ShieldAlert size={18} strokeWidth={2.5} />}
                              </button>
                            )}
                            <button onClick={() => navigate(`/portal/students/${student.id}`)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all" title="View Detail">
                              <Eye size={18} />
                            </button>
                            <button onClick={() => handleEditClick(student)} className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all" title="Edit Profile">
                              <Edit size={18} />
                            </button>
                            {isAdmin && (
                              <button onClick={() => handleDelete(student.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all" title="Delete Student">
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                  ))
              ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <PackageOpen size={48} strokeWidth={1} className="mb-4 opacity-50" />
                        <p className="text-lg font-medium">No students found</p>
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
            <p className="text-xs text-gray-500 font-medium">Showing {students.length} of {totalElements} students</p>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Page {page + 1}</span>
              <div className="flex space-x-2">
                <button
                    disabled={page === 0}
                    onClick={() => setPage(p => p - 1)}
                    className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-white dark:hover:bg-gray-800 transition-all text-gray-600 dark:text-gray-400"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                    disabled={(page + 1) * pageSize >= totalElements}
                    onClick={() => setPage(p => p + 1)}
                    className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-white dark:hover:bg-gray-800 transition-all text-gray-600 dark:text-gray-400"
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
            title={generatedIdInfo ? 'Registration Success' : (editingStudent ? 'Edit Student Profile' : 'Register New Student')}
        >
          {generatedIdInfo ? (
              <div className="text-center py-4 space-y-6">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Plus size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{generatedIdInfo.name} registered!</h3>

                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 relative text-left">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Registration No (Short)</p>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{generatedIdInfo.registrationNo}</h3>
                    <button onClick={() => { navigator.clipboard.writeText(generatedIdInfo.registrationNo); toast.success('Copied'); }} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-primary-500"><Copy size={16} /></button>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 relative text-left">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Student ID (Long)</p>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{generatedIdInfo.studentId}</h3>
                    <button onClick={() => { navigator.clipboard.writeText(generatedIdInfo.studentId); toast.success('Copied'); }} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-primary-500"><Copy size={16} /></button>
                  </div>

                  <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-2xl border border-primary-100 dark:border-primary-900/30 relative text-left">
                    <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-1">Temporary Password</p>
                    <h3 className="text-xl font-black text-primary-700 dark:text-primary-400 tracking-wider font-mono">{generatedIdInfo.password}</h3>
                    <button onClick={() => { navigator.clipboard.writeText(generatedIdInfo.password); toast.success('Copied'); }} className="absolute top-4 right-4 p-2 text-primary-400 hover:text-primary-600"><Copy size={16} /></button>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl flex items-start space-x-3 text-left">
                  <AlertTriangle className="text-amber-600 shrink-0" size={18} />
                  <p className="text-xs text-amber-700 dark:text-amber-500 font-medium">This password will not be shown again. Please copy or share it with the student immediately.</p>
                </div>

                <Button className="w-full mt-4" onClick={() => { setIsModalOpen(false); setGeneratedIdInfo(null); }}>
                  Done
                </Button>
              </div>
          ) : (
              <StudentForm
                  student={editingStudent}
                  onSubmit={handleFormSubmit}
                  isLoading={formLoading}
              />
          )}
        </Modal>

        {/* Block Clearance Confirmation Modal */}
        <Modal
            isOpen={clearanceConfirm.isOpen}
            onClose={() => setClearanceConfirm({ isOpen: false, student: null })}
            title="Confirm Block Registration"
            size="sm"
        >
            <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-red-500/10">
                    <ShieldAlert size={32} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                        Block {clearanceConfirm.student?.name}?
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                        Are you sure you want to block registration access for this student? This will prevent them from adding or dropping courses.
                    </p>
                </div>
                <div className="flex flex-col space-y-3 pt-6">
                    <Button variant="danger" className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest" onClick={confirmBlock}>
                        Confirm Block
                    </Button>
                    <Button variant="secondary" className="w-full py-3 rounded-xl text-xs font-bold bg-transparent border-none" onClick={() => setClearanceConfirm({ isOpen: false, student: null })}>
                        Cancel
                    </Button>
                </div>
            </div>
        </Modal>
      </motion.div>
  );
};

export default StudentList;