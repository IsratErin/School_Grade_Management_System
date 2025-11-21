import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const years = ['Year 1', 'Year 2', 'Year 3'];

interface Student {
  name: string;
  email: string;
  personnr: string;
  tel: string;
  adress: string;
  year: number;
}

const demoStudents: Student[] = [
  {
    name: 'Kunnikar Boonbunlu',
    email: 'kunnikar@sundgarden.se',
    personnr: '081003-4521',
    tel: '0723764539',
    adress: 'Drottninggatan 112 252 21 Helsingborg',
    year: 1,
  },
  {
    name: 'Israt Jahan',
    email: 'isratJahan@sundgarden.se',
    personnr: '080115-9934',
    tel: '0739421185',
    adress: 'Södra Storgatan 45 252 23 Helsingborg',
    year: 1,
  },
  {
    name: 'Snana-Maya Blomdahl',
    email: 'snanaMayaBlomdahl@sundgarden.se',
    personnr: '080527-1287',
    tel: '0709283746',
    adress: ' Västra Vägen 23 252 20 Helsingborg',
    year: 1,
  },
  {
    name: 'Erik Sandberg',
    email: 'erikSandberg08@sundgarden.se',
    personnr: '081109-7742',
    tel: '0700000000',
    adress: 'Kungsgatan 7 252 21 Helsingborg',
    year: 2,
  },
  {
    name: 'Sofia Henningsson',
    email: 'sofiaHenningsson08@sundgarden.se',
    personnr: '080312-5408',
    tel: '0723456789',
    adress: 'testgatan 1 252 20 Helsingborg',
    year: 3,
  },
  {
    name: 'Daniel Norberg',
    email: 'danielNorberg08@sundgarden.se',
    personnr: '080830-9923',
    tel: '0723456780',
    adress: 'exempelvägen 5 252 21 Helsingborg',
    year: 3,
  },
  {
    name: 'Anna Karlsson',
    email: 'annaKarlsson08@sundgarden.se',
    personnr: '081215-1234',
    tel: '0723456790',
    adress: 'exempelvägen 10 252 22 Helsingborg',
    year: 2,
  },
];

interface AdminStudentAccountsProps {
  adminName: string;
}

export default function AdminStudentAccounts({
  adminName,
}: AdminStudentAccountsProps) {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState('Year 1');
  const [hoverStudent, setHoverStudent] = useState<Student | null>(null);

  const yearNumber = Number(selectedYear.split(' ')[1]);
  const filteredStudents = demoStudents.filter((s) => s.year === yearNumber);

  return (
    <div className="p-20 font-sans max-w-6xl mx-auto relative bg-pink-200 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Admin</h1>
        <button
          className="flex items-center gap-1 bg-pink-400 px-3 py-1 rounded-md mb-2 hover:bg-pink-500 cursor-pointer"
          onClick={() => navigate('/admin-dashboard')}
        >
          <span className="text-sm rounded px-2 py-1 text-white font-bold">
            ← {adminName}
          </span>
        </button>
      </div>

      {/* YEAR TABS and IMPORT BUTTON */}
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

      {/* ADDRESSES TABLE */}
      <h2 className="text-2xl font-semibold mt-8">Addresses</h2>

      <div className="mt-4 border border-gray-300 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                Email
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
                key={s.personnr}
                className={
                  i % 2 === 0
                    ? 'bg-white hover:bg-pink-50'
                    : 'bg-gray-50 hover:bg-pink-50'
                }
                onMouseEnter={() => setHoverStudent(s)}
                onMouseLeave={() => setHoverStudent(null)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {s.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {s.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {s.personnr}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {s.tel}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{s.adress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hoverStudent && (
        <div
          className="absolute right-6 bottom-1/2 transform -translate-y-1/2 bg-yellow-100 p-4 border border-yellow-400 shadow-xl rounded w-80 z-10"
          style={{ right: '19%', bottom: '50%', transform: 'translateY(200%)' }}
        >
          <p className="font-bold mb-2">{hoverStudent.name},</p>
          <p className="text-sm">
            mail:{' '}
            <span className="font-mono text-gray-800">
              {hoverStudent.email}
            </span>
          </p>
          <p className="text-sm">
            Pers. nr.:{' '}
            <span className="font-mono text-gray-800">
              {hoverStudent.personnr}
            </span>
          </p>
          <p className="text-sm">
            Tel. nr.:{' '}
            <span className="font-mono text-gray-800">{hoverStudent.tel}</span>
          </p>
          <p className="text-sm">
            Adress:{' '}
            <span className="font-mono text-gray-800">
              {hoverStudent.adress}
            </span>
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

      <div className="absolute top-20 right-100 bg-red-100 p-2 border border-red-300 rounded shadow-md text-xs text-center transform translate-x-1/2">
        Hover over a row and see pop up window
      </div>
    </div>
  );
}
