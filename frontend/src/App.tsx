import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import StudentGrades from './components/StudentGrades';
import AdminDashboard from './components/AdminDashboard';
import AdminRegisterGrades from './components/AdminRegisterGrades';
import AdminStudentAccounts from './components/AdminStudentAccounts';

export default function App() {
  // Dummy names (replace with real authentication later)
  const studentName = 'Kunnikar Boonbunlu';
  const adminName = 'Michiel vd Gragt';

  return (
    <div className="min-h-screen bg-pink-50">
      <Router>
        <Routes>
          <Route path="/" element={<Login onLogin={function (): void {
            throw new Error('Function not implemented.');
          } } onAdminLinkClick={function (): void {
            throw new Error('Function not implemented.');
          } } />} />
          <Route path="/admin-login" element={<AdminLogin onLogin={function (): void {
            throw new Error('Function not implemented.');
          } } onStudentLinkClick={function (): void {
            throw new Error('Function not implemented.');
          } } />} />
          <Route
            path="/student-grades"
            element={<StudentGrades studentName={studentName} onLogout={function (): void {
              throw new Error('Function not implemented.');
            } } />}
          />
          <Route
            path="/admin-dashboard"
            element={<AdminDashboard adminName={adminName} onRegisterGrades={function (): void {
              throw new Error('Function not implemented.');
            } } onAdminAccounts={function (): void {
              throw new Error('Function not implemented.');
            } } onLogout={function (): void {
              throw new Error('Function not implemented.');
            } } />}
          />
          <Route
            path="/admin-register-grades"
            element={<AdminRegisterGrades adminName={adminName} onBack={function (): void {
              throw new Error('Function not implemented.');
            } } />}
          />
          <Route
            path="/admin-accounts"
            element={<AdminStudentAccounts adminName={adminName} onBack={function (): void {
              throw new Error('Function not implemented.');
            } } />}
          />
        </Routes>
      </Router>
    </div>
  );
}
