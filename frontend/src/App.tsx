import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';

import type { ComponentType } from 'react';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import StudentGrades from './components/StudentGrades';
import AdminDashboard from './components/AdminDashboard';
import AdminRegisterGrades from './components/AdminRegisterGrades';
import AdminStudentAccounts from './components/AdminStudentAccounts';

const LoginComponent = Login as ComponentType<{
  onLogin: () => void;
  onAdminLinkClick: () => void;
}>;
const AdminLoginComponent = AdminLogin as ComponentType<{
  onLogin: () => void;
  onStudentLinkClick: () => void;
}>;
const StudentGradesComponent = StudentGrades as ComponentType<{
  studentId: number;
  onLogout: () => void;
}>;
const AdminDashboardComponent = AdminDashboard as ComponentType<{
  adminName: string;
  onRegisterGrades: () => void;
  onAdminAccounts: () => void;
  onLogout: () => void;
}>;
const AdminRegisterGradesComponent = AdminRegisterGrades as ComponentType<{
  adminName: string;
  onBack: () => void;
}>;
const AdminStudentAccountsComponent = AdminStudentAccounts as ComponentType<{
  adminName: string;
  onBack: () => void;
}>;

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const navigate = useNavigate();

  const studentId = 1;
  const adminName = 'Michiel vd Gragt';

  const handleStudentLogin = () => {
    navigate('/student-grades');
  };

  const handleAdminLogin = () => {
    navigate('/admin-dashboard');
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <LoginComponent
            onLogin={handleStudentLogin}
            onAdminLinkClick={() => navigate('/admin-login')}
          />
        }
      />
      <Route
        path="/admin-login"
        element={
          <AdminLoginComponent
            onLogin={handleAdminLogin}
            onStudentLinkClick={() => navigate('/')}
          />
        }
      />
      <Route
        path="/student-grades"
        element={
          <StudentGradesComponent studentId={studentId} onLogout={handleLogout} />
        }
      />
      <Route
        path="/admin-dashboard"
        element={
          <AdminDashboardComponent
            adminName={adminName}
            onRegisterGrades={() => navigate('/admin-register-grades')}
            onAdminAccounts={() => navigate('/admin-accounts')}
            onLogout={handleLogout}
          />
        }
      />
      <Route
        path="/admin-register-grades"
        element={
          <AdminRegisterGradesComponent
            adminName={adminName}
            onBack={() => navigate('/admin-dashboard')}
          />
        }
      />
      <Route
        path="/admin-accounts"
        element={
          <AdminStudentAccountsComponent
            adminName={adminName}
            onBack={() => navigate('/admin-dashboard')}
          />
        }
      />
    </Routes>
  );
}
