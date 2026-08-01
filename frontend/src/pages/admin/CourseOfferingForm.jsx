import { useForm } from 'react-hook-form';
import { useEffect, useState, useMemo } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import client from '../../api/client';
import {
  BookOpen,
  UserSquare2,
  Clock,
  Hash,
  Users,
  ChevronDown,
  Building2,
  Layers
} from 'lucide-react';
import toast from 'react-hot-toast';

const CourseOfferingForm = ({ offering, courseContext, semesterId, batchContext, departmentId, onSubmit, isLoading }) => {
  const isEdit = !!offering;
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [batches, setBatches] = useState([]);
  const [sections, setSections] = useState([]);

  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [loadingOptions, setLoadingOptions] = useState(false);

  // 1. Memoize initial form values
  const initialValues = useMemo(() => ({
    courseId: courseContext?.id || offering?.courseId || '',
    facultyId: offering?.facultyId || '',
    batchId: offering?.batchId || '',
    sectionId: offering?.sectionId || '',
    scheduleInfo: offering?.scheduleInfo || '',
    seatLimit: offering?.seatLimit || 40,
    semesterId: semesterId || offering?.semesterId || ''
  }), [offering?.id, courseContext?.id, semesterId]);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    values: initialValues
  });

  const selectedBatchId = watch('batchId');
  const selectedCourseId = watch('courseId');

  // 2. Fetch Department Metadata
  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await client.get('/departments');
        setDepartments(res.data?.content || res.data || []);
      } catch (err) {}
    };
    fetchDepts();
  }, []);

  // 3. Fetch Department's Courses & Faculty options
  useEffect(() => {
    let isMounted = true;
    const targetDeptId = departmentId || offering?.departmentId || courseContext?.departmentId;

    if (!targetDeptId) return;

    setSelectedDeptId(targetDeptId);
    setLoadingOptions(true);

    Promise.all([
      client.get('/courses', { params: { departmentId: targetDeptId, size: 1000 } }),
      client.get('/faculties', { params: { departmentId: targetDeptId, size: 1000 } })
    ])
        .then(([cRes, fRes]) => {
          if (!isMounted) return;
          const loadedCourses = cRes.data?.content || cRes.data || [];
          setCourses(loadedCourses);
          setFaculty(fRes.data?.content || fRes.data || []);

          // Sync courseId value to ensure it's selected after options load
          if (initialValues.courseId) {
            setValue('courseId', String(initialValues.courseId));
          }
        })
        .catch(() => {
          toast.error('Failed to load department options');
        })
        .finally(() => {
          if (isMounted) setLoadingOptions(false);
        });

    return () => { isMounted = false; };
  }, [departmentId, offering?.departmentId, courseContext?.departmentId, initialValues.courseId, setValue]);

  // 4. Fetch Batches when Course changes
  useEffect(() => {
    if (!selectedCourseId) return;

    const course = courses.find(c => String(c.id) === String(selectedCourseId));
    const targetProgramId = course?.programId || courseContext?.programId;

    if (targetProgramId) {
       client.get('/batches/by-program', { params: { programId: targetProgramId } })
         .then(res => {
            setBatches(res.data || []);
            if (offering?.batchId) setValue('batchId', offering.batchId);
         })
         .catch(() => toast.error('Failed to load batches'));
    }
  }, [selectedCourseId, courses, courseContext?.programId, offering?.batchId, setValue]);

  // 5. Fetch Sections when Batch changes
  useEffect(() => {
    if (!selectedBatchId) {
      setSections([]);
      return;
    }
    client.get(`/batches/${selectedBatchId}/sections`)
      .then(res => {
        setSections(res.data || []);
        if (offering?.sectionId) setValue('sectionId', offering.sectionId);
      })
      .catch(() => toast.error('Failed to load sections'));
  }, [selectedBatchId, offering?.sectionId, setValue]);

  // Handle manual department selection
  const handleDeptSelect = async (deptId) => {
    setSelectedDeptId(deptId);
    setValue('courseId', '');
    setValue('facultyId', '');
    if (!deptId) {
      setCourses([]);
      setFaculty([]);
      return;
    }

    setLoadingOptions(true);
    try {
      const [cRes, fRes] = await Promise.all([
        client.get('/courses', { params: { departmentId: deptId, size: 1000 } }),
        client.get('/faculties', { params: { departmentId: deptId, size: 1000 } })
      ]);
      setCourses(cRes.data?.content || cRes.data || []);
      setFaculty(fRes.data?.content || fRes.data || []);
    } catch (err) {
      toast.error('Failed to load department options');
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleFormSubmit = (data) => {
    const finalCourseId = courseContext?.id || data.courseId;
    const finalSemesterId = semesterId || data.semesterId;

    if (!finalSemesterId) {
      toast.error('Please select a Semester first');
      return;
    }

    if (!finalCourseId) {
      toast.error('Please select a Course');
      return;
    }

    if (!data.batchId) {
      toast.error('Please select a Target Batch');
      return;
    }

    if (!data.sectionId) {
      toast.error('Please select a Section');
      return;
    }

    const payload = {
      courseId: finalCourseId,
      facultyId: data.facultyId,
      semesterId: finalSemesterId,
      batchId: data.batchId,
      sectionId: data.sectionId,
      scheduleInfo: data.scheduleInfo?.trim() || '',
      seatLimit: parseInt(data.seatLimit, 10) || 40
    };

    onSubmit(payload);
  };

  return (
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 pt-2">
        {/* Context Summary Header */}
        {(courseContext || isEdit) && (
            <div className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/20 flex flex-wrap gap-x-8 gap-y-2">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-400 block tracking-widest">Target Course</span>
                <span className="text-sm font-black text-[#2D2A4F] dark:text-indigo-200">
                  {courseContext?.courseCode || offering?.courseCode}: {courseContext?.title || offering?.courseTitle}
                </span>
              </div>
              {isEdit && (
                <div>
                  <span className="text-[10px] font-black uppercase text-indigo-400 block tracking-widest">Section</span>
                  <span className="text-sm font-black text-[#2D2A4F] dark:text-indigo-200">Batch {offering?.targetBatch} - Sec {offering?.section}</span>
                </div>
              )}
            </div>
        )}

        {/* Row 1: Department & Course */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Department</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Building2 size={18} />
              </div>
              <select
                  value={selectedDeptId}
                  onChange={(e) => handleDeptSelect(e.target.value)}
                  disabled={!!departmentId || isEdit}
                  className="block w-full pl-11 pr-10 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20 appearance-none disabled:opacity-70 cursor-pointer text-gray-900 dark:text-white"
              >
                <option value="">Select Department</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <ChevronDown size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Course</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <BookOpen size={18} />
              </div>
              <select
                  {...register('courseId', { required: !courseContext ? 'Course selection is required' : false })}
                  disabled={!!courseContext || isEdit || loadingOptions}
                  className={`block w-full pl-11 pr-10 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20 appearance-none disabled:opacity-70 cursor-pointer text-gray-900 dark:text-white ${errors.courseId ? 'border-red-400' : ''}`}
              >
                <option value="">{loadingOptions ? 'Loading Courses...' : 'Select Course'}</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.courseCode}: {c.title}</option>)}
              </select>
              <ChevronDown size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Row 2: Batch & Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Target Batch</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Users size={18} />
              </div>
              <select
                  {...register('batchId', { required: 'Target Batch is required' })}
                  disabled={!selectedCourseId || isEdit}
                  className={`block w-full pl-11 pr-10 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20 appearance-none disabled:opacity-70 cursor-pointer text-gray-900 dark:text-white ${errors.batchId ? 'border-red-400' : ''}`}
              >
                <option value="">{!selectedCourseId ? 'Select Course First' : 'Select Batch'}</option>
                {batches.map(b => <option key={b.id} value={b.id}>Batch {b.batchNumber}</option>)}
              </select>
              <ChevronDown size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Section</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Layers size={18} />
              </div>
              <select
                  {...register('sectionId', { required: 'Section is required' })}
                  disabled={!selectedBatchId || isEdit}
                  className={`block w-full pl-11 pr-10 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20 appearance-none disabled:opacity-70 cursor-pointer text-gray-900 dark:text-white ${errors.sectionId ? 'border-red-400' : ''}`}
              >
                <option value="">{!selectedBatchId ? 'Select Batch First' : 'Select Section'}</option>
                {sections.map(s => <option key={s.id} value={s.id}>Section {s.name}</option>)}
              </select>
              <ChevronDown size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Row 3: Faculty & Seat Limit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Assigned Faculty</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <UserSquare2 size={18} />
              </div>
              <select
                  {...register('facultyId', { required: 'Faculty assignment is required' })}
                  disabled={loadingOptions}
                  className={`block w-full pl-11 pr-10 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary-500/20 appearance-none cursor-pointer text-gray-900 dark:text-white ${errors.facultyId ? 'border-red-400' : ''}`}
              >
                <option value="">{loadingOptions ? 'Loading Faculty...' : 'Choose Faculty'}</option>
                {faculty.map(f => (
                    <option key={f.id} value={f.id}>
                      {(f.name || f.facultyName || 'Unknown Faculty')} ({f.currentTeachingLoad || 0} sections)
                    </option>
                ))}
              </select>
              <ChevronDown size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <Input
              label="Seat Capacity"
              type="number"
              {...register('seatLimit', { required: 'Seat capacity is required', min: { value: 1, message: 'Min 1' } })}
              icon={Users}
              error={errors.seatLimit?.message}
          />
        </div>

        {/* Row 4: Schedule Info */}
        <div>
          <Input
              label="Schedule & Room Info"
              {...register('scheduleInfo')}
              placeholder="e.g. Sun-Tue 10:00 AM - 11:30 AM | Room 402"
              icon={Clock}
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
          <Button type="submit" isLoading={isLoading} className="px-12 py-3">
            {isEdit ? 'Update Offering' : 'Publish Offering'}
          </Button>
        </div>
      </form>
  );
};

export default CourseOfferingForm;
