import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const years = ['Year 1', 'Year 2', 'Year 3', 'All'];
const subjects = [
  'All Subjects',
  'Engelska 5',
  'Filosofi 1',
  'Historia 1b',
  'Idrott och Hälsa 1',
  'Matematik 1b',
  'Naturkunskap 1b',
  'Samhällskunskap 1b',
  'Svenska 1',
  'Engelska 6',
  'Ledarskap och organisation',
  'Internationella Relationer',
  'Matematik 2b',
  'Samhällskunskap 2',
  'Svenska 2',
  'Filosofi 2',
  'Gymnasiearbete SA',
  'Kommunikation',
  'Psykologi 1',
  'Psykologi 2a',
  'Religionskunskap 1',
  'Religionskunskap 2',
  'Sociologi',
  'Svenska 3',
];

interface Grade {
  grade: string;
  year: number;
  subject: string;
  level?: string;
}

interface StudentGradesProps {
  studentName: string;
  studentId: string;
}

export default function StudentGrades({
  studentName,
  studentId,
}: StudentGradesProps) {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState('Year 1');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const yearNumber =
    selectedYear === 'All' ? null : Number(selectedYear.split(' ')[1]);

  useEffect(() => {
    async function fetchGrades() {
      if (!studentId) return;

      try {
        setLoading(true);
        setError(null);

        const res = await api.get(`/student/${studentId}/grades`);
        setGrades(res.data || []);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        setError(`Failed to load grades. ${message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchGrades();
  }, [studentId]);

  const filteredGrades = grades.filter(
    (g) =>
      (yearNumber === null || g.year === yearNumber) &&
      (selectedSubject === 'All Subjects' || g.subject === selectedSubject)
  );

  const isEnglishDropdown =
    selectedSubject === 'Engelska 5' || selectedSubject === 'Engelska 6';

  return (
    <div className="p-20 font-sans max-w-4xl mx-auto bg-pink-200 min-h-screen">
      <div className="flex justify-between items-start">
        <h1 className="text-4xl font-bold">Grades</h1>

        <div className="flex flex-col items-end">
          <button
            className="flex items-center gap-1 border border-pink-400 px-3 py-1 rounded-md mb-2 hover:bg-pink-500 hover:text-white cursor-pointer"
            onClick={() => navigate('/student-login')}
          >
            <span className="text-sm font-semibold rounded-md px-2 py-1">
              → {studentName}
            </span>
          </button>

          <div className="flex gap-2 mt-2">
            <select
              className="border border-pink-400 bg-pink-400 text-white font-semibold px-3 py-1 rounded-md"
              value={isEnglishDropdown ? 'English' : selectedSubject}
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'English') setSelectedSubject('Engelska 5');
                else setSelectedSubject(value);
              }}
            >
              <option value="All Subjects">Subject</option>
              <option value="English">English</option>
              {subjects
                .filter((s) => s !== 'All Subjects' && s !== 'English')
                .map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Year Filter */}
      <div className="mt-6 flex gap-2">
        {years.map((y) => (
          <button
            key={y}
            onClick={() => {
              setSelectedYear(y);
              setSelectedSubject('All Subjects');
            }}
            className={`px-4 py-2 rounded border border-gray-300 transition-colors ${
              selectedYear === y
                ? 'bg-pink-400 font-semibold text-white cursor-pointer border-pink-700'
                : 'bg-gray-100 hover:bg-pink-400 hover:text-white cursor-pointer'
            }`}
          >
            {y}
          </button>
        ))}
      </div>

      {/* Grades Table */}
      <div className="mt-6 border border-gray-300 rounded-lg overflow-hidden">
        {loading ? (
          <p className="p-4 text-center text-gray-700">Loading grades...</p>
        ) : error ? (
          <p className="p-4 text-center text-red-600">{error}</p>
        ) : filteredGrades.length === 0 ? (
          <p className="p-4 text-center text-gray-500">
            No grades found for this filter.
          </p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Year
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGrades.map((g, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {g.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {g.grade || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {g.year}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
