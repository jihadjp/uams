import { useState, useEffect } from 'react';
import {
  ClipboardCheck,
  ChevronDown,
  ChevronUp,
  Calendar,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen
} from 'lucide-react';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { getMyAttendance } from '../../api/attendanceApi';
import { useAuthStore } from '../../store/authStore';
import { formatDate } from '../../utils/formatDate';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Attendance = () => {
  const user = useAuthStore(state => state.user);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!user?.studentId) return;
      setLoading(true);
      try {
        const res = await getMyAttendance(user.studentId);
        // Assuming backend returns flat list, we need to group by course
        const grouped = res.data.reduce((acc, curr) => {
          const course = curr.courseTitle || 'Unknown Course';
          if (!acc[course]) acc[course] = {
            title: course,
            code: curr.courseCode || 'N/A',
            history: [],
            present: 0,
            total: 0
          };
          acc[course].history.push(curr);
          acc[course].total++;
          if (curr.status === 'PRESENT') acc[course].present++;
          return acc;
        }, {});

        setAttendanceData(Object.values(grouped).map(c => ({
          ...c,
          percentage: c.total > 0 ? (c.present / c.total * 100).toFixed(1) : 0
        })));
      } catch (err) {
        toast.error('Failed to load attendance details');
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [user?.studentId]);

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Attendance Records</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Detailed track of your class presence across all courses.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {attendanceData.length > 0 ? attendanceData.map((course) => (
          <div key={course.title} className="overflow-hidden">
            <button
              onClick={() => setExpandedCourse(expandedCourse === course.title ? null : course.title)}
              className={`w-full text-left bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all ${expandedCourse === course.title ? 'border-primary-300 rounded-b-none' : 'hover:border-primary-200'}`}
            >
               <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-center space-x-5">
                     <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl">
                        <BookOpen size={24} />
                     </div>
                     <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{course.title}</h3>
                        <p className="text-xs font-black text-primary-500 uppercase tracking-widest mt-1">{course.code}</p>
                     </div>
                  </div>

                  <div className="flex-1 max-w-md w-full">
                     <div className="flex justify-between items-end mb-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${parseFloat(course.percentage) < 75 ? 'text-red-500' : 'text-gray-400'}`}>
                           {parseFloat(course.percentage) < 75 && '⚠️ Low Attendance'}
                        </span>
                        <div className="flex items-baseline space-x-1">
                           <span className="text-2xl font-black text-gray-900 dark:text-white">{course.percentage}%</span>
                           <span className="text-[10px] font-bold text-gray-400">avg</span>
                        </div>
                     </div>
                     <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${course.percentage}%` }}
                          className={`h-full rounded-full ${parseFloat(course.percentage) >= 75 ? 'bg-green-500' : 'bg-red-500'}`}
                        />
                     </div>
                  </div>

                  <div className="flex items-center space-x-6">
                     <div className="text-center px-6 border-r border-gray-100 dark:border-gray-700 hidden md:block">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Present</p>
                        <p className="text-lg font-black text-gray-900 dark:text-white">{course.present}/{course.total}</p>
                     </div>
                     {expandedCourse === course.title ? <ChevronUp size={20} className="text-gray-300" /> : <ChevronDown size={20} className="text-gray-300" />}
                  </div>
               </div>
            </button>

            <AnimatePresence>
               {expandedCourse === course.title && (
                 <motion.div
                   initial={{ height: 0, opacity: 0 }}
                   animate={{ height: 'auto', opacity: 1 }}
                   exit={{ height: 0, opacity: 0 }}
                   className="bg-white dark:bg-gray-800 rounded-b-3xl border border-t-0 border-gray-100 dark:border-gray-700 overflow-hidden"
                 >
                    <div className="p-8 pt-0 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                       {course.history.map((record, idx) => (
                         <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 text-center space-y-2">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">{formatDate(record.classDate)}</p>
                            <div className="flex justify-center">
                               {record.status === 'PRESENT' ? (
                                 <CheckCircle2 size={20} className="text-green-500" />
                               ) : record.status === 'LATE' ? (
                                 <Clock size={20} className="text-yellow-500" />
                               ) : (
                                 <XCircle size={20} className="text-red-500" />
                               )}
                            </div>
                            <span className={`text-[8px] font-black uppercase tracking-tighter ${record.status === 'PRESENT' ? 'text-green-600' : record.status === 'LATE' ? 'text-yellow-600' : 'text-red-600'}`}>
                               {record.status}
                            </span>
                         </div>
                       ))}
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>
          </div>
        )) : (
          <Card className="py-20 text-center border-dashed">
             <ClipboardCheck className="mx-auto text-gray-300 mb-4" size={48} />
             <h3 className="text-lg font-bold text-gray-400">No attendance data yet</h3>
             <p className="text-sm text-gray-400 mt-1">Records will appear once faculty members mark attendance.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Attendance;
