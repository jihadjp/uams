import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  ChevronDown,
  AlertCircle,
  MapPin,
  Flag,
  BookOpen,
  Coffee,
  GraduationCap,
  Trophy,
  ArrowRight
} from 'lucide-react';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { getCalendarBySemester } from '../../api/academicCalendarApi';
import { getSemesters, getActiveSemester } from '../../api/semesterApi';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AcademicCalendar = () => {
  const [semesters, setSemesters] = useState([]);
  const [selectedSemId, setSelectedSemId] = useState('');
  const [calendarData, setCalendarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchingCalendar, setFetchingCalendar] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const [semRes, activeRes] = await Promise.all([
          getSemesters({ size: 100 }),
          getActiveSemester()
        ]);
        setSemesters(semRes.data.content || []);
        if (activeRes.data) {
          setSelectedSemId(activeRes.data.id);
        } else if (semRes.data.content?.length > 0) {
          setSelectedSemId(semRes.data.content[0].id);
        }
      } catch (err) {
        toast.error('Failed to load semesters');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (selectedSemId) {
      const fetchCalendar = async () => {
        setFetchingCalendar(true);
        try {
          const res = await getCalendarBySemester(selectedSemId);
          if (res.data) {
            // Only show events that have a date value
            const visibleEvents = res.data.events?.filter(e => e.dateValue && e.dateValue.trim() !== '') || [];
            setCalendarData({
              ...res.data,
              events: visibleEvents
            });
          } else {
            setCalendarData(null);
          }
        } catch (err) {
          setCalendarData(null);
        } finally {
          setFetchingCalendar(false);
        }
      };
      fetchCalendar();
    }
  }, [selectedSemId]);

  const getEventIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes('registration') || t.includes('advising')) return <BookOpen size={18} />;
    if (t.includes('orientation') || t.includes('start')) return <Flag size={18} />;
    if (t.includes('vacation') || t.includes('eid')) return <Coffee size={18} />;
    if (t.includes('exam')) return <GraduationCap size={18} />;
    if (t.includes('result')) return <Trophy size={18} />;
    return <Calendar size={18} />;
  };

  const getEventColor = (title) => {
    const t = title.toLowerCase();
    if (t.includes('registration')) return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
    if (t.includes('start')) return 'text-green-500 bg-green-50 dark:bg-green-900/20';
    if (t.includes('vacation')) return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20';
    if (t.includes('exam')) return 'text-purple-500 bg-purple-50 dark:bg-purple-900/20';
    if (t.includes('result')) return 'text-pink-500 bg-pink-50 dark:bg-pink-900/20';
    return 'text-primary-500 bg-primary-50 dark:bg-primary-900/20';
  };

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <Card className="!p-0 overflow-hidden border-none shadow-2xl relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-indigo-600 to-primary-800 opacity-90" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center space-x-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 bg-white/20 backdrop-blur-md rounded-3xl text-white shadow-inner"
            >
              <Calendar size={32} strokeWidth={2.5} />
            </motion.div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Academic Calendar</h1>
              <p className="text-white/70 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">Official University Schedule</p>
            </div>
          </div>

          <div className="relative group min-w-[280px]">
             <select
               value={selectedSemId}
               onChange={(e) => setSelectedSemId(e.target.value)}
               className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-white/10 transition-all appearance-none font-bold text-sm cursor-pointer hover:bg-white/20"
             >
                {semesters.map(sem => (
                  <option key={sem.id} value={sem.id} className="bg-slate-900 text-white">
                    {sem.name}
                  </option>
                ))}
             </select>
             <ChevronDown size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none transition-transform group-hover:translate-y-[-40%]" />
          </div>
        </div>
      </Card>

      <AnimatePresence mode="wait">
        {fetchingCalendar ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-64 flex items-center justify-center"
          >
            <Loader />
          </motion.div>
        ) : (calendarData && calendarData.events.length > 0) ? (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  label: 'Academic Year',
                  value: calendarData.academicYear,
                  color: 'text-blue-600 dark:text-blue-400',
                  bg: 'bg-blue-50 dark:bg-blue-900/10',
                  border: 'border-blue-100 dark:border-blue-900/20',
                  accent: 'bg-blue-500/5'
                },
                {
                  label: 'Duration',
                  value: calendarData.duration,
                  color: 'text-emerald-600 dark:text-emerald-400',
                  bg: 'bg-emerald-50 dark:bg-emerald-900/10',
                  border: 'border-emerald-100 dark:border-emerald-900/20',
                  accent: 'bg-emerald-500/5'
                },
                {
                  label: 'Active Events',
                  value: calendarData.events.length,
                  color: 'text-purple-600 dark:text-purple-400',
                  bg: 'bg-purple-50 dark:bg-purple-900/10',
                  border: 'border-purple-100 dark:border-purple-900/20',
                  accent: 'bg-purple-500/5'
                }
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`${stat.bg} ${stat.border} p-8 rounded-[2rem] border shadow-sm relative overflow-hidden group`}
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 ${stat.accent} rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500`} />
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${stat.color}`}>{stat.label}</p>
                  <h4 className="text-3xl font-black text-gray-900 dark:text-white">{stat.value}</h4>
                </motion.div>
              ))}
            </div>

            {/* Events Timeline */}
            <div className="grid grid-cols-1 gap-4">
              {calendarData.events.map((ev, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="group bg-white dark:bg-gray-800/40 hover:bg-gray-50 dark:hover:bg-gray-800/60 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow-xl hover:-translate-y-1">
                    <div className="flex items-center space-x-5">
                      <div className={`p-4 rounded-2xl shrink-0 transition-transform group-hover:rotate-12 ${getEventColor(ev.title)}`}>
                        {getEventIcon(ev.title)}
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors leading-tight">
                          {ev.title}
                        </h4>
                        <div className="flex items-center mt-1.5 space-x-3 text-gray-400 dark:text-gray-500">
                          <div className="flex items-center text-[10px] font-bold uppercase tracking-wider">
                            <MapPin size={12} className="mr-1" /> Campus-wide
                          </div>
                          <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
                          <div className="text-[10px] font-bold uppercase tracking-wider">
                            Official Event
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center md:justify-end">
                      <div className="bg-gray-100 dark:bg-gray-700/50 px-5 py-3 rounded-2xl flex items-center space-x-3 border border-transparent group-hover:border-primary-500/20 transition-all">
                        <Clock size={16} className="text-primary-500" />
                        <span className="text-sm font-black text-gray-700 dark:text-gray-200">{ev.dateValue}</span>
                        <ArrowRight size={14} className="text-gray-300 dark:text-gray-600 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="py-24 text-center flex flex-col items-center justify-center space-y-6 bg-white dark:bg-gray-800/20 border-dashed border-2">
              <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-full text-amber-500 animate-bounce">
                <AlertCircle size={48} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">Calendar Not Published</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto text-sm font-medium">
                  The official schedule for this semester hasn't been released yet. Please check back later or contact the registrar.
                </p>
              </div>
              <button
                onClick={() => setSelectedSemId(semesters[0]?.id)}
                className="text-primary-600 font-bold hover:underline text-sm"
              >
                View current semester instead
              </button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AcademicCalendar;
