import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { getDepartments } from '../../api/facultyApi';
import { User, Mail, Building2, Briefcase, Phone, ChevronDown, Hash } from 'lucide-react';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';

const FacultyForm = ({ faculty, onSubmit, isLoading }) => {
  const facultyData = faculty?.data || faculty;
  const isEdit = !!facultyData && !!facultyData.id;

  const [departments, setDepartments] = useState([]);
  const [metaLoading, setMetaLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    values: isEdit
      ? {
          name: facultyData.name || '',
          email: facultyData.email || '',
          departmentId: facultyData.departmentId || '',
          employeeId: facultyData.employeeId || '',
          designation: facultyData.designation || 'Lecturer',
          phone: facultyData.phone || '',
        }
      : {
          name: '',
          email: '',
          departmentId: '',
          employeeId: '',
          designation: 'Lecturer',
          phone: '',
        },
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      setMetaLoading(true);
      try {
        const res = await getDepartments();
        setDepartments(res.data?.content || res.data || []);
      } catch (err) {
        toast.error('Failed to load departments');
      } finally {
        setMetaLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  if (metaLoading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center gap-4">
        <Loader size="lg" />
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/30">Preparing Form Data...</p>
      </div>
    );
  }

  const designations = ['Lecturer', 'Assistant Professor', 'Associate Professor', 'Professor'];

  return (
    <form key={facultyData?.id || 'new'} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {isEdit && (
          <Input
            label="Employee ID"
            icon={Hash}
            value={facultyData?.employeeId || ''}
            readOnly
            className="opacity-60"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
          })}
          error={errors.email?.message}
          placeholder="example@univ.edu"
          readOnly={isEdit}
          className={isEdit ? 'opacity-60' : ''}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="mb-2 block text-xs font-bold text-slate-700 dark:text-white/60 ml-1">Department</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#007A55] transition-colors">
              <Building2 size={18} />
            </div>
            <select
              key={`dept-${departments.length}`}
              {...register('departmentId', { required: 'Department is required' })}
              className={`block w-full pl-12 pr-10 py-3.5 bg-slate-50 dark:bg-white/[0.06] border rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:ring-4 focus:ring-[#007A55]/10 focus:border-[#007A55] transition-all outline-none appearance-none ${
                errors.departmentId ? 'border-red-300 focus:border-red-400 focus:ring-red-500/10' : 'border-slate-200 dark:border-white/10'
              }`}
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <ChevronDown size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          {errors.departmentId && <p className="text-xs font-semibold text-red-500 mt-1.5 ml-1">{errors.departmentId.message}</p>}
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold text-slate-700 dark:text-white/60 ml-1">Designation</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#007A55] transition-colors">
              <Briefcase size={18} />
            </div>
            <select
              {...register('designation', { required: 'Designation is required' })}
              className="block w-full pl-12 pr-10 py-3.5 bg-slate-50 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:ring-4 focus:ring-[#007A55]/10 focus:border-[#007A55] transition-all outline-none appearance-none"
            >
              {designations.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <ChevronDown size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <Input label="Phone Number" icon={Phone} {...register('phone')} placeholder="+880..." />

      <div className="flex justify-end pt-2">
        <Button type="submit" isLoading={isLoading} className="w-full md:w-auto px-10">
          {isEdit ? 'Update Faculty' : 'Add Faculty'}
        </Button>
      </div>
    </form>
  );
};

export default FacultyForm;
