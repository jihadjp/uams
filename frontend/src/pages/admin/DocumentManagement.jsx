import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  FileText,
  PackageOpen,
  Calendar,
  CreditCard,
  User,
  MoreVertical,
  RefreshCw,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import StatCard from '../../components/common/StatCard';
import { getAllRequests, updateRequestStatus } from '../../api/documentApi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { formatDate } from '../../utils/formatDate';

const DocumentManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Form State for update
  const [status, setStatus] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [isPaid, setIsPaid] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await getAllRequests();
      setRequests(res.data || []);
    } catch (err) {
      toast.error('Failed to fetch document requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const stats = useMemo(() => {
    return {
      total: requests.length,
      pending: requests.filter(r => r.status === 'PENDING').length,
      processing: requests.filter(r => r.status === 'PROCESSING').length,
      completed: requests.filter(r => r.status === 'COMPLETED').length,
    };
  }, [requests]);

  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const matchesSearch =
          req.studentName?.toLowerCase().includes(search.toLowerCase()) ||
          req.studentId?.toLowerCase().includes(search.toLowerCase()) ||
          req.registrationNo?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = !selectedStatus || req.status === selectedStatus;
      const matchesType = !selectedType || req.documentType === selectedType;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [requests, search, selectedStatus, selectedType]);

  const handleUpdateClick = (request) => {
    setSelectedRequest(request);
    setStatus(request.status);
    setAdminNote(request.adminNote || '');
    setIsPaid(request.isPaid);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      await updateRequestStatus(selectedRequest.id, {
        status,
        adminNote,
        isPaid
      });
      toast.success('Request updated successfully');
      setIsUpdateModalOpen(false);
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update request');
    } finally {
      setUpdateLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 border-amber-200 dark:border-amber-500/20',
      PROCESSING: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300 border-blue-200 dark:border-blue-500/20',
      COMPLETED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20',
      REJECTED: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300 border-red-200 dark:border-red-500/20',
    };
    return styles[status] || 'bg-slate-100 text-slate-700 dark:bg-white/[0.06] dark:text-white/40 border-slate-200 dark:border-white/10';
  };

  const formatDocumentType = (type) => {
    return type.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
  };

  return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="w-full px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-20 pt-4">
        {/* Top Action Bar */}
        <div className="flex justify-end items-center">
          <Button onClick={fetchRequests} variant="secondary" className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-white/10">
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </Button>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard icon={FileText} label="Total Requests" value={stats.total} color="primary" />
          <StatCard icon={Clock} label="Pending" value={stats.pending} color="warning" delay={0.1} />
          <StatCard icon={RefreshCw} label="Processing" value={stats.processing} color="info" delay={0.2} />
          <StatCard icon={CheckCircle2} label="Completed" value={stats.completed} color="success" delay={0.3} />
        </div>

        {/* Table Card */}
        <Card className="!p-0 overflow-hidden border border-slate-200/80 dark:border-white/10 rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-800/80">
          <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-white/[0.06] flex flex-col md:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <Input
                  placeholder="Search by student name, ID or Reg No..."
                  icon={Search}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 sm:gap-3">
              <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3.5 py-2.5 sm:py-3 bg-slate-50/70 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium outline-none dark:text-white transition-all cursor-pointer"
              >
                <option value="">All Types</option>
                <option value="TRANSCRIPT">Transcript</option>
                <option value="PROVISIONAL_CERTIFICATE">Provisional Certificate</option>
                <option value="MAIN_CERTIFICATE">Main Certificate</option>
                <option value="TESTIMONIAL">Testimonial</option>
                <option value="MEDIUM_OF_INSTRUCTION">Medium of Instruction</option>
              </select>
              <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3.5 py-2.5 sm:py-3 bg-slate-50/70 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium outline-none dark:text-white transition-all cursor-pointer"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="COMPLETED">Completed</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/80 dark:bg-white/[0.03] text-slate-500 dark:text-white/30 uppercase text-[10px] font-bold tracking-widest border-b border-slate-100 dark:border-white/[0.06]">
              <tr>
                <th className="px-4 sm:px-6 py-3.5 whitespace-nowrap">Student Info</th>
                <th className="px-4 sm:px-6 py-3.5 whitespace-nowrap">Document Details</th>
                <th className="px-4 sm:px-6 py-3.5 whitespace-nowrap">Payment</th>
                <th className="px-4 sm:px-6 py-3.5 text-center whitespace-nowrap">Status</th>
                <th className="px-4 sm:px-6 py-3.5 whitespace-nowrap">Request Date</th>
                <th className="px-4 sm:px-6 py-3.5 text-right whitespace-nowrap">Action</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
              {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-4 sm:px-6 py-4"><div className="h-10 bg-slate-100 dark:bg-white/5 rounded-xl w-40" /></td>
                        <td className="px-4 sm:px-6 py-4"><div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-32" /></td>
                        <td className="px-4 sm:px-6 py-4"><div className="h-6 bg-slate-100 dark:bg-white/5 rounded-full w-20" /></td>
                        <td className="px-4 sm:px-6 py-4 text-center"><div className="h-6 bg-slate-100 dark:bg-white/5 rounded-full w-24 mx-auto" /></td>
                        <td className="px-4 sm:px-6 py-4"><div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-28" /></td>
                        <td className="px-4 sm:px-6 py-4" />
                      </tr>
                  ))
              ) : filteredRequests.length > 0 ? (
                  filteredRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.04] transition-colors group">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-white/40 font-bold border border-slate-200/80 dark:border-white/10 shrink-0">
                              <User size={18} />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">{req.studentName}</p>
                              <p className="text-[10px] text-slate-400 font-medium font-mono uppercase tracking-tighter mt-0.5">
                                {req.registrationNo} • {req.studentId}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700 dark:text-white/80">
                          {formatDocumentType(req.documentType)}
                        </span>
                            <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                          {req.programName}
                        </span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          ৳{req.feeAmount}
                        </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border w-fit ${
                                req.isPaid
                                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/20'
                                    : 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/20'
                            }`}>
                          {req.isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest border ${getStatusBadge(req.status)}`}>
                        {req.status}
                      </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-slate-500 dark:text-white/40">
                            <Calendar size={13} className="shrink-0" />
                            <span className="text-xs font-medium">
                          {formatDate(req.requestedAt)}
                        </span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-right whitespace-nowrap">
                          <button
                              onClick={() => handleUpdateClick(req)}
                              className="p-1.5 sm:p-2 text-slate-400 hover:text-[#007A55] hover:bg-emerald-50 dark:hover:bg-emerald-500/15 rounded-xl transition-all border border-transparent hover:border-emerald-100 dark:hover:border-emerald-500/20"
                              title="Update Request"
                          >
                            <MoreVertical size={16} />
                          </button>
                        </td>
                      </tr>
                  ))
              ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 sm:py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400 dark:text-white/20">
                        <PackageOpen size={40} strokeWidth={1} className="mb-3 opacity-50" />
                        <p className="text-base sm:text-lg font-bold text-slate-600 dark:text-white/40">No requests found</p>
                      </div>
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Update Request Modal */}
        <Modal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            title="Update Document Request"
            size="md"
        >
          <form onSubmit={handleUpdateSubmit} className="space-y-4 sm:space-y-5 py-1">
            {selectedRequest && (
                <div className="bg-slate-50/70 dark:bg-white/[0.04] p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-white/10 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Student</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedRequest.studentName}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Document</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formatDocumentType(selectedRequest.documentType)}</span>
                  </div>
                  {selectedRequest.requestNote && (
                      <div className="pt-2 border-t border-slate-200/80 dark:border-white/10 mt-1.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Student Note</span>
                        <p className="text-xs text-slate-600 dark:text-white/70 italic font-medium">"{selectedRequest.requestNote}"</p>
                      </div>
                  )}
                </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-white/40 ml-1 mb-1.5 block">
                  Update Status
                </label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium outline-none dark:text-white transition-all cursor-pointer"
                    required
                >
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-white/40 ml-1 mb-1.5 block">
                  Admin Note (Optional)
                </label>
                <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Add a note for the student..."
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium outline-none dark:text-white transition-all min-h-[90px] resize-none"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 sm:p-4 bg-slate-50/70 dark:bg-white/[0.04] rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl border ${isPaid ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/20' : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-white/10 dark:text-white/40'}`}>
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Payment Received</p>
                    <p className="text-[10px] text-slate-400 font-medium">Mark as paid if student has completed payment</p>
                  </div>
                </div>
                <button
                    type="button"
                    onClick={() => setIsPaid(!isPaid)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isPaid ? 'bg-[#007A55]' : 'bg-slate-300 dark:bg-white/20'
                    }`}
                >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isPaid ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
                </button>
              </div>
            </div>

            <div className="flex gap-2.5 pt-3">
              <Button
                  type="button"
                  variant="secondary"
                  className="flex-1 bg-transparent border-none text-xs font-bold text-slate-500"
                  onClick={() => setIsUpdateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                  type="submit"
                  className="flex-1 bg-[#2D2A4F] hover:bg-[#1E1C38] text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm py-3 border-none"
                  isLoading={updateLoading}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      </motion.div>
  );
};

export default DocumentManagement;