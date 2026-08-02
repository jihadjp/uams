import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Save,
  Check,
  Search,
  BookOpen,
  LayoutGrid,
  Info
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Input from '../../components/common/Input';
import { getStudentsForOffering, getAttendanceForDate, markAttendance } from '../../api/attendanceApi';
import { getCourseOfferingById } from '../../api/courseOfferingApi';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AttendanceMarking = () => {
  const { offeringId } = useParams();
  const navigate = useNavigate();
  const [offering, setOffering] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // { enrollmentId: 'PRESENT'|'ABSENT'|'LATE' }
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const stats = useMemo(() => {
    const values = Object.values(attendance);
    return {
      present: values.filter(v => v === 'PRESENT').length,
      absent: values.filter(v => v === 'ABSENT').length,
      late: values.filter(v => v === 'LATE').length,
      total: students.length,
      marked: values.length
    };
  }, [attendance, students]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [offeringRes, studentsRes, existingRes] = await Promise.all([
        getCourseOfferingById(offeringId),
        getStudentsForOffering(offeringId),
        getAttendanceForDate(offeringId, date)
      ]);

      setOffering(offeringRes.data);
      const studentList = studentsRes.data.content || studentsRes.data;
      setStudents(studentList);

      const initialAttendance = {};
      studentList.forEach(s => {
        const existing = existingRes.data.find(a => a.enrollmentId === s.id);
        if (existing) {
          initialAttendance[s.id] = existing.status;
        } else {
          initialAttendance[s.id] = 'PRESENT';
        }
      });
      setAttendance(initialAttendance);
    } catch (err) {
      toast.error('Failed to load student list or attendance data');
    } finally {
      setLoading(false);
    }
  }, [offeringId, date]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = (enrollmentId, status) => {
    setAttendance(prev => ({ ...prev, [enrollmentId]: status }));
  };

  const handleMarkAll = (status) => {
    const updated = {};
    students.forEach(s => { updated[s.id] = status; });
    setAttendance(updated);
    toast.success(`All marked as ${status.toLowerCase()}`);
  };

  const handleSave = async () => {
    setSaving(true);
    const requests = Object.entries(attendance).map(([enrollmentId, status]) => ({
      enrollmentId,
      status,
      classDate: date
    }));

    try {
      await markAttendance(requests);
      toast.success('Attendance saved successfully');
    } catch (err) {
      toast.error('Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter(s =>
    s.studentName.toLowerCase().includes(search.toLowerCase()) ||
    s.registrationNo?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-8 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="h-14 w-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl" />
          <div className="h-12 w-48 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl" />
        </div>
        <div className="h-16 w-full bg-gray-100 dark:bg-gray-800/50 animate-pulse rounded-3xl" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-24 w-full bg-white dark:bg-gray-800 animate-pulse rounded-[2rem] border border-gray-100 dark:border-gray-700" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-28">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
           <button
             onClick={() => navigate('/faculty/my-courses')}
             className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:text-primary-600 transition-all hover:scale-105 active:scale-95"
           >
             <ChevronLeft size={22} />
           </button>
           <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-black text-[#2D2A4F] dark:text-white tracking-tight leading-none uppercase">
                  Class Attendance
                </h1>
                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black rounded-lg border border-indigo-100 dark:border-indigo-800 uppercase tracking-widest">
                  Sec {offering?.section}
                </span>
              </div>
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs mt-1.5 font-bold">
                 <BookOpen size={14} className="mr-1.5 text-primary-500" />
                 {offering?.courseCode} • {offering?.courseTitle}
              </div>
           </div>
        </div>

        <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 p-2.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 ring-4 ring-gray-50 dark:ring-gray-900/50">
           <CalendarIcon className="ml-2 text-primary-500" size={18} />
           <input
             type="date"
             value={date}
             max={new Date().toISOString().split('T')[0]}
             onChange={(e) => setDate(e.target.value)}
             className="bg-transparent border-none outline-none text-sm font-black text-[#2D2A4F] dark:text-white px-2 py-1 cursor-pointer"
           />
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white dark:bg-gray-800 p-5 rounded-[2rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700">
         <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
            <input
              placeholder="Search by student name or roll..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary-500/10 transition-all dark:text-white"
            />
         </div>
         <div className="flex space-x-3 w-full lg:w-auto">
            <button
               onClick={() => handleMarkAll('PRESENT')}
               className="flex-1 lg:flex-none px-6 py-3.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95"
            >
               Mark All Present
            </button>
            <button
               onClick={() => handleMarkAll('ABSENT')}
               className="flex-1 lg:flex-none px-6 py-3.5 bg-rose-50 text-red-600 dark:bg-rose-900/20 dark:text-red-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95"
            >
               Mark All Absent
            </button>
         </div>
      </div>

      {/* Student List */}
      <div className="space-y-4">
         <AnimatePresence mode="popLayout">
           {filteredStudents.length > 0 ? filteredStudents.map((s, idx) => (
             <motion.div
               key={s.id}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.03 }}
               layout
             >
                <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-primary-200 dark:hover:border-primary-900 transition-all hover:shadow-lg">
                   <div className="flex items-center space-x-5">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-xl shadow-inner border border-indigo-100/50 dark:border-indigo-800/50">
                         {s.studentName.charAt(0)}
                      </div>
                      <div>
                         <h4 className="font-black text-[#2D2A4F] dark:text-white text-lg tracking-tight">{s.studentName}</h4>
                         <div className="flex items-center space-x-2 mt-1">
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-[9px] font-black rounded uppercase tracking-tighter border border-gray-200 dark:border-gray-600">
                               Roll: {s.registrationNo || 'N/A'}
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold font-mono">ID: {s.studentId?.substring(0,10)}...</span>
                         </div>
                      </div>
                   </div>

                   <div className="flex items-center bg-gray-50 dark:bg-gray-900/50 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-800">
                      <button
                        onClick={() => handleStatusChange(s.id, 'PRESENT')}
                        className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${attendance[s.id] === 'PRESENT' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105 ring-4 ring-emerald-500/10' : 'text-gray-400 hover:text-emerald-500'}`}
                      >
                         Present
                      </button>
                      <button
                        onClick={() => handleStatusChange(s.id, 'LATE')}
                        className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${attendance[s.id] === 'LATE' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 scale-105 ring-4 ring-amber-500/10' : 'text-gray-400 hover:text-amber-500'}`}
                      >
                         Late
                      </button>
                      <button
                        onClick={() => handleStatusChange(s.id, 'ABSENT')}
                        className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${attendance[s.id] === 'ABSENT' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 scale-105 ring-4 ring-rose-500/10' : 'text-gray-400 hover:text-red-500'}`}
                      >
                         Absent
                      </button>
                   </div>
                </div>
             </motion.div>
           )) : (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
                <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-[2.5rem] flex items-center justify-center mx-auto text-gray-300 mb-6">
                   <Info size={48} />
                </div>
                <h3 className="text-xl font-bold text-gray-400">No students matching your search</h3>
                <p className="text-sm text-gray-500 mt-1">Try clearing your search query.</p>
             </motion.div>
           )}
         </AnimatePresence>
      </div>

      {/* Floating Action Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-8 left-0 right-0 lg:left-72 flex justify-center px-8 pointer-events-none z-50"
      >
         <div className="bg-gray-900/90 dark:bg-primary-600/90 backdrop-blur-xl px-10 py-5 rounded-[2.5rem] shadow-2xl flex items-center space-x-10 pointer-events-auto border border-white/10 ring-8 ring-black/5">
            <div className="hidden sm:flex items-center text-white space-x-10 mr-4 border-r border-white/20 pr-10">
               <div className="text-center">
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">Present</p>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-xl font-black text-emerald-400">{stats.present}</span>
                    <span className="text-[10px] font-bold text-white/30">/ {stats.total}</span>
                  </div>
               </div>
               <div className="text-center">
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">Absent</p>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-xl font-black text-rose-400">{stats.absent}</span>
                    <span className="text-[10px] font-bold text-white/30">/ {stats.total}</span>
                  </div>
               </div>
               <div className="text-center">
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">Marked</p>
                  <div className="flex items-center space-x-2">
                     <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                           initial={{ width: 0 }}
                           animate={{ width: `${(stats.marked / stats.total) * 100}%` }}
                           className="h-full bg-indigo-400"
                        />
                     </div>
                     <span className="text-[10px] font-black">{stats.total > 0 ? Math.round((stats.marked/stats.total)*100) : 0}%</span>
                  </div>
               </div>
            </div>
            <Button
              onClick={handleSave}
              isLoading={saving}
              className="bg-white text-gray-900 hover:bg-gray-100 border-none shadow-xl px-14 py-4 rounded-2xl h-auto"
            >
               <Save size={20} className="mr-2.5 text-primary-600" />
               <span className="font-black uppercase text-xs tracking-widest">Post Attendance</span>
            </Button>
         </div>
      </motion.div>
    </div>
  );
};

export default AttendanceMarking;
