import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Save,
    Search,
    BookOpen,
    Info
} from 'lucide-react';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { getStudentsForMarks, getExistingMarks, saveBulkMarks } from '../../api/examApi';
import client from '../../api/client';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const MarksEntry = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [students, setStudents] = useState([]);
    const [marks, setMarks] = useState({}); // { enrollmentId: value }
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState('');

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // 1. Get Exam Details
            const examRes = await client.get(`/exams/${examId}`);
            setExam(examRes.data);

            // 2. Get Students and Existing Marks
            const [studentsRes, existingMarksRes] = await Promise.all([
                getStudentsForMarks(examRes.data.offeringId),
                getExistingMarks(examId)
            ]);

            const studentList = studentsRes.data.content || studentsRes.data;
            setStudents(studentList);

            const initialMarks = {};
            studentList.forEach(s => {
                const existing = (existingMarksRes.data.content || existingMarksRes.data)?.find(m => m.enrollmentId === s.id);
                initialMarks[s.id] = existing ? existing.marksObtained : '';
            });
            setMarks(initialMarks);
        } catch (err) {
            toast.error('Failed to load students or marks data');
        } finally {
            setLoading(false);
        }
    }, [examId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleMarkChange = (enrollmentId, value) => {
        if (value < 0) return;
        if (value > exam.totalMarks) {
            toast.error(`Max marks allowed: ${exam.totalMarks}`);
            return;
        }
        setMarks(prev => ({ ...prev, [enrollmentId]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        const payload = Object.entries(marks).map(([enrollmentId, val]) => ({
            enrollmentId,
            examId,
            marksObtained: val || 0,
            isFinalResult: false
        }));

        try {
            await saveBulkMarks(payload);
            toast.success('Marks updated successfully');
            navigate(-1);
        } catch (err) {
            toast.error('Failed to save marks');
        } finally {
            setSaving(false);
        }
    };

    const filteredStudents = students.filter(s =>
        s.studentName.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-28 pt-4">
            {/* Top Action Bar (Back Button & Exam Context) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 sm:p-2.5 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-white/10 hover:text-primary-600 transition-all text-slate-700 dark:text-white shrink-0"
                    >
                        <ChevronLeft size={20} className="sm:w-5 sm:h-5" />
                    </button>
                    <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                            <h1 className="text-base sm:text-lg font-black text-[#2D2A4F] dark:text-white tracking-tight uppercase truncate">
                                {exam?.examType} Marks Entry
                            </h1>
                            <span className="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[9px] sm:text-[10px] font-black rounded-md border border-indigo-100 dark:border-indigo-800 uppercase tracking-widest shrink-0">
                Total: {exam?.totalMarks}
              </span>
                        </div>
                        <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs mt-0.5 font-bold truncate">
                            <BookOpen size={13} className="mr-1.5 text-primary-500 dark:text-emerald-400 shrink-0" />
                            <span className="truncate">{exam?.courseTitle} • Sec {exam?.section}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white dark:bg-gray-800/80 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/10">
                <div className="relative w-full sm:w-80 group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#007A55] transition-colors" size={16} />
                    <input
                        placeholder="Filter by student name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50/70 dark:bg-gray-900 border border-gray-200/80 dark:border-gray-700/60 rounded-xl text-xs sm:text-sm font-medium outline-none dark:text-white transition-all"
                    />
                </div>
            </div>

            {/* Students Marks List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map((s, idx) => (
                            <motion.div
                                key={s.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.02 }}
                                layout
                            >
                                <div className="bg-white dark:bg-gray-800/80 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3 hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-colors">
                                    <div className="flex items-center space-x-3.5 sm:space-x-4 min-w-0">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-sm sm:text-base shrink-0 border border-indigo-100 dark:border-indigo-900/30">
                                            {s.studentName.charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-black text-[#2D2A4F] dark:text-white text-xs sm:text-sm tracking-tight truncate">{s.studentName}</h4>
                                            <p className="text-[10px] text-gray-400 font-mono mt-0.5 truncate">ID: {s.id.substring(0, 8)}...</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 shrink-0">
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={marks[s.id] || ''}
                                                onChange={(e) => handleMarkChange(s.id, e.target.value)}
                                                className="w-16 sm:w-20 px-2.5 sm:px-3 py-2 bg-gray-50/80 dark:bg-gray-900 border border-gray-200/80 dark:border-gray-700 rounded-xl text-center font-bold text-xs sm:text-sm text-[#2D2A4F] dark:text-emerald-400 focus:ring-2 focus:ring-[#007A55]/20 outline-none transition-all"
                                                placeholder="0"
                                            />
                                            <span className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded-md border border-gray-200/80 dark:border-gray-700 text-[8px] font-black text-gray-400">
                        /{exam?.totalMarks}
                      </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-16 text-center bg-slate-50/50 dark:bg-white/[0.02] rounded-2xl sm:rounded-3xl border border-dashed border-slate-200/80 dark:border-white/10">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto text-gray-300 mb-3 border border-slate-100 dark:border-gray-700">
                                <Info size={36} />
                            </div>
                            <h3 className="text-sm sm:text-base font-bold text-gray-400">No students matching your search</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Try clearing your search query.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Floating Action Bar */}
            <motion.div
                initial={{ y: 80 }}
                animate={{ y: 0 }}
                className="fixed bottom-6 left-0 right-0 lg:left-64 flex justify-center px-4 pointer-events-none z-40"
            >
                <div className="bg-[#2D2A4F]/95 dark:bg-gray-900/95 backdrop-blur-xl px-5 sm:px-8 py-3.5 sm:py-4 rounded-2xl sm:rounded-3xl flex items-center justify-center pointer-events-auto border border-white/10">
                    <Button
                        onClick={handleSave}
                        isLoading={saving}
                        className="bg-white text-gray-900 hover:bg-gray-100 border-none px-8 sm:px-12 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-black uppercase text-xs tracking-widest flex items-center space-x-2"
                    >
                        <Save size={16} className="text-[#2D2A4F]" />
                        <span>Save All Marks</span>
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default MarksEntry;