import { useEffect, useState } from 'react';
import {
  BookOpen,
  Users,
  FileText,
  Calendar,
  ChevronRight,
  Layout,
  Send,
  Settings,
  Users2,
  GraduationCap,
  Clock
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import useFetch from '../../hooks/useFetch';
import Button from '../../components/common/Button';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getActiveSemester } from '../../api/semesterApi';

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
          className="w-full px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-20 pt-4"
      >
        {/* Top Action Bar (Current Term Badge) */}
        <div className="flex justify-end">
          <motion.div
              whileHover={{ y: -2 }}
              className="flex items-center space-x-3 bg-white dark:bg-gray-800/80 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200/80 dark:border-white/10 cursor-default"
          >
            {semLoading ? (
                <div className="flex items-center space-x-3 px-3 py-1.5">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 dark:bg-gray-700 rounded-lg sm:rounded-xl animate-pulse" />
                  <div className="space-y-1.5">
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded w-14 animate-pulse" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse" />
                  </div>
                </div>
            ) : (
                <>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#2D2A4F] dark:bg-emerald-500/20 text-white dark:text-emerald-400 flex items-center justify-center shadow-sm">
                    <Layout size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div className="pr-3 sm:pr-4">
                    <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Term</p>
                    <p className="text-xs sm:text-sm font-black text-gray-900 dark:text-white">{activeSemester?.name || 'No Active Term'}</p>
                  </div>
                </>
            )}
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 bg-white dark:bg-gray-800/80 rounded-2xl sm:rounded-3xl animate-pulse border border-slate-200/80 dark:border-white/10 shadow-sm" />
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
        <Card title="Quick Actions" subtitle="Frequently used academic tools" className="rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden !p-5 sm:!p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-2">
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
                    className="flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gray-50/60 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/60 hover:border-primary-500/30 transition-all group"
                >
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${action.color} text-white flex items-center justify-center mb-2 shadow-sm opacity-90 group-hover:opacity-100 transition-opacity`}>
                    <action.icon size={18} className="sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-tight text-gray-600 dark:text-gray-300">{action.label}</span>
                </motion.button>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-2.5">
                <div className="w-1.5 h-5 bg-primary-500 rounded-full" />
                <h2 className="text-base sm:text-lg font-black text-[#2D2A4F] dark:text-white uppercase tracking-tight">Active Courses</h2>
              </div>
              <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-lg border border-gray-200/60 dark:border-gray-700">Current Semester</span>
            </div>

            {statsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {[1, 2].map(i => (
                      <div key={i} className="h-44 bg-white dark:bg-gray-800/80 rounded-2xl sm:rounded-3xl animate-pulse border border-slate-200/80 dark:border-white/10 shadow-sm" />
                  ))}
                </div>
            ) : activeCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {activeCourses.map((course, idx) => (
                      <motion.div
                          key={course.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                      >
                        <Card className="hover:border-primary-500/40 transition-all duration-300 group cursor-default h-full flex flex-col justify-between overflow-hidden relative border-slate-200/80 dark:border-white/10 bg-white dark:bg-gray-800/80 shadow-sm hover:shadow-md rounded-2xl sm:rounded-3xl !p-5 sm:!p-6">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none group-hover:scale-110 duration-500">
                            <GraduationCap size={120} />
                          </div>

                          <div className="relative z-10">
                            <div className="flex justify-between items-start mb-3 sm:mb-4">
                        <span className="px-2.5 sm:px-3 py-1 bg-primary-50 dark:bg-emerald-500/15 text-primary-600 dark:text-emerald-400 text-[9px] sm:text-[10px] font-black rounded-lg border border-primary-100 dark:border-emerald-500/20 uppercase tracking-widest">
                          Section {course.section}
                        </span>
                              <div className="flex items-center space-x-1.5 bg-gray-50 dark:bg-gray-800/50 px-2 py-1 rounded-lg border border-gray-100 dark:border-gray-700">
                                <Users size={13} className="text-gray-400" />
                                <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{course.studentCount}</span>
                              </div>
                            </div>
                            <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white line-clamp-1 tracking-tight">{course.title}</h3>
                            <div className="flex items-center mt-1 text-primary-500 dark:text-emerald-400 font-mono text-xs font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-emerald-400 mr-2"></span>
                              {course.code}
                            </div>
                          </div>

                          <div className="mt-6 sm:mt-8 flex space-x-2.5 relative z-10">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => navigate(`/faculty/attendance/${course.id}`)}
                                className="flex-1 text-[10px] font-black uppercase tracking-widest rounded-xl py-2.5 sm:py-3 border border-slate-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-[#2D2A4F] hover:text-white transition-all shadow-none"
                            >
                              Attendance
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => navigate(`/faculty/results/exams/${course.id}`)}
                                className="flex-1 text-[10px] font-black uppercase tracking-widest rounded-xl py-2.5 sm:py-3 border border-slate-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-[#2D2A4F] hover:text-white transition-all shadow-none"
                            >
                              Exams
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                  ))}
                </div>
            ) : (
                <Card className="py-16 sm:py-20 text-center border-dashed border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] shadow-sm rounded-2xl sm:rounded-3xl">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl w-fit mx-auto mb-3 text-gray-300">
                    <BookOpen size={40} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-400">No active courses</h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 italic">Courses assigned for this semester will appear here.</p>
                </Card>
            )}
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center space-x-2.5 px-1">
              <div className="w-1.5 h-5 bg-indigo-500 rounded-full" />
              <h2 className="text-base sm:text-lg font-black text-[#2D2A4F] dark:text-white uppercase tracking-tight">Today's Schedule</h2>
            </div>
            <Card className="!p-0 overflow-hidden h-full min-h-[380px] border border-slate-200/80 dark:border-white/10 shadow-sm rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-800/50">
              <div className="p-5 sm:p-6">
                {statsLoading ? (
                    <div className="space-y-6">
                      {[1, 2, 3].map(i => (
                          <div key={i} className="flex space-x-4 animate-pulse">
                            <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-800" />
                            <div className="flex-1 space-y-2">
                              <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/4" />
                              <div className="h-4 bg-gray-50 dark:bg-gray-800 rounded w-3/4" />
                            </div>
                          </div>
                      ))}
                    </div>
                ) : todaySchedule.length > 0 ? (
                    <div className="space-y-6 sm:space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100 dark:before:bg-gray-700">
                      {todaySchedule.map((item, idx) => (
                          <div key={idx} className="relative pl-8 sm:pl-10 group">
                            <div className="absolute left-0 top-1 w-5 h-5 sm:w-6 sm:h-6 bg-white dark:bg-gray-800 border-4 border-primary-500 rounded-full z-10 shadow-sm group-hover:scale-110 transition-transform" />
                            <div className="hover:translate-x-1 transition-transform cursor-default">
                              <p className="text-[10px] font-black text-primary-500 dark:text-emerald-400 uppercase tracking-widest flex items-center">
                                <Clock size={10} className="mr-1.5" />
                                {item.time}
                              </p>
                              <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white mt-1 leading-tight">{item.course}</h4>
                              <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter bg-gray-50 dark:bg-gray-800/50 w-fit px-2 py-0.5 rounded-md border border-gray-100 dark:border-gray-700">Room: {item.room}</p>
                            </div>
                          </div>
                      ))}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center py-16 sm:py-20 text-center space-y-3">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl text-gray-300">
                        <Calendar size={40} strokeWidth={1.5} />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-gray-400">No classes today</p>
                        <p className="text-xs text-gray-500 italic">Enjoy your time or plan ahead!</p>
                      </div>
                    </div>
                )}
              </div>
              {todaySchedule.length > 0 && (
                  <button className="w-full py-3.5 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 flex items-center justify-center border-t border-gray-100 dark:border-gray-800 transition-all group">
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