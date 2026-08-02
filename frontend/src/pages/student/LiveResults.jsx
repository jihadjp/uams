import { useState, useEffect, useCallback, Fragment } from 'react';
import {
  BarChart3,
  ChevronDown,
  ChevronUp,
  Info,
  User,
  Eye
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { useAuthStore } from '../../store/authStore';
import { getLiveResults } from '../../api/resultApi';
import { getSemesters } from '../../api/semesterApi';
import { getMyProfile } from '../../api/profileApi';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const LiveResults = () => {
  const [studentId, setStudentId] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemesterId, setSelectedSemesterId] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, semRes] = await Promise.all([
        getMyProfile(),
        getSemesters({ size: 100 })
      ]);

      const sProfile = profileRes.data.student;
      const allSemesters = semRes.data.content || semRes.data;

      setStudentId(sProfile?.id);
      setSemesters(allSemesters);

      if (allSemesters.length > 0) {
        setSelectedSemesterId(allSemesters[0].id);
      }
    } catch (err) {
      toast.error('Failed to load initial data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchResults = async () => {
    if (!studentId || !selectedSemesterId) return;
    setResultsLoading(true);
    try {
      const res = await getLiveResults(studentId, selectedSemesterId);
      setResults(res.data);
      setExpandedRows([]);
    } catch (err) {
      toast.error('Failed to load live results');
    } finally {
      setResultsLoading(false);
    }
  };

  const toggleRow = (id) => {
    setExpandedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-[#2D2A4F]">
            <BarChart3 size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[#2D2A4F] dark:text-white tracking-tight">Live Result</h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Current Semester Performance</p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex flex-col space-y-2 px-2 max-w-2xl">
        <label className="text-sm font-bold text-gray-500 dark:text-gray-400 ml-1">Select Semester</label>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 group">
            <select
              value={selectedSemesterId}
              onChange={(e) => setSelectedSemesterId(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-5 py-3.5 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all appearance-none font-bold text-sm cursor-pointer shadow-sm"
            >
              <option value="" disabled>Select Semester</option>
              {semesters.map(sem => (
                <option key={sem.id} value={sem.id}>
                  {sem.name}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2 pointer-events-none text-gray-400 group-hover:text-[#2D2A4F]">
              <span className="text-gray-300">|</span>
              <ChevronDown size={18} />
            </div>
          </div>
          <Button
            onClick={fetchResults}
            disabled={!selectedSemesterId || resultsLoading}
            className="px-12 py-3.5 bg-[#2D2A4F] hover:bg-[#1E1C38] text-white border-none rounded-xl font-bold shadow-lg shadow-[#2D2A4F]/20 transition-all"
          >
            {resultsLoading ? <Loader size="sm" light /> : 'Search'}
          </Button>
        </div>
      </div>

      {/* Results Table */}
      <Card className="!p-0 overflow-hidden border border-gray-100 dark:border-gray-800 shadow-xl rounded-[2.5rem]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-800/80 text-[#2D2A4F] dark:text-gray-300 uppercase text-[11px] font-black tracking-widest border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-6 py-5 w-24 text-center">Action</th>
                <th className="px-6 py-5 w-16 text-center">SL</th>
                <th className="px-6 py-5">Course Code</th>
                <th className="px-6 py-5">Course Title</th>
                <th className="px-6 py-5 text-center">Credit</th>
                <th className="px-6 py-5">Section</th>
                <th className="px-6 py-5">Teacher</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
              {resultsLoading ? (
                <tr><td colSpan="7" className="py-24 text-center"><Loader /></td></tr>
              ) : results.length > 0 ? results.map((r, idx) => (
                <Fragment key={r.enrollmentId}>
                  <tr className={`group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all ${expandedRows.includes(r.enrollmentId) ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}>
                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={() => toggleRow(r.enrollmentId)}
                        className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          expandedRows.includes(r.enrollmentId)
                            ? 'bg-red-500 text-white shadow-lg shadow-red-500/20'
                            : 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700'
                        }`}
                      >
                        <Eye size={14} />
                        <span>{expandedRows.includes(r.enrollmentId) ? 'Hide Result' : 'View Result'}</span>
                      </button>
                    </td>
                    <td className="px-6 py-5 text-center text-sm font-bold text-gray-400">{idx + 1}</td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                        {r.courseCode}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{r.courseTitle}</p>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300 tabular-nums">{r.credits}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                        {r.section}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-2">
                         <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <User size={12} />
                         </div>
                         <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{r.teacherName}</span>
                      </div>
                    </td>
                  </tr>
                  <AnimatePresence>
                    {expandedRows.includes(r.enrollmentId) && (
                      <tr className="bg-gray-50/30 dark:bg-gray-900/20">
                        <td colSpan="7" className="p-0">
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-8 py-8 border-l-4 border-indigo-500 ml-6 my-4 bg-white dark:bg-gray-800/50 rounded-2xl shadow-inner-sm">
                               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
                                  <div className="space-y-1">
                                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Attendance</p>
                                     <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">{r.attendancePercentage}%</p>
                                  </div>
                                  <div className="space-y-1">
                                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quiz 1</p>
                                     <p className="text-lg font-black text-gray-800 dark:text-white">{r.quiz1 || '0.00'}</p>
                                  </div>
                                  <div className="space-y-1">
                                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quiz 2</p>
                                     <p className="text-lg font-black text-gray-800 dark:text-white">{r.quiz2 || '0.00'}</p>
                                  </div>
                                  <div className="space-y-1">
                                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quiz 3</p>
                                     <p className="text-lg font-black text-gray-800 dark:text-white">{r.quiz3 || '0.00'}</p>
                                  </div>
                                  <div className="space-y-1">
                                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quiz Avg</p>
                                     <p className="text-lg font-black text-[#2D2A4F] dark:text-white underline decoration-2 decoration-indigo-500/30 underline-offset-4">{r.quizAverage || '0.00'}</p>
                                  </div>
                                  <div className="space-y-1">
                                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Midterm</p>
                                     <p className="text-lg font-black text-gray-800 dark:text-white">{r.midterm || '0.00'}</p>
                                  </div>
                                  <div className="space-y-1">
                                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mid Improvement</p>
                                     <p className="text-lg font-black text-amber-600 dark:text-amber-400">{r.midtermImprovement || '0.00'}</p>
                                  </div>
                               </div>
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </Fragment>
              )) : (
                <tr>
                  <td colSpan="7" className="py-24 text-center">
                    <div className="flex flex-col items-center space-y-3 opacity-40">
                      <Info size={48} className="text-gray-300" />
                      <p className="text-sm font-black uppercase tracking-widest italic text-gray-400">Search to view results</p>
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

export default LiveResults;
