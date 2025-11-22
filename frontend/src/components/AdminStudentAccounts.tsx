import { useState, useEffect } from 'react';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  personNr: number;
  year: number;
  phone?: string | null;
  adress?: string | null;
}

interface AdminStudentAccountsProps {
  adminName: string;
  onBack: () => void;
}

const years = ['Year 1', 'Year 2', 'Year 3'];

export default function AdminStudentAccounts({
  adminName,
  onBack,
}: AdminStudentAccountsProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('Year 1');
  const [hoverStudent, setHoverStudent] = useState<Student | null>(null);

  const yearNumber = Number(selectedYear.split(' ')[1]);

  // Fetch all students from backend
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5001/admin/students');
        const data = await res.json();
        if (res.ok) {
          setStudents(data);
        } else {
          console.error('Failed to fetch students:', data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((s) => s.year === yearNumber);

  if (loading) return <div className="p-10">Loading students...</div>;

  return (
    <div className="p-20 font-sans max-w-6xl mx-auto relative bg-pink-200 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Admin</h1>
        <button
          className="flex items-center gap-1 bg-pink-400 px-3 py-1 rounded-md hover:bg-pink-500 cursor-pointer"
          onClick={onBack}
        >
          <span className="text-sm font-bold text-white">← {adminName}</span>
        </button>
      </div>

      {/* YEAR TABS */}
      <div className="mt-6 flex gap-2">
        {years.map((y) => (
          <button
            key={y}
            className={`px-4 py-2 rounded border border-gray-300 transition-colors ${
              selectedYear === y
                ? 'bg-pink-400 text-white font-semibold'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedYear(y)}
          >
            {y}
          </button>
        ))}
      </div>

      {/* STUDENTS TABLE */}
      <h2 className="text-2xl font-semibold mt-8">Students</h2>
      <div className="mt-4 border border-gray-300 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PersonNr
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Adress
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((s) => (
              <tr
                key={s.personNr}
                className="hover:bg-pink-50 cursor-pointer"
                onMouseEnter={() => setHoverStudent(s)}
                onMouseLeave={() => setHoverStudent(null)}
              >
                <td className="px-6 py-4 text-sm font-medium">
                  {s.firstName} {s.lastName}
                </td>
                <td className="px-6 py-4 text-sm">{s.personNr}</td>
                <td className="px-6 py-4 text-sm">{s.year}</td>
                <td className="px-6 py-4 text-sm">{s.phone || '-'}</td>
                <td className="px-6 py-4 text-sm">{s.adress || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hover popup */}
      {hoverStudent && (
        <div
          className="absolute right-6 bottom-1/2 transform -translate-y-1/2 bg-yellow-100 p-4 border border-yellow-400 shadow-xl rounded w-80 z-10"
          style={{ right: '19%', bottom: '50%', transform: 'translateY(200%)' }}
        >
          <p className="font-bold mb-2">
            {hoverStudent.firstName} {hoverStudent.lastName}
          </p>
          <p className="text-sm">
            PersonNr: <span className="font-mono">{hoverStudent.personNr}</span>
          </p>
          <p className="text-sm">
            Phone:{' '}
            <span className="font-mono">{hoverStudent.phone || '-'}</span>
          </p>
          <p className="text-sm">
            Adress:{' '}
            <span className="font-mono">{hoverStudent.adress || '-'}</span>
          </p>

          <div className="flex gap-4 mt-4">
            <button className="border border-gray-400 px-4 py-1 bg-white rounded-md text-sm hover:bg-gray-100">
              ✏ Edit
            </button>
            <button className="border border-red-400 px-4 py-1 bg-red-200 rounded-md text-sm hover:bg-red-300">
              🗑 Delete
            </button>
          </div>
        </div>
      )}

      <div className="absolute top-20 right-110 bg-red-100 p-2 border border-red-300 rounded shadow-md text-xs text-center translate-x-1/2">
        Hover over a row and see pop up window
      </div>
    </div>
  );
}
