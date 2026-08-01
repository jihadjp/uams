import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { getDepartments } from '../../api/facultyApi';
import { User, Mail, Building2, Briefcase, Phone, Hash } from 'lucide-react';
import toast from 'react-hot-toast';

const FacultyForm = ({ faculty, onSubmit, isLoading }) => {
    // Safe Unwrapping
    const facultyData = faculty?.data || faculty;
    const isEdit = !!facultyData && !!facultyData.id;

    const [departments, setDepartments] = useState([]);

    // 'values' ব্যবহার করার ফলে facultyData আসার সাথে সাথেই ফর্মে ডাটা সেট হয়ে যাবে
    const { register, handleSubmit, formState: { errors } } = useForm({
        values: isEdit ? {
            name: facultyData.name || '',
            email: facultyData.email || '',
            departmentId: facultyData.departmentId || '',
            employeeId: facultyData.employeeId || '',
            designation: facultyData.designation || 'Lecturer',
            phone: facultyData.phone || ''
        } : {
            name: '',
            email: '',
            departmentId: '',
            employeeId: '',
            designation: 'Lecturer',
            phone: ''
        }
    });

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await getDepartments();
                setDepartments(res.data?.content || res.data || []);
            } catch (err) {
                toast.error('Failed to load departments');
            }
        };
        fetchDepartments();
    }, []);

    const designations = [
        'Lecturer',
        'Assistant Professor',
        'Associate Professor',
        'Professor'
    ];

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isEdit && (
                    <Input
                        label="Employee ID"
                        icon={Hash}
                        value={facultyData?.employeeId || ''}
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
                    readOnly={isEdit}
                    className={isEdit ? "opacity-70 bg-gray-50 dark:bg-gray-800" : ""}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Department</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                            <Building2 size={18} />
                        </div>
                        {/* key যোগ করা হয়েছে যেন API থেকে ডাটা আসার সাথে সাথে সিলেক্টেড ভ্যালু পেয়ে যায় */}
                        <select
                            key={`dept-${departments.length}`}
                            {...register('departmentId', { required: 'Department is required' })}
                            className={`block w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none appearance-none ${errors.departmentId ? 'border-red-400' : ''}`}
                        >
                            <option value="">Select Department</option>
                            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                    </div>
                    {errors.departmentId && <p className="text-xs text-red-500 mt-1 ml-1">{errors.departmentId.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Designation</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                            <Briefcase size={18} />
                        </div>
                        <select
                            {...register('designation', { required: 'Designation is required' })}
                            className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 appearance-none"
                        >
                            {designations.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <Input
                label="Phone Number"
                icon={Phone}
                {...register('phone')}
                placeholder="+880..."
            />

            <div className="flex justify-end space-x-3 pt-4">
                <Button type="submit" isLoading={isLoading} className="w-full md:w-auto px-10">
                    {isEdit ? 'Update Faculty' : 'Add Faculty'}
                </Button>
            </div>
        </form>
    );
};

export default FacultyForm;