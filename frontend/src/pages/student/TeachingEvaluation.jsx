import { useState } from 'react';
import { Star, Info, ChevronDown, User, BookOpen, Send, X } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const TeachingEvaluation = () => {
  const [selectedSem, setSelectedSem] = useState('Summer 2026');
  const [activeCourse, setActiveCourse] = useState(null);

  const courses = [
    { id: 1, code: 'CSE311', title: 'Database Management System', section: '67_O', teacher: 'Monthasir Delwar Afnan', status: 'Not Submitted' },
    { id: 2, code: 'CSE312', title: 'Database Management System Lab', section: '67_O2', teacher: 'Monthasir Delwar Afnan', status: 'Not Submitted' },
  ];

  const questions = [
    "The teacher gave a detailed course outline with the names of the required textbooks and reference materials.",
    "The teacher ensured that classes consistently started and concluded on schedule.",
    "The teacher used practical examples during the class.",
    "The teacher actively encouraged questions and fostered peer discussions among students.",
    "The teacher provided constructive feedback on the students' learning progress.",
    "The teacher ensured students took all the necessary quizzes, presentations and assignments.",
    "The teacher delivered lectures with effective communication skills.",
    "The teacher delivered the prescribed syllabus covering the required topics.",
    "The teacher treated all students impartially and objectively.",
    "The teacher was friendly, responsible, helpful and was available during counselling hour."
  ];

  const options = ["Below average", "Average", "Good", "Very Good", "Excellent"];

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">Teaching Evaluation</h1>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Faculty Feedback</p>
      </div>

      <AnimatePresence>
        {activeCourse && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-primary-200 ring-1 ring-primary-100">
               <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white">{activeCourse.title}</h2>
                    <p className="text-sm font-bold text-primary-600 mt-1">{activeCourse.code}, {activeCourse.section}, {activeCourse.teacher}</p>
                  </div>
                  <button onClick={() => setActiveCourse(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                     <X size={20} className="text-gray-400" />
                  </button>
               </div>

               <div className="space-y-8">
                  {questions.map((q, qIdx) => (
                    <div key={qIdx} className="space-y-4">
                       <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                          {qIdx + 1}. {q} <span className="text-red-500">*</span>
                       </p>
                       <div className="flex flex-wrap gap-4">
                          {options.map((opt) => (
                            <label key={opt} className="flex items-center space-x-2 cursor-pointer group">
                               <input type="radio" name={`q${qIdx}`} className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500" />
                               <span className="text-xs font-medium text-gray-500 group-hover:text-primary-600 transition-colors">{opt}</span>
                            </label>
                          ))}
                       </div>
                    </div>
                  ))}

                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Optional Note</label>
                     <textarea
                       rows="4"
                       className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/20 text-sm dark:text-white"
                       placeholder="Enter any additional feedback..."
                     />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                     <Button variant="secondary" onClick={() => setActiveCourse(null)}>Cancel</Button>
                     <Button className="px-12 bg-[#312e81]" onClick={() => { toast.success('Evaluation submitted!'); setActiveCourse(null); }}>
                        <Send size={18} className="mr-2" /> Submit
                     </Button>
                  </div>
               </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Card>
         <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
            <div className="flex-1">
               <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Select Semester</label>
               <div className="relative">
                  <select
                    value={selectedSem}
                    onChange={(e) => setSelectedSem(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 outline-none appearance-none font-bold text-sm"
                  >
                     <option>Summer 2026, 262</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
               </div>
            </div>
            <Button className="md:mt-6 bg-[#312e81]">Search</Button>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-gray-50 dark:bg-gray-800/50 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-700">
                  <tr>
                     <th className="px-6 py-4">Submit Status</th>
                     <th className="px-6 py-4">Course</th>
                     <th className="px-6 py-4 text-center">Section</th>
                     <th className="px-6 py-4">Teacher</th>
                     <th className="px-6 py-4 text-right">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {courses.map((c) => (
                    <tr key={c.id} className="group hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all">
                       <td className="px-6 py-5">
                          <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-black rounded uppercase">Not Submitted</span>
                       </td>
                       <td className="px-6 py-5">
                          <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">{c.title}</p>
                          <p className="text-[10px] text-gray-400 font-mono mt-0.5">{c.code}</p>
                       </td>
                       <td className="px-6 py-5 text-center font-mono text-xs font-bold text-gray-500">{c.section}</td>
                       <td className="px-6 py-5 text-sm font-medium text-gray-600 dark:text-gray-400">{c.teacher}</td>
                       <td className="px-6 py-5 text-right">
                          <Button size="sm" onClick={() => setActiveCourse(c)}>Evaluate</Button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </Card>
    </div>
  );
};

export default TeachingEvaluation;
