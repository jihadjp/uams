import { useState, useEffect, useCallback } from 'react';
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
  Search
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

      // Map existing attendance or set default to PRESENT
      const initialAttendance = {};
      studentList.forEach(s => {
        const existing = existingRes.data.find(a => a.studentName === s.studentName); // Ideally match by enrollmentId
        // Backend EnrollmentResponse doesn't have studentId easily accessible sometimes, but matching logic here
        // For production, ensuring IDs match is better
        initialAttendance[s.id] = existing ? existing.status : 'PRESENT';
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
    s.studentName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
           <button
             onClick={() => navigate('/faculty/my-courses')}
             className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:text-primary-600 transition-all"
           >
             <ChevronLeft size={20} />
           </button>
           <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                {offering?.courseTitle} <span className="text-primary-500">({offering?.section})</span>
              </h1>
              <div className="flex items-center text-gray-400 text-xs mt-1 font-medium">
                 <Users size={12} className="mr-1" /> {students.length} Registered Students
              </div>
           </div>
        </div>

        <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
           <CalendarIcon className="ml-2 text-gray-400" size={18} />
           <input
             type="date"
             value={date}
             max={new Date().toISOString().split('T')[0]}
             onChange={(e) => setDate(e.target.value)}
             className="bg-transparent border-none outline-none text-sm font-bold text-gray-900 dark:text-white px-2 py-1 cursor-pointer"
           />
        </div>
      </div>

      {/* Quick Actions & Search */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
         <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              placeholder="Filter by student name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20"
            />
         </div>
         <div className="flex space-x-3 w-full lg:w-auto">
            <button onClick={() => handleMarkAll('PRESENT')} className="flex-1 lg:flex-none px-4 py-2 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-green-100 transition-colors">
               Mark All Present
            </button>
            <button onClick={() => handleMarkAll('ABSENT')} className="flex-1 lg:flex-none px-4 py-2 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-100 transition-colors">
               Mark All Absent
            </button>
         </div>
      </div>

      {/* Student List */}
      <div className="space-y-4">
         <AnimatePresence mode="popLayout">
           {filteredStudents.map((s, idx) => (
             <motion.div
               key={s.id}
               initial={{ opacity: 0, x: -10 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: idx * 0.05 }}
             >
                <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl shadow-sm border border-gray-50 dark:border-gray-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-primary-100 dark:hover:border-primary-900/30 transition-all">
                   <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 font-black">
                         {s.studentName.charAt(0)}
                      </div>
                      <div>
                         <h4 className="font-bold text-gray-900 dark:text-white">{s.studentName}</h4>
                         <p className="text-xs text-gray-400 font-mono tracking-tighter">ROLL: ---</p>
                      </div>
                   </div>

                   <div className="flex items-center bg-gray-50 dark:bg-gray-900/50 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-800 self-center">
                      <button
                        onClick={() => handleStatusChange(s.id, 'PRESENT')}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${attendance[s.id] === 'PRESENT' ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 scale-105' : 'text-gray-400 hover:text-green-500'}`}
                      >
                         Present
                      </button>
                      <button
                        onClick={() => handleStatusChange(s.id, 'LATE')}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${attendance[s.id] === 'LATE' ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/30 scale-105' : 'text-gray-400 hover:text-yellow-500'}`}
                      >
                         Late
                      </button>
                      <button
                        onClick={() => handleStatusChange(s.id, 'ABSENT')}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${attendance[s.id] === 'ABSENT' ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 scale-105' : 'text-gray-400 hover:text-red-500'}`}
                      >
                         Absent
                      </button>
                   </div>
                </div>
             </motion.div>
           ))}
         </AnimatePresence>
      </div>

      {/* Floating Action Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-8 left-0 right-0 lg:left-72 flex justify-center px-8 pointer-events-none"
      >
         <div className="bg-gray-900/90 dark:bg-primary-600/90 backdrop-blur-md px-8 py-4 rounded-full shadow-2xl flex items-center space-x-6 pointer-events-auto border border-white/10">
            <div className="hidden md:flex items-center text-white space-x-8 mr-4 border-r border-white/20 pr-8">
               <div className="text-center">
                  <p className="text-[8px] font-black uppercase tracking-widest text-white/50 mb-0.5">Present</p>
                  <p className="text-sm font-black">{Object.values(attendance).filter(v => v === 'PRESENT').length}</p>
               </div>
               <div className="text-center">
                  <p className="text-[8px] font-black uppercase tracking-widest text-white/50 mb-0.5">Absent</p>
                  <p className="text-sm font-black text-red-400">{Object.values(attendance).filter(v => v === 'ABSENT').length}</p>
               </div>
            </div>
            <Button
              onClick={handleSave}
              isLoading={saving}
              className="bg-white text-gray-900 hover:bg-gray-100 border-none shadow-none px-10 rounded-full"
            >
               <Save size={18} className="mr-2" />
               <span className="font-black uppercase text-xs tracking-widest">Save Attendance</span>
            </Button>
         </div>
      </motion.div>
    </div>
  );
};

export default AttendanceMarking;
