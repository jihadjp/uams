import { useForm } from 'react-hook-form';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Calendar, Type, Hash, Layers, ChevronDown } from 'lucide-react';

const SemesterForm = ({ semester, onSubmit, isLoading }) => {
  const isEdit = !!semester;

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    values: {
      term: semester?.term || 'SPRING',
      academicYear: semester?.academicYear || new Date().getFullYear(),
      startDate: semester?.startDate || '',
      endDate: semester?.endDate || '',
      registrationDeadline: semester?.registrationDeadline || '',
      addDropDeadline: semester?.addDropDeadline || '',
      gradeDeadline: semester?.gradeDeadline || '',
    }
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1 text-[10px] font-black uppercase tracking-widest">Semester Term</label>
          <div className="relative group">
             <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                <Layers size={18} />
             </div>
             <select
               {...register('term', { required: 'Term is required' })}
               className="block w-full pl-11 pr-10 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none appearance-none font-bold text-sm"
             >
               <option value="SPRING">Spring</option>
               <option value="SUMMER">Summer</option>
               <option value="FALL">Fall</option>
             </select>
             <ChevronDown size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <Input
          label="Academic Year"
          type="number"
          icon={Hash}
          {...register('academicYear', { required: 'Year is required', min: 2020, max: 2100 })}
          error={errors.academicYear?.message}
          placeholder="e.g. 2026"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Class Start Date"
          type="date"
          icon={Calendar}
          {...register('startDate', { required: 'Required' })}
          error={errors.startDate?.message}
        />
        <Input
          label="Class End Date"
          type="date"
          icon={Calendar}
          {...register('endDate', {
            required: 'Required',
            validate: value => !startDate || value > startDate || 'End date must be after start date'
          })}
          error={errors.endDate?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
        <div className="md:col-span-3">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-500 mb-2">Critical Deadlines</h4>
        </div>
        <Input
          label="Registration"
          type="date"
          {...register('registrationDeadline', { required: 'Required' })}
          error={errors.registrationDeadline?.message}
          className="text-xs"
        />
        <Input
          label="Add/Drop"
          type="date"
          {...register('addDropDeadline')}
          error={errors.addDropDeadline?.message}
          className="text-xs"
        />
        <Input
          label="Grade Entry"
          type="date"
          {...register('gradeDeadline')}
          error={errors.gradeDeadline?.message}
          className="text-xs"
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" isLoading={isLoading} className="w-full md:w-auto px-16 py-3 font-black uppercase text-xs tracking-widest">
          {isEdit ? 'Update Semester' : 'Initialize Semester'}
        </Button>
      </div>
    </form>
  );
};

export default SemesterForm;
