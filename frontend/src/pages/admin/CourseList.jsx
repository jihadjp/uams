import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, BookOpen, Building2, Layers, CheckCircle2, XCircle, ArrowUpDown, ChevronLeft, ChevronRight, PackageOpen, Award, RefreshCw } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import StatCard from '../../components/common/StatCard';
import CourseForm from './CourseForm';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../../api/courseApi';
import client from '../../api/client';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import useAuth from '../../hooks/useAuth';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [departments, setDepartments] = useState([]);

  // Pagination & Sorting State
  const [page, setPage] = useState(0);
  const [pageSize] = useState(8);
  const [totalElements, setTotalElements] = useState(0);
  const [sort, setSort] = useState({ key: 'title', direction: 'asc' });

  const { isAdmin } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const fetchCourses = async () => {
    const isInitial = courses.length === 0;
    if (isInitial) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await getCourses({
        page,
        size: pageSize,
        sort: `${sort.key},${sort.direction}`,
        search: search || undefined,
        departmentId: selectedDept || undefined,
        type: selectedType || undefined,
        isActive: selectedStatus === '' ? undefined : selectedStatus === 'true'
      });
      setCourses(res.data.content || res.data || []);
      setTotalElements(res.data.totalElements || (res.data.content ? res.data.content.length : 0));
    } catch (err) {
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const stats = useMemo(() => {
    const list = Array.isArray(courses) ? courses : [];
    return {
      total: totalElements,
      totalCredits: list.reduce((acc, c) => acc + (c.creditHours || 0), 0),
      theory: list.filter(c => c.courseType === 'THEORY').length,
      lab: list.filter(c => c.courseType === 'LAB' || c.courseType === 'PROJECT').length
    };
  }, [courses, totalElements]);

  const fetchDepts = async () => {
    try {
      const res = await client.get('/departments');
      setDepartments(res.data.content || res.data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchCourses();
  }, [selectedDept, selectedType, selectedStatus, page, sort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 0) fetchCourses();
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
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (course) => {
    setEditingCourse({
      ...course,
      departmentId: departments.find(d => d.name === course.departmentName)?.id
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await deleteCourse(id);
      toast.success('Course deleted');
      fetchCourses();
    } catch (err) {
      toast.error('Failed to delete course');
    }
  };

  const handleFormSubmit = async (data) => {
    setFormLoading(true);
    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, data);
        toast.success('Course updated');
      } else {
        await createCourse(data);
        toast.success('Course created');
      }
      setIsModalOpen(false);
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  const getTypeBadge = (type) => {
    const styles = {
      THEORY: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
      LAB: 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20',
      PROJECT: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
      RESEARCH: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-widest border ${styles[type] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
        {type}
      </span>
    );
  };

  return (
      <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-20 pt-4">
        {/* Top Action Bar */}
        <div className="flex justify-end items-center gap-2 sm:gap-3">
          <Button onClick={fetchCourses} variant="secondary" className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-white/10">
            <RefreshCw size={18} className={loading || refreshing ? 'animate-spin' : ''} />
          </Button>
          <Button onClick={handleAddClick} className="bg-[#2D2A4F] hover:bg-[#1E1C38] text-white flex items-center gap-2 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm py-2.5 px-4 border-none">
            <Plus size={16} />
            <span>Add Course</span>
          </Button>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard icon={BookOpen} label="Total Courses" value={stats.total} color="primary" />
          <StatCard icon={Award} label="Total Credits" value={stats.totalCredits} color="success" delay={0.1} />
          <StatCard icon={Layers} label="Theory" value={stats.theory} color="info" delay={0.2} />
          <StatCard icon={Building2} label="Labs / Projects" value={stats.lab} color="warning" delay={0.3} />
        </div>

        <Card className="!p-0 overflow-hidden border border-slate-200/80 dark:border-white/10 rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-800/80">
          <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-white/[0.06] flex flex-col xl:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <Input
                  placeholder="Search by title or course code..."
                  icon={Search}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="px-3.5 py-2.5 sm:py-3 bg-slate-50/70 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium outline-none dark:text-white transition-all cursor-pointer min-w-[140px]"
              >
                <option value="">All Departments</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>

              <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3.5 py-2.5 sm:py-3 bg-slate-50/70 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium outline-none dark:text-white transition-all cursor-pointer"
              >
                <option value="">All Types</option>
                <option value="THEORY">Theory</option>
                <option value="LAB">Lab</option>
                <option value="PROJECT">Project</option>
                <option value="RESEARCH">Research</option>
              </select>

              <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3.5 py-2.5 sm:py-3 bg-slate-50/70 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium outline-none dark:text-white transition-all cursor-pointer"
              >
                <option value="">All Status</option>
                <option value="true">Active Only</option>
                <option value="false">Inactive Only</option>
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
                <th className="px-4 sm:px-6 py-3.5 cursor-pointer hover:text-[#007A55] transition-colors whitespace-nowrap" onClick={() => handleSort('title')}>
                  <div className="flex items-center space-x-1">
                    <span>Course Detail</span>
                    <ArrowUpDown size={12} className={sort.key === 'title' ? 'text-[#007A55]' : 'opacity-30'} />
                  </div>
                </th>
                <th className="px-4 sm:px-6 py-3.5 whitespace-nowrap">Department</th>
                <th className="px-4 sm:px-6 py-3.5 text-center whitespace-nowrap">Type</th>
                <th className="px-4 sm:px-6 py-3.5 text-center cursor-pointer hover:text-[#007A55] transition-colors whitespace-nowrap" onClick={() => handleSort('creditHours')}>
                  <div className="flex items-center justify-center space-x-1">
                    <span>Credits</span>
                    <ArrowUpDown size={12} className={sort.key === 'creditHours' ? 'text-[#007A55]' : 'opacity-30'} />
                  </div>
                </th>
                <th className="px-4 sm:px-6 py-3.5 text-center whitespace-nowrap">Status</th>
                <th className="px-4 sm:px-6 py-3.5 text-right whitespace-nowrap">Actions</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
              {loading && courses.length === 0 ? (
                  Array.from({ length: pageSize }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-4 sm:px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-48 mb-2"></div><div className="h-2 bg-slate-100 dark:bg-white/5 rounded w-20"></div></td>
                        <td className="px-4 sm:px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-24"></div></td>
                        <td className="px-4 sm:px-6 py-4"><div className="h-5 bg-slate-200 dark:bg-white/10 rounded w-16 mx-auto"></div></td>
                        <td className="px-4 sm:px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-8 mx-auto"></div></td>
                        <td className="px-4 sm:px-6 py-4"><div className="h-5 bg-slate-200 dark:bg-white/10 rounded-full w-5 mx-auto"></div></td>
                        <td className="px-4 sm:px-6 py-4"></td>
                      </tr>
                  ))
              ) : courses.length > 0 ? courses.map((course) => (
                  <motion.tr key={course.id} layout className="hover:bg-slate-50/60 dark:hover:bg-white/[0.04] transition-colors group">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-start space-x-3">
                        <div className="font-mono font-black text-[10px] text-[#007A55] dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1.5 rounded-lg shrink-0 border border-emerald-100 dark:border-emerald-500/20">
                          {course.courseCode}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight truncate">{course.title}</p>
                          {course.prerequisiteCourseCode && (
                              <div className="flex items-center mt-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">
                                <Layers size={10} className="mr-1 shrink-0" /> Pre: {course.prerequisiteCourseCode}
                              </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-slate-500 dark:text-white/70">
                        <Building2 size={13} className="mr-1.5 opacity-60 shrink-0" />
                        <span className="text-xs font-bold uppercase tracking-tight">{course.departmentName}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center whitespace-nowrap">
                      {getTypeBadge(course.courseType)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center font-black text-slate-900 dark:text-white text-xs sm:text-sm whitespace-nowrap">
                      {course.creditHours.toFixed(1)}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center whitespace-nowrap">
                      {course.isActive ? (
                          <div className="flex items-center justify-center text-emerald-500" title="Active">
                            <CheckCircle2 size={17} />
                          </div>
                      ) : (
                          <div className="flex items-center justify-center text-slate-300 dark:text-slate-600" title="Inactive">
                            <XCircle size={17} />
                          </div>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => handleEditClick(course)} className="p-1.5 sm:p-2 text-slate-400 hover:text-[#007A55] hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-all border border-transparent hover:border-emerald-100 dark:hover:border-emerald-500/20" title="Edit Course">
                          <Edit size={16} />
                        </button>
                        {isAdmin && (
                            <button onClick={() => handleDelete(course.id)} className="p-1.5 sm:p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-100 dark:hover:border-red-500/20" title="Delete Course">
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
                        <p className="text-base sm:text-lg font-bold text-slate-600 dark:text-white/40">No courses found</p>
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
              Showing {courses.length} of {totalElements} Courses
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
            title={editingCourse ? 'Edit Course' : 'Create New Course'}
            size="lg"
        >
          <CourseForm
              course={editingCourse}
              onSubmit={handleFormSubmit}
              isLoading={formLoading}
          />
        </Modal>
      </div>
  );
};

export default CourseList;