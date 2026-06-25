import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/auth/Login';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { StudentDirectory } from './pages/admin/StudentDirectory';
import { FacultyManagement } from './pages/admin/FacultyManagement';
import { AcademicCalendar } from './pages/admin/AcademicCalendar';
import { Financials } from './pages/admin/Financials';
import { Reports } from './pages/admin/Reports';
import { Requirements } from './pages/admin/Requirements';
import { Registrar } from './pages/admin/Registrar';
import { Settings } from './pages/admin/Settings';
import { SchoolLife } from './pages/admin/SchoolLife';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentGrades from './pages/student/StudentGrades';
import StudentSubjects from './pages/student/StudentSubjects';
import StudentCommunication from './pages/student/StudentCommunication';
import StudentSchoolLife from './pages/student/StudentSchoolLife';

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherGrading from './pages/teacher/TeacherGrading';
import TeacherClasses from './pages/teacher/TeacherClasses';
import TeacherAttendance from './pages/teacher/TeacherAttendance';
import TeacherAssignments from './pages/teacher/TeacherAssignments';
import TeacherCommunication from './pages/teacher/TeacherCommunication';
import TeacherSchoolLife from './pages/teacher/TeacherSchoolLife';

// Parent Pages
import ParentDashboard from './pages/parent/ParentDashboard';
import ParentGrades from './pages/parent/ParentGrades';
import ParentAttendance from './pages/parent/ParentAttendance';
import ParentFinance from './pages/parent/ParentFinance';
import ParentCommunication from './pages/parent/ParentCommunication';
import ParentSchoolLife from './pages/parent/ParentSchoolLife';

// Registration Pages
import { RegistrationStep1 } from './pages/registration/RegistrationStep1';
import { RegistrationStep2 } from './pages/registration/RegistrationStep2';
import { RegistrationStep3 } from './pages/registration/RegistrationStep3';

// Layouts
import Sidebar from './layouts/Sidebar';
import StudentSidebar from './layouts/StudentSidebar';
import TeacherSidebar from './layouts/TeacherSidebar';
import ParentSidebar from './layouts/ParentSidebar';
import Header from './layouts/Header';
import { ProtectedRoute } from './components/ProtectedRoute';

// Portal Layout
const PortalLayout = ({ children, SidebarComponent }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      <SidebarComponent open={sidebarOpen} />
      <div className={`flex-1 flex flex-col min-w-0 transition-[padding] duration-300 ${sidebarOpen ? 'lg:pl-[260px]' : ''}`}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto p-margin-desktop">
          <div key={location.pathname} className="max-w-7xl mx-auto animate-fade-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// Import useLocation
import { useLocation } from 'react-router-dom';

// Protected Page Wrappers
const AdminPage = ({ children }) => (
  <ProtectedRoute requiredRole="admin">
    <PortalLayout SidebarComponent={Sidebar}>{children}</PortalLayout>
  </ProtectedRoute>
);

const StudentPage = ({ children }) => (
  <ProtectedRoute requiredRole="student">
    <PortalLayout SidebarComponent={StudentSidebar}>{children}</PortalLayout>
  </ProtectedRoute>
);

const TeacherPage = ({ children }) => (
  <ProtectedRoute requiredRole="teacher">
    <PortalLayout SidebarComponent={TeacherSidebar}>{children}</PortalLayout>
  </ProtectedRoute>
);

const ParentPage = ({ children }) => (
  <ProtectedRoute requiredRole="parent">
    <PortalLayout SidebarComponent={ParentSidebar}>{children}</PortalLayout>
  </ProtectedRoute>
);

// Main App Content
function AppContent() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<Login />} />

      {/* Admin Portal */}
      <Route path="/admin" element={<AdminPage><AdminDashboard /></AdminPage>} />
      <Route path="/admin/students" element={<AdminPage><StudentDirectory /></AdminPage>} />
      <Route path="/admin/faculty" element={<AdminPage><FacultyManagement /></AdminPage>} />
      <Route path="/admin/calendar" element={<AdminPage><AcademicCalendar /></AdminPage>} />
      <Route path="/admin/financial" element={<AdminPage><Financials /></AdminPage>} />
      <Route path="/admin/reports" element={<AdminPage><Reports /></AdminPage>} />
      <Route path="/admin/requirements" element={<AdminPage><Requirements /></AdminPage>} />
      <Route path="/admin/registrar" element={<AdminPage><Registrar /></AdminPage>} />
      <Route path="/admin/school-life" element={<AdminPage><SchoolLife /></AdminPage>} />
      <Route path="/admin/settings" element={<AdminPage><Settings /></AdminPage>} />

      {/* Student Portal */}
      <Route path="/student" element={<StudentPage><StudentDashboard /></StudentPage>} />
      <Route path="/student/grades" element={<StudentPage><StudentGrades /></StudentPage>} />
      <Route path="/student/subjects" element={<StudentPage><StudentSubjects /></StudentPage>} />
      <Route path="/student/classes" element={<StudentPage><StudentSubjects /></StudentPage>} />
      <Route path="/student/communication" element={<StudentPage><StudentCommunication /></StudentPage>} />
      <Route path="/student/school-life" element={<StudentPage><StudentSchoolLife /></StudentPage>} />

      {/* Teacher Portal */}
      <Route path="/teacher" element={<TeacherPage><TeacherDashboard /></TeacherPage>} />
      <Route path="/teacher/classes" element={<TeacherPage><TeacherClasses /></TeacherPage>} />
      <Route path="/teacher/attendance" element={<TeacherPage><TeacherAttendance /></TeacherPage>} />
      <Route path="/teacher/grading" element={<TeacherPage><TeacherGrading /></TeacherPage>} />
      <Route path="/teacher/assignments" element={<TeacherPage><TeacherAssignments /></TeacherPage>} />
      <Route path="/teacher/communication" element={<TeacherPage><TeacherCommunication /></TeacherPage>} />
      <Route path="/teacher/school-life" element={<TeacherPage><TeacherSchoolLife /></TeacherPage>} />

      {/* Parent Portal */}
      <Route path="/parent" element={<ParentPage><ParentDashboard /></ParentPage>} />
      <Route path="/parent/grades" element={<ParentPage><ParentGrades /></ParentPage>} />
      <Route path="/parent/attendance" element={<ParentPage><ParentAttendance /></ParentPage>} />
      <Route path="/parent/finance" element={<ParentPage><ParentFinance /></ParentPage>} />
      <Route path="/parent/communication" element={<ParentPage><ParentCommunication /></ParentPage>} />
      <Route path="/parent/school-life" element={<ParentPage><ParentSchoolLife /></ParentPage>} />

      {/* Registration Flow */}
      <Route path="/registration/step1" element={<RegistrationStep1 />} />
      <Route path="/registration/step2" element={<RegistrationStep2 />} />
      <Route path="/registration/step3" element={<RegistrationStep3 />} />

      {/* Defaults */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

// Main App with Router and Auth
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
