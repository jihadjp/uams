import { useState, useEffect } from 'react';
import { UserSquare2, Phone, Mail, Info, Copy, Check } from 'lucide-react';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { getMyProfile } from '../../api/profileApi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const MentorMeeting = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copiedField, setCopiedField] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getMyProfile();
                const studentData = res.data?.student || res.data;
                setProfile(studentData);
            } catch (err) {
                console.error('Failed to fetch profile', err);
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
        toast.success(`${fieldName} copied to clipboard`);
        setTimeout(() => setCopiedField(null), 2000);
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    const mentor = profile ? {
        name: profile.advisorName || profile.advisor?.name,
        phone: profile.advisorPhone || profile.advisor?.phone,
        email: profile.advisorEmail || profile.advisor?.email
    } : null;

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12 px-2 sm:px-4">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Mentor Meeting</h1>
                <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
                    Student Support & Guidance
                </p>
            </div>

            {/* Main Details Card */}
            <Card className="!p-0 overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm rounded-2xl bg-white dark:bg-gray-800">
                <div className="p-6 sm:p-8 space-y-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white pb-4 border-b border-gray-100 dark:border-gray-700/80">
                        Mentor Detail
                    </h2>

                    {mentor?.name ? (
                        <div className="space-y-1">
                            {/* Name Row */}
                            <div className="grid grid-cols-12 py-3.5 px-2 sm:px-4 border-b border-gray-100 dark:border-gray-700/60 items-center gap-2 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 rounded-xl transition-colors">
                                <div className="col-span-12 sm:col-span-3 lg:col-span-2 text-sm font-bold text-gray-900 dark:text-gray-200">
                                    Name
                                </div>
                                <div className="col-span-12 sm:col-span-9 lg:col-span-10 text-sm font-medium text-gray-800 dark:text-gray-200">
                                    {mentor.name}
                                </div>
                            </div>

                            {/* Contact Info Row (Mobile No & Email) */}
                            <div className="grid grid-cols-12 py-3.5 px-2 sm:px-4 border-b border-gray-100 dark:border-gray-700/60 items-center gap-y-3 gap-x-2 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 rounded-xl transition-colors">
                                {/* Mobile No */}
                                <div className="col-span-12 sm:col-span-3 lg:col-span-2 text-sm font-bold text-gray-900 dark:text-gray-200">
                                    Mobile No
                                </div>
                                <div className="col-span-12 sm:col-span-9 lg:col-span-4 text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center space-x-2">
                                    {mentor.phone ? (
                                        <a
                                            href={`tel:${mentor.phone}`}
                                            className="hover:text-primary-600 dark:hover:text-primary-400 hover:underline transition-colors"
                                        >
                                            {mentor.phone}
                                        </a>
                                    ) : (
                                        <span className="text-gray-400">N/A</span>
                                    )}
                                    {mentor.phone && (
                                        <button
                                            onClick={() => copyToClipboard(mentor.phone, 'Mobile Number')}
                                            className="p-1 text-gray-400 hover:text-primary-600 rounded transition-colors"
                                            title="Copy Mobile No"
                                        >
                                            {copiedField === 'Mobile Number' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                        </button>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="col-span-12 sm:col-span-3 lg:col-span-2 text-sm font-bold text-gray-900 dark:text-gray-200 sm:border-l sm:border-gray-100 dark:sm:border-gray-700/60 sm:pl-4">
                                    Email
                                </div>
                                <div className="col-span-12 sm:col-span-9 lg:col-span-4 text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center space-x-2 truncate">
                                    {mentor.email ? (
                                        <a
                                            href={`mailto:${mentor.email}`}
                                            className="hover:text-primary-600 dark:hover:text-primary-400 hover:underline transition-colors truncate"
                                        >
                                            {mentor.email}
                                        </a>
                                    ) : (
                                        <span className="text-gray-400">N/A</span>
                                    )}
                                    {mentor.email && (
                                        <button
                                            onClick={() => copyToClipboard(mentor.email, 'Email')}
                                            className="p-1 text-gray-400 hover:text-primary-600 rounded transition-colors shrink-0"
                                            title="Copy Email"
                                        >
                                            {copiedField === 'Email' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-16 text-center flex flex-col items-center justify-center space-y-3">
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-400">
                                <UserSquare2 size={44} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">No Mentor Assigned</h3>
                                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                                    Your faculty advisor has not been assigned yet. Please contact your department office for assistance.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Bottom Guidance Card */}
            {mentor?.name && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-5 bg-indigo-50/70 dark:bg-indigo-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 flex items-start space-x-3.5"
                >
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                        <Info size={18} />
                    </div>
                    <div>
                        <h4 className="text-xs font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">Need Academic Guidance?</h4>
                        <p className="text-xs text-indigo-700/80 dark:text-indigo-400/90 font-medium mt-1 leading-relaxed">
                            You can reach out to your mentor via email or mobile to schedule a counseling session or discuss your academic progression.
                        </p>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default MentorMeeting;