import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, BookOpen, Users, CheckCircle, Copy, ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { getPrograms } from '../../api/programApi';
import { completeProfile } from '../../api/studentApi';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const CompleteProfile = () => {
  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedId, setGeneratedId] = useState(null);
  const user = useAuthStore(state => state.user);
  const updateUser = useAuthStore(state => state.updateUser);

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await getPrograms();
        setPrograms(res.data.content || res.data);
      } catch (err) {
        toast.error('Failed to load programs');
      }
    };
    fetchPrograms();
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await completeProfile({
        userId: user.id,
        programId: data.programId,
        batch: data.batch
      });
      setGeneratedId(res.data.studentIdNo);
      updateUser({ ...user, studentId: res.data.id, role: 'STUDENT' });
      toast.success('Profile completed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete profile');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedId);
    toast.success('ID copied to clipboard!');
  };

  if (generatedId) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="text-center p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle size={40} />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Registration Success!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">Your university profile is now complete. Please keep your Student ID safe.</p>

            <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-600 relative group">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Your Student ID</p>
              <h3 className="text-3xl font-black text-primary-600 tracking-tight">{generatedId}</h3>
              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 p-2 text-gray-400 hover:text-primary-500 transition-colors"
                title="Copy to clipboard"
              >
                <Copy size={16} />
              </button>
            </div>

            <Button
              className="w-full mt-8"
              onClick={() => window.location.href = '/student'}
            >
              Go to Dashboard <ArrowRight size={18} className="ml-2" />
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl"
      >
        <Card>
          <div className="flex items-center space-x-4 mb-8">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-2xl">
              <GraduationCap size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Complete Your Profile</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Please provide your academic details to continue.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ml-1">Select Program</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                  <BookOpen size={18} />
                </div>
                <select
                  {...register('programId', { required: 'Please select your program' })}
                  className={`block w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none appearance-none ${errors.programId ? 'border-red-400' : ''}`}
                >
                  <option value="">Choose Program</option>
                  {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              {errors.programId && <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.programId.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ml-1">Batch Year</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                  <Users size={18} />
                </div>
                <input
                  {...register('batch', {
                    required: 'Batch year is required',
                    pattern: { value: /^[0-9]{3,4}$/, message: 'Enter valid batch (e.g. 242)' }
                  })}
                  className={`block w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none ${errors.batch ? 'border-red-400' : ''}`}
                  placeholder="e.g. 242"
                />
              </div>
              {errors.batch && <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.batch.message}</p>}
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full py-4 text-lg">
              Generate My Student ID
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default CompleteProfile;
