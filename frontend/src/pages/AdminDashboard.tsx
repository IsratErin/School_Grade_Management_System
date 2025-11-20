import { useNavigate } from 'react-router-dom';

interface AdminDashboardProps {
  adminName: string;
}

export default function AdminDashboard({ adminName }: AdminDashboardProps) {
  const navigate = useNavigate();

  return (
    <div className="p-20 font-sans max-w-3xl mx-auto min-h-screen flex flex-col bg-pink-200">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Admin</h1>

        <button
          onClick={() => navigate('/admin-login')}
          className="flex items-center gap-1 border-pink-300 bg-white px-3 py-1 rounded-md mb-2 hover:bg-pink-100 cursor-pointer"
        >
          <span className="text-sm font-bold border-pink-400 rounded px-2 py-1 text-pink-400">
            → {adminName}
          </span>
        </button>
      </div>

      {/* Main Actions */}
      <div className="grow flex flex-col items-center justify-center space-y-8 mt-16">
        <button
          onClick={() => navigate('/admin-register-grades')}
          className="w-full max-w-sm bg-violet-500 text-3xl font-semibold py-8 px-4 border border-violet-700 rounded-xl text-white shadow-lg hover:bg-violet-400 cursor-pointer"
        >
          Register Grades
        </button>

        <button
          onClick={() => navigate('/admin-accounts')}
          className="w-full max-w-sm bg-pink-400 text-3xl font-semibold py-8 px-4 border border-pink-700 rounded-xl shadow-lg text-white hover:bg-pink-500 cursor-pointer"
        >
          Admin Student Accounts
        </button>
      </div>
    </div>
  );
}
