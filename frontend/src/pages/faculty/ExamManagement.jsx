import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Save,
  User,
  History,
  Info,
  Calendar,
  Layers,
  Award,
  Search,
  BookOpen,
  ArrowUpDown,
  Hash,
  Filter
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { getMarksMatrix, saveMarksMatrix } from '../../api/resultApi';
import { getCourseOfferingById } from '../../api/courseOfferingApi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const MARK_LIMITS = {
  THEORY: {
    quiz1: 15,
    quiz2: 15,
    quiz3: 15,
    presentation: 8,
    attendanceMarks: 7,
    assignment: 5,
    midterm: 25,
    finalExam: 40
  },
  LAB: {
    attendanceMarks: 10,
    projectShow: 25,
    labReport: 25,
    labEvaluation: 40
  }
};

const ExamManagement = () => {
  const { offeringId } = useParams();
  const navigate = useNavigate();
  const [offering, setOffering] = useState(null);
  const [matrix, setMatrix] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [offeringRes, matrixRes] = await Promise.all([
        getCourseOfferingById(offeringId),
        getMarksMatrix(offeringId)
      ]);
      setOffering(offeringRes.data);
      setMatrix(matrixRes.data);
    } catch (err) {
      toast.error('Failed to load marks matrix');
    } finally {
      setLoading(false);
    }
  }, [offeringId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleMarkChange = (enrollmentId, field, value) => {
    if (value < 0) return;

    const limits = MARK_LIMITS[offering?.courseType];
    if (limits && limits[field] && value > limits[field]) {
        toast.error(`Max allowed for this field: ${limits[field]}`);
        return;
    }

    setMatrix(prev => prev.map(row =>
      row.enrollmentId === enrollmentId ? { ...row, [field]: value } : row
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveMarksMatrix(offeringId, matrix);
      toast.success('Marks saved successfully');
      fetchData();
    } catch (err) {
      toast.error('Failed to save marks');
    } finally {
      setSaving(false);
    }
  };

  const filteredMatrix = matrix.filter(r =>
    (r.studentName || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.studentId || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="flex items-center space-x-4">
           <button
             onClick={() => navigate('/faculty/results')}
             className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:text-indigo-600 transition-all group"
           >
             <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
           </button>
           <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Marks Management
              </h1>
              <p className="text-slate-500 dark:text-white/40 text-xs font-black uppercase tracking-widest mt-1">
                {offering?.courseCode} - {offering?.courseTitle} <span className="text-indigo-600 dark:text-indigo-400 opacity-60">|</span> Sec {offering?.section}
              </p>
           </div>
        </div>

        <div className="flex items-center space-x-3">
           <Button variant="secondary" className="rounded-xl px-6" onClick={() => navigate(`/faculty/attendance/${offeringId}`)}>
              Attendance
           </Button>
           <Button
             onClick={handleSave}
             isLoading={saving}
             className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 rounded-xl px-8"
           >
              <Save size={18} />
              <span>Save Changes</span>
           </Button>
        </div>
      </div>

      {/* Info & Search */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end px-2">
         <div className="lg:col-span-2">
            <div className="flex items-center gap-2 p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
               <Info size={18} className="text-indigo-600 shrink-0" />
               <p className="text-[11px] font-bold text-indigo-900/70 dark:text-indigo-400/80 leading-relaxed uppercase tracking-wider">
                 Enter marks directly in the cells below. Click "Save Changes" to sync with the database and notify students.
               </p>
            </div>
         </div>
         <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search Student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm"
            />
         </div>
      </div>

      {/* Marks Matrix Table */}
      <Card className="!p-0 overflow-hidden border border-slate-100 dark:border-white/5 shadow-2xl shadow-indigo-900/5 rounded-[2.5rem]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-slate-50/50 dark:bg-white/[0.02] text-slate-400 dark:text-gray-400 uppercase text-[10px] font-black tracking-widest border-b border-slate-100 dark:border-white/5">
              <tr>
                <th className="px-8 py-6 w-16 text-center">SL</th>
                <th className="px-4 py-6">Student Information</th>
                {offering?.courseType === 'THEORY' ? (
                  <>
                    <th className="px-4 py-6 text-center bg-amber-50/30 dark:bg-amber-500/5">Q1 (15)</th>
                    <th className="px-4 py-6 text-center bg-amber-50/30 dark:bg-amber-500/5">Q2 (15)</th>
                    <th className="px-4 py-6 text-center bg-amber-50/30 dark:bg-amber-500/5">Q3 (15)</th>
                    <th className="px-4 py-6 text-center bg-amber-50/30 dark:bg-amber-500/5">Pres. (8)</th>
                    <th className="px-4 py-6 text-center bg-amber-50/30 dark:bg-amber-500/5">Att. (7)</th>
                    <th className="px-4 py-6 text-center bg-amber-50/30 dark:bg-amber-500/5">Assig. (5)</th>
                    <th className="px-4 py-6 text-center bg-indigo-50/30 dark:bg-indigo-500/5">Mid (25)</th>
                    <th className="px-4 py-6 text-center bg-emerald-50/30 dark:bg-emerald-500/5">Final (40)</th>
                  </>
                ) : (
                  <>
                    <th className="px-4 py-6 text-center bg-amber-50/30 dark:bg-amber-500/5">Attendance (10)</th>
                    <th className="px-4 py-6 text-center bg-amber-50/30 dark:bg-amber-500/5">Project Show (25)</th>
                    <th className="px-4 py-6 text-center bg-amber-50/30 dark:bg-amber-500/5">Lab Report (25)</th>
                    <th className="px-4 py-6 text-center bg-emerald-50/30 dark:bg-emerald-500/5">Final Evaluation (40)</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
              {filteredMatrix.map((row, idx) => (
                <tr key={row.enrollmentId} className="group hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-all">
                  <td className="px-8 py-5 text-center text-xs font-black text-slate-300 dark:text-white/20">{idx + 1}</td>
                  <td className="px-4 py-5">
                    <div className="flex items-center space-x-3">
                       <div className="w-10 h-10 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-slate-100 dark:border-white/5 flex items-center justify-center text-indigo-600 font-black">
                          {row.studentName?.charAt(0)}
                       </div>
                       <div>
                          <p className="text-sm font-black text-slate-900 dark:text-white leading-none uppercase">{row.studentName}</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-white/20 mt-1.5 uppercase tracking-tighter">{row.studentId}</p>
                       </div>
                    </div>
                  </td>

                  {offering?.courseType === 'THEORY' ? (
                    <>
                      <td className="px-4 py-5 text-center">
                        <input
                          type="number"
                          value={row.quiz1 || ''}
                          onChange={(e) => handleMarkChange(row.enrollmentId, 'quiz1', e.target.value)}
                          className="w-16 px-2 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-center font-black text-xs outline-none"
                        />
                      </td>
                      <td className="px-4 py-5 text-center">
                        <input
                          type="number"
                          value={row.quiz2 || ''}
                          onChange={(e) => handleMarkChange(row.enrollmentId, 'quiz2', e.target.value)}
                          className="w-16 px-2 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-center font-black text-xs outline-none"
                        />
                      </td>
                      <td className="px-4 py-5 text-center">
                        <input
                          type="number"
                          value={row.quiz3 || ''}
                          onChange={(e) => handleMarkChange(row.enrollmentId, 'quiz3', e.target.value)}
                          className="w-16 px-2 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-center font-black text-xs outline-none"
                        />
                      </td>
                      <td className="px-4 py-5 text-center">
                        <input
                          type="number"
                          value={row.presentation || ''}
                          onChange={(e) => handleMarkChange(row.enrollmentId, 'presentation', e.target.value)}
                          className="w-16 px-2 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-center font-black text-xs outline-none"
                        />
                      </td>
                      <td className="px-4 py-5 text-center">
                        <input
                          type="number"
                          value={row.attendanceMarks || ''}
                          onChange={(e) => handleMarkChange(row.enrollmentId, 'attendanceMarks', e.target.value)}
                          className="w-16 px-2 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-center font-black text-xs outline-none"
                        />
                      </td>
                      <td className="px-4 py-5 text-center">
                        <input
                          type="number"
                          value={row.assignment || ''}
                          onChange={(e) => handleMarkChange(row.enrollmentId, 'assignment', e.target.value)}
                          className="w-16 px-2 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-center font-black text-xs outline-none"
                        />
                      </td>
                      <td className="px-4 py-5 text-center">
                        <input
                          type="number"
                          value={row.midterm || ''}
                          onChange={(e) => handleMarkChange(row.enrollmentId, 'midterm', e.target.value)}
                          className="w-16 px-2 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-center font-black text-xs outline-none"
                        />
                      </td>
                      <td className="px-4 py-5 text-center">
                        <input
                          type="number"
                          value={row.finalExam || ''}
                          onChange={(e) => handleMarkChange(row.enrollmentId, 'finalExam', e.target.value)}
                          className="w-16 px-2 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-center font-black text-xs outline-none"
                        />
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-5 text-center">
                        <input
                          type="number"
                          value={row.attendanceMarks || ''}
                          onChange={(e) => handleMarkChange(row.enrollmentId, 'attendanceMarks', e.target.value)}
                          className="w-20 px-3 py-2.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-center font-black text-sm outline-none"
                        />
                      </td>
                      <td className="px-4 py-5 text-center">
                        <input
                          type="number"
                          value={row.projectShow || ''}
                          onChange={(e) => handleMarkChange(row.enrollmentId, 'projectShow', e.target.value)}
                          className="w-20 px-3 py-2.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-center font-black text-sm outline-none"
                        />
                      </td>
                      <td className="px-4 py-5 text-center">
                        <input
                          type="number"
                          value={row.labReport || ''}
                          onChange={(e) => handleMarkChange(row.enrollmentId, 'labReport', e.target.value)}
                          className="w-20 px-3 py-2.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-center font-black text-sm outline-none"
                        />
                      </td>
                      <td className="px-4 py-5 text-center">
                        <input
                          type="number"
                          value={row.labEvaluation || ''}
                          onChange={(e) => handleMarkChange(row.enrollmentId, 'labEvaluation', e.target.value)}
                          className="w-20 px-3 py-2.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-center font-black text-sm outline-none"
                        />
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ExamManagement;
