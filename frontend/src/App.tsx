import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import { useState } from "react";
import Login from "./components/Login";
import AdminLogin from "./components/AdminLogin";
import StudentGrades from "./components/StudentGrades";
import AdminDashboard from "./components/AdminDashboard";
import AdminRegisterGrades from "./components/AdminRegisterGrades";
import AdminStudentAccounts from "./components/AdminStudentAccounts";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  // const adminName = "Michiel vd Gragt";

  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/admin-login" element={<AdminLogin />} />

          <Route
            path={`/student-grades`}
            element={
              <ProtectedRoute>
                <StudentGrades />
              </ProtectedRoute>
            }
          />

          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          <Route
            path="/admin-register-grades"
            element={<AdminRegisterGrades />}
          />

          <Route path="/admin-accounts" element={<AdminStudentAccounts />} />
        </Routes>
      </Router>
    </div>
  );
}
