import { useState, useEffect, useCallback } from 'react';
import {
    CheckCircle2,
    AlertCircle,
    Info,
    Users,
    ShieldCheck,
    ShieldAlert,
    ChevronDown,
    RefreshCw,
    CreditCard
} from 'lucide-react';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { useAuthStore } from '../../store/authStore';
import {
    getAvailableOfferings,
    getMyEnrollments
} from '../../api/enrollmentApi';
import { getActiveSemester, getSemesters } from '../../api/semesterApi';
import { getMyProfile } from '../../api/profileApi';
import { getMyFees } from '../../api/feeApi';
import client from '../../api/client';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const CourseRegistration = () => {
    const user = useAuthStore(state => state.user);
    const [studentId, setStudentId] = useState(null);
    const [studentProfile, setStudentProfile] = useState(null);
    const [activeSemester, setActiveSemester] = useState(null);
    const [myEnrollments, setMyEnrollments] = useState([]);
    const [feeStatus, setFeeStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    // Registered Course Section (History)
    const [semesters, setSemesters] = useState([]);
    const [historySemesterId, setHistorySemesterId] = useState('');
    const [historyEnrollments, setHistoryEnrollments] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [profileRes, semRes, allSemRes] = await Promise.all([
                getMyProfile(),
                getActiveSemester(),
                getSemesters({ size: 100 })
            ]);

            const sProfile = profileRes.data.student;
            const sId = sProfile?.id;
            const semester = semRes.data;
            const allSemesters = allSemRes.data.content || allSemRes.data;

            setStudentProfile(sProfile);
            setStudentId(sId);
            setActiveSemester(semester);
            setSemesters(allSemesters);

            if (semester) {
                setHistorySemesterId(semester.id);
            } else if (allSemesters.length > 0) {
                setHistorySemesterId(allSemesters[0].id);
            }

            if (sId) {
                const [myRes, feeRes] = await Promise.all([
                    getMyEnrollments(sId, semester?.id),
                    getMyFees(sId)
                ]);

                if (semester) {
                    const currentFee = feeRes.data.find(f => f.semesterName.includes(semester?.name) || f.semesterName === semester?.name);
                    setFeeStatus(currentFee);
                }

                setMyEnrollments(myRes.data);
                setHistoryEnrollments(myRes.data);
            }
        } catch (err) {
            if (err.response?.status !== 404 && err.response?.data) {
                toast.error('Failed to load registration data');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Fetch history enrollments when semester changes
    useEffect(() => {
        if (studentId && historySemesterId) {
            const fetchHistory = async () => {
                setHistoryLoading(true);
                try {
                    const res = await getMyEnrollments(studentId, historySemesterId);
                    setHistoryEnrollments(res.data);
                } catch (err) {
                    console.error(err);
                } finally {
                    setHistoryLoading(false);
                }
            };
            fetchHistory();
        }
    }, [studentId, historySemesterId]);

    const isRegistrationFeePaid = feeStatus ? feeStatus.amountPaid >= feeStatus.registrationFee : true;

    // Deadline Check
    const now = new Date();
    const regDeadline = activeSemester?.registrationDeadline ? new Date(activeSemester.registrationDeadline) : null;
    if (regDeadline) regDeadline.setHours(23, 59, 59, 999);
    const isRegDeadlinePassed = regDeadline && now > regDeadline;

    if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;

    if (!activeSemester || isRegDeadlinePassed) return (
        <div className="text-center py-24 bg-white dark:bg-gray-800/40 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center space-y-6 mx-4">
            <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-full text-amber-500 animate-pulse">
                <AlertCircle size={48} />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Registration is Closed</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                    {isRegDeadlinePassed
                        ? `The registration deadline for ${activeSemester.name} has passed (${activeSemester.registrationDeadline}).`
                        : "There is no active semester open for course registration at this time."}
                    Please check the academic calendar.
                </p>
            </div>
        </div>
    );

    if (studentProfile && !studentProfile.isRegistrationCleared) return (
        <div className="max-w-4xl mx-auto text-center py-24 space-y-8 px-4">
            <div className="w-24 h-24 bg-red-50 dark:bg-red-900/10 rounded-[2.5rem] flex items-center justify-center mx-auto text-red-500 shadow-xl shadow-red-500/10">
                <ShieldAlert size={48} />
            </div>
            <div className="space-y-3">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white">Registration Restricted</h2>
                <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto font-medium">Your academic dues are not cleared yet. Please complete your payment to proceed with course registration.</p>
            </div>
            <div className="pt-4">
                <div className="inline-flex items-center space-x-3 px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-2xl text-gray-600 dark:text-gray-300 font-bold text-sm">
                    <Info size={18} />
                    <span>Contact Registrar Office for clearance</span>
                </div>
            </div>
        </div>
    );

    if (studentProfile?.isRegistrationCleared && myEnrollments.length === 0) return (
        <div className="max-w-4xl mx-auto text-center py-24 space-y-8 px-4">
            <div className="w-24 h-24 bg-green-50 dark:bg-green-900/10 rounded-[2.5rem] flex items-center justify-center mx-auto text-green-600 shadow-xl shadow-green-600/10">
                <CheckCircle2 size={48} />
            </div>
            <div className="space-y-3">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white">Registration Cleared</h2>
                <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto font-medium">Your registration access is now open. Please contact your advisor to assign a section and courses for this semester.</p>
            </div>
            <div className="pt-4 flex flex-col items-center space-y-4">
                <div className="inline-flex items-center space-x-3 px-6 py-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                    <Users size={18} />
                    <span>Advisor: {studentProfile?.advisorName || 'Not Assigned'}</span>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-8 px-6 py-2.5 bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-sm flex items-center transition-all"
                >
                    <RefreshCw size={16} className="mr-2" /> Refresh Status
                </button>
            </div>
        </div>
    );

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 space-y-8 pb-20 pt-4">
            {/* Registration Locked - Fee Unpaid */}
            {studentProfile?.isRegistrationCleared && !isRegistrationFeePaid && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-3xl flex flex-col items-center text-center space-y-4"
                >
                    <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600">
                        <CreditCard size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-amber-800 dark:text-amber-400">Semester Payment Required</h3>
                        <p className="text-amber-700/70 dark:text-amber-500/70 font-bold mt-1">
                            To begin course registration, please pay the mandatory semester registration fee of **{feeStatus?.registrationFee?.toLocaleString()} BDT**.
                        </p>
                        <p className="text-xs text-amber-600/50 mt-2 italic">Remaining credit fees can be cleared before final examinations.</p>
                    </div>
                </motion.div>
            )}

            {/* Cleared but No Courses Message */}
            {myEnrollments.length === 0 && studentProfile?.isRegistrationCleared && isRegistrationFeePaid && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 rounded-3xl flex flex-col items-center text-center space-y-4"
                >
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600">
                        <ShieldCheck size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-green-800 dark:text-green-400">Registration Cleared</h3>
                        <p className="text-green-700/70 dark:text-green-500/70 font-bold mt-1">Please contact your advisor to assign a section and courses.</p>
                    </div>
                </motion.div>
            )}

            {/* Search & Table Section */}
            <div className="space-y-6">
                <div className="flex flex-col space-y-2 max-w-sm">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ml-1">Select Semester</label>
                    <div className="relative group">
                        <select
                            value={historySemesterId}
                            onChange={(e) => setHistorySemesterId(e.target.value)}
                            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-5 py-3.5 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all appearance-none font-bold text-sm cursor-pointer shadow-sm"
                        >
                            {semesters.map(sem => (
                                <option key={sem.id} value={sem.id}>
                                    {sem.name}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2 pointer-events-none text-gray-400 group-hover:text-[#2D2A4F]">
                            <ChevronDown size={18} />
                        </div>
                    </div>
                </div>

                <Card className="!p-0 overflow-hidden border border-gray-100 dark:border-gray-800 shadow-xl rounded-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 dark:bg-gray-800/80 text-[#2D2A4F] dark:text-gray-300 uppercase text-[11px] font-black tracking-widest border-b border-gray-100 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-5 w-16 text-center">SL</th>
                                <th className="px-6 py-5">Course Code</th>
                                <th className="px-6 py-5">Course Title</th>
                                <th className="px-6 py-5 text-center">Credit</th>
                                <th className="px-6 py-5">Type</th>
                                <th className="px-6 py-5">Section</th>
                                <th className="px-6 py-5">Teacher</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                            {historyLoading ? (
                                <tr><td colSpan="7" className="py-24 text-center"><Loader /></td></tr>
                            ) : historyEnrollments.length > 0 ? historyEnrollments.map((e, idx) => (
                                <tr key={e.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all">
                                    <td className="px-6 py-5 text-center text-sm font-bold text-gray-400">{idx + 1}</td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                                            {e.courseCode}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{e.courseTitle}</p>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300 tabular-nums">{e.creditHours}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-[10px] font-black uppercase text-gray-600 dark:text-gray-400">
                                            {e.enrollmentType || 'REGULAR'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                                            {e.section}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{e.facultyName}</span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="py-24 text-center">
                                        <div className="flex flex-col items-center space-y-3 opacity-40">
                                            <Info size={48} className="text-gray-300" />
                                            <p className="text-sm font-black uppercase tracking-widest italic text-gray-400">No registered courses found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default CourseRegistration;