import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  CheckCircle2,
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
  const [eligibility, setEligibility] = useState({ isEligible: true, reasons: [] });

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

      // Check Eligibility
      const reasons = [];
      const minCGPA = 2.50;
      if (Number(standing.cgpa) < minCGPA) {
        reasons.push(`Minimum CGPA requirement is ${minCGPA.toFixed(2)}. Your current CGPA is ${Number(standing.cgpa).toFixed(2)}.`);
      }
      if (Number(standing.totalCreditsCompleted) < Number(standing.requiredCredits)) {
        reasons.push(`You must complete all required credits (${standing.requiredCredits}). You have completed ${standing.totalCreditsCompleted} credits.`);
      }

      setEligibility({
        isEligible: reasons.length === 0,
        reasons
      });

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
    } finally {
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
    <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-20 pt-4">
      {/* Top Tab Switcher */}
      <div className="flex justify-start">
        <div className="flex bg-gray-100 dark:bg-gray-800/80 p-1 rounded-xl sm:rounded-2xl w-full sm:w-fit border border-gray-200/60 dark:border-gray-700/60">
          <button
            onClick={() => setActiveTab('apply')}
            className={`flex-1 sm:flex-none px-5 sm:px-6 py-2.5 rounded-lg sm:rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'apply'
                ? 'bg-white dark:bg-gray-700 text-[#2D2A4F] dark:text-emerald-400 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Apply
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 sm:flex-none px-5 sm:px-6 py-2.5 rounded-lg sm:rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'history'
                ? 'bg-white dark:bg-gray-700 text-[#2D2A4F] dark:text-emerald-400 shadow-sm'
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
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8"
          >
            {!eligibility.isEligible && !isEditing ? (
              <div className="xl:col-span-3">
                <Card className="border border-slate-200/80 dark:border-white/10 shadow-sm bg-white dark:bg-[#0B1225] overflow-hidden rounded-2xl sm:rounded-3xl">
                  <div className="py-16 sm:py-20 flex flex-col items-center text-center space-y-4 px-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-50 dark:bg-red-900/10 rounded-2xl flex items-center justify-center text-red-500 shadow-sm border border-red-100 dark:border-red-900/20">
                      <XCircle size={36} className="sm:w-10 sm:h-10" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      You are not eligible for Convocation!
                    </h2>
                    <div className="space-y-1.5 max-w-md">
                      {eligibility.reasons.map((reason, idx) => (
                        <p key={idx} className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                          {reason}
                        </p>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <>
                <div className="xl:col-span-2">
                  <Card title={isEditing ? "Edit Application" : "Application Form"} icon={GraduationCap} className="rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm !p-5 sm:!p-6">
                    {isEditing && (
                      <div className="mt-2 p-3.5 sm:p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl sm:rounded-2xl border border-amber-100 dark:border-amber-900/20 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <AlertCircle size={18} className="text-amber-600 shrink-0" />
                          <p className="text-xs font-bold text-amber-700 dark:text-amber-400">You are currently editing your application.</p>
                        </div>
                        <button onClick={handleCancelEdit} className="text-[10px] font-black uppercase tracking-widest text-amber-800 dark:text-amber-300 underline shrink-0">Cancel</button>
                      </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Convocation Year</label>
                          <Input
                            type="number"
                            value={formData.convocationYear}
                            onChange={(e) => setFormData({ ...formData, convocationYear: e.target.value })}
                            icon={Calendar}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Gown Size</label>
                          <select
                            value={formData.gownSize}
                            onChange={(e) => setFormData({ ...formData, gownSize: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200/80 dark:border-gray-700 rounded-xl sm:rounded-2xl px-4 py-3 outline-none font-bold text-xs sm:text-sm dark:text-white cursor-pointer transition-all"
                          >
                            {GownSizes.map(size => (
                              <option key={size} value={size}>{size}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Current CGPA (Calculated)</label>
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
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Total Credits Completed</label>
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
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Guest Count (Max 2)</label>
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

                      <div className="p-4 sm:p-5 bg-indigo-50/60 dark:bg-indigo-900/10 rounded-xl sm:rounded-2xl border border-indigo-100 dark:border-indigo-900/20">
                        <div className="flex justify-between items-center gap-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-sm text-indigo-600 dark:text-indigo-400 shrink-0 border border-indigo-100/50 dark:border-gray-700">
                              <CreditCard size={18} />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest">Registration Fee</p>
                              <p className="text-xs font-bold text-indigo-600/70 dark:text-indigo-400/60 mt-0.5">Includes Gown & Refreshments</p>
                            </div>
                          </div>
                          <span className="text-xl sm:text-2xl font-black text-indigo-900 dark:text-white whitespace-nowrap">
                            ৳5,000.00
                          </span>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full py-3.5 bg-[#2D2A4F] hover:bg-[#1E1C38] text-white rounded-xl sm:rounded-2xl font-bold transition-all text-xs sm:text-sm border-none shadow-sm"
                        isLoading={submitting}
                        icon={isEditing ? Pencil : Send}
                      >
                        {isEditing ? "Update Application" : "Confirm & Apply"}
                      </Button>
                    </form>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card title="Eligibility Info" icon={AlertCircle} className="rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm !p-5 sm:!p-6">
                    <div className="space-y-3.5 mt-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={15} />
                        <p className="text-xs font-bold text-gray-600 dark:text-gray-400">Must have completed all required credits for the program.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={15} />
                        <p className="text-xs font-bold text-gray-600 dark:text-gray-400">Minimum CGPA requirement: 2.50</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={15} />
                        <p className="text-xs font-bold text-gray-600 dark:text-gray-400">Clearance from Accounts and Library is mandatory.</p>
                      </div>
                    </div>
                  </Card>

                  <Card title="Gown Guide" icon={Ruler} className="rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm !p-5 sm:!p-6">
                    <div className="space-y-1 mt-3">
                      <div className="flex justify-between text-[10px] font-bold py-2 border-b border-gray-100 dark:border-gray-800">
                        <span className="text-gray-400 uppercase">Size</span>
                        <span className="text-gray-600 dark:text-gray-300">Height Range</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold py-2">
                        <span className="text-gray-700 dark:text-gray-200">S / M</span>
                        <span className="text-gray-600 dark:text-gray-400">5'0" - 5'6"</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold py-2">
                        <span className="text-gray-700 dark:text-gray-200">L / XL</span>
                        <span className="text-gray-600 dark:text-gray-400">5'7" - 6'0"</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold py-2">
                        <span className="text-gray-700 dark:text-gray-200">XXL</span>
                        <span className="text-gray-600 dark:text-gray-400">6'1" +</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="history-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <Card title="Application Status" icon={History} className="rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm !p-5 sm:!p-6">
              {loading ? (
                <div className="py-16 flex justify-center"><Loader /></div>
              ) : applications.length > 0 ? (
                <div className="overflow-x-auto mt-2">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 dark:bg-gray-800/80 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">
                      <tr>
                        <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap">Year</th>
                        <th className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">CGPA / Credits</th>
                        <th className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">Gown / Guests</th>
                        <th className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">Payment</th>
                        <th className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">Status</th>
                        <th className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">Applied At</th>
                        <th className="py-3.5 px-3 sm:px-4 text-right whitespace-nowrap">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                      {applications.map((app) => (
                        <tr key={app.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                          <td className="py-4 px-3 sm:px-4 whitespace-nowrap">
                            <span className="text-xs sm:text-sm font-black text-gray-800 dark:text-gray-200">{app.convocationYear}</span>
                          </td>
                          <td className="py-4 px-3 sm:px-4 text-center whitespace-nowrap">
                            <p className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">{Number(app.cgpa).toFixed(2)}</p>
                            <p className="text-[9px] text-gray-400 uppercase font-black">{app.creditsCompleted} Credits</p>
                          </td>
                          <td className="py-4 px-3 sm:px-4 text-center whitespace-nowrap">
                            <p className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">Size: {app.gownSize}</p>
                            <p className="text-[9px] text-gray-400 uppercase font-black">{app.guestCount} Guests</p>
                          </td>
                          <td className="py-4 px-3 sm:px-4 text-center whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase ${app.isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                              {app.isPaid ? 'Paid' : 'Unpaid'}
                            </span>
                          </td>
                          <td className="py-4 px-3 sm:px-4 text-center whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase ${getStatusColor(app.status)}`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="py-4 px-3 sm:px-4 text-center whitespace-nowrap">
                            <div className="flex flex-col items-center">
                              <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                                {formatDate(app.appliedAt)}
                              </span>
                              <span className="text-[9px] text-gray-400 font-medium uppercase tracking-tighter">
                                {new Date(app.appliedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-3 sm:px-4 text-right whitespace-nowrap">
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
                <div className="py-20 sm:py-24 text-center flex flex-col items-center justify-center space-y-3">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-300">
                    <GraduationCap size={40} />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-400 font-bold italic">No convocation applications found.</p>
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