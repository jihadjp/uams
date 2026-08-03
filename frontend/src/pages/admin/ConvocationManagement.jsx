import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  PackageOpen,
  Calendar,
  User,
  MoreVertical,
  RefreshCw,
  GraduationCap,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import StatCard from '../../components/common/StatCard';
import { getAllConvocationApplications, updateConvocationStatus } from '../../api/convocationApi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { formatDate, formatDateTime } from '../../utils/formatDate';
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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Convocation Management</h1>
          <p className="text-slate-500 dark:text-white/40 mt-1 text-sm font-medium">Manage student applications for upcoming convocations.</p>
        </div>
        <Button onClick={fetchApplications} variant="secondary" className="flex items-center gap-2">
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={GraduationCap} label="Total Applied" value={stats.total} color="primary" />
        <StatCard icon={Clock} label="Pending Review" value={stats.pending} color="warning" delay={0.1} />
        <StatCard icon={CheckCircle2} label="Verified" value={stats.verified} color="info" delay={0.2} />
        <StatCard icon={TrendingUp} label="Final Approved" value={stats.approved} color="success" delay={0.3} />
      </div>

      <Card className="!p-0">
        <div className="p-6 border-b border-slate-100 dark:border-white/[0.06] flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search student..."
              icon={Search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 bg-slate-50 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-medium outline-none dark:text-white"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="VERIFIED">Verified</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-white/[0.03] text-slate-500 dark:text-white/30 uppercase text-[10px] font-bold tracking-widest">
              <tr>
                <th className="px-6 py-4">Student Info</th>
                <th className="px-6 py-4">Academic Status</th>
                <th className="px-6 py-4">Application Details</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4">Applied At</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-10 bg-slate-100 dark:bg-white/5 rounded-xl w-40" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-32" /></td>
                    <td className="px-6 py-4 text-center"><div className="h-6 bg-slate-100 dark:bg-white/5 rounded-full w-20 mx-auto" /></td>
                    <td colSpan={3} />
                  </tr>
                ))
              ) : filteredApps.length > 0 ? (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors group text-[11px]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link to={`/portal/students/${app.studentInternalId}`} className="shrink-0 group/img overflow-hidden w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm transition-transform active:scale-95">
                          {app.profileImage ? (
                            <img
                              src={app.profileImage.startsWith('/api') ? app.profileImage : `/api/uploads/${app.profileImage}`}
                              alt={app.studentName}
                              className="w-full h-full object-cover transition-transform group-hover/img:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500 font-black">
                                {app.studentName?.charAt(0)}
                            </div>
                          )}
                        </Link>
                        <div className="flex flex-col min-w-0">
                          <Link to={`/portal/students/${app.studentInternalId}`} className="text-sm font-black text-slate-900 dark:text-white truncate hover:text-[#007A55] transition-colors">
                            {app.studentName}
                          </Link>
                          <p className="text-[10px] text-slate-400 font-medium font-mono uppercase">
                            {app.registrationNo}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-900 dark:text-white">CGPA: {app.cgpa.toFixed(2)}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{app.creditsCompleted} Credits</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700 dark:text-white/70">Year: {app.convocationYear}</span>
                        <span className="text-[10px] text-slate-400 font-medium">Gown: {app.gownSize} | Guests: {app.guestCount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusBadge(app.status)}`}>
                            {app.status}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${app.isPaid ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                            {app.isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex flex-col">
                          <span className="font-bold text-slate-700 dark:text-white/70 whitespace-nowrap">
                            {formatDate(app.appliedAt)}
                          </span>
                          <span className="text-[9px] text-slate-400 font-medium uppercase tracking-tighter">
                            {new Date(app.appliedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                          </span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleUpdateClick(app)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/15 rounded-xl transition-all"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <PackageOpen size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">No applications found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title="Update Convocation Application"
        size="md"
      >
        <form onSubmit={handleUpdateSubmit} className="space-y-6">
          {selectedApp && (
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/[0.04] p-4 rounded-2xl border border-slate-200 dark:border-white/10">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white dark:border-slate-800 shadow-md shrink-0">
                  {selectedApp.profileImage ? (
                    <img
                        src={selectedApp.profileImage.startsWith('/api') ? selectedApp.profileImage : `/api/uploads/${selectedApp.profileImage}`}
                        alt={selectedApp.studentName}
                        className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xl font-black text-slate-500">
                        {selectedApp.studentName?.charAt(0)}
                    </div>
                  )}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex justify-between items-start">
                   <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">{selectedApp.studentName}</h4>
                   <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                      {selectedApp.programName}
                   </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedApp.registrationNo}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedApp.studentId}</span>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-white/30 ml-1 mb-2 block">
              Action Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-medium outline-none dark:text-white"
              required
            >
              <option value="PENDING">Pending</option>
              <option value="VERIFIED">Verified (Docs Check)</option>
              <option value="APPROVED">Approved (Final)</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              className="flex-1 bg-transparent border-none"
              onClick={() => setIsUpdateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
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
