import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  PackageOpen,
  User,
  MoreVertical,
  RefreshCw,
  GraduationCap,
  TrendingUp,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import StatCard from '../../components/common/StatCard';
import { getAllConvocationApplications, updateConvocationStatus } from '../../api/convocationApi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { formatDate } from '../../utils/formatDate';
import { Link } from 'react-router-dom';

const ConvocationManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [status, setStatus] = useState('');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await getAllConvocationApplications();
      setApplications(res.data || []);
    } catch (err) {
      toast.error('Failed to fetch convocation applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const stats = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter(a => a.status === 'PENDING').length,
      verified: applications.filter(a => a.status === 'VERIFIED').length,
      approved: applications.filter(a => a.status === 'APPROVED').length,
    };
  }, [applications]);

  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch =
          app.studentName?.toLowerCase().includes(search.toLowerCase()) ||
          app.studentId?.toLowerCase().includes(search.toLowerCase()) ||
          app.registrationNo?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = !selectedStatus || app.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, selectedStatus]);

  const handleUpdateClick = (app) => {
    setSelectedApp(app);
    setStatus(app.status);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      await updateConvocationStatus(selectedApp.id, { status });
      toast.success('Application updated successfully');
      setIsUpdateModalOpen(false);
      fetchApplications();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update application');
    } finally {
      setUpdateLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 border-amber-200 dark:border-amber-500/20',
      VERIFIED: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300 border-blue-200 dark:border-blue-500/20',
      APPROVED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20',
      REJECTED: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300 border-red-200 dark:border-red-500/20',
    };
    return styles[status] || 'bg-slate-100 text-slate-700 dark:bg-white/[0.06] dark:text-white/40 border-slate-200 dark:border-white/10';
  };

  return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="w-full px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-20 pt-4">
        {/* Top Action Bar */}
        <div className="flex justify-end items-center">
          <Button onClick={fetchApplications} variant="secondary" className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-white/10">
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </Button>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard icon={GraduationCap} label="Total Applied" value={stats.total} color="primary" />
          <StatCard icon={Clock} label="Pending Review" value={stats.pending} color="warning" delay={0.1} />
          <StatCard icon={CheckCircle2} label="Verified" value={stats.verified} color="info" delay={0.2} />
          <StatCard icon={TrendingUp} label="Final Approved" value={stats.approved} color="success" delay={0.3} />
        </div>

        {/* Table Card */}
        <Card className="!p-0 overflow-hidden border border-slate-200/80 dark:border-white/10 rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-800/80">
          <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-white/[0.06] flex flex-col md:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <Input
                  placeholder="Search student by name, ID or Reg No..."
                  icon={Search}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3.5 py-2.5 sm:py-3 bg-slate-50/70 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium outline-none dark:text-white transition-all cursor-pointer"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="VERIFIED">Verified</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/80 dark:bg-white/[0.03] text-slate-500 dark:text-white/30 uppercase text-[10px] font-bold tracking-widest border-b border-slate-100 dark:border-white/[0.06]">
              <tr>
                <th className="px-4 sm:px-6 py-3.5 whitespace-nowrap">Student Info</th>
                <th className="px-4 sm:px-6 py-3.5 whitespace-nowrap">Academic Status</th>
                <th className="px-4 sm:px-6 py-3.5 whitespace-nowrap">Application Details</th>
                <th className="px-4 sm:px-6 py-3.5 text-center whitespace-nowrap">Status</th>
                <th className="px-4 sm:px-6 py-3.5 whitespace-nowrap">Applied At</th>
                <th className="px-4 sm:px-6 py-3.5 text-right whitespace-nowrap">Action</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
              {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-4 sm:px-6 py-4"><div className="h-10 bg-slate-100 dark:bg-white/5 rounded-xl w-40" /></td>
                        <td className="px-4 sm:px-6 py-4"><div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-32" /></td>
                        <td className="px-4 sm:px-6 py-4 text-center"><div className="h-6 bg-slate-100 dark:bg-white/5 rounded-full w-20 mx-auto" /></td>
                        <td colSpan={3} />
                      </tr>
                  ))
              ) : filteredApps.length > 0 ? (
                  filteredApps.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.04] transition-colors group">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <Link to={`/portal/students/${app.studentInternalId}`} className="shrink-0 group/img overflow-hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 transition-transform active:scale-95">
                              {app.profileImage ? (
                                  <img
                                      src={app.profileImage.startsWith('/api') ? app.profileImage : `/api/uploads/${app.profileImage}`}
                                      alt={app.studentName}
                                      className="w-full h-full object-cover transition-transform group-hover/img:scale-110"
                                  />
                              ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-500 dark:text-white/40 font-black text-xs sm:text-sm">
                                    {app.studentName?.charAt(0)}
                                  </div>
                              )}
                            </Link>
                            <div className="flex flex-col min-w-0">
                              <Link to={`/portal/students/${app.studentInternalId}`} className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate hover:text-[#007A55] transition-colors">
                                {app.studentName}
                              </Link>
                              <p className="text-[10px] text-slate-400 font-medium font-mono uppercase mt-0.5">
                                {app.registrationNo}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">CGPA: {app.cgpa.toFixed(2)}</span>
                            <span className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">{app.creditsCompleted} Credits</span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-700 dark:text-white/80">Year: {app.convocationYear}</span>
                            <span className="text-[10px] text-slate-400 font-medium mt-0.5">Gown: {app.gownSize} | Guests: {app.guestCount}</span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-center whitespace-nowrap">
                          <div className="flex flex-col items-center gap-1">
                        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest border ${getStatusBadge(app.status)}`}>
                          {app.status}
                        </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${app.isPaid ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/20' : 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/20'}`}>
                          {app.isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700 dark:text-white/80">
                          {formatDate(app.appliedAt)}
                        </span>
                            <span className="text-[9px] text-slate-400 font-medium uppercase tracking-tighter mt-0.5">
                          {new Date(app.appliedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-right whitespace-nowrap">
                          <button
                              onClick={() => handleUpdateClick(app)}
                              className="p-1.5 sm:p-2 text-slate-400 hover:text-[#007A55] hover:bg-emerald-50 dark:hover:bg-emerald-500/15 rounded-xl transition-all border border-transparent hover:border-emerald-100 dark:hover:border-emerald-500/20"
                              title="Update Application"
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
                        <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-white/40 uppercase tracking-widest">No applications found</p>
                      </div>
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Update Application Modal */}
        <Modal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
            title="Update Convocation Application"
            size="md"
        >
          <form onSubmit={handleUpdateSubmit} className="space-y-4 sm:space-y-5 py-1">
            {selectedApp && (
                <div className="flex items-center gap-3.5 bg-slate-50/70 dark:bg-white/[0.04] p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-white/10">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shrink-0">
                    {selectedApp.profileImage ? (
                        <img
                            src={selectedApp.profileImage.startsWith('/api') ? selectedApp.profileImage : `/api/uploads/${selectedApp.profileImage}`}
                            alt={selectedApp.studentName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-base font-black text-slate-500">
                          {selectedApp.studentName?.charAt(0)}
                        </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">{selectedApp.studentName}</h4>
                      <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md uppercase tracking-tighter shrink-0 border border-indigo-100 dark:border-indigo-900/30">
                    {selectedApp.programName}
                  </span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                      <span>{selectedApp.registrationNo}</span>
                      <span>•</span>
                      <span>{selectedApp.studentId}</span>
                    </div>
                  </div>
                </div>
            )}

            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-white/40 ml-1 mb-1.5 block">
                Action Status
              </label>
              <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium outline-none dark:text-white transition-all cursor-pointer"
                  required
              >
                <option value="PENDING">Pending</option>
                <option value="VERIFIED">Verified (Docs Check)</option>
                <option value="APPROVED">Approved (Final)</option>
                <option value="REJECTED">Rejected</option>
              </select>
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
                Update Application
              </Button>
            </div>
          </form>
        </Modal>
      </motion.div>
  );
};

export default ConvocationManagement;