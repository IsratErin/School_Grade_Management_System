import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface StudentGrade {
  firstName: string;
  lastName: string;
  grade: string;
  subject: string;
  level?: string;
  year: number;
  updatedAt: string;
}

interface AdminRegisterGradesProps {
  adminName: string;
}

const years = ['All', 'Year 1', 'Year 2', 'Year 3'];

export default function AdminRegisterGrades({
  adminName,
}: AdminRegisterGradesProps) {
  const navigate = useNavigate();
  const [grades, setGrades] = useState<StudentGrade[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');

  // Fetch all grades
  useEffect(() => {
    const fetchGrades = async () => {
      setLoading(true);
      try {
        const res = await axios.get<StudentGrade[]>(
          'http://localhost:5001/admin/grades/all' // backend must return firstName, lastName, grade, subject, level?, year, updatedAt
        );
        setGrades(res.data);
      } catch (err) {
        console.error('Failed to fetch grades', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  // Year & Subject filters
  const yearNumber =
    selectedYear === 'All' ? null : Number(selectedYear.split(' ')[1]);
  const filteredGrades = grades.filter((g) => {
    const matchYear = yearNumber === null || g.year === yearNumber;
    const matchSubject =
      selectedSubject === 'All' || g.subject === selectedSubject;
    return matchYear && matchSubject;
  });

  // Extract unique subjects for dropdown
  const subjects = Array.from(new Set(grades.map((g) => g.subject)));

  return (
    <div className="p-10 bg-pink-200 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📚 Student Grades Overview</h1>
        <button
          className="bg-pink-400 text-white px-3 py-1 rounded"
          onClick={() => navigate('/admin-dashboard')}
        >
          ← {adminName}
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex justify-between gap-4 mb-6">
        <div className="flex gap-2">
          {years.map((y) => (
            <button
              key={y}
              className={`px-4 py-2 rounded border font-semibold ${
                selectedYear === y
                  ? 'bg-pink-500 text-white'
                  : 'bg-white hover:bg-gray-100'
              }`}
              onClick={() => setSelectedYear(y)}
            >
              {y}
            </button>
          ))}
        </div>
        <div>
          <select
            className="px-4 py-2 rounded border bg-white"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="All">All Subjects</option>
            {subjects.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-xl font-semibold">Loading...</p>
      ) : (
        <div className="bg-white rounded-lg shadow border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 font-semibold">
              <tr>
                <th className="px-6 py-3 text-left">Student Name</th>
                <th className="px-6 py-3 text-left">Grade</th>
                <th className="px-6 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredGrades.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-4 text-gray-500 italic"
                  >
                    No grades found for this filter.
                  </td>
                </tr>
              ) : (
                filteredGrades.map((g, i) => (
                  <tr key={i} className="hover:bg-pink-50">
                    <td className="px-6 py-3">
                      {g.firstName} {g.lastName}
                    </td>
                    <td className="px-6 py-3">{g.grade}</td>
                    <td className="px-6 py-3">
                      {new Date(g.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
