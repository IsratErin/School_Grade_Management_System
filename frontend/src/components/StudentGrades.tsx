import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Grade {
  grade: string;
  year?: number;
  subject?: string;
  level?: string;
  course?: string;
}

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  personNr: string;
  year: number;
  phone?: string | null;
  adress?: string | null;
}

const years = ['Year 1', 'Year 2', 'Year 3', 'All'];

export default function StudentGrades() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [student, setStudent] = useState<Student | null>(null);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [subjects, setSubjects] = useState<string[]>([]);

  // Fetch student and grades
  useEffect(() => {
    if (!email) {
      console.error('Email not provided');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5001/student/${email}`);
        const data = await res.json();

        if (res.ok) {
          setStudent(data.student);
          setGrades(data.grades || []);

          // Extract unique subjects for dropdown
          const uniqueSubjects = Array.from(
            new Set(
              (data.grades || []).map((g: Grade) => g.subject || g.course)
            )
          ).filter((s): s is string => Boolean(s));
          setSubjects(uniqueSubjects);
        } else {
          console.error('Error fetching grades:', data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [email]);

  const handleLogout = () => navigate('/');

  // Filter by year and subject
  const yearNumber =
    selectedYear === 'All' ? null : Number(selectedYear.split(' ')[1]);
  const filteredGrades = grades.filter(
    (g) =>
      (yearNumber === null || g.year === yearNumber) &&
      (selectedSubject === 'All' ||
        g.subject === selectedSubject ||
        g.course === selectedSubject)
  );

  if (loading) return <div className="p-10">Loading...</div>;
  if (!student) return <div className="p-10">Student not found.</div>;

  return (
    <div className="p-20 bg-pink-200 min-h-screen max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {student.firstName} {student.lastName}'s Profile
        </h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-pink-400 text-white rounded"
        >
          Logout
        </button>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        {/* Year Filter */}
        <div className="mt-6 flex gap-2 flex-wrap">
          {years.map((y) => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              className={`px-4 py-2 rounded ${
                selectedYear === y ? 'bg-pink-400 text-white' : 'bg-gray-100'
              }`}
            >
              {y}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {/* Subject Dropdown */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="ml-4 px-3 py-2 rounded bg-pink-400 cursor-pointer text-white"
          >
            <option value="All">All Subjects</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grades Table */}
      <table className="mt-6 w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Course</th>
            <th className="border px-4 py-2">Grade</th>
            {selectedYear === 'All' && (
              <th className="border px-4 py-2">Year</th>
            )}
            <th className="border px-4 py-2">Level</th>
          </tr>
        </thead>
        <tbody>
          {filteredGrades.length === 0 ? (
            <tr>
              <td
                colSpan={selectedYear === 'All' ? 4 : 3}
                className="text-center py-4"
              >
                No grades for this filter.
              </td>
            </tr>
          ) : (
            filteredGrades.map((g, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border px-4 py-2">{g.subject || g.course}</td>
                <td className="border px-4 py-2">{g.grade}</td>
                {selectedYear === 'All' && (
                  <td className="border px-4 py-2">{g.year || '-'}</td>
                )}
                <td className="border px-4 py-2">{g.level || '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
