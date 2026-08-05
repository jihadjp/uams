import { useState, useEffect } from 'react';
import {
  Users,
  Search,
  ChevronRight,
  GraduationCap,
  BookOpen,
  TrendingUp,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import client from '../../api/client';
import { getMyProfile } from '../../api/profileApi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const AdviseeList = () => {
  const [advisees, setAdvisees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdvisees = async () => {
      setLoading(true);
      try {
        const profileRes = await getMyProfile();
        const facultyId = profileRes.data.faculty?.id;

        if (facultyId) {
          const res = await client.get(`/students/advisor/${facultyId}`);
          setAdvisees(res.data?.content || res.data || []);
        }
      } catch (err) {
        toast.error('Failed to load advisee list');
      } finally {
        setLoading(false);
      }
    };
    fetchAdvisees();
  }, []);

  const filteredAdvisees = advisees.filter(
      (s) =>
          s.name?.toLowerCase().includes(search.toLowerCase()) ||
          s.registrationNo?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-3">
          <Loader size="lg" />
          <p className="text-xs sm:text-sm font-bold text-slate-400 animate-pulse uppercase tracking-[0.2em]">
            Loading advisees...
          </p>
        </div>
    );

  return (
      <div className="w-full px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-20 pt-4">
        {/* Top Action Bar (Search Bar) */}
        <div className="flex justify-end">
          <div className="relative group w-full sm:w-80">
            <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30 group-focus-within:text-[#007A55] transition-colors"
                size={17}
            />
            <input
                type="text"
                placeholder="Search by name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0B1225] border border-slate-200/80 dark:border-white/10 rounded-xl sm:rounded-2xl shadow-sm outline-none focus:border-[#007A55] focus:ring-4 focus:ring-[#007A55]/10 transition-all text-xs sm:text-sm font-medium dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30"
            />
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-white/30 px-1">
          <div className="h-px flex-1 bg-slate-200/60 dark:bg-white/[0.06]" />
          <span>{filteredAdvisees.length} students assigned</span>
          <div className="h-px flex-1 bg-slate-200/60 dark:bg-white/[0.06]" />
        </div>

        {/* Grid - Clean single image card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredAdvisees.map((student, idx) => (
              <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03, ease: [0.22, 1, 0.36, 1] }}
              >
                <Card className="group relative overflow-hidden h-full flex flex-col !p-0 border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-800/80">
                  {/* Top hover accent */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#007A55] via-emerald-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="p-5 sm:p-6 flex-1">
                    {/* Profile Image & Basic Info */}
                    <div className="flex items-start gap-3.5 sm:gap-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center shadow-sm">
                        {student.profileImage ? (
                            <img
                                src={
                                  student.profileImage.startsWith('http') ||
                                  student.profileImage.startsWith('/api')
                                      ? student.profileImage
                                      : `/api/uploads/${student.profileImage}`
                                }
                                alt={student.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <GraduationCap
                                size={24}
                                className="text-[#007A55] dark:text-emerald-300"
                            />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-black tracking-tight text-slate-900 dark:text-white truncate text-sm sm:text-[15px] leading-tight">
                          {student.name}
                        </h3>
                        <p className="text-[10px] sm:text-[11px] font-black font-mono uppercase tracking-widest text-[#007A55] dark:text-emerald-400 mt-1">
                          {student.registrationNo}
                        </p>
                        <div className="mt-2 inline-flex items-center px-2.5 py-1 rounded-full bg-slate-50 dark:bg-white/[0.06] border border-slate-100 dark:border-white/[0.06] text-[10px] font-bold text-slate-500 dark:text-white/50 truncate max-w-full">
                          <BookOpen
                              size={12}
                              className="mr-1 text-[#007A55] shrink-0"
                          />
                          <span className="truncate">
                        {student.programName || '—'}
                      </span>
                        </div>
                      </div>
                    </div>

                    {/* Academic info */}
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mt-4 sm:mt-5">
                      <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50/70 dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.06]">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/30">
                          CGPA
                        </p>
                        <p className="mt-1 text-xs sm:text-sm font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                          <TrendingUp size={13} className="text-emerald-500 shrink-0" />
                          {student.cgpa || '0.00'}
                        </p>
                      </div>
                      <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50/70 dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.06]">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/30">
                          Semester
                        </p>
                        <p className="mt-1 text-xs sm:text-sm font-black tracking-tight text-slate-900 dark:text-white">
                          {student.currentSemester || '—'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 pt-0 mt-auto">
                    <Button
                        className="w-full bg-[#2D2A4F] hover:bg-[#1E1C38] text-white rounded-xl sm:rounded-2xl font-bold text-xs py-2.5 transition-all shadow-sm group/btn border-none"
                        onClick={() =>
                            navigate(`/faculty/advisor-registration/${student.id}`)
                        }
                    >
                      <span>Manage Registration</span>
                      <ChevronRight
                          size={15}
                          className="ml-1 group-hover/btn:translate-x-1 transition-transform"
                      />
                    </Button>
                  </div>
                </Card>
              </motion.div>
          ))}

          {filteredAdvisees.length === 0 && (
              <div className="col-span-full py-16 sm:py-20 text-center bg-slate-50/50 dark:bg-white/[0.02] border border-dashed border-slate-200/80 dark:border-white/10 rounded-2xl sm:rounded-3xl shadow-sm">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white dark:bg-[#0B1225] border border-slate-100 dark:border-white/[0.06] flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-white/10 shadow-sm">
                  <Users size={32} />
                </div>
                <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  No Advisees Found
                </h3>
                <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-white/40 mt-1 max-w-sm mx-auto">
                  You don&apos;t have any students assigned to your guidance yet, or nothing matches &quot;{search}&quot;.
                </p>
              </div>
          )}
        </div>
      </div>
  );
};

export default AdviseeList;