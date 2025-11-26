import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../auth/useAuth";
import { signOutUser } from "../auth/authService";
import { LogOut } from "lucide-react";

interface Grade {
  grade: string | null;
  year?: number;
  subject?: string;
  level?: string;
  course?: string;
}

export default function StudentGrades() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  //const [student, setStudent] = useState<Student | null>(null);

  // Define available years for the filter buttons
  const years = ["Year 1", "Year 2", "Year 3", "All"];

  // Navigate back to login page
  const handleLogout = () => {
    signOutUser();
    navigate("/");
  };

  //Fetch grades and subjects from the API
  const fetchSubjectGrades = async () => {
    setLoading(true);
    try {
      const email = user?.email;
      if (!email) return;
      const response = await api.get(`/student/${email}`);
      console.log("Fetched data:", response.data);

      // Mapping the response data to our Grades interface
      const subjectwithGrades: Grade[] = response.data.grades.map(
        (g: Grade) => ({
          grade: g.grade,
          subject: g.subject,
          level: g.level, // <-- add level
          year: g.year,
          course: g.course ?? g.subject, // optional normalization
        })
      );
      const uniqueSubjects = Array.from(
        new Set(subjectwithGrades.map((g) => g.course || g.subject))
      ).filter((s): s is string => Boolean(s));

      setSubjects(uniqueSubjects);
      setGrades(subjectwithGrades);
    } catch (error) {
      console.error("Error fetching grades:", error);
    } finally {
      setLoading(false);
    }
  };
  // Filter by year and subject
  const yearNumber =
    selectedYear === "All" ? null : Number(selectedYear.split(" ")[1]);
  const filteredGrades = grades.filter(
    (g) =>
      (yearNumber === null || g.year === yearNumber) &&
      (selectedSubject === "All" ||
        g.subject === selectedSubject ||
        g.course === selectedSubject)
  );
  // Fetch grades and subjects when component mounts
  useEffect(() => {
    if (!user?.email) return; // ensure a valid email
    fetchSubjectGrades();
  }, [user?.email]); // re-fetch when user’s email becomes available

  return (
    <div className="p-20 bg-pink-200 min-h-screen max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{user?.displayName}'s Grades</h1>
        <button
          className="flex items-center gap-1 border border-pink-400 px-3 py-1 rounded-md mb-2 hover:bg-pink-500 hover:text-white cursor-pointer"
          onClick={handleLogout}
        >
          <span className="text-sm font-semibold rounded-md px-2 py-1">
            <LogOut className="inline w-4 h-4 mr-1" />
            {user?.displayName}
          </span>
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
                selectedYear === y ? "bg-pink-400 text-white" : "bg-gray-100"
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
      {!loading && (
        <table className="mt-6 w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Course</th>
              <th className="border px-4 py-2">Grade</th>
              {selectedYear === "All" && (
                <th className="border px-4 py-2">Year</th>
              )}
              {/* <th className="border px-4 py-2">Level</th> */}
            </tr>
          </thead>
          <tbody>
            {filteredGrades.length === 0 ? (
              <tr>
                <td
                  colSpan={selectedYear === "All" ? 4 : 3}
                  className="text-center py-4"
                >
                  No grades for this filter.
                </td>
              </tr>
            ) : (
              filteredGrades.map((g, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border px-4 py-2">{g.course || g.subject}</td>
                  <td className="border px-4 py-2">{g.grade}</td>
                  {selectedYear === "All" && (
                    <td className="border px-4 py-2">{g.year || "-"}</td>
                  )}
                  {/* <td className="border px-4 py-2">{g.level || "-"}</td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {loading && <div className="text-center py-4">Loading grades...</div>}
    </div>
  );
}
