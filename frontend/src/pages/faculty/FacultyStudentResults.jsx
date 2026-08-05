import { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  Search,
  BookOpen,
  ChevronDown,
  ChevronUp,
  User,
  Info,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { getOfferingResults } from '../../api/resultApi';
import { getMyCourses, getMyProfile } from '../../api/facultyApi';
import client from '../../api/client';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const FacultyStudentResults = () => {
  const [courses, setCourses] = useState([]);
  const [selectedOfferingId, setSelectedOfferingId] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'studentName', direction: 'asc' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, semRes] = await Promise.all([
        getMyProfile(),
        client.get('/semesters/active')
      ]);

      const facultyId = profileRes.data.id;
      const activeSemId = semRes.data?.id;

      if (!activeSemId) {
        toast.error('No active semester found');
        setLoading(false);
        return;
      }

      const coursesRes = await getMyCourses({
        facultyId,
        semesterId: activeSemId,
        size: 100
      });

      const courseList = coursesRes.data.content || coursesRes.data;
      setCourses(courseList);

      if (courseList.length > 0) {
        setSelectedOfferingId(courseList[0].id);
      }
    } catch (err) {
      toast.error('Failed to load active courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchResults = async () => {
    if (!selectedOfferingId) return;
    setResultsLoading(true);
    try {
      const res = await getOfferingResults(selectedOfferingId);
      setResults(res.data);
    } catch (err) {
      toast.error('Failed to load student results');
    } finally {
      setResultsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedOfferingId) {
        fetchResults();
    }
  }, [selectedOfferingId]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredResults = results.filter(r =>
    (r.studentName || "").toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    const valA = a[sortConfig.key];
    const valB = b[sortConfig.key];
    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-indigo-600">
            <TrendingUp size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[#2D2A4F] dark:text-white tracking-tight">Student Results</h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Live Performance Overview</p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
        <div className="lg:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Select Course & Section</label>
            <div className="relative group">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                <select
                    value={selectedOfferingId}
                    onChange={(e) => setSelectedOfferingId(e.target.value)}
                    className="w-full pl-12 pr-10 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-bold text-sm appearance-none cursor-pointer"
                >
                    {courses.map(course => (
                        <option key={course.id} value={course.id}>
                            {course.courseCode} - {course.courseTitle} (Sec: {course.section})
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
        </div>

        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Quick Search</label>
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                <input
                    type="text"
                    placeholder="Search by student name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-bold text-sm"
                />
            </div>
        </div>
      </div>

      {/* Main Table */}
      <Card className="!p-0 overflow-hidden border border-gray-100 dark:border-gray-800 shadow-xl rounded-[2.5rem]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-800/80 text-[#2D2A4F] dark:text-gray-300 uppercase text-[10px] font-black tracking-widest border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-5 cursor-pointer hover:text-primary-600 transition-colors" onClick={() => handleSort('studentName')}>
                   <div className="flex items-center space-x-2">
                      <span>Student Name</span>
                      <ArrowUpDown size={12} className={sortConfig.key === 'studentName' ? 'text-primary-500' : 'opacity-30'} />
                   </div>
                </th>
                <th className="px-6 py-5 text-center">Attendance %</th>
                <th className="px-6 py-5 text-center">Theory/Lab Marks</th>
                <th className="px-6 py-5 text-center">Midterm</th>
                <th className="px-6 py-5 text-center">Final</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
              {resultsLoading ? (
                <tr><td colSpan="5" className="py-24 text-center"><Loader /></td></tr>
              ) : filteredResults.length > 0 ? filteredResults.map((r) => (
                <tr key={r.enrollmentId} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all">
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-3">
                       <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-black text-[10px]">
                          {r.studentName?.charAt(0) || '?'}
                       </div>
                       <span className="font-bold text-gray-700 dark:text-gray-200">{r.studentName || 'Unknown Student'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center font-black text-indigo-600 dark:text-indigo-400">{r.attendancePercentage}%</td>
                  <td className="px-6 py-5 text-center">
                     <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] text-gray-400">Q: {r.quiz1 || 0} | P: {r.presentation || 0}</span>
                        <span className="text-[10px] text-gray-400">A: {r.assignment || 0} | Att: {r.attendanceMarks || 0}</span>
                     </div>
                  </td>
                  <td className="px-6 py-5 text-center font-bold text-gray-600 dark:text-gray-400">{r.midterm || '0.00'}</td>
                  <td className="px-6 py-5 text-center font-black text-[#2D2A4F] dark:text-white bg-indigo-50/10 dark:bg-indigo-900/5 border-x border-gray-100 dark:border-gray-700">{r.finalExam || '0.00'}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" className="py-24 text-center">
                    <div className="flex flex-col items-center space-y-3 opacity-40">
                      <Info size={48} className="text-gray-300" />
                      <p className="text-sm font-black uppercase tracking-widest italic text-gray-400">No student data available</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default FacultyStudentResults;
