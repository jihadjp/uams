import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { getPrograms } from '../../api/studentApi';
import client from '../../api/client';
import { User, Mail, BookOpen, Users, Phone, ShieldCheck, Calendar , Hash, GraduationCap, UserSquare2, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const StudentForm = ({ student, onSubmit, isLoading }) => {
    const studentData = student?.data || student;
    const isEdit = !!studentData && !!studentData.id;

    const [programs, setPrograms] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [batches, setBatches] = useState([]);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        values: isEdit ? {
            name: studentData.name || '',
            email: studentData.email || '',
            phone: studentData.phone || '',
            gender: studentData.gender || '',
            bloodGroup: studentData.bloodGroup || '',
            dateOfBirth: studentData.dateOfBirth || '',
            programId: studentData.programId || '',
            advisorId: studentData.advisorId || '',
            batchId: studentData.batchId || '',
            guardianName: studentData.guardianName || '',
            guardianPhone: studentData.guardianPhone || '',
            guardianRelation: studentData.guardianRelation || '',
            guardianOtherRelation: studentData.guardianOtherRelation || '',
            status: studentData.status || 'ACTIVE',
            currentSemester: studentData.currentSemester || 1
        } : {
            name: '',
            email: '',
            phone: '',
            gender: '',
            bloodGroup: '',
            dateOfBirth: '',
            programId: '',
            advisorId: '',
            batchId: '',
            guardianName: '',
            guardianPhone: '',
            guardianRelation: '',
            guardianOtherRelation: '',
            status: 'ACTIVE',
            currentSemester: 1
        }
    });

    const selectedRelation = watch('guardianRelation');
    const selectedProgramId = watch('programId');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [progRes, facRes] = await Promise.all([
                    getPrograms(),
                    client.get('/faculties?size=500')
                ]);
                setPrograms(progRes.data?.content || progRes.data || []);
                setFaculties(facRes.data?.content || facRes.data || []);
            } catch (err) {
                toast.error('Failed to load form data');
            }
        };
        fetchData();
    }, []);

    // Fetch batches when program changes
    useEffect(() => {
        if (!selectedProgramId) {
            setBatches([]);
            return;
        }
        client.get('/batches/by-program', { params: { programId: selectedProgramId } })
            .then(res => setBatches(res.data || []))
            .catch(() => {});
    }, [selectedProgramId]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isEdit && (
                    <Input
                        label="Student ID"
                        icon={Hash}
                        value={studentData?.studentId || 'PENDING'}
                        readOnly
                        className="opacity-70 bg-gray-50 dark:bg-gray-800"
                    />
                )}
                <Input
                    label="Full Name"
                    icon={User}
                    {...register('name', { required: 'Name is required' })}
                    error={errors.name?.message}
                    placeholder="Enter full name"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Email Address"
                    type="email"
                    icon={Mail}
                    {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                    })}
                    error={errors.email?.message}
                    placeholder="example@univ.edu"
                    readOnly={isEdit && !!studentData?.email}
                    className={isEdit && !!studentData?.email ? "opacity-70 bg-gray-50 dark:bg-gray-800" : ""}
                />
                <Input
                    label="Contact Number"
                    icon={Phone}
                    {...register('phone')}
                    error={errors.phone?.message}
                    placeholder="+880..."
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Gender</label>
                    <select
                        {...register('gender')}
                        className="block w-full px-4 py-3 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    >
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Blood Group</label>
                    <select
                        {...register('bloodGroup')}
                        className="block w-full px-4 py-3 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    >
                        <option value="">Select Group</option>
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                            <option key={bg} value={bg}>{bg}</option>
                        ))}
                    </select>
                </div>
                <Input
                    label="Date of Birth"
                    type="date"
                    icon={Calendar}
                    {...register('dateOfBirth')}
                    error={errors.dateOfBirth?.message}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Program</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                            <BookOpen size={18} />
                        </div>
                        <select
                            {...register('programId', { required: 'Program is required' })}
                            className={`block w-full pl-11 pr-10 py-3 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none appearance-none ${errors.programId ? 'border-red-400' : ''}`}
                        >
                            <option value="">Select Program</option>
                            {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <ChevronDown size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.programId && <p className="text-xs text-red-500 mt-1 ml-1">{errors.programId.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Batch</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                            <Users size={18} />
                        </div>
                        <select
                            {...register('batchId', { required: 'Batch is required' })}
                            disabled={!selectedProgramId}
                            className={`block w-full pl-11 pr-10 py-3 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none appearance-none disabled:opacity-50 ${errors.batchId ? 'border-red-400' : ''}`}
                        >
                            <option value="">{!selectedProgramId ? 'Select Program First' : 'Select Batch'}</option>
                            {batches.map(b => <option key={b.id} value={b.id}>Batch {b.batchNumber}</option>)}
                        </select>
                        <ChevronDown size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.batchId && <p className="text-xs text-red-500 mt-1 ml-1">{errors.batchId.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Account Status</label>
                    <select
                        {...register('status')}
                        className="block w-full px-4 py-3 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    >
                        <option value="ACTIVE">Active</option>
                        <option value="DROPPED">Dropped</option>
                        <option value="GRADUATED">Graduated</option>
                        <option value="ON_LEAVE">On Leave</option>
                    </select>
                </div>
                {isEdit ? (
                    <Input
                        label="Current Semester"
                        type="number"
                        icon={GraduationCap}
                        {...register('currentSemester')}
                        error={errors.currentSemester?.message}
                        placeholder="e.g. 1"
                    />
                ) : (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Assign Advisor</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                                <UserSquare2 size={18} />
                            </div>
                            <select
                                {...register('advisorId')}
                                className="block w-full pl-11 pr-10 py-3 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none appearance-none"
                            >
                                <option value="">No Advisor (TBA)</option>
                                {faculties.map(f => <option key={f.id} value={f.id}>{f.name} ({f.departmentName})</option>)}
                            </select>
                            <ChevronDown size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                )}
            </div>

            {isEdit && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Assign Advisor</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                            <UserSquare2 size={18} />
                        </div>
                        <select
                            {...register('advisorId')}
                            className="block w-full pl-11 pr-10 py-3 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none appearance-none"
                        >
                            <option value="">No Advisor (TBA)</option>
                            {faculties.map(f => <option key={f.id} value={f.id}>{f.name} ({f.departmentName})</option>)}
                        </select>
                        <ChevronDown size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            )}

            {/* Guardian Information - Moved outside isEdit */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center">
                    <ShieldCheck size={16} className="mr-2 text-primary-500" /> Guardian Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Guardian Name"
                        icon={User}
                        {...register('guardianName')}
                        error={errors.guardianName?.message}
                        placeholder="Father/Mother name"
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Guardian Relation</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                                <Users size={18} />
                            </div>
                            <select
                                {...register('guardianRelation')}
                                className={`block w-full pl-11 pr-10 py-3 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none appearance-none`}
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
                </div>

                <AnimatePresence>
                    {selectedRelation === 'OTHER' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-6">
                            <Input
                                label="Specify Relation"
                                icon={Users}
                                {...register('guardianOtherRelation')}
                                error={errors.guardianOtherRelation?.message}
                                placeholder="e.g. Uncle, Aunt"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <Input
                        label="Guardian Phone"
                        icon={Phone}
                        {...register('guardianPhone')}
                        error={errors.guardianPhone?.message}
                        placeholder="+880..."
                    />
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <Button type="submit" isLoading={isLoading} className="w-full md:w-auto px-10">
                    {isEdit ? 'Update Profile' : 'Register Student'}
                </Button>
            </div>
        </form>
    );
};

export default StudentForm;
