import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  Plus,
  Trash2,
  AlertCircle,
  Info,
  Search,
  Clock,
  MapPin,
  Users,
  UserSquare2,
  ArrowLeft,
  GraduationCap,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  CreditCard
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import {
  getAvailableOfferings,
  getMyEnrollments,
  registerCourse,
  registerBulk,
  dropCourse
} from '../../api/enrollmentApi';
import { getSemesters } from '../../api/semesterApi';
import client from '../../api/client';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../../hooks/useAuth';

const AdvisorRegistration = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { isAdmin, isRegistrar } = useAuth();

  const [studentInfo, setStudentInfo] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemesterId, setSelectedSemesterId] = useState('');
  const [myEnrollments, setMyEnrollments] = useState([]);
  const [availableOfferings, setAvailableOfferings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [enrollType, setEnrollType] = useState('REGULAR');

  // Search & Filter
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [targetSection, setTargetSection] = useState('');
  const [departments, setDepartments] = useState([]);

  // Confirm Modals
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, data: null, type: '' });

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const [studentRes, semRes, deptRes] = await Promise.all([
        client.get(`/students/${studentId}`),
        getSemesters(),
        client.get('/departments')
      ]);

      setStudentInfo(studentRes.data);
      const sems = semRes.data.content || semRes.data || [];
      setSemesters(sems);
      setDepartments(deptRes.data.content || deptRes.data || []);

      const activeSem = sems.find(s => s.active);
      if (activeSem) setSelectedSemesterId(activeSem.id);
    } catch (err) {
      toast.error('Failed to load initial data');
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  const fetchRegistrationData = useCallback(async () => {
    if (!selectedSemesterId || !studentInfo?.batch) return;
    setLoading(true);
    try {
      const [myRes, allRes] = await Promise.all([
        getMyEnrollments(studentId, selectedSemesterId),
        getAvailableOfferings({
            semesterId: selectedSemesterId,
            batch: studentInfo.batch,
            size: 1000
        })
      ]);
      setMyEnrollments(myRes.data);
      setAvailableOfferings(allRes.data.content || allRes.data);
    } catch (err) {
      toast.error('Failed to load registration data');
    } finally {
      setLoading(false);
    }
  }, [studentId, selectedSemesterId, studentInfo?.batch]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    fetchRegistrationData();
  }, [fetchRegistrationData]);

  const handleRegister = async () => {
    setActionLoading(true);
    try {
      await registerCourse({
        studentId: studentId,
        offeringId: confirmModal.data.id,
        enrollmentType: enrollType
      });
      toast.success('Course registered successfully');
      setConfirmModal({ isOpen: false, data: null, type: '' });
      fetchRegistrationData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleClearance = async () => {
    setActionLoading(true);
    try {
        await client.put(`/students/${studentId}/clearance?isCleared=${!studentInfo.isRegistrationCleared}`);
        toast.success(studentInfo.isRegistrationCleared ? 'Student blocked from registration' : 'Student cleared for registration');
        fetchInitialData();
    } catch (err) {
        toast.error('Failed to update clearance status');
    } finally {
        setActionLoading(false);
    }
  };

  const handleBulkRegister = async () => {
    if (!targetSection) return;

    // Find all offerings that match the target section (A -> A, A1, A2, A3)
    const offeringsToRegister = availableOfferings.filter(o => {
       const isExactMatch = o.section === targetSection;
       const isLabMatch = o.section.startsWith(targetSection) && o.section.length > targetSection.length;
       return (isExactMatch || isLabMatch) && !isRegistered(o.id);
    });

    if (offeringsToRegister.length === 0) {
       return toast.error(`No new courses found for Section ${targetSection}`);
    }

    setActionLoading(true);
    try {
      await registerBulk({
        studentId: studentId,
        offeringIds: offeringsToRegister.map(o => o.id)
      });
      toast.success(`Successfully registered ${offeringsToRegister.length} courses!`);
      fetchRegistrationData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Bulk registration failed. Some courses might have conflicts.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDrop = async () => {
    setActionLoading(true);
    try {
      const enrollmentId = confirmModal.data.enrollmentId || confirmModal.data.id;
      await dropCourse(enrollmentId);
      toast.success('Course dropped');
      setConfirmModal({ isOpen: false, data: null, type: '' });
      fetchRegistrationData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to drop course');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredOfferings = availableOfferings.filter(o => {
    const matchesSearch = o.courseTitle.toLowerCase().includes(search.toLowerCase()) ||
                         o.courseCode.toLowerCase().includes(search.toLowerCase());
    const matchesDept = !selectedDept || o.departmentName === departments.find(d => d.id === selectedDept)?.name;

    // If target section is set, only show matching sections (e.g. A, A1, A2)
    const matchesSection = !targetSection || o.section === targetSection || o.section.startsWith(targetSection);

    return matchesSearch && matchesDept && matchesSection;
  }).sort((a, b) => {
     // Prioritize exact section match
     if (a.section === targetSection) return -1;
     if (b.section === targetSection) return 1;
     return a.section.localeCompare(b.section);
  });

  const totalCredits = myEnrollments.reduce((sum, e) => sum + (e.creditHours || 0), 0);
  const selectedSemester = semesters.find(s => s.id === selectedSemesterId);

  const isRegistered = (offeringId) => myEnrollments.some(e => e.offeringId === offeringId);
  const getEnrollmentId = (offeringId) => myEnrollments.find(e => e.offeringId === offeringId)?.id;

  if (loading && !studentInfo) return <div className="h-[60vh] flex items-center justify-center"><Loader size="lg" /></div>;

  return (
    <div className="space-y-8 pb-20">
      {/* Advisor Context Header */}
      <div className="flex items-center space-x-4 mb-2">
         <button onClick={() => navigate('/faculty/advisees')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <ArrowLeft size={20} />
         </button>
         <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Advising Registration</h1>
            <p className="text-sm text-gray-500 font-bold">Managing enrollment for {studentInfo?.name} ({studentInfo?.registrationNo})</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
           <Card className="bg-slate-900 border-none text-white overflow-hidden relative p-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                 <div>
                    <div className="flex flex-wrap gap-2 mb-3">
                        <div className="inline-flex items-center px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">
                           <GraduationCap size={12} className="mr-2" /> Current Semester: {selectedSemester?.name || 'Choose Semester'}
                        </div>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${studentInfo?.isRegistrationCleared ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                           {studentInfo?.isRegistrationCleared ? <ShieldCheck size={12} className="mr-2" /> : <ShieldAlert size={12} className="mr-2" />}
                           {studentInfo?.isRegistrationCleared ? 'Cleared' : 'Dues Pending'}
                        </div>
                    </div>
                    <h2 className="text-3xl font-black">{studentInfo?.name}</h2>
                    <p className="text-slate-400 mt-1 font-medium">{studentInfo?.programName}</p>
                 </div>

                 <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Assigned Credits</p>
                    <div className="flex items-baseline justify-end space-x-2">
                       <span className="text-5xl font-black leading-none">{totalCredits.toFixed(1)}</span>
                       <span className="text-xl font-bold text-slate-600">/ 18.0</span>
                    </div>
                 </div>
              </div>
              <div className="mt-8 h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                 <motion.div
                   initial={{ width: 0 }}
                   animate={{ width: `${(totalCredits / 18) * 100}%` }}
                   className={`h-full ${totalCredits > 18 ? 'bg-red-500' : 'bg-primary-500'}`}
                 />
              </div>
           </Card>
        </div>

        <Card title="Advising Info" icon={CheckCircle2}>
           <div className="space-y-4">
              {(isAdmin || isRegistrar) && (
                <div className="mb-4">
                    <Button
                        variant={studentInfo?.isRegistrationCleared ? "danger" : "primary"}
                        onClick={handleToggleClearance}
                        isLoading={actionLoading}
                        className="w-full py-2.5 text-xs flex items-center justify-center space-x-2"
                    >
                        <CreditCard size={14} />
                        <span>{studentInfo?.isRegistrationCleared ? 'Block Registration' : 'Clear Dues Manually'}</span>
                    </Button>
                </div>
              )}

              <div className="p-4 bg-primary-50 dark:bg-primary-900/10 rounded-2xl border border-primary-100 dark:border-primary-900/20">
                 <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-1">Status</p>
                 <p className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase">Registered Advisor</p>
              </div>

              <div className="space-y-3 pt-2">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Target Section</label>
                    <select
                      value={targetSection}
                      onChange={(e) => setTargetSection(e.target.value)}
                      className="w-full px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/30 rounded-xl text-sm font-black text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                       <option value="">Manual Selection</option>
                       {['A', 'B', 'C', 'D', 'E'].map(s => (
                         <option key={s} value={s}>Section {s}</option>
                       ))}
                    </select>
                 </div>

                 {targetSection && (
                   <Button
                     onClick={handleBulkRegister}
                     isLoading={actionLoading}
                     className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-indigo-500/20"
                   >
                     Register All {targetSection}
                   </Button>
                 )}
              </div>

              <div className="h-px bg-gray-100 dark:bg-gray-800 my-2" />

              <div className="space-y-1">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Change Semester</label>
                 <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <select
                      value={selectedSemesterId}
                      onChange={(e) => setSelectedSemesterId(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary-500/20 outline-none appearance-none"
                    >
                       {semesters.map(s => (
                         <option key={s.id} value={s.id}>{s.name} {s.active ? '(Active)' : ''}</option>
                       ))}
                    </select>
                 </div>
              </div>
           </div>
        </Card>
      </div>

      {/* Main Grid: Registered vs Available */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 space-y-6">
           <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center px-1">
                 <BookOpen size={20} className="mr-3 text-primary-500" /> Available Offerings
              </h2>
              <div className="flex gap-3 w-full md:w-auto">
                 <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      placeholder="Search courses..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 outline-none"
                    />
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
              {filteredOfferings.map((o) => {
                const registered = isRegistered(o.id);
                const isFull = o.enrolledCount >= o.seatLimit;

                return (
                  <Card key={o.id} className={`relative ${registered ? 'border-primary-500 bg-primary-50/30 shadow-md' : ''}`}>
                     <div className="flex justify-between items-start mb-4">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-[10px] font-bold font-mono">
                           {o.courseCode}
                        </span>
                        <span className="text-[10px] font-black uppercase text-primary-500">{o.creditHours} Credits</span>
                     </div>
                     <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">{o.courseTitle}</h3>
                     <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest mb-4">Section {o.section}</p>

                     <div className="space-y-2 mb-6">
                        <div className="flex items-center text-[11px] text-gray-500">
                           <UserSquare2 size={12} className="mr-2" /> {o.facultyName}
                        </div>
                        <div className="space-y-1.5 mt-2">
                           {o.schedules?.map((slot, sIdx) => (
                             <div key={sIdx} className="flex flex-col bg-gray-50 dark:bg-gray-900/50 p-1.5 rounded-lg border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center text-[10px] font-bold text-gray-700 dark:text-gray-300">
                                   <Clock size={12} className="mr-1.5 text-primary-500" />
                                   {slot.dayOfWeek} | {slot.startTime?.substring(0, 5)} - {slot.endTime?.substring(0, 5)}
                                </div>
                                <div className="flex items-center mt-0.5 text-[9px] text-gray-400">
                                   <MapPin size={10} className="mr-1.5" /> Room: {slot.roomNo || 'TBA'}
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>

                     <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex flex-col">
                           <span className={`text-[10px] font-black uppercase ${isFull ? 'text-red-500' : 'text-gray-400'}`}>
                              {o.enrolledCount} / {o.seatLimit} Seats
                           </span>
                           <div className="h-1 w-16 bg-gray-100 dark:bg-gray-800 rounded-full mt-1 overflow-hidden">
                              <div
                                className={`h-full transition-all ${isFull ? 'bg-red-500' : 'bg-primary-500'}`}
                                style={{ width: `${(o.enrolledCount / o.seatLimit) * 100}%` }}
                              />
                           </div>
                        </div>
                        <Button
                          variant={registered ? "danger" : "primary"}
                          size="sm"
                          disabled={!registered && isFull}
                          onClick={() => setConfirmModal({ isOpen: true, data: { ...o, enrollmentId: getEnrollmentId(o.id) }, type: registered ? 'drop' : 'register' })}
                        >
                           {registered ? 'Drop' : isFull ? 'Full' : 'Register'}
                        </Button>
                     </div>
                  </Card>
                );
              })}
           </div>
        </div>

        <div className="space-y-6">
           <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center px-1">
              <CheckCircle2 className="mr-2 text-green-500" size={20} /> Current Selection
           </h2>
           <div className="space-y-4">
              {myEnrollments.map((e) => (
                <Card key={e.id} className="!p-4 border-l-4 border-l-primary-500 hover:shadow-md transition-all">
                   <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                         <p className="text-[10px] font-black text-primary-500">{e.courseCode} (Sec {e.section})</p>
                         <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{e.courseTitle}</h4>
                         <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">{e.creditHours} Credits</p>
                      </div>
                      <button
                        onClick={() => setConfirmModal({ isOpen: true, data: { ...e, enrollmentId: e.id }, type: 'drop' })}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                         <Trash2 size={14} />
                      </button>
                   </div>
                </Card>
              ))}
              {myEnrollments.length === 0 && (
                <div className="py-20 text-center bg-gray-50 dark:bg-gray-800/20 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-700">
                   <Info className="mx-auto text-gray-300 mb-2" size={32} />
                   <p className="text-xs text-gray-400 font-bold uppercase italic tracking-widest">Empty List</p>
                </div>
              )}
           </div>
        </div>
      </div>

      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, data: null, type: '' })}
        title={confirmModal.type === 'register' ? 'Confirm Registration' : 'Confirm Drop'}
        size="sm"
      >
        <div className="text-center space-y-4 py-4">
           <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Are you sure?</p>
              <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight px-4">{confirmModal.data?.courseTitle}</h3>
              <div className="flex items-center justify-center space-x-3 mt-2 text-xs font-bold text-gray-500">
                 <span>Sec {confirmModal.data?.section}</span>
                 <span className="w-1 h-1 bg-gray-300 rounded-full" />
                 <span>{confirmModal.data?.courseCode}</span>
              </div>
           </div>

           {confirmModal.type === 'register' && (
               <div className="px-4 space-y-2 text-left pt-4">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Registration Type</label>
                   <div className="grid grid-cols-2 gap-3">
                       {['REGULAR', 'RETAKE'].map(type => (
                           <button
                               key={type}
                               type="button"
                               onClick={() => setEnrollType(type)}
                               className={`px-4 py-3 rounded-2xl text-[10px] font-black transition-all border-2 ${enrollType === type ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-500/20' : 'bg-gray-50 dark:bg-gray-800 text-gray-400 border-gray-100 dark:border-gray-700 hover:border-primary-500/30'}`}
                           >
                               {type}
                           </button>
                       ))}
                   </div>
               </div>
           )}

           <div className="flex flex-col space-y-2 pt-6 px-4">
              <Button
                variant={confirmModal.type === 'register' ? 'primary' : 'danger'}
                className="w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest"
                isLoading={actionLoading}
                onClick={confirmModal.type === 'register' ? handleRegister : handleDrop}
              >
                 Confirm {confirmModal.type}
              </Button>
              <Button
                variant="secondary"
                className="w-full py-3 rounded-2xl text-xs font-bold bg-transparent border-none"
                onClick={() => setConfirmModal({ isOpen: false, data: null, type: '' })}
              >
                 Cancel
              </Button>
           </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdvisorRegistration;
