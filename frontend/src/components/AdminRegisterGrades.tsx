import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface SubjectOverview {
  id: number;
  name: string;
  level: string;
  grades: Record<number, string[]>; 
}

interface AdminRegisterGradesProps {
  adminName: string;
}

const years = ['All', 'Year 1', 'Year 2', 'Year 3'];

export default function AdminRegisterGrades({ adminName }: AdminRegisterGradesProps) {
  const navigate = useNavigate();
  
  const [subjects, setSubjects] = useState<SubjectOverview[]>([]);
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [loading, setLoading] = useState(false);

  // Fetch all subjects + grade overview
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get<SubjectOverview[]>(
          'http://localhost:5001/admin/grades/overview'
        );
        setSubjects(res.data);
      } catch (err) {
        console.error('Failed to fetch subjects overview', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter logic
  const filteredSubjects = subjects.filter((s) => {
    if (selectedSubject !== 'All' && s.name !== selectedSubject) return false;
    return true;
  });

  const yearFilterNumber =
    selectedYear === 'All' ? null : Number(selectedYear.split(' ')[1]);

  return (
    <div className="p-10 bg-pink-200 min-h-screen font-sans">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-6">📚 Grades Overview</h1>

        <button
          className="flex items-center gap-1 border bg-pink-400 text-white px-3 py-1 rounded-md mb-2 cursor-pointer hover:bg-pink-500"
          onClick={() => navigate('/admin-dashboard')}
        >
          <span className="text-sm font-bold">← {adminName}</span>
        </button>
      </div>
      {/* FILTER BAR */}
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
        {/* SUBJECT FILTER */}
        <select
          className="px-4 py-2 rounded border bg-white"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="All">All Subjects</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name} ({s.level})
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
                <th className="px-6 py-3 text-left">Subject</th>
                <th className="px-6 py-3 text-left">Level</th>
                <th className="px-6 py-3 text-left">Grades</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSubjects.map((s) => {
                const gradesForYear =
                  yearFilterNumber === null
                    ? Object.values(s.grades).flat()
                    : s.grades[yearFilterNumber] || [];

                return (
                  <tr key={s.id} className="hover:bg-pink-50">
                    <td className="px-6 py-3">{s.name}</td>
                    <td className="px-6 py-3">{s.level}</td>
                    <td className="px-6 py-3">
                      {gradesForYear.length > 0 ? (
                        gradesForYear.join(', ')
                      ) : (
                        <span className="text-gray-400 italic">No grades</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
