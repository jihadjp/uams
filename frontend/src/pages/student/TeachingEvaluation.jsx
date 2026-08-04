import { useState, useEffect } from 'react';
import { Star, Info, ChevronDown, User, BookOpen, Send, X, CheckCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getActiveSemester } from '../../api/semesterApi';
import { getEvaluationStatus, submitEvaluation } from '../../api/evaluationApi';
import { getMyProfile } from '../../api/profileApi';

const TeachingEvaluation = () => {
  const [semester, setSemester] = useState(null);
  const [courses, setCourses] = useState([]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState(null);

  const [ratings, setRatings] = useState(Array(10).fill(0));
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [semRes, profileRes] = await Promise.all([
        getActiveSemester(),
        getMyProfile()
      ]);

      setSemester(semRes.data);
      const sId = profileRes.data.student?.id;
      setStudentId(sId);

      if (semRes.data?.id) {
        const statusRes = await getEvaluationStatus(semRes.data.id);
        setCourses(statusRes.data);
      }
    } catch (error) {
      toast.error('Failed to load evaluation data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (ratings.some(r => r === 0)) {
      toast.error('Please answer all evaluation questions.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        studentId,
        offeringId: activeCourse.offeringId,
        q1: ratings[0],
        q2: ratings[1],
        q3: ratings[2],
        q4: ratings[3],
        q5: ratings[4],
        q6: ratings[5],
        q7: ratings[6],
        q8: ratings[7],
        q9: ratings[8],
        q10: ratings[9],
        comments
      };

      await submitEvaluation(payload);
      toast.success('Evaluation submitted successfully!');

      // Update local state
      setCourses(prev => prev.map(c =>
        c.offeringId === activeCourse.offeringId ? { ...c, submitted: true } : c
      ));

      setActiveCourse(null);
      setRatings(Array(10).fill(0));
      setComments('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit evaluation');
    } finally {
      setSubmitting(false);
    }
  };

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

  const options = [
    { label: "Below average", value: 1 },
    { label: "Average", value: 2 },
    { label: "Good", value: 3 },
    { label: "Very Good", value: 4 },
    { label: "Excellent", value: 5 }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

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
                    <h2 className="text-xl font-black text-gray-900 dark:text-white">{activeCourse.courseTitle}</h2>
                    <p className="text-sm font-bold text-primary-600 mt-1">{activeCourse.courseCode}, {activeCourse.facultyName}</p>
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
                            <label key={opt.value} className="flex items-center space-x-2 cursor-pointer group">
                               <input
                                 type="radio"
                                 name={`q${qIdx}`}
                                 value={opt.value}
                                 checked={ratings[qIdx] === opt.value}
                                 onChange={() => {
                                   const newRatings = [...ratings];
                                   newRatings[qIdx] = opt.value;
                                   setRatings(newRatings);
                                 }}
                                 className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                               />
                               <span className={`text-xs font-medium transition-colors ${ratings[qIdx] === opt.value ? 'text-primary-600' : 'text-gray-500 group-hover:text-primary-600'}`}>
                                 {opt.label}
                               </span>
                            </label>
                          ))}
                       </div>
                    </div>
                  ))}

                  <div className="space-y-2">
                     <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Optional Note</label>
                     <textarea
                       rows="4"
                       value={comments}
                       onChange={(e) => setComments(e.target.value)}
                       className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/20 text-sm dark:text-white"
                       placeholder="Enter any additional feedback..."
                     />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                     <Button variant="secondary" onClick={() => setActiveCourse(null)}>Cancel</Button>
                     <Button
                       className="px-12 bg-[#312e81]"
                       onClick={handleSubmit}
                       isLoading={submitting}
                     >
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
               <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Current Semester</label>
               <div className="relative">
                  <div className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 font-bold text-sm">
                     {semester ? `${semester.name}, ${semester.academicYear}` : 'No Active Semester'}
                  </div>
               </div>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-gray-50 dark:bg-gray-800/50 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-700">
                  <tr>
                     <th className="px-6 py-4">Submit Status</th>
                     <th className="px-6 py-4">Course</th>
                     <th className="px-6 py-4">Teacher</th>
                     <th className="px-6 py-4 text-right">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {courses.map((c) => (
                    <tr key={c.offeringId} className="group hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all">
                       <td className="px-6 py-5">
                          {c.submitted ? (
                            <span className="flex items-center space-x-1.5 px-2 py-1 bg-green-500 text-white text-[10px] font-black rounded uppercase w-fit">
                               <CheckCircle size={10} />
                               <span>Submitted</span>
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-amber-500 text-white text-[10px] font-black rounded uppercase w-fit">Not Submitted</span>
                          )}
                       </td>
                       <td className="px-6 py-5">
                          <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">{c.courseTitle}</p>
                          <p className="text-[10px] text-gray-400 font-mono mt-0.5">{c.courseCode}</p>
                       </td>
                       <td className="px-6 py-5 text-sm font-medium text-gray-600 dark:text-gray-400">{c.facultyName}</td>
                       <td className="px-6 py-5 text-right">
                          <Button
                            size="sm"
                            variant={c.submitted ? "secondary" : "primary"}
                            disabled={c.submitted}
                            onClick={() => setActiveCourse(c)}
                          >
                            {c.submitted ? 'Done' : 'Evaluate'}
                          </Button>
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
