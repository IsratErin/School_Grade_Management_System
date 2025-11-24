/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import Papa from 'papaparse';
import { z } from 'zod';

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

const years = ['Year 1', 'Year 2', 'Year 3'];

const studentValidation = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  personNr: z.string().regex(/^\d{6}-\d{4}$/, {
    message: 'Invalid format, must be DDDDDD-XXXX',
  }),
  year: z.number().min(1).max(3),
  phone: z.string().optional(),
  adress: z.string().optional(),
});

export default function AdminStudentAccounts() {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('Admin');

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setAdminName(user.displayName || 'Admin');
    }
  }, []);

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('Year 1');
  const [hoverStudent, setHoverStudent] = useState<Student | null>(null);
  const [isPopupHovered, setIsPopupHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const hidePopupTimeoutRef = useRef<number | null>(null);

  // dynamic popup position
  const rowRef = useRef<HTMLTableRowElement | null>(null);
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});

  const yearNumber = Number(selectedYear.split(' ')[1]);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5001/admin/students');
        const data = await res.json();
        if (res.ok) setStudents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((s) => s.year === yearNumber);

  const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const parsedStudents = results.data as any[]; // raw CSV rows
        const validStudents: any[] = [];
        const errors: { row: number; error: string }[] = [];

        parsedStudents.forEach((row, index) => {
          const parsedRow = {
            id: Number(row.id),
            firstName: row.firstName,
            lastName: row.lastName,
            email: row.email,
            personNr: row.personNr,
            year: Number(row.year),
            phone: row.phone || null,
            adress: row.adress || null,
          };

          const validation = studentValidation.safeParse(parsedRow);
          if (validation.success) {
            validStudents.push(parsedRow);
          } else {
            errors.push({ row: index + 2, error: validation.error.message }); // +2 for CSV header
          }
        });

        if (errors.length > 0) {
          console.error('CSV Validation Errors:', errors);
          alert(
            `Some rows failed validation:\n` +
              errors.map((e) => `Row ${e.row}: ${e.error}`).join('\n')
          );
          return; // stop sending invalid CSV
        }

        // Send valid rows to backend
        try {
          const res = await fetch(
            'http://localhost:5001/admin/students/import',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(validStudents),
            }
          );
          const data = await res.json();
          console.log(data);
          alert(data.message);
          if (data.count) setStudents((prev) => [...prev, ...validStudents]);
        } catch (err) {
          console.error(err);
          alert('Error importing CSV');
        }
      },
      error: (err) => {
        console.error('CSV parse error:', err);
        alert('Error parsing CSV file');
      },
    });
  };

  const handleSave = async () => {
    if (!hoverStudent) return;
    try {
      const res = await fetch(
        `http://localhost:5001/admin/students/${hoverStudent.personNr}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(hoverStudent),
        }
      );
      if (!res.ok) throw new Error('Failed to update student');
      const result = await res.json();
      const updated = result.updatedStudent;
      setStudents((prev) =>
        prev.map((s) => (s.personNr === updated.personNr ? updated : s))
      );
      setIsEditing(false);
      alert('Student updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Error updating student.');
    }
  };

  const handleDelete = async () => {
    if (!hoverStudent) return;

    const confirmDelete = window.confirm(
      `⚠ Are you sure you want to delete ${hoverStudent.firstName} ${hoverStudent.lastName}?`
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost:5001/admin/students/${hoverStudent.personNr}`,
        {
          method: 'DELETE',
        }
      );
      if (!res.ok) throw new Error('Failed to delete student');

      setStudents((prev) =>
        prev.filter((s) => s.personNr !== hoverStudent.personNr)
      );
      setHoverStudent(null);
      alert('Student deleted successfully!');
    } catch (error) {
      console.error(error);
      alert('Error deleting student.');
    }
  };

  if (loading) return <div className="p-10">Loading students...</div>;

  return (
    <div className="p-20 font-sans max-w-6xl mx-auto relative bg-pink-200 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Admin</h1>
        <button
          className="flex items-center gap-1 bg-pink-400 px-3 py-1 rounded-md hover:bg-pink-500 cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <span className="text-sm font-bold text-white">← {adminName}</span>
        </button>
      </div>

      {/* YEAR TABS & CSV IMPORT */}
      <div className="mt-6 flex justify-between items-center">
        <div className="flex gap-2">
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

        <div>
          <label className="bg-pink-400 text-white px-4 py-2 rounded cursor-pointer hover:bg-pink-500">
            Import CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvImport}
              className="hidden"
            />
          </label>
        </div>
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
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PersonNr
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((s) => (
              <tr
                ref={rowRef}
                key={s.personNr}
                className="hover:bg-pink-50 cursor-pointer"
                onMouseEnter={(e) => {
                  if (hidePopupTimeoutRef.current) {
                    window.clearTimeout(hidePopupTimeoutRef.current);
                    hidePopupTimeoutRef.current = null;
                  }
                  setHoverStudent({ ...s });

                  const rect = e.currentTarget.getBoundingClientRect();
                  const tableWidth =
                    e.currentTarget.closest('table')?.getBoundingClientRect()
                      .width || window.innerWidth;
                  const popupWidth = 320; // w-80 ~ 320px
                  // center horizontally relative to row but keep inside table
                  let left = rect.left + rect.width / 2 - popupWidth / 2;
                  if (left < 5) left = 5;
                  if (left + popupWidth > tableWidth - 5)
                    left = tableWidth - popupWidth - 5;
                  setPopupStyle({
                    top: rect.bottom + window.scrollY + 5,
                    left: left + window.scrollX,
                  });
                }}
                onMouseLeave={() => {
                  hidePopupTimeoutRef.current = window.setTimeout(() => {
                    if (!isPopupHovered) setHoverStudent(null);
                    hidePopupTimeoutRef.current = null;
                    setIsEditing(false);
                  }, 120);
                }}
              >
                <td className="px-6 py-4 text-sm font-medium">
                  {s.firstName} {s.lastName}
                </td>
                <td className="px-6 py-4 text-sm">{s.email}</td>
                <td className="px-6 py-4 text-sm">{s.personNr}</td>
                <td className="px-6 py-4 text-sm">{s.phone || '-'}</td>
                <td className="px-6 py-4 text-sm">{s.adress || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* HOVER POPUP */}
      {hoverStudent && (
        <div
          className="absolute bg-yellow-100 p-4 border border-yellow-400 shadow-xl rounded w-80 z-10"
          style={{ ...popupStyle }}
          onMouseEnter={() => {
            setIsPopupHovered(true);
            if (hidePopupTimeoutRef.current) {
              window.clearTimeout(hidePopupTimeoutRef.current);
              hidePopupTimeoutRef.current = null;
            }
          }}
          onMouseLeave={() => {
            setIsPopupHovered(false);
            hidePopupTimeoutRef.current = window.setTimeout(() => {
              setHoverStudent(null);
              hidePopupTimeoutRef.current = null;
              setIsEditing(false);
            }, 120);
          }}
        >
          {!isEditing ? (
            <>
              <p className="font-bold mb-1">
                {hoverStudent.firstName} {hoverStudent.lastName}
              </p>
              <p className="text-sm">Email: {hoverStudent.email}</p>
              <p className="text-sm">PersonNr: {hoverStudent.personNr}</p>
              <p className="text-sm">Phone: {hoverStudent.phone || '-'}</p>
              <p className="text-sm">Address: {hoverStudent.adress || '-'}</p>
              <div className="flex gap-4 mt-4">
                <button
                  className="border border-gray-400 px-4 py-1 bg-white rounded-md text-sm hover:bg-gray-100"
                  onClick={() => setIsEditing(true)}
                >
                  ✏ Edit
                </button>
                <button
                  className="border border-red-400 px-4 py-1 bg-red-200 rounded-md text-sm hover:bg-red-300"
                  onClick={handleDelete}
                >
                  🗑 Delete
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="font-bold mb-1">
                Editing {hoverStudent.firstName} {hoverStudent.lastName}
              </p>
              <input
                className="border w-full px-2 text-sm mb-1 rounded"
                value={hoverStudent.firstName}
                onChange={(e) =>
                  setHoverStudent({
                    ...hoverStudent,
                    firstName: e.target.value,
                  })
                }
              />
              <input
                className="border w-full px-2 text-sm mb-1 rounded"
                value={hoverStudent.lastName}
                onChange={(e) =>
                  setHoverStudent({ ...hoverStudent, lastName: e.target.value })
                }
              />
              <input
                className="border w-full px-2 text-sm mb-1 rounded"
                value={hoverStudent.email}
                onChange={(e) =>
                  setHoverStudent({ ...hoverStudent, email: e.target.value })
                }
              />
              <input
                className="border w-full px-2 text-sm mb-1 rounded"
                value={hoverStudent.phone || ''}
                onChange={(e) =>
                  setHoverStudent({ ...hoverStudent, phone: e.target.value })
                }
              />
              <input
                className="border w-full px-2 text-sm mb-1 rounded"
                value={hoverStudent.adress || ''}
                onChange={(e) =>
                  setHoverStudent({ ...hoverStudent, adress: e.target.value })
                }
              />
              <div className="flex gap-4 mt-4">
                <button
                  className="border border-gray-400 px-4 py-1 bg-white rounded-md text-sm hover:bg-gray-100"
                  onClick={handleSave}
                >
                  💾 Save
                </button>
                <button
                  className="border border-red-400 px-4 py-1 bg-red-200 rounded-md text-sm hover:bg-red-300"
                  onClick={() => setIsEditing(false)}
                >
                  ❌ Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}
      <div className="absolute top-20 right-110 bg-red-100 p-2 border border-red-300 rounded shadow-md text-xs text-center translate-x-1/2">
        Hover over a row and see pop up window
      </div>
    </div>
  );
}
