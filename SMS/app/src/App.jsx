import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './layouts';
import { Login } from './pages/auth/Login';
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
import { RegistrationStep1 } from './pages/registration/RegistrationStep1';
import { RegistrationStep2 } from './pages/registration/RegistrationStep2';
import { RegistrationStep3 } from './pages/registration/RegistrationStep3';

const AdminPage = ({ children }) => (
  <ProtectedRoute requiredRole="admin">
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<Login />} />

          {/* Admin Portal (protected) */}
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

          {/* Registration Flow */}
          <Route path="/registration/step1" element={<RegistrationStep1 />} />
          <Route path="/registration/step2" element={<RegistrationStep2 />} />
          <Route path="/registration/step3" element={<RegistrationStep3 />} />

          {/* Defaults */}
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
