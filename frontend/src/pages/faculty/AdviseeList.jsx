import { useState, useEffect } from 'react';
import {
  Users,
  Search,
  ChevronRight,
  GraduationCap,
  BookOpen,
  TrendingUp,
  UserSquare2,
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
          <p className="text-sm font-medium text-slate-400 dark:text-white/30 animate-pulse">Loading advisees...</p>
        </div>
    );

  return (
      <div className="space-y-8 pb-12 max-w-7xl mx-auto">
        {/* Header - Royal Bengal style */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#007A55] to-[#00956A] text-white shadow-lg shadow-emerald-700/20 border border-emerald-600/10">
              <Users size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">My Advisees</h1>
              <p className="text-sm font-medium text-slate-500 dark:text-white/40 mt-0.5">
                Student mentorship & academic advising — Royal Bengal University
              </p>
            </div>
          </div>

          <div className="relative group w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30 group-focus-within:text-[#007A55] transition-colors" size={18} />
            <input
                type="text"
                placeholder="Search by name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#0B1225] border border-slate-200 dark:border-white/10 rounded-2xl outline-none focus:border-[#007A55] focus:ring-4 focus:ring-[#007A55]/10 transition-all text-sm font-medium shadow-sm dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30"
            />
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-white/30 px-1">
          <div className="h-px flex-1 bg-slate-100 dark:bg-white/[0.06]" />
          <span>{filteredAdvisees.length} students assigned</span>
          <div className="h-px flex-1 bg-slate-100 dark:bg-white/[0.06]" />
        </div>

        {/* Grid - Clean single image card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAdvisees.map((student, idx) => (
              <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] }}
              >
                <Card className="group relative overflow-hidden h-full flex flex-col !p-0 border-slate-200 dark:border-white/10 hover:border-[#007A55]/30 dark:hover:border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-900/5 dark:hover:shadow-black/20 transition-all duration-300">
                  {/* Top hover accent */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#007A55] via-emerald-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="p-6 flex-1">
                    {/* Only real image - watermark removed */}
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center">
                        {student.profileImage ? (
                            <img
                                src={
                                  student.profileImage.startsWith('http') || student.profileImage.startsWith('/api')
                                      ? student.profileImage
                                      : `/api/uploads/${student.profileImage}`
                                }
                                alt={student.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <GraduationCap size={26} className="text-[#007A55] dark:text-emerald-300" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-black tracking-tight text-slate-900 dark:text-white truncate text-[15px] leading-tight">
                          {student.name}
                        </h3>
                        <p className="text-[11px] font-black uppercase tracking-widest text-[#007A55] dark:text-emerald-300 mt-1">
                          {student.registrationNo}
                        </p>
                        <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full bg-slate-50 dark:bg-white/[0.06] border border-slate-100 dark:border-white/[0.06] text-[10px] font-bold text-slate-500 dark:text-white/40 truncate max-w-full">
                          <BookOpen size={12} className="mr-1 text-[#007A55] shrink-0" />
                          <span className="truncate">{student.programName || '—'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Academic info */}
                    <div className="grid grid-cols-2 gap-3 mt-5">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.06]">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/30">CGPA</p>
                        <p className="mt-1 text-sm font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                          <TrendingUp size={14} className="text-emerald-500" />
                          {student.cgpa || '0.00'}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.06]">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/30">Semester</p>
                        <p className="mt-1 text-sm font-black tracking-tight text-slate-900 dark:text-white">
                          {student.currentSemester || '—'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 mt-auto">
                    <Button
                        className="w-full group/btn"
                        onClick={() => navigate(`/faculty/advisor-registration/${student.id}`)}
                    >
                      Manage Registration
                      <ChevronRight size={16} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
          ))}

          {filteredAdvisees.length === 0 && (
              <div className="col-span-full py-24 text-center">
                <div className="w-20 h-20 rounded-[22px] bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.06] flex items-center justify-center mx-auto mb-5 text-slate-300 dark:text-white/10">
                  <Users size={32} />
                </div>
                <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">No Advisees Found</h3>
                <p className="text-sm font-medium text-slate-500 dark:text-white/40 mt-1.5 max-w-sm mx-auto">
                  You don&apos;t have any students assigned to your guidance yet, or nothing matches &quot;{search}&quot;.
                </p>
              </div>
          )}
        </div>
      </div>
  );
};

export default AdviseeList;
