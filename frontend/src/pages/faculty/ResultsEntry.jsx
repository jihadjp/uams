import { useState, useEffect } from 'react';
import { FileText, CheckCircle2, BarChart3, Settings2 } from 'lucide-react';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { getMyCourses, getMyProfile } from '../../api/facultyApi';
import client from '../../api/client';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ResultsEntry = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSemester, setActiveSemester] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Get Faculty Profile
                const profileRes = await getMyProfile();
                const facultyId = profileRes.data.id;

                // 2. Get Active Semester
                const semRes = await client.get('/semesters/active');
                const activeSem = semRes.data;
                setActiveSemester(activeSem);

                if (!activeSem?.id) {
                    setCourses([]);
                    setLoading(false);
                    return;
                }

                // 3. Get Courses assigned to this faculty
                const coursesRes = await getMyCourses({
                    facultyId,
                    semesterId: activeSem.id,
                    size: 100
                });
                setCourses(coursesRes.data.content || coursesRes.data);
            } catch (err) {
                toast.error('Failed to load courses for result entry.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-20 pt-4">
            {/* Top Action Bar (Active Semester Badge - Border Only, No Shadow) */}
            <div className="flex justify-end">
                <div className="flex items-center space-x-3 bg-white dark:bg-gray-800/80 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-white/10">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                        <BarChart3 size={18} className="sm:w-5 sm:h-5" />
                    </div>
                    <div className="pr-2 sm:pr-4">
                        <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Semester</p>
                        <p className="text-xs sm:text-sm font-black text-gray-900 dark:text-white leading-none mt-0.5">{activeSemester?.name || 'N/A'}</p>
                    </div>
                </div>
            </div>

            {courses.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                    {courses.map((course, idx) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.04 }}
                        >
                            {/* Card component with subtle border and no shadow */}
                            <Card className="h-full group !p-0 overflow-hidden border border-slate-200/80 dark:border-white/10 bg-white dark:bg-gray-800/80 rounded-2xl sm:rounded-3xl hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-colors">
                                <div className="flex flex-col md:flex-row h-full">
                                    {/* Left Visual Strip */}
                                    <div className="md:w-2 h-1 md:h-auto bg-indigo-600 dark:bg-indigo-500" />

                                    <div className="flex-1 p-5 sm:p-6 md:p-8">
                                        <div className="flex justify-between items-start mb-4 sm:mb-6">
                                            <div className="space-y-1">
                        <span className="px-2.5 sm:px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-100 dark:border-indigo-800">
                          Section {course.section}
                        </span>
                                                <h3 className="text-base sm:text-xl font-black text-gray-900 dark:text-white mt-2 sm:mt-3 tracking-tight">{course.courseTitle}</h3>
                                                <p className="text-xs sm:text-sm font-bold text-primary-500 dark:text-emerald-400 font-mono tracking-tighter">{course.courseCode}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">Enrollment</p>
                                                <p className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">{course.enrolledCount}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-6 sm:mt-8">
                                            <button
                                                onClick={() => navigate(`/faculty/results/exams/${course.id}`)}
                                                className="flex items-center justify-center space-x-3 p-3.5 sm:p-4 bg-gray-50/70 dark:bg-gray-800/50 hover:bg-[#2D2A4F] dark:hover:bg-indigo-600 hover:text-white text-gray-700 dark:text-gray-300 rounded-xl sm:rounded-2xl transition-all group/btn border border-slate-200/80 dark:border-gray-700"
                                            >
                                                <div className="p-2 bg-white dark:bg-gray-700 rounded-xl group-hover/btn:bg-white/20 transition-colors shrink-0">
                                                    <Settings2 size={18} className="text-indigo-600 dark:text-indigo-400 group-hover/btn:text-white" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest opacity-60">Step 1</p>
                                                    <p className="text-xs sm:text-sm font-black">Assessments</p>
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => navigate(`/faculty/results/publish/${course.id}`)}
                                                className="flex items-center justify-center space-x-3 p-3.5 sm:p-4 bg-gray-50/70 dark:bg-gray-800/50 hover:bg-emerald-600 hover:text-white text-gray-700 dark:text-gray-300 rounded-xl sm:rounded-2xl transition-all group/btn border border-slate-200/80 dark:border-gray-700"
                                            >
                                                <div className="p-2 bg-white dark:bg-gray-700 rounded-xl group-hover/btn:bg-white/20 transition-colors shrink-0">
                                                    <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 group-hover/btn:text-white" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest opacity-60">Step 2</p>
                                                    <p className="text-xs sm:text-sm font-black">Final Grading</p>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <Card className="flex flex-col items-center justify-center py-16 sm:py-20 border border-dashed border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] rounded-2xl sm:rounded-3xl">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-300 mb-4 border border-slate-200/60 dark:border-gray-700">
                        <FileText size={36} className="sm:w-10 sm:h-10" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">No Courses Assigned</h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium italic">Courses for result entry will appear here once the semester starts.</p>
                </Card>
            )}
        </div>
    );
};

export default ResultsEntry;