import { useState, useEffect, useCallback, Fragment } from 'react';
import {
  BarChart3,
  ChevronDown,
  Info,
  User,
  Eye,
  EyeOff,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
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
  const [expandedRow, setExpandedRow] = useState(null);
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, semRes] = await Promise.all([
        getMyProfile(),
        getSemesters({ size: 100 }),
      ]);
      const sProfile = profileRes.data.student;
      const allSemesters = semRes.data.content || semRes.data;
      setStudentId(sProfile?.id);
      setSemesters(allSemesters);
      const activeSem =
          allSemesters.find(
              (s) => s.status === 'REGISTRATION' || s.status === 'ONGOING'
          ) || allSemesters[0];
      if (activeSem) {
        setSelectedSemesterId(activeSem.id);
        if (sProfile?.id) {
          const res = await getLiveResults(sProfile.id, activeSem.id);
          setResults(res.data || []);
        }
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
      setResults(res.data || []);
      setExpandedRow(null);
    } catch (err) {
      toast.error('Failed to load live results');
    } finally {
      setResultsLoading(false);
    }
  };
  const toggleRow = (id) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };
  if (loading)
    return (
        <div className="h-[60vh] flex items-center justify-center">
          <Loader size="lg" />
        </div>
    );
  return (
      <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-20 pt-4">
        {/* Semester Filter Section */}
        <Card className="!p-4 sm:!p-6 border border-slate-200/80 dark:border-white/10 shadow-sm bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
            <div className="flex-1 space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 ml-1">
                Select Semester
              </label>
              <div className="relative group">
                <select
                    value={selectedSemesterId}
                    onChange={(e) => setSelectedSemesterId(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200/80 dark:border-gray-700 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/30 transition-all appearance-none font-bold text-xs sm:text-sm dark:text-white cursor-pointer"
                >
                  <option value="" disabled>
                    Select Semester
                  </option>
                  {semesters.map((sem) => (
                      <option key={sem.id} value={sem.id}>
                        {sem.name}
                      </option>
                  ))}
                </select>
                <ChevronDown
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-indigo-500 transition-colors"
                />
              </div>
            </div>
            <Button
                onClick={fetchResults}
                disabled={!selectedSemesterId || resultsLoading}
                className="w-full sm:w-auto px-8 sm:px-10 py-3.5 bg-[#2D2A4F] hover:bg-[#1E1C38] text-white border-none rounded-xl sm:rounded-2xl font-bold transition-all text-xs sm:text-sm shadow-sm hover:shadow-md"
            >
              {resultsLoading ? <Loader size="sm" light /> : 'Search'}
            </Button>
          </div>
        </Card>
        {/* Results Table */}
        <Card className="!p-0 overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-sm rounded-2xl sm:rounded-3xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/80 dark:bg-gray-800/80 text-[#2D2A4F] dark:text-gray-300 uppercase text-[10px] font-black tracking-widest border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="px-4 sm:px-6 py-4 w-40 text-left whitespace-nowrap">
                  Action
                </th>
                <th className="px-4 sm:px-6 py-4 w-12 text-center whitespace-nowrap">
                  SL
                </th>
                <th className="px-4 sm:px-6 py-4 whitespace-nowrap">Course Code</th>
                <th className="px-4 sm:px-6 py-4 whitespace-nowrap">Course Title</th>
                <th className="px-4 sm:px-6 py-4 text-center whitespace-nowrap">
                  Credit
                </th>
                <th className="px-4 sm:px-6 py-4 whitespace-nowrap">Section</th>
                <th className="px-4 sm:px-6 py-4 whitespace-nowrap">Teacher</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {resultsLoading ? (
                  <tr>
                    <td colSpan="7" className="py-20 text-center">
                      <Loader />
                    </td>
                  </tr>
              ) : results.length > 0 ? (
                  results.map((r, idx) => {
                    const isExpanded = expandedRow === r.enrollmentId;
                    return (
                        <Fragment key={r.enrollmentId}>
                          <tr
                              className={`group transition-colors duration-200 ${
                                  isExpanded
                                      ? 'bg-indigo-50/40 dark:bg-indigo-900/10'
                                      : 'hover:bg-gray-50/70 dark:hover:bg-gray-800/30'
                              }`}
                          >
                            <td className="px-4 sm:px-6 py-4 sm:py-5 whitespace-nowrap">
                              <button
                                  onClick={() => toggleRow(r.enrollmentId)}
                                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-bold transition-all shadow-sm ${
                                      isExpanded
                                          ? 'bg-red-500 text-white hover:bg-red-600'
                                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                  }`}
                              >
                                {isExpanded ? <EyeOff size={13} /> : <Eye size={13} />}
                                <span>{isExpanded ? 'Hide Result' : 'View Result'}</span>
                              </button>
                            </td>
                            <td className="px-4 sm:px-6 py-4 sm:py-5 text-center text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                              {idx + 1}
                            </td>
                            <td className="px-4 sm:px-6 py-4 sm:py-5 whitespace-nowrap">
                          <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">
                            {r.courseCode}
                          </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 sm:py-5 whitespace-nowrap">
                              <p className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-100">
                                {r.courseTitle}
                              </p>
                            </td>
                            <td className="px-4 sm:px-6 py-4 sm:py-5 text-center whitespace-nowrap">
                          <span className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 tabular-nums">
                            {r.credits}
                          </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 sm:py-5 whitespace-nowrap">
                          <span className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300">
                            {r.section}
                          </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 sm:py-5 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                                  <User size={12} />
                                </div>
                                <span className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300">
                              {r.teacherName}
                            </span>
                              </div>
                            </td>
                          </tr>
                          {/* Clean simple key/value expanded panel */}
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                                <tr>
                                  <td colSpan="7" className="p-0 bg-gray-50/60 dark:bg-gray-900/30">
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{
                                          duration: 0.3,
                                          ease: [0.16, 1, 0.3, 1],
                                          opacity: { duration: 0.2 },
                                        }}
                                        className="overflow-hidden"
                                    >
                                      <div className="px-4 sm:px-8 py-5 sm:py-6">
                                        <div className="max-w-3xl border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                                          <table className="w-full text-left border-collapse">
                                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            <tr className="bg-gray-50 dark:bg-gray-800/60">
                                              <th className="px-4 sm:px-5 py-3 w-1/2 text-[13px] font-bold text-gray-800 dark:text-gray-200">
                                                Attendance Percentage
                                              </th>
                                              <td className="px-4 sm:px-5 py-3 text-[13px] font-bold text-gray-800 dark:text-gray-200">
                                                {r.attendancePercentage ?? 0}%
                                              </td>
                                            </tr>
                                            <tr>
                                              <th className="px-4 sm:px-5 py-3 w-1/2 text-[13px] font-bold text-gray-800 dark:text-gray-200">
                                                Quiz 1
                                              </th>
                                              <td className="px-4 sm:px-5 py-3 text-[13px] font-bold text-gray-800 dark:text-gray-200">
                                                {r.quiz1 ?? 0}
                                              </td>
                                            </tr>
                                            <tr className="bg-gray-50 dark:bg-gray-800/60">
                                              <th className="px-4 sm:px-5 py-3 w-1/2 text-[13px] font-bold text-gray-800 dark:text-gray-200">
                                                Quiz 2
                                              </th>
                                              <td className="px-4 sm:px-5 py-3 text-[13px] font-bold text-gray-800 dark:text-gray-200">
                                                {r.quiz2 ?? 0}
                                              </td>
                                            </tr>
                                            <tr>
                                              <th className="px-4 sm:px-5 py-3 w-1/2 text-[13px] font-bold text-gray-800 dark:text-gray-200">
                                                Quiz 3
                                              </th>
                                              <td className="px-4 sm:px-5 py-3 text-[13px] font-bold text-gray-800 dark:text-gray-200">
                                                {r.quiz3 ?? 0}
                                              </td>
                                            </tr>
                                            <tr className="bg-gray-50 dark:bg-gray-800/60">
                                              <th className="px-4 sm:px-5 py-3 w-1/2 text-[13px] font-bold text-gray-800 dark:text-gray-200">
                                                Quiz Average
                                              </th>
                                              <td className="px-4 sm:px-5 py-3 text-[13px] font-bold text-gray-800 dark:text-gray-200">
                                                {r.quizAverage ?? 0}
                                              </td>
                                            </tr>
                                            <tr>
                                              <th className="px-4 sm:px-5 py-3 w-1/2 text-[13px] font-bold text-gray-800 dark:text-gray-200">
                                                Midterm
                                              </th>
                                              <td className="px-4 sm:px-5 py-3 text-[13px] font-bold text-gray-800 dark:text-gray-200">
                                                {r.midterm ?? 0}
                                              </td>
                                            </tr>
                                            <tr className="bg-gray-50 dark:bg-gray-800/60">
                                              <th className="px-4 sm:px-5 py-3 w-1/2 text-[13px] font-bold text-gray-800 dark:text-gray-200">
                                                Midterm Improvement
                                              </th>
                                              <td className="px-4 sm:px-5 py-3 text-[13px] font-bold text-gray-800 dark:text-gray-200">
                                                {r.midtermImprovement ?? 0}
                                              </td>
                                            </tr>
                                            <tr>
                                              <th className="px-4 sm:px-5 py-3 w-1/2 text-[13px] font-bold text-[#007A55] dark:text-emerald-400">
                                                Final Exam
                                              </th>
                                              <td className="px-4 sm:px-5 py-3 text-[13px] font-bold text-[#007A55] dark:text-emerald-400">
                                                {r.finalExam ?? 0}
                                              </td>
                                            </tr>
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>
                                    </motion.div>
                                  </td>
                                </tr>
                            )}
                          </AnimatePresence>
                        </Fragment>
                    );
                  })
              ) : selectedSemesterId ? (
                  <tr>
                    <td colSpan="7" className="py-20 text-center">
                      <div className="flex flex-col items-center space-y-3 opacity-40">
                        <BarChart3 size={40} className="text-gray-300" />
                        <p className="text-xs sm:text-sm font-black uppercase tracking-widest italic text-gray-400">
                          No results found for this semester
                        </p>
                      </div>
                    </td>
                  </tr>
              ) : (
                  <tr>
                    <td colSpan="7" className="py-20 text-center">
                      <div className="flex flex-col items-center space-y-3 opacity-40">
                        <Info size={40} className="text-gray-300" />
                        <p className="text-xs sm:text-sm font-black uppercase tracking-widest italic text-gray-400">
                          Search to view results
                        </p>
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