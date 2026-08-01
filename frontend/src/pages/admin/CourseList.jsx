import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, BookOpen, Building2, Layers, Filter, CheckCircle2, XCircle, ArrowUpDown, ChevronLeft, ChevronRight, PackageOpen, Award } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import StatCard from '../../components/common/StatCard';
import CourseForm from './CourseForm';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../../api/courseApi';
import client from '../../api/client';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../../hooks/useAuth';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
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
      THEORY: 'bg-blue-50 text-blue-600 border-blue-100',
      LAB: 'bg-purple-50 text-purple-600 border-purple-100',
      PROJECT: 'bg-amber-50 text-amber-600 border-amber-100',
      RESEARCH: 'bg-emerald-50 text-emerald-600 border-emerald-100'
    };
    return (
      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border ${styles[type] || 'bg-gray-50 text-gray-600'}`}>
        {type}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Course Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Define university courses and their prerequisites.</p>
        </div>
        <Button onClick={handleAddClick} className="flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Course</span>
        </Button>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} label="Total Courses" value={stats.total} color="primary" />
        <StatCard icon={Award} label="Total Credits" value={stats.totalCredits} color="success" delay={0.1} />
        <StatCard icon={Layers} label="Theory" value={stats.theory} color="info" delay={0.2} />
        <StatCard icon={Building2} label="Labs / Projects" value={stats.lab} color="warning" delay={0.3} />
      </div>

      <Card className="!p-0 border-none shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col xl:flex-row gap-4">
           <div className="flex-1">
             <Input
               placeholder="Search by title or course code..."
               icon={Search}
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
           </div>
           <div className="flex flex-wrap gap-3">
             <select
               value={selectedDept}
               onChange={(e) => setSelectedDept(e.target.value)}
               className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white min-w-[150px]"
             >
               <option value="">All Departments</option>
               {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
             </select>

             <select
               value={selectedType}
               onChange={(e) => setSelectedType(e.target.value)}
               className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
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
               className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
             >
               <option value="">All Status</option>
               <option value="true">Active Only</option>
               <option value="false">Inactive Only</option>
             </select>
           </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th className="px-6 py-5 cursor-pointer hover:text-primary-500 transition-colors" onClick={() => handleSort('title')}>
                  <div className="flex items-center space-x-1">
                    <span>Course Detail</span>
                    <ArrowUpDown size={12} className={sort.key === 'title' ? 'text-primary-500' : 'opacity-30'} />
                  </div>
                </th>
                <th className="px-6 py-5">Department</th>
                <th className="px-6 py-5 text-center">Type</th>
                <th className="px-6 py-5 text-center cursor-pointer hover:text-primary-500 transition-colors" onClick={() => handleSort('creditHours')}>
                  <div className="flex items-center justify-center space-x-1">
                    <span>Credits</span>
                    <ArrowUpDown size={12} className={sort.key === 'creditHours' ? 'text-primary-500' : 'opacity-30'} />
                  </div>
                </th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                Array.from({ length: pageSize }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div><div className="h-2 bg-gray-100 dark:bg-gray-800 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-8 mx-auto"></div></td>
                    <td className="px-6 py-4"><div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-5 mx-auto"></div></td>
                    <td className="px-6 py-4"></td>
                  </tr>
                ))
              ) : courses.length > 0 ? courses.map((course) => (
                <motion.tr key={course.id} layout className="hover:bg-gray-50/80 dark:hover:bg-gray-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                       <div className="font-mono font-black text-[10px] text-primary-500 bg-primary-50 dark:bg-primary-900/30 px-2 py-1.5 rounded-lg shrink-0 border border-primary-100 dark:border-primary-900/50">
                         {course.courseCode}
                       </div>
                       <div className="flex flex-col">
                          <p className="text-sm font-black text-gray-900 dark:text-white leading-tight">{course.title}</p>
                          {course.prerequisiteCourseCode && (
                            <div className="flex items-center mt-1 text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">
                               <Layers size={10} className="mr-1" /> Pre: {course.prerequisiteCourseCode}
                            </div>
                          )}
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                       <Building2 size={14} className="mr-2 opacity-50" />
                       <span className="text-xs font-bold uppercase tracking-tight">{course.departmentName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {getTypeBadge(course.courseType)}
                  </td>
                  <td className="px-6 py-4 text-center font-black text-gray-900 dark:text-white text-sm">
                    {course.creditHours.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {course.isActive ? (
                      <div className="flex items-center justify-center text-green-500" title="Active">
                        <CheckCircle2 size={18} />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center text-gray-300 dark:text-gray-600" title="Inactive">
                        <XCircle size={18} />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleEditClick(course)} className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-all">
                        <Edit size={16} />
                      </button>
                      {isAdmin && (
                        <button onClick={() => handleDelete(course.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
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
                      <p className="text-lg font-medium">No courses found</p>
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
            Showing {courses.length} of {totalElements} Courses
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
