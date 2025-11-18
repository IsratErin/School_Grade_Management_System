import { useState } from 'react';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import StudentGrades from './components/StudentGrades';
import AdminDashboard from './components/AdminDashboard';
import AdminRegisterGrades from './components/AdminRegisterGrades';
import AdminStudentAccounts from './components/AdminStudentAccounts';

// Define App 'pages' for navigation
type Page =
  | 'student-login'
  | 'admin-login'
  | 'student-grades'
  | 'admin-dashboard'
  | 'admin-register-grades'
  | 'admin-accounts';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('student-login');
  // Dummy user for student view
  const studentName = 'Kunnikar Boonbunlu';
  // Dummy user for admin view
  const adminName = 'Michiel vd Gragt';

  const navigateTo = (page: Page) => setCurrentPage(page);

  const renderPage = () => {
    switch (currentPage) {
      case 'student-login':
        return (
          <Login
            onLogin={() => navigateTo('student-grades')}
            onAdminLinkClick={() => navigateTo('admin-login')}
          />
        );
      case 'admin-login':
        return (
          <AdminLogin
            onLogin={() => navigateTo('admin-dashboard')}
            onStudentLinkClick={() => navigateTo('student-login')}
          />
        );
      case 'student-grades':
        return (
          <StudentGrades
            studentName={studentName}
            onLogout={() => navigateTo('student-login')}
          />
        );
      case 'admin-dashboard':
        return (
          <AdminDashboard
            adminName={adminName}
            onRegisterGrades={() => navigateTo('admin-register-grades')}
            onAdminAccounts={() => navigateTo('admin-accounts')}
            onLogout={() => navigateTo('admin-login')}
          />
        );
      case 'admin-register-grades':
        return (
          <AdminRegisterGrades
            adminName={adminName}
            onBack={() => navigateTo('admin-dashboard')}
          />
        );
      case 'admin-accounts':
        return (
          <AdminStudentAccounts
            adminName={adminName}
            onBack={() => navigateTo('admin-dashboard')}
          />
        );
      default:
        return (
          <Login
            onLogin={() => navigateTo('student-grades')}
            onAdminLinkClick={() => navigateTo('admin-login')}
          />
        );
    }
  };

  return <div className="min-h-screen bg-white">{renderPage()}</div>;
}
