import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import client from '../../api/client';
import { BookOpen, Type, Building2, ClipboardList, Layers, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const CourseForm = ({ course, onSubmit, isLoading }) => {
    const isEdit = !!course;
    const [departments, setDepartments] = useState([]);
    const [courses, setCourses] = useState([]);

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        values: {
            courseCode: course?.courseCode || '',
            title: course?.title || '',
            departmentId: course?.departmentId || course?.department?.id || '',
            creditHours: course?.creditHours || 3.0,
            prerequisiteCourseId: course?.prerequisiteCourseId || course?.prerequisiteCourse?.id || '',
            description: course?.description || '',
            courseType: course?.courseType || 'THEORY',
            isActive: course?.isActive ?? true
        }
    });

    const selectedDeptId = watch('departmentId');

    useEffect(() => {
        let isMounted = true;
        const fetchMeta = async () => {
            try {
                const [deptRes, courseRes] = await Promise.all([
                    client.get('/departments'),
                    client.get('/courses', { params: { size: 1000 } })
                ]);
                if (!isMounted) return;

                setDepartments(deptRes.data?.content || deptRes.data || []);
                setCourses(courseRes.data?.content || courseRes.data || []);
            } catch (err) {
                toast.error('Failed to load form data');
            }
        };
        fetchMeta();
        return () => { isMounted = false; };
    }, []);

    const filteredPrerequisites = Array.isArray(courses) ? courses.filter(c => {
        const courseDeptId = c.departmentId || c.department?.id;
        const isSameDepartment = String(courseDeptId) === String(selectedDeptId);
        const isNotSelf = !isEdit || String(c.id) !== String(course?.id);
        return isSameDepartment && isNotSelf;
    }) : [];

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Course Code"
                    icon={Type}
                    {...register('courseCode', { required: 'Code is required' })}
                    error={errors.courseCode?.message}
                    placeholder="e.g. CSE-101"
                />
                <Input
                    label="Course Title"
                    icon={BookOpen}
                    {...register('title', { required: 'Title is required' })}
                    error={errors.title?.message}
                    placeholder="e.g. Data Structures"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Department</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                            <Building2 size={18} />
                        </div>
                        <select
                            {...register('departmentId', { required: 'Department is required' })}
                            className="block w-full pl-11 pr-10 py-3 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white outline-none appearance-none cursor-pointer"
                        >
                            <option value="">Select Department</option>

                            {/* 💡 API লোড হওয়ার আগ পর্যন্ত যেন ID টি ড্রপডাউনে হারিয়ে না যায় */}
                            {course?.department && !departments.some(d => String(d.id) === String(course.department.id || course.departmentId)) && (
                                <option value={course.department.id || course.departmentId}>
                                    {course.department.name || 'Loading...'}
                                </option>
                            )}

                            {departments.map(d => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                        <ChevronDown size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.departmentId && (
                        <p className="text-xs text-red-500 mt-1 ml-1">{errors.departmentId.message}</p>
                    )}
                </div>

                <Input
                    label="Credit Hours"
                    type="number"
                    step="0.5"
                    icon={ClipboardList}
                    {...register('creditHours', { required: 'Required', min: 0 })}
                    error={errors.creditHours?.message}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Course Type</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                            <Layers size={18} />
                        </div>
                        <select
                            {...register('courseType')}
                            className="block w-full pl-11 pr-10 py-3 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none appearance-none cursor-pointer"
                        >
                            <option value="THEORY">Theory</option>
                            <option value="LAB">Lab</option>
                            <option value="PROJECT">Project</option>
                            <option value="RESEARCH">Research</option>
                        </select>
                        <ChevronDown size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {isEdit && (
                    <div className="flex flex-col justify-end pb-1.5">
                        <label className="flex items-center space-x-3 cursor-pointer group p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 transition-all hover:bg-white dark:hover:bg-gray-800">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    {...register('isActive')}
                                    className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Active Status</span>
                                <span className="text-[10px] text-gray-400 font-medium">Inactive courses are hidden from enrollment</span>
                            </div>
                        </label>
                    </div>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">Prerequisite Course (Optional)</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500 transition-colors">
                        <BookOpen size={18} />
                    </div>
                    <select
                        {...register('prerequisiteCourseId')}
                        className="block w-full pl-11 pr-10 py-3 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none appearance-none disabled:opacity-50 cursor-pointer"
                        disabled={!selectedDeptId}
                    >
                        <option value="">No Prerequisite</option>
                        {filteredPrerequisites.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.courseCode}: {c.title}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Description</label>
                <div className="relative">
                    <textarea
                        {...register('description')}
                        rows="3"
                        className="block w-full px-4 py-3 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                        placeholder="Course details..."
                    />
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" isLoading={isLoading} className="w-full md:w-auto px-10">
                    {isEdit ? 'Update Course' : 'Create Course'}
                </Button>
            </div>
        </form>
    );
};

export default CourseForm;