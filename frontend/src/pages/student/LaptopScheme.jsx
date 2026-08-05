import { useState, useEffect } from 'react';
import { Laptop, ShieldCheck, AlertCircle, Info } from 'lucide-react';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { getMyProfile } from '../../api/profileApi';
import { motion } from 'framer-motion';

const LaptopScheme = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getMyProfile();
                setProfile(res.data.student);
            } catch (err) {
                console.error('Failed to fetch profile', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;

    const currentSemester = profile?.currentSemester || 0;
    const hasReceived = profile?.hasReceivedLaptop;
    const isEligible = currentSemester >= 7;

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-20 pt-4">
            {/* Main Status Block */}
            <div className="bg-white dark:bg-gray-800/50 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200/80 dark:border-white/10 overflow-hidden min-h-[260px] sm:min-h-[320px] flex flex-col items-center justify-center p-6 sm:p-12">
                {!isEligible ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3 sm:space-y-4 flex flex-col items-center text-center"
                    >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-slate-400 dark:text-gray-500 shadow-sm border border-slate-200/60 dark:border-gray-700">
                            <Laptop size={32} className="sm:w-10 sm:h-10" />
                        </div>
                        <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-[#2D2A4F] dark:text-white max-w-lg tracking-tight">
                            You are not yet eligible for Laptop.
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium max-w-md">
                            Minimum 6 completed semesters are required to apply or claim your laptop.
                        </p>
                    </motion.div>
                ) : hasReceived ? (
                    <div className="space-y-3 sm:space-y-5 flex flex-col items-center text-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-100 dark:border-emerald-900/40">
                            <ShieldCheck size={32} className="sm:w-10 sm:h-10" />
                        </div>
                        <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-[#2D2A4F] dark:text-white tracking-tight">
                            Laptop Received
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium max-w-md">
                            Our records show that you have already received your free university laptop.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3 sm:space-y-5 flex flex-col items-center text-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-100 dark:border-emerald-900/40 animate-bounce">
                            <Laptop size={32} className="sm:w-10 sm:h-10" />
                        </div>
                        <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
                            Congratulations! You are Eligible.
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium max-w-md">
                            You have successfully completed 6 semesters. Please contact the Registrar Office with your ID card to claim your laptop.
                        </p>
                    </div>
                )}
            </div>

            {/* Informational Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <Card className="bg-blue-50/60 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 shadow-sm rounded-2xl sm:rounded-3xl !p-5 sm:!p-6">
                    <div className="flex items-start space-x-3.5 sm:space-x-4">
                        <div className="p-2.5 sm:p-3 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl text-blue-600 dark:text-blue-400 shrink-0 shadow-sm border border-blue-100/50 dark:border-gray-700">
                            <Info size={20} className="sm:w-6 sm:h-6" />
                        </div>
                        <div>
                            <h4 className="text-xs sm:text-sm font-black text-blue-900 dark:text-blue-200 uppercase tracking-tight">Policy Information</h4>
                            <p className="text-xs text-blue-700/70 dark:text-blue-400/80 font-medium mt-1 leading-relaxed">
                                Free laptops are provided to all students who complete 6 semesters (minimum 90 credits) with a satisfactory CGPA and no pending dues.
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="bg-amber-50/60 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 shadow-sm rounded-2xl sm:rounded-3xl !p-5 sm:!p-6">
                    <div className="flex items-start space-x-3.5 sm:space-x-4">
                        <div className="p-2.5 sm:p-3 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl text-amber-600 dark:text-amber-400 shrink-0 shadow-sm border border-amber-100/50 dark:border-gray-700">
                            <AlertCircle size={20} className="sm:w-6 sm:h-6" />
                        </div>
                        <div>
                            <h4 className="text-xs sm:text-sm font-black text-amber-900 dark:text-amber-200 uppercase tracking-tight">Next Steps</h4>
                            <p className="text-xs text-amber-700/70 dark:text-amber-400/80 font-medium mt-1 leading-relaxed">
                                Once eligible, your status will be verified by the Registrar. Distribution usually happens during the first month of the 7th semester.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default LaptopScheme;