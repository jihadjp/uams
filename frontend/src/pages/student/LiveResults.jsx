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

const ResultCard = ({ label, val, max, unit = '', color = 'indigo', highlight = false }) => {
  const percentage = Math.min(100, (val / max) * 100);
  const colors = {
    indigo: 'bg-indigo-600 dark:bg-indigo-500 text-indigo-600',
    amber: 'bg-amber-500 dark:bg-amber-400 text-amber-500',
    emerald: 'bg-emerald-600 dark:bg-emerald-500 text-emerald-600',
    primary: 'bg-primary-600 dark:bg-primary-500 text-primary-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-5 rounded-2xl border ${highlight ? 'border-primary-200 dark:border-primary-900/50 bg-primary-50/10' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/50'} shadow-sm flex flex-col justify-between group hover:shadow-md transition-all h-full`}
    >
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">{label}</p>
        <div className="flex items-baseline gap-1.5">
          <span className={`text-2xl font-black ${highlight ? 'text-primary-600 dark:text-primary-400' : 'text-[#2D2A4F] dark:text-white'}`}>
            {typeof val === 'number' ? val.toFixed(unit === '%' ? 1 : 2) : val || 0}
          </span>
          <span className="text-[11px] font-bold text-gray-300 uppercase tracking-tighter">/ {max}{unit}</span>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-wider text-gray-400">
           <span>Progress</span>
           <span>{Math.round(percentage)}%</span>
        </div>
        <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden border border-gray-50 dark:border-gray-700">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full ${colors[color].split(' ')[0]}`}
          />
        </div>
      </div>
    </motion.div>
  );
};

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

                          {/* Professional Stat-Card Scorecard */}
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                                <tr>
                                  <td colSpan="7" className="p-0 bg-slate-50/30 dark:bg-gray-900/20">
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                      <div className="px-4 sm:px-8 py-8 sm:py-12">
                                        <div className="max-w-6xl mx-auto space-y-10">

                                          {/* Component Grid */}
                                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                                            {r.courseType === 'THEORY' ? (
                                              <>
                                                <ResultCard label="Attendance Record" val={r.attendancePercentage} max={100} unit="%" color="emerald" />
                                                <ResultCard label="Attendance Marks" val={r.attendanceMarks} max={7} color="indigo" />
                                                <ResultCard label="Quiz 1" val={r.quiz1} max={15} color="amber" />
                                                <ResultCard label="Quiz 2" val={r.quiz2} max={15} color="amber" />
                                                <ResultCard label="Quiz 3" val={r.quiz3} max={15} color="amber" />
                                                <ResultCard label="Quiz Average" val={r.quizAverage} max={15} color="amber" highlight />
                                                <ResultCard label="Presentation" val={r.presentation} max={8} color="indigo" />
                                                <ResultCard label="Assignment" val={r.assignment} max={5} color="indigo" />
                                                <ResultCard label="Midterm" val={r.midterm} max={25} color="primary" />
                                                <ResultCard label="Final Exam" val={r.finalExam} max={40} color="primary" highlight />
                                              </>
                                            ) : (
                                              <>
                                                <ResultCard label="Attendance Marks" val={r.attendanceMarks} max={10} color="indigo" />
                                                <ResultCard label="Project Show" val={r.projectShow} max={25} color="indigo" />
                                                <ResultCard label="Lab Report" val={r.labReport} max={25} color="indigo" />
                                                <ResultCard label="Final Evaluation" val={r.labEvaluation} max={40} color="emerald" highlight />
                                              </>
                                            )}
                                          </div>

                                          <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                             <Info size={18} className="text-gray-400" />
                                             <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                               These results are live and subject to change until approved by the Registrar office.
                                             </p>
                                          </div>
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