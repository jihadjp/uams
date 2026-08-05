import { useState, useEffect } from 'react';
import { BookOpen, Users, FileText, ChevronRight, Award, CheckCircle2, AlertCircle, BarChart3, Settings2 } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { getMyCourses, getMyProfile } from '../../api/facultyApi';
import client from '../../api/client';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ResultsEntry = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSemester, setActiveSemester] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Get Faculty Profile
        const profileRes = await getMyProfile();
        const facultyId = profileRes.data.id;

        // 2. Get Active Semester
        const semRes = await client.get('/semesters/active');
        const activeSem = semRes.data;
        setActiveSemester(activeSem);

        if (!activeSem?.id) {
            setCourses([]);
            setLoading(false);
            return;
        }

        // 3. Get Courses assigned to this faculty
        const coursesRes = await getMyCourses({
          facultyId,
          semesterId: activeSem.id,
          size: 100
        });
        setCourses(coursesRes.data.content || coursesRes.data);
      } catch (err) {
        toast.error('Failed to load courses for result entry.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#2D2A4F] dark:text-white tracking-tight uppercase">Result Entry Hub</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-bold uppercase text-[10px] tracking-[0.2em]">Manage assessments and publish final grades</p>
        </div>
        <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 p-2.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
           <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
              <BarChart3 size={20} />
           </div>
           <div className="pr-4">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Active Semester</p>
              <p className="text-sm font-black text-gray-900 dark:text-white leading-none mt-0.5">{activeSemester?.name || 'N/A'}</p>
           </div>
        </div>
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {courses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full group !p-0 overflow-hidden border-none shadow-xl shadow-indigo-900/5 hover:shadow-2xl transition-all duration-300">
                <div className="flex flex-col md:flex-row h-full">
                   {/* Left Visual Strip */}
                   <div className="md:w-2 bg-indigo-600 dark:bg-indigo-500" />

                   <div className="flex-1 p-8">
                      <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                           <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-100 dark:border-indigo-800">
                              Section {course.section}
                           </span>
                           <h3 className="text-xl font-black text-gray-900 dark:text-white mt-3 tracking-tight">{course.courseTitle}</h3>
                           <p className="text-sm font-bold text-primary-500 font-mono tracking-tighter">{course.courseCode}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Enrollment</p>
                           <p className="text-2xl font-black text-gray-900 dark:text-white">{course.enrolledCount}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-8">
                        <button
                          onClick={() => navigate(`/faculty/results/exams/${course.id}`)}
                          className="flex items-center justify-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-indigo-600 hover:text-white text-gray-700 dark:text-gray-300 rounded-2xl transition-all group/btn border border-gray-100 dark:border-gray-700 shadow-sm"
                        >
                          <div className="p-2 bg-white dark:bg-gray-700 rounded-xl group-hover/btn:bg-white/20 transition-colors">
                             <Settings2 size={18} className="text-indigo-600 group-hover/btn:text-white" />
                          </div>
                          <div className="text-left">
                             <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Step 1</p>
                             <p className="text-sm font-black">Assessments</p>
                          </div>
                        </button>

                        <button
                          onClick={() => navigate(`/faculty/results/publish/${course.id}`)}
                          className="flex items-center justify-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-emerald-600 hover:text-white text-gray-700 dark:text-gray-300 rounded-2xl transition-all group/btn border border-gray-100 dark:border-gray-700 shadow-sm"
                        >
                          <div className="p-2 bg-white dark:bg-gray-700 rounded-xl group-hover/btn:bg-white/20 transition-colors">
                             <CheckCircle2 size={18} className="text-emerald-600 group-hover/btn:text-white" />
                          </div>
                          <div className="text-left">
                             <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Step 2</p>
                             <p className="text-sm font-black">Final Grading</p>
                          </div>
                        </button>
                      </div>
                   </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center py-24 border-dashed bg-transparent shadow-none">
           <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-[2.5rem] flex items-center justify-center text-gray-300 mb-6 shadow-inner">
              <FileText size={48} strokeWidth={1.5} />
           </div>
           <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase">No Courses Assigned</h3>
           <p className="text-gray-500 mt-2 font-medium">Courses for result entry will appear here once the semester starts.</p>
        </Card>
      )}
    </div>
  );
};

export default ResultsEntry;
