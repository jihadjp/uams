import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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
        // Fetch profile to get student internal ID
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
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Certificates & Transcripts</h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Academic Documents Center</p>
        </div>

        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('request')}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'request'
                ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Request
          </button>
          <button
            onClick={() => setActiveTab('transcript')}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'transcript'
                ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 xl:grid-cols-3 gap-8"
          >
            {/* Request Form */}
            <div className="xl:col-span-1">
              <Card title="Apply for Document" icon={Send}>
                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Document Type</label>
                    <select
                      value={formData.documentType}
                      onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-4 py-3.5 outline-none font-bold text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    >
                      {DocumentTypes.map(doc => (
                        <option key={doc.value} value={doc.value}>{doc.label} - ৳{doc.fee}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Reason / Note (Optional)</label>
                    <textarea
                      value={formData.requestNote}
                      onChange={(e) => setFormData({ ...formData, requestNote: e.target.value })}
                      placeholder="e.g. For higher studies application..."
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-4 py-3.5 outline-none font-medium text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all min-h-[120px] resize-none"
                    />
                  </div>

                  <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400">Processing Fee</span>
                      <span className="text-lg font-black text-indigo-900 dark:text-white">
                        ৳{DocumentTypes.find(d => d.value === formData.documentType)?.fee}
                      </span>
                    </div>
                    <p className="text-[9px] text-indigo-600/70 dark:text-indigo-400/70 font-bold uppercase tracking-wider mt-2">
                      * Fees are non-refundable once processed.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-4 bg-[#312e81] text-white rounded-2xl shadow-xl shadow-indigo-500/10"
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
              <Card title="Application History" icon={History}>
                {loading ? (
                  <div className="py-20 flex justify-center"><Loader /></div>
                ) : requests.length > 0 ? (
                  <div className="overflow-x-auto mt-4">
                    <table className="w-full text-left">
                      <thead className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 dark:border-gray-800">
                        <tr>
                          <th className="pb-4 px-2">Document</th>
                          <th className="pb-4 text-center">Fee</th>
                          <th className="pb-4 text-center">Payment</th>
                          <th className="pb-4 text-center">Status</th>
                          <th className="pb-4 text-right px-2">Requested On</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                        {requests.map((req) => (
                          <tr key={req.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                            <td className="py-5 px-2">
                              <p className="text-sm font-black text-gray-800 dark:text-gray-200">
                                {DocumentTypes.find(d => d.value === req.documentType)?.label || req.documentType}
                              </p>
                              <p className="text-[10px] text-gray-400 font-bold truncate max-w-[200px]">
                                {req.requestNote || 'No notes provided'}
                              </p>
                            </td>
                            <td className="py-5 text-center font-mono text-xs font-bold text-gray-600 dark:text-gray-400">
                              ৳{req.feeAmount}
                            </td>
                            <td className="py-5 text-center">
                              {req.isPaid ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-black uppercase">
                                  Paid
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] font-black uppercase">
                                  Unpaid
                                </span>
                              )}
                            </td>
                            <td className="py-5 text-center">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${getStatusColor(req.status)}`}>
                                {getStatusIcon(req.status)}
                                {req.status.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td className="py-5 text-right px-2">
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
                  <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-300">
                      <FileText size={40} />
                    </div>
                    <p className="text-sm text-gray-500 font-medium italic">No document requests found.</p>
                  </div>
                )}
              </Card>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="transcript-tab"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Transcript Preview */}
            <Card className="!p-0 overflow-hidden relative border-none shadow-2xl">
              <div className="bg-[#1e293b] p-8 md:p-12 text-white flex flex-col md:flex-row justify-between items-start gap-8 border-b-8 border-indigo-600">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 rounded-lg">
                      <Award size={24} />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Official Web Transcript</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                    <div className="flex items-center gap-3 text-gray-400">
                      <User size={14} className="text-indigo-400" />
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-300">Name:</span>
                      <span className="text-xs font-black text-white">{user?.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                      <BookOpen size={14} className="text-indigo-400" />
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-300">Program:</span>
                      <span className="text-xs font-black text-white">{user?.program || 'B.Sc. in CSE'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                      <ClipboardList size={14} className="text-indigo-400" />
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-300">ID:</span>
                      <span className="text-xs font-black text-white">{user?.studentId || '242-15-211'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                      <ExternalLink size={14} className="text-indigo-400" />
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-300">Date:</span>
                      <span className="text-xs font-black text-white">{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                   <div className="px-6 py-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-center">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-1">Current CGPA</p>
                      <p className="text-4xl font-black">{transcript ? (transcript.reduce((acc, curr) => acc + curr.gradePoint, 0) / transcript.length).toFixed(2) : '0.00'}</p>
                   </div>
                   <Button size="sm" variant="secondary" className="bg-white/10 hover:bg-white/20 border-none text-white text-[10px] font-black uppercase tracking-widest px-6" icon={Download}>
                      Export PDF
                   </Button>
                </div>
              </div>

              <div className="p-8 md:p-12">
                {loading ? (
                  <div className="py-20 flex justify-center"><Loader /></div>
                ) : transcript && transcript.length > 0 ? (
                  <div className="space-y-10">
                    {/* Group results by semester if possible, but the API returns List<ResultResponse> */}
                    {/* For now, just show as a single table as requested */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 dark:border-gray-800">
                          <tr>
                            <th className="pb-6 px-4">SL</th>
                            <th className="pb-6">Course</th>
                            <th className="pb-6 text-center">Credit</th>
                            <th className="pb-6 text-center">Grade</th>
                            <th className="pb-6 text-right px-4">Points</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                          {transcript.map((res, idx) => (
                            <tr key={res.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                              <td className="py-5 px-4 text-xs font-bold text-gray-400">{idx + 1}</td>
                              <td className="py-5">
                                <p className="text-xs font-black text-gray-700 dark:text-gray-300 font-mono">{res.courseCode}</p>
                                <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{res.courseTitle}</p>
                              </td>
                              <td className="py-5 text-center text-sm font-bold text-gray-600 dark:text-gray-400">
                                {res.credits.toFixed(1)}
                              </td>
                              <td className="py-5 text-center">
                                <span className="font-black text-indigo-600 dark:text-indigo-400">{res.grade}</span>
                              </td>
                              <td className="py-5 text-right px-4 font-mono font-black text-gray-900 dark:text-white">
                                {res.gradePoint.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-gray-50 dark:bg-gray-800/50">
                            <td colSpan="2" className="py-6 px-6 text-xs font-black uppercase tracking-widest text-gray-500">Academic Summary</td>
                            <td className="py-6 text-center font-black text-gray-900 dark:text-white">
                              {transcript.reduce((acc, curr) => acc + curr.credits, 0).toFixed(1)}
                            </td>
                            <td className="py-6 text-right" colSpan="2">
                               <div className="flex flex-col items-end px-6">
                                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Final CGPA</span>
                                  <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                                    {(transcript.reduce((acc, curr) => acc + curr.gradePoint, 0) / transcript.length).toFixed(2)}
                                  </span>
                               </div>
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/20">
                      <div className="flex items-start gap-4">
                        <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                        <div>
                           <p className="text-xs font-black text-amber-800 dark:text-amber-500 uppercase tracking-widest mb-1">Important Notice</p>
                           <p className="text-[10px] text-amber-700 dark:text-amber-400/80 font-bold leading-relaxed">
                              This web transcript is for informational purposes only and is not an official academic record.
                              For official use, please request a stamped and signed transcript through the "Request" tab.
                              In case of any discrepancies, please contact the Registrar's Office.
                           </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-32 text-center flex flex-col items-center justify-center space-y-6">
                    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-300">
                      <Award size={64} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-gray-800 dark:text-white">No Results Found</h3>
                      <p className="text-sm text-gray-500 font-medium italic mt-2">Complete at least one semester to view your academic transcript.</p>
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
