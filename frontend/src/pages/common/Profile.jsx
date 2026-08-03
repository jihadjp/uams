import { useState, useEffect, useRef } from 'react';
import {
    User,
    Mail,
    Phone,
    ShieldCheck,
    Camera,
    Save,
    GraduationCap,
    Hash,
    Calendar,
    Users,
    ChevronDown,
    ImageIcon,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import ProfileHeader  from '../../pages/common/ProfileHeaderCard';
import useAuth from '../../hooks/useAuth';
import { useAuthStore } from '../../store/authStore';
import { getMyProfile, updateProfile, uploadProfileImage } from '../../api/profileApi';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, isStudent, isFaculty, isAdmin, isRegistrar } = useAuth();
    const updateUser = useAuthStore(state => state.updateUser);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef(null);

    const fetchProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getMyProfile();
            setProfileData(res.data);
        } catch (err) {
            console.error('Profile fetch error:', err);
            const msg = err.response?.data?.message || 'Failed to load profile details. Please try again.';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !profileData) return;

        if (file.size > 5 * 1024 * 1024) {
            return toast.error('Image size must be less than 5MB');
        }

        const formData = new FormData();
        formData.append('file', file);

        const uploadToast = toast.loading('Uploading image...');
        try {
            const res = await uploadProfileImage(formData);
            setProfileData((prev) => ({
                ...prev,
                user: { ...prev.user, profileImage: res.data.imageUrl },
            }));
            updateUser({ profileImage: res.data.imageUrl });
            toast.success('Image uploaded successfully', { id: uploadToast });
        } catch (err) {
            toast.error('Failed to upload image', { id: uploadToast });
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!profileData) return;
        setSaving(true);
        try {
            const payload = {
                name: profileData.user.name,
                profileImage: profileData.user.profileImage,
                phone: profileData.user.phone || '',
                gender: profileData.user.gender || '',
                bloodGroup: profileData.user.bloodGroup || '',
                dateOfBirth: profileData.user.dateOfBirth || '',
                student: isStudent
                    ? {
                        guardianName: profileData.student?.guardianName,
                        guardianPhone: profileData.student?.guardianPhone,
                        guardianRelation: profileData.student?.guardianRelation,
                        guardianOtherRelation: profileData.student?.guardianOtherRelation,
                    }
                    : undefined,
            };
            await updateProfile(payload);
            updateUser({ name: payload.name, profileImage: payload.profileImage });
            toast.success('Profile updated successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader size="lg" />
                <p className="text-sm text-slate-400 dark:text-white/30 font-medium animate-pulse">Loading profile data...</p>
            </div>
        );
    }

    if (error || !profileData || !profileData.user) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-6 text-center px-4">
                <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-full border border-red-100 dark:border-red-500/20">
                    <User size={48} className="text-red-500" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Profile Load Error</h3>
                    <p className="text-slate-500 dark:text-white/40 max-w-xs text-sm">{error || 'Unable to retrieve profile information at this time.'}</p>
                </div>
                <Button onClick={fetchProfile} variant="secondary" className="px-8">
                    Retry Loading
                </Button>
            </div>
        );
    }

    const profileImgUrl = profileData.user.profileImage;
    const displayImg = profileImgUrl
        ? profileImgUrl.startsWith('http') || profileImgUrl.startsWith('/api/uploads')
            ? profileImgUrl
            : `/api/uploads/${profileImgUrl}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.user.name)}&background=007A55&color=fff&size=200`;

    return (
        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 pb-20 px-2 sm:px-4">
            {/* Profile Header */}
            <ProfileHeader
                profileData={profileData}
                user={user}
                displayImg={displayImg}
                fileInputRef={fileInputRef}
                handleImageChange={handleImageChange}
            />

            <div className="space-y-6 sm:space-y-8">
                <Card title="Personal Information" icon={User}>
                    <form onSubmit={handleUpdateProfile} className="space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <Input
                                label="Full Name"
                                value={profileData.user.name}
                                onChange={(e) => setProfileData({ ...profileData, user: { ...profileData.user, name: e.target.value } })}
                                icon={User}
                            />
                            <Input
                                label="Email Address"
                                value={profileData.user.email}
                                readOnly
                                icon={Mail}
                                className="opacity-70"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <Input
                                label="Phone Number"
                                value={profileData.user.phone || ''}
                                onChange={(e) => setProfileData({ ...profileData, user: { ...profileData.user, phone: e.target.value } })}
                                icon={Phone}
                            />
                            <Input
                                label="Date of Birth"
                                type="date"
                                value={profileData.user.dateOfBirth || ''}
                                onChange={(e) => setProfileData({ ...profileData, user: { ...profileData.user, dateOfBirth: e.target.value } })}
                                icon={Calendar}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <label className="mb-2 block text-xs font-bold text-slate-700 dark:text-white/60 ml-1">Gender</label>
                                <div className="relative">
                                    <select
                                        value={profileData.user.gender || ''}
                                        onChange={(e) => setProfileData({ ...profileData, user: { ...profileData.user, gender: e.target.value } })}
                                        className="w-full px-4 py-3.5 bg-slate-50 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:border-[#007A55] focus:ring-4 focus:ring-[#007A55]/10 text-sm font-medium text-slate-900 dark:text-white appearance-none pr-10 transition-all"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <ChevronDown size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <label className="mb-2 block text-xs font-bold text-slate-700 dark:text-white/60 ml-1">Blood Group</label>
                                <div className="relative">
                                    <select
                                        value={profileData.user.bloodGroup || ''}
                                        onChange={(e) => setProfileData({ ...profileData, user: { ...profileData.user, bloodGroup: e.target.value } })}
                                        className="w-full px-4 py-3.5 bg-slate-50 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:border-[#007A55] focus:ring-4 focus:ring-[#007A55]/10 text-sm font-medium text-slate-900 dark:text-white appearance-none pr-10 transition-all"
                                    >
                                        <option value="">Select Blood Group</option>
                                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                                            <option key={bg} value={bg}>
                                                {bg}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {isStudent && (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <Input
                                        label="Guardian Name"
                                        value={profileData.student?.guardianName || ''}
                                        onChange={(e) =>
                                            setProfileData({ ...profileData, student: { ...profileData.student, guardianName: e.target.value } })
                                        }
                                        icon={ShieldCheck}
                                    />
                                    <Input
                                        label="Guardian Phone"
                                        value={profileData.student?.guardianPhone || ''}
                                        onChange={(e) =>
                                            setProfileData({ ...profileData, student: { ...profileData.student, guardianPhone: e.target.value } })
                                        }
                                        icon={Phone}
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label className="mb-2 block text-xs font-bold text-slate-700 dark:text-white/60 ml-1">Guardian Relation</label>
                                        <div className="relative">
                                            <select
                                                value={profileData.student?.guardianRelation || ''}
                                                onChange={(e) =>
                                                    setProfileData({
                                                        ...profileData,
                                                        student: { ...profileData.student, guardianRelation: e.target.value },
                                                    })
                                                }
                                                className="w-full px-4 py-3.5 bg-slate-50 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:border-[#007A55] focus:ring-4 focus:ring-[#007A55]/10 text-sm font-medium text-slate-900 dark:text-white appearance-none pr-10 transition-all"
                                            >
                                                <option value="">Select Relation</option>
                                                <option value="FATHER">Father</option>
                                                <option value="MOTHER">Mother</option>
                                                <option value="BROTHER">Brother</option>
                                                <option value="SISTER">Sister</option>
                                                <option value="OTHER">Other</option>
                                            </select>
                                            <ChevronDown size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    {profileData.student?.guardianRelation === 'OTHER' && (
                                        <Input
                                            label="Specify Relation"
                                            value={profileData.student?.guardianOtherRelation || ''}
                                            onChange={(e) =>
                                                setProfileData({
                                                    ...profileData,
                                                    student: { ...profileData.student, guardianOtherRelation: e.target.value },
                                                })
                                            }
                                            icon={Users}
                                        />
                                    )}
                                </div>
                            </>
                        )}

                        <div className="flex justify-end pt-2">
                            <Button type="submit" isLoading={saving} className="w-full sm:w-auto px-8">
                                <Save size={18} className="mr-2 shrink-0" /> Save Changes
                            </Button>
                        </div>
                    </form>
                </Card>

                <Card title="Academic Profile" icon={GraduationCap}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        {isStudent && (
                            <>
                                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.06] space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/30">Student ID</p>
                                    <p className="font-mono font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                                        {profileData.student?.studentId || 'PENDING'}
                                    </p>
                                </div>
                                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.06] space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/30">Registration No</p>
                                    <p className="font-mono font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                                        {profileData.student?.registrationNo || 'PENDING'}
                                    </p>
                                </div>
                                <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700/60 dark:text-emerald-300/60">Current Semester</p>
                                    <p className="font-black text-[#007A55] dark:text-emerald-300 text-sm sm:text-base">{profileData.student?.currentSemester || 1}</p>
                                </div>
                            </>
                        )}
                        {isFaculty && (
                            <>
                                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.06] space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Employee ID</p>
                                    <p className="font-mono font-bold text-slate-900 dark:text-white">{profileData.faculty?.employeeId}</p>
                                </div>
                                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.06] space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Department</p>
                                    <p className="font-bold text-slate-900 dark:text-white">{profileData.faculty?.departmentName}</p>
                                </div>
                                <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700/60">Designation</p>
                                    <p className="font-bold text-[#007A55] dark:text-emerald-300">{profileData.faculty?.designation}</p>
                                </div>
                            </>
                        )}
                        {isAdmin && (
                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.06] space-y-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Access Level</p>
                                <p className="font-black text-[#007A55] uppercase tracking-wider">Admin</p>
                            </div>
                        )}
                        {isRegistrar && (
                            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.06] space-y-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Access Level</p>
                                <p className="font-black text-[#007A55] uppercase tracking-wider">Registrar</p>
                            </div>
                        )}
                    </div>
                    <div className="mt-6 p-4 bg-blue-50/80 dark:bg-blue-500/10 rounded-2xl flex items-start gap-3 text-xs text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-500/20">
                        <Hash size={16} className="shrink-0 mt-0.5" />
                        <p className="leading-relaxed font-medium">Academic information can only be updated by the Registrar or IT Department.</p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
