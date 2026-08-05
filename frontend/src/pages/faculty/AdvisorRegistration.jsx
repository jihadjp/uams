import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    BookOpen,
    CheckCircle2,
    Trash2,
    AlertCircle,
    Info,
    Search,
    Clock,
    MapPin,
    Users,
    UserSquare2,
    ArrowLeft,
    GraduationCap,
    Calendar,
    ShieldCheck,
    ShieldAlert,
    CreditCard,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import {
    getAvailableOfferings,
    getMyEnrollments,
    registerCourse,
    registerBulk,
    dropCourse,
} from '../../api/enrollmentApi';
import { getSemesters } from '../../api/semesterApi';
import { getMyFees } from '../../api/feeApi';
import client from '../../api/client';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import useAuth from '../../hooks/useAuth';

const AdvisorRegistration = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const { isAdmin, isRegistrar } = useAuth();

    const [studentInfo, setStudentInfo] = useState(null);
    const [semesters, setSemesters] = useState([]);
    const [selectedSemesterId, setSelectedSemesterId] = useState('');
    const [myEnrollments, setMyEnrollments] = useState([]);
    const [availableOfferings, setAvailableOfferings] = useState([]);
    const [feeStatus, setFeeStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [enrollType, setEnrollType] = useState('REGULAR');

    const [search, setSearch] = useState('');
    const [selectedDept] = useState('');
    const [departments, setDepartments] = useState([]);
    const [batchSections, setBatchSections] = useState([]);
    const [selectedSectionId, setSelectedSectionId] = useState('');

    const [confirmModal, setConfirmModal] = useState({ isOpen: false, data: null, type: '' });

    const selectedSemester = semesters.find((s) => s.id === selectedSemesterId);

    const fetchInitialData = useCallback(async () => {
        setLoading(true);
        try {
            const [studentRes, semRes, deptRes] = await Promise.all([
                client.get(`/students/${studentId}`),
                getSemesters(),
                client.get('/departments'),
            ]);

            setStudentInfo(studentRes.data);
            setSelectedSectionId(studentRes.data.sectionId || '');
            const sems = semRes.data.content || semRes.data || [];
            setSemesters(sems);
            setDepartments(deptRes.data.content || deptRes.data || []);

            const activeSem = sems.find((s) => s.active);
            if (activeSem) setSelectedSemesterId(activeSem.id);
        } catch (err) {
            toast.error('Failed to load initial data');
        } finally {
            setLoading(false);
        }
    }, [studentId]);

    const fetchRegistrationData = useCallback(async () => {
        if (!selectedSemesterId || !studentInfo?.batchNumber) return;
        setLoading(true);
        try {
            const [myRes, allRes, feeRes] = await Promise.all([
                getMyEnrollments(studentId, selectedSemesterId),
                getAvailableOfferings({
                    semesterId: selectedSemesterId,
                    batch: studentInfo.batchNumber,
                    size: 1000,
                }),
                getMyFees(studentId)
            ]);
            setMyEnrollments(myRes.data);
            setAvailableOfferings(allRes.data.content || allRes.data);

            const semester = semesters.find((s) => s.id === selectedSemesterId);
            const currentFee = feeRes.data.find(f =>
                semester?.name && (f.semesterName.includes(semester.name) || f.semesterName === semester.name)
            );
            setFeeStatus(currentFee);
        } catch (err) {
            toast.error('Failed to load registration data');
        } finally {
            setLoading(false);
        }
    }, [studentId, selectedSemesterId, studentInfo?.batchNumber, semesters]);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    useEffect(() => {
        const fetchBatchSections = async () => {
            if (studentInfo?.batchId) {
                try {
                    const res = await client.get(`/batches/${studentInfo.batchId}/sections`);
                    setBatchSections(res.data || []);
                } catch (err) {
                    console.error("Failed to fetch batch sections", err);
                }
            }
        };
        fetchBatchSections();
    }, [studentInfo?.batchId]);

    const handleSectionChange = async (sectionId) => {
        setSelectedSectionId(sectionId);
        if (!sectionId) return;

        setActionLoading(true);
        try {
            await client.put(`/students/${studentId}/section?sectionId=${sectionId}`);
            toast.success('Student section assigned successfully');
            fetchInitialData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to assign section');
        } finally {
            setActionLoading(false);
        }
    };

    useEffect(() => {
        fetchRegistrationData();
    }, [fetchRegistrationData]);

    const handleRegister = async () => {
        setActionLoading(true);
        try {
            await registerCourse({
                studentId: studentId,
                offeringId: confirmModal.data.id,
                enrollmentType: enrollType,
            });
            toast.success('Course registered successfully');
            setConfirmModal({ isOpen: false, data: null, type: '' });
            fetchRegistrationData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setActionLoading(false);
        }
    };

    const handleToggleClearance = async () => {
        setActionLoading(true);
        try {
            await client.put(`/students/${studentId}/clearance?isCleared=${!studentInfo.isRegistrationCleared}`);
            toast.success(studentInfo.isRegistrationCleared ? 'Student blocked from registration' : 'Student cleared for registration');
            fetchInitialData();
        } catch (err) {
            toast.error('Failed to update clearance status');
        } finally {
            setActionLoading(false);
        }
    };

    const handleBulkRegister = async () => {
        if (!studentInfo?.sectionId) {
            return toast.error("Please assign a section to the student first");
        }

        const offeringsToRegister = availableOfferings.filter((o) => {
            const isMatch = o.sectionId === studentInfo.sectionId;
            return isMatch && !isRegistered(o.id);
        });

        if (offeringsToRegister.length === 0) {
            return toast.error(`No new courses found for your assigned section`);
        }

        setActionLoading(true);
        try {
            await registerBulk({
                studentId: studentId,
                offeringIds: offeringsToRegister.map((o) => o.id),
            });
            toast.success(`Successfully registered ${offeringsToRegister.length} courses!`);
            fetchRegistrationData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Bulk registration failed. Some courses might have conflicts.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDrop = async () => {
        setActionLoading(true);
        try {
            const enrollmentId = confirmModal.data.enrollmentId || confirmModal.data.id;
            await dropCourse(enrollmentId);
            toast.success('Course dropped');
            setConfirmModal({ isOpen: false, data: null, type: '' });
            fetchRegistrationData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to drop course');
        } finally {
            setActionLoading(false);
        }
    };

    const filteredOfferings = availableOfferings
        .filter((o) => {
            const matchesSearch =
                o.courseTitle.toLowerCase().includes(search.toLowerCase()) ||
                o.courseCode.toLowerCase().includes(search.toLowerCase());
            const matchesDept = !selectedDept || o.departmentName === departments.find((d) => d.id === selectedDept)?.name;
            return matchesSearch && matchesDept;
        });

    const totalCredits = myEnrollments.reduce((sum, e) => sum + (e.creditHours || 0), 0);

    const isRegistered = (offeringId) => myEnrollments.some((e) => e.offeringId === offeringId);
    const getEnrollmentId = (offeringId) => myEnrollments.find((e) => e.offeringId === offeringId)?.id;

    const isRegistrationFeePaid = feeStatus ? feeStatus.amountPaid >= feeStatus.registrationFee : true;

    // Deadline Checks
    const now = new Date();
    const regDeadline = selectedSemester?.registrationDeadline ? new Date(selectedSemester.registrationDeadline) : null;
    const addDropDeadline = selectedSemester?.addDropDeadline ? new Date(selectedSemester.addDropDeadline) : regDeadline;

    // Normalize dates to midnight for accurate comparison
    if (regDeadline) regDeadline.setHours(23, 59, 59, 999);
    if (addDropDeadline) addDropDeadline.setHours(23, 59, 59, 999);

    const isRegDeadlinePassed = regDeadline && now > regDeadline;
    const isAddDropDeadlinePassed = addDropDeadline && now > addDropDeadline;

    if (loading && !studentInfo)
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-20 pt-4">
            {/* Top Action Bar (Back button & Student Context) */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate('/faculty/advisees')}
                    className="p-2 sm:p-2.5 bg-white dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.08] transition-colors text-slate-600 dark:text-white/60 shadow-sm shrink-0"
                >
                    <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
                </button>
                <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-white/40 truncate">
                        Advising Registration for <span className="font-black text-slate-900 dark:text-white">{studentInfo?.name}</span> ({studentInfo?.registrationNo})
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
                {/* Student Overview Banner */}
                <div className="lg:col-span-3">
                    <Card className="bg-[#0B1225] border border-slate-200/80 dark:border-white/10 text-white overflow-hidden relative !p-5 sm:!p-8 rounded-2xl sm:rounded-3xl shadow-sm">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                            <div>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <div className="inline-flex items-center px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                                        <GraduationCap size={12} className="mr-1.5" /> Term: {selectedSemester?.name || 'Choose Semester'}
                                    </div>
                                    <div
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                            studentInfo?.isRegistrationCleared
                                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/20'
                                                : 'bg-red-500/20 text-red-300 border-red-500/20'
                                        }`}
                                    >
                                        {studentInfo?.isRegistrationCleared ? (
                                            <ShieldCheck size={12} className="mr-1.5" />
                                        ) : (
                                            <ShieldAlert size={12} className="mr-1.5" />
                                        )}
                                        {studentInfo?.isRegistrationCleared ? 'Cleared' : 'Dues Pending'}
                                    </div>
                                    <div className="inline-flex items-center px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                                        <Users size={12} className="mr-1.5" /> Sec: {studentInfo?.sectionName || 'Not Assigned'}
                                    </div>
                                </div>
                                <h2 className="text-xl sm:text-3xl font-black tracking-tight">{studentInfo?.name}</h2>
                                <p className="text-white/60 mt-1 font-medium text-xs sm:text-sm">{studentInfo?.programName}</p>
                            </div>

                            <div className="text-left md:text-right w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Assigned Credits</p>
                                <div className="flex items-baseline justify-start md:justify-end gap-1.5">
                                    <span className="text-3xl sm:text-5xl font-black leading-none">{totalCredits.toFixed(1)}</span>
                                    <span className="text-lg font-bold text-white/40">/ 18.0</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 sm:mt-8 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(totalCredits / 18) * 100}%` }}
                                className={`h-full ${totalCredits > 18 ? 'bg-red-500' : 'bg-[#007A55]'}`}
                            />
                        </div>

                        {feeStatus && (
                            <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-[9px] font-black uppercase text-white/40 tracking-widest mb-0.5">Registration Fee</p>
                                    <p className="text-xs sm:text-sm font-bold">{feeStatus.registrationFee?.toLocaleString()} BDT</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase text-white/40 tracking-widest mb-0.5">Credit Fees</p>
                                    <p className="text-xs sm:text-sm font-bold">{feeStatus.creditFee?.toLocaleString()} BDT</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase text-white/40 tracking-widest mb-0.5">Total Paid</p>
                                    <p className="text-xs sm:text-sm font-bold text-emerald-400">{feeStatus.amountPaid?.toLocaleString()} BDT</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black uppercase text-white/40 tracking-widest mb-0.5">Total Due</p>
                                    <p className="text-xs sm:text-sm font-bold text-amber-400">{(feeStatus.amountDue - feeStatus.amountPaid)?.toLocaleString()} BDT</p>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Advising Info Sidebar */}
                <Card title="Advising Info" icon={CheckCircle2} className="rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden !p-5 sm:!p-6">
                    <div className="space-y-4">
                        {(isAdmin || isRegistrar) && (
                            <div>
                                <Button
                                    variant={studentInfo?.isRegistrationCleared ? 'danger' : 'primary'}
                                    onClick={handleToggleClearance}
                                    isLoading={actionLoading}
                                    className="w-full text-xs flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold"
                                >
                                    <CreditCard size={14} />
                                    <span>{studentInfo?.isRegistrationCleared ? 'Block Registration' : 'Clear Dues Manually'}</span>
                                </Button>
                            </div>
                        )}

                        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl sm:rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#007A55] dark:text-emerald-300 mb-0.5">Status</p>
                            <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80 uppercase">Registered Advisor</p>
                        </div>

                        <div className="space-y-3 pt-1">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 ml-1">Assign Section</label>
                                <select
                                    value={selectedSectionId}
                                    onChange={(e) => handleSectionChange(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-indigo-50/60 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl text-xs sm:text-sm font-bold text-indigo-700 dark:text-indigo-300 outline-none transition-all cursor-pointer"
                                >
                                    <option value="">Choose Section</option>
                                    {batchSections.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            Section {s.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <Button
                                onClick={handleBulkRegister}
                                isLoading={actionLoading}
                                disabled={isRegDeadlinePassed}
                                className="w-full bg-[#2D2A4F] hover:bg-[#1E1C38] text-white border-none rounded-xl font-bold text-xs py-2.5 disabled:opacity-50"
                            >
                                Register All Available
                            </Button>
                        </div>

                        <div className="h-px bg-slate-100 dark:bg-white/[0.06]" />

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 ml-1">Change Semester</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                                <select
                                    value={selectedSemesterId}
                                    onChange={(e) => setSelectedSemesterId(e.target.value)}
                                    className="w-full pl-8 pr-3 py-2.5 bg-slate-50 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 rounded-xl text-xs font-bold outline-none cursor-pointer dark:text-white"
                                >
                                    {semesters.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name} {s.active ? '(Active)' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Payment Warning */}
            {!isRegistrationFeePaid && (
                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 p-4 rounded-xl sm:rounded-2xl flex items-start sm:items-center gap-3 text-amber-800 dark:text-amber-400 shadow-sm">
                    <AlertCircle size={18} className="shrink-0 mt-0.5 sm:mt-0" />
                    <p className="text-xs sm:text-sm font-bold">Registration Locked: Student has not paid the mandatory registration fee ({feeStatus?.registrationFee?.toLocaleString()} BDT) for this semester.</p>
                </div>
            )}

            {/* Deadline Warning */}
            {isAddDropDeadlinePassed && (
                <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 p-4 rounded-xl sm:rounded-2xl flex items-start sm:items-center gap-3 text-rose-800 dark:text-rose-400 shadow-sm">
                    <AlertCircle size={18} className="shrink-0 mt-0.5 sm:mt-0" />
                    <p className="text-xs sm:text-sm font-bold">Registration Closed: The Add/Drop deadline for this semester has passed. No further changes can be made.</p>
                </div>
            )}

            {/* Offerings & Selection Main Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 sm:gap-8">
                <div className="xl:col-span-3 space-y-4 sm:space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
                        <div className="flex items-center space-x-2.5">
                            <div className="w-1.5 h-5 bg-[#007A55] rounded-full" />
                            <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase">
                                Available Offerings
                            </h2>
                        </div>
                        <div className="relative w-full sm:w-72 group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#007A55] transition" size={15} />
                            <input
                                placeholder="Search courses..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#0B1225] border border-slate-200/80 dark:border-white/10 rounded-xl text-xs sm:text-sm font-medium outline-none dark:text-white shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-6">
                        {filteredOfferings.map((o) => {
                            const registered = isRegistered(o.id);
                            const isFull = o.enrolledCount >= o.seatLimit;
                            return (
                                <Card
                                    key={o.id}
                                    className={`relative transition-all border shadow-sm rounded-2xl sm:rounded-3xl !p-5 overflow-hidden ${registered ? 'border-[#007A55] bg-emerald-50/30 dark:bg-emerald-500/5' : 'border-slate-200/80 dark:border-white/10 hover:shadow-md'}`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="px-2.5 py-1 bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 rounded-lg text-[10px] font-bold font-mono text-slate-600 dark:text-white/60">
                                            {o.courseCode}
                                        </span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#007A55] dark:text-emerald-400">{o.creditHours} Credits</span>
                                    </div>
                                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">{o.courseTitle}</h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#007A55] dark:text-emerald-400 mb-3">Sec {o.section}</p>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-xs font-medium text-slate-500 dark:text-white/50">
                                            <UserSquare2 size={13} className="mr-1.5 shrink-0" /> {o.facultyName}
                                        </div>
                                        <div className="space-y-1.5 mt-2">
                                            {o.schedules?.map((slot, sIdx) => (
                                                <div
                                                    key={sIdx}
                                                    className="flex flex-col bg-slate-50/60 dark:bg-white/[0.04] p-2 rounded-xl border border-slate-100 dark:border-white/[0.06]"
                                                >
                                                    <div className="flex items-center text-[10px] font-bold text-slate-700 dark:text-white/70">
                                                        <Clock size={11} className="mr-1 text-[#007A55] shrink-0" />
                                                        {slot.dayOfWeek} | {slot.startTime?.substring(0, 5)} - {slot.endTime?.substring(0, 5)}
                                                    </div>
                                                    <div className="flex items-center mt-0.5 text-[9px] text-slate-400 dark:text-white/40">
                                                        <MapPin size={10} className="mr-1 shrink-0" /> Room: {slot.roomNo || 'TBA'}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/[0.06]">
                                        <div className="flex flex-col">
                                            <span className={`text-[10px] font-black uppercase tracking-wider ${isFull ? 'text-red-500' : 'text-slate-400'}`}>
                                                {o.enrolledCount} / {o.seatLimit} Seats
                                            </span>
                                            <div className="h-1.5 w-16 bg-slate-100 dark:bg-white/10 rounded-full mt-1 overflow-hidden">
                                                <div
                                                    className={`h-full transition-all ${isFull ? 'bg-red-500' : 'bg-[#007A55]'}`}
                                                    style={{ width: `${(o.enrolledCount / o.seatLimit) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            variant={registered ? 'danger' : 'primary'}
                                            size="sm"
                                            disabled={(!registered && (isFull || isRegDeadlinePassed)) || (registered && isAddDropDeadlinePassed)}
                                            onClick={() =>
                                                setConfirmModal({
                                                    isOpen: true,
                                                    data: { ...o, enrollmentId: getEnrollmentId(o.id) },
                                                    type: registered ? 'drop' : 'register',
                                                })
                                            }
                                            className="text-xs px-4 py-1.5 rounded-lg"
                                        >
                                            {registered ? 'Drop' : isFull ? 'Full' : isRegDeadlinePassed ? 'Closed' : 'Register'}
                                        </Button>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* Current Selection Sidebar */}
                <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center space-x-2.5 px-1">
                        <div className="w-1.5 h-5 bg-emerald-500 rounded-full" />
                        <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase">
                            Current Selection
                        </h2>
                    </div>
                    <div className="space-y-3">
                        {myEnrollments.map((e) => (
                            <Card key={e.id} className="!p-3.5 border-l-4 border-l-[#007A55] border-slate-200/80 dark:border-white/10 shadow-sm rounded-xl sm:rounded-2xl hover:shadow-md transition-all">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-black tracking-widest text-[#007A55] dark:text-emerald-400 font-mono">
                                            {e.courseCode} (Sec {e.section})
                                        </p>
                                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">{e.courseTitle}</h4>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">{e.creditHours} Credits</p>
                                    </div>
                                    <button
                                        onClick={() => setConfirmModal({ isOpen: true, data: { ...e, enrollmentId: e.id }, type: 'drop' })}
                                        disabled={isAddDropDeadlinePassed}
                                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </Card>
                        ))}
                        {myEnrollments.length === 0 && (
                            <div className="py-12 sm:py-16 text-center bg-slate-50/50 dark:bg-white/[0.03] rounded-2xl sm:rounded-3xl border border-dashed border-slate-200/80 dark:border-white/10 shadow-sm">
                                <Info className="mx-auto text-slate-300 dark:text-white/10 mb-2" size={28} />
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-white/30 italic">Empty List</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            <Modal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, data: null, type: '' })}
                title={confirmModal.type === 'register' ? 'Confirm Registration' : 'Confirm Drop'}
                size="sm"
            >
                <div className="text-center space-y-4 py-2">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 mb-1">Are you sure?</p>
                        <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white leading-tight px-2">
                            {confirmModal.data?.courseTitle}
                        </h3>
                        <div className="flex items-center justify-center gap-2.5 mt-2 text-xs font-bold text-slate-500 dark:text-white/40">
                            <span>Sec {confirmModal.data?.section}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span>{confirmModal.data?.courseCode}</span>
                        </div>
                    </div>

                    {confirmModal.type === 'register' && (
                        <div className="px-2 space-y-1.5 text-left pt-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 ml-1">Registration Type</label>
                            <div className="grid grid-cols-2 gap-2.5">
                                {['REGULAR', 'RETAKE'].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setEnrollType(type)}
                                        className={`px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                                            enrollType === type
                                                ? 'bg-[#007A55] text-white border-[#007A55] shadow-sm'
                                                : 'bg-slate-50 dark:bg-white/[0.04] text-slate-400 border-slate-200 dark:border-white/10'
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-2 pt-4 px-2">
                        <Button
                            variant={confirmModal.type === 'register' ? 'primary' : 'danger'}
                            className="w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest"
                            isLoading={actionLoading}
                            onClick={confirmModal.type === 'register' ? handleRegister : handleDrop}
                        >
                            Confirm {confirmModal.type}
                        </Button>
                        <Button
                            variant="secondary"
                            className="w-full py-2.5 rounded-xl text-xs font-bold bg-transparent border-none"
                            onClick={() => setConfirmModal({ isOpen: false, data: null, type: '' })}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdvisorRegistration;