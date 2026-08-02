import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Calendar,
  BookOpen,
  Clock,
  Contact,
  Star,
  Users
} from 'lucide-react';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import useFetch from '../../hooks/useFetch';
import { formatDate } from '../../utils/formatDate';
import { getFacultyPerformance } from '../../api/evaluationApi';

const FacultyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: faculty, loading } = useFetch(`/faculties/${id}`);
  const [performance, setPerformance] = useState(null);
  const [perfLoading, setPerfLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPerformance();
    }
  }, [id]);

  const fetchPerformance = async () => {
    try {
      const res = await getFacultyPerformance(id);
      setPerformance(res.data);
    } catch (error) {
      console.error('Failed to fetch performance:', error);
    } finally {
      setPerfLoading(false);
    }
  };

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;
  if (!faculty) return <div className="text-center py-20"><p className="text-gray-500">Faculty member not found.</p></div>;

  return (
    <div className="space-y-8 pb-12">
      <button
        onClick={() => navigate('/portal/faculty')}
        className="flex items-center text-gray-500 hover:text-primary-600 transition-colors group"
      >
        <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mr-3 group-hover:scale-110 transition-transform">
          <ChevronLeft size={20} />
        </div>
        <span className="font-bold">Back to Faculty List</span>
      </button>

      <Card className="relative overflow-hidden" animate={false}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-end gap-8 relative z-10">
            <div className="w-32 h-32 bg-indigo-100 dark:bg-indigo-900/30 rounded-3xl flex items-center justify-center text-indigo-600 border-4 border-white dark:border-gray-800 shadow-xl overflow-hidden">
                {faculty.profileImage ? (
                    <img
                        src={faculty.profileImage.startsWith('/api') ? faculty.profileImage : `/api/uploads/${faculty.profileImage}`}
                        alt={faculty.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-5xl font-black">{faculty.name?.charAt(0)}</span>
                )}
            </div>

          <div className="flex-1">
             <div className="flex items-center space-x-3 mb-2">
                <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                  {faculty.designation}
                </span>
             </div>
             <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{faculty.name}</h1>
             <div className="flex flex-wrap items-center gap-y-2 gap-x-6 mt-4">
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                   <Mail size={16} className="mr-2" />
                   <span className="text-sm font-medium">{faculty.email}</span>
                </div>
                <div className="flex items-center text-gray-900 dark:text-white font-bold bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">
                   <span className="text-xs uppercase text-gray-400 mr-2 font-black">EMP ID:</span>
                   <span className="font-mono">{faculty.employeeId}</span>
                </div>
             </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <Card title="Employment Information" icon={Briefcase}>
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Department</span>
                      <span className="font-bold text-gray-900 dark:text-white">{faculty.departmentName}</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Designation</span>
                      <span className="font-bold text-primary-600">{faculty.designation}</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Joined Date</span>
                      <span className="font-bold text-gray-900 dark:text-white">{formatDate(faculty.joinedAt)}</span>
                   </div>
                </div>
             </Card>

             <Card title="Contact Information" icon={Phone}>
                <div className="space-y-6">
                   <div>
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Phone Number</p>
                      <p className="font-bold text-gray-900 dark:text-white">{faculty.phone || 'N/A'}</p>
                   </div>
                   <div>
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Office Email</p>
                      <p className="font-bold text-primary-600 underline">{faculty.email}</p>
                   </div>
                </div>
             </Card>
          </div>

          <Card title="Assigned Courses" subtitle="Current Semester Offerings" icon={BookOpen}>
             <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                   <Clock size={32} />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white text-lg">Course Assignment data coming soon</h4>
                <p className="text-sm text-gray-500 mt-1">Teaching records will be displayed after course allocation.</p>
             </div>
          </Card>
        </div>

        <div className="space-y-8">
           <Card title="Teaching Performance" icon={Star} className="bg-indigo-600 dark:bg-indigo-600">
              <div className="text-white">
                 {perfLoading ? (
                    <div className="flex justify-center py-4"><Loader size="sm" /></div>
                 ) : (
                    <div className="space-y-4">
                       <div className="flex items-end space-x-2">
                          <span className="text-5xl font-black">{performance?.overallRating || '0.00'}</span>
                          <span className="text-indigo-200 text-sm font-bold mb-2">/ 5.00</span>
                       </div>
                       <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={20}
                              fill={star <= Math.round(performance?.overallRating || 0) ? "white" : "transparent"}
                              className={star <= Math.round(performance?.overallRating || 0) ? "text-white" : "text-indigo-400"}
                            />
                          ))}
                       </div>
                       <div className="pt-4 border-t border-indigo-500/50 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                             <Users size={16} className="text-indigo-200" />
                             <span className="text-xs font-bold text-indigo-100 uppercase tracking-wider">Total Evaluations</span>
                          </div>
                          <span className="text-lg font-black">{performance?.totalEvaluations || 0}</span>
                       </div>
                    </div>
                 )}
              </div>
           </Card>

           <Card title="Quick Stats" icon={Contact}>
              <div className="space-y-6">
                 <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Teaching Load</p>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">{faculty.currentTeachingLoad || 0} Courses</p>
                 </div>
                 <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Research Publications</p>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">--</p>
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default FacultyDetail;
