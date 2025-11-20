import "dotenv/config";
import { Router } from "express";
import { PrismaClient } from "../generated/prisma-client/client.ts";
import { z } from "zod";
import {
  gradeSchema,
  studentSchema,
  subjectSchema,
} from "../validators/valdation.ts";

const prisma = new PrismaClient();
const router = Router();

//get all students
router.get("/all", async (req, res) => {
  try {
    const students = await prisma.student.findMany();
    const validatedStudents = z.array(studentSchema).safeParse(students);
    if (!validatedStudents.success) {
      return res.status(500).send({
        message: "Invalid response from server.",
        error: validatedStudents.error,
      });
    }
    res.status(200).send(validatedStudents.data);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
    res.status(500).send("Error unknown");
  }
});

//get all grades by studentID
router.get("/:id/grades", async (req, res) => {
  const userId = parseInt(req.params.id);
  const validatedUserId = z.number().positive().safeParse(userId);
  if (!validatedUserId.success) {
    return res.status(422).send({
      message: "Invalid id input",
      error: validatedUserId.error,
    });
  }
  try {
    const student = await prisma.student.findUnique({
      where: { id: validatedUserId.data },
    });
    if (!student) {
      return res.status(404).send({ message: "Student not found" });
    }
    const validatedStudent = studentSchema.safeParse(student);
    if (!validatedStudent.success) {
      return res.status(500).send({
        message: "Invalid response from server.",
        error: validatedStudent.error,
      });
    }

    const grades = await prisma.grade.findMany({
      where: { studentId: validatedUserId.data },
    });
    if (!grades) {
      return res.send({ message: "No grades or corses registered yet." });
    }
    const subjectIds = grades.map((s) => s.subjectId);
    const subjects = await prisma.subject.findMany({
      where: { id: { in: subjectIds } },
      select: { id: true, name: true, level: true },
    });
    const gradeSubjectJoin = grades.map((g) => ({
      grade: g.grade,
      year: g.year,
      subject: subjects.find((s) => s.id === g.subjectId)?.name,
      level: subjects.find((s) => s.id === g.subjectId)?.level,
    }));

    res
      .status(200)
      .send({ student: validatedStudent.data, grades: gradeSubjectJoin });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send(error.message);
    }
    res.status(500).send("Error unknown");
  }
});

export default router;
