import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Save,
  Search,
  Award,
  Users,
  CheckCircle2
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { getStudentsForMarks, getExistingMarks, saveBulkMarks } from '../../api/examApi';
import client from '../../api/client';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const MarksEntry = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({}); // { enrollmentId: value }
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Get Exam Details
      const examRes = await client.get(`/exams/${examId}`);
      setExam(examRes.data);

      // 2. Get Students and Existing Marks
      const [studentsRes, existingMarksRes] = await Promise.all([
        getStudentsForMarks(examRes.data.offeringId),
        getExistingMarks(examId)
      ]);

      const studentList = studentsRes.data.content || studentsRes.data;
      setStudents(studentList);

      const initialMarks = {};
      studentList.forEach(s => {
          // In real API, we should match by enrollmentId
          const existing = existingMarksRes.data.content?.find(m => m.studentName === s.studentName);
          initialMarks[s.id] = existing ? existing.marksObtained : '';
      });
      setMarks(initialMarks);
    } catch (err) {
      toast.error('Failed to load students or marks data');
    } finally {
      setLoading(false);
    }
  }, [examId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleMarkChange = (enrollmentId, value) => {
    if (value < 0) return;
    if (value > exam.totalMarks) {
        toast.error(`Max marks allowed: ${exam.totalMarks}`);
        return;
    }
    setMarks(prev => ({ ...prev, [enrollmentId]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = Object.entries(marks).map(([enrollmentId, val]) => ({
      enrollmentId,
      examId,
      marksObtained: val || 0,
      isFinalResult: false
    }));

    try {
      await saveBulkMarks(payload);
      toast.success('Marks updated successfully');
      navigate(-1);
    } catch (err) {
      toast.error('Failed to save marks');
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter(s =>
    s.studentName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
           <button
             onClick={() => navigate(-1)}
             className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:text-primary-600 transition-all"
           >
             <ChevronLeft size={20} />
           </button>
           <div>
              <div className="flex items-center space-x-3">
                 <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                   {exam?.examType} Marks Entry
                 </h1>
                 <span className="px-2 py-0.5 bg-primary-100 text-primary-600 text-[10px] font-black uppercase rounded-full">
                    Total: {exam?.totalMarks}
                 </span>
              </div>
              <p className="text-gray-400 text-xs mt-1 font-medium">{exam?.courseTitle} | Sec {exam?.section}</p>
           </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
         <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              placeholder="Filter by student name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
            />
         </div>
      </div>

      {/* Students List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <AnimatePresence mode="popLayout">
           {filteredStudents.map((s, idx) => (
             <motion.div
               key={s.id}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.05 }}
             >
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-50 dark:border-gray-700/50 flex items-center justify-between group hover:border-primary-300 transition-all">
                   <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 font-black text-xs">
                         {s.studentName.charAt(0)}
                      </div>
                      <div>
                         <h4 className="font-bold text-gray-900 dark:text-white text-sm">{s.studentName}</h4>
                         <p className="text-[10px] text-gray-400 font-mono">ENROLLMENT ID: {s.id.substring(0,8)}...</p>
                      </div>
                   </div>

                   <div className="flex items-center space-x-3">
                      <div className="relative">
                         <input
                           type="number"
                           value={marks[s.id] || ''}
                           onChange={(e) => handleMarkChange(s.id, e.target.value)}
                           className="w-20 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-center font-bold text-primary-600 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                           placeholder="0"
                         />
                         <span className="absolute -top-2 -right-2 w-5 h-5 bg-white dark:bg-gray-800 rounded-full border border-gray-100 dark:border-gray-700 flex items-center justify-center text-[8px] font-black text-gray-400">
                            / {exam?.totalMarks}
                         </span>
                      </div>
                   </div>
                </div>
             </motion.div>
           ))}
         </AnimatePresence>
      </div>

      {/* Footer Actions */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-8 left-0 right-0 lg:left-72 flex justify-center px-8"
      >
         <Button
           onClick={handleSave}
           isLoading={saving}
           className="bg-gray-900 dark:bg-primary-600 text-white px-12 py-4 rounded-full shadow-2xl flex items-center space-x-3 border border-white/10"
         >
            <Save size={20} />
            <span className="font-black uppercase tracking-widest">Save All Marks</span>
         </Button>
      </motion.div>
    </div>
  );
};

export default MarksEntry;
