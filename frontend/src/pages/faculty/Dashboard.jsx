import { BookOpen, Users, FileText, Calendar, ChevronRight, Layout, Plus, Send, Settings, Users2, GraduationCap, Clock } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import useFetch from '../../hooks/useFetch';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getActiveSemester } from '../../api/semesterApi';
import { useEffect, useState } from 'react';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const { data: overview, loading: statsLoading } = useFetch('/faculty/dashboard/overview');
  const [activeSemester, setActiveSemester] = useState(null);
  const [semLoading, setSemLoading] = useState(true);

  useEffect(() => {
    const fetchActiveSem = async () => {
      try {
        const res = await getActiveSemester();
        setActiveSemester(res.data || res);
      } catch (err) {
      } finally {
        setSemLoading(false);
      }
    };
    fetchActiveSem();
  }, []);

  const stats = overview || {
    myCourses: 0,
    totalStudents: 0,
    pendingResults: 0,
    todayClasses: 0
  };

  const activeCourses = overview?.activeCourses || [];
  const todaySchedule = overview?.todaySchedule || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-12"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Faculty Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your courses, students and academic records.</p>
        </div>
        <motion.div
          whileHover={{ y: -2 }}
          className="flex items-center space-x-3 bg-white dark:bg-gray-800 p-2.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-primary-200 transition-all cursor-default"
        >
          {semLoading ? (
            <div className="flex items-center space-x-3 px-4 py-2">
               <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />
               <div className="space-y-2">
                   <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded w-16 animate-pulse" />
                   <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
               </div>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                <Layout size={24} />
              </div>
              <div className="pr-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">Current Term</p>
                <p className="text-sm font-black text-gray-900 dark:text-white">{activeSemester?.name || 'No Active Term'}</p>
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsLoading ? (
           Array.from({ length: 4 }).map((_, i) => (
             <div key={i} className="h-24 bg-white dark:bg-gray-800 rounded-2xl animate-pulse border border-gray-100 dark:border-gray-700" />
           ))
        ) : (
          <>
            <StatCard icon={BookOpen} label="My Courses" value={stats.myCourses} delay={0.1} color="primary" />
            <StatCard icon={Users} label="Total Students" value={stats.totalStudents} delay={0.2} color="info" />
            <StatCard icon={FileText} label="Pending Results" value={stats.pendingResults} delay={0.3} color="warning" />
            <StatCard icon={Calendar} label="Today's Classes" value={stats.todayClasses} delay={0.4} color="success" />
          </>
        )}
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions" subtitle="Frequently used academic tools">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            {[
                { label: 'My Courses', icon: BookOpen, path: '/faculty/my-courses', color: 'bg-blue-500' },
                { label: 'My Advisees', icon: Users2, path: '/faculty/advisees', color: 'bg-purple-500' },
                { label: 'Notice Board', icon: Send, path: '/faculty/notices', color: 'bg-amber-500' },
                { label: 'Account Settings', icon: Settings, path: '/faculty/settings', color: 'bg-emerald-500' }
            ].map((action, i) => (
                <motion.button
                    key={i}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(action.path)}
                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:border-primary-200 transition-all group"
                >
                    <div className={`w-10 h-10 rounded-xl ${action.color} text-white flex items-center justify-center mb-2 shadow-lg opacity-80 group-hover:opacity-100 transition-opacity`}>
                        <action.icon size={20} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-tight text-gray-600 dark:text-gray-400">{action.label}</span>
                </motion.button>
            ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-1">
             <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active Courses</h2>
             <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-gray-200/50 dark:border-gray-700">Current Semester</span>
          </div>

          {statsLoading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map(i => (
                   <div key={i} className="h-44 bg-white dark:bg-gray-800 rounded-2xl animate-pulse border border-gray-100 dark:border-gray-700" />
                ))}
             </div>
          ) : activeCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeCourses.map((course, idx) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="hover:border-primary-300 transition-all duration-300 group cursor-default h-full flex flex-col justify-between overflow-hidden relative border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-xl hover:-translate-y-1">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none group-hover:scale-110 duration-500">
                        <GraduationCap size={120} />
                    </div>

                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-[10px] font-black rounded-lg border border-primary-100 dark:border-primary-800 uppercase tracking-widest">
                          Section {course.section}
                        </span>
                        <div className="flex items-center space-x-1.5 bg-gray-50 dark:bg-gray-800/50 px-2 py-1 rounded-lg border border-gray-100 dark:border-gray-700">
                          <Users size={14} className="text-gray-400" />
                          <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{course.studentCount}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-black text-gray-900 dark:text-white line-clamp-1 tracking-tight">{course.title}</h3>
                      <div className="flex items-center mt-1.5 text-primary-500 font-mono text-xs font-bold">
                         <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-2"></span>
                         {course.code}
                      </div>
                    </div>

                    <div className="mt-8 flex space-x-3 relative z-10">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/faculty/attendance/${course.id}`)}
                        className="flex-1 text-[10px] font-black uppercase tracking-widest rounded-xl py-3 border-none bg-gray-100/80 hover:bg-primary-600 hover:text-white transition-all shadow-none"
                      >
                        Attendance
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/faculty/exams/${course.id}`)}
                        className="flex-1 text-[10px] font-black uppercase tracking-widest rounded-xl py-3 border-none bg-gray-100/80 hover:bg-primary-600 hover:text-white transition-all shadow-none"
                      >
                        Exams
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="py-20 text-center border-dashed bg-transparent shadow-none">
              <div className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] w-fit mx-auto mb-4 text-gray-300">
                <BookOpen size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-gray-400">No active courses</h3>
              <p className="text-sm text-gray-500 mt-1 italic">Courses assigned for this semester will appear here.</p>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white px-1">Today's Schedule</h2>
          <Card className="!p-0 overflow-hidden h-full min-h-[400px] border-none shadow-lg shadow-gray-200/50 dark:shadow-none">
            <div className="p-6">
              {statsLoading ? (
                 <div className="space-y-8">
                    {[1, 2, 3].map(i => (
                       <div key={i} className="flex space-x-4 animate-pulse">
                          <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800" />
                          <div className="flex-1 space-y-2">
                             <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/4" />
                             <div className="h-4 bg-gray-50 dark:bg-gray-800 rounded w-3/4" />
                          </div>
                       </div>
                    ))}
                 </div>
              ) : todaySchedule.length > 0 ? (
                <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100 dark:before:bg-gray-700">
                  {todaySchedule.map((item, idx) => (
                    <div key={idx} className="relative pl-10 group">
                      <div className="absolute left-0 top-1 w-6 h-6 bg-white dark:bg-gray-800 border-4 border-primary-500 rounded-full z-10 shadow-sm shadow-primary-500/20 group-hover:scale-110 transition-transform" />
                      <div className="hover:translate-x-1 transition-transform cursor-default">
                        <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest flex items-center">
                           <Clock size={10} className="mr-1.5" />
                           {item.time}
                        </p>
                        <h4 className="font-bold text-gray-900 dark:text-white mt-1 leading-tight">{item.course}</h4>
                        <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter bg-gray-50 dark:bg-gray-800/50 w-fit px-2 py-0.5 rounded-md border border-gray-100 dark:border-gray-700">Room: {item.room}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-24 text-center space-y-4">
                   <div className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] text-gray-300">
                      <Calendar size={48} strokeWidth={1.5} />
                   </div>
                   <div className="space-y-1">
                      <p className="text-base font-bold text-gray-400">No classes today</p>
                      <p className="text-xs text-gray-500 italic">Enjoy your time or plan ahead!</p>
                   </div>
                </div>
              )}
            </div>
            {todaySchedule.length > 0 && (
              <button className="w-full py-4 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 flex items-center justify-center border-t border-gray-100 dark:border-gray-800 transition-all group">
                Full Academic Schedule <ChevronRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default FacultyDashboard;
