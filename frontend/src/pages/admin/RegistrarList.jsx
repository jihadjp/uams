import { useState, useEffect, useMemo } from 'react';
import {
    Search,
    Plus,
    Edit,
    Trash2,
    ShieldCheck,
    ShieldAlert,
    UserCircle,
    Mail,
    Phone,
    Copy,
    Key,
    AlertTriangle,
    RefreshCw,
    MoreVertical
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import StatCard from '../../components/common/StatCard';
import { getRegistrars, createRegistrar, updateRegistrar, deleteRegistrar } from '../../api/registrarApi';
import { resetUserPassword } from '../../api/authApi';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '../../utils/formatDate';

const RegistrarList = () => {
    const [registrars, setRegistrars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRegistrar, setEditingRegistrar] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState(null);

    // Password Reset States
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [tempPassword, setTempPassword] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        gender: 'MALE',
        bloodGroup: '',
        dateOfBirth: '',
        isActive: true
    });

    const fetchRegistrars = async () => {
        const isInitial = registrars.length === 0;
        if (isInitial) setLoading(true);
        else setRefreshing(true);

        try {
            const res = await getRegistrars();
            setRegistrars(res.data || []);
        } catch (err) {
            toast.error('Failed to fetch registrars');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchRegistrars();
    }, []);

    const filteredRegistrars = useMemo(() => {
        return registrars.filter(r =>
            r.name.toLowerCase().includes(search.toLowerCase()) ||
            r.email.toLowerCase().includes(search.toLowerCase())
        );
    }, [registrars, search]);

    const stats = useMemo(() => ({
        total: registrars.length,
        active: registrars.filter(r => r.isActive).length,
        inactive: registrars.filter(r => !r.isActive).length
    }), [registrars]);

    const handleAddClick = () => {
        setEditingRegistrar(null);
        setFormData({
            name: '',
            email: '',
            phone: '',
            gender: 'MALE',
            bloodGroup: '',
            dateOfBirth: '',
            isActive: true
        });
        setIsModalOpen(true);
    };

    const handleEditClick = (registrar) => {
        setEditingRegistrar(registrar);
        setFormData({
            name: registrar.name,
            email: registrar.email,
            phone: registrar.phone || '',
            gender: registrar.gender || 'MALE',
            bloodGroup: registrar.bloodGroup || '',
            dateOfBirth: registrar.dateOfBirth || '',
            isActive: registrar.isActive
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            if (editingRegistrar) {
                await updateRegistrar(editingRegistrar.id, formData);
                toast.success('Registrar updated successfully');
                setIsModalOpen(false);
            } else {
                const res = await createRegistrar(formData);
                setGeneratedPassword(res.data.temporaryPassword);
                toast.success('Registrar account created!');
            }
            fetchRegistrars();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Operation failed');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this registrar?')) return;
        try {
            await deleteRegistrar(id);
            toast.success('Registrar deleted');
            fetchRegistrars();
        } catch (err) {
            toast.error('Failed to delete registrar');
        }
    };

    const handleResetPassword = async (userId) => {
        if (!window.confirm('Reset this user\'s password?')) return;
        try {
            const res = await resetUserPassword(userId);
            setTempPassword(res.data.temporaryPassword);
            setShowPasswordModal(true);
            toast.success('Password reset successfully');
        } catch (err) {
            toast.error('Failed to reset password');
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Registrar Management</h1>
                    <p className="text-slate-500 dark:text-white/40 mt-1 text-sm font-medium">Control and manage academic operations staff.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button onClick={fetchRegistrars} variant="secondary" className="p-2.5">
                        <RefreshCw size={20} className={loading || refreshing ? 'animate-spin' : ''} />
                    </Button>
                    <Button onClick={handleAddClick} className="flex items-center gap-2">
                        <Plus size={20} />
                        <span>New Registrar</span>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard icon={ShieldCheck} label="Total Registrars" value={stats.total} color="primary" />
                <StatCard icon={UserCircle} label="Active Staff" value={stats.active} color="success" delay={0.1} />
                <StatCard icon={ShieldAlert} label="Suspended" value={stats.inactive} color="danger" delay={0.2} />
            </div>

            <Card className="!p-0">
                <div className="p-6 border-b border-slate-100 dark:border-white/[0.06]">
                    <div className="relative group max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#007A55] transition-colors" size={18} />
                        <Input
                            placeholder="Search registrars by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="!pl-11"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[300px] relative">
                    {refreshing && (
                        <div className="absolute inset-x-0 top-0 h-0.5 bg-primary-500/10 overflow-hidden z-20">
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                className="h-full w-1/3 bg-primary-500"
                            />
                        </div>
                    )}
                    <table className={`w-full text-left transition-opacity duration-200 ${refreshing ? 'opacity-50' : 'opacity-100'}`}>
                        <thead className="bg-slate-50 dark:bg-white/[0.03] text-slate-500 dark:text-white/30 uppercase text-[10px] font-bold tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Registrar Info</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4">Joined At</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
                            {loading && registrars.length === 0 ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-5"><div className="h-10 bg-slate-100 dark:bg-white/5 rounded-xl w-48" /></td>
                                        <td className="px-6 py-5"><div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-32" /></td>
                                        <td className="px-6 py-5"><div className="h-6 bg-slate-100 dark:bg-white/5 rounded-full w-20 mx-auto" /></td>
                                        <td colSpan={2} />
                                    </tr>
                                ))
                            ) : filteredRegistrars.length > 0 ? (
                                filteredRegistrars.map((r) => (
                                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold border border-indigo-100 dark:border-indigo-500/20">
                                                    {r.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <p className="text-sm font-black text-slate-900 dark:text-white truncate">{r.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">REG STAFF</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center text-xs text-slate-600 dark:text-white/70">
                                                    <Mail size={12} className="mr-1.5 opacity-50" />
                                                    {r.email}
                                                </div>
                                                <div className="flex items-center text-[10px] text-slate-400 font-medium">
                                                    <Phone size={10} className="mr-1.5 opacity-50" />
                                                    {r.phone || 'No phone'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                r.isActive
                                                ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/20'
                                                : 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/20'
                                            }`}>
                                                {r.isActive ? 'Active' : 'Suspended'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-bold text-slate-500 dark:text-white/40">
                                                {formatDate(r.createdAt)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleResetPassword(r.id)} className="p-2 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/15 rounded-xl transition-all" title="Reset Password">
                                                    <Key size={18} />
                                                </button>
                                                <button onClick={() => handleEditClick(r)} className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/15 rounded-xl transition-all" title="Edit Profile">
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(r.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/15 rounded-xl transition-all" title="Delete Account">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-slate-400 font-bold italic">No registrars found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setGeneratedPassword(null);
                }}
                title={generatedPassword ? "Account Created" : editingRegistrar ? "Edit Registrar" : "New Registrar Staff"}
                size="md"
            >
                {generatedPassword ? (
                    <div className="text-center space-y-6 py-4">
                        <div className="p-6 bg-emerald-50 dark:bg-emerald-500/10 rounded-3xl border-2 border-dashed border-emerald-200 dark:border-emerald-800">
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3">Temporary Password</p>
                            <h2 className="text-3xl font-black text-emerald-700 dark:text-emerald-300 font-mono tracking-widest">{generatedPassword}</h2>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Button onClick={() => { navigator.clipboard.writeText(generatedPassword); toast.success('Copied!'); }} className="w-full py-4">
                                <Copy size={18} className="mr-2" /> Copy Password
                            </Button>
                            <Button variant="secondary" onClick={() => { setIsModalOpen(false); setGeneratedPassword(null); }} className="w-full py-3">Done</Button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Full Name"
                            required
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                        <Input
                            label="Email Address"
                            type="email"
                            required
                            placeholder="john@rbu.edu.bd"
                            disabled={!!editingRegistrar}
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Phone Number"
                                placeholder="017xxxxxxxx"
                                value={formData.phone}
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                            />
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 dark:text-white/70 ml-1">Gender</label>
                                <select
                                    className="w-full px-4 py-3.5 bg-slate-50 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-medium outline-none dark:text-white"
                                    value={formData.gender}
                                    onChange={e => setFormData({...formData, gender: e.target.value})}
                                >
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                        </div>
                        {editingRegistrar && (
                            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-white/[0.04] rounded-2xl border border-slate-200 dark:border-white/10">
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">Account Status</p>
                                    <p className="text-[10px] text-slate-400 font-medium">Suspended staff cannot log in</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isActive ? 'bg-[#007A55]' : 'bg-slate-300'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        )}
                        <div className="pt-4 flex gap-4">
                            <Button type="submit" className="flex-1" isLoading={formLoading}>
                                {editingRegistrar ? 'Update Account' : 'Create Account'}
                            </Button>
                            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="bg-transparent border-none">Cancel</Button>
                        </div>
                    </form>
                )}
            </Modal>

            {/* Password Display Modal (Reset) */}
            <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Password Reset" size="sm">
                <div className="space-y-6 py-4">
                    <div className="p-6 bg-indigo-50 dark:bg-indigo-950/30 rounded-3xl border-2 border-dashed border-indigo-200 dark:border-indigo-800 text-center">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-3">One-Time Recovery Password</p>
                        <h2 className="text-3xl font-black text-indigo-700 dark:text-indigo-300 font-mono tracking-widest">{tempPassword}</h2>
                    </div>
                    <Button onClick={() => { navigator.clipboard.writeText(tempPassword); toast.success('Copied!'); }} className="w-full py-4">
                        <Copy size={18} className="mr-2" /> Copy & Close
                    </Button>
                </div>
            </Modal>
        </motion.div>
    );
};

export default RegistrarList;
