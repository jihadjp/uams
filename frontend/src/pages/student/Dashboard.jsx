import {
    GraduationCap,
    BookOpen,
    ClipboardCheck,
    Wallet,
    Library,
    Globe,
    Bus,
    Home,
    Laptop,
    TrendingUp,
    Calendar,
    FileText,
    Layers,
    Users,
    AlertTriangle,
    ArrowRight,
    ShieldCheck,
    AlertCircle
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import useFetch from '../../hooks/useFetch';
import Loader from '../../components/common/Loader';
import { motion } from 'framer-motion';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

// Resource Button component with fixed colorful solid backgrounds
const ResourceButton = ({ icon: Icon, label, sublabel, color, onClick }) => (
    <motion.button
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex flex-col items-center justify-center p-5 rounded-2xl transition-all shadow-sm hover:shadow-md h-full w-full cursor-pointer border-none outline-none"
        style={{ backgroundColor: color }}
        onClick={onClick}
    >
        <div className="bg-white/20 p-3 rounded-xl mb-3 text-white">
            <Icon size={24} />
        </div>
        <span className="text-white font-bold text-xs md:text-sm text-center leading-tight line-clamp-1">{label}</span>
        <span className="text-white/70 text-[10px] mt-1 text-center font-medium line-clamp-1">{sublabel}</span>
    </motion.button>
);

const StudentDashboard = () => {
    const user = useAuthStore(state => state.user);
    const navigate = useNavigate();
    const { data: summary, loading } = useFetch('/student/dashboard/summary');

    // Pre-calculate to avoid ReferenceErrors in return block
    const isProfileIncomplete = !loading && summary && !summary.registrationNo;

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    const chartData = summary?.semesterResults?.length > 0
        ? summary.semesterResults.map(r => ({ name: r.semesterName, gpa: r.gpa }))
        : [];

    const profileImgUrl = summary?.profileImage;
    const displayImg = profileImgUrl
        ? (profileImgUrl.startsWith('http') || profileImgUrl.startsWith('/api/uploads')
            ? profileImgUrl
            : `/api/uploads/${profileImgUrl}`)
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=8b5cf6&color=fff&size=200`;

    return (
        <div className="space-y-8 pb-12">
            {/* Page Title & Profile Alert */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Student Portal</p>
                </div>
                {isProfileIncomplete && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 px-4 py-2.5 rounded-2xl shadow-sm"
                    >
                        <AlertTriangle className="text-amber-600 dark:text-amber-500 mr-3 shrink-0" size={20} />
                        <div className="mr-6">
                            <p className="text-xs font-bold text-amber-900 dark:text-amber-300">Profile Incomplete</p>
                            <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">Please complete your profile to access all features.</p>
                        </div>
                        <Button size="sm" onClick={() => navigate('/student/profile')} className="bg-amber-600 hover:bg-amber-700 text-white border-none shadow-none text-xs font-bold shrink-0">
                            Complete Now <ArrowRight size={14} className="ml-1.5" />
                        </Button>
                    </motion.div>
                )}
            </div>

            {/* Profile Banner */}
            <Card className="!p-0 border-none bg-gradient-to-r from-[#1e293b] via-[#334155] to-[#1e293b] relative overflow-hidden group shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full -ml-32 -mb-32 blur-3xl pointer-events-none" />

                <div className="p-8 md:p-10 flex flex-col lg:flex-row items-center gap-10 relative z-10">
                    <div className="relative shrink-0">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/10 p-1 bg-white/5 shadow-2xl overflow-hidden">
                            <img
                                src={displayImg}
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>
                        <div className="absolute bottom-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 border-[#1e293b] shadow-lg">
                            ✓ Active
                        </div>
                    </div>

                    <div className="flex-1 space-y-6 text-center lg:text-left">
                        <div>
                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                <h2 className="text-4xl font-black text-white leading-none">{user?.name}</h2>
                                {summary?.isRegistrationCleared && (
                                    <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-green-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-500/20 w-fit mx-auto lg:mx-0">
                                        <ShieldCheck size={14} strokeWidth={3} />
                                        <span>Verified Student</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-primary-300 font-bold mt-2">{summary?.programName || 'B.Sc. in Computer Science & Engineering'}</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8 max-w-2xl">
                            <div className="flex items-center space-x-3 text-white/80" title="Student ID (Long)">
                                <GraduationCap size={16} className="text-primary-400 shrink-0" />
                                <div className="flex flex-col text-left">
                                    <span className="text-[8px] font-black uppercase text-primary-400">Student ID</span>
                                    <span className="text-xs font-medium">{summary?.studentId || '---'}</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 text-white/80" title="Email">
                                <FileText size={16} className="text-primary-400 shrink-0" />
                                <div className="flex flex-col text-left min-w-0">
                                    <span className="text-[8px] font-black uppercase text-primary-400">Official Email</span>
                                    <span className="text-xs font-medium truncate max-w-[120px]">{summary?.email || '---'}</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 text-white/80" title="Date of Birth">
                                <Calendar size={16} className="text-primary-400 shrink-0" />
                                <div className="flex flex-col text-left">
                                    <span className="text-[8px] font-black uppercase text-primary-400">Birth Date</span>
                                    <span className="text-xs font-medium">{summary?.dob ? new Date(summary.dob).toLocaleDateString() : '---'}</span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 text-white/80" title="Registration ID">
                                <Layers size={16} className="text-primary-400 shrink-0" />
                                <div className="flex flex-col text-left">
                                    <span className="text-[8px] font-black uppercase text-primary-400">Reg ID</span>
                                    <span className="text-xs font-medium">{summary?.registrationNo || '---'}</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 text-white/80" title="Mobile">
                                <ClipboardCheck size={16} className="text-primary-400 shrink-0" />
                                <div className="flex flex-col text-left">
                                    <span className="text-[8px] font-black uppercase text-primary-400">Mobile</span>
                                    <span className="text-xs font-medium">{summary?.mobile || '---'}</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 text-white/80" title="Gender">
                                <Users size={16} className="text-primary-400 shrink-0" />
                                <div className="flex flex-col text-left">
                                    <span className="text-[8px] font-black uppercase text-primary-400">Gender</span>
                                    <span className="text-xs font-medium">{summary?.gender || '---'}</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 text-white/80" title="Batch">
                                <Users size={16} className="text-primary-400 shrink-0" />
                                <div className="flex flex-col text-left">
                                    <span className="text-[8px] font-black uppercase text-primary-400">Batch</span>
                                    <span className="text-xs font-medium">{summary?.batch || '---'}</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 text-white/80" title="Campus">
                                <Home size={16} className="text-primary-400 shrink-0" />
                                <div className="flex flex-col text-left">
                                    <span className="text-[8px] font-black uppercase text-primary-400">Campus</span>
                                    <span className="text-xs font-medium">{summary?.campus || '---'}</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 text-white/80" title="Blood Group">
                                <TrendingUp size={16} className="text-primary-400 shrink-0" />
                                <div className="flex flex-col text-left">
                                    <span className="text-[8px] font-black uppercase text-primary-400">Blood</span>
                                    <span className="text-xs font-medium">{summary?.bloodGroup || '---'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <Card
                    className="flex items-center space-x-4 cursor-pointer hover:border-indigo-500 transition-colors"
                    onClick={() => navigate('/student/results')}
                >
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-2xl text-blue-600 dark:text-blue-400 shrink-0">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-none mb-1">Current CGPA</p>
                        <p className="text-xl font-black text-gray-900 dark:text-white">{summary?.cgpa || '0.00'}</p>
                    </div>
                </Card>
                <Card
                    className="flex items-center space-x-4 cursor-pointer hover:border-purple-500 transition-colors"
                    onClick={() => navigate('/student/registration')}
                >
                    <div className="p-3 bg-purple-50 dark:bg-purple-950/50 rounded-2xl text-purple-600 dark:text-purple-400 shrink-0">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-none mb-1">Enrolled</p>
                        <p className="text-xl font-black text-gray-900 dark:text-white">{summary?.enrolledCourses || 0} <span className="text-[10px] font-bold text-gray-400">Courses</span></p>
                    </div>
                </Card>
                <Card
                    className="flex items-center space-x-4 cursor-pointer hover:border-emerald-500 transition-colors"
                    onClick={() => navigate('/student/attendance')}
                >
                    <div className="p-3 bg-green-50 dark:bg-green-950/50 rounded-2xl text-green-600 dark:text-green-400 shrink-0">
                        <ClipboardCheck size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-none mb-1">Attendance</p>
                        <p className="text-xl font-black text-gray-900 dark:text-white">{summary?.attendancePercent || 0}%</p>
                    </div>
                </Card>
                <Card
                    className="flex items-center space-x-4 cursor-pointer hover:border-amber-500 transition-colors"
                    onClick={() => navigate('/student/fees')}
                >
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/50 rounded-2xl text-amber-600 dark:text-amber-400 shrink-0">
                        <Wallet size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-none mb-1">Fee Status</p>
                        <p className={`text-xl font-black ${summary?.isRegistrationCleared ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                            {summary?.isRegistrationCleared ? 'Cleared' : 'Due'}
                        </p>
                    </div>
                </Card>
            </div>

            {/* Resource Sections Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <section className="space-y-4">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white px-1">Learning Resource</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <ResourceButton icon={Library} label="Library" sublabel="Digital catalog" color="#334155" onClick={() => navigate('/student/facilities')} />
                        <ResourceButton icon={Globe} label="BLC" sublabel="Online classes" color="#10b981" onClick={() => toast.success('Redirecting to BLC Portal...')} />
                        <ResourceButton icon={BookOpen} label="Go Edu" sublabel="Course portal" color="#06b6d4" onClick={() => toast.success('Redirecting to Go Edu...')} />
                    </div>
                </section>

                <section className="space-y-4">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white px-1">Student Service</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <ResourceButton icon={Bus} label="Transport Card" sublabel="Manage pass" color="#6366f1" onClick={() => navigate('/student/transport')} />
                        <ResourceButton icon={Home} label="Hall Manage" sublabel="Accommodation" color="#ef4444" onClick={() => navigate('/student/hall')} />
                        <ResourceButton icon={Laptop} label="Laptop Scheme" sublabel="Claim device" color="#f59e0b" onClick={() => navigate('/student/laptop')} />
                    </div>
                </section>

                <section className="space-y-4">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white px-1">Academic</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <ResourceButton icon={TrendingUp} label="Live Result" sublabel="Current marks" color="#1e293b" onClick={() => navigate('/student/live-results')} />
                        <ResourceButton icon={Calendar} label="Routine" sublabel="Class schedule" color="#7c3aed" onClick={() => navigate('/student/routine')} />
                        <ResourceButton icon={GraduationCap} label="Certificate" sublabel="Official copies" color="#10b981" onClick={() => navigate('/student/transcript-request')} />
                    </div>
                </section>
            </div>

            {/* Today's Routine Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card title="Today's Routine" icon={Calendar}>
                        <div className="py-12 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium italic">No routine available for today.</p>
                        </div>
                    </Card>
                </div>

                <Card title="Payment Status" icon={FileText} className="h-full">
                    <div className="space-y-6 flex flex-col h-full justify-between pb-2">
                        {summary?.isRegistrationCleared ? (
                            <div className="p-5 rounded-[2rem] bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 flex items-start space-x-4">
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-green-800 dark:text-green-500 leading-tight">Academic Dues Cleared</p>
                                    <p className="text-[10px] text-green-700/70 dark:text-green-500/70 mt-1 font-bold">You are eligible for all academic services.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-5 rounded-[2rem] bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 flex items-start space-x-4">
                                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600">
                                    <AlertCircle size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-amber-800 dark:text-amber-500 leading-tight">Semester Fee Due</p>
                                    <p className="text-[10px] text-amber-700/70 dark:text-amber-500/70 mt-1 font-bold">Please clear your dues to avoid penalties.</p>
                                </div>
                            </div>
                        )}
                        <Button
                            variant="secondary"
                            className="w-full py-3 text-xs font-black uppercase tracking-widest rounded-2xl"
                            onClick={() => navigate('/student/fees')}
                        >
                            View Fee Details
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Result Chart */}
            <Card title="Semester Wise Result" subtitle="Semester-wise CGPA Performance" icon={TrendingUp}>
                {chartData.length > 0 ? (
                    <div className="h-80 w-full mt-6 min-w-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.15)" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{fill: '#9ca3af', fontSize: 11, fontWeight: 600}}
                                    dy={10}
                                />
                                <YAxis
                                    domain={[0, 4.0]}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{fill: '#9ca3af', fontSize: 11}}
                                />
                                <Tooltip
                                    cursor={{fill: 'rgba(156, 163, 175, 0.1)'}}
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.15)',
                                        backgroundColor: '#0f172a',
                                        color: '#fff'
                                    }}
                                />
                                <Bar
                                    dataKey="gpa"
                                    radius={[6, 6, 0, 0]}
                                    barSize={32}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#6366f1', '#ec4899', '#10b981', '#a855f7', '#3b82f6'][index % 5]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="py-16 text-center flex flex-col items-center justify-center space-y-3">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-full text-gray-400 dark:text-gray-500">
                            <TrendingUp size={40} />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium italic">No result data available yet.</p>
                    </div>
                )}
                {chartData.length > 0 && (
                    <div className="mt-6 flex justify-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-sm bg-indigo-500" />
                            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">GPA / CGPA</span>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default StudentDashboard;