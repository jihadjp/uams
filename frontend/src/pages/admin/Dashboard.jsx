import {
    Users,
    UserSquare2,
    BookOpen,
    Building2,
    Bell,
    Layers,
    Plus,
    Calendar,
    GraduationCap,
    Send,
    Eye,
    Tag,
    PackageOpen,
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import useFetch from '../../hooks/useFetch';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { formatDate } from '../../utils/formatDate';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getActiveSemester } from '../../api/semesterApi';
import { incrementView } from '../../api/noticeApi';
import { useEffect, useState } from 'react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { data: stats, loading: statsLoading } = useFetch('/admin/dashboard/stats');
    const { data: noticesData, loading: noticesLoading } = useFetch('/notices?size=5');
    const [activeSemester, setActiveSemester] = useState(null);
    const [semLoading, setSemLoading] = useState(true);
    const [selectedNotice, setSelectedNotice] = useState(null);

    useEffect(() => {
        const fetchActiveSem = async () => {
            try {
                const res = await getActiveSemester();
                setActiveSemester(res.data || res);
            } catch (err) {
                // silent
            } finally {
                setSemLoading(false);
            }
        };
        fetchActiveSem();
    }, []);

    const finalStats = {
        totalStudents: stats?.totalStudents || 0,
        totalFaculty: stats?.totalFaculty || 0,
        totalCourses: stats?.totalCourses || 0,
        totalDepartments: stats?.totalDepartments || 0,
        studentsByDepartment: stats?.studentsByDepartment || [],
        studentStatusDistribution: stats?.studentStatusDistribution || [],
    };

    const chartData =
        finalStats.studentsByDepartment.length > 0
            ? finalStats.studentsByDepartment.map((dept) => ({
                ...dept,
                code: dept.code || dept.shortName || dept.name || 'N/A',
                students: dept.students || dept.count || 0,
            }))
            : [{ code: 'N/A', students: 0 }];

    const pieData =
        finalStats.studentStatusDistribution.length > 0
            ? finalStats.studentStatusDistribution
            : [
                { name: 'Active', value: 0, color: '#007A55' },
                { name: 'Graduated', value: 0, color: '#10b981' },
                { name: 'Dropped', value: 0, color: '#ef4444' },
            ];

    const notices = noticesData?.content || [];

    const handleNoticeClick = async (notice) => {
        setSelectedNotice(notice);
        try {
            const res = await incrementView(notice.id);
            const latestCount = res.data || res;
            if (typeof latestCount === 'number') {
                setSelectedNotice((prev) => (prev ? { ...prev, viewCount: latestCount } : null));
            }
        } catch (err) {}
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-20 pt-4"
        >
            {/* Top Action Bar (Active Term Badge - Border Only) */}
            <div className="flex justify-end">
                <motion.div
                    whileHover={{ y: -2 }}
                    className="flex items-center space-x-3 bg-white dark:bg-[#0B1225] p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-white/10 cursor-default"
                >
                    {semLoading ? (
                        <div className="flex items-center space-x-3 px-3 py-1.5">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-100 dark:bg-white/5 rounded-lg sm:rounded-xl animate-pulse" />
                            <div className="space-y-1.5">
                                <div className="h-2 bg-slate-100 dark:bg-white/5 rounded w-14 animate-pulse" />
                                <div className="h-3 bg-slate-200 dark:bg-white/10 rounded w-20 animate-pulse" />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#007A55] flex items-center justify-center text-white shrink-0">
                                <Layers size={20} className="sm:w-5 sm:h-5" />
                            </div>
                            <div className="pr-3 sm:pr-4">
                                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30">
                                    Active Term
                                </p>
                                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                    {activeSemester?.name || 'No Active Term'}
                                </p>
                            </div>
                        </>
                    )}
                </motion.div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {statsLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-24 bg-white dark:bg-[#0B1225] rounded-2xl sm:rounded-3xl animate-pulse border border-slate-200/80 dark:border-white/10"
                        />
                    ))
                ) : (
                    <>
                        <StatCard
                            icon={Users}
                            label="Total Students"
                            value={finalStats.totalStudents}
                            delay={0.1}
                            color="primary"
                            onClick={() => navigate('/portal/students')}
                        />
                        <StatCard
                            icon={UserSquare2}
                            label="Total Faculty"
                            value={finalStats.totalFaculty}
                            delay={0.2}
                            color="info"
                            onClick={() => navigate('/portal/faculty')}
                        />
                        <StatCard
                            icon={BookOpen}
                            label="Total Courses"
                            value={finalStats.totalCourses}
                            delay={0.3}
                            color="success"
                            onClick={() => navigate('/portal/courses')}
                        />
                        <StatCard
                            icon={Building2}
                            label="Total Departments"
                            value={finalStats.totalDepartments}
                            delay={0.4}
                            color="warning"
                            onClick={() => navigate('/portal/departments')}
                        />
                    </>
                )}
            </div>

            {/* Quick Actions */}
            <Card title="Quick Actions" subtitle="Frequently used management tools" className="rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/10 overflow-hidden !p-5 sm:!p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-2">
                    {[
                        { label: 'Add Student', icon: Plus, path: '/portal/students', color: 'bg-blue-500' },
                        { label: 'Create Course', icon: GraduationCap, path: '/portal/courses', color: 'bg-indigo-500' },
                        { label: 'Initialize Term', icon: Calendar, path: '/portal/semesters', color: 'bg-amber-500' },
                        { label: 'Post Notice', icon: Send, path: '/portal/notices', color: 'bg-emerald-500' },
                    ].map((action, i) => (
                        <motion.button
                            key={i}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(action.path)}
                            className="flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50/70 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.06] hover:border-[#007A55]/30 dark:hover:border-emerald-500/30 transition-all group"
                        >
                            <div
                                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${action.color} text-white flex items-center justify-center mb-2 opacity-90 group-hover:opacity-100 transition-opacity`}
                            >
                                <action.icon size={18} className="sm:w-5 sm:h-5" />
                            </div>
                            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-tight text-slate-600 dark:text-white/50">
                                {action.label}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                {/* Bar Chart */}
                <div className="lg:col-span-2 min-w-0">
                    <Card title="Students by Department" subtitle="Enrollment distribution across departments" className="rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/10 overflow-hidden !p-5 sm:!p-6">
                        {statsLoading ? (
                            <div className="h-72 sm:h-80 w-full bg-slate-50 dark:bg-white/[0.03] animate-pulse rounded-xl mt-4" />
                        ) : (
                            <div className="h-72 sm:h-80 w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <defs>
                                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#007A55" stopOpacity={0.9} />
                                                <stop offset="100%" stopColor="#007A55" stopOpacity={0.4} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:opacity-10" />
                                        <XAxis
                                            dataKey="code"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }}
                                            dy={10}
                                        />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#0B1225',
                                                borderRadius: '12px',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                color: '#fff',
                                                padding: '8px 12px',
                                            }}
                                            itemStyle={{ color: '#10b981', fontWeight: 600, fontSize: '12px' }}
                                            labelStyle={{ color: '#9ca3af', fontWeight: 700, fontSize: '11px', marginBottom: '2px' }}
                                            cursor={{ fill: 'rgba(156, 163, 175, 0.08)', radius: 8 }}
                                        />
                                        <Bar dataKey="students" fill="url(#barGradient)" radius={[8, 8, 0, 0]} barSize={32} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Pie Chart */}
                <div className="min-w-0">
                    <Card title="Student Status" subtitle="Academic standing distribution" className="rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/10 overflow-hidden !p-5 sm:!p-6">
                        {statsLoading ? (
                            <div className="h-72 sm:h-80 w-full bg-slate-50 dark:bg-white/[0.03] animate-pulse rounded-xl mt-4" />
                        ) : (
                            <div className="h-72 sm:h-80 w-full mt-4 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value" stroke="none">
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                        {(finalStats.totalStudents / 1000).toFixed(1)}k
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/30">
                                        Total
                                    </span>
                                </div>
                            </div>
                        )}
                        <div className="flex justify-center flex-wrap gap-4 mt-4">
                            {pieData.map((item) => (
                                <div key={item.name} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-white/40">
                                        {item.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Recent Notices */}
            <Card title="Recent Notices" subtitle="Latest announcements and updates" icon={Bell} className="rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/10 overflow-hidden !p-5 sm:!p-6">
                <div className="mt-2 divide-y divide-slate-100 dark:divide-white/[0.06]">
                    {noticesLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="py-3 sm:py-4 flex items-start space-x-3.5 sm:space-x-4">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-100 dark:bg-white/5 rounded-xl animate-pulse shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-1/3 animate-pulse" />
                                    <div className="h-3 bg-slate-50 dark:bg-white/[0.03] rounded w-full animate-pulse" />
                                </div>
                            </div>
                        ))
                    ) : notices.length > 0 ? (
                        notices.map((notice, idx) => (
                            <div
                                key={notice.id || idx}
                                onClick={() => handleNoticeClick(notice)}
                                className="flex items-start space-x-3.5 sm:space-x-4 py-3.5 sm:py-4 hover:bg-slate-50/70 dark:hover:bg-white/[0.04] transition-colors group cursor-pointer"
                            >
                                <div className="p-2 sm:p-2.5 bg-emerald-50 dark:bg-emerald-500/10 text-[#007A55] dark:text-emerald-300 rounded-xl mt-0.5 group-hover:scale-105 transition-transform border border-emerald-100 dark:border-emerald-500/20 shrink-0">
                                    <Bell size={16} className="sm:w-4 sm:h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start gap-3">
                                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-[#007A55] transition-colors truncate">
                                            {notice.title}
                                        </h4>
                                        <span className="text-[10px] font-bold text-slate-400 dark:text-white/30 uppercase shrink-0">
                                            {formatDate(notice.createdAt)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-white/40 mt-1 line-clamp-1">{notice.content}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 sm:py-12">
                            <PackageOpen size={36} className="mx-auto text-slate-300 dark:text-white/10 mb-3" />
                            <p className="text-xs sm:text-sm text-slate-400 dark:text-white/30 italic">No recent notices found.</p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Notice View Modal */}
            <Modal isOpen={!!selectedNotice} onClose={() => setSelectedNotice(null)} title="Notice Details" size="lg">
                {selectedNotice && (
                    <div className="space-y-5 sm:space-y-6">
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-[#007A55] dark:text-emerald-300 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center border border-emerald-100 dark:border-emerald-500/20">
                                <Calendar size={12} className="mr-1.5" /> {formatDate(selectedNotice.createdAt)}
                            </span>
                            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center border border-indigo-100 dark:border-indigo-500/20">
                                <Tag size={12} className="mr-1.5" /> {selectedNotice.category || 'General'}
                            </span>
                            {selectedNotice.departmentName && selectedNotice.departmentName !== 'ALL' && (
                                <span className="px-3 py-1 bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-white/50 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center border border-slate-200/80 dark:border-white/10">
                                    <Building2 size={12} className="mr-1.5" /> {selectedNotice.departmentName}
                                </span>
                            )}
                        </div>

                        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                            {selectedNotice.title}
                        </h2>

                        <div className="p-4 sm:p-6 bg-slate-50/70 dark:bg-white/[0.04] rounded-2xl border border-slate-200/80 dark:border-white/[0.06]">
                            <p className="text-slate-700 dark:text-white/70 leading-relaxed whitespace-pre-wrap font-medium text-xs sm:text-sm">
                                {selectedNotice.content}
                            </p>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-white/[0.06]">
                            <div className="flex items-center text-slate-400 dark:text-white/30 gap-1.5">
                                <Eye size={15} />
                                <span className="text-[10px] font-black uppercase tracking-widest">
                                    {selectedNotice.viewCount || 0} Views
                                </span>
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Target: <span className="text-[#007A55] dark:text-emerald-300">{selectedNotice.targetRole}</span>
                            </p>
                        </div>
                    </div>
                )}
            </Modal>
        </motion.div>
    );
};

export default AdminDashboard;