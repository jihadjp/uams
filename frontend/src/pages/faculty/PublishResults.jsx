import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
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
import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
           <button
             onClick={() => navigate(-1)}
             className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:text-primary-600 transition-all"
           >
             <ChevronLeft size={20} />
           </button>
           <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                Final Result Preview
              </h1>
              <p className="text-gray-400 text-xs mt-1 font-medium">{offering?.courseTitle} | Sec {offering?.section}</p>
           </div>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsConfirmOpen(true)}
          className="flex items-center space-x-2 px-8"
        >
           <FileCheck size={18} />
           <span>Publish Results</span>
        </Button>
      </div>

      {/* Warning Banner */}
      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/20 rounded-3xl flex items-start space-x-4">
         <div className="p-2 bg-indigo-600 text-white rounded-xl">
            <Award size={20} />
         </div>
         <div>
            <h4 className="font-bold text-indigo-900 dark:text-indigo-400">Ready for Publication</h4>
            <p className="text-sm text-indigo-700/70 dark:text-indigo-400/60 mt-0.5">Below are the calculated weighted averages and grades based on the 100% weight distribution.</p>
         </div>
      </div>

      {/* Results Table */}
      <Card className="!p-0 overflow-hidden border border-gray-100 dark:border-gray-800 shadow-xl rounded-[2.5rem]">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-gray-50 dark:bg-gray-800/80 text-[#2D2A4F] dark:text-gray-300 uppercase text-[11px] font-black tracking-widest border-b border-gray-100 dark:border-gray-700">
                  <tr>
                     <th className="px-8 py-5">Student Name</th>
                     <th className="px-8 py-5 text-center">Calculated Score</th>
                     <th className="px-8 py-5 text-center">Grade</th>
                     <th className="px-8 py-5 text-center">GP</th>
                     <th className="px-8 py-5 text-right">Publication Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                  {previewData.map((res, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all group">
                       <td className="px-8 py-5">
                          <div className="flex items-center space-x-4">
                             <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-black text-xs uppercase shadow-sm">
                                {res.studentName.charAt(0)}
                             </div>
                             <span className="font-black text-gray-900 dark:text-white tracking-tight">{res.studentName}</span>
                          </div>
                       </td>
                       <td className="px-8 py-5 text-center">
                          <div className="flex items-center justify-center space-x-2 bg-gray-50 dark:bg-gray-800/50 w-fit mx-auto px-4 py-1.5 rounded-full border border-gray-100 dark:border-gray-700">
                             <TrendingUp size={14} className="text-indigo-500" />
                             <span className="font-black text-[#2D2A4F] dark:text-white text-sm">{res.marksObtained.toFixed(1)}%</span>
                          </div>
                       </td>
                       <td className="px-8 py-5 text-center">
                          <span className={`px-4 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-[0.1em] border shadow-sm ${getGradeColor(res.grade)}`}>
                             {res.grade}
                          </span>
                       </td>
                       <td className="px-8 py-5 text-center font-mono font-black text-indigo-600 dark:text-indigo-400 text-base">
                          {res.gradePoint.toFixed(2)}
                       </td>
                       <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end space-x-2 text-emerald-500">
                             <CheckCircle2 size={16} />
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
        <div className="text-center space-y-4">
           <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto">
              <FileCheck size={32} />
           </div>
           <div>
              <p className="text-gray-500 text-sm">Once published, students will be able to see their final grades. This action will also automatically update their CGPA.</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-4">Confirm Publish?</h3>
           </div>
           <div className="flex space-x-3 pt-6">
              <Button variant="secondary" className="flex-1" onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
              <Button className="flex-1" isLoading={publishing} onClick={handlePublish}>Yes, Publish</Button>
           </div>
        </div>
      </Modal>
    </div>
  );
};

export default PublishResults;
