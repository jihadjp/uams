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
  ArrowRight,
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
        const [semRes, activeRes] = await Promise.all([getSemesters({ size: 100 }), getActiveSemester()]);
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
            const visibleEvents = res.data.events?.filter((e) => e.dateValue && e.dateValue.trim() !== '') || [];
            setCalendarData({
              ...res.data,
              events: visibleEvents,
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
    const t = (title || '').toLowerCase();
    if (t.includes('registration') || t.includes('advising')) return <BookOpen size={18} />;
    if (t.includes('orientation') || t.includes('start')) return <Flag size={18} />;
    if (t.includes('vacation') || t.includes('eid')) return <Coffee size={18} />;
    if (t.includes('exam')) return <GraduationCap size={18} />;
    if (t.includes('result')) return <Trophy size={18} />;
    return <Calendar size={18} />;
  };

  const getEventColor = (title) => {
    const t = (title || '').toLowerCase();
    if (t.includes('registration')) return 'text-blue-600 bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20';
    if (t.includes('start')) return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20';
    if (t.includes('vacation')) return 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20';
    if (t.includes('exam')) return 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20';
    if (t.includes('result')) return 'text-pink-600 bg-pink-50 dark:bg-pink-500/10 border-pink-100 dark:border-pink-500/20';
    return 'text-[#007A55] bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20';
  };

  if (loading)
    return (
        <div className="h-[60vh] flex items-center justify-center">
          <Loader size="lg" />
        </div>
    );

  return (
      <div className="w-full px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-20 pt-2 sm:pt-4">
        {/* Header Banner */}
        <Card className="!p-0 overflow-hidden border-none shadow-xl relative rounded-2xl sm:rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#09101F] via-[#0E2142] to-[#007A55] opacity-[0.96]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.25),transparent_40%),radial-gradient(circle_at_10%_90%,rgba(99,102,241,0.2),transparent_40%)]" />
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.2)_1px,transparent_1px)] bg-[size:52px_52px]" />

          <div className="relative z-10 p-5 sm:p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
            <div className="flex items-center gap-3.5 sm:gap-5">
              <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-3 sm:p-4 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl text-white border border-white/10 shadow-lg shrink-0"
              >
                <Calendar size={22} className="sm:w-7 sm:h-7" strokeWidth={2.5} />
              </motion.div>
              <div>
                <h1 className="text-xl sm:text-3xl md:text-[32px] font-black tracking-tight text-white leading-tight">
                  Academic Calendar
                </h1>
                <p className="text-white/50 font-bold uppercase tracking-[0.16em] text-[9px] sm:text-[10px] mt-1 sm:mt-2">
                  Official University Schedule
                </p>
              </div>
            </div>

            <div className="relative group w-full md:w-auto md:min-w-[280px]">
              <select
                  value={selectedSemId}
                  onChange={(e) => setSelectedSemId(e.target.value)}
                  className="w-full bg-white/10 backdrop-blur-md border border-white/15 text-white rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 outline-none focus:ring-4 focus:ring-emerald-400/20 focus:border-emerald-300/30 transition-all appearance-none font-bold text-xs sm:text-sm cursor-pointer hover:bg-white/15"
              >
                {semesters.map((sem) => (
                    <option key={sem.id} value={sem.id} className="bg-[#09101F] text-white">
                      {sem.name}
                    </option>
                ))}
              </select>
              <ChevronDown
                  size={18}
                  className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none transition-transform"
              />
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
                  className="h-64 flex flex-col items-center justify-center gap-3"
              >
                <Loader />
                <p className="text-xs sm:text-sm font-medium text-slate-400 dark:text-white/30 animate-pulse">
                  Loading calendar...
                </p>
              </motion.div>
          ) : calendarData && calendarData.events.length > 0 ? (
              <motion.div key="content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 sm:space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
                  {[
                    {
                      label: 'Academic Year',
                      value: calendarData.academicYear,
                      color: 'text-blue-600 dark:text-blue-300',
                      bg: 'bg-blue-50 dark:bg-blue-500/10',
                      border: 'border-blue-100 dark:border-blue-500/20',
                      accent: 'bg-blue-500/10',
                    },
                    {
                      label: 'Duration',
                      value: calendarData.duration,
                      color: 'text-emerald-700 dark:text-emerald-300',
                      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
                      border: 'border-emerald-100 dark:border-emerald-500/20',
                      accent: 'bg-emerald-500/10',
                    },
                    {
                      label: 'Active Events',
                      value: calendarData.events.length,
                      color: 'text-indigo-600 dark:text-indigo-300',
                      bg: 'bg-indigo-50 dark:bg-indigo-500/10',
                      border: 'border-indigo-100 dark:border-indigo-500/20',
                      accent: 'bg-indigo-500/10',
                    },
                  ].map((stat, i) => (
                      <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                          className={`${stat.bg} ${stat.border} p-5 sm:p-7 rounded-xl sm:rounded-[22px] border shadow-sm relative overflow-hidden group hover:shadow-md transition-all`}
                      >
                        <div
                            className={`absolute top-0 right-0 w-20 sm:w-24 h-20 sm:h-24 ${stat.accent} rounded-full -mr-6 -mt-6 sm:-mr-8 sm:-mt-8 transition-transform group-hover:scale-150 duration-500`}
                        />
                        <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-1 sm:mb-2 ${stat.color}`}>
                          {stat.label}
                        </p>
                        <h4 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                          {stat.value}
                        </h4>
                      </motion.div>
                  ))}
                </div>

                {/* Events Timeline */}
                <div className="grid grid-cols-1 gap-3">
                  {calendarData.events.map((ev, idx) => (
                      <motion.div key={idx} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04 }}>
                        <div className="group bg-white dark:bg-[#0B1225] hover:bg-slate-50 dark:hover:bg-white/[0.04] p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-white/10 hover:border-[#007A55]/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 shadow-sm hover:shadow-lg">
                          <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                            <div className={`p-2.5 sm:p-3.5 rounded-xl shrink-0 border transition-transform group-hover:rotate-6 mt-0.5 sm:mt-0 ${getEventColor(ev.title)}`}>
                              {getEventIcon(ev.title)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-sm sm:text-[15px] font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-[#007A55] transition-colors leading-snug">
                                {ev.title}
                              </h4>
                              <div className="flex flex-wrap items-center mt-1 gap-2 sm:gap-3 text-slate-400 dark:text-white/30">
                                <div className="flex items-center text-[9px] sm:text-[10px] font-bold uppercase tracking-wider gap-1">
                                  <MapPin size={11} /> Campus-wide
                                </div>
                                <div className="w-1 h-1 bg-slate-300 dark:bg-white/20 rounded-full hidden sm:block" />
                                <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                                  Official Event
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-white/5">
                            <div className="w-full sm:w-auto bg-slate-100 dark:bg-white/[0.06] px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl flex items-center justify-between sm:justify-start gap-2.5 border border-slate-100 dark:border-white/10 group-hover:border-[#007A55]/20 transition-all">
                              <div className="flex items-center gap-2">
                                <Clock size={13} className="text-[#007A55] dark:text-emerald-300 shrink-0" />
                                <span className="text-xs sm:text-sm font-bold tracking-tight text-slate-700 dark:text-white/80">
                            {ev.dateValue}
                          </span>
                              </div>
                              <ArrowRight size={13} className="text-slate-300 dark:text-white/10 group-hover:text-[#007A55] group-hover:translate-x-1 transition-all shrink-0" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                  ))}
                </div>
              </motion.div>
          ) : (
              <motion.div key="empty" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
                <Card className="py-12 sm:py-20 text-center flex flex-col items-center justify-center gap-4 sm:gap-6 bg-slate-50/50 dark:bg-white/[0.02] border-dashed border-2 border-slate-200 dark:border-white/10 rounded-2xl sm:rounded-3xl px-4">
                  <div className="p-4 sm:p-5 bg-amber-50 dark:bg-amber-500/10 rounded-full text-amber-500 dark:text-amber-300 border border-amber-100 dark:border-amber-500/20 animate-pulse">
                    <AlertCircle size={30} className="sm:w-9 sm:h-9" />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2 max-w-sm">
                    <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
                      Calendar Not Published
                    </h3>
                    <p className="text-slate-500 dark:text-white/40 text-xs sm:text-sm font-medium leading-relaxed">
                      The official schedule for this semester hasn&apos;t been released yet. Please check back later or contact the registrar.
                    </p>
                  </div>
                  <button
                      onClick={() => setSelectedSemId(semesters[0]?.id)}
                      className="text-[#007A55] dark:text-emerald-300 font-bold hover:underline text-xs sm:text-sm"
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