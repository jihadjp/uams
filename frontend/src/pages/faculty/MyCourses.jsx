import { useState, useEffect } from 'react';
import { BookOpen, Users, Clock, MapPin, ClipboardCheck, FileText, ChevronRight } from 'lucide-react';
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Assigned Courses</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage attendance and results for your classes this semester.</p>
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {courses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="h-full group">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform">
                    <BookOpen size={24} />
                  </div>
                  <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-black uppercase tracking-widest rounded-full">
                    Section {course.section}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">{course.courseTitle}</h3>
                <p className="text-sm font-bold text-primary-500 mt-1">{course.courseCode}</p>

                <div className="grid grid-cols-2 gap-4 mt-6">
                   <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <Users size={16} className="mr-2 text-gray-400" />
                      <span className="text-xs font-bold">{course.enrolledCount} Students</span>
                   </div>
                </div>

                <div className="mt-4 space-y-2">
                   {course.schedules && course.schedules.map((slot, sIdx) => (
                     <div key={sIdx} className="flex flex-col bg-gray-50 dark:bg-gray-800/50 p-2 rounded-xl border border-gray-100 dark:border-gray-700/50">
                        <div className="flex items-center text-[11px] font-bold text-gray-700 dark:text-gray-300">
                           <Clock size={14} className="mr-2 text-primary-500" />
                           {slot.dayOfWeek} | {slot.startTime?.substring(0, 5) || 'N/A'} - {slot.endTime?.substring(0, 5) || 'N/A'}
                        </div>
                        <div className="flex items-center mt-1 text-[10px] text-gray-400">
                           <MapPin size={12} className="mr-2" />
                           Room: {slot.roomNo || 'TBA'}
                        </div>
                     </div>
                   ))}
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  <Button
                    size="sm"
                    className="w-full flex items-center space-x-2"
                    onClick={() => navigate(`/faculty/attendance/${course.id}`)}
                  >
                    <ClipboardCheck size={16} />
                    <span>Attendance</span>
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full flex items-center space-x-2"
                    onClick={() => navigate(`/faculty/exams/${course.id}`)}
                  >
                    <FileText size={16} />
                    <span>Results</span>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center py-20 border-dashed">
           <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-300 mb-4">
              <BookOpen size={40} />
           </div>
           <h3 className="text-xl font-bold text-gray-900 dark:text-white">No Assigned Courses</h3>
           <p className="text-gray-500 mt-1">You are not assigned to any courses in the active semester.</p>
        </Card>
      )}
    </div>
  );
};

export default MyCourses;
