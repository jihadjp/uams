import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
  Ruler,
  TrendingUp,
  Award,
  Send,
  Calendar,
  History,
  CreditCard,
  Pencil,
  XCircle
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Input from '../../components/common/Input';
import { applyForConvocation, getMyConvocationApplications, updateConvocationApplication } from '../../api/convocationApi';
import { getMyProfile } from '../../api/profileApi';
import { getStudentStanding } from '../../api/resultApi';
import toast from 'react-hot-toast';

const GownSizes = ['S', 'M', 'L', 'XL', 'XXL'];

// 🟢 তারিখ ফরম্যাট করার জন্য হেল্পার ফাংশন যুক্ত করা হয়েছে
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const ConvocationApplication = () => {
  const [activeTab, setActiveTab] = useState('apply');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    convocationYear: new Date().getFullYear(),
    gownSize: 'L',
    guestCount: 0,
    cgpa: '',
    creditsCompleted: ''
  });

  useEffect(() => {
    if (activeTab === 'apply' && !isEditing) {
        fetchInitialStanding();
    } else if (activeTab === 'history') {
        fetchHistory();
    }
  }, [activeTab]);

  const fetchInitialStanding = async () => {
    setLoading(true);
    try {
        const [profileRes, standingRes] = await Promise.all([
            getMyProfile(),
            getStudentStanding()
        ]);

        const student = profileRes.data.student;
        const standing = standingRes.data;

        setProfile(student);
        setFormData(prev => ({
            ...prev,
            cgpa: standing.cgpa,
            creditsCompleted: standing.totalCreditsCompleted
        }));
    } catch (error) {
        toast.error("Failed to load student standing");
    } finally {
        setLoading(false);
    }
  };

  const fetchHistory = async () => {
      setLoading(true);
      try {
          const response = await getMyConvocationApplications();
          setApplications(response.data || []);
      } catch (error) {
          toast.error("Failed to fetch applications");
      } finally { // ✅ সঠিক বানান (finally)
          setLoading(false);
      }
    };

  const handleEdit = (app) => {
      setFormData({
          convocationYear: app.convocationYear,
          gownSize: app.gownSize,
          guestCount: app.guestCount,
          cgpa: app.cgpa,
          creditsCompleted: app.creditsCompleted
      });
      setEditingId(app.id);
      setIsEditing(true);
      setActiveTab('apply');
  };

  const handleCancelEdit = () => {
      setIsEditing(false);
      setEditingId(null);
      fetchInitialStanding();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditing) {
          await updateConvocationApplication(editingId, formData);
          toast.success("Application updated successfully!");
          setIsEditing(false);
          setEditingId(null);
      } else {
          await applyForConvocation(formData);
          toast.success("Convocation application submitted successfully!");
      }
      setActiveTab('history');
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to process application");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'VERIFIED': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'REJECTED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Convocation Center</h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Class of {new Date().getFullYear()} Graduation Portal</p>
        </div>

        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('apply')}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'apply'
                ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Apply
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'history'
                ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            My Application
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'apply' ? (
          <motion.div
            key="apply-tab"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 xl:grid-cols-3 gap-8"
          >
            <div className="xl:col-span-2">
              <Card title={isEditing ? "Edit Application" : "Application Form"} icon={GraduationCap}>
                {isEditing && (
                    <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <AlertCircle size={18} className="text-amber-600" />
                            <p className="text-xs font-bold text-amber-700 dark:text-amber-400">You are currently editing your application.</p>
                        </div>
                        <button onClick={handleCancelEdit} className="text-[10px] font-black uppercase tracking-widest text-amber-800 dark:text-amber-300 underline">Cancel</button>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-8 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Convocation Year</label>
                      <Input
                        type="number"
                        value={formData.convocationYear}
                        onChange={(e) => setFormData({ ...formData, convocationYear: e.target.value })}
                        icon={Calendar}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Gown Size</label>
                      <select
                        value={formData.gownSize}
                        onChange={(e) => setFormData({ ...formData, gownSize: e.target.value })}
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-4 py-3.5 outline-none font-bold text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      >
                        {GownSizes.map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Current CGPA (Calculated)</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={formData.cgpa}
                        icon={TrendingUp}
                        disabled
                        className="bg-gray-50 dark:bg-gray-800/50"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Total Credits Completed</label>
                      <Input
                        type="number"
                        step="0.5"
                        value={formData.creditsCompleted}
                        icon={Award}
                        disabled
                        className="bg-gray-50 dark:bg-gray-800/50"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Guest Count (Max 2)</label>
                      <Input
                        type="number"
                        min="0"
                        max="2"
                        value={formData.guestCount}
                        onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                        icon={Users}
                      />
                    </div>
                  </div>

                  <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                            <CreditCard className="text-indigo-600" size={20} />
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest">Registration Fee</p>
                            <p className="text-xs font-bold text-indigo-600/70 dark:text-indigo-400/60 mt-0.5">Includes Gown & Refreshments</p>
                         </div>
                      </div>
                      <span className="text-2xl font-black text-indigo-900 dark:text-white">
                        ৳5,000.00
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-xl shadow-indigo-500/20"
                    isLoading={submitting}
                    icon={isEditing ? Pencil : Send}
                  >
                    {isEditing ? "Update Application" : "Confirm & Apply"}
                  </Button>
                </form>
              </Card>
            </div>

            <div className="space-y-6">
               <Card title="Eligibility Info" icon={AlertCircle}>
                  <div className="space-y-4 mt-4">
                     <div className="flex items-start gap-3">
                        <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={14} />
                        <p className="text-[11px] font-bold text-gray-600 dark:text-gray-400">Must have completed all required credits for the program.</p>
                     </div>
                     <div className="flex items-start gap-3">
                        <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={14} />
                        <p className="text-[11px] font-bold text-gray-600 dark:text-gray-400">Minimum CGPA requirement: 2.50</p>
                     </div>
                     <div className="flex items-start gap-3">
                        <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={14} />
                        <p className="text-[11px] font-bold text-gray-600 dark:text-gray-400">Clearance from Accounts and Library is mandatory.</p>
                     </div>
                  </div>
               </Card>

               <Card title="Gown Guide" icon={Ruler}>
                  <div className="space-y-2 mt-4">
                     <div className="flex justify-between text-[10px] font-bold py-2 border-b border-gray-50 dark:border-gray-800">
                        <span className="text-gray-400 uppercase">Size</span>
                        <span className="text-gray-600 dark:text-gray-300">Height Range</span>
                     </div>
                     <div className="flex justify-between text-[11px] font-bold py-2">
                        <span className="text-gray-700 dark:text-gray-200">S / M</span>
                        <span className="text-gray-600 dark:text-gray-400">5'0" - 5'6"</span>
                     </div>
                     <div className="flex justify-between text-[11px] font-bold py-2">
                        <span className="text-gray-700 dark:text-gray-200">L / XL</span>
                        <span className="text-gray-600 dark:text-gray-400">5'7" - 6'0"</span>
                     </div>
                     <div className="flex justify-between text-[11px] font-bold py-2">
                        <span className="text-gray-700 dark:text-gray-200">XXL</span>
                        <span className="text-gray-600 dark:text-gray-400">6'1" +</span>
                     </div>
                  </div>
               </Card>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="history-tab"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card title="Application Status" icon={History}>
              {loading ? (
                <div className="py-20 flex justify-center"><Loader /></div>
              ) : applications.length > 0 ? (
                <div className="overflow-x-auto mt-4">
                  <table className="w-full text-left">
                    <thead className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 dark:border-gray-800">
                      <tr>
                        <th className="pb-4 px-2">Year</th>
                        <th className="pb-4 text-center">CGPA / Credits</th>
                        <th className="pb-4 text-center">Gown / Guests</th>
                        <th className="pb-4 text-center">Payment</th>
                        <th className="pb-4 text-center">Status</th>
                        <th className="pb-4 text-center">Applied At</th>
                        <th className="pb-4 text-right px-2">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                      {applications.map((app) => (
                        <tr key={app.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <td className="py-5 px-2">
                            <span className="text-sm font-black text-gray-800 dark:text-gray-200">{app.convocationYear}</span>
                          </td>
                          <td className="py-5 text-center">
                            <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{Number(app.cgpa).toFixed(2)}</p>
                            <p className="text-[9px] text-gray-400 uppercase font-black">{app.creditsCompleted} Credits</p>
                          </td>
                          <td className="py-5 text-center">
                            <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Size: {app.gownSize}</p>
                            <p className="text-[9px] text-gray-400 uppercase font-black">{app.guestCount} Guests</p>
                          </td>
                          <td className="py-5 text-center">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase ${app.isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                              {app.isPaid ? 'Paid' : 'Unpaid'}
                            </span>
                          </td>
                          <td className="py-5 text-center">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase ${getStatusColor(app.status)}`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="py-5 text-center">
                            <div className="flex flex-col items-center">
                                <span className="text-xs font-bold text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                    {formatDate(app.appliedAt)}
                                </span>
                                <span className="text-[9px] text-gray-400 font-medium uppercase tracking-tighter">
                                    {new Date(app.appliedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                </span>
                            </div>
                          </td>
                          <td className="py-5 text-right px-2">
                            {app.status === 'PENDING' ? (
                                <button
                                    onClick={() => handleEdit(app)}
                                    className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all"
                                    title="Edit Application"
                                >
                                    <Pencil size={16} />
                                </button>
                            ) : (
                                <span className="text-[10px] font-bold text-gray-400 italic">Locked</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-32 text-center flex flex-col items-center justify-center space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-300">
                    <GraduationCap size={48} />
                  </div>
                  <p className="text-sm text-gray-500 font-medium italic">No convocation applications found.</p>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConvocationApplication;