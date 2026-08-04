import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ChangePassword from './pages/auth/ChangePassword';
import { useAuthStore } from './store/authStore';
import ProtectedRoute from './routes/ProtectedRoute';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import FacultyLayout from './layouts/FacultyLayout';
import StudentLayout from './layouts/StudentLayout';

// Dashboards
import AdminDashboard from './pages/admin/Dashboard';
import FacultyDashboard from './pages/faculty/Dashboard';
import StudentDashboard from './pages/student/Dashboard';

// Faculty Pages
import MyCourses from './pages/faculty/MyCourses';
import AttendanceMarking from './pages/faculty/AttendanceMarking';
import ExamManagement from './pages/faculty/ExamManagement';
import MarksEntry from './pages/faculty/MarksEntry';
import PublishResults from './pages/faculty/PublishResults';
import AdviseeList from './pages/faculty/AdviseeList';
import AdvisorRegistration from './pages/faculty/AdvisorRegistration';
import FacultyStudentResults from './pages/faculty/FacultyStudentResults';

import ResultsEntry from './pages/faculty/ResultsEntry';

// Admin Pages
import StudentList from './pages/admin/StudentList';
import StudentDetail from './pages/admin/StudentDetail';
import FacultyList from './pages/admin/FacultyList';
import FacultyDetail from './pages/admin/FacultyDetail';
import DepartmentList from './pages/admin/DepartmentList';
import CourseList from './pages/admin/CourseList';
import SemesterList from './pages/admin/SemesterList';
import CourseOfferingList from './pages/admin/CourseOfferingList';
import NoticeManagement from './pages/admin/NoticeManagement';
import ProgramList from './pages/admin/ProgramList';
import BatchManagement from './pages/admin/BatchManagement';
import BatchFeeManagement from './pages/admin/BatchFeeManagement';
import DocumentManagement from './pages/admin/DocumentManagement';
import ConvocationManagement from './pages/admin/ConvocationManagement';
import RegistrarList from './pages/admin/RegistrarList';

// Common Pages
import Profile from './pages/common/Profile';
import Settings from './pages/common/Settings';
import Notices from './pages/common/Notices';

// Student Pages
import CompleteProfile from './pages/student/CompleteProfile';
import CourseRegistration from './pages/student/CourseRegistration';
import Attendance from './pages/student/Attendance';
import Results from './pages/student/Results';
import LiveResults from './pages/student/LiveResults';
import Fees from './pages/student/Fees';
import AcademicCalendar from './pages/student/AcademicCalendar';
import Routine from './pages/student/Routine';
import TeachingEvaluation from './pages/student/TeachingEvaluation';
import Facilities from './pages/student/Facilities';
import MentorMeeting from './pages/student/MentorMeeting';
import LaptopScheme from './pages/student/LaptopScheme';
import TransportCard from './pages/student/TransportCard';
import HallManagement from './pages/student/HallManagement';
import CareerDevelopment from './pages/student/CareerDevelopment';
import Clearance from './pages/student/Clearance';
import CertificatesTranscripts from './pages/student/CertificatesTranscripts';
import ConvocationApplication from './pages/student/ConvocationApplication';
import ScholarshipWaiver from './pages/student/ScholarshipWaiver';
import FinancialAidCircular from './pages/student/FinancialAidCircular';
import FinancialAidApplication from './pages/student/FinancialAidApplication';
import FinancialAidManagement from './pages/admin/FinancialAidManagement';

// Placeholder Pages
const PlaceholderPage = ({ title }) => (
  <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title} Page</h1>
    <p className="mt-4 text-gray-500 dark:text-gray-400 text-lg">This section is currently under development.</p>
  </div>
);

const Unauthorized = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
    <h1 className="text-6xl font-black text-red-500/20 absolute select-none">403</h1>
    <div className="z-10 text-center">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Access Denied</h2>
      <p className="mt-2 text-gray-500 dark:text-gray-400">You don't have permission to view this page.</p>
      <button
        onClick={() => window.history.back()}
        className="mt-8 px-6 py-2.5 bg-primary-600 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/30"
      >
        Go Back
      </button>
    </div>
  </div>
);

function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Auth Required but no specific role */}
        <Route element={<ProtectedRoute />}>
           <Route path="/change-password" element={<ChangePassword />} />
        </Route>

        {/* Admin & Registrar Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'REGISTRAR']} />}>
          <Route path="/portal" element={<AdminLayout />}>
            <Route index element={<Navigate to="/portal/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="students" element={<StudentList />} />
            <Route path="students/:id" element={<StudentDetail />} />
            <Route path="faculty" element={<FacultyList />} />
            <Route path="faculty/:id" element={<FacultyDetail />} />
            <Route path="registrars" element={<RegistrarList />} />
            <Route path="courses" element={<CourseList />} />
            <Route path="departments" element={<DepartmentList />} />
            <Route path="programs" element={<ProgramList />} />
            <Route path="batches" element={<BatchManagement />} />
            <Route path="batch-fees" element={<BatchFeeManagement />} />
            <Route path="semesters" element={<SemesterList />} />
            <Route path="course-offerings" element={<CourseOfferingList />} />
            <Route path="notices" element={<NoticeManagement />} />
            <Route path="document-requests" element={<DocumentManagement />} />
            <Route path="convocation" element={<ConvocationManagement />} />
            <Route path="financial-aid" element={<FinancialAidManagement />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Faculty Routes */}
        <Route element={<ProtectedRoute allowedRoles={['FACULTY']} />}>
          <Route path="/faculty" element={<FacultyLayout />}>
            <Route index element={<Navigate to="/faculty/dashboard" replace />} />
            <Route path="dashboard" element={<FacultyDashboard />} />
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="attendance" element={<MyCourses />} />
            <Route path="attendance/:offeringId" element={<AttendanceMarking />} />
            <Route path="exams/:offeringId" element={<ExamManagement />} />
            <Route path="marks/:examId" element={<MarksEntry />} />
            <Route path="results" element={<ResultsEntry />} />
            <Route path="publish-results/:offeringId" element={<PublishResults />} />
            <Route path="advisees" element={<AdviseeList />} />
            <Route path="advisor-registration/:studentId" element={<AdvisorRegistration />} />
            <Route path="student-results" element={<FacultyStudentResults />} />
            <Route path="notices" element={<Notices />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="complete-profile" element={<CompleteProfile />} />
            <Route path="calendar" element={<AcademicCalendar />} />
            <Route path="registration" element={<CourseRegistration />} />
            <Route path="routine" element={<Routine />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="evaluation" element={<TeachingEvaluation />} />
            <Route path="results" element={<Results />} />
            <Route path="live-results" element={<LiveResults />} />
            <Route path="fees" element={<Fees />} />
            <Route path="notices" element={<Notices />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="facilities" element={<Facilities />} />
            <Route path="mentor" element={<MentorMeeting />} />
            <Route path="laptop" element={<LaptopScheme />} />
            <Route path="transport" element={<TransportCard />} />
            <Route path="hall" element={<HallManagement />} />
            <Route path="career" element={<CareerDevelopment />} />
            <Route path="clearance" element={<Clearance />} />
            <Route path="transcript-request" element={<CertificatesTranscripts />} />
            <Route path="convocation" element={<ConvocationApplication />} />
            <Route path="scholarship" element={<ScholarshipWaiver />} />
            <Route path="scholarship/circulars" element={<FinancialAidCircular />} />
            <Route path="scholarship/apply/:id" element={<FinancialAidApplication />} />
          </Route>
        </Route>

        <Route path="/" element={
          user ? (
            user.role === 'ADMIN' || user.role === 'REGISTRAR' ? <Navigate to="/portal/dashboard" /> :
            user.role === 'FACULTY' ? <Navigate to="/faculty/dashboard" /> :
            <Navigate to="/student/dashboard" />
          ) : <Navigate to="/login" />
        } />

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
