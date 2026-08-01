import { useState, useEffect } from 'react';
import {
  Bell,
  Calendar,
  ChevronRight,
  Search,
  Info,
  Building2,
  Tag,
  Eye,
  ChevronLeft,
  MapPin,
  Clock,
  FileText
} from 'lucide-react';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import { getAllNotices, getNotices, incrementView } from '../../api/noticeApi';
import client from '../../api/client';
import useAuth from '../../hooks/useAuth';
import { useNoticeStore } from '../../store/noticeStore';
import { formatDate } from '../../utils/formatDate';
import { motion, AnimatePresence } from 'framer-motion';

const Notices = () => {
  const { isAdmin, isRegistrar } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [departments, setDepartments] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  const { decrementUnread } = useNoticeStore();

  const [readNotices, setReadNotices] = useState(() => {
    const saved = localStorage.getItem('readNotices');
    return saved ? JSON.parse(saved) : [];
  });

  const fetchNotices = async () => {
    setLoading(true);
    try {
      let res;
      if (isAdmin || isRegistrar) {
        res = await getAllNotices({
          page,
          size: pageSize,
          search: search || undefined,
          departmentId: selectedDept === 'all' ? undefined : selectedDept
        });
        setNotices(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setTotalElements(res.data.totalElements || 0);
      } else {
        // Regular users get their specific notices
        res = await getNotices();
        let data = res.data || [];
        // Local filtering for regular users if needed, or backend can support params later
        if (selectedDept !== 'all') {
            data = data.filter(n => n.departmentId === selectedDept);
        }
        if (search) {
            data = data.filter(n => n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()));
        }
        setNotices(data);
        setTotalPages(1);
        setTotalElements(data.length);
      }
    } catch (err) {} finally {
      setLoading(false);
    }
  };

  const fetchDepts = async () => {
    try {
      const res = await client.get('/departments');
      setDepartments(res.data.content || res.data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchDepts();
  }, []);

  useEffect(() => {
    fetchNotices();
  }, [page, selectedDept]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 0) fetchNotices();
      else setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleNoticeClick = async (notice) => {
    setSelectedNotice(notice);
    if (!readNotices.includes(notice.id)) {
      const updated = [...readNotices, notice.id];
      setReadNotices(updated);
      localStorage.setItem('readNotices', JSON.stringify(updated));
      decrementUnread();
    }
    // Increment view count in background
    try {
      await incrementView(notice.id);
      // Update local state to show +1 view immediately
      setNotices(prev => prev.map(n => n.id === notice.id ? { ...n, viewCount: n.viewCount + 1 } : n));
    } catch (err) {}
  };

  const getDay = (dateStr) => {
    const date = new Date(dateStr);
    return date.getDate();
  };

  const getMonthYear = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', { month: 'short' }) + ', ' + date.getFullYear().toString().substr(-2);
  };

  if (loading && page === 0 && !notices.length) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Notice Board</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Official announcements and academic updates.</p>
        </div>

        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
          <input
            placeholder="Search notices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-primary-500/20 transition-all dark:text-white text-sm"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-2">
        <button
          onClick={() => setSelectedDept('all')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${selectedDept === 'all' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700 hover:border-primary-200'}`}
        >
          All Departments
        </button>
        {departments.map(dept => (
          <button
            key={dept.id}
            onClick={() => setSelectedDept(dept.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center space-x-2 ${selectedDept === dept.id ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700 hover:border-primary-200'}`}
          >
            <span>{dept.code}</span>
            {/* Mock counts for now or handle dynamic counts later */}
            {/* <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${selectedDept === dept.id ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>0</span> */}
          </button>
        ))}
      </div>

      {/* Notice List */}
      <div className="space-y-6">
         <AnimatePresence mode="popLayout">
           {loading ? (
             <div className="py-20 flex justify-center"><Loader /></div>
           ) : notices.length > 0 ? notices.map((notice, idx) => {
             const isRead = readNotices.includes(notice.id);
             return (
               <motion.div
                 key={notice.id}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -20 }}
                 transition={{ delay: idx * 0.05 }}
               >
                 <button
                   onClick={() => handleNoticeClick(notice)}
                   className="w-full text-left group"
                 >
                   <Card className={`!p-0 border-none hover:shadow-xl transition-all duration-300 overflow-hidden ${!isRead ? 'ring-2 ring-primary-500/20' : ''}`}>
                      <div className="flex flex-col md:flex-row">
                         {/* Date Block */}
                         <div className="w-full md:w-24 bg-primary-600 dark:bg-primary-700 flex flex-col items-center justify-center py-4 md:py-0 text-white shrink-0">
                            <span className="text-3xl font-black leading-none">{getDay(notice.createdAt)}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-80">{getMonthYear(notice.createdAt)}</span>
                         </div>

                         {/* Content Block */}
                         <div className="flex-1 p-6 space-y-4">
                            <div className="flex justify-between items-start">
                               <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-primary-600 transition-colors">
                                  {notice.title}
                               </h3>
                               {!isRead && (
                                 <span className="shrink-0 ml-4 px-2 py-1 bg-amber-100 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-md">New</span>
                               )}
                            </div>

                            {/* Meta row */}
                            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-[11px] font-bold text-gray-400 uppercase tracking-tight">
                               <div className="flex items-center">
                                  <Building2 size={14} className="mr-1.5 text-gray-300" />
                                  <span>{notice.departmentName}</span>
                               </div>
                               <div className="flex items-center">
                                  <Tag size={14} className="mr-1.5 text-gray-300" />
                                  <span>{notice.category || 'General'}</span>
                               </div>
                               <div className="flex items-center">
                                  <Clock size={14} className="mr-1.5 text-gray-300" />
                                  <span>{new Date(notice.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                               </div>
                               <div className="flex items-center">
                                  <Eye size={14} className="mr-1.5 text-gray-300" />
                                  <span>{notice.viewCount || 0}</span>
                               </div>
                            </div>
                         </div>
                      </div>
                   </Card>
                 </button>
               </motion.div>
             );
           }) : (
             <Card className="py-20 text-center border-dashed">
                <Info className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-lg font-bold text-gray-400">No notices found for this selection.</h3>
             </Card>
           )}
         </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
           <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Total Notices: <span className="text-primary-600">{totalElements}</span></p>
           <div className="flex items-center space-x-2">
              <button
                disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
                className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 disabled:opacity-30 text-gray-500"
              >
                <ChevronLeft size={20} />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${page === i ? 'bg-primary-600 text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-500 border border-gray-100 dark:border-gray-700 hover:border-primary-200'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={page === totalPages - 1}
                onClick={() => setPage(p => p + 1)}
                className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 disabled:opacity-30 text-gray-500"
              >
                <ChevronRight size={20} />
              </button>
           </div>
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedNotice}
        onClose={() => setSelectedNotice(null)}
        title="Official Notice"
        size="lg"
      >
        <div className="space-y-8">
           <div className="flex flex-wrap gap-3">
              <div className="flex items-center space-x-2 text-[10px] font-black text-primary-600 bg-primary-50 dark:bg-primary-900/30 px-3 py-1.5 rounded-lg uppercase tracking-widest">
                 <Calendar size={14} />
                 <span>{formatDate(selectedNotice?.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-2 text-[10px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-lg uppercase tracking-widest">
                 <Tag size={14} />
                 <span>{selectedNotice?.category || 'General'}</span>
              </div>
              <div className="flex items-center space-x-2 text-[10px] font-black text-gray-500 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg uppercase tracking-widest">
                 <Building2 size={14} />
                 <span>{selectedNotice?.departmentName}</span>
              </div>
           </div>

           <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight">{selectedNotice?.title}</h2>
              <div className="h-1.5 w-20 bg-primary-600 rounded-full" />
           </div>

           <div className="bg-gray-50 dark:bg-gray-800/50 p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                 {selectedNotice?.content}
              </p>
           </div>

           <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full flex items-center justify-center">
                    <FileText size={20} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Posted By</p>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{selectedNotice?.postedByName}</p>
                 </div>
              </div>
              <div className="flex items-center text-gray-400 space-x-2">
                 <Eye size={16} />
                 <span className="text-xs font-bold uppercase tracking-widest">{selectedNotice?.viewCount || 0} Views</span>
              </div>
           </div>
        </div>
      </Modal>
    </div>
  );
};

export default Notices;
