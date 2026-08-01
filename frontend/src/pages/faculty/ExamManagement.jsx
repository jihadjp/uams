import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Plus,
  Trash2,
  FileText,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import Input from '../../components/common/Input';
import { getExams, createExam, deleteExam } from '../../api/examApi';
import { getCourseOfferingById } from '../../api/courseOfferingApi';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const ExamManagement = () => {
  const { offeringId } = useParams();
  const navigate = useNavigate();
  const [offering, setOffering] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      examType: 'QUIZ',
      totalMarks: 20,
      weightPercent: 10,
      examDate: new Date().toISOString().split('T')[0]
    }
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [offeringRes, examsRes] = await Promise.all([
        getCourseOfferingById(offeringId),
        getExams(offeringId)
      ]);
      setOffering(offeringRes.data);
      setExams(examsRes.data);
    } catch (err) {
      toast.error('Failed to load exam data');
    } finally {
      setLoading(false);
    }
  }, [offeringId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onSubmit = async (data) => {
    setFormLoading(true);
    try {
      await createExam({ ...data, offeringId });
      toast.success('Exam created successfully');
      setIsModalOpen(false);
      reset();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create exam');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this exam? All student marks will be lost.')) return;
    try {
      await deleteExam(id);
      toast.success('Exam deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete exam');
    }
  };

  const totalWeight = exams.reduce((sum, e) => sum + e.weightPercent, 0);

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
           <button
             onClick={() => navigate('/faculty/my-courses')}
             className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:text-primary-600 transition-all"
           >
             <ChevronLeft size={20} />
           </button>
           <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                {offering?.courseTitle} <span className="text-primary-500">({offering?.section})</span>
              </h1>
              <p className="text-gray-400 text-xs mt-1 font-medium tracking-wide uppercase">Results & Exam Management</p>
           </div>
        </div>

        <div className="flex items-center space-x-3">
           <Button variant="secondary" onClick={() => navigate(`/faculty/publish-results/${offeringId}`)}>
              Final Grading
           </Button>
           <Button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2">
              <Plus size={18} />
              <span>Add Exam</span>
           </Button>
        </div>
      </div>

      {/* Summary Banner */}
      <Card className={`border-none ${totalWeight === 100 ? 'bg-green-600' : 'bg-primary-600'} text-white relative overflow-hidden`}>
         <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
         <div className="flex flex-col md:flex-row justify-between items-center relative z-10">
            <div className="flex items-center space-x-4">
               <div className="p-3 bg-white/20 rounded-2xl">
                  <Award size={32} />
               </div>
               <div>
                  <h3 className="text-xl font-bold">Grade Weight Distribution</h3>
                  <p className="text-primary-100 text-sm">Configure how exams contribute to the final result.</p>
               </div>
            </div>
            <div className="text-center md:text-right mt-4 md:mt-0">
               <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Total Weight Assigned</p>
               <div className="flex items-end justify-center md:justify-end space-x-2">
                  <span className="text-5xl font-black leading-none">{totalWeight}%</span>
                  <span className="text-xl font-bold text-white/40 mb-1">/ 100%</span>
               </div>
            </div>
         </div>
      </Card>

      {/* Exam List */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
         <AnimatePresence mode="popLayout">
           {exams.map((exam, idx) => (
             <motion.div
               key={exam.id}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
             >
                <Card className="h-full group hover:border-primary-300 transition-all">
                   <div className="flex justify-between items-start mb-6">
                      <div className="p-2.5 bg-gray-50 dark:bg-gray-700/50 text-gray-500 rounded-xl font-mono text-[10px] font-black uppercase tracking-tighter">
                         {exam.examType}
                      </div>
                      <button
                        onClick={() => handleDelete(exam.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                      >
                         <Trash2 size={16} />
                      </button>
                   </div>

                   <div className="flex items-center space-x-2 text-primary-600 mb-1">
                      <Layers size={14} />
                      <span className="text-xs font-black uppercase tracking-widest">{exam.weightPercent}% Weight</span>
                   </div>
                   <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Total Marks: {exam.totalMarks}</h4>

                   <div className="flex items-center text-gray-400 text-xs font-medium mb-6">
                      <Calendar size={12} className="mr-1.5" />
                      {new Date(exam.examDate).toLocaleDateString()}
                   </div>

                   <Button
                     className="w-full flex items-center justify-center space-x-2"
                     onClick={() => navigate(`/faculty/marks/${exam.id}`)}
                   >
                      <FileText size={16} />
                      <span>Enter Marks</span>
                   </Button>
                </Card>
             </motion.div>
           ))}
         </AnimatePresence>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Assessment"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Exam Type</label>
                <select
                  {...register('examType')}
                  className="block w-full px-4 py-3 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 appearance-none"
                >
                  <option value="QUIZ">Quiz</option>
                  <option value="MIDTERM">Midterm</option>
                  <option value="FINAL">Final Exam</option>
                  <option value="ASSIGNMENT">Assignment</option>
                  <option value="LAB">Lab / Practical</option>
                </select>
              </div>
              <Input label="Date" type="date" {...register('examDate', { required: 'Required' })} icon={Calendar} error={errors.examDate?.message} />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Total Marks" type="number" {...register('totalMarks', { required: 'Required', min: 1 })} icon={Award} error={errors.totalMarks?.message} />
              <Input label="Weight (%)" type="number" {...register('weightPercent', { required: 'Required', min: 1, max: 100 })} icon={Layers} error={errors.weightPercent?.message} />
           </div>

           {totalWeight + parseInt(watch('weightPercent') || 0) > 100 && (
             <div className="p-4 bg-yellow-50 text-yellow-700 rounded-2xl flex items-start space-x-3 text-sm">
                <AlertCircle size={20} className="shrink-0" />
                <p>Warning: Total weight will exceed 100%. Please adjust the weight distribution.</p>
             </div>
           )}

           <div className="flex justify-end pt-4">
              <Button type="submit" isLoading={formLoading} className="w-full md:w-auto px-10">
                 Create Assessment
              </Button>
           </div>
        </form>
      </Modal>
    </div>
  );
};

export default ExamManagement;
