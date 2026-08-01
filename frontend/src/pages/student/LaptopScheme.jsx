import { useState, useEffect } from 'react';
import { Laptop, ShieldCheck, AlertCircle, Info, ArrowRight } from 'lucide-react';
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
        <div className="max-w-6xl mx-auto space-y-10 pb-12">
            <div>
                <h1 className="text-2xl font-black text-[#2D2A4F] dark:text-white">Laptop</h1>
            </div>

            {/* Main Status Block */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden min-h-[300px] flex flex-col items-center justify-center p-12">
                {!isEligible ? (
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-4xl font-bold text-[#2D2A4F] dark:text-white text-center"
                    >
                        You are not yet eligible for Laptop.
                    </motion.h2>
                ) : hasReceived ? (
                    <div className="space-y-6 flex flex-col items-center">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 shadow-lg shadow-green-500/10">
                            <ShieldCheck size={40} />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#2D2A4F] dark:text-white text-center">
                            Laptop Received
                        </h2>
                        <p className="text-gray-500 font-medium max-w-md text-center">
                            Our records show that you have already received your free university laptop.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6 flex flex-col items-center">
                        <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 shadow-lg shadow-primary-500/10 animate-bounce">
                            <Laptop size={40} />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-green-600 text-center">
                            Congratulations! You are Eligible.
                        </h2>
                        <p className="text-gray-500 font-medium max-w-md text-center">
                            You have successfully completed 6 semesters. Please contact the Registrar Office with your ID card to claim your laptop.
                        </p>
                    </div>
                )}
            </div>

            {/* Informational Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20">
                    <div className="flex items-start space-x-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600">
                            <Info size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-blue-900 dark:text-blue-200 uppercase tracking-tight">Policy Information</h4>
                            <p className="text-xs text-blue-700/70 dark:text-blue-400 font-medium mt-1 leading-relaxed">
                                Free laptops are provided to all students who complete 6 semesters (minimum 90 credits) with a satisfactory CGPA and no pending dues.
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/20">
                    <div className="flex items-start space-x-4">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600">
                            <AlertCircle size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-amber-900 dark:text-amber-200 uppercase tracking-tight">Next Steps</h4>
                            <p className="text-xs text-amber-700/70 dark:text-amber-400 font-medium mt-1 leading-relaxed">
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
