import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import client from '../../api/client';
import { GraduationCap, Building2, Clock, Award, Type } from 'lucide-react';
import toast from 'react-hot-toast';

const ProgramForm = ({ program, onSubmit, isLoading }) => {
    // Safe unwrapping
    const programData = program?.data || program;
    const isEdit = !!programData && !!programData.id;

    const [departments, setDepartments] = useState([]);

    // defaultValues এর বদলে 'values' ব্যবহার করা হয়েছে
    const { register, handleSubmit, formState: { errors } } = useForm({
        values: isEdit ? {
            name: programData.name || '',
            departmentId: programData.departmentId || '',
            degreeLevel: programData.degreeLevel || 'BACHELOR',
            durationYears: programData.durationYears || 4.0,
            totalCredits: programData.totalCredits || 148.5
        } : {
            name: '',
            departmentId: '',
            degreeLevel: 'BACHELOR',
            durationYears: 4.0,
            totalCredits: 148.5
        }
    });

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await client.get('/departments');
                setDepartments(res.data?.content || res.data || []);
            } catch (err) {
                toast.error('Failed to load departments');
            }
        };
        fetchDepartments();
    }, []);

    const degreeLevels = ['BACHELOR', 'MASTERS', 'PHD'];

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
                label="Program Name"
                icon={Type}
                {...register('name', { required: 'Name is required' })}
                error={errors.name?.message}
                placeholder="e.g. B.Sc. in Computer Science & Engineering"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Department</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                            <Building2 size={18} />
                        </div>
                        {/* Dynamic key যোগ করা হয়েছে */}
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Degree Level</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                            <Award size={18} />
                        </div>
                        <select
                            {...register('degreeLevel', { required: 'Required' })}
                            className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 appearance-none"
                        >
                            {degreeLevels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Duration (Years)"
                    type="number"
                    step="0.5"
                    icon={Clock}
                    {...register('durationYears', { required: 'Required', min: 1 })}
                    error={errors.durationYears?.message}
                />
                <Input
                    label="Total Credits"
                    type="number"
                    step="0.1"
                    icon={GraduationCap}
                    {...register('totalCredits', { required: 'Required', min: 1 })}
                    error={errors.totalCredits?.message}
                />
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" isLoading={isLoading} className="w-full md:w-auto px-10">
                    {isEdit ? 'Update Program' : 'Create Program'}
                </Button>
            </div>
        </form>
    );
};

export default ProgramForm;