import { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Bell,
  Users,
  Building2,
  Tag,
  Eye,
  Calendar,
  FileText,
  CheckCircle2
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
    setLoading(true);
    try {
      const res = await getAllNotices();
      setNotices(res.data.content || res.data);
    } catch (err) {
      toast.error('Failed to fetch notices');
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
      refresh(); // Refresh unread count
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
    // Increment view count and get latest count from backend
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
        refresh(); // Refresh unread count for the poster too
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-200">Notice Board Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-200">Publish and manage university-wide announcements.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleMarkAllRead} className="flex items-center space-x-2 border-gray-200 text-gray-600 hover:bg-gray-50">
            <CheckCircle2 size={18} />
            <span>Mark All Read</span>
          </Button>
          <Button onClick={handleAddClick} className="flex items-center space-x-2">
            <Plus size={20} />
            <span>Post Notice</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="py-20 flex justify-center"><Loader size="lg" /></div>
          ) : notices.length > 0 ? notices.map((notice, idx) => {
            const isRead = readNotices.includes(notice.id);
            return (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card
                  onClick={() => handleNoticeClick(notice)}
                  className={`hover:border-primary-300 transition-all group !p-0 overflow-hidden cursor-pointer ${!isRead ? 'ring-2 ring-primary-500/10 border-primary-200' : ''}`}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className={`md:w-2 shrink-0 ${!isRead ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-700'}`} />
                    <div className="flex-1 p-6 flex justify-between items-start">
                        <div className="space-y-3 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                              {!isRead && (
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-md">New</span>
                              )}
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${notice.targetRole === 'ALL' ? 'bg-blue-100 text-blue-600' : notice.targetRole === 'STUDENT' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'}`}>
                                {notice.targetRole}
                              </span>
                              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center">
                                <Tag size={10} className="mr-1" /> {notice.category}
                              </span>
                              {notice.departmentName !== 'ALL' && (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center">
                                  <Building2 size={10} className="mr-1" /> {notice.departmentName}
                                </span>
                              )}
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight flex items-center">
                                <Calendar size={10} className="mr-1" /> {formatDate(notice.createdAt)}
                              </span>
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight flex items-center">
                                <Eye size={10} className="mr-1" /> {notice.viewCount || 0}
                              </span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">{notice.title}</h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed">{notice.content}</p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button onClick={(e) => handleEditClick(e, notice)} className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-all" title="Edit"><Edit size={16} /></button>
                          {isAdmin && (
                            <button onClick={(e) => handleDelete(e, notice.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete"><Trash2 size={16} /></button>
                          )}
                        </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          }) : (
            <Card className="py-20 text-center border-dashed">
               <Bell className="mx-auto text-gray-300 mb-4" size={48} />
               <p className="text-gray-500 italic">No notices published yet.</p>
            </Card>
          )}
        </AnimatePresence>
      </div>

      {/* View Modal */}
      <Modal
        isOpen={!!selectedViewNotice}
        onClose={() => setSelectedViewNotice(null)}
        title="View Notice Details"
        size="lg"
      >
        {selectedViewNotice && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-xs font-bold flex items-center">
                <Calendar size={14} className="mr-2" /> {formatDate(selectedViewNotice.createdAt)}
              </span>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold flex items-center">
                <Tag size={14} className="mr-2" /> {selectedViewNotice.category}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold flex items-center">
                <Building2 size={14} className="mr-2" /> {selectedViewNotice.departmentName}
              </span>
            </div>

            <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
              {selectedViewNotice.title}
            </h2>

            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {selectedViewNotice.content}
              </p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800">
               <div className="flex items-center text-gray-400 space-x-2">
                  <Eye size={16} />
                  <span className="text-xs font-bold uppercase tracking-widest">{selectedViewNotice.viewCount || 0} Views</span>
               </div>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                 Target: <span className="text-primary-600">{selectedViewNotice.targetRole}</span>
               </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingNotice ? 'Edit Notice' : 'Post New Notice'}
        size="lg"
      >
         <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/20 text-sm dark:text-white"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Target Role</label>
                  <select
                    value={formData.targetRole}
                    onChange={(e) => setFormData({...formData, targetRole: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/20 text-sm dark:text-white"
                  >
                    <option value="ALL">Everyone</option>
                    <option value="STUDENT">Students Only</option>
                    <option value="FACULTY">Faculty Only</option>
                  </select>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Department (Optional)</label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => setFormData({...formData, departmentId: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/20 text-sm dark:text-white"
                  >
                    <option value="">All Departments</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
               </div>
            </div>

            <div className="space-y-1.5">
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Content</label>
               <textarea
                 required
                 rows="8"
                 value={formData.content}
                 onChange={(e) => setFormData({...formData, content: e.target.value})}
                 className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/20 text-sm dark:text-white leading-relaxed"
                 placeholder="Write the notice details here..."
               />
            </div>

            <div className="flex justify-end pt-4">
               <Button type="submit" isLoading={formLoading} className="px-16 py-3">
                  {editingNotice ? 'Update Notice' : 'Publish Notice'}
               </Button>
            </div>
         </form>
      </Modal>
    </div>
  );
};

export default NoticeManagement;
