import React from 'react';
import { Award, Calendar, Info, ArrowLeft, ExternalLink } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import useFetch from '../../hooks/useFetch';
import Loader from '../../components/common/Loader';
import { useNavigate } from 'react-router-dom';
import { getActiveCirculars } from '../../api/financialAidApi';

const FinancialAidCircular = () => {
    const navigate = useNavigate();
    const { data: circulars, loading } = useFetch('/financial-aid/circulars/active');

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="rounded-xl">
                    <ArrowLeft size={20} />
                </Button>
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white">Active Circulars</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Explore Available Opportunities</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {circulars?.map((circular) => (
                    <Card key={circular.id} className="group relative overflow-hidden">
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="lg:w-2/3 space-y-6">
                                <div className="flex items-center space-x-3">
                                    <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl text-indigo-600">
                                        <Award size={28} />
                                    </div>
                                    <h2 className="text-xl font-black text-gray-900 dark:text-white">{circular.title}</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                                        <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 flex items-center">
                                            <Info size={12} className="mr-1.5" /> Eligibility Criteria
                                        </h4>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                                            {circular.eligibilityCriteria || 'Not specified'}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                                        <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 flex items-center">
                                            <Award size={12} className="mr-1.5" /> Benefit Details
                                        </h4>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                                            {circular.benefitDetails || 'Not specified'}
                                        </p>
                                    </div>
                                </div>

                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Description</h4>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                                        {circular.description}
                                    </p>
                                </div>
                            </div>

                            <div className="lg:w-1/3 flex flex-col justify-between p-6 bg-primary-50 dark:bg-primary-950/20 rounded-3xl border border-primary-100 dark:border-primary-900/30">
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-primary-600 dark:text-primary-400 tracking-widest">Application Deadline</p>
                                        <div className="flex items-center mt-2 text-gray-900 dark:text-white">
                                            <Calendar size={20} className="mr-3 text-primary-500" />
                                            <span className="text-xl font-black">{new Date(circular.deadline).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                        </div>
                                        <p className="text-[10px] text-primary-600/70 dark:text-primary-400/70 mt-1 font-bold italic">
                                            Apply before 11:59 PM
                                        </p>
                                    </div>

                                    <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
                                        <p className="text-xs text-gray-500 font-bold leading-relaxed">
                                            Ensure you meet all criteria and provide a valid justification for your application.
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    className="w-full mt-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary-500/20"
                                    onClick={() => navigate(`/student/scholarship/apply/${circular.id}`)}
                                >
                                    Start Application <ExternalLink size={16} className="ml-2" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}

                {circulars?.length === 0 && (
                    <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
                        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-full text-gray-400">
                            <Info size={48} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">No Circulars Found</h3>
                            <p className="text-gray-500 font-medium italic mt-1">There are no active financial aid circulars at this moment.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FinancialAidCircular;
