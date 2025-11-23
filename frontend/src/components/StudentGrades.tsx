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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../auth/useAuth";
import { signOutUser } from "../auth/authService";
import { LogOut } from "lucide-react";

interface Grades {
  grade: string | null;
  subject: string;
  year?: number;
}

export default function StudentGrades() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [grades, setGrades] = useState<Grades[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Define available years for the filter buttons
  const years = ["Year 1", "Year 2", "Year 3", "All"];

  // Navigate back to login page
  const logout = () => {
    signOutUser();
    navigate("/");
  };

  //Fetch grades and subjects from the API
  const fetchSubjectGrades = async () => {
    setLoading(true);
    try {
      const userName = user?.displayName;
      // Fetch student grades from API
      const response = await api.get(`/student/name/${userName}`);
      console.log("Fetched data:", response.data);

      // Map the response data to our Grades interface
      const subjectwithGrades: Grades[] = response.data.grades.map(
        (g: Grades) => ({
          grade: g.grade,
          subject: g.subject,
          year: g.year,
        })
      );

      // Extract unique subjects from fetched grades
      const uniqueSubjects = Array.from(
        new Set(subjectwithGrades.map((g) => g.subject))
      );

      // Add "All Subjects" option at the beginning of the subjects array
      uniqueSubjects.unshift("All Subjects");

      // Update state with fetched data
      setSubjects(uniqueSubjects);
      setGrades(subjectwithGrades);
    } catch (error) {
      console.error("Error fetching grades:", error);
    } finally {
      // Always set loading to false after fetch completes
      setLoading(false);
    }
  };

  // Extract year number from selected year string (e.g., "Year 1" -> 1)
  // Returns null if "All" is selected
  const yearNumber =
    selectedYear === "All" ? null : Number(selectedYear.split(" ")[1]);

  // Filter grades based on selected year and subject
  const filteredGrades = grades.filter(
    (g) =>
      (yearNumber === null || g.year === yearNumber) &&
      (selectedSubject === "All Subjects" || g.subject === selectedSubject)
  );

  // Check if the selected subject is an English course for special dropdown handling
  const isEnglishDropdown =
    selectedSubject === "Engelska 5" || selectedSubject === "Engelska 6";

  // Fetch grades and subjects when component mounts
  useEffect(() => {
    if (!user?.displayName) return; // ensure a valid name
    fetchSubjectGrades();
  }, [user?.displayName]); // re-fetch when user’s name becomes available

  return (
    <div className="p-20 font-sans max-w-4xl mx-auto bg-pink-200 min-h-screen">
      {/* Header section with title and logout button */}
      <div className="flex justify-between items-start">
        <h1 className="text-4xl font-bold">Grades</h1>

        <div className="flex flex-col items-end">
          {/* Logout button with student name */}
          <button
            className="flex items-center gap-1 border border-pink-400 px-3 py-1 rounded-md mb-2 hover:bg-pink-500 hover:text-white cursor-pointer"
            onClick={logout}
          >
            <span className="text-sm font-semibold rounded-md px-2 py-1">
              <LogOut className="inline w-4 h-4 mr-1" />
              {user?.displayName}
            </span>
          </button>

          {/* Subject filter dropdown */}
          <div className="flex gap-2 mt-2">
            <select
              className="border border-pink-400 bg-pink-400 text-white font-semibold px-3 py-1 rounded-md"
              value={isEnglishDropdown ? "English" : selectedSubject}
              onChange={(e) => {
                const value = e.target.value;
                // If "English" is selected, default to "Engelska 5"
                if (value === "English") {
                  setSelectedSubject("Engelska 5");
                } else {
                  setSelectedSubject(value);
                }
              }}
            >
              <option value="All Subjects">Subject</option>
              <option value="English">English</option>
              {/* Display all other subjects except "All Subjects" and "English" */}
              {subjects
                .filter((s) => s !== "All Subjects" && s !== "English")
                .map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Year filter buttons */}
      <div className="mt-6 flex gap-2">
        {years.map((y) => (
          <button
            key={y}
            onClick={() => {
              setSelectedYear(y);
              // Reset subject filter to "All Subjects" when year changes
              setSelectedSubject("All Subjects");
            }}
            className={`px-4 py-2 rounded border border-gray-300 transition-colors ${
              selectedYear === y
                ? "bg-pink-400 font-semibold text-white cursor-pointer border-pink-700"
                : "bg-gray-100 hover:bg-pink-400 hover:text-white cursor-pointer"
            }`}
          >
            {y}
          </button>
        ))}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="mt-6 text-center text-gray-600">Loading grades...</div>
      )}

      {/* Grades table - only show when not loading */}
      {!loading && (
        <div className="mt-6 border border-gray-300 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Table header */}
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Grade
                </th>
              </tr>
            </thead>

            {/* Table body with grades data */}
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGrades.length > 0 ? (
                // Display filtered grades with alternating row colors
                filteredGrades.map((g, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {g.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {g.grade || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                // Display message when no grades match the filter
                <tr>
                  <td
                    colSpan={2} // Fixed: changed from 3 to 2 (table has only 2 columns)
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No grades found for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
