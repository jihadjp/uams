import { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, MapPin, User, Search, ChevronDown, Info, BookOpen } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { getMyEnrollments } from '../../api/enrollmentApi';
import { getActiveSemester, getSemesters } from '../../api/semesterApi';
import { getMyProfile } from '../../api/profileApi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Routine = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemesterId, setSelectedSemesterId] = useState('');
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, semRes, allSemRes] = await Promise.all([
        getMyProfile(),
        getActiveSemester(),
        getSemesters({ size: 100 })
      ]);

      const sId = profileRes.data.student?.id;
      const activeSem = semRes.data;
      const allSems = allSemRes.data.content || allSemRes.data || [];

      setStudentId(sId);
      setSemesters(allSems);

      if (activeSem) {
        setSelectedSemesterId(activeSem.id);
      } else if (allSems.length > 0) {
        setSelectedSemesterId(allSems[0].id);
      }

      if (sId && (activeSem || allSems.length > 0)) {
        const targetSemId = activeSem?.id || allSems[0].id;
        const enRes = await getMyEnrollments(sId, targetSemId);
        setEnrollments(enRes.data || []);
      }
    } catch (err) {
      toast.error('Failed to load routine data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = async () => {
    if (!studentId || !selectedSemesterId) return;
    setLoading(true);
    try {
        const res = await getMyEnrollments(studentId, selectedSemesterId);
        setEnrollments(res.data || []);
    } catch (err) {
        toast.error('Failed to fetch routine');
    } finally {
        setLoading(false);
    }
  };

  if (loading && enrollments.length === 0) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-12">
      <div>
        <h1 className="text-3xl font-black text-[#2D2A4F] dark:text-white tracking-tight">Class Routine</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">Your Weekly Academic Schedule</p>
      </div>

      {/* Semester Filter */}
      <Card className="!p-6 border-none shadow-xl bg-white dark:bg-gray-800">
         <div className="flex flex-col md:flex-row md:items-end gap-6">
            <div className="flex-1 space-y-2">
               <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Academic Semester</label>
               <div className="relative group">
                  <select
                    value={selectedSemesterId}
                    onChange={(e) => setSelectedSemesterId(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none font-bold text-sm dark:text-white cursor-pointer"
                  >
                     {semesters.map(s => (
                         <option key={s.id} value={s.id}>{s.name} {s.active ? '(Active)' : ''}</option>
                     ))}
                  </select>
                  <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-primary-500 transition-colors" />
               </div>
            </div>
            <Button
                onClick={handleSearch}
                className="px-12 py-3.5 bg-[#2D2A4F] hover:bg-[#1E1C38] text-white border-none rounded-2xl font-bold shadow-lg shadow-indigo-500/10 transition-all"
            >
                View Routine
            </Button>
         </div>
      </Card>

      {/* Routine Cards */}
      <div className="space-y-6">
         <AnimatePresence mode="popLayout">
           {enrollments.length > 0 ? enrollments.map((item, idx) => (
             <motion.div
               key={item.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.05 }}
             >
                <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                   <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div className="flex items-center space-x-6">
                         <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex flex-col items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 border border-indigo-100 dark:border-indigo-900/30">
                            <Clock size={24} />
                            <span className="text-[8px] font-black uppercase mt-1">Class</span>
                         </div>
                         <div className="min-w-0">
                            <div className="flex items-center space-x-3 mb-2">
                               <span className="px-2.5 py-1 bg-[#2D2A4F] text-white rounded-lg text-[10px] font-black font-mono shadow-sm">{item.courseCode}</span>
                               <h4 className="text-lg font-black text-gray-900 dark:text-white truncate tracking-tight">{item.courseTitle}</h4>
                            </div>
                            <div className="flex flex-wrap items-center gap-y-2 gap-x-6">
                               <div className="flex items-center text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full">
                                  <Calendar size={14} className="mr-2" />
                                  <span>{item.scheduleInfo || 'Schedule Not Assigned'}</span>
                                </div>
                               <div className="flex items-center text-xs font-bold text-gray-500 dark:text-gray-400">
                                  <User size={14} className="mr-2 text-gray-300" />
                                  <span>{item.facultyName}</span>
                               </div>
                               <div className="flex items-center text-xs font-bold text-gray-400">
                                  <Info size={14} className="mr-2 text-gray-300" />
                                  <span>Sec: {item.section}</span>
                               </div>
                            </div>
                         </div>
                      </div>
                      <div className="hidden md:block">
                        <div className="w-1 h-12 bg-gray-100 dark:bg-gray-700 rounded-full" />
                      </div>
                      <div className="flex flex-col items-center md:items-end">
                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</span>
                         <span className="px-4 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100 dark:border-green-900/30 shadow-sm">
                            Enrolled
                         </span>
                      </div>
                   </div>
                </div>
             </motion.div>
           )) : (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-gray-300 mb-4">
                    <BookOpen size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-400">No Routine Available</h3>
                <p className="text-sm text-gray-400 max-w-xs mx-auto mt-1">You are not registered for any courses in the selected semester.</p>
             </motion.div>
           )}
         </AnimatePresence>
      </div>

      {/* Support Alert */}
      <Card className="bg-indigo-50 dark:bg-indigo-900/10 border-none relative overflow-hidden p-8 rounded-3xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="flex items-start space-x-4">
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm text-indigo-500 shrink-0">
                      <Info size={24} />
                  </div>
                  <div>
                      <h4 className="text-lg font-bold text-[#2D2A4F] dark:text-indigo-200">Routine Conflict?</h4>
                      <p className="text-sm text-indigo-700/70 dark:text-indigo-400 font-medium max-w-lg mt-1">If you notice any overlaps in your class schedule or missing information, please contact your faculty advisor immediately.</p>
                  </div>
              </div>
          </div>
      </Card>
    </div>
  );
};

export default Routine;
