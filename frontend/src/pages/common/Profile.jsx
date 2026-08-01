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
    ImageIcon
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import useAuth from '../../hooks/useAuth';
import { getMyProfile, updateProfile, uploadProfileImage } from '../../api/profileApi';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, isStudent, isFaculty, isAdmin, isRegistrar } = useAuth();
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
            setProfileData(prev => ({
                ...prev,
                user: { ...prev.user, profileImage: res.data.imageUrl }
            }));
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
                student: isStudent ? {
                    guardianName: profileData.student?.guardianName,
                    guardianPhone: profileData.student?.guardianPhone,
                    guardianRelation: profileData.student?.guardianRelation,
                    guardianOtherRelation: profileData.student?.guardianOtherRelation
                } : undefined
            };

            await updateProfile(payload);
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
                <p className="text-sm text-gray-400 font-medium animate-pulse">Loading profile data...</p>
            </div>
        );
    }

    if (error || !profileData || !profileData.user) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-6 text-center px-4">
                <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-full">
                    <User size={48} className="text-red-500" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Profile Load Error</h3>
                    <p className="text-gray-500 max-w-xs">{error || 'Unable to retrieve profile information at this time.'}</p>
                </div>
                <Button onClick={fetchProfile} variant="secondary" className="px-8">
                    Retry Loading
                </Button>
            </div>
        );
    }

    const profileImgUrl = profileData.user.profileImage;
    const displayImg = profileImgUrl
        ? (profileImgUrl.startsWith('http') || profileImgUrl.startsWith('/api/uploads')
            ? profileImgUrl
            : `/api/uploads/${profileImgUrl}`)
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.user.name)}&background=8b5cf6&color=fff&size=200`;

    return (
        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 pb-20 px-2 sm:px-4">
            {/* Profile Header Container */}
            <Card className="relative overflow-hidden pt-8 sm:pt-12 !p-4 sm:!p-6" animate={false}>
                <div className="absolute top-0 left-0 w-full h-24 sm:h-32 bg-primary-600" />

                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 relative z-10 pt-4 sm:pt-0">
                    {/* Avatar Section */}
                    <div className="relative group shrink-0">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-white dark:bg-gray-800 p-1 shadow-2xl">
                            <div className="w-full h-full rounded-2xl bg-primary-100 dark:bg-primary-950/50 flex items-center justify-center text-primary-600 border border-gray-100 dark:border-gray-700 overflow-hidden relative">
                                <img src={displayImg} alt="Profile" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                    <ImageIcon className="text-white" size={28} />
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current.click()}
                            className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 p-2 bg-gray-900 text-white rounded-xl shadow-lg hover:bg-primary-600 transition-colors z-20"
                            aria-label="Upload photo"
                        >
                            <Camera size={14} className="sm:w-4 sm:h-4" />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>

                    {/* Title & Email Info */}
                    <div className="flex-1 text-center sm:text-left pb-1 sm:pb-2 min-w-0 w-full">
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-tight truncate">
                            {profileData.user.name}
                        </h1>
                        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 sm:gap-4 mt-2">
                  <span className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-primary-100 dark:border-primary-900/30 shrink-0">
                    {user?.role}
                  </span>
                            <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs font-bold truncate max-w-full">
                                <Mail size={14} className="mr-1.5 shrink-0" />
                                <span className="truncate">{profileData.user.email}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="space-y-6 sm:space-y-8">
                {/* Basic Info Form */}
                <Card title="Personal Information" icon={User}>
                    <form onSubmit={handleUpdateProfile} className="space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <Input
                                label="Full Name"
                                value={profileData.user.name}
                                onChange={(e) => setProfileData({...profileData, user: {...profileData.user, name: e.target.value}})}
                                icon={User}
                            />
                            <Input
                                label="Email Address"
                                value={profileData.user.email}
                                readOnly
                                icon={Mail}
                                className="opacity-70 bg-gray-50 dark:bg-gray-800"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <Input
                                label="Phone Number"
                                value={profileData.user.phone || ''}
                                onChange={(e) => setProfileData({...profileData, user: {...profileData.user, phone: e.target.value}})}
                                icon={Phone}
                            />
                            <Input
                                label="Date of Birth"
                                type="date"
                                value={profileData.user.dateOfBirth || ''}
                                onChange={(e) => setProfileData({...profileData, user: {...profileData.user, dateOfBirth: e.target.value}})}
                                icon={Calendar}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Gender</label>
                                <div className="relative">
                                    <select
                                        value={profileData.user.gender || ''}
                                        onChange={(e) => setProfileData({...profileData, user: {...profileData.user, gender: e.target.value}})}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/20 text-sm text-gray-900 dark:text-white appearance-none pr-10"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <ChevronDown size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Blood Group</label>
                                <div className="relative">
                                    <select
                                        value={profileData.user.bloodGroup || ''}
                                        onChange={(e) => setProfileData({...profileData, user: {...profileData.user, bloodGroup: e.target.value}})}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/20 text-sm text-gray-900 dark:text-white appearance-none pr-10"
                                    >
                                        <option value="">Select Blood Group</option>
                                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                    </select>
                                    <ChevronDown size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {isStudent && (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <Input
                                        label="Guardian Name"
                                        value={profileData.student?.guardianName || ''}
                                        onChange={(e) => setProfileData({...profileData, student: {...profileData.student, guardianName: e.target.value}})}
                                        icon={ShieldCheck}
                                    />
                                    <Input
                                        label="Guardian Phone"
                                        value={profileData.student?.guardianPhone || ''}
                                        onChange={(e) => setProfileData({...profileData, student: {...profileData.student, guardianPhone: e.target.value}})}
                                        icon={Phone}
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Guardian Relation</label>
                                        <div className="relative">
                                            <select
                                                value={profileData.student?.guardianRelation || ''}
                                                onChange={(e) => setProfileData({...profileData, student: {...profileData.student, guardianRelation: e.target.value}})}
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500/20 text-sm text-gray-900 dark:text-white appearance-none pr-10"
                                            >
                                                <option value="">Select Relation</option>
                                                <option value="FATHER">Father</option>
                                                <option value="MOTHER">Mother</option>
                                                <option value="BROTHER">Brother</option>
                                                <option value="SISTER">Sister</option>
                                                <option value="OTHER">Other</option>
                                            </select>
                                            <ChevronDown size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    {profileData.student?.guardianRelation === 'OTHER' && (
                                        <Input
                                            label="Specify Relation"
                                            value={profileData.student?.guardianOtherRelation || ''}
                                            onChange={(e) => setProfileData({...profileData, student: {...profileData.student, guardianOtherRelation: e.target.value}})}
                                            icon={Users}
                                        />
                                    )}
                                </div>
                            </>
                        )}

                        <div className="flex justify-end pt-4">
                            <Button type="submit" isLoading={saving} className="w-full sm:w-auto px-8 py-3 font-bold">
                                <Save size={18} className="mr-2 shrink-0" /> Save Changes
                            </Button>
                        </div>
                    </form>
                </Card>

                {/* Academic Profile */}
                <Card title="Academic Profile" icon={GraduationCap}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        {isStudent && (
                            <>
                                <div className="p-3 sm:p-0 bg-gray-50/50 sm:bg-transparent dark:bg-gray-800/30 sm:dark:bg-transparent rounded-xl space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student ID</p>
                                    <p className="font-mono font-bold text-gray-900 dark:text-white text-sm sm:text-base">{profileData.student?.studentId || 'PENDING'}</p>
                                </div>
                                <div className="p-3 sm:p-0 bg-gray-50/50 sm:bg-transparent dark:bg-gray-800/30 sm:dark:bg-transparent rounded-xl space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Registration No</p>
                                    <p className="font-mono font-bold text-gray-900 dark:text-white text-sm sm:text-base">{profileData.student?.registrationNo || 'PENDING'}</p>
                                </div>
                                <div className="p-3 sm:p-0 bg-gray-50/50 sm:bg-transparent dark:bg-gray-800/30 sm:dark:bg-transparent rounded-xl space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Semester</p>
                                    <p className="font-bold text-primary-600 text-sm sm:text-base">{profileData.student?.currentSemester || 1}</p>
                                </div>
                            </>
                        )}
                        {isFaculty && (
                            <>
                                <div className="p-3 sm:p-0 bg-gray-50/50 sm:bg-transparent dark:bg-gray-800/30 sm:dark:bg-transparent rounded-xl space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Employee ID</p>
                                    <p className="font-mono font-bold text-gray-900 dark:text-white text-sm sm:text-base">{profileData.faculty?.employeeId}</p>
                                </div>
                                <div className="p-3 sm:p-0 bg-gray-50/50 sm:bg-transparent dark:bg-gray-800/30 sm:dark:bg-transparent rounded-xl space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Department</p>
                                    <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">{profileData.faculty?.departmentName}</p>
                                </div>
                                <div className="p-3 sm:p-0 bg-gray-50/50 sm:bg-transparent dark:bg-gray-800/30 sm:dark:bg-transparent rounded-xl space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Designation</p>
                                    <p className="font-bold text-primary-600 text-sm sm:text-base">{profileData.faculty?.designation}</p>
                                </div>
                            </>
                        )}
                        {isAdmin && (
                            <div className="p-3 sm:p-0 bg-gray-50/50 sm:bg-transparent dark:bg-gray-800/30 sm:dark:bg-transparent rounded-xl space-y-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Access Level</p>
                                <p className="font-black text-primary-600 text-sm sm:text-base uppercase tracking-wider">admin</p>
                            </div>
                        )}
                        {isRegistrar && (
                            <div className="p-3 sm:p-0 bg-gray-50/50 sm:bg-transparent dark:bg-gray-800/30 sm:dark:bg-transparent rounded-xl space-y-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Access Level</p>
                                <p className="font-black text-primary-600 text-sm sm:text-base uppercase tracking-wider">register</p>
                            </div>
                        )}
                    </div>
                    <div className="mt-6 sm:mt-8 p-3.5 sm:p-4 bg-blue-50/80 dark:bg-blue-900/20 rounded-2xl flex items-start space-x-3 text-xs text-blue-700 dark:text-blue-400">
                        <Hash size={16} className="shrink-0 mt-0.5" />
                        <p className="leading-relaxed">Academic information can only be updated by the Registrar or IT Department.</p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Profile;