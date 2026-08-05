import { useState, useEffect } from 'react';
import {
    Plus,
    Edit,
    Trash2,
    Bell,
    Building2,
    Tag,
    Eye,
    Calendar,
    CheckCircle2,
    RefreshCw
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import { getAllNotices, createNotice, updateNotice, deleteNotice, incrementView } from '../../api/noticeApi';
import client from '../../api/client';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '../../utils/formatDate';
import useAuth from '../../hooks/useAuth';
import { useNoticeStore } from '../../store/noticeStore';

const categories = [
    'General',
    'Academic',
    'Examination',
    'Class Schedule',
    'Tuition Fee',
    'Administrative',
    'Event',
    'Registration'
];

const NoticeManagement = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [departments, setDepartments] = useState([]);
    const { isAdmin } = useAuth();
    const { decrementUnread, refresh } = useNoticeStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNotice, setEditingNotice] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    const [selectedViewNotice, setSelectedViewNotice] = useState(null);
    const [readNotices, setReadNotices] = useState(() => {
        const saved = localStorage.getItem('readNotices');
        return saved ? JSON.parse(saved) : [];
    });

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'General',
        targetRole: 'ALL',
        departmentId: ''
    });

    const fetchNotices = async () => {
        const isInitial = notices.length === 0;
        if (isInitial) setLoading(true);
        else setRefreshing(true);

        try {
            const res = await getAllNotices();
            setNotices(res.data.content || res.data);
        } catch (err) {
            toast.error('Failed to fetch notices');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const fetchDepts = async () => {
        try {
            const res = await client.get('/departments');
            setDepartments(res.data.content || res.data);
        } catch (err) {}
    };

    useEffect(() => {
        fetchNotices();
        fetchDepts();
    }, []);

    const handleAddClick = () => {
        setEditingNotice(null);
        setFormData({ title: '', content: '', category: 'General', targetRole: 'ALL', departmentId: '' });
        setIsModalOpen(true);
    };

    const handleEditClick = (e, notice) => {
        e.stopPropagation();
        setEditingNotice(notice);
        setFormData({
            title: notice.title,
            content: notice.content,
            category: notice.category || 'General',
            targetRole: notice.targetRole,
            departmentId: departments.find(d => d.name === notice.departmentName)?.id || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm('Delete this notice?')) return;
        try {
            await deleteNotice(id);
            toast.success('Notice deleted');
            fetchNotices();
            refresh();
        } catch (err) {
            toast.error('Failed to delete notice');
        }
    };

    const handleNoticeClick = async (notice) => {
        setSelectedViewNotice(notice);
        if (!readNotices.includes(notice.id)) {
            const updated = [...readNotices, notice.id];
            setReadNotices(updated);
            localStorage.setItem('readNotices', JSON.stringify(updated));
            decrementUnread();
        }
        try {
            const res = await incrementView(notice.id);
            const latestCount = res.data || res;
            if (typeof latestCount === 'number') {
                setNotices(prev => prev.map(n => n.id === notice.id ? { ...n, viewCount: latestCount } : n));
                setSelectedViewNotice(prev => prev ? { ...prev, viewCount: latestCount } : null);
            }
        } catch (err) {}
    };

    const handleMarkAllRead = () => {
        const allIds = notices.map(n => n.id);
        const newRead = [...new Set([...readNotices, ...allIds])];
        setReadNotices(newRead);
        localStorage.setItem('readNotices', JSON.stringify(newRead));
        refresh();
        toast.success('All notices marked as read');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            if (editingNotice) {
                await updateNotice(editingNotice.id, formData);
                toast.success('Notice updated');
            } else {
                await createNotice(formData);
                toast.success('Notice published');
                refresh();
            }
            setIsModalOpen(false);
            fetchNotices();
        } catch (err) {
            toast.error('Operation failed');
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-20 pt-4">
            {/* Top Action Bar */}
            <div className="flex justify-end items-center gap-2 sm:gap-3">
                <Button onClick={fetchNotices} variant="secondary" className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-white/10">
                    <RefreshCw size={18} className={loading || refreshing ? 'animate-spin' : ''} />
                </Button>
                <Button variant="secondary" onClick={handleMarkAllRead} className="flex items-center gap-2 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-white/10 font-bold text-xs sm:text-sm py-2.5 px-3.5 sm:px-4">
                    <CheckCircle2 size={16} />
                    <span className="hidden sm:inline">Mark All Read</span>
                </Button>
                <Button onClick={handleAddClick} className="bg-[#2D2A4F] hover:bg-[#1E1C38] text-white flex items-center gap-2 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm py-2.5 px-4 border-none">
                    <Plus size={16} />
                    <span>Post Notice</span>
                </Button>
            </div>

            {/* Notices List Grid */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6 relative">
                {refreshing && (
                    <div className="absolute inset-x-0 -top-2 h-0.5 bg-emerald-500/10 overflow-hidden z-20">
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            className="h-full w-1/3 bg-[#007A55]"
                        />
                    </div>
                )}
                <AnimatePresence mode="popLayout">
                    <div className={`space-y-4 sm:space-y-6 transition-opacity duration-200 ${refreshing ? 'opacity-50' : 'opacity-100'}`}>
                        {loading && notices.length === 0 ? (
                            <div className="py-20 flex justify-center"><Loader size="lg" /></div>
                        ) : notices.length > 0 ? notices.map((notice, idx) => {
                            const isRead = readNotices.includes(notice.id);
                            return (
                                <motion.div
                                    key={notice.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ delay: idx * 0.03 }}
                                >
                                    <Card
                                        onClick={() => handleNoticeClick(notice)}
                                        className={`border border-slate-200/80 dark:border-white/10 bg-white dark:bg-gray-800/80 rounded-2xl sm:rounded-3xl hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-colors group !p-0 overflow-hidden cursor-pointer ${
                                            !isRead ? 'border-l-4 border-l-[#007A55] dark:border-l-emerald-400' : ''
                                        }`}
                                    >
                                        <div className="flex flex-col md:flex-row">
                                            <div className={`md:w-1.5 shrink-0 ${!isRead ? 'bg-[#007A55] dark:bg-emerald-400' : 'bg-transparent'}`} />
                                            <div className="flex-1 p-4 sm:p-6 flex justify-between items-start">
                                                <div className="space-y-2.5 sm:space-y-3 flex-1 min-w-0 pr-2">
                                                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                                                        {!isRead && (
                                                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 border border-amber-200 dark:border-amber-500/20 text-[9px] font-black uppercase tracking-widest rounded-md">New</span>
                                                        )}
                                                        <span className={`px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-widest border ${
                                                            notice.targetRole === 'ALL'
                                                                ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/20'
                                                                : notice.targetRole === 'STUDENT'
                                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/20'
                                                                    : 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/20'
                                                        }`}>
                              {notice.targetRole}
                            </span>
                                                        <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-widest flex items-center">
                              <Tag size={10} className="mr-1 shrink-0" /> {notice.category}
                            </span>
                                                        {notice.departmentName !== 'ALL' && (
                                                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-white/50 border border-slate-200/80 dark:border-white/10 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-widest flex items-center">
                                <Building2 size={10} className="mr-1 shrink-0" /> {notice.departmentName}
                              </span>
                                                        )}
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight flex items-center">
                              <Calendar size={10} className="mr-1 shrink-0" /> {formatDate(notice.createdAt)}
                            </span>
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight flex items-center">
                              <Eye size={10} className="mr-1 shrink-0" /> {notice.viewCount || 0}
                            </span>
                                                    </div>
                                                    <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-[#007A55] dark:group-hover:text-emerald-400 transition-colors truncate">{notice.title}</h3>
                                                    <p className="text-slate-500 dark:text-white/40 text-xs sm:text-sm line-clamp-2 leading-relaxed">{notice.content}</p>
                                                </div>
                                                <div className="flex gap-1 shrink-0 ml-2">
                                                    <button onClick={(e) => handleEditClick(e, notice)} className="p-1.5 sm:p-2 text-slate-400 hover:text-[#007A55] hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-all border border-transparent hover:border-emerald-100 dark:hover:border-emerald-500/20" title="Edit">
                                                        <Edit size={16} />
                                                    </button>
                                                    {isAdmin && (
                                                        <button onClick={(e) => handleDelete(e, notice.id)} className="p-1.5 sm:p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-100 dark:hover:border-red-500/20" title="Delete">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        }) : (
                            <Card className="py-16 text-center border border-dashed border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] rounded-2xl sm:rounded-3xl">
                                <Bell className="mx-auto text-slate-300 dark:text-white/20 mb-3" size={40} />
                                <p className="text-slate-400 dark:text-white/30 text-xs sm:text-sm italic">No notices published yet.</p>
                            </Card>
                        )}
                    </div>
                </AnimatePresence>
            </div>

            {/* View Notice Modal */}
            <Modal
                isOpen={!!selectedViewNotice}
                onClose={() => setSelectedViewNotice(null)}
                title="View Notice Details"
                size="lg"
            >
                {selectedViewNotice && (
                    <div className="space-y-4 sm:space-y-6 py-1">
                        <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-[#007A55] dark:text-emerald-300 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center border border-emerald-100 dark:border-emerald-500/20">
                <Calendar size={12} className="mr-1.5 shrink-0" /> {formatDate(selectedViewNotice.createdAt)}
              </span>
                            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center border border-indigo-100 dark:border-indigo-500/20">
                <Tag size={12} className="mr-1.5 shrink-0" /> {selectedViewNotice.category}
              </span>
                            {selectedViewNotice.departmentName !== 'ALL' && (
                                <span className="px-3 py-1 bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-white/50 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center border border-slate-200/80 dark:border-white/10">
                  <Building2 size={12} className="mr-1.5 shrink-0" /> {selectedViewNotice.departmentName}
                </span>
                            )}
                        </div>

                        <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                            {selectedViewNotice.title}
                        </h2>

                        <div className="p-4 sm:p-6 bg-slate-50/70 dark:bg-white/[0.04] rounded-2xl border border-slate-200/80 dark:border-white/[0.06]">
                            <p className="text-slate-700 dark:text-white/70 leading-relaxed whitespace-pre-wrap font-medium text-xs sm:text-sm">
                                {selectedViewNotice.content}
                            </p>
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-white/[0.06]">
                            <div className="flex items-center text-slate-400 dark:text-white/30 gap-1.5">
                                <Eye size={15} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{selectedViewNotice.viewCount || 0} Views</span>
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Target: <span className="text-[#007A55] dark:text-emerald-300">{selectedViewNotice.targetRole}</span>
                            </p>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Add/Edit Notice Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingNotice ? 'Edit Notice' : 'Post New Notice'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 py-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                        <div className="md:col-span-2">
                            <Input
                                label="Notice Title"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                placeholder="e.g. Mid-term Exam Schedule Update"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-white/70 mb-1.5 ml-1">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium outline-none dark:text-white cursor-pointer"
                            >
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-white/70 mb-1.5 ml-1">Target Role</label>
                            <select
                                value={formData.targetRole}
                                onChange={(e) => setFormData({...formData, targetRole: e.target.value})}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium outline-none dark:text-white cursor-pointer"
                            >
                                <option value="ALL">Everyone</option>
                                <option value="STUDENT">Students Only</option>
                                <option value="FACULTY">Faculty Only</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-white/70 mb-1.5 ml-1">Department (Optional)</label>
                            <select
                                value={formData.departmentId}
                                onChange={(e) => setFormData({...formData, departmentId: e.target.value})}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium outline-none dark:text-white cursor-pointer"
                            >
                                <option value="">All Departments</option>
                                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 dark:text-white/70 mb-1.5 ml-1">Content</label>
                        <textarea
                            required
                            rows="6"
                            value={formData.content}
                            onChange={(e) => setFormData({...formData, content: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium outline-none dark:text-white leading-relaxed"
                            placeholder="Write the notice details here..."
                        />
                    </div>

                    <div className="flex justify-end pt-3">
                        <Button type="submit" isLoading={formLoading} className="w-full sm:w-auto px-10 bg-[#2D2A4F] hover:bg-[#1E1C38] text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm py-3 border-none">
                            {editingNotice ? 'Update Notice' : 'Publish Notice'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default NoticeManagement;