import React, { useState } from 'react';
import { ArrowLeft, Send, AlertCircle, Award, Calendar, DollarSign, FileText } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import useFetch from '../../hooks/useFetch';
import Loader from '../../components/common/Loader';
import { useNavigate, useParams } from 'react-router-dom';
import { getCircularById, applyForAid } from '../../api/financialAidApi';
import toast from 'react-hot-toast';

const FinancialAidApplication = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: circular, loading } = useFetch(`/financial-aid/circulars/${id}`);

    const [formData, setFormData] = useState({
        circularId: id,
        justification: '',
        monthlyIncome: ''
    });
    const [submitting, setSubmitting] = useState(false);

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.justification) {
            toast.error('Please provide a justification');
            return;
        }

        try {
            setSubmitting(true);
            await applyForAid(formData);
            toast.success('Application submitted successfully!');
            navigate('/student/scholarship');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit application');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="rounded-xl">
                    <ArrowLeft size={20} />
                </Button>
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white">Aid Application</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Submit Your Request</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card title="Application Form" icon={FileText}>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
                                    Justification / Personal Statement
                                </label>
                                <textarea
                                    className="w-full min-h-[250px] p-5 rounded-[2rem] bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 focus:ring-2 focus:ring-primary-500 outline-none text-sm text-gray-900 dark:text-white font-medium resize-none leading-relaxed"
                                    placeholder="Explain why you need this financial aid, your academic achievements, and any financial hardships..."
                                    value={formData.justification}
                                    onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                                />
                                <p className="text-[10px] text-gray-400 font-bold ml-1 italic">
                                    Min 200 words recommended for better consideration.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Family Monthly Income (BDT)"
                                    type="number"
                                    placeholder="e.g. 25000"
                                    icon={DollarSign}
                                    value={formData.monthlyIncome}
                                    onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                                />
                            </div>

                            <div className="pt-4 flex flex-col md:flex-row gap-4">
                                <Button
                                    type="submit"
                                    className="flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary-500/20"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Submitting...' : 'Submit Application'}
                                    {!submitting && <Send size={18} className="ml-2" />}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="px-8 rounded-2xl font-black text-xs uppercase tracking-widest"
                                    onClick={() => navigate(-1)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-primary-500 text-white border-none">
                        <h3 className="text-base font-black uppercase tracking-widest">Circular Summary</h3>
                        <div className="mt-6 space-y-6">
                            <div className="flex items-start space-x-3">
                                <Award className="shrink-0 text-primary-200" size={20} />
                                <div>
                                    <p className="text-[10px] font-black text-primary-200 uppercase tracking-widest">Title</p>
                                    <p className="text-sm font-bold mt-0.5">{circular?.title}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Calendar className="shrink-0 text-primary-200" size={20} />
                                <div>
                                    <p className="text-[10px] font-black text-primary-200 uppercase tracking-widest">Deadline</p>
                                    <p className="text-sm font-bold mt-0.5">{new Date(circular?.deadline).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/30">
                        <div className="flex items-start space-x-3">
                            <AlertCircle className="text-amber-600 shrink-0" size={20} />
                            <div>
                                <h4 className="text-sm font-black text-amber-900 dark:text-amber-400">Important Note</h4>
                                <p className="text-xs text-amber-800/70 dark:text-amber-500/70 mt-2 font-medium leading-relaxed">
                                    Providing false information will lead to immediate rejection and disciplinary action.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default FinancialAidApplication;
