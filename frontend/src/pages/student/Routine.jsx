import { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, User, ChevronDown, Info, BookOpen } from 'lucide-react';
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

    if (loading && enrollments.length === 0)
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-20 pt-4">
            {/* Semester Filter */}
            <Card className="!p-4 sm:!p-6 border border-slate-200/80 dark:border-white/10 shadow-sm bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl">
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
                    <div className="flex-1 space-y-1.5">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                            Academic Semester
                        </label>
                        <div className="relative group">
                            <select
                                value={selectedSemesterId}
                                onChange={(e) => setSelectedSemesterId(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200/80 dark:border-gray-700 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 outline-none focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none font-bold text-xs sm:text-sm dark:text-white cursor-pointer"
                            >
                                {semesters.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name} {s.active ? '(Active)' : ''}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                size={18}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-primary-500 transition-colors"
                            />
                        </div>
                    </div>
                    <Button
                        onClick={handleSearch}
                        className="w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-3.5 bg-[#2D2A4F] hover:bg-[#1E1C38] text-white border-none rounded-xl sm:rounded-2xl font-bold transition-all text-xs sm:text-sm"
                    >
                        View Routine
                    </Button>
                </div>
            </Card>

            {/* Routine Cards */}
            <div className="space-y-4 sm:space-y-6">
                <AnimatePresence mode="popLayout">
                    {enrollments.length > 0 ? (
                        enrollments.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-[2rem] shadow-sm border border-slate-200/80 dark:border-white/10 overflow-hidden hover:shadow-md transition-all duration-300 group">
                                    <div className="p-4 sm:p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8">
                                        <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex flex-col items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 border border-indigo-100 dark:border-indigo-900/30">
                                                <Clock size={20} className="sm:w-6 sm:h-6" />
                                                <span className="text-[7px] sm:text-[8px] font-black uppercase mt-0.5 sm:mt-1">
                                                    Class
                                                </span>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2 mb-1.5 sm:mb-2">
                                                    <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-[#2D2A4F] text-white rounded-md sm:rounded-lg text-[9px] sm:text-[10px] font-black font-mono shadow-sm">
                                                        {item.courseCode}
                                                    </span>
                                                    <h4 className="text-base sm:text-lg font-black text-gray-900 dark:text-white truncate tracking-tight">
                                                        {item.courseTitle}
                                                    </h4>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 sm:gap-x-6">
                                                    <div className="flex items-center text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2.5 sm:px-3 py-1 rounded-full">
                                                        <Calendar size={13} className="mr-1.5 shrink-0" />
                                                        <span className="truncate">
                                                            {item.scheduleInfo || 'Schedule Not Assigned'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center text-xs font-bold text-gray-500 dark:text-gray-400">
                                                        <User size={13} className="mr-1.5 text-gray-300 shrink-0" />
                                                        <span className="truncate">{item.facultyName}</span>
                                                    </div>
                                                    <div className="flex items-center text-xs font-bold text-gray-400">
                                                        <Info size={13} className="mr-1.5 text-gray-300 shrink-0" />
                                                        <span>Sec: {item.section}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="hidden md:block">
                                            <div className="w-1 h-12 bg-gray-100 dark:bg-gray-700 rounded-full" />
                                        </div>
                                        <div className="flex items-center justify-between md:flex-col md:items-end pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-700/50">
                                            <span className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5 sm:mb-1">
                                                Status
                                            </span>
                                            <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest border border-green-100 dark:border-green-900/30">
                                                Enrolled
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 sm:py-20 text-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-gray-300 mb-4">
                                <BookOpen size={32} className="sm:w-10 sm:h-10" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-400">No Routine Available</h3>
                            <p className="text-xs sm:text-sm text-gray-400 max-w-xs mx-auto mt-1">
                                You are not registered for any courses in the selected semester.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Support Alert */}
            <Card className="bg-indigo-50/60 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/20 relative overflow-hidden p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="flex flex-col md:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 relative z-10">
                    <div className="flex items-start space-x-3.5 sm:space-x-4">
                        <div className="p-2.5 sm:p-3 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm text-indigo-500 shrink-0 border border-indigo-100/50 dark:border-gray-700">
                            <Info size={20} className="sm:w-6 sm:h-6" />
                        </div>
                        <div>
                            <h4 className="text-base sm:text-lg font-bold text-[#2D2A4F] dark:text-indigo-200">
                                Routine Conflict?
                            </h4>
                            <p className="text-xs sm:text-sm text-indigo-700/70 dark:text-indigo-400 font-medium max-w-lg mt-0.5 sm:mt-1">
                                If you notice any overlaps in your class schedule or missing information, please contact your faculty advisor immediately.
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Routine;