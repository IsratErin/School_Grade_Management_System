import { useEffect, useState } from 'react';
import api from '../api/axios';

const years = ['Year 1', 'Year 2', 'Year 3'];

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  personNr: number;
  year: number;
  phone?: string | null;
  adress?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AdminStudentAccountsProps {
  adminName: string;
  onBack: () => void;
}

export default function AdminStudentAccounts({
  adminName,
  onBack,
}: AdminStudentAccountsProps) {
  const [selectedYear, setSelectedYear] = useState('Year 1');
  const [hoverStudent, setHoverStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const yearNumber = Number(selectedYear.split(' ')[1]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get('/student/all'); // Fetch all students
        setStudents(res.data || []);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        setError(`Failed to load students. ${message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter((s) => s.year === yearNumber);

  return (
    <div className="p-20 font-sans max-w-6xl mx-auto relative bg-pink-200 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Admin</h1>
        <button
          className="flex items-center gap-1 bg-pink-400 px-3 py-1 rounded-md mb-2 hover:bg-pink-500 cursor-pointer"
          onClick={onBack}
        >
          <span className="text-sm rounded px-2 py-1 text-white font-bold">
            ← {adminName}
          </span>
        </button>
      </div>

      {/* Year Tabs */}
      <div className="mt-6 flex justify-between items-center">
        <div className="flex gap-2">
          {years.map((y) => (
            <button
              key={y}
              className={`px-4 py-2 rounded border border-gray-300 transition-colors ${
                selectedYear === y
                  ? 'bg-pink-400 font-semibold text-white cursor-pointer'
                  : 'bg-gray-100 cursor-pointer hover:bg-gray-200'
              }`}
              onClick={() => setSelectedYear(y)}
            >
              {y}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1 border border-pink-400 px-4 py-2 rounded-md bg-pink-400 hover:bg-pink-500 text-white font-bold cursor-pointer">
          ↑ Import CSV
        </button>
      </div>

      {/* Students Table */}
      <h2 className="text-2xl font-semibold mt-8">Addresses</h2>
      <div className="mt-4 border border-gray-300 rounded-lg overflow-hidden">
        {loading ? (
          <p className="p-4 text-center text-gray-700">Loading students...</p>
        ) : error ? (
          <p className="p-4 text-center text-red-600">{error}</p>
        ) : filteredStudents.length === 0 ? (
          <p className="p-4 text-center text-gray-500">
            No students found for this year.
          </p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Personnr
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                  Tel. nr.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/6">
                  Adress
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((s, i) => (
                <tr
                  key={s.id}
                  className={
                    i % 2 === 0
                      ? 'bg-white hover:bg-pink-50'
                      : 'bg-gray-50 hover:bg-pink-50'
                  }
                  onMouseEnter={() => setHoverStudent(s)}
                  onMouseLeave={() => setHoverStudent(null)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {s.firstName} {s.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {s.personNr}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {s.phone || '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {s.adress || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Hover Pop-up */}
      {hoverStudent && (
        <div
          className="absolute right-6 bottom-1/2 transform -translate-y-1/2 bg-yellow-100 p-4 border border-yellow-400 shadow-xl rounded w-80 z-10"
          style={{ right: '19%', bottom: '50%', transform: 'translateY(200%)' }}
        >
          <p className="font-bold mb-2">
            {hoverStudent.firstName} {hoverStudent.lastName}
          </p>
          <p className="text-sm">
            Pers. nr.:{' '}
            <span className="font-mono">{hoverStudent.personNr}</span>
          </p>
          <p className="text-sm">
            Tel. nr.:{' '}
            <span className="font-mono">{hoverStudent.phone || '—'}</span>
          </p>
          <p className="text-sm">
            Adress:{' '}
            <span className="font-mono">{hoverStudent.adress || '—'}</span>
          </p>

          <div className="flex justify-start gap-4 mt-4">
            <button className="border border-gray-400 px-4 py-1 bg-white rounded-md text-sm hover:bg-gray-100">
              ✏ Edit
            </button>
            <button className="border border-red-400 px-4 py-1 bg-red-200 rounded-md text-sm hover:bg-red-300">
              🗑 Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
