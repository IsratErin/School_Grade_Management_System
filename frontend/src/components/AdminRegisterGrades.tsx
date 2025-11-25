import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import toast from "react-hot-toast";
import api from "../api/axios";

interface Grade {
  gradeId: number | null; // null = NEW grade
  student: string;
  personNr: string;
  grade: string;
  date: string;
}

interface Student {
  firstName: string;
  lastName: string;
  personNr: string;
  year: number;
}

const years = ["1", "2", "3"];

export default function AdminRegisterGrades() {
  const navigate = useNavigate();
  const [adminName] = useState(
    () => getAuth().currentUser?.displayName || "Admin"
  );

  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedYear, setSelectedYear] = useState("1");
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch students (including newly imported)
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("/admin/students");
        setStudents(res.data);
      } catch {
        toast.error("Error loading students!");
      }
    };
    fetchStudents();
  }, []);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/admin/grades");
        setCourses(res.data);
        setSelectedCourse(res.data[0] ?? "");
      } catch {
        toast.error("Error loading courses!");
      }
    };
    fetchCourses();
  }, []);

  // Fetch grades for selected course/year + add empty rows for students without grades
  useEffect(() => {
    if (!selectedCourse || !selectedYear) return;
    const fetchGrades = async () => {
      setLoading(true);
      try {
        const courseParam = selectedCourse.replace(" ", "").toLowerCase();
        const res = await api.get(
          `/admin/grades/${courseParam}/${selectedYear}`
        );
        const existingGrades = res.data;

        // Map grades
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedGrades: Grade[] = existingGrades.map((g: any) => ({
          gradeId: g.gradeId,
          personNr: g.personNr,
          student: g.student,
          grade: g.grade || "",
          date: g.date ?? "",
        }));

        // Add empty rows for students without grades
        const studentsWithGrades = mappedGrades.map((g) => g.personNr);
        const newStudents: Grade[] = students
          .filter((s) => s.year === parseInt(selectedYear))
          .filter((s) => !studentsWithGrades.includes(s.personNr))
          .map((s) => ({
            gradeId: null,
            student: `${s.firstName} ${s.lastName}`,
            personNr: s.personNr,
            grade: "",
            date: "",
          }));

        setGrades([...mappedGrades, ...newStudents]);
      } catch {
        toast.error("Error loading grades!");
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, [selectedCourse, selectedYear, students]);

  // Update grade input
  const handleGradeChange = (grade: Grade, value: string) => {
    const letter = value.toUpperCase();
    if (!/^[A-F]?$/.test(letter)) return;

    setGrades((prev) =>
      prev.map((g) => (g === grade ? { ...g, grade: letter } : g))
    );
  };

  // Save new grade
  const saveNewGrade = async (grade: Grade) => {
    if (!grade.grade) {
      toast.error("Enter grade first!");
      return;
    }

    try {
      const [name, level] = selectedCourse.split(" ");
      await api.post(`/admin/grades/${grade.personNr}`, {
        name,
        level,
        grade: grade.grade,
        year: parseInt(selectedYear),
      });

      toast.success("Grade added!");
      window.location.reload();
    } catch {
      toast.error("Error adding grade!");
    }
  };

  //update grade
  const saveUpdatedGrade = async (grade: Grade) => {
    if (!grade.grade) {
      toast.error("Enter grade first!");
      return;
    }

    try {
      const [name, level] = selectedCourse.split(" ");
      const res = await fetch(
        `http://localhost:5001/admin/grades/${grade.gradeId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            level,
            grade: grade.grade,
            year: parseInt(selectedYear),
          }),
        }
      );

      if (!res.ok) throw new Error();

      toast.success("Grade updated!");
      window.location.reload();
    } catch {
      toast.error("Error updating grade!");
    }
  };

  return (
    <div className="p-10 max-w-5xl mx-auto font-sans">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin</h1>
        <button
          className="bg-pink-400 hover:bg-pink-500 text-white px-3 py-1 rounded-md"
          onClick={() => navigate("/admin-dashboard")}
        >
          ← {adminName}
        </button>
      </div>

      {/* YEAR SELECT */}
      <div className="flex justify-between gap-4 mb-6">
        <div className="flex gap-2 mb-4">
          {years.map((y) => (
            <button
              key={y}
              className={`px-4 py-1 rounded border ${
                selectedYear === y ? "bg-pink-400 text-white" : "bg-gray-100"
              }`}
              onClick={() => setSelectedYear(y)}
            >
              Year {y}
            </button>
          ))}
        </div>

        {/* COURSE SELECT */}
        <div className="flex items-center gap-2">
          <select
            className="border border-pink-400 px-3 py-1 rounded-md"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            {courses.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
      {/* TITLE */}
      <h2 className="text-xl font-semibold mb-4">Register Grades</h2>

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full border border-gray-300 rounded-lg mb-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3">Student</th>
              <th className="px-6 py-3">Grade</th>
              <th className="px-6 py-3">Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {grades.map((g, i) => (
              <tr key={i}>
                <td className="px-6 py-2">{g.student}</td>
                <td className="px-6 py-2">
                  <input
                    value={g.grade}
                    maxLength={1}
                    onChange={(e) => handleGradeChange(g, e.target.value)}
                    className="border px-2 py-1 w-16 text-center"
                  />
                </td>
                <td className="px-6 py-2">{g.date || "-"}</td>
                <td className="px-6 py-2">
                  {g.gradeId === null && (
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded"
                      onClick={() => saveNewGrade(g)}
                    >
                      Save
                    </button>
                  )}
                  {g.gradeId !== null && (
                    <button
                      className="bg-purple-500 text-white px-3 py-1 rounded"
                      onClick={() => saveUpdatedGrade(g)}
                    >
                      Update
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
