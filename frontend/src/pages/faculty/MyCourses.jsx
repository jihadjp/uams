import { useState, useEffect } from 'react';
import { BookOpen, Users, Clock, MapPin, ClipboardCheck, FileText } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { getMyCourses, getMyProfile } from '../../api/facultyApi';
import client from '../../api/client';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Get Faculty Profile to get ID
        const profileRes = await getMyProfile();
        const facultyId = profileRes.data.id;

        // 2. Get Active Semester
        const semRes = await client.get('/semesters/active');
        const activeSemId = semRes.data?.id;

        if (!activeSemId) {
          setCourses([]);
          setLoading(false);
          return;
        }

        // 3. Get Courses assigned to this faculty in active semester
        const coursesRes = await getMyCourses({
          facultyId,
          semesterId: activeSemId,
          size: 100
        });
        setCourses(coursesRes.data.content || coursesRes.data);
      } catch (err) {
        toast.error('Failed to load your assigned courses.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;

  return (
      <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-20 pt-4">
        {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {courses.map((course, idx) => (
                  <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="h-full border border-slate-200/80 dark:border-white/10 bg-white dark:bg-gray-800/80 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden rounded-2xl sm:rounded-3xl !p-5 sm:!p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-2.5 sm:p-3 bg-indigo-50/80 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl sm:rounded-2xl transition-transform group-hover:scale-105 border border-indigo-100 dark:border-indigo-900/30">
                            <BookOpen size={22} className="sm:w-6 sm:h-6" />
                          </div>
                          <span className="px-2.5 sm:px-3 py-1 bg-primary-50 dark:bg-emerald-500/15 text-primary-600 dark:text-emerald-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-full border border-primary-100 dark:border-emerald-500/20">
                      Section {course.section}
                    </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white line-clamp-1 tracking-tight">{course.courseTitle}</h3>
                        <p className="text-xs sm:text-sm font-mono font-bold text-primary-500 dark:text-emerald-400 mt-1">{course.courseCode}</p>

                        <div className="flex items-center text-gray-500 dark:text-gray-400 mt-4">
                          <Users size={15} className="mr-2 text-gray-400 shrink-0" />
                          <span className="text-xs font-bold">{course.enrolledCount} Enrolled Students</span>
                        </div>

                        <div className="mt-4 space-y-2">
                          {course.schedules && course.schedules.map((slot, sIdx) => (
                              <div key={sIdx} className="flex flex-col bg-gray-50/60 dark:bg-gray-800/50 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700/60">
                                <div className="flex items-center text-xs font-bold text-gray-700 dark:text-gray-300">
                                  <Clock size={13} className="mr-2 text-primary-500 dark:text-emerald-400 shrink-0" />
                                  {slot.dayOfWeek} | {slot.startTime?.substring(0, 5) || 'N/A'} - {slot.endTime?.substring(0, 5) || 'N/A'}
                                </div>
                                <div className="flex items-center mt-1 text-[10px] sm:text-xs text-gray-400 font-medium">
                                  <MapPin size={12} className="mr-2 shrink-0" />
                                  Room: {slot.roomNo || 'TBA'}
                                </div>
                              </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-2.5">
                        <Button
                            size="sm"
                            className="w-full flex items-center justify-center space-x-1.5 bg-[#2D2A4F] hover:bg-[#1E1C38] text-white rounded-xl sm:rounded-2xl font-bold text-xs py-2.5 border-none shadow-sm"
                            onClick={() => navigate(`/faculty/attendance/${course.id}`)}
                        >
                          <ClipboardCheck size={15} />
                          <span>Attendance</span>
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="w-full flex items-center justify-center space-x-1.5 bg-gray-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 hover:bg-gray-100 text-gray-800 dark:text-gray-200 rounded-xl sm:rounded-2xl font-bold text-xs py-2.5 shadow-none"
                            onClick={() => navigate(`/faculty/results/exams/${course.id}`)}
                        >
                          <FileText size={15} />
                          <span>Results</span>
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
              ))}
            </div>
        ) : (
            <Card className="flex flex-col items-center justify-center py-16 sm:py-20 border-dashed border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] rounded-2xl sm:rounded-3xl shadow-sm">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-300 mb-4 border border-slate-100 dark:border-gray-700">
                <BookOpen size={36} className="sm:w-10 sm:h-10" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">No Assigned Courses</h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 italic">You are not assigned to any courses in the active semester.</p>
            </Card>
        )}
      </div>
  );
};

export default MyCourses;