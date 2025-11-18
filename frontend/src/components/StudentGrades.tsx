import { useState } from 'react';

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

const demoGrades = [
  { course: 'Engelska 5', grade: 'B', year: 1 },
  { course: 'Filosofi 1', grade: 'A', year: 1 },
  { course: 'Historia 1b', grade: 'C', year: 1 },
  { course: 'Idrott och Hälsa 1', grade: 'A', year: 1 },
  { course: 'Matematik 1b', grade: 'A', year: 1 },
  { course: 'Naturkunskap 1b', grade: 'C', year: 1 },
  { course: 'Samhällskunskap 1b', grade: 'B', year: 1 },
  { course: 'Svenska 1', grade: 'A', year: 1 },
  { course: 'Engelska 6', grade: 'A', year: 2 },
  { course: 'Ledarskap och organisation', grade: '', year: 2 },
  { course: 'Internationella Relationer', grade: '', year: 2 },
  { course: 'Matematik 2b', grade: 'A', year: 2 },
  { course: 'Samhällskunskap 2', grade: '', year: 2 },
  { course: 'Svenska 2', grade: 'A', year: 2 },
  { course: 'Filosofi 2', grade: '', year: 3 },
  { course: 'Gymnasiearbete SA', grade: '', year: 3 },
  { course: 'Kommunikation', grade: '', year: 3 },
  { course: 'Psykologi 1', grade: '', year: 3 },
  { course: 'Psykologi 2a', grade: '', year: 3 },
  { course: 'Religionskunskap 1', grade: '', year: 3 },
  { course: 'Religionskunskap 2', grade: '', year: 3 },
  { course: 'Sociologi', grade: '', year: 3 },
  { course: 'Svenska 3', grade: '', year: 3 },
];

interface StudentGradesProps {
  studentName: string;
  onLogout: () => void;
}

export default function StudentGrades({
  studentName,
  onLogout,
}: StudentGradesProps) {
  const [selectedYear, setSelectedYear] = useState('Year 1');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');

  const yearNumber =
    selectedYear === 'All' ? null : Number(selectedYear.split(' ')[1]);

  const filteredGrades = demoGrades.filter(
    (g) =>
      (yearNumber === null || g.year === yearNumber) &&
      (selectedSubject === 'All Subjects' || g.course === selectedSubject)
  );

  const isEnglishDropdown =
    selectedSubject === 'Engelska 5' || selectedSubject === 'Engelska 6';

  return (
    <div className="p-6 font-sans max-w-4xl mx-auto">
      <div className="flex justify-between items-start">
        <h1 className="text-4xl font-bold">Grades</h1>
        <div className="flex flex-col items-end">
          <button
            className="flex items-center gap-1 border border-pink-400 px-3 py-1 rounded-md mb-2 hover:bg-pink-500 hover:text-white cursor-pointer"
            onClick={onLogout}
          >
            <span className="text-sm  font-semibold rounded-md">→ {studentName}</span>
          </button>

          <div className="flex gap-2">
            <select
              className="border border-pink-400 bg-pink-400 text-white font-semibold px-3 py-1 rounded-md"
              value={isEnglishDropdown ? 'English' : selectedSubject} 
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'English') {
                  setSelectedSubject('Engelska 5')
                } else {
                  setSelectedSubject(value);
                }
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

      {/* YEAR FILTER BUTTONS */}
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

      {/* GRADES TABLE */}
      <div className="mt-6 border border-gray-300 rounded-lg overflow-hidden">
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
            {filteredGrades.length > 0 ? (
              filteredGrades.map((g, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {g.course}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {g.grade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {g.year}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No grades found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
