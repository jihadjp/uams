import { useState, useEffect } from 'react';
import { Send, X, CheckCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getActiveSemester } from '../../api/semesterApi';
import { getEvaluationStatus, submitEvaluation } from '../../api/evaluationApi';
import { getMyProfile } from '../../api/profileApi';

const TeachingEvaluation = () => {
    const [semester, setSemester] = useState(null);
    const [courses, setCourses] = useState([]);
    const [activeCourse, setActiveCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [studentId, setStudentId] = useState(null);

    const [ratings, setRatings] = useState(Array(10).fill(0));
    const [comments, setComments] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [semRes, profileRes] = await Promise.all([
                getActiveSemester(),
                getMyProfile()
            ]);

            setSemester(semRes.data);
            const sId = profileRes.data.student?.id;
            setStudentId(sId);

            if (semRes.data?.id) {
                const statusRes = await getEvaluationStatus(semRes.data.id);
                setCourses(statusRes.data || []);
            }
        } catch (error) {
            toast.error('Failed to load evaluation data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (ratings.some(r => r === 0)) {
            toast.error('Please answer all evaluation questions.');
            return;
        }

        try {
            setSubmitting(true);
            const payload = {
                studentId,
                offeringId: activeCourse.offeringId,
                q1: ratings[0],
                q2: ratings[1],
                q3: ratings[2],
                q4: ratings[3],
                q5: ratings[4],
                q6: ratings[5],
                q7: ratings[6],
                q8: ratings[7],
                q9: ratings[8],
                q10: ratings[9],
                comments
            };

            await submitEvaluation(payload);
            toast.success('Evaluation submitted successfully!');

            // Update local state
            setCourses(prev => prev.map(c =>
                c.offeringId === activeCourse.offeringId ? { ...c, submitted: true } : c
            ));

            setActiveCourse(null);
            setRatings(Array(10).fill(0));
            setComments('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit evaluation');
        } finally {
            setSubmitting(false);
        }
    };

    const questions = [
        "The teacher gave a detailed course outline with the names of the required textbooks and reference materials.",
        "The teacher ensured that classes consistently started and concluded on schedule.",
        "The teacher used practical examples during the class.",
        "The teacher actively encouraged questions and fostered peer discussions among students.",
        "The teacher provided constructive feedback on the students' learning progress.",
        "The teacher ensured students took all the necessary quizzes, presentations and assignments.",
        "The teacher delivered lectures with effective communication skills.",
        "The teacher delivered the prescribed syllabus covering the required topics.",
        "The teacher treated all students impartially and objectively.",
        "The teacher was friendly, responsible, helpful and was available during counselling hour."
    ];

    const options = [
        { label: "Below average", value: 1 },
        { label: "Average", value: 2 },
        { label: "Good", value: 3 },
        { label: "Very Good", value: 4 },
        { label: "Excellent", value: 5 }
    ];

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-20 pt-4">
            {/* Active Course Evaluation Form */}
            <AnimatePresence>
                {activeCourse && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="border-primary-200 ring-1 ring-primary-100 dark:border-primary-900/40 rounded-2xl sm:rounded-3xl !p-5 sm:!p-8">
                            <div className="flex justify-between items-start gap-4 mb-6 sm:mb-8 pb-4 border-b border-gray-100 dark:border-gray-800">
                                <div>
                                    <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white leading-tight">
                                        {activeCourse.courseTitle}
                                    </h2>
                                    <p className="text-xs sm:text-sm font-bold text-primary-600 dark:text-emerald-400 mt-1">
                                        {activeCourse.courseCode} — {activeCourse.facultyName}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setActiveCourse(null)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors shrink-0"
                                >
                                    <X size={20} className="text-gray-400" />
                                </button>
                            </div>

                            <div className="space-y-6 sm:space-y-8">
                                {questions.map((q, qIdx) => (
                                    <div key={qIdx} className="space-y-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gray-50/60 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800">
                                        <p className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 leading-relaxed">
                                            <span className="text-primary-600 dark:text-emerald-400 mr-1">{qIdx + 1}.</span> {q} <span className="text-red-500">*</span>
                                        </p>
                                        <div className="flex flex-wrap gap-2 sm:gap-3 pt-1">
                                            {options.map((opt) => {
                                                const isSelected = ratings[qIdx] === opt.value;
                                                return (
                                                    <label
                                                        key={opt.value}
                                                        className={`flex items-center space-x-2 px-3 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all select-none ${
                                                            isSelected
                                                                ? 'bg-primary-50 dark:bg-emerald-500/15 border-primary-500 dark:border-emerald-500 text-primary-700 dark:text-emerald-300 shadow-sm'
                                                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`q${qIdx}`}
                                                            value={opt.value}
                                                            checked={isSelected}
                                                            onChange={() => {
                                                                const newRatings = [...ratings];
                                                                newRatings[qIdx] = opt.value;
                                                                setRatings(newRatings);
                                                            }}
                                                            className="w-3.5 h-3.5 text-primary-600 border-gray-300 focus:ring-primary-500"
                                                        />
                                                        <span>{opt.label}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                                        Optional Note
                                    </label>
                                    <textarea
                                        rows="4"
                                        value={comments}
                                        onChange={(e) => setComments(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/20 text-xs sm:text-sm dark:text-white transition-all"
                                        placeholder="Enter any additional feedback..."
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                                    <Button
                                        variant="secondary"
                                        onClick={() => setActiveCourse(null)}
                                        className="w-full sm:w-auto"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="w-full sm:w-auto px-8 sm:px-12 bg-[#2D2A4F] hover:bg-[#1E1C38] text-white border-none rounded-xl font-bold shadow-lg shadow-indigo-500/10 transition-all"
                                        onClick={handleSubmit}
                                        isLoading={submitting}
                                    >
                                        <Send size={18} className="mr-2" /> Submit Feedback
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Course Table Card */}
            <Card className="rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl !p-0 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                    <div className="max-w-xs">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">
                            Current Semester
                        </label>
                        <div className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 font-bold text-xs sm:text-sm text-gray-900 dark:text-white shadow-sm">
                            {semester ? `${semester.name}, ${semester.academicYear}` : 'No Active Semester'}
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 dark:bg-gray-800/80 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-700">
                        <tr>
                            <th className="px-4 sm:px-6 py-4 whitespace-nowrap">Submit Status</th>
                            <th className="px-4 sm:px-6 py-4 whitespace-nowrap">Course</th>
                            <th className="px-4 sm:px-6 py-4 whitespace-nowrap">Teacher</th>
                            <th className="px-4 sm:px-6 py-4 text-right whitespace-nowrap">Action</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/50">
                        {courses.length > 0 ? (
                            courses.map((c) => (
                                <tr key={c.offeringId} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all">
                                    <td className="px-4 sm:px-6 py-4 sm:py-5 whitespace-nowrap">
                                        {c.submitted ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500 text-white text-[10px] font-black rounded-lg uppercase shadow-sm">
                          <CheckCircle size={12} />
                          <span>Submitted</span>
                        </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-1 bg-amber-500 text-white text-[10px] font-black rounded-lg uppercase shadow-sm">
                          Not Submitted
                        </span>
                                        )}
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 sm:py-5 whitespace-nowrap">
                                        <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                                            {c.courseTitle}
                                        </p>
                                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">{c.courseCode}</p>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 sm:py-5 text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                        {c.facultyName}
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 sm:py-5 text-right whitespace-nowrap">
                                        <Button
                                            size="sm"
                                            variant={c.submitted ? "secondary" : "primary"}
                                            disabled={c.submitted}
                                            onClick={() => setActiveCourse(c)}
                                            className="text-xs"
                                        >
                                            {c.submitted ? 'Done' : 'Evaluate'}
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-16 text-center text-gray-400 text-xs sm:text-sm font-bold italic">
                                    No courses available for evaluation in this semester.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default TeachingEvaluation;