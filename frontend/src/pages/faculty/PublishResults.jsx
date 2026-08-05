import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    CheckCircle2,
    Award,
    TrendingUp,
    FileCheck
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import { getFinalResultPreview, publishFinalResults } from '../../api/examApi';
import { getCourseOfferingById } from '../../api/courseOfferingApi';
import toast from 'react-hot-toast';
import { getGradeColor } from '../../utils/gradeColor';

const PublishResults = () => {
    const { offeringId } = useParams();
    const navigate = useNavigate();
    const [offering, setOffering] = useState(null);
    const [previewData, setPreviewData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [publishing, setPublishing] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [offeringRes, previewRes] = await Promise.all([
                getCourseOfferingById(offeringId),
                getFinalResultPreview(offeringId)
            ]);
            setOffering(offeringRes.data);
            setPreviewData(previewRes.data);
        } catch (err) {
            toast.error('Failed to load result preview. Ensure all exam weights add up to 100% and marks are entered.');
        } finally {
            setLoading(false);
        }
    }, [offeringId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handlePublish = async () => {
        setPublishing(true);
        try {
            await publishFinalResults(offeringId);
            toast.success('Final results published successfully!');
            navigate('/faculty/my-courses');
        } catch (err) {
            toast.error('Failed to publish results');
        } finally {
            setPublishing(false);
            setIsConfirmOpen(false);
        }
    };

    if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-20 pt-4">
            {/* Top Action Bar (Back Button & Context) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 sm:p-2.5 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-white/10 hover:text-primary-600 transition-all text-slate-700 dark:text-white shrink-0"
                    >
                        <ChevronLeft size={20} className="sm:w-5 sm:h-5" />
                    </button>
                    <div className="min-w-0">
                        <h1 className="text-base sm:text-lg font-black text-[#2D2A4F] dark:text-white tracking-tight uppercase truncate">
                            Final Result Preview
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold truncate mt-0.5">
                            {offering?.courseTitle} • Sec {offering?.section}
                        </p>
                    </div>
                </div>

                <Button
                    onClick={() => setIsConfirmOpen(true)}
                    className="bg-[#2D2A4F] hover:bg-[#1E1C38] text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm py-2.5 px-6 border-none flex items-center justify-center space-x-2"
                >
                    <FileCheck size={16} />
                    <span>Publish Results</span>
                </Button>
            </div>

            {/* Info Banner - Border Only */}
            <div className="p-4 sm:p-5 bg-indigo-50/60 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/20 rounded-2xl sm:rounded-3xl flex items-start space-x-3.5 sm:space-x-4">
                <div className="p-2.5 bg-indigo-600 text-white rounded-xl shrink-0">
                    <Award size={18} className="sm:w-5 sm:h-5" />
                </div>
                <div>
                    <h4 className="font-bold text-xs sm:text-sm text-indigo-900 dark:text-indigo-300">Ready for Publication</h4>
                    <p className="text-xs text-indigo-700/70 dark:text-indigo-400/80 font-medium mt-0.5 leading-relaxed">
                        Below are the calculated weighted averages and grades based on the 100% weight distribution.
                    </p>
                </div>
            </div>

            {/* Results Table Card - Border Only */}
            <Card className="!p-0 overflow-hidden border border-slate-200/80 dark:border-white/10 rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-800/80">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 dark:bg-gray-800/80 text-[#2D2A4F] dark:text-gray-300 uppercase text-[10px] font-black tracking-widest border-b border-gray-100 dark:border-gray-700">
                        <tr>
                            <th className="px-4 sm:px-6 py-3.5 whitespace-nowrap">Student Name</th>
                            <th className="px-4 sm:px-6 py-3.5 text-center whitespace-nowrap">Calculated Score</th>
                            <th className="px-4 sm:px-6 py-3.5 text-center whitespace-nowrap">Grade</th>
                            <th className="px-4 sm:px-6 py-3.5 text-center whitespace-nowrap">GP</th>
                            <th className="px-4 sm:px-6 py-3.5 text-right whitespace-nowrap">Publication Status</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                        {previewData.map((res, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-3 sm:space-x-4">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase border border-indigo-100 dark:border-indigo-900/30 shrink-0">
                                            {res.studentName.charAt(0)}
                                        </div>
                                        <span className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white tracking-tight">{res.studentName}</span>
                                    </div>
                                </td>
                                <td className="px-4 sm:px-6 py-4 text-center whitespace-nowrap">
                                    <div className="inline-flex items-center space-x-1.5 bg-gray-50 dark:bg-gray-900/50 px-3 py-1 rounded-full border border-gray-100 dark:border-gray-700">
                                        <TrendingUp size={13} className="text-indigo-500 dark:text-emerald-400 shrink-0" />
                                        <span className="font-black text-xs sm:text-sm text-[#2D2A4F] dark:text-white">{res.marksObtained.toFixed(1)}%</span>
                                    </div>
                                </td>
                                <td className="px-4 sm:px-6 py-4 text-center whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-lg text-[10px] sm:text-[11px] font-black uppercase tracking-wider border ${getGradeColor(res.grade)}`}>
                      {res.grade}
                    </span>
                                </td>
                                <td className="px-4 sm:px-6 py-4 text-center font-mono font-black text-indigo-600 dark:text-indigo-400 text-xs sm:text-sm whitespace-nowrap">
                                    {res.gradePoint.toFixed(2)}
                                </td>
                                <td className="px-4 sm:px-6 py-4 text-right whitespace-nowrap">
                                    <div className="inline-flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400">
                                        <CheckCircle2 size={15} className="shrink-0" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Ready to post</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Confirmation Modal */}
            <Modal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                title="Confirm Publication"
                size="sm"
            >
                <div className="text-center space-y-4 py-2">
                    <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto border border-indigo-100 dark:border-indigo-800">
                        <FileCheck size={28} />
                    </div>
                    <div className="px-2">
                        <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">Confirm Publish?</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1.5 leading-relaxed font-medium">
                            Once published, students will be able to see their final grades. This action will also automatically update their CGPA.
                        </p>
                    </div>
                    <div className="flex space-x-2.5 pt-4 px-2">
                        <Button variant="secondary" className="flex-1 rounded-xl text-xs font-bold" onClick={() => setIsConfirmOpen(false)}>
                            Cancel
                        </Button>
                        <Button className="flex-1 rounded-xl bg-[#2D2A4F] hover:bg-[#1E1C38] text-white text-xs font-bold border-none" isLoading={publishing} onClick={handlePublish}>
                            Yes, Publish
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default PublishResults;