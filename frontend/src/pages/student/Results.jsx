import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  ChevronDown,
  ChevronUp,
  Download,
  Award,
  BookOpen,
  PieChart,
  GraduationCap,
  Users,
  Layers,
  Info,
  AlertCircle
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { getAcademicResults } from '../../api/resultApi';
import { getSemesters } from '../../api/semesterApi';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const Results = () => {
  const user = useAuthStore(state => state.user);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemId, setSelectedSemId] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const response = await getSemesters();
        const semesterList = response.data?.content || response.data || [];
        setSemesters(semesterList);
        if (semesterList.length > 0) {
          setSelectedSemId(semesterList[0].id);
          fetchResults(semesterList[0].id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        toast.error("Failed to load semesters");
        setLoading(false);
      }
    };
    fetchSemesters();
  }, []);

  const fetchResults = async (semId) => {
    setSearching(true);
    try {
      const response = await getAcademicResults(semId);
      setData(response.data);
    } catch (error) {
      toast.error("Failed to fetch results");
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const handleSearch = () => {
    if (selectedSemId) {
      fetchResults(selectedSemId);
    }
  };

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;

  const selectedSemName = semesters.find(s => s.id === selectedSemId)?.name || 'N/A';

  return (
    <div className="space-y-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Academic Result</h1>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Grade Reports</p>
      </motion.div>

      <Card className="flex flex-col md:flex-row md:items-center gap-6">
         <div className="flex-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Select Semester</label>
            <div className="relative">
               <select
                 value={selectedSemId}
                 onChange={(e) => setSelectedSemId(e.target.value)}
                 className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 outline-none appearance-none font-bold text-sm"
               >
                  {semesters.map(sem => (
                    <option key={sem.id} value={sem.id}>{sem.name}</option>
                  ))}
               </select>
               <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
         </div>
         <Button
            className="md:mt-6 px-12 bg-[#312e81]"
            onClick={handleSearch}
            isLoading={searching}
         >
            Search
         </Button>
      </Card>

      {!data && !loading && (
        <Card className="text-center py-12">
          <Info size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-bold">No results found for the selected semester.</p>
        </Card>
      )}

      {data && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          <div className="xl:col-span-2 space-y-6">
            <Card title="Student Information" icon={GraduationCap}>
              <div className="space-y-6 mt-4">
                  <div>
                    <h3 className="text-xl font-black text-indigo-700 dark:text-indigo-400">{data.studentName}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                       <div className="flex items-center text-sm font-bold text-gray-600 dark:text-gray-400">
                          <BookOpen size={16} className="mr-3 text-indigo-500" /> {data.programName}
                       </div>
                       <div className="flex items-center text-sm font-bold text-gray-600 dark:text-gray-400">
                          <Users size={16} className="mr-3 text-indigo-500" /> Batch: {data.batch}
                       </div>
                       <div className="flex items-center text-sm font-bold text-gray-600 dark:text-gray-400">
                          <FileText size={16} className="mr-3 text-indigo-500" /> Student ID: {data.studentId}
                       </div>
                       <div className="flex items-center text-sm font-bold text-gray-600 dark:text-gray-400">
                          <Layers size={16} className="mr-3 text-indigo-500" /> Reg ID: {data.registrationNo}
                       </div>
                    </div>
                    <div className="flex items-center text-sm font-black text-indigo-600 dark:text-indigo-400 pt-6 mt-6 border-t border-gray-100 dark:border-gray-700">
                       <Award size={18} className="mr-3" /> SGPA of {selectedSemName}: {data.sgpa?.toFixed(2) || '0.00'}
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                           <tr>
                              <th className="pb-4">SL</th>
                              <th className="pb-4">Course Code</th>
                              <th className="pb-4">Course Title</th>
                              <th className="pb-4 text-center">Credit</th>
                              <th className="pb-4 text-center">Grade</th>
                              <th className="pb-4 text-right">Grade Point</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                           {data.courses.map((r, i) => (
                             <tr key={i} className="group">
                                <td className="py-4 text-xs font-bold text-gray-400">{i + 1}</td>
                                <td className="py-4 font-mono text-xs font-black text-gray-700 dark:text-gray-300">{r.courseCode}</td>
                                <td className="py-4 text-sm font-bold text-gray-600 dark:text-gray-400">{r.courseTitle}</td>
                                <td className="py-4 text-center text-sm font-medium text-gray-500">{r.credits?.toFixed(2) || '0.00'}</td>
                                <td className="py-4 text-center">
                                   {r.evaluationPending ? (
                                      <span className="text-[9px] px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full font-black uppercase tracking-tighter">
                                        Evaluation Pending
                                      </span>
                                   ) : (
                                      <span className="font-black text-gray-700 dark:text-gray-300">{r.grade}</span>
                                   )}
                                </td>
                                <td className="py-4 text-right font-mono font-bold text-gray-900 dark:text-white">
                                  {r.gradePoint !== null ? r.gradePoint.toFixed(2) : '-'}
                                </td>
                             </tr>
                           ))}
                        </tbody>
                        <tfoot>
                           <tr className="bg-gray-50 dark:bg-gray-800/50 font-black text-[10px] uppercase">
                              <td colSpan="3" className="p-4 text-right">Total Credit</td>
                              <td className="p-4 text-center">{data.totalCredits?.toFixed(2) || '0.00'}</td>
                              <td className="p-4 text-right">SGPA</td>
                              <td className="p-4 text-right text-indigo-600">{data.sgpa?.toFixed(2) || '0.00'}</td>
                           </tr>
                        </tfoot>
                     </table>
                  </div>

                  {data.courses.some(c => c.evaluationPending) && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl flex items-start gap-4">
                      <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                      <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 leading-relaxed">
                          N.B. : You have pending teaching evaluations for some courses.
                          Grade and Grade Point are hidden until evaluations are completed.
                          Please complete <span className="underline cursor-pointer font-black" onClick={() => navigate('/student/evaluation')}>Teaching Evaluation</span> to unlock your results.
                      </p>
                    </div>
                  )}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="UGC Uniform Grading System">
               <div className="space-y-0 mt-4 overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-700">
                  <table className="w-full text-[10px] text-left">
                     <thead className="bg-gray-50 dark:bg-gray-800/50 font-black text-gray-400 uppercase border-b border-gray-100 dark:border-gray-700">
                        <tr>
                           <th className="p-3">Marks (%)</th>
                           <th className="p-3">Grade</th>
                           <th className="p-3">GP</th>
                           <th className="p-3 text-right">Remarks</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-gray-600 dark:text-gray-400 font-medium">
                        <tr><td className="p-3">80-100</td><td className="p-3 font-bold text-gray-900 dark:text-white">A+</td><td className="p-3">4.00</td><td className="p-3 text-right">Outstanding</td></tr>
                        <tr><td className="p-3">75-79</td><td className="p-3 font-bold text-gray-900 dark:text-white">A</td><td className="p-3">3.75</td><td className="p-3 text-right">Excellent</td></tr>
                        <tr><td className="p-3">70-74</td><td className="p-3 font-bold text-gray-900 dark:text-white">A-</td><td className="p-3">3.50</td><td className="p-3 text-right">Very Good</td></tr>
                        <tr><td className="p-3">65-69</td><td className="p-3 font-bold text-gray-900 dark:text-white">B+</td><td className="p-3">3.25</td><td className="p-3 text-right">Good</td></tr>
                        <tr><td className="p-3">60-64</td><td className="p-3 font-bold text-gray-900 dark:text-white">B</td><td className="p-3">3.00</td><td className="p-3 text-right">Satisfactory</td></tr>
                        <tr><td className="p-3">55-59</td><td className="p-3 font-bold text-gray-900 dark:text-white">B-</td><td className="p-3">2.75</td><td className="p-3 text-right">Above Avg</td></tr>
                        <tr><td className="p-3">50-54</td><td className="p-3 font-bold text-gray-900 dark:text-white">C+</td><td className="p-3">2.50</td><td className="p-3 text-right">Average</td></tr>
                        <tr><td className="p-3">45-49</td><td className="p-3 font-bold text-gray-900 dark:text-white">C</td><td className="p-3">2.25</td><td className="p-3 text-right">Below Avg</td></tr>
                        <tr><td className="p-3">40-44</td><td className="p-3 font-bold text-gray-900 dark:text-white">D</td><td className="p-3">2.00</td><td className="p-3 text-right">Pass</td></tr>
                        <tr><td className="p-3">00-39</td><td className="p-3 font-bold text-red-500">F</td><td className="p-3">0.00</td><td className="p-3 text-right">Fail</td></tr>
                     </tbody>
                  </table>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 text-center border-t border-gray-100 dark:border-gray-700">
                     <p className="text-[8px] font-bold text-gray-400 italic uppercase">Effective from Summer Semester 2007</p>
                  </div>
               </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
