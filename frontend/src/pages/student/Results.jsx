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
  Info
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ProgressRing from '../../components/common/ProgressRing';
import { getMyTranscript } from '../../api/resultApi';
import { useAuthStore } from '../../store/authStore';
import { getGradeColor } from '../../utils/gradeColor';
import toast from 'react-hot-toast';

const Results = () => {
  const user = useAuthStore(state => state.user);
  const [selectedSem, setSelectedSem] = useState('Spring 2026, 261');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const mockResults = [
    { code: 'CSE225', title: 'Data Communication', credit: '3.00', grade: 'D', gp: '2.00' },
    { code: 'CSE223', title: 'Digital Logic Design', credit: '3.00', grade: 'C', gp: '2.25' },
    { code: 'CSE227', title: 'Systems Analysis and Design', credit: '3.00', grade: 'C', gp: '2.25' },
    { code: 'CSE224', title: 'Digital Logic Design lab', credit: '1.50', grade: 'A', gp: '3.75' },
    { code: 'CSE228', title: 'Theory of Computation', credit: '3.00', grade: 'B-', gp: '2.75' },
  ];

  useEffect(() => {
    // In real app, fetch by studentId and selectedSem
    setTimeout(() => {
        setResults(mockResults);
        setLoading(false);
    }, 500);
  }, [selectedSem]);

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Academic Result</h1>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Grade Reports</p>
      </div>

      <Card className="flex flex-col md:flex-row md:items-center gap-6">
         <div className="flex-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Select Semester</label>
            <div className="relative">
               <select
                 value={selectedSem}
                 onChange={(e) => setSelectedSem(e.target.value)}
                 className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 outline-none appearance-none font-bold text-sm"
               >
                  <option>Spring 2026, 261</option>
                  <option>Fall 2025, 253</option>
               </select>
               <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
         </div>
         <Button className="md:mt-6 px-12 bg-[#312e81]">Search</Button>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
         <div className="xl:col-span-2 space-y-6">
            <Card title="Student Information" icon={GraduationCap}>
               <div className="space-y-6 mt-4">
                  <div>
                    <h3 className="text-xl font-black text-indigo-700 dark:text-indigo-400">{user?.name}</h3>
                    <div className="space-y-2 mt-4">
                       <div className="flex items-center text-sm font-bold text-gray-600 dark:text-gray-400">
                          <BookOpen size={16} className="mr-3 text-indigo-500" /> B.Sc. in Computer Science & Engineering
                       </div>
                       <div className="flex items-center text-sm font-bold text-gray-600 dark:text-gray-400">
                          <Users size={16} className="mr-3 text-indigo-500" /> Batch: 67
                       </div>
                       <div className="flex items-center text-sm font-bold text-gray-600 dark:text-gray-400">
                          <FileText size={16} className="mr-3 text-indigo-500" /> Student ID: 0242420005101211
                       </div>
                       <div className="flex items-center text-sm font-bold text-gray-600 dark:text-gray-400">
                          <Layers size={16} className="mr-3 text-indigo-500" /> Reg ID: 242-15-211
                       </div>
                       <div className="flex items-center text-sm font-bold text-indigo-600 dark:text-indigo-400 pt-2">
                          <Info size={16} className="mr-3" /> SGPA of {selectedSem}: 2.47
                       </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto border-t border-gray-100 dark:border-gray-700 pt-6">
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
                           {results.map((r, i) => (
                             <tr key={i} className="group">
                                <td className="py-4 text-xs font-bold text-gray-400">{i + 1}</td>
                                <td className="py-4 font-mono text-xs font-black text-gray-700 dark:text-gray-300">{r.code}</td>
                                <td className="py-4 text-sm font-bold text-gray-600 dark:text-gray-400">{r.title}</td>
                                <td className="py-4 text-center text-sm font-medium text-gray-500">{r.credit}</td>
                                <td className="py-4 text-center">
                                   <span className="font-black text-gray-700 dark:text-gray-300">{r.grade}</span>
                                </td>
                                <td className="py-4 text-right font-mono font-bold text-gray-900 dark:text-white">{r.gp}</td>
                             </tr>
                           ))}
                        </tbody>
                        <tfoot>
                           <tr className="bg-gray-50 dark:bg-gray-800/50 font-black text-[10px] uppercase">
                              <td colSpan="3" className="p-4 text-right">Total Credit</td>
                              <td className="p-4 text-center">13.50</td>
                              <td className="p-4 text-right">SGPA</td>
                              <td className="p-4 text-right text-indigo-600">2.47</td>
                           </tr>
                        </tfoot>
                     </table>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl text-center">
                     <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                        N.B. : If you see Teaching Evaluation Pending in any course. Please complete <span className="underline cursor-pointer">Teaching Evaluation</span>.
                     </p>
                  </div>
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
                           <th className="p-3">Remarks</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-gray-600 dark:text-gray-400 font-medium">
                        <tr><td className="p-3">80-100</td><td className="p-3 font-bold text-gray-900 dark:text-white">A+</td><td className="p-3">4.00</td><td className="p-3">Outstanding</td></tr>
                        <tr><td className="p-3">75-79</td><td className="p-3 font-bold text-gray-900 dark:text-white">A</td><td className="p-3">3.75</td><td className="p-3">Excellent</td></tr>
                        <tr><td className="p-3">70-74</td><td className="p-3 font-bold text-gray-900 dark:text-white">A-</td><td className="p-3">3.50</td><td className="p-3">Very Good</td></tr>
                        <tr><td className="p-3">65-69</td><td className="p-3 font-bold text-gray-900 dark:text-white">B+</td><td className="p-3">3.25</td><td className="p-3">Good</td></tr>
                        <tr><td className="p-3">60-64</td><td className="p-3 font-bold text-gray-900 dark:text-white">B</td><td className="p-3">3.00</td><td className="p-3">Satisfactory</td></tr>
                     </tbody>
                  </table>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 text-center border-t border-gray-100 dark:border-gray-700">
                     <p className="text-[8px] font-bold text-gray-400 italic uppercase">Effective from Summer Semester 2007</p>
                  </div>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
};

export default Results;
