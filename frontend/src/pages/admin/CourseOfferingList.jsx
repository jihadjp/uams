import { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  Building2,
  Users,
  Search,
  BookOpen,
  Layers,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  TrendingUp,
  PackageOpen,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import StatCard from '../../components/common/StatCard';
import CourseOfferingForm from './CourseOfferingForm';
import { getCourseOfferings, createCourseOffering, updateCourseOffering, deleteCourseOffering } from '../../api/courseOfferingApi';
import { getSemesters } from '../../api/semesterApi';
import { getCourses } from '../../api/courseApi';
import client from '../../api/client';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../../hooks/useAuth';

const CourseOfferingList = () => {
  const [offerings, setOfferings] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { isAdmin } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffering, setEditingOffering] = useState(null);
  const [planningCourse, setPlanningCourse] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [expandedCourses, setExpandedCourses] = useState({});
  const [catalog, setCatalog] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(false);

  // Catalog Pagination & Sorting
  const [page, setPage] = useState(0);
  const [pageSize] = useState(6);
  const [totalElements, setTotalElements] = useState(0);
  const [sort, setSort] = useState({ key: 'courseCode', direction: 'asc' });

  const isContextSelected = Boolean(selectedSemester && selectedDept);

  const fetchCatalog = async () => {
    if (!selectedDept) return;
    setCatalogLoading(true);
    try {
      const res = await getCourses({
        departmentId: selectedDept,
        page,
        size: pageSize,
        sort: `${sort.key},${sort.direction}`,
        search: search || undefined
      });
      setCatalog(res.data?.content || res.data || []);
      setTotalElements(res.data?.totalElements || 0);
    } catch (err) {
      toast.error('Failed to load course catalog');
    } finally {
      setCatalogLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDept) fetchCatalog();
    else {
      setCatalog([]);
      setTotalElements(0);
    }
  }, [selectedDept, page, sort]);

  const stats = useMemo(() => {
    if (!offerings.length) return { total: 0, credits: 0, unique: 0, full: 0 };
    return {
      total: offerings.length,
      credits: offerings.reduce((acc, o) => acc + (o.creditHours || 0), 0),
      unique: new Set(offerings.map(o => o.courseId)).size,
      full: offerings.filter(o => o.enrolledCount >= o.seatLimit).length
    };
  }, [offerings]);

  const fetchMeta = async () => {
    try {
      const [semRes, deptRes] = await Promise.all([
        getSemesters(),
        client.get('/departments')
      ]);
      const sems = semRes.data?.content || semRes.data || [];
      setSemesters(sems);
      setDepartments(deptRes.data?.content || deptRes.data || []);

      const activeSem = sems.find(s => s.active);
      if (activeSem) setSelectedSemester(activeSem.id);
      else if (sems.length > 0) setSelectedSemester(sems[0].id);
    } catch (err) {
      toast.error('Failed to load metadata');
    }
  };

  const fetchOfferings = async () => {
    if (!selectedSemester) return;

    const isInitial = offerings.length === 0;
    if (isInitial) setLoading(true);
    else setRefreshing(true);

    try {
      const params = { semesterId: selectedSemester };
      if (selectedDept) params.departmentId = selectedDept;
      if (selectedBatch?.trim()) params.batch = selectedBatch.trim();
      if (search?.trim()) params.search = search.trim();

      const res = await getCourseOfferings(params);
      setOfferings(res.data?.content || res.data || []);
    } catch (err) {
      toast.error('Failed to fetch offerings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchMeta(); }, []);
  useEffect(() => { fetchOfferings(); }, [selectedSemester, selectedDept, selectedBatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 0) fetchCatalog();
      else setPage(0);
      fetchOfferings();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSort = (key) => {
    setSort(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const groupedOfferings = useMemo(() => {
    const groups = {};
    offerings.forEach(o => {
      const key = `${o.courseCode}`;
      if (!groups[key]) {
        groups[key] = {
          code: o.courseCode,
          title: o.courseTitle,
          credits: o.creditHours,
          items: []
        };
      }
      groups[key].items.push(o);
    });
    return Object.values(groups).sort((a, b) => a.code.localeCompare(b.code));
  }, [offerings]);

  const toggleCourse = (code) => {
    setExpandedCourses(prev => ({ ...prev, [code]: !prev[code] }));
  };

  const handleAddClick = (course) => {
    setPlanningCourse(course);
    setEditingOffering(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (e, offering) => {
    e.stopPropagation();
    console.log("CourseOfferingList Debug - Editing Offering:", offering);
    setPlanningCourse({
      id: offering.courseId,
      courseCode: offering.courseCode,
      title: offering.courseTitle,
      departmentId: offering.departmentId
    });
    setEditingOffering(offering);
    setIsModalOpen(true);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to remove this course offering?')) return;
    try {
      await deleteCourseOffering(id);
      toast.success('Offering removed');
      fetchOfferings();
    } catch (err) {
      toast.error('Failed to remove offering');
    }
  };

  const handleFormSubmit = async (data) => {
    setFormLoading(true);
    try {
      if (editingOffering) {
        await updateCourseOffering(editingOffering.id, data);
        toast.success('Offering updated successfully');
      } else {
        await createCourseOffering(data);
        toast.success('Section planned successfully');
      }
      setIsModalOpen(false);
      setPlanningCourse(null);
      fetchOfferings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid data');
    } finally {
      setFormLoading(false);
    }
  };

  return (
      <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8 pb-12"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
          <div>
            <h1 className="text-3xl font-black text-[#2D2A4F] dark:text-white tracking-tight">Course Planning</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 font-medium uppercase tracking-widest">Plan Semester Offerings</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={fetchOfferings} variant="secondary" className="p-2.5">
                <RefreshCw size={20} className={loading || refreshing ? 'animate-spin' : ''} />
            </Button>
          </div>
        </div>

        <Card className="!p-6 border-none shadow-xl bg-[#2D2A4F] text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300 ml-1">Semester</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300" size={18} />
                <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="w-full pl-12 pr-10 py-4 bg-white/10 border border-white/15 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-400/60 text-sm font-bold appearance-none cursor-pointer text-white"
                >
                  <option value="" className="text-gray-900">Select Semester</option>
                  {semesters.map(s => (
                      <option key={s.id} value={s.id} className="text-gray-900">{s.name} {s.active ? '(Active)' : ''}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300 ml-1">Department</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300" size={18} />
                <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full pl-12 pr-10 py-4 bg-white/10 border border-white/15 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-400/60 text-sm font-bold appearance-none cursor-pointer text-white"
                >
                  <option value="" className="text-gray-900">Choose Department</option>
                  {departments.map(d => <option key={d.id} value={d.id} className="text-gray-900">{d.name}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300 ml-1">Batch Filter (Optional)</label>
              <div className="relative group">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300" size={18} />
                <input
                    type="text"
                    placeholder="e.g. 242"
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/15 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-400/60 text-sm font-bold placeholder:text-white/40 text-white"
                />
              </div>
            </div>
          </div>
        </Card>

        {isContextSelected && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={LayoutGrid} label="Total Sections" value={stats.total} color="primary" />
              <StatCard icon={TrendingUp} label="Total Credits" value={stats.credits} color="success" delay={0.1} />
              <StatCard icon={BookOpen} label="Unique Courses" value={stats.unique} color="info" delay={0.2} />
              <StatCard icon={Users} label="Full Sections" value={stats.full} color="warning" delay={0.3} />
            </div>
        )}

        <AnimatePresence mode="wait">
          {!isContextSelected ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-24 text-center space-y-6">
                <div className="w-24 h-24 bg-primary-50 dark:bg-gray-800 rounded-[2.5rem] flex items-center justify-center mx-auto text-primary-300">
                  <Layers size={48} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-[#2D2A4F] dark:text-white">Planning Context Required</h3>
                  <p className="text-gray-500 dark:text-gray-400 font-medium max-w-sm mx-auto text-sm">Please select a Semester and Department above to start planning.</p>
                </div>
              </motion.div>
          ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-6 bg-primary-500 rounded-full" />
                    <h2 className="text-xl font-black text-[#2D2A4F] dark:text-white uppercase tracking-tight">Course Catalog</h2>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <input placeholder="Filter catalog..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-700 outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-300" />
                    </div>
                    <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-1">
                      <button onClick={() => handleSort('courseCode')} className={`p-1.5 rounded-lg transition-all ${sort.key === 'courseCode' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-primary-600 hover:bg-primary-50'}`} title="Sort by Code"><ArrowUpDown size={14} /></button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 relative">
                  {refreshing && (
                        <div className="absolute inset-x-0 -top-4 h-0.5 bg-primary-500/10 overflow-hidden z-20">
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                className="h-full w-1/3 bg-primary-500"
                            />
                        </div>
                    )}
                  <div className={`space-y-4 transition-opacity duration-200 ${refreshing ? 'opacity-50' : 'opacity-100'}`}>
                  {catalogLoading ? (
                      Array.from({ length: pageSize }).map((_, i) => (
                          <div key={i} className="h-24 bg-white dark:bg-gray-800 rounded-2xl animate-pulse border border-gray-200 dark:border-gray-700 p-5 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl"></div>
                              <div className="space-y-2">
                                <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-48"></div>
                                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded w-32"></div>
                              </div>
                            </div>
                            <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded-lg w-24"></div>
                          </div>
                      ))
                  ) : catalog.length > 0 ? catalog.map((course) => {
                    const courseOfferings = offerings.filter(o => String(o.courseId) === String(course.id));
                    const isExpanded = expandedCourses[course.courseCode];

                    return (
                        <Card key={course.id} className={`!p-0 border overflow-hidden transition-all ${isExpanded ? 'border-primary-300 ring-2 ring-primary-500/15 shadow-md' : 'border-gray-200 dark:border-gray-700 shadow-sm'}`}>
                          <div onClick={() => toggleCourse(course.courseCode)} className="p-5 flex items-center justify-between cursor-pointer bg-white dark:bg-gray-800 hover:bg-primary-50/50 dark:hover:bg-gray-800/50 transition-colors">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 text-primary-700 rounded-xl flex items-center justify-center font-mono text-xs font-black">
                                {course.courseCode}
                              </div>
                            <div>
                                <h3 className="text-base font-black text-[#2D2A4F] dark:text-white leading-tight">{course.title}</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{course.creditHours} Credits • {courseOfferings.length} Sections</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Button size="sm" onClick={(e) => { e.stopPropagation(); handleAddClick(course); }} className="bg-primary-600 hover:bg-primary-700 text-white text-[9px] font-black uppercase px-4 py-2 rounded-lg shadow-sm">Add Section</Button>
                              {isExpanded ? <ChevronUp className="text-primary-400" /> : <ChevronDown className="text-gray-300" />}
                            </div>
                          </div>

                          <AnimatePresence>
                            {isExpanded && (
                                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden bg-slate-50 dark:bg-gray-900/40 border-t border-gray-200 dark:border-gray-700">
                                  {courseOfferings.length > 0 ? (
                                      <div className="p-4">
                                        <table className="w-full text-left bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                                          <thead className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-gray-100 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                          <tr>
                                            <th className="px-6 py-4">Section</th>
                                            <th className="px-6 py-4">Batch</th>
                                            <th className="px-6 py-4">Teacher</th>
                                            <th className="px-6 py-4 text-center">Enrollment</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                          </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                          {courseOfferings.map(o => {
                                            const fillPercentage = Math.min(100, (o.enrolledCount / o.seatLimit) * 100);
                                            const isFull = o.enrolledCount >= o.seatLimit;

                                            return (
                                                <tr key={o.id} className="text-sm hover:bg-primary-50/40 dark:hover:bg-gray-800/60 transition-colors">
                                                  <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                      <span className="font-black text-primary-600">Sec {o.section}</span>
                                                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">ID: {o.id.substring(0, 8)}</span>
                                                    </div>
                                                  </td>
                                                  <td className="px-6 py-4 font-bold text-gray-500 dark:text-gray-400">{o.targetBatch}</td>
                                                  <td className="px-6 py-4 font-bold text-gray-700 dark:text-gray-200">{o.facultyName}</td>
                                                  <td className="px-6 py-4">
                                                    <div className="flex flex-col items-center space-y-1.5">
                                                      <div className="flex justify-between w-full text-[10px] font-black tabular-nums">
                                                        <span className={isFull ? 'text-red-500' : 'text-primary-600'}>{o.enrolledCount}</span>
                                                        <span className="text-gray-400">/ {o.seatLimit}</span>
                                                      </div>
                                                      <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${fillPercentage}%` }}
                                                            className={`h-full ${isFull ? 'bg-red-500' : 'bg-primary-500'}`}
                                                        />
                                                      </div>
                                                    </div>
                                                  </td>
                                                  <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end space-x-1">
                                                      <button onClick={(e) => handleEditClick(e, o)} className="p-2 text-gray-400 hover:text-primary-600 transition-colors"><Edit size={16} /></button>
                                                      {isAdmin && <button onClick={(e) => handleDelete(e, o.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>}
                                                    </div>
                                                  </td>
                                                </tr>
                                            );
                                          })}
                                          </tbody>
                                        </table>
                                      </div>
                                  ) : (
                                      <div className="p-8 text-center text-gray-400 italic text-xs">No sections planned yet.</div>
                                  )}
                                </motion.div>
                            )}
                          </AnimatePresence>
                        </Card>
                    );
                  }) : (
                      <Card className="py-20 text-center border-2 border-dashed border-gray-200 bg-white dark:bg-gray-800">
                        <PackageOpen className="mx-auto text-gray-300 mb-4" size={48} />
                        <h3 className="text-lg font-bold text-gray-500">No courses found in catalog</h3>
                        <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search query.</p>
                      </Card>
                  )}
                  </div>
                </div>

                {/* Pagination */}
                {totalElements > pageSize && (
                    <div className="flex items-center justify-between px-2 pt-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Showing {catalog.length} of {totalElements} courses</p>
                      <div className="flex items-center space-x-2">
                        <button
                            disabled={page === 0}
                            onClick={() => setPage(p => p - 1)}
                            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 disabled:opacity-30 hover:bg-primary-50 dark:hover:bg-gray-700 transition-all text-gray-600"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <span className="text-xs font-black text-[#2D2A4F] dark:text-white px-2">Page {page + 1}</span>
                        <button
                            disabled={(page + 1) * pageSize >= totalElements}
                            onClick={() => setPage(p => p + 1)}
                            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 disabled:opacity-30 hover:bg-primary-50 dark:hover:bg-gray-700 transition-all text-gray-600"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                )}
              </motion.div>
          )}
        </AnimatePresence>

        <Modal
            isOpen={isModalOpen}
            onClose={() => { setIsModalOpen(false); setPlanningCourse(null); setEditingOffering(null); }}
            title={editingOffering ? `Edit Section` : `Plan Section`}
            size="md"
        >
          <CourseOfferingForm
              key={editingOffering?.id || planningCourse?.id || 'new-offering-form'}
              offering={editingOffering}
              courseContext={planningCourse}
              semesterId={selectedSemester}
              batchContext={selectedBatch}
              departmentId={selectedDept}
              onSubmit={handleFormSubmit}
              isLoading={formLoading}
          />
        </Modal>
      </motion.div>
  );
};

export default CourseOfferingList;