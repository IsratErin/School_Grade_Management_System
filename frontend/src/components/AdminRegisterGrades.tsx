import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface GradeData {
  student: string;
  grade: string;
  date: string;
}

const years = ['Year 1', 'Year 2', 'Year 3'];

export default function AdminRegisterGrades({
  adminName,
}: {
  adminName: string;
}) {
  const navigate = useNavigate();

  const [courses, setCourses] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedYear, setSelectedYear] = useState('Year 1');
  const [grades, setGrades] = useState<GradeData[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingGrades, setLoadingGrades] = useState(false);

  const yearNumber = Number(selectedYear.split(' ')[1]);

  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        const res = await fetch('http://localhost:5001/admin/grades');
        if (!res.ok) throw new Error('Failed to fetch courses');
        const data: string[] = await res.json();
        setCourses(data);
        setSelectedCourse(data[0] || '');
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  // Fetch grades when selectedCourse or selectedYear changes
  useEffect(() => {
    if (!selectedCourse) return;

    const fetchGrades = async () => {
      try {
        setLoadingGrades(true);
        // Convert course to lowercase for backend route
        const courseParam = selectedCourse.toLowerCase().replace(' ', '');
        const res = await fetch(
          `http://localhost:5001/admin/grades/${courseParam}/${yearNumber}`
        );
        if (!res.ok) throw new Error('Failed to fetch grades');
        const data: GradeData[] = await res.json();
        setGrades(data);
      } catch (err) {
        console.error('Error fetching grades:', err);
      } finally {
        setLoadingGrades(false);
      }
    };
    fetchGrades();
  }, [selectedCourse, yearNumber]);

  return (
    <div className="p-20 font-sans max-w-4xl mx-auto bg-pink-200 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Admin</h1>
        <button
          className="flex items-center gap-1 border bg-pink-400 text-white px-3 py-1 rounded-md mb-2 cursor-pointer hover:bg-pink-500"
          onClick={() => navigate('/admin-dashboard')}
        >
          <span className="text-sm font-bold">← {adminName}</span>
        </button>
      </div>

      {/* YEAR TABS and COURSE DROPDOWN */}
      <div className="mt-6 flex justify-between items-center">
        <div className="flex gap-2">
          {years.map((y) => (
            <button
              key={y}
              className={`px-4 py-2 rounded border border-pink-400 transition-colors ${
                selectedYear === y
                  ? 'bg-pink-400 text-white font-semibold'
                  : 'bg-gray-100 hover:bg-gray-200 cursor-pointer'
              }`}
              onClick={() => setSelectedYear(y)}
            >
              {y}
            </button>
          ))}
        </div>

        <select
          className="border border-pink-400 bg-pink-400 text-white font-semibold px-3 py-1 rounded-md cursor-pointer"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          {loadingCourses ? (
            <option>Loading courses...</option>
          ) : (
            courses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))
          )}
        </select>
      </div>

      {/* REGISTER GRADES TABLE */}
      <h2 className="text-2xl font-semibold mt-8">Register Grades</h2>
      {loadingGrades ? (
        <div className="mt-4 p-4 text-center">Loading grades...</div>
      ) : (
        <div className="mt-4 border border-gray-300 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {grades.map((g, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {g.student}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {g.grade || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {g.date ? new Date(g.date).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
