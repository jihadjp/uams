import { useState, useEffect } from 'react';
import {
  CheckCircle,
  Clock,
  Eye,
  Check,
  BookOpen,
  User,
  Layers,
  Search,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import { getCourseOfferings, approveCourseResults } from '../../api/courseOfferingApi';
import { getSemesters } from '../../api/semesterApi';
import { getMarksMatrix } from '../../api/resultApi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ResultApproval = () => {
  const [offerings, setOfferings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Modal states
  const [matrixModal, setMatrixModal] = useState({ isOpen: false, data: null, offering: null });
  const [matrixLoading, setMatrixLoading] = useState(false);

  const fetchMeta = async () => {
    try {
      const semRes = await getSemesters();
      const sems = semRes.data?.content || semRes.data || [];
      setSemesters(sems);

      const activeSem = sems.find(s => s.active);
      if (activeSem) setSelectedSemester(activeSem.id);
      else if (sems.length > 0) setSelectedSemester(sems[0].id);
    } catch (err) {
      toast.error('Failed to load semesters');
    }
  };

  const fetchOfferings = async () => {
    if (!selectedSemester) return;
    if (offerings.length === 0) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await getCourseOfferings({
        semesterId: selectedSemester,
        isResultsPublished: true
      });
      const allOfferings = res.data?.content || res.data || [];
      setOfferings(allOfferings);
    } catch (err) {
      toast.error('Failed to fetch offerings for approval');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchMeta(); }, []);
  useEffect(() => { fetchOfferings(); }, [selectedSemester]);

  const handleReview = async (offering) => {
    setMatrixLoading(true);
    setMatrixModal({ isOpen: true, data: null, offering });
    try {
      const res = await getMarksMatrix(offering.id);
      setMatrixModal(prev => ({ ...prev, data: res.data || res }));
    } catch (err) {
      toast.error('Failed to load marks matrix');
      setMatrixModal({ isOpen: false, data: null, offering: null });
    } finally {
      setMatrixLoading(false);
    }
  };

  const handleApprove = async (offeringId) => {
    if (!window.confirm('Are you sure you want to approve results for this course? This will make results official for students.')) return;

    try {
      await approveCourseResults(offeringId);
      toast.success('Results approved successfully');
      fetchOfferings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve results');
    }
  };

  const filteredOfferings = offerings.filter(o =>
      o.courseCode.toLowerCase().includes(search.toLowerCase()) ||
      o.courseTitle.toLowerCase().includes(search.toLowerCase()) ||
      o.facultyName.toLowerCase().includes(search.toLowerCase())
  );

  return (
      <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-20 pt-4"
      >
        {/* Top Action Bar */}
        <div className="flex justify-end items-center">
          <Button onClick={fetchOfferings} variant="secondary" className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-white/10">
            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
          </Button>
        </div>

        {/* Filter Card */}
        <Card className="!p-5 sm:!p-6 border border-slate-200/80 dark:border-white/10 rounded-2xl sm:rounded-3xl bg-[#0B1225] text-white">
          <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6">
            <div className="flex-1 space-y-1.5 w-full">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300 ml-1">Semester Context</label>
              <div className="relative">
                <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-300 pointer-events-none" size={16} />
                <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="w-full pl-10 pr-9 py-3 bg-white/10 border border-white/15 rounded-xl sm:rounded-2xl outline-none text-xs sm:text-sm font-bold appearance-none cursor-pointer text-white"
                >
                  {semesters.map(s => (
                      <option key={s.id} value={s.id} className="text-slate-900">{s.name} {s.active ? '(Active)' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="hidden md:block w-px h-12 bg-white/10" />
            <div className="flex items-center gap-6 sm:gap-8 px-2 w-full md:w-auto justify-between md:justify-start">
              <div className="text-center">
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/40">Submitted</p>
                <p className="text-xl sm:text-2xl font-black">{offerings.length}</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/40">Pending</p>
                <p className="text-xl sm:text-2xl font-black text-amber-400">{offerings.filter(o => !o.resultsApproved).length}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Offerings Table Card */}
        <Card className="!p-0 overflow-hidden border border-slate-200/80 dark:border-white/10 rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-800/80">
          <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-white/[0.06]">
            <div className="relative group max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#007A55] transition-colors" size={16} />
              <input
                  type="text"
                  placeholder="Search course or faculty..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 dark:bg-gray-900 border border-gray-200/80 dark:border-gray-700/60 rounded-xl text-xs sm:text-sm font-medium outline-none dark:text-white transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto min-h-[300px] relative">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/80 dark:bg-white/[0.03] text-slate-500 dark:text-white/30 uppercase text-[10px] font-bold tracking-widest border-b border-slate-100 dark:border-white/[0.06]">
              <tr>
                <th className="px-4 sm:px-6 py-3.5 whitespace-nowrap">Course & Section</th>
                <th className="px-4 sm:px-6 py-3.5 whitespace-nowrap">Faculty</th>
                <th className="px-4 sm:px-6 py-3.5 text-center whitespace-nowrap">Status</th>
                <th className="px-4 sm:px-6 py-3.5 text-right whitespace-nowrap">Actions</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
              {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={4} className="px-6 py-6"><div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-full" /></td>
                      </tr>
                  ))
              ) : filteredOfferings.length > 0 ? (
                  filteredOfferings.map((o) => (
                      <tr key={o.id} className="group hover:bg-slate-50/60 dark:hover:bg-white/[0.04] transition-colors">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold border border-indigo-100 dark:border-indigo-900/30 shrink-0">
                              {o.courseCode}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight truncate">{o.courseTitle}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded border border-indigo-100 dark:border-indigo-800">
                              Section {o.section}
                            </span>
                                <span className="text-[10px] font-bold text-slate-400 font-mono">ID: {o.id.substring(0, 8)}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                              <User size={13} />
                            </div>
                            <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">{o.facultyName}</p>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-center whitespace-nowrap">
                          {o.resultsApproved ? (
                              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-500/20">
                                <CheckCircle size={11} />
                                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Approved</span>
                              </div>
                          ) : (
                              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full border border-amber-100 dark:border-amber-500/20">
                                <Clock size={11} />
                                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Pending</span>
                              </div>
                          )}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex justify-end items-center gap-1.5">
                            <Button
                                onClick={() => handleReview(o)}
                                variant="secondary"
                                size="sm"
                                className="!px-3 !py-1.5 text-[10px] font-black uppercase flex items-center gap-1 rounded-xl"
                            >
                              <Eye size={13} /> Review
                            </Button>
                            {!o.resultsApproved && (
                                <Button
                                    onClick={() => handleApprove(o.id)}
                                    size="sm"
                                    className="!px-3 !py-1.5 text-[10px] font-black uppercase flex items-center gap-1 bg-[#2D2A4F] hover:bg-[#1E1C38] text-white border-none rounded-xl"
                                >
                                  <Check size={13} /> Approve
                                </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                  ))
              ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 sm:py-20 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="w-14 h-14 bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/10 rounded-2xl flex items-center justify-center text-slate-300 dark:text-white/20">
                          <BookOpen size={28} />
                        </div>
                        <div>
                          <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">No results for approval</p>
                          <p className="text-xs text-slate-500 dark:text-white/40 max-w-xs mx-auto mt-0.5">Either no results have been published by faculty yet, or they don't match your filters.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Marks Matrix Modal */}
        <Modal
            isOpen={matrixModal.isOpen}
            onClose={() => setMatrixModal({ isOpen: false, data: null, offering: null })}
            title={matrixModal.offering ? `Review: ${matrixModal.offering.courseCode} - Section ${matrixModal.offering.section}` : 'Review Results'}
            size="xl"
        >
          {matrixLoading ? (
              <div className="h-56 flex flex-col items-center justify-center gap-3">
                <Loader />
                <p className="text-xs font-bold text-slate-400 animate-pulse uppercase tracking-widest">Compiling Marks Matrix...</p>
              </div>
          ) : matrixModal.data ? (
              <div className="space-y-4 sm:space-y-5">
                <div className="bg-amber-50/70 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 flex items-start gap-3">
                  <AlertCircle size={18} className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-300">Important Policy</h4>
                    <p className="text-xs text-amber-700/80 dark:text-amber-300/70 leading-relaxed mt-0.5 font-medium">
                      Please ensure that total marks and grades align with the university's grading policy. Once approved, these grades will be reflected on student transcripts.
                    </p>
                  </div>
                </div>

                <div className="border border-slate-200/80 dark:border-white/10 rounded-xl sm:rounded-2xl overflow-hidden bg-white dark:bg-gray-800">
                  <div className="overflow-x-auto max-h-[55vh]">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                      <thead className="sticky top-0 bg-slate-50 dark:bg-[#0F172A] border-b border-slate-200/80 dark:border-white/10 z-10">
                      <tr>
                        <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Student Info</th>
                        {matrixModal.offering?.courseType === 'THEORY' ? (
                            <>
                              <th className="px-3 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Att (7)</th>
                              <th className="px-3 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Q1 (15)</th>
                              <th className="px-3 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Q2 (15)</th>
                              <th className="px-3 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Q3 (15)</th>
                              <th className="px-3 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center bg-indigo-50/50 dark:bg-indigo-900/10">Avg (15)</th>
                              <th className="px-3 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Pres (8)</th>
                              <th className="px-3 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Assig (5)</th>
                              <th className="px-3 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Mid (25)</th>
                              <th className="px-3 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Final (40)</th>
                            </>
                        ) : (
                            <>
                              <th className="px-3 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Att (10)</th>
                              <th className="px-3 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Project (25)</th>
                              <th className="px-3 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Report (25)</th>
                              <th className="px-3 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Final (40)</th>
                            </>
                        )}
                        <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white text-center bg-emerald-50 dark:bg-emerald-900/10 font-bold">Total</th>
                      </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
                      {Array.isArray(matrixModal.data) && matrixModal.data.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02]">
                            <td className="px-4 py-2.5 whitespace-nowrap">
                              <p className="text-xs font-bold text-slate-900 dark:text-white">{row.studentName}</p>
                              <p className="text-[10px] font-mono text-slate-400 uppercase">{row.studentId}</p>
                            </td>
                            {matrixModal.offering?.courseType === 'THEORY' ? (
                                <>
                                  <td className="px-3 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 text-center">{row.attendanceMarks || 0}</td>
                                  <td className="px-3 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 text-center">{row.quiz1 || 0}</td>
                                  <td className="px-3 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 text-center">{row.quiz2 || 0}</td>
                                  <td className="px-3 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 text-center">{row.quiz3 || 0}</td>
                                  <td className="px-3 py-2.5 text-xs font-black text-indigo-600 dark:text-indigo-400 text-center bg-indigo-50/20 dark:bg-indigo-900/5">
                                    {(row.quizAverage || 0).toFixed(2)}
                                  </td>
                                  <td className="px-3 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 text-center">{row.presentation || 0}</td>
                                  <td className="px-3 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 text-center">{row.assignment || 0}</td>
                                  <td className="px-3 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 text-center">{row.midterm || 0}</td>
                                  <td className="px-3 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 text-center">{row.finalExam || 0}</td>
                                </>
                            ) : (
                                <>
                                  <td className="px-3 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 text-center">{row.attendanceMarks || 0}</td>
                                  <td className="px-3 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 text-center">{row.projectShow || 0}</td>
                                  <td className="px-3 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 text-center">{row.labReport || 0}</td>
                                  <td className="px-3 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 text-center">{row.labEvaluation || 0}</td>
                                </>
                            )}
                            <td className="px-4 py-2.5 text-xs font-black text-emerald-600 dark:text-emerald-400 text-center bg-emerald-50/30 dark:bg-emerald-900/5">
                              {matrixModal.offering?.courseType === 'THEORY'
                                  ? ((row.quizAverage || 0) + (row.attendanceMarks || 0) + (row.presentation || 0) + (row.assignment || 0) + (row.midterm || 0) + (row.finalExam || 0)).toFixed(2)
                                  : ((row.attendanceMarks || 0) + (row.projectShow || 0) + (row.labReport || 0) + (row.labEvaluation || 0)).toFixed(2)
                              }
                            </td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-white/10">
                  <Button
                      onClick={() => {
                        handleApprove(matrixModal.offering.id);
                        setMatrixModal({ isOpen: false, data: null, offering: null });
                      }}
                      disabled={matrixModal.offering?.resultsApproved}
                      className="bg-[#2D2A4F] hover:bg-[#1E1C38] text-white border-none rounded-xl text-xs font-bold py-2.5 px-6"
                  >
                    <Check className="mr-1.5" size={16} /> Approve These Results
                  </Button>
                </div>
              </div>
          ) : (
              <div className="p-8 text-center text-slate-400 italic text-xs">No data found.</div>
          )}
        </Modal>
      </motion.div>
  );
};

export default ResultApproval;