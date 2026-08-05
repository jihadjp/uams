import { useState, useEffect } from 'react';
import {
    UserSquare2,
    Phone,
    Mail,
    Info,
    Copy,
    Check,
    ChevronDown,
    ExternalLink,
    CalendarDays,
    GraduationCap,
    MessageCircle,
    Send as TelegramIcon
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import { getMyProfile } from '../../api/profileApi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const MentorMeeting = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copiedField, setCopiedField] = useState(null);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getMyProfile();
                const studentData = res.data?.student || res.data;
                setProfile(studentData);
            } catch (err) {
                console.error('Failed to fetch profile', err);
                toast.error("Failed to load mentor information");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const copyToClipboard = (text, fieldName) => {
        if (!text || text === 'N/A') return;
        navigator.clipboard.writeText(text);
        setCopiedField(fieldName);
        toast.success(`${fieldName} copied!`);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const cleanPhoneNumber = (phone) => {
        if (!phone) return '';
        let cleaned = phone.replace(/[^\d+]/g, '');
        if (cleaned.startsWith('01')) {
            cleaned = '+880' + cleaned.substring(1);
        }
        return cleaned;
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
                <Loader size="lg" />
                <p className="text-xs sm:text-sm font-bold text-slate-400 animate-pulse uppercase tracking-[0.2em]">Loading Mentor Info...</p>
            </div>
        );
    }

    const mentor = profile?.advisorId ? {
        name: profile.advisorName,
        email: profile.advisorEmail,
        phone: profile.advisorPhone,
        image: profile.advisorProfileImage,
        designation: profile.advisorDesignation || 'Faculty Member'
    } : null;

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-20 pt-4">
            {/* Top Status Badge */}
            {mentor && (
                <div className="flex justify-end">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl sm:rounded-2xl border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
                            Counseling Hour Available
                        </span>
                    </div>
                </div>
            )}

            {mentor ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Left: Mentor Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-1"
                    >
                        {/* Outer container clips the banner along rounded corners without padding */}
                        <div className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm bg-white dark:bg-[#0B1225]">

                            {/* Banner: Flush with top & side edges */}
                            <div className="w-full h-28 sm:h-32 bg-gradient-to-br from-[#007A55] via-[#00956A] to-indigo-600 relative overflow-hidden">
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                                <div className="absolute -right-4 -bottom-4 opacity-20">
                                    <GraduationCap size={100} className="text-white rotate-12" />
                                </div>
                            </div>

                            {/* Profile Image & Details: Pulled over the banner */}
                            <div className="px-6 sm:px-8 -mt-14 sm:-mt-16 relative z-10 text-center">
                                <div className="inline-block p-1.5 bg-white dark:bg-[#0B1225] rounded-2xl sm:rounded-3xl shadow-sm">
                                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 dark:bg-white/10 border-4 border-slate-50 dark:border-white/5">
                                        {mentor.image ? (
                                            <img
                                                src={mentor.image.startsWith('http') ? mentor.image : `/api/uploads/${mentor.image}`}
                                                alt={mentor.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(mentor.name) + '&background=007A55&color=fff&size=200';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
                                                <UserSquare2 size={40} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 sm:mt-6 mb-6">
                                    <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight uppercase">
                                        {mentor.name}
                                    </h2>
                                    <p className="text-[10px] sm:text-[11px] font-black text-[#007A55] dark:text-emerald-400 uppercase tracking-widest mt-2 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full inline-block border border-emerald-100 dark:border-emerald-500/20">
                                        {mentor.designation}
                                    </p>
                                </div>

                                <div className="flex gap-2 pb-6 sm:pb-8">
                                    <Button
                                        onClick={() => window.location.href = `mailto:${mentor.email}`}
                                        className="flex-1 rounded-xl sm:rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                                    >
                                        <Mail size={16} />
                                    </Button>
                                    <Button
                                        onClick={() => setIsContactModalOpen(true)}
                                        className="flex-1 rounded-xl sm:rounded-2xl bg-[#007A55] hover:bg-[#006747] text-white font-bold text-xs"
                                    >
                                        <Phone size={16} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Detailed Info & Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        <Card title="Mentor Information" icon={Info} className="rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm !p-5 sm:!p-6">
                            <div className="grid grid-cols-1 gap-3 sm:gap-4 mt-2">
                                {/* Email Row */}
                                <div className="group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 bg-gray-50/60 dark:bg-white/[0.03] rounded-xl sm:rounded-2xl border border-gray-100 dark:border-white/5 transition-all hover:border-[#007A55]/30">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="p-2.5 sm:p-3 bg-white dark:bg-[#0B1225] rounded-xl shadow-sm text-[#007A55] border border-gray-100 dark:border-white/5 shrink-0">
                                            <Mail size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Office Email</p>
                                            <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80 mt-0.5 truncate">{mentor.email || 'Not Available'}</p>
                                        </div>
                                    </div>
                                    {mentor.email && (
                                        <div className="flex items-center gap-2 mt-3 sm:mt-0 pl-11 sm:pl-0">
                                            <button
                                                onClick={() => copyToClipboard(mentor.email, 'Email')}
                                                className="p-2 text-slate-400 hover:text-[#007A55] hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg sm:rounded-xl transition-all"
                                            >
                                                {copiedField === 'Email' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                                            </button>
                                            <button
                                                onClick={() => window.open(`mailto:${mentor.email}`)}
                                                className="p-2 text-slate-400 hover:text-[#007A55] hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg sm:rounded-xl transition-all"
                                            >
                                                <ExternalLink size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Phone Row */}
                                <div className="group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 bg-gray-50/60 dark:bg-white/[0.03] rounded-xl sm:rounded-2xl border border-gray-100 dark:border-white/5 transition-all hover:border-[#007A55]/30">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="p-2.5 sm:p-3 bg-white dark:bg-[#0B1225] rounded-xl shadow-sm text-[#007A55] border border-gray-100 dark:border-white/5 shrink-0">
                                            <Phone size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</p>
                                            <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80 mt-0.5 truncate">{mentor.phone || 'Not Available'}</p>
                                        </div>
                                    </div>
                                    {mentor.phone && (
                                        <div className="flex items-center gap-2 mt-3 sm:mt-0 pl-11 sm:pl-0">
                                            <button
                                                onClick={() => copyToClipboard(mentor.phone, 'Mobile No')}
                                                className="p-2 text-slate-400 hover:text-[#007A55] hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg sm:rounded-xl transition-all"
                                            >
                                                {copiedField === 'Mobile No' ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                                            </button>
                                            <button
                                                onClick={() => setIsContactModalOpen(true)}
                                                className="p-2 text-slate-400 hover:text-[#007A55] hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg sm:rounded-xl transition-all"
                                            >
                                                <ExternalLink size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Meeting Schedule Hint */}
                        <div className="p-5 sm:p-8 bg-indigo-50/60 dark:bg-indigo-900/10 rounded-2xl sm:rounded-3xl border border-indigo-100 dark:border-indigo-900/20 relative overflow-hidden shadow-sm">
                            <div className="absolute top-0 right-0 p-6 sm:p-8 opacity-10 pointer-events-none">
                                <CalendarDays size={120} className="sm:w-36 sm:h-36" />
                            </div>
                            <div className="relative z-10">
                                <h4 className="text-base sm:text-lg font-bold text-[#2D2A4F] dark:text-indigo-200 tracking-tight flex items-center gap-2">
                                    Request Meeting
                                </h4>
                                <p className="text-indigo-700/70 dark:text-indigo-400 text-xs sm:text-sm mt-2 leading-relaxed max-w-lg font-medium">
                                    Need help with your academic plan or career guidance? Send a request to your mentor to schedule a personal counseling session.
                                </p>
                                <div className="mt-5 sm:mt-6">
                                    <Button className="rounded-xl sm:rounded-2xl px-6 sm:px-8 py-2.5 bg-[#2D2A4F] hover:bg-[#1E1C38] text-white font-bold text-xs sm:text-sm border-none shadow-sm">
                                        Check Availability
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <Card className="py-16 sm:py-20 text-center rounded-2xl sm:rounded-3xl border border-dashed border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] shadow-sm">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white dark:bg-[#0B1225] rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-white/10 border border-slate-100 dark:border-white/5">
                            <UserSquare2 size={36} />
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">No Mentor Assigned</h3>
                        <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-white/40 mt-2 max-w-sm mx-auto leading-relaxed">
                            Your faculty advisor has not been assigned to your profile yet. Please visit your department office to resolve this.
                        </p>
                        <div className="mt-6">
                            <Button variant="outline" onClick={() => window.location.reload()} className="rounded-xl px-6 text-xs sm:text-sm">
                                Refresh Status
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            )}

            {/* Contact Method Modal */}
            <Modal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                title="Contact Mentor"
                size="sm"
            >
                <div className="p-1 space-y-4">
                    <p className="text-xs font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest text-center mb-4">Choose communication method</p>

                    <div className="grid grid-cols-1 gap-2.5">
                        {/* WhatsApp */}
                        <button
                            onClick={() => window.open(`https://wa.me/${cleanPhoneNumber(mentor?.phone).replace('+', '')}`, '_blank')}
                            className="flex items-center justify-between p-3.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl sm:rounded-2xl group transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-white dark:bg-[#0B1225] rounded-xl shadow-sm text-emerald-600">
                                    <MessageCircle size={18} />
                                </div>
                                <div className="text-left">
                                    <p className="text-xs sm:text-sm font-black text-emerald-900 dark:text-emerald-400">WhatsApp</p>
                                    <p className="text-[10px] font-bold text-emerald-700/60 dark:text-emerald-400/40">Chat or Audio Call</p>
                                </div>
                            </div>
                            <ChevronDown size={16} className="text-emerald-300 -rotate-90" />
                        </button>

                        {/* Telegram */}
                        <button
                            onClick={() => window.open(`https://t.me/${cleanPhoneNumber(mentor?.phone)}`, '_blank')}
                            className="flex items-center justify-between p-3.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl sm:rounded-2xl group transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-white dark:bg-[#0B1225] rounded-xl shadow-sm text-blue-600">
                                    <TelegramIcon size={18} />
                                </div>
                                <div className="text-left">
                                    <p className="text-xs sm:text-sm font-black text-blue-900 dark:text-blue-400">Telegram</p>
                                    <p className="text-[10px] font-bold text-blue-700/60 dark:text-blue-400/40">Secure Messaging</p>
                                </div>
                            </div>
                            <ChevronDown size={16} className="text-blue-300 -rotate-90" />
                        </button>

                        {/* Direct Call */}
                        <button
                            onClick={() => window.location.href = `tel:${mentor?.phone}`}
                            className="flex items-center justify-between p-3.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl sm:rounded-2xl group transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-white dark:bg-[#0B1225] rounded-xl shadow-sm text-slate-600">
                                    <Phone size={18} />
                                </div>
                                <div className="text-left">
                                    <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">Direct Call</p>
                                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Standard Phone Call</p>
                                </div>
                            </div>
                            <ChevronDown size={16} className="text-slate-300 -rotate-90" />
                        </button>
                    </div>

                    <Button
                        variant="ghost"
                        onClick={() => setIsContactModalOpen(false)}
                        className="w-full mt-2 text-xs font-black text-slate-400 uppercase tracking-widest"
                    >
                        Close
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default MentorMeeting;