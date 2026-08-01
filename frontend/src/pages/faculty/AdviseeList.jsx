import { useState, useEffect } from 'react';
import {
  Users,
  Search,
  ChevronRight,
  GraduationCap,
  BookOpen,
  TrendingUp,
  UserSquare2
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

  const filteredAdvisees = advisees.filter(s =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.registrationNo?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;

  return (
      <div className="space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary-600 rounded-2xl text-white shadow-lg shadow-primary-500/30">
              <Users size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">My Advisees</h1>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Student Mentorship & Advising</p>
            </div>
          </div>

          <div className="relative group w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
            <input
                type="text"
                placeholder="Search by name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all text-sm font-medium shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAdvisees.map((student, idx) => (
              <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
              >
                <Card className="group hover:border-primary-400 transition-all duration-300 relative overflow-hidden h-full flex flex-col">
                  <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                    <UserSquare2 size={120} />
                  </div>

                  <div className="flex items-center space-x-4 mb-6">
                    {/* ⚡ প্রোফাইল পিকচার হ্যান্ডলিং (ছবি থাকলে ছবি দেখাবে, না থাকলে আইকন দেখাবে) */}
                    <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 border border-primary-100 dark:border-primary-900/30 overflow-hidden shrink-0">
                      {student.profileImage ? (
                          <img
                              src={student.profileImage.startsWith('http') || student.profileImage.startsWith('/api') ? student.profileImage : `/api/uploads/${student.profileImage}`}
                              alt={student.name}
                              className="w-full h-full object-cover"
                          />
                      ) : (
                          <GraduationCap size={28} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-gray-900 dark:text-white truncate text-lg leading-tight">{student.name}</h3>
                      <p className="text-xs font-black text-primary-600 uppercase tracking-widest mt-1">{student.registrationNo}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8 flex-1">
                    <div className="flex items-center text-xs font-bold text-gray-500">
                      <BookOpen size={14} className="mr-2 text-primary-500" />
                      <span className="truncate">{student.programName}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center text-gray-500 font-bold">
                        <TrendingUp size={14} className="mr-2 text-emerald-500" />
                        <span>CGPA: <span className="text-gray-900 dark:text-white">{student.cgpa || '0.00'}</span></span>
                      </div>
                      <div className="flex items-center text-gray-500 font-bold">
                        <Users size={14} className="mr-2 text-blue-500" />
                        <span>Semester: <span className="text-gray-900 dark:text-white">{student.currentSemester}</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-gray-50 dark:border-gray-700 mt-auto">
                    <Button
                        className="w-full group/btn"
                        onClick={() => navigate(`/faculty/advisor-registration/${student.id}`)}
                    >
                      Manage Registration
                      <ChevronRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
          ))}

          {filteredAdvisees.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-full w-fit mx-auto mb-4 text-gray-300">
                  <Users size={64} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">No Advisees Found</h3>
                <p className="text-gray-500 mt-1">You don't have any students assigned to your guidance yet.</p>
              </div>
          )}
        </div>
      </div>
  );
};

export default AdviseeList;