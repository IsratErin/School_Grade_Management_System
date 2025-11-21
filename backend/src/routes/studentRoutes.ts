import "dotenv/config";
import { Router } from "express";
import { PrismaClient } from "../generated/prisma-client/client.js";
import { z } from "zod";
import {
  gradeSchema,
  studentSchema,
  subjectSchema,
} from "../validators/valdation.js";

const prisma = new PrismaClient();
const router = Router();

// GET /student/name/:name
// Without schema validation for now for simplicity
router.get("/name/:name", async (req, res) => {
  const name = req.params.name;

  if (!name || typeof name !== "string") {
    return res.status(422).json({ error: "Invalid name parameter." });
  }

  try {
    // Find the first student matching the name (firstName OR lastName)
    const student = await prisma.student.findFirst({
      where: {
        OR: [{ firstName: name }, { lastName: name }],
      },
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Fetch grades for the student
    const grades = await prisma.grade.findMany({
      where: { studentId: student.id },
    });

    // Fetch subject info
    const subjectIds = grades.map((g) => g.subjectId);
    const subjects = await prisma.subject.findMany({
      where: { id: { in: subjectIds } },
      select: { id: true, name: true, level: true, updatedAt: true },
    });

    // Merge grades with subjects
    const gradeSubjectJoin = grades.map((g) => ({
      grade: g.grade,
      year: g.year,
      subject: subjects.find((s) => s.id === g.subjectId)?.name,
      level: subjects.find((s) => s.id === g.subjectId)?.level,
      timestamp: subjects.find((s) => s.id === g.subjectId)?.updatedAt,
    }));

    // Return the student and their grades
    res.status(200).json({ student, grades: gradeSubjectJoin });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "Unknown error" });
  }
});

//get student and all grades by studentID
router.get("/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  const validatedUserId = z.number().positive().safeParse(userId);
  if (!validatedUserId.success) {
    return res.status(422).json({
      error: validatedUserId.error,
    });
  }
  try {
    const student = await prisma.student.findUnique({
      where: { id: validatedUserId.data },
    });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const validatedStudent = studentSchema.safeParse(student);
    if (!validatedStudent.success) {
      return res.status(500).json({
        message: "Invalid response from server.",
        error: validatedStudent.error,
      });
    }

    const grades = await prisma.grade.findMany({
      where: { studentId: validatedUserId.data },
    });
    if (!grades) {
      return res.json({ message: "No grades or corses registered yet." });
    }
    const subjectIds = grades.map((s) => s.subjectId);
    const subjects = await prisma.subject.findMany({
      where: { id: { in: subjectIds } },
      select: { id: true, name: true, level: true, updatedAt: true },
    });
    const gradeSubjectJoin = grades.map((g) => ({
      grade: g.grade,
      year: g.year,
      subject: subjects.find((s) => s.id === g.subjectId)?.name,
      level: subjects.find((s) => s.id === g.subjectId)?.level,
      timestamp: subjects.find((s) => g.id === s.id)?.updatedAt,
    }));

    res
      .status(200)
      .json({ student: validatedStudent.data, grades: gradeSubjectJoin });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json(error.message);
    }
    res.status(500).json("Error unknown");
  }
});

export default router;
