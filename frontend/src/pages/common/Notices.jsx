import { useState, useEffect } from 'react';
import {
    Calendar,
    ChevronRight,
    Search,
    Info,
    Building2,
    Tag,
    Eye,
    ChevronLeft,
    Clock,
    FileText,
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
        if (typeof window === 'undefined') return [];
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
                    departmentId: selectedDept === 'all' ? undefined : selectedDept,
                });
                setNotices(res.data.content || []);
                setTotalPages(res.data.totalPages || 0);
                setTotalElements(res.data.totalElements || 0);
            } else {
                res = await getNotices();
                let data = res.data || [];
                if (selectedDept !== 'all') {
                    data = data.filter((n) => n.departmentId === selectedDept);
                }
                if (search) {
                    data = data.filter(
                        (n) => n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase())
                    );
                }
                setNotices(data);
                setTotalPages(1);
                setTotalElements(data.length);
            }
        } catch (err) {
            // silent
        } finally {
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
        try {
            await incrementView(notice.id);
            setNotices((prev) => prev.map((n) => (n.id === notice.id ? { ...n, viewCount: n.viewCount + 1 } : n)));
        } catch (err) {}
    };

    const getDay = (dateStr) => new Date(dateStr).getDate();

    const getMonthYear = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleString('en-US', { month: 'short' }) + ', ' + date.getFullYear().toString().substr(-2);
    };

    if (loading && page === 0 && !notices.length)
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-20 pt-4">
            {/* Top Action Bar (Search Input) */}
            <div className="flex justify-end">
                <div className="relative w-full sm:w-80 group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30 group-focus-within:text-[#007A55] transition-colors" size={17} />
                    <input
                        placeholder="Search notices..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0B1225] border border-slate-200/80 dark:border-white/10 rounded-xl sm:rounded-2xl shadow-sm outline-none focus:border-[#007A55] focus:ring-4 focus:ring-[#007A55]/10 transition-all dark:text-white text-xs sm:text-sm font-medium"
                    />
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 pb-1">
                <button
                    onClick={() => setSelectedDept('all')}
                    className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                        selectedDept === 'all'
                            ? 'bg-[#007A55] text-white shadow-sm'
                            : 'bg-white dark:bg-white/[0.06] text-slate-600 dark:text-white/50 border border-slate-200/80 dark:border-white/10 hover:border-[#007A55]/30'
                    }`}
                >
                    All Departments
                </button>
                {departments.map((dept) => (
                    <button
                        key={dept.id}
                        onClick={() => setSelectedDept(dept.id)}
                        className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                            selectedDept === dept.id
                                ? 'bg-[#007A55] text-white shadow-sm'
                                : 'bg-white dark:bg-white/[0.06] text-slate-600 dark:text-white/50 border border-slate-200/80 dark:border-white/10 hover:border-[#007A55]/30'
                        }`}
                    >
                        <span>{dept.code}</span>
                    </button>
                ))}
            </div>

            {/* Notice List */}
            <div className="space-y-3 sm:space-y-4">
                <AnimatePresence mode="popLayout">
                    {loading ? (
                        <div className="py-16 flex justify-center">
                            <Loader />
                        </div>
                    ) : notices.length > 0 ? (
                        notices.map((notice, idx) => {
                            const isRead = readNotices.includes(notice.id);
                            return (
                                <motion.div
                                    key={notice.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -12 }}
                                    transition={{ delay: idx * 0.03, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <button onClick={() => handleNoticeClick(notice)} className="w-full text-left group">
                                        <Card
                                            className={`!p-0 border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden rounded-2xl sm:rounded-3xl ${
                                                !isRead ? 'ring-2 ring-[#007A55]/20 border-[#007A55]/30' : 'border-slate-200/80 dark:border-white/10'
                                            }`}
                                        >
                                            <div className="flex flex-col sm:flex-row">
                                                <div className="w-full sm:w-24 bg-gradient-to-br from-[#007A55] to-[#00956A] flex sm:flex-col items-center justify-between sm:justify-center px-4 py-3 sm:py-0 text-white shrink-0">
                                                    <span className="text-2xl sm:text-3xl font-black leading-none">{getDay(notice.createdAt)}</span>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest sm:mt-1 opacity-90">
                                                        {getMonthYear(notice.createdAt)}
                                                    </span>
                                                </div>

                                                <div className="flex-1 p-4 sm:p-6 space-y-2.5 sm:space-y-3">
                                                    <div className="flex justify-between items-start gap-3">
                                                        <h3 className="text-sm sm:text-[16px] font-bold tracking-tight text-slate-900 dark:text-white leading-snug group-hover:text-[#007A55] transition-colors">
                                                            {notice.title}
                                                        </h3>
                                                        {!isRead && (
                                                            <span className="shrink-0 px-2 py-0.5 bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-200/80 dark:border-amber-500/20">
                                                                New
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-tight text-slate-400 dark:text-white/40">
                                                        <div className="flex items-center">
                                                            <Building2 size={13} className="mr-1 shrink-0 opacity-70" />
                                                            <span>{notice.departmentName}</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Tag size={13} className="mr-1 shrink-0 opacity-70" />
                                                            <span>{notice.category || 'General'}</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Clock size={13} className="mr-1 shrink-0 opacity-70" />
                                                            <span>{new Date(notice.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Eye size={13} className="mr-1 shrink-0 opacity-70" />
                                                            <span>{notice.viewCount || 0}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </button>
                                </motion.div>
                            );
                        })
                    ) : (
                        <Card className="py-16 text-center border-dashed border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] rounded-2xl sm:rounded-3xl">
                            <Info className="mx-auto text-slate-300 dark:text-white/10 mb-3" size={36} />
                            <h3 className="text-xs sm:text-sm font-bold text-slate-500 dark:text-white/30">No notices found for this selection.</h3>
                        </Card>
                    )}
                </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-white/30">
                        Total Notices: <span className="text-[#007A55] dark:text-emerald-300">{totalElements}</span>
                    </p>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <button
                            disabled={page === 0}
                            onClick={() => setPage((p) => p - 1)}
                            className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 disabled:opacity-30 text-slate-500 dark:text-white/40 hover:border-[#007A55]/30 transition shadow-sm"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i)}
                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                                    page === i
                                        ? 'bg-[#007A55] text-white shadow-sm'
                                        : 'bg-white dark:bg-white/[0.06] text-slate-500 dark:text-white/40 border border-slate-200/80 dark:border-white/10 hover:border-[#007A55]/20'
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            disabled={page === totalPages - 1}
                            onClick={() => setPage((p) => p + 1)}
                            className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 disabled:opacity-30 text-slate-500 dark:text-white/40 hover:border-[#007A55]/30 transition shadow-sm"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            <Modal isOpen={!!selectedNotice} onClose={() => setSelectedNotice(null)} title="Official Notice" size="lg">
                <div className="space-y-5 sm:space-y-6">
                    <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#007A55] bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-500/20">
                            <Calendar size={11} />
                            <span>{formatDate(selectedNotice?.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-500/20">
                            <Tag size={11} />
                            <span>{selectedNotice?.category || 'General'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 dark:bg-white/[0.06] px-3 py-1 rounded-full border border-slate-200/80 dark:border-white/10">
                            <Building2 size={11} />
                            <span>{selectedNotice?.departmentName}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                            {selectedNotice?.title}
                        </h2>
                        <div className="h-1 w-16 bg-[#007A55] rounded-full" />
                    </div>

                    <div className="bg-slate-50/70 dark:bg-white/[0.04] p-4 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-white/[0.06]">
                        <p className="text-slate-700 dark:text-white/80 leading-relaxed text-xs sm:text-sm whitespace-pre-wrap font-medium">
                            {selectedNotice?.content}
                        </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-emerald-50 dark:bg-emerald-500/10 text-[#007A55] dark:text-emerald-300 rounded-full flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20">
                                <FileText size={16} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30">Posted By</p>
                                <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">{selectedNotice?.postedByName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 dark:text-white/30">
                            <Eye size={15} />
                            <span className="text-xs font-bold uppercase tracking-widest">{selectedNotice?.viewCount || 0} Views</span>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Notices;