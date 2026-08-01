import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { getDepartmentFaculty } from '../../api/departmentApi';
import { Building2, Hash, UserSquare2, Type } from 'lucide-react';
import toast from 'react-hot-toast';

const DepartmentForm = ({ department, onSubmit, isLoading }) => {
  const isEdit = !!department;
  const [faculty, setFaculty] = useState([]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: department?.name || '',
      code: department?.code || '',
      deptNumber: department?.deptNumber || '',
      headFacultyId: department?.headFacultyId || ''
    }
  });

  useEffect(() => {
    if (isEdit && department?.id) {
      const fetchFaculty = async () => {
        try {
          const res = await getDepartmentFaculty(department.id);
          setFaculty(res.data.content || res.data);
        } catch (err) {
          toast.error('Failed to load department faculty');
        }
      };
      fetchFaculty();
    }
  }, [isEdit, department?.id]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Department Name"
          icon={Building2}
          {...register('name', { required: 'Name is required' })}
          error={errors.name?.message}
          placeholder="e.g. Computer Science & Engineering"
        />
        <Input
          label="Department Code"
          icon={Type}
          {...register('code', { required: 'Code is required' })}
          error={errors.code?.message}
          placeholder="e.g. CSE"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Dept Number (Numeric)"
          icon={Hash}
          {...register('deptNumber', {
            required: 'Required for ID generation',
            pattern: { value: /^[0-9]+$/, message: 'Must be numeric' }
          })}
          error={errors.deptNumber?.message}
          placeholder="e.g. 15"
        />

        {isEdit && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Head of Department</label>
            <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                  <UserSquare2 size={18} />
               </div>
               <select
                 {...register('headFacultyId')}
                 className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none appearance-none"
               >
                 <option value="">Not Assigned</option>
                 {faculty.map(f => <option key={f.id} value={f.id}>{f.name} ({f.designation})</option>)}
               </select>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" isLoading={isLoading} className="w-full md:w-auto px-10">
          {isEdit ? 'Update Department' : 'Create Department'}
        </Button>
      </div>
    </form>
  );
};

export default DepartmentForm;
