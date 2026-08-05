import {
  LayoutDashboard,
  Users,
  UserSquare2,
  BookOpen,
  Building2,
  GraduationCap,
  ClipboardCheck,
  FileText,
  Bell,
  Wallet,
  Settings,
  Layers,
  Calendar as CalendarIcon,
  BookMarked,
  Clock,
  Star,
  ShieldCheck,
  Gem,
  School,
  Cog,
  Briefcase,
  UserPlus,
  Search,
  LogOut,
  ChevronRight,
  TrendingUp,
  Award,
  Book,
  Bus,
  Home,
  Laptop
} from 'lucide-react';

export const SIDEBAR_CONFIG = {
  ADMIN: [
    { type: "single", label: "Dashboard", icon: LayoutDashboard, path: "/portal/dashboard" },
    {
      type: "group",
      label: "User Management",
      icon: Users,
      children: [
        { label: "Students", path: "/portal/students", icon: GraduationCap },
        { label: "Faculty", path: "/portal/faculty", icon: UserSquare2 },
        { label: "Registrars", path: "/portal/registrars", icon: ShieldCheck },
      ]
    },
    {
      type: "group",
      label: "Academic Setup",
      icon: School,
      children: [
        { label: "Departments", path: "/portal/departments", icon: Building2 },
        { label: "Programs", path: "/portal/programs", icon: BookMarked },
        { label: "Batches & Sections", path: "/portal/batches", icon: Layers },
        { label: "Courses", path: "/portal/courses", icon: BookOpen },
        { label: "Semesters", path: "/portal/semesters", icon: CalendarIcon },
        { label: "Course Offerings", path: "/portal/course-offerings", icon: Layers },
        { label: "Result Approval", path: "/portal/result-approval", icon: ClipboardCheck },
        { label: "Batch Fee Config", path: "/portal/batch-fees", icon: Wallet },
      ]
    },
    { type: "single", label: "Notice Board", icon: Bell, path: "/portal/notices" },
    { type: "single", label: "Financial Aid Management", icon: Gem, path: "/portal/financial-aid" },
    { type: "single", label: "Document Requests", icon: Award, path: "/portal/document-requests" },
    { type: "single", label: "Convocation Management", icon: GraduationCap, path: "/portal/convocation" },
    { type: "single", label: "My Profile", icon: UserSquare2, path: "/portal/profile" },
    { type: "single", label: "Account Settings", icon: Cog, path: "/portal/settings" },
  ],
  REGISTRAR: [
    { type: "single", label: "Dashboard", icon: LayoutDashboard, path: "/portal/dashboard" },
    {
      type: "group",
      label: "User Management",
      icon: Users,
      children: [
        { label: "Students", path: "/portal/students", icon: GraduationCap },
        { label: "Faculty", path: "/portal/faculty", icon: UserSquare2 },
      ]
    },
    {
      type: "group",
      label: "Academic Setup",
      icon: School,
      children: [
        { label: "Departments", path: "/portal/departments", icon: Building2 },
        { label: "Programs", path: "/portal/programs", icon: BookMarked },
        { label: "Batches & Sections", path: "/portal/batches", icon: Layers },
        { label: "Courses", path: "/portal/courses", icon: BookOpen },
        { label: "Semesters", path: "/portal/semesters", icon: CalendarIcon },
        { label: "Course Offerings", path: "/portal/course-offerings", icon: Layers },
        { label: "Result Approval", path: "/portal/result-approval", icon: ClipboardCheck },
        { label: "Batch Fee Config", path: "/portal/batch-fees", icon: Wallet },
      ]
    },
    { type: "single", label: "Notice Board", icon: Bell, path: "/portal/notices" },
    { type: "single", label: "Financial Aid Management", icon: Gem, path: "/portal/financial-aid" },
    { type: "single", label: "Document Requests", icon: Award, path: "/portal/document-requests" },
    { type: "single", label: "Convocation Management", icon: GraduationCap, path: "/portal/convocation" },
    { type: "single", label: "My Profile", icon: UserSquare2, path: "/portal/profile" },
    { type: "single", label: "Account Settings", icon: Cog, path: "/portal/settings" },
  ],
  FACULTY: [
    { type: "single", label: "Dashboard", icon: LayoutDashboard, path: "/faculty/dashboard" },
    {
      type: "group",
      label: "Course Management",
      icon: BookOpen,
      children: [
        { label: "My Courses", path: "/faculty/my-courses", icon: BookMarked },
        { label: "My Advisees", path: "/faculty/advisees", icon: Users },
        { label: "Attendance Marking", path: "/faculty/attendance", icon: ClipboardCheck },
        { label: "Result Entry", path: "/faculty/results", icon: FileText },
        { label: "Student Results", path: "/faculty/student-results", icon: Star },
      ]
    },
    { type: "single", label: "Notice Board", icon: Bell, path: "/faculty/notices" },
    { type: "single", label: "My Profile", icon: UserSquare2, path: "/faculty/profile" },
    { type: "single", label: "Account Settings", icon: Cog, path: "/faculty/settings" },
  ],
  STUDENT: [
    { type: "single", label: "Dashboard", icon: LayoutDashboard, path: "/student/dashboard" },
    {
      type: "group",
      label: "Academic Management",
      icon: GraduationCap,
      children: [
        { label: "Academic Calendar", path: "/student/calendar", icon: CalendarIcon },
        { label: "Course Registration", path: "/student/registration", icon: Layers },
        { label: "Registration/Exam Clearance", path: "/student/clearance", icon: ShieldCheck },
        { label: "Routine", path: "/student/routine", icon: Clock },
        { label: "Teaching Evaluation", path: "/student/evaluation", icon: Star },
        { label: "Live Results", path: "/student/live-results", icon: TrendingUp },
        { label: "Academic Results", path: "/student/results", icon: FileText },
        { label: "Certificates & Transcripts", path: "/student/transcript-request", icon: Award },
        { label: "Convocation Application", path: "/student/convocation", icon: School },
      ]
    },
    {
      type: "group",
      label: "Financial Service",
      icon: Wallet,
      children: [
        { label: "Payment Ledger", path: "/student/fees", icon: Wallet },
        { label: "Scholarship & Waiver", path: "/student/scholarship", icon: Gem },
      ]
    },
    { type: "single", label: "Career Development", icon: Briefcase, path: "/student/career" },
    {
      type: "group",
      label: "Student Services",
      icon: Users,
      children: [
        { label: "Transport Card Apply", path: "/student/transport", icon: Bus },
        { label: "Hall Management", path: "/student/hall", icon: Home },
        { label: "Laptop Scheme", path: "/student/laptop", icon: Laptop },
        { label: "Mentor Meeting", path: "/student/mentor", icon: UserSquare2 },
      ]
    },
    { type: "single", label: "Notice Board", icon: Bell, path: "/student/notices" },
    { type: "single", label: "Facilities", icon: School, path: "/student/facilities" },
    { type: "single", label: "My Profile", icon: UserSquare2, path: "/student/profile" },
    { type: "single", label: "Account Settings", icon: Cog, path: "/student/settings" },
    { type: "single", label: "Logout", icon: LogOut, path: "/logout" },
  ]
};
