import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Send,
  History,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  Award,
  BookOpen,
  User,
  ExternalLink,
  ClipboardList
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { requestDocument, getMyRequests } from '../../api/documentApi';
import { getMyTranscript } from '../../api/resultApi';
import { getMyProfile } from '../../api/profileApi';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const DocumentTypes = [
  { value: 'TRANSCRIPT', label: 'Official Transcript', fee: 500 },
  { value: 'PROVISIONAL_CERTIFICATE', label: 'Provisional Certificate', fee: 1000 },
  { value: 'MAIN_CERTIFICATE', label: 'Main Certificate', fee: 2000 },
  { value: 'TESTIMONIAL', label: 'Testimonial', fee: 200 },
  { value: 'MEDIUM_OF_INSTRUCTION', label: 'Medium of Instruction (MOI)', fee: 300 },
];

const CertificatesTranscripts = () => {
  const user = useAuthStore(state => state.user);
  const [activeTab, setActiveTab] = useState('request');
  const [requests, setRequests] = useState([]);
  const [transcript, setTranscript] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    documentType: 'TRANSCRIPT',
    requestNote: ''
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'request') {
        const response = await getMyRequests();
        setRequests(response.data || []);
      } else {
        const profileRes = await getMyProfile();
        const studentId = profileRes.data.student?.id;

        if (studentId) {
          const response = await getMyTranscript(studentId);
          setTranscript(response.data || []);
        } else {
          toast.error("Student profile not found");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await requestDocument(formData);
      toast.success("Request submitted successfully!");
      setFormData({ documentType: 'TRANSCRIPT', requestNote: '' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'PROCESSING': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'READY_FOR_PICKUP': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'REJECTED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle2 size={12} />;
      case 'REJECTED': return <AlertCircle size={12} />;
      default: return <Clock size={12} />;
    }
  };

  return (
      <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-20 pt-4">
        {/* Top Tab Controls */}
        <div className="flex justify-start">
          <div className="flex bg-gray-100 dark:bg-gray-800/80 p-1 rounded-xl sm:rounded-2xl w-full sm:w-fit border border-gray-200/60 dark:border-gray-700/60">
            <button
                onClick={() => setActiveTab('request')}
                className={`flex-1 sm:flex-none px-5 sm:px-6 py-2.5 rounded-lg sm:rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    activeTab === 'request'
                        ? 'bg-white dark:bg-gray-700 text-[#2D2A4F] dark:text-emerald-400 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              Request
            </button>
            <button
                onClick={() => setActiveTab('transcript')}
                className={`flex-1 sm:flex-none px-5 sm:px-6 py-2.5 rounded-lg sm:rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    activeTab === 'transcript'
                        ? 'bg-white dark:bg-gray-700 text-[#2D2A4F] dark:text-emerald-400 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              Web Transcript
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'request' ? (
              <motion.div
                  key="request-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8"
              >
                {/* Request Form */}
                <div className="xl:col-span-1">
                  <Card title="Apply for Document" icon={Send} className="rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm !p-5 sm:!p-6">
                    <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Document Type</label>
                        <select
                            value={formData.documentType}
                            onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200/80 dark:border-gray-700 rounded-xl sm:rounded-2xl px-4 py-3 outline-none font-bold text-xs sm:text-sm dark:text-white cursor-pointer transition-all"
                        >
                          {DocumentTypes.map(doc => (
                              <option key={doc.value} value={doc.value}>{doc.label} - ৳{doc.fee}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block">Reason / Note (Optional)</label>
                        <textarea
                            value={formData.requestNote}
                            onChange={(e) => setFormData({ ...formData, requestNote: e.target.value })}
                            placeholder="e.g. For higher studies application..."
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200/80 dark:border-gray-700 rounded-xl sm:rounded-2xl px-4 py-3 outline-none font-medium text-xs sm:text-sm dark:text-white transition-all min-h-[110px] resize-none"
                        />
                      </div>

                      <div className="p-4 bg-indigo-50/60 dark:bg-indigo-900/10 rounded-xl sm:rounded-2xl border border-indigo-100 dark:border-indigo-900/20">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400">Processing Fee</span>
                          <span className="text-base sm:text-lg font-black text-indigo-900 dark:text-white">
                        ৳{DocumentTypes.find(d => d.value === formData.documentType)?.fee}
                      </span>
                        </div>
                        <p className="text-[9px] text-indigo-600/70 dark:text-indigo-400/70 font-bold uppercase tracking-wider mt-1.5">
                          * Fees are non-refundable once processed.
                        </p>
                      </div>

                      <Button
                          type="submit"
                          className="w-full py-3.5 bg-[#2D2A4F] hover:bg-[#1E1C38] text-white rounded-xl sm:rounded-2xl font-bold transition-all text-xs sm:text-sm border-none"
                          isLoading={submitting}
                          icon={Send}
                      >
                        Submit Application
                      </Button>
                    </form>
                  </Card>
                </div>

                {/* Request History */}
                <div className="xl:col-span-2">
                  <Card title="Application History" icon={History} className="rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm !p-5 sm:!p-6">
                    {loading ? (
                        <div className="py-20 flex justify-center"><Loader /></div>
                    ) : requests.length > 0 ? (
                        <div className="overflow-x-auto mt-2">
                          <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 dark:bg-gray-800/80 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">
                            <tr>
                              <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap">Document</th>
                              <th className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">Fee</th>
                              <th className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">Payment</th>
                              <th className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">Status</th>
                              <th className="py-3.5 px-3 sm:px-4 text-right whitespace-nowrap">Requested On</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                            {requests.map((req) => (
                                <tr key={req.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                  <td className="py-4 px-3 sm:px-4 whitespace-nowrap">
                                    <p className="text-xs sm:text-sm font-black text-gray-800 dark:text-gray-200">
                                      {DocumentTypes.find(d => d.value === req.documentType)?.label || req.documentType}
                                    </p>
                                    <p className="text-[10px] text-gray-400 font-bold truncate max-w-[180px]">
                                      {req.requestNote || 'No notes provided'}
                                    </p>
                                  </td>
                                  <td className="py-4 px-3 sm:px-4 text-center font-mono text-xs font-bold text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                    ৳{req.feeAmount}
                                  </td>
                                  <td className="py-4 px-3 sm:px-4 text-center whitespace-nowrap">
                                    {req.isPaid ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[9px] sm:text-[10px] font-black uppercase">
                                  Paid
                                </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[9px] sm:text-[10px] font-black uppercase">
                                  Unpaid
                                </span>
                                    )}
                                  </td>
                                  <td className="py-4 px-3 sm:px-4 text-center whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase ${getStatusColor(req.status)}`}>
                                {getStatusIcon(req.status)}
                                {req.status.replace(/_/g, ' ')}
                              </span>
                                  </td>
                                  <td className="py-4 px-3 sm:px-4 text-right whitespace-nowrap">
                                    <p className="text-xs font-bold text-gray-600 dark:text-gray-400">
                                      {new Date(req.requestedAt).toLocaleDateString()}
                                    </p>
                                    <p className="text-[9px] text-gray-400 font-medium">
                                      {new Date(req.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                  </td>
                                </tr>
                            ))}
                            </tbody>
                          </table>
                        </div>
                    ) : (
                        <div className="py-16 sm:py-20 text-center flex flex-col items-center justify-center space-y-3">
                          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-300">
                            <FileText size={36} />
                          </div>
                          <p className="text-xs sm:text-sm text-gray-400 font-bold italic">No document requests found.</p>
                        </div>
                    )}
                  </Card>
                </div>
              </motion.div>
          ) : (
              <motion.div
                  key="transcript-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6 sm:space-y-8"
              >
                {/* Transcript Preview */}
                <Card className="!p-0 overflow-hidden relative border border-slate-200/80 dark:border-white/10 shadow-sm rounded-2xl sm:rounded-3xl">
                  <div className="bg-[#1e293b] p-6 sm:p-10 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b-4 sm:border-b-6 border-indigo-600">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-600 rounded-lg shrink-0">
                          <Award size={22} />
                        </div>
                        <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tight">Official Web Transcript</h2>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 pt-1">
                        <div className="flex items-center gap-2 text-gray-400">
                          <User size={13} className="text-indigo-400 shrink-0" />
                          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-300">Name:</span>
                          <span className="text-[10px] sm:text-xs font-black text-white">{user?.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <BookOpen size={13} className="text-indigo-400 shrink-0" />
                          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-300">Program:</span>
                          <span className="text-[10px] sm:text-xs font-black text-white">{user?.program || 'B.Sc. in CSE'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <ClipboardList size={13} className="text-indigo-400 shrink-0" />
                          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-300">ID:</span>
                          <span className="text-[10px] sm:text-xs font-black text-white">{user?.studentId || '242-15-211'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <ExternalLink size={13} className="text-indigo-400 shrink-0" />
                          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-300">Date:</span>
                          <span className="text-[10px] sm:text-xs font-black text-white">{new Date().toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                      <div className="px-5 py-3 bg-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/10 text-center">
                        <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-0.5">Current CGPA</p>
                        <p className="text-2xl sm:text-3xl font-black">
                          {transcript && transcript.length > 0
                            ? (transcript.reduce((acc, curr) => acc + (curr.gradePoint * curr.credits), 0) /
                               transcript.reduce((acc, curr) => acc + curr.credits, 0)).toFixed(2)
                            : '0.00'}
                        </p>
                      </div>
                      <Button size="sm" variant="secondary" className="bg-white/10 hover:bg-white/20 border-none text-white text-[10px] font-black uppercase tracking-widest px-4 py-2" icon={Download}>
                        Export PDF
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 sm:p-8">
                    {loading ? (
                        <div className="py-16 flex justify-center"><Loader /></div>
                    ) : transcript && transcript.length > 0 ? (
                        <div className="space-y-6 sm:space-y-8">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead className="bg-gray-50 dark:bg-gray-800/80 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700">
                              <tr>
                                <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap">SL</th>
                                <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap">Course</th>
                                <th className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">Credit</th>
                                <th className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">Grade</th>
                                <th className="py-3.5 px-3 sm:px-4 text-right whitespace-nowrap">Points</th>
                              </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                              {transcript.map((res, idx) => (
                                  <tr key={res.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                    <td className="py-3.5 px-3 sm:px-4 text-xs font-bold text-gray-400 whitespace-nowrap">{idx + 1}</td>
                                    <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap">
                                      <p className="text-xs font-black text-gray-700 dark:text-gray-300 font-mono">{res.courseCode}</p>
                                      <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mt-0.5">{res.courseTitle}</p>
                                    </td>
                                    <td className="py-3.5 px-3 sm:px-4 text-center text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                      {res.credits.toFixed(1)}
                                    </td>
                                    <td className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">
                                      <span className="font-black text-xs sm:text-sm text-indigo-600 dark:text-emerald-400">{res.grade}</span>
                                    </td>
                                    <td className="py-3.5 px-3 sm:px-4 text-right font-mono font-black text-xs sm:text-sm text-gray-900 dark:text-white whitespace-nowrap">
                                      {res.gradePoint.toFixed(2)}
                                    </td>
                                  </tr>
                              ))}
                              </tbody>
                              <tfoot>
                              <tr className="bg-gray-50 dark:bg-gray-800/50">
                                <td colSpan="2" className="py-4 px-4 text-xs font-black uppercase tracking-widest text-gray-500 whitespace-nowrap">Academic Summary</td>
                                <td className="py-4 text-center font-black text-xs sm:text-sm text-gray-900 dark:text-white whitespace-nowrap">
                                  {transcript.reduce((acc, curr) => acc + curr.credits, 0).toFixed(1)}
                                </td>
                                <td className="py-4 text-right whitespace-nowrap" colSpan="2">
                                  <div className="flex flex-col items-end px-4">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Final CGPA</span>
                                    <span className="text-lg sm:text-xl font-black text-indigo-600 dark:text-emerald-400">
                                      {transcript && transcript.length > 0
                                        ? (transcript.reduce((acc, curr) => acc + (curr.gradePoint * curr.credits), 0) /
                                           transcript.reduce((acc, curr) => acc + curr.credits, 0)).toFixed(2)
                                        : '0.00'}
                                    </span>
                                  </div>
                                </td>
                              </tr>
                              </tfoot>
                            </table>
                          </div>

                          <div className="p-4 sm:p-5 bg-amber-50 dark:bg-amber-900/10 rounded-xl sm:rounded-2xl border border-amber-100 dark:border-amber-900/20">
                            <div className="flex items-start gap-3 sm:gap-4">
                              <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                              <div>
                                <p className="text-xs font-black text-amber-800 dark:text-amber-500 uppercase tracking-widest mb-1">Important Notice</p>
                                <p className="text-[10px] sm:text-xs text-amber-700 dark:text-amber-400/80 font-medium leading-relaxed">
                                  This web transcript is for informational purposes only and is not an official academic record.
                                  For official use, please request a stamped and signed transcript through the "Request" tab.
                                  In case of any discrepancies, please contact the Registrar's Office.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                    ) : (
                        <div className="py-20 sm:py-24 text-center flex flex-col items-center justify-center space-y-4">
                          <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-300">
                            <Award size={48} />
                          </div>
                          <div>
                            <h3 className="text-base sm:text-lg font-black text-gray-800 dark:text-white">No Results Found</h3>
                            <p className="text-xs sm:text-sm text-gray-400 font-bold italic mt-1">Complete at least one semester to view your academic transcript.</p>
                          </div>
                        </div>
                    )}
                  </div>
                </Card>
              </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
};

export default CertificatesTranscripts;