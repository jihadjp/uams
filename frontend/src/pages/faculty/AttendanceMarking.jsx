import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Calendar as CalendarIcon,
    Save,
    Search,
    BookOpen,
    Info
} from 'lucide-react';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { getStudentsForOffering, getAttendanceForDate, markAttendance } from '../../api/attendanceApi';
import { getCourseOfferingById } from '../../api/courseOfferingApi';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AttendanceMarking = () => {
    const { offeringId } = useParams();
    const navigate = useNavigate();
    const [offering, setOffering] = useState(null);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
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
            <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-20 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="h-12 w-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl" />
                    <div className="h-10 w-44 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl" />
                </div>
                <div className="h-14 w-full bg-gray-100 dark:bg-gray-800/50 animate-pulse rounded-2xl sm:rounded-3xl" />
                <div className="space-y-3 sm:space-y-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-20 w-full bg-white dark:bg-gray-800 animate-pulse rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/10" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-28 pt-4">
            {/* Top Action Bar (Back + Offering Context + Date) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => navigate('/faculty/my-courses')}
                        className="p-2 sm:p-2.5 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200/80 dark:border-white/10 hover:text-primary-600 transition-all text-slate-700 dark:text-white shrink-0"
                    >
                        <ChevronLeft size={20} className="sm:w-5 sm:h-5" />
                    </button>
                    <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                            <h1 className="text-base sm:text-lg font-black text-[#2D2A4F] dark:text-white tracking-tight uppercase truncate">
                                Class Attendance
                            </h1>
                            <span className="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[9px] sm:text-[10px] font-black rounded-md border border-indigo-100 dark:border-indigo-800 uppercase tracking-widest shrink-0">
                Sec {offering?.section}
              </span>
                        </div>
                        <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs mt-0.5 font-bold truncate">
                            <BookOpen size={13} className="mr-1.5 text-primary-500 dark:text-emerald-400 shrink-0" />
                            <span className="truncate">{offering?.courseCode} • {offering?.courseTitle}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2.5 bg-white dark:bg-gray-800/80 px-3.5 py-2 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200/80 dark:border-white/10 shrink-0">
                    <CalendarIcon className="text-primary-500 dark:text-emerald-400 shrink-0" size={16} />
                    <input
                        type="date"
                        value={date}
                        max={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setDate(e.target.value)}
                        className="bg-transparent border-none outline-none text-xs sm:text-sm font-black text-[#2D2A4F] dark:text-white cursor-pointer"
                    />
                </div>
            </div>

            {/* Control Bar (Search & Bulk Actions) */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between bg-white dark:bg-gray-800/80 p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200/80 dark:border-white/10">
                <div className="relative w-full sm:w-80 group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#007A55] transition-colors" size={16} />
                    <input
                        placeholder="Search by name or roll..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50/70 dark:bg-gray-900 border border-gray-200/80 dark:border-gray-700/60 rounded-xl text-xs sm:text-sm font-medium outline-none dark:text-white transition-all"
                    />
                </div>
                <div className="flex space-x-2.5 w-full sm:w-auto">
                    <button
                        onClick={() => handleMarkAll('PRESENT')}
                        className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm border border-emerald-100 dark:border-emerald-900/40"
                    >
                        Mark All Present
                    </button>
                    <button
                        onClick={() => handleMarkAll('ABSENT')}
                        className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-sm border border-rose-100 dark:border-rose-900/40"
                    >
                        Mark All Absent
                    </button>
                </div>
            </div>

            {/* Student List */}
            <div className="space-y-3 sm:space-y-4">
                <AnimatePresence mode="popLayout">
                    {filteredStudents.length > 0 ? filteredStudents.map((s, idx) => (
                        <motion.div
                            key={s.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.02 }}
                            layout
                        >
                            <div className="bg-white dark:bg-gray-800/80 p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200/80 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-all">
                                <div className="flex items-center space-x-3.5 sm:space-x-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-base sm:text-lg shrink-0 border border-indigo-100 dark:border-indigo-900/30">
                                        {s.studentName.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-black text-[#2D2A4F] dark:text-white text-sm sm:text-base tracking-tight truncate">{s.studentName}</h4>
                                        <div className="flex items-center space-x-2 mt-0.5">
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[9px] font-bold font-mono rounded uppercase tracking-wider border border-gray-200 dark:border-gray-600">
                        Roll: {s.registrationNo || 'N/A'}
                      </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Options */}
                                <div className="flex items-center justify-between sm:justify-end bg-gray-50 dark:bg-gray-900/60 p-1.5 rounded-xl sm:rounded-2xl border border-gray-200/60 dark:border-gray-700/60 gap-1">
                                    <button
                                        onClick={() => handleStatusChange(s.id, 'PRESENT')}
                                        className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${attendance[s.id] === 'PRESENT' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-400 hover:text-emerald-600'}`}
                                    >
                                        Present
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange(s.id, 'LATE')}
                                        className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${attendance[s.id] === 'LATE' ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-400 hover:text-amber-500'}`}
                                    >
                                        Late
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange(s.id, 'ABSENT')}
                                        className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${attendance[s.id] === 'ABSENT' ? 'bg-rose-600 text-white shadow-sm' : 'text-gray-400 hover:text-rose-600'}`}
                                    >
                                        Absent
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center bg-slate-50/50 dark:bg-white/[0.02] rounded-2xl sm:rounded-3xl border border-dashed border-slate-200/80 dark:border-white/10 shadow-sm">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto text-gray-300 mb-3 border border-slate-100 dark:border-gray-700">
                                <Info size={36} />
                            </div>
                            <h3 className="text-sm sm:text-base font-bold text-gray-400">No students matching your search</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Try clearing your search query.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Floating Action Bar */}
            <motion.div
                initial={{ y: 80 }}
                animate={{ y: 0 }}
                className="fixed bottom-6 left-0 right-0 lg:left-64 flex justify-center px-4 pointer-events-none z-40"
            >
                <div className="bg-[#2D2A4F]/95 dark:bg-gray-900/95 backdrop-blur-xl px-5 sm:px-8 py-3.5 sm:py-4 rounded-2xl sm:rounded-3xl shadow-lg flex items-center justify-between space-x-4 sm:space-x-8 pointer-events-auto border border-white/10">
                    <div className="hidden sm:flex items-center text-white space-x-6 pr-6 border-r border-white/10">
                        <div className="text-center">
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-0.5">Present</p>
                            <div className="flex items-baseline space-x-1">
                                <span className="text-base font-black text-emerald-400">{stats.present}</span>
                                <span className="text-[10px] font-bold text-white/30">/ {stats.total}</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-0.5">Absent</p>
                            <div className="flex items-baseline space-x-1">
                                <span className="text-base font-black text-rose-400">{stats.absent}</span>
                                <span className="text-[10px] font-bold text-white/30">/ {stats.total}</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-0.5">Progress</p>
                            <div className="flex items-center space-x-2">
                                <div className="w-10 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(stats.marked / (stats.total || 1)) * 100}%` }}
                                        className="h-full bg-emerald-400"
                                    />
                                </div>
                                <span className="text-[10px] font-black">{stats.total > 0 ? Math.round((stats.marked/stats.total)*100) : 0}%</span>
                            </div>
                        </div>
                    </div>
                    <Button
                        onClick={handleSave}
                        isLoading={saving}
                        className="bg-white text-gray-900 hover:bg-gray-100 border-none shadow-sm px-6 sm:px-10 py-2.5 rounded-xl font-black uppercase text-xs tracking-widest flex items-center"
                    >
                        <Save size={16} className="mr-2 text-[#2D2A4F]" />
                        <span>Post Attendance</span>
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default AttendanceMarking;