import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    BookOpen,
    CheckCircle2,
    Plus,
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
import client from '../../api/client';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
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
    const [selectedDept, setSelectedDept] = useState('');
    const [departments, setDepartments] = useState([]);
    const [batchSections, setBatchSections] = useState([]);
    const [selectedSectionId, setSelectedSectionId] = useState('');

    const [confirmModal, setConfirmModal] = useState({ isOpen: false, data: null, type: '' });

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
                client.get(`/fees`, { params: { studentId } })
            ]);
            setMyEnrollments(myRes.data);
            setAvailableOfferings(allRes.data.content || allRes.data);

            const currentFee = feeRes.data.find(f => f.semesterName.includes(selectedSemester?.name) || f.semesterName === selectedSemester?.name);
            setFeeStatus(currentFee);
        } catch (err) {
            toast.error('Failed to load registration data');
        } finally {
            setLoading(false);
        }
    }, [studentId, selectedSemesterId, studentInfo?.batchNumber, selectedSemester?.name]);

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
    const selectedSemester = semesters.find((s) => s.id === selectedSemesterId);

    const isRegistered = (offeringId) => myEnrollments.some((e) => e.offeringId === offeringId);
    const getEnrollmentId = (offeringId) => myEnrollments.find((e) => e.offeringId === offeringId)?.id;

    const isRegistrationFeePaid = feeStatus ? feeStatus.amountPaid >= feeStatus.registrationFee : true;

    if (loading && !studentInfo)
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );

    return (
        <div className="space-y-8 pb-20">
            {/* Advisor Context Header */}
            <div className="flex items-center gap-4 mb-2">
                <button
                    onClick={() => navigate('/faculty/advisees')}
                    className="p-2.5 bg-white dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.08] transition-colors text-slate-600 dark:text-white/60"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Advising Registration</h1>
                    <p className="text-sm font-medium text-slate-500 dark:text-white/40">
                        Managing enrollment for {studentInfo?.name} ({studentInfo?.registrationNo})
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                    <Card className="bg-[#09101F] dark:bg-[#0B1225] border-white/10 text-white overflow-hidden relative !p-8">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(16,185,129,0.22),transparent_30%),radial-gradient(circle_at_88%_78%,rgba(79,70,229,0.18),transparent_35%)]" />
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                            <div>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <div className="inline-flex items-center px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                                        <GraduationCap size={12} className="mr-2" /> Current Semester: {selectedSemester?.name || 'Choose Semester'}
                                    </div>
                                    <div
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                            studentInfo?.isRegistrationCleared
                                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/20'
                                                : 'bg-red-500/20 text-red-300 border-red-500/20'
                                        }`}
                                    >
                                        {studentInfo?.isRegistrationCleared ? (
                                            <ShieldCheck size={12} className="mr-2" />
                                        ) : (
                                            <ShieldAlert size={12} className="mr-2" />
                                        )}
                                        {studentInfo?.isRegistrationCleared ? 'Cleared' : 'Dues Pending'}
                                    </div>
                                    <div className="inline-flex items-center px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                                        <Users size={12} className="mr-2" /> Section: {studentInfo?.sectionName || 'Not Assigned'}
                                    </div>
                                </div>
                                <h2 className="text-3xl font-black tracking-tight">{studentInfo?.name}</h2>
                                <p className="text-white/50 mt-1 font-medium text-sm">{studentInfo?.programName}</p>
                            </div>

                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">Assigned Credits</p>
                                <div className="flex items-baseline justify-end gap-2">
                                    <span className="text-5xl font-black leading-none">{totalCredits.toFixed(1)}</span>
                                    <span className="text-xl font-bold text-white/30">/ 18.0</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(totalCredits / 18) * 100}%` }}
                                className={`h-full ${totalCredits > 18 ? 'bg-red-500' : 'bg-gradient-to-r from-[#007A55] to-[#00956A]'}`}
                            />
                        </div>

                        {feeStatus && (
                            <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div>
                                    <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-1">Registration Fee</p>
                                    <p className="text-sm font-bold">{feeStatus.registrationFee?.toLocaleString()} BDT</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-1">Credit Fees</p>
                                    <p className="text-sm font-bold">{feeStatus.creditFee?.toLocaleString()} BDT</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-1">Total Paid</p>
                                    <p className="text-sm font-bold text-emerald-400">{feeStatus.amountPaid?.toLocaleString()} BDT</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-1">Total Due</p>
                                    <p className="text-sm font-bold text-amber-400">{(feeStatus.amountDue - feeStatus.amountPaid)?.toLocaleString()} BDT</p>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>

                <Card title="Advising Info" icon={CheckCircle2}>
                    <div className="space-y-5">
                        {(isAdmin || isRegistrar) && (
                            <div className="mb-2">
                                <Button
                                    variant={studentInfo?.isRegistrationCleared ? 'danger' : 'primary'}
                                    onClick={handleToggleClearance}
                                    isLoading={actionLoading}
                                    className="w-full text-xs flex items-center justify-center gap-2"
                                >
                                    <CreditCard size={14} />
                                    <span>{studentInfo?.isRegistrationCleared ? 'Block Registration' : 'Clear Dues Manually'}</span>
                                </Button>
                            </div>
                        )}

                        <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#007A55] dark:text-emerald-300 mb-1">Status</p>
                            <p className="text-sm font-bold text-slate-700 dark:text-white/80 uppercase">Registered Advisor</p>
                        </div>

                        <div className="space-y-3 pt-1">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 ml-1">Assign Student Section</label>
                                <select
                                    value={selectedSectionId}
                                    onChange={(e) => handleSectionChange(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl text-sm font-bold text-indigo-600 dark:text-indigo-300 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                >
                                    <option value="">Choose Section</option>
                                    {batchSections.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            Section {s.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <Button onClick={handleBulkRegister} isLoading={actionLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 border-none">
                                Register All Available
                            </Button>
                        </div>

                        <div className="h-px bg-slate-100 dark:bg-white/[0.06] my-1" />

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 ml-1">Change Semester</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <select
                                    value={selectedSemesterId}
                                    onChange={(e) => setSelectedSemesterId(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold focus:border-[#007A55] focus:ring-4 focus:ring-[#007A55]/10 outline-none appearance-none dark:text-white"
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
                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 p-4 rounded-2xl flex items-center gap-4 text-amber-800 dark:text-amber-400">
                    <AlertCircle size={20} />
                    <p className="text-sm font-bold">Registration Locked: Student has not paid the mandatory registration fee ({feeStatus.registrationFee?.toLocaleString()} BDT) for this semester.</p>
                </div>
            )}

            {/* Main Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                <div className="xl:col-span-3 space-y-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center px-1">
                            <BookOpen size={20} className="mr-3 text-[#007A55]" /> Available Offerings
                        </h2>
                        <div className="flex gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-72 group">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#007A55] transition" size={16} />
                                <input
                                    placeholder="Search courses..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0B1225] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium focus:border-[#007A55] focus:ring-4 focus:ring-[#007A55]/10 outline-none dark:text-white transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                        {filteredOfferings.map((o) => {
                            const registered = isRegistered(o.id);
                            const isFull = o.enrolledCount >= o.seatLimit;
                            return (
                                <Card
                                    key={o.id}
                                    className={`relative transition-all ${registered ? 'border-[#007A55] bg-emerald-50/30 dark:bg-emerald-500/5 shadow-md shadow-emerald-700/10' : 'hover:border-slate-300 dark:hover:border-white/15'}`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                    <span className="px-2.5 py-1 bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 rounded-lg text-[10px] font-bold font-mono text-slate-600 dark:text-white/50">
                      {o.courseCode}
                    </span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#007A55]">{o.creditHours} Credits</span>
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">{o.courseTitle}</h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#007A55] mb-4">Sec {o.section}</p>

                                    <div className="space-y-2 mb-5">
                                        <div className="flex items-center text-[11px] font-medium text-slate-500 dark:text-white/40">
                                            <UserSquare2 size={12} className="mr-2 shrink-0" /> {o.facultyName}
                                        </div>
                                        <div className="space-y-1.5 mt-3">
                                            {o.schedules?.map((slot, sIdx) => (
                                                <div
                                                    key={sIdx}
                                                    className="flex flex-col bg-slate-50 dark:bg-white/[0.04] p-2 rounded-xl border border-slate-100 dark:border-white/[0.06]"
                                                >
                                                    <div className="flex items-center text-[10px] font-bold text-slate-700 dark:text-white/70">
                                                        <Clock size={12} className="mr-1.5 text-[#007A55]" />
                                                        {slot.dayOfWeek} | {slot.startTime?.substring(0, 5)} - {slot.endTime?.substring(0, 5)}
                                                    </div>
                                                    <div className="flex items-center mt-1 text-[9px] text-slate-400 dark:text-white/30">
                                                        <MapPin size={10} className="mr-1.5" /> Room: {slot.roomNo || 'TBA'}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/[0.06]">
                                        <div className="flex flex-col">
                      <span className={`text-[10px] font-black uppercase tracking-wider ${isFull ? 'text-red-500' : 'text-slate-400'}`}>
                        {o.enrolledCount} / {o.seatLimit} Seats
                      </span>
                                            <div className="h-1.5 w-20 bg-slate-100 dark:bg-white/10 rounded-full mt-1.5 overflow-hidden">
                                                <div
                                                    className={`h-full transition-all ${isFull ? 'bg-red-500' : 'bg-[#007A55]'}`}
                                                    style={{ width: `${(o.enrolledCount / o.seatLimit) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            variant={registered ? 'danger' : 'primary'}
                                            size="sm"
                                            disabled={!registered && isFull}
                                            onClick={() =>
                                                setConfirmModal({
                                                    isOpen: true,
                                                    data: { ...o, enrollmentId: getEnrollmentId(o.id) },
                                                    type: registered ? 'drop' : 'register',
                                                })
                                            }
                                        >
                                            {registered ? 'Drop' : isFull ? 'Full' : 'Register'}
                                        </Button>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center px-1">
                        <CheckCircle2 className="mr-2 text-emerald-500" size={20} /> Current Selection
                    </h2>
                    <div className="space-y-3">
                        {myEnrollments.map((e) => (
                            <Card key={e.id} className="!p-4 border-l-4 border-l-[#007A55] hover:shadow-md transition-all">
                                <div className="flex justify-between items-start gap-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-black tracking-widest text-[#007A55]">
                                            {e.courseCode} (Sec {e.section})
                                        </p>
                                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">{e.courseTitle}</h4>
                                        <p className="text-[9px] font-bold uppercase tracking-tighter text-slate-400 mt-1">{e.creditHours} Credits</p>
                                    </div>
                                    <button
                                        onClick={() => setConfirmModal({ isOpen: true, data: { ...e, enrollmentId: e.id }, type: 'drop' })}
                                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </Card>
                        ))}
                        {myEnrollments.length === 0 && (
                            <div className="py-16 text-center bg-slate-50 dark:bg-white/[0.03] rounded-[20px] border-2 border-dashed border-slate-200 dark:border-white/10">
                                <Info className="mx-auto text-slate-300 dark:text-white/10 mb-3" size={28} />
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-white/20 italic">Empty List</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Modal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, data: null, type: '' })}
                title={confirmModal.type === 'register' ? 'Confirm Registration' : 'Confirm Drop'}
                size="sm"
            >
                <div className="text-center space-y-4 py-2">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 mb-1">Are you sure?</p>
                        <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white leading-tight px-4">
                            {confirmModal.data?.courseTitle}
                        </h3>
                        <div className="flex items-center justify-center gap-3 mt-2 text-xs font-bold text-slate-500 dark:text-white/40">
                            <span>Sec {confirmModal.data?.section}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span>{confirmModal.data?.courseCode}</span>
                        </div>
                    </div>

                    {confirmModal.type === 'register' && (
                        <div className="px-4 space-y-2 text-left pt-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 ml-1">Registration Type</label>
                            <div className="grid grid-cols-2 gap-3">
                                {['REGULAR', 'RETAKE'].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setEnrollType(type)}
                                        className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                                            enrollType === type
                                                ? 'bg-[#007A55] text-white border-[#007A55] shadow-lg shadow-emerald-700/20'
                                                : 'bg-slate-50 dark:bg-white/[0.04] text-slate-400 border-slate-100 dark:border-white/10 hover:border-[#007A55]/30'
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-2 pt-5 px-4">
                        <Button
                            variant={confirmModal.type === 'register' ? 'primary' : 'danger'}
                            className="w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest"
                            isLoading={actionLoading}
                            onClick={confirmModal.type === 'register' ? handleRegister : handleDrop}
                        >
                            Confirm {confirmModal.type}
                        </Button>
                        <Button
                            variant="secondary"
                            className="w-full py-3 rounded-2xl text-xs font-bold bg-transparent border-none"
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
