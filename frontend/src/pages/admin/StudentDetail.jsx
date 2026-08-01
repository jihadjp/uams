import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ChevronLeft,
    Mail,
    Phone,
    Users,
    GraduationCap,
    ShieldCheck,
    Clock,
    FileText,
    AlertCircle,
    RefreshCw, Laptop,  
    UserSquare2,
    ShieldAlert
} from 'lucide-react';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import useFetch from '../../hooks/useFetch';
import { formatDate } from '../../utils/formatDate';
import useAuth from '../../hooks/useAuth';
import { updateClearance } from '../../api/studentApi';
import toast from 'react-hot-toast';
import FeeManagementModal from './FeeManagementModal';

const StudentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAdmin, isRegistrar } = useAuth();
    const { data: student, loading, error, refetch } = useFetch(`/students/${id}`);
    const [clearanceLoading, setClearanceLoading] = useState(false);
    const [laptopLoading, setLaptopLoading] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);

    // Safe check for boolean property regardless of Jackson naming
    const isCleared = Boolean(student?.isRegistrationCleared ?? student?.registrationCleared);
    const hasLaptop = student?.hasReceivedLaptop;

    const handleToggleClearance = async () => {
        // If student is currently cleared, open block confirmation modal
        if (isCleared) {
            setIsConfirmOpen(true);
            return;
        }

        // Otherwise clear dues immediately
        await executeClearanceToggle(true);
    };

    const executeClearanceToggle = async (status) => {
        setClearanceLoading(true);
        try {
            await updateClearance(id, status);
            toast.success(status ? 'Student cleared successfully' : 'Student registration blocked');
            setIsConfirmOpen(false);
            refetch();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update clearance status');
        } finally {
            setClearanceLoading(false);
        }
    };

    const handleToggleLaptop = async () => {
        setLaptopLoading(true);
        try {
            await client.put(`/students/${id}/laptop?status=${!hasLaptop}`);
            toast.success(hasLaptop ? 'Laptop record removed' : 'Laptop distribution confirmed');
            refetch();
        } catch (err) {
            toast.error('Failed to update laptop status');
        } finally {
            setLaptopLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-6">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center shadow-lg">
                    <AlertCircle size={40} />
                </div>
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Failed to load student</h2>
                    <p className="text-gray-500 mt-1">{error}</p>
                </div>
                <div className="flex space-x-4">
                    <Button variant="secondary" onClick={() => navigate('/portal/students')}>Back to List</Button>
                    <Button onClick={() => refetch()} className="flex items-center space-x-2">
                        <RefreshCw size={18} />
                        <span>Retry</span>
                    </Button>
                </div>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-500">Student record not available.</p>
                <Button variant="secondary" className="mt-4" onClick={() => navigate('/portal/students')}>
                    Go Back
                </Button>
            </div>
        );
    }

    const getStatusBadge = (status) => {
        const s = status?.toUpperCase();
        const styles = {
            ACTIVE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            DROPPED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
            GRADUATED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            ON_LEAVE: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        };
        return styles[s] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    };

    const displayImg = student?.profileImage
        ? (student.profileImage.startsWith('http') || student.profileImage.startsWith('/api')
            ? student.profileImage
            : `/api/uploads/${student.profileImage}`)
        : null;

    return (
        <div className="space-y-8 pb-12">
            {/* Top Bar Navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <button
                    onClick={() => navigate('/portal/students')}
                    className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group w-fit"
                >
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mr-3 group-hover:scale-105 transition-transform">
                        <ChevronLeft size={20} />
                    </div>
                    <span className="font-bold text-sm">Back to Student List</span>
                </button>

                <div className="flex items-center space-x-3">
          <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${getStatusBadge(student?.status)}`}>
            {student?.status || 'N/A'}
          </span>
                </div>
            </div>

            {/* Main Profile Header Card */}
            <Card className="relative overflow-hidden" animate={false}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />

                <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-8 relative z-10">
                    <div className="w-28 h-28 md:w-32 md:h-32 bg-primary-100 dark:bg-primary-900/30 rounded-3xl flex items-center justify-center text-primary-600 border-4 border-white dark:border-gray-800 shadow-xl overflow-hidden shrink-0">
                        {displayImg ? (
                            <img src={displayImg} alt={student?.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-4xl md:text-5xl font-black">{student?.name?.charAt(0) || 'S'}</span>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight truncate">
                                {student?.name || 'Loading...'}
                            </h1>
                            {isCleared && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="flex items-center space-x-1.5 px-3 py-1 bg-green-500 text-white rounded-full shadow-lg shadow-green-500/20 shrink-0"
                                    title="Verified Academic Clearance"
                                >
                                    <ShieldCheck size={16} strokeWidth={3} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Verified / Cleared</span>
                                </motion.div>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-y-2 gap-x-6 mt-4">
                            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                                <Mail size={16} className="mr-2 shrink-0" />
                                <span className="font-medium truncate">{student?.email || 'N/A'}</span>
                            </div>
                            <div className="flex items-center text-gray-900 dark:text-white font-bold bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                                <span className="text-[10px] uppercase text-gray-400 mr-2 font-black">Reg No:</span>
                                <span className="font-mono text-sm">{student?.registrationNo || 'PENDING'}</span>
                            </div>
                            <div className="flex items-center text-gray-900 dark:text-white font-bold bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg border border-gray-200/50 dark:border-gray-700/50">
                                <span className="text-[10px] uppercase text-gray-400 mr-2 font-black">Student ID:</span>
                                <span className="font-mono text-sm">{student?.studentId || 'PENDING'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Academic & Personal Details */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card title="Academic Information" icon={GraduationCap}>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-1 border-b border-gray-50 dark:border-gray-800">
                                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Program</span>
                                    <span className="font-bold text-gray-900 dark:text-white text-sm">{student?.programName || 'N/A'}</span>
                                </div>
                                <div className="flex items-center justify-between py-1 border-b border-gray-50 dark:border-gray-800">
                                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Current Semester</span>
                                    <span className="font-bold text-gray-900 dark:text-white text-sm">{student?.currentSemester || 1}</span>
                                </div>
                                <div className="flex items-center justify-between py-1 border-b border-gray-50 dark:border-gray-800">
                                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Batch</span>
                                    <span className="font-bold text-gray-900 dark:text-white text-sm">{student?.batch || 'N/A'}</span>
                                </div>
                                <div className="pt-3 flex items-center justify-between">
                                    <span className="text-sm font-bold text-primary-600 dark:text-primary-400">Current CGPA</span>
                                    <span className="text-2xl font-black text-gray-900 dark:text-white">{student?.cgpa || '0.00'}</span>
                                </div>
                            </div>
                        </Card>

                        <Card title="Guardian Details" icon={ShieldCheck}>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Guardian Name</p>
                                    <div className="flex items-center justify-between">
                                        <p className="font-bold text-gray-900 dark:text-white text-sm">{student?.guardianName || 'N/A'}</p>
                                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                      {student?.guardianRelation === 'OTHER' ? student?.guardianOtherRelation : student?.guardianRelation || 'N/A'}
                    </span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Contact Phone</p>
                                    <div className="flex items-center text-primary-600 dark:text-primary-400 font-bold text-sm">
                                        <Phone size={14} className="mr-2" />
                                        {student?.guardianPhone || 'N/A'}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Assigned Advisor</p>
                                    <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                                        <UserSquare2 size={14} className="mr-2" />
                                        {student?.advisorName || 'NOT ASSIGNED'}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Admitted At</p>
                                    <p className="font-bold text-gray-900 dark:text-white text-sm">{formatDate(student?.admittedAt)}</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <Card title="Personal Details" icon={Users}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Gender</p>
                                <p className="font-bold text-gray-900 dark:text-white text-sm uppercase">{student?.gender || 'Not Specified'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Blood Group</p>
                                <p className="font-bold text-red-600 dark:text-red-400 text-sm">{student?.bloodGroup || 'Not Specified'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Contact No</p>
                                <p className="font-bold text-gray-900 dark:text-white text-sm">{student?.phone || 'Not Provided'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Date of Birth</p>
                                <p className="font-bold text-gray-900 dark:text-white text-sm">{student?.dateOfBirth ? formatDate(student.dateOfBirth) : 'Not Provided'}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Attendance & Clearance */}
                <div className="space-y-8">
                    <Card title="Attendance Summary" icon={Clock}>
                        <div className="flex flex-col items-center py-4">
                            <div className="relative w-32 h-32 mb-4">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        className="text-gray-100 dark:text-gray-800"
                                        strokeWidth="10"
                                        stroke="currentColor"
                                        fill="transparent"
                                        r="54"
                                        cx="64"
                                        cy="64"
                                    />
                                    <motion.circle
                                        initial={{ strokeDasharray: "0 339.29" }}
                                        animate={{ strokeDasharray: "288.4 339.29" }}
                                        transition={{ duration: 1.5 }}
                                        className="text-emerald-500"
                                        strokeWidth="10"
                                        strokeLinecap="round"
                                        stroke="currentColor"
                                        fill="transparent"
                                        r="54"
                                        cx="64"
                                        cy="64"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-black text-gray-900 dark:text-white">85%</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium italic">"Above average performance"</p>
                        </div>
                    </Card>

                    <Card title="Payment & Clearance Status" icon={FileText}>
                        {isCleared ? (
                            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-start space-x-3">
                                <ShieldCheck size={20} className="text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-emerald-900 dark:text-emerald-300 leading-tight">Academic Dues Cleared</p>
                                    <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1 font-medium">Student is eligible for course registration.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-start space-x-3">
                                <AlertCircle size={20} className="text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-amber-900 dark:text-amber-300 leading-tight">Registration Blocked / Dues Pending</p>
                                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-1 font-medium">Student cannot register courses until cleared.</p>
                                </div>
                            </div>
                        )}

                        <Button
                            variant="secondary"
                            className="w-full mt-6 text-sm py-2"
                            onClick={() => setIsFeeModalOpen(true)}
                        >
                            View Fee Details
                        </Button>

                        {(isAdmin || isRegistrar) && (
                            <Button
                                variant={isCleared ? "danger" : "primary"}
                                className="w-full mt-3 text-xs font-black uppercase tracking-widest py-3 rounded-xl shadow-md"
                                onClick={handleToggleClearance}
                                isLoading={clearanceLoading}
                            >
                                {isCleared ? 'Block Registration' : 'Clear Dues Manually'}
                            </Button>
                        )}
                    </Card>

                    <Card title="Laptop Scheme Status" icon={Laptop}>
                        <div className="space-y-4">
                            <div className={`p-4 rounded-2xl flex items-start space-x-3 border ${hasLaptop ? 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/20' : 'bg-gray-50 dark:bg-gray-800/40 border-gray-100 dark:border-gray-700'}`}>
                                {hasLaptop ? <ShieldCheck size={20} className="text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" /> : <Laptop size={20} className="text-gray-400 mt-0.5 shrink-0" />}
                                <div>
                                    <p className={`text-sm font-bold leading-tight ${hasLaptop ? 'text-indigo-900 dark:text-indigo-300' : 'text-gray-500'}`}>
                                        {hasLaptop ? 'Laptop Received' : 'Not Distributed'}
                                    </p>
                                    <p className="text-[10px] text-gray-500 mt-1 font-medium">
                                        {student?.currentSemester >= 7 ? 'Eligible for Laptop (6+ Sems)' : 'Ineligible (< 6 Sems complete)'}
                                    </p>
                                </div>
                            </div>

                            {(isAdmin || isRegistrar) && (
                                <Button
                                    variant={hasLaptop ? "danger" : "primary"}
                                    className="w-full text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl border-none"
                                    onClick={handleToggleLaptop}
                                    isLoading={laptopLoading}
                                >
                                    {hasLaptop ? 'Revoke Laptop Record' : 'Confirm Laptop Receipt'}
                                </Button>
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Block Registration Confirmation Modal */}
            <Modal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                title="Confirm Block Registration"
                size="sm"
            >
                <div className="text-center space-y-4 py-4">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-red-500/10">
                        <ShieldAlert size={32} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">Block Registration?</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium px-2">
                            Are you sure you want to block registration access for <strong>{student?.name}</strong>? They will not be able to add or drop courses.
                        </p>
                    </div>
                    <div className="flex flex-col space-y-2 pt-4 px-2">
                        <Button
                            variant="danger"
                            className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest"
                            isLoading={clearanceLoading}
                            onClick={() => executeClearanceToggle(false)}
                        >
                            Confirm Block
                        </Button>
                        <Button
                            variant="secondary"
                            className="w-full py-2.5 rounded-xl text-xs font-bold"
                            onClick={() => setIsConfirmOpen(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </Modal>

            <FeeManagementModal
                isOpen={isFeeModalOpen}
                onClose={() => setIsFeeModalOpen(false)}
                student={student}
            />
        </div>
    );
};

export default StudentDetail;