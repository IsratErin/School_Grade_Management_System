interface AdminDashboardProps {
  adminName: string;
  onRegisterGrades: () => void;
  onAdminAccounts: () => void;
  onLogout: () => void;
}

export default function AdminDashboard({
  adminName,
  onRegisterGrades,
  onAdminAccounts,
  onLogout,
}: AdminDashboardProps) {
  return (
    <div className="p-6 font-sans max-w-3xl mx-auto min-h-screen flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Admin</h1>
        <button
          className="flex items-center gap-1 border border-gray-300 px-3 py-1 rounded-md mb-2 hover:bg-gray-100"
          onClick={onLogout}
        >
          <span className="text-sm">→ {adminName}</span>
        </button>
      </div>

      <div className="grow flex flex-col items-center justify-center space-y-8 mt-16">
        <button
          onClick={onRegisterGrades}
          className="w-full max-w-sm bg-gray-100 text-3xl font-semibold py-8 px-4 border border-gray-300 rounded-xl shadow-lg hover:bg-blue-100 hover:shadow-xl transition duration-300"
        >
          Register Grades
        </button>
        <button
          onClick={onAdminAccounts}
          className="w-full max-w-sm bg-gray-100 text-3xl font-semibold py-8 px-4 border border-gray-300 rounded-xl shadow-lg hover:bg-blue-100 hover:shadow-xl transition duration-300"
        >
          Admin Student Accounts
        </button>
      </div>
    </div>
  );
}
