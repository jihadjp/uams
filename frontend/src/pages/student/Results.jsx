import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FileText,
    ChevronDown,
    Award,
    BookOpen,
    GraduationCap,
    Users,
    Layers,
    Info,
    AlertCircle
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { getAcademicResults } from '../../api/resultApi';
import { getSemesters } from '../../api/semesterApi';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const Results = () => {
    const navigate = useNavigate();
    const user = useAuthStore(state => state.user);
    const [semesters, setSemesters] = useState([]);
    const [selectedSemId, setSelectedSemId] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                const response = await getSemesters();
                const semesterList = response.data?.content || response.data || [];
                setSemesters(semesterList);
                if (semesterList.length > 0) {
                    setSelectedSemId(semesterList[0].id);
                    fetchResults(semesterList[0].id);
                } else {
                    setLoading(false);
                }
            } catch (error) {
                toast.error("Failed to load semesters");
                setLoading(false);
            }
        };
        fetchSemesters();
    }, []);

    const fetchResults = async (semId) => {
        setSearching(true);
        try {
            const response = await getAcademicResults(semId);
            setData(response.data);
        } catch (error) {
            toast.error("Failed to fetch results");
        } finally {
            setLoading(false);
            setSearching(false);
        }
    };

    const handleSearch = () => {
        if (selectedSemId) {
            fetchResults(selectedSemId);
        }
    };

    const getRoleBasedEvaluationPath = () => {
        if (!user?.role) return '/student/evaluation';
        return `/${user.role.toLowerCase()}/evaluation`;
    };

    if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;

    const selectedSemName = semesters.find(s => s.id === selectedSemId)?.name || 'N/A';

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-20 pt-4">
            {/* Semester Selection Filter */}
            <Card className="!p-4 sm:!p-6 border border-slate-200/80 dark:border-white/10 shadow-sm bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl">
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
                    <div className="flex-1 space-y-1.5">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                            Select Semester
                        </label>
                        <div className="relative group">
                            <select
                                value={selectedSemId}
                                onChange={(e) => setSelectedSemId(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200/80 dark:border-gray-700 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 outline-none focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none font-bold text-xs sm:text-sm dark:text-white cursor-pointer"
                            >
                                {semesters.map(sem => (
                                    <option key={sem.id} value={sem.id}>{sem.name}</option>
                                ))}
                            </select>
                            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-primary-500 transition-colors" />
                        </div>
                    </div>
                    <Button
                        className="w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-3.5 bg-[#2D2A4F] hover:bg-[#1E1C38] text-white border-none rounded-xl sm:rounded-2xl font-bold transition-all text-xs sm:text-sm"
                        onClick={handleSearch}
                        isLoading={searching}
                    >
                        Search
                    </Button>
                </div>
            </Card>

            {!data && !loading && (
                <Card className="text-center py-16 sm:py-20 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-gray-300 mb-4">
                        <Info size={36} className="sm:w-10 sm:h-10" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-bold text-sm sm:text-base">No results found for the selected semester.</p>
                </Card>
            )}

            {data && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 items-start">
                    {/* Main Results Section */}
                    <div className="xl:col-span-2 space-y-6">
                        <Card title="Student Information" icon={GraduationCap} className="rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm !p-5 sm:!p-8">
                            <div className="space-y-6 mt-2">
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-black text-indigo-700 dark:text-indigo-400 tracking-tight">
                                        {data.studentName}
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
                                        <div className="flex items-center text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400">
                                            <BookOpen size={16} className="mr-3 text-indigo-500 shrink-0" /> {data.programName}
                                        </div>
                                        <div className="flex items-center text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400">
                                            <Users size={16} className="mr-3 text-indigo-500 shrink-0" /> Batch: {data.batch}
                                        </div>
                                        <div className="flex items-center text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400">
                                            <FileText size={16} className="mr-3 text-indigo-500 shrink-0" /> Student ID: {data.studentId}
                                        </div>
                                        <div className="flex items-center text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400">
                                            <Layers size={16} className="mr-3 text-indigo-500 shrink-0" /> Reg ID: {data.registrationNo}
                                        </div>
                                    </div>
                                    <div className="flex items-center text-xs sm:text-sm font-black text-indigo-600 dark:text-indigo-400 pt-5 mt-5 border-t border-gray-100 dark:border-gray-800">
                                        <Award size={18} className="mr-2.5 shrink-0" /> SGPA of {selectedSemName}: {data.sgpa?.toFixed(2) || '0.00'}
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-gray-50 dark:bg-gray-800/80 text-[10px] font-black uppercase tracking-wider text-gray-400 border-b border-gray-100 dark:border-gray-700">
                                        <tr>
                                            <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap">SL</th>
                                            <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap">Course Code</th>
                                            <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap">Course Title</th>
                                            <th className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">Credit</th>
                                            <th className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">Grade</th>
                                            <th className="py-3.5 px-3 sm:px-4 text-right whitespace-nowrap">Grade Point</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                                        {data.courses.map((r, i) => (
                                            <tr key={i} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all">
                                                <td className="py-3.5 px-3 sm:px-4 text-xs font-bold text-gray-400 whitespace-nowrap">{i + 1}</td>
                                                <td className="py-3.5 px-3 sm:px-4 font-mono text-xs font-black text-gray-700 dark:text-gray-300 whitespace-nowrap">{r.courseCode}</td>
                                                <td className="py-3.5 px-3 sm:px-4 text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap">{r.courseTitle}</td>
                                                <td className="py-3.5 px-3 sm:px-4 text-center text-xs sm:text-sm font-medium text-gray-500 whitespace-nowrap">{r.credits?.toFixed(2) || '0.00'}</td>
                                                <td className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">
                                                    {r.evaluationPending ? (
                                                        <span className="text-[9px] px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full font-black uppercase tracking-tighter">
                                Evaluation Pending
                              </span>
                                                    ) : (
                                                        <span className="font-black text-xs sm:text-sm text-gray-700 dark:text-gray-300">{r.grade}</span>
                                                    )}
                                                </td>
                                                <td className="py-3.5 px-3 sm:px-4 text-right font-mono font-bold text-xs sm:text-sm text-gray-900 dark:text-white whitespace-nowrap">
                                                    {r.gradePoint !== null ? r.gradePoint.toFixed(2) : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                        <tfoot>
                                        <tr className="bg-gray-50 dark:bg-gray-800/50 font-black text-[10px] uppercase">
                                            <td colSpan="3" className="p-3.5 sm:p-4 text-right whitespace-nowrap">Total Credit</td>
                                            <td className="p-3.5 sm:p-4 text-center whitespace-nowrap">{data.totalCredits?.toFixed(2) || '0.00'}</td>
                                            <td className="p-3.5 sm:p-4 text-right whitespace-nowrap">SGPA</td>
                                            <td className="p-3.5 sm:p-4 text-right text-indigo-600 dark:text-emerald-400 whitespace-nowrap">{data.sgpa?.toFixed(2) || '0.00'}</td>
                                        </tr>
                                        </tfoot>
                                    </table>
                                </div>

                                {data.courses.some(c => c.evaluationPending) && (
                                    <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-2xl flex items-start gap-3 sm:gap-4">
                                        <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                                        <p className="text-xs font-bold text-amber-700 dark:text-amber-400 leading-relaxed">
                                            N.B. : You have pending teaching evaluations for some courses.
                                            Grade and Grade Point are hidden until evaluations are completed.
                                            Please complete <span className="underline cursor-pointer font-black hover:text-amber-800 dark:hover:text-amber-300 transition-colors" onClick={() => navigate(getRoleBasedEvaluationPath())}>Teaching Evaluation</span> to unlock your results.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* UGC Uniform Grading System */}
                    <div className="space-y-6">
                        <Card title="UGC Uniform Grading System" className="rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm !p-4 sm:!p-6">
                            <div className="space-y-0 mt-4 overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-700/60">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-[10px] sm:text-xs text-left">
                                        <thead className="bg-gray-50 dark:bg-gray-800/80 font-black text-gray-400 uppercase border-b border-gray-100 dark:border-gray-700">
                                        <tr>
                                            <th className="p-2.5 sm:p-3 whitespace-nowrap">Marks (%)</th>
                                            <th className="p-2.5 sm:p-3 whitespace-nowrap">Grade</th>
                                            <th className="p-2.5 sm:p-3 whitespace-nowrap">GP</th>
                                            <th className="p-2.5 sm:p-3 text-right whitespace-nowrap">Remarks</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50 text-gray-600 dark:text-gray-400 font-medium">
                                        <tr><td className="p-2.5 sm:p-3">80-100</td><td className="p-2.5 sm:p-3 font-bold text-gray-900 dark:text-white">A+</td><td className="p-2.5 sm:p-3">4.00</td><td className="p-2.5 sm:p-3 text-right">Outstanding</td></tr>
                                        <tr><td className="p-2.5 sm:p-3">75-79</td><td className="p-2.5 sm:p-3 font-bold text-gray-900 dark:text-white">A</td><td className="p-2.5 sm:p-3">3.75</td><td className="p-2.5 sm:p-3 text-right">Excellent</td></tr>
                                        <tr><td className="p-2.5 sm:p-3">70-74</td><td className="p-2.5 sm:p-3 font-bold text-gray-900 dark:text-white">A-</td><td className="p-2.5 sm:p-3">3.50</td><td className="p-2.5 sm:p-3 text-right">Very Good</td></tr>
                                        <tr><td className="p-2.5 sm:p-3">65-69</td><td className="p-2.5 sm:p-3 font-bold text-gray-900 dark:text-white">B+</td><td className="p-2.5 sm:p-3">3.25</td><td className="p-2.5 sm:p-3 text-right">Good</td></tr>
                                        <tr><td className="p-2.5 sm:p-3">60-64</td><td className="p-2.5 sm:p-3 font-bold text-gray-900 dark:text-white">B</td><td className="p-2.5 sm:p-3">3.00</td><td className="p-2.5 sm:p-3 text-right">Satisfactory</td></tr>
                                        <tr><td className="p-2.5 sm:p-3">55-59</td><td className="p-2.5 sm:p-3 font-bold text-gray-900 dark:text-white">B-</td><td className="p-2.5 sm:p-3">2.75</td><td className="p-2.5 sm:p-3 text-right">Above Avg</td></tr>
                                        <tr><td className="p-2.5 sm:p-3">50-54</td><td className="p-2.5 sm:p-3 font-bold text-gray-900 dark:text-white">C+</td><td className="p-2.5 sm:p-3">2.50</td><td className="p-2.5 sm:p-3 text-right">Average</td></tr>
                                        <tr><td className="p-2.5 sm:p-3">45-49</td><td className="p-2.5 sm:p-3 font-bold text-gray-900 dark:text-white">C</td><td className="p-2.5 sm:p-3">2.25</td><td className="p-2.5 sm:p-3 text-right">Below Avg</td></tr>
                                        <tr><td className="p-2.5 sm:p-3">40-44</td><td className="p-2.5 sm:p-3 font-bold text-gray-900 dark:text-white">D</td><td className="p-2.5 sm:p-3">2.00</td><td className="p-2.5 sm:p-3 text-right">Pass</td></tr>
                                        <tr><td className="p-2.5 sm:p-3">00-39</td><td className="p-2.5 sm:p-3 font-bold text-red-500">F</td><td className="p-2.5 sm:p-3">0.00</td><td className="p-2.5 sm:p-3 text-right">Fail</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-3 bg-gray-50 dark:bg-gray-800 text-center border-t border-gray-100 dark:border-gray-700">
                                    <p className="text-[8px] sm:text-[9px] font-bold text-gray-400 italic uppercase">Effective from Spring Semester 2026</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Results;