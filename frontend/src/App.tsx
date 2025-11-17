import { useState } from 'react';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin'; 
import './index.css'

type Page = 'student-login' | 'admin-login';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('student-login');

  const studentName = 'Kunnikar';

  const adminName = 'Michiel';

  const navigateTo = (page: Page) => setCurrentPage(page);

  const renderPage = () => {
    switch (currentPage) {
      case 'student-login':
        return (
          <Login
            onLogin={() => {
              alert(`Welcome back, ${studentName}!`);
            }}
            onAdminLinkClick={() => navigateTo('admin-login')}
          />
        );
      case 'admin-login':
        return (
          <AdminLogin
            onLogin={() => {
              alert(`Welcome back, Admin ${adminName}!`);
            }}
            onStudentLinkClick={() => navigateTo('student-login')}
          />
        );
      default:
        return null;
    }
  };

  return <div className="min-h-screen bg-white">{renderPage()}</div>;
}

export default App
