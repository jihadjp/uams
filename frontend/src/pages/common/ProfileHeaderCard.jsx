import { Camera, Mail, ImageIcon } from 'lucide-react';
import Card from '../../components/common/Card';

const ProfileHeader = ({ profileData, user, displayImg, fileInputRef, handleImageChange }) => {
    return (
        <Card className="relative overflow-hidden !p-0" animate={false}>
            {/* Top gradient - Absolute positioning দিয়ে উপরে এবং দুই পাশে ফুল-উইডথ করা হয়েছে */}
            <div className="absolute top-0 left-0 right-0 h-28 sm:h-36 bg-gradient-to-r from-[#007A55] to-[#00956A]" />

            {/* Main Content - pt (padding-top) দিয়ে অ্যাভাটারকে ব্যানারের মাঝামাঝি বসানো হয়েছে */}
            <div className="relative z-10 flex flex-col items-center text-center px-6 sm:px-8 pb-8 pt-14 sm:pt-20">
                {/* Avatar */}
                <div className="relative group">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-[24px] bg-white dark:bg-[#0B1225] p-1.5 shadow-2xl border border-white/30">
                        <div className="w-full h-full rounded-[18px] overflow-hidden bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center border border-emerald-100 dark:border-white/10 relative">
                            <img src={displayImg} alt="Profile" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                <ImageIcon className="text-white" size={26} />
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="absolute -bottom-2 -right-2 p-2.5 bg-slate-900 dark:bg-white text-white dark:text-[#09101F] rounded-xl shadow-lg hover:bg-[#007A55] dark:hover:bg-emerald-400 transition-colors"
                        aria-label="Upload photo"
                    >
                        <Camera size={14} />
                    </button>

                    <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                </div>

                {/* Name + Role + Email */}
                <h1 className="mt-5 text-2xl sm:text-[28px] font-black tracking-tight text-slate-900 dark:text-white leading-tight max-w-full truncate">
                    {profileData?.user?.name}
                </h1>

                <div className="mt-3 flex flex-col items-center gap-2">
                    <span className="px-3.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-[#007A55] dark:text-emerald-300 text-[10px] font-black uppercase tracking-[0.18em] rounded-full border border-emerald-100 dark:border-emerald-500/20">
                        {user?.role}
                    </span>

                    <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500 dark:text-white/40">
                        <Mail size={14} className="shrink-0" />
                        <span className="truncate max-w-[260px] sm:max-w-none">{profileData?.user?.email}</span>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ProfileHeader;