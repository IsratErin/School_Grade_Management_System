import "dotenv/config";
import { Router } from "express";
import { PrismaClient } from "../generated/prisma-client/client.js";
import { z } from "zod";
import { gradeSchema, studentSchema } from "../validators/valdation.js";

const prisma = new PrismaClient();
const router = Router();

export const checkForDuplicateGrades = (
  grades: z.infer<typeof gradeSchema>[],
  student: string
) => {
  const checked = new Set<string>();
  for (const g of grades) {
    const key = `${g.studentId}:${g.subjectId}`;
    if (checked.has(key)) {
      throw new Error(
        `Duplicate grade detected for student ${student}, subjectId=${g.subjectId}`
      );
    }
    checked.add(key);
  }
};

//get all grades by email
router.get("/:email", async (req, res) => {
  const email = req.params.email;
  const validatedEmail = z.email().safeParse(email);
  if (!validatedEmail.success) {
    return res.status(422).json({
      error: validatedEmail.error,
    });
  }
  try {
    const student = await prisma.student.findUnique({
      where: { email: validatedEmail.data },
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

    const responseGrades = await prisma.grade.findMany({
      where: { studentId: validatedStudent.data.id },
    });
    const validatedGrades = z.array(gradeSchema).safeParse(responseGrades);
    if (!validatedGrades.success) {
      return res.status(500).json({
        message: "Invalid response from server.",
        error: validatedGrades.error,
      });
    }

    checkForDuplicateGrades(
      validatedGrades.data,
      `${validatedStudent.data.firstName} ${validatedStudent.data.lastName}`
    );

    const subjectIds = validatedGrades.data.map((s) => s.subjectId);
    const subjects = await prisma.subject.findMany({
      where: { id: { in: subjectIds } },
      select: { id: true, name: true, level: true },
    });

    const data = validatedGrades.data
      .map((g) => ({
        grade: g.grade,
        year: g.year,
        subject: subjects.find((s) => s.id === g.subjectId)?.name,
        level: subjects.find((s) => s.id === g.subjectId)?.level,
        course: `${subjects.find((s) => s.id === g.subjectId)?.name} ${subjects.find((s) => s.id === g.subjectId)?.level}`,
      }))
      .sort((a, b) => a.course.localeCompare(b.course));

    res.status(200).json({ student: validatedStudent.data, grades: data });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json(error.message);
    }
    res.status(500).json("Error unknown");
  }
});

//get grades by email and year OR subject
router.get("/:email/:param", async (req, res) => {
  const emailParam = req.params.email;
  const validatedEmailParam = z.email().safeParse(emailParam);
  if (!validatedEmailParam.success) {
    return res.status(422).json({
      error: validatedEmailParam.error,
    });
  }
  try {
    const student = await prisma.student.findUnique({
      where: { email: validatedEmailParam.data },
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
    const param = parseInt(req.params.param);
    //if year
    if (!isNaN(param)) {
      const validatedYear = z.number().min(1).max(3).safeParse(param);
      if (!validatedYear.success) {
        return res.status(422).json({
          error: validatedYear.error,
        });
      }
      const grades = await prisma.grade.findMany({
        where: {
          studentId: validatedStudent.data.id,
          year: validatedYear.data,
        },
      });
      if (!grades) {
        return res.json({
          message: "No grades or corses registered for this year.",
        });
      }
      const subjectIds = grades.map((s) => s.subjectId);
      const subjects = await prisma.subject.findMany({
        where: { id: { in: subjectIds } },
        select: { id: true, name: true, level: true, updatedAt: true },
      });
      const data = grades.map((g) => ({
        grade: g.grade,
        course: `${subjects.find((s) => s.id === g.subjectId)?.name} ${subjects.find((s) => s.id === g.subjectId)?.level}`,
      }));

      res.status(200).json(data);
    } else {
      //if subject
      const subjectParam = req.params.param;
      const validatedSubjectParam = z.string().safeParse(subjectParam);
      if (!validatedSubjectParam.success) {
        return res.status(422).json({
          error: validatedSubjectParam.error,
        });
      }
      const subject = await prisma.subject.findMany({
        where: {
          name: { equals: validatedSubjectParam.data, mode: "insensitive" },
        },
        select: { name: true, level: true, id: true, updatedAt: true },
      });
      if (!subject) {
        return res.status(404).json({
          message: ` ${validatedSubjectParam.data} not found.`,
        });
      }
      const subjectIds = subject.map((s) => s.id);
      const grades = await prisma.grade.findMany({
        where: {
          studentId: validatedStudent.data.id,
          subjectId: { in: subjectIds },
        },
      });

      if (!grades) {
        return res.json({
          message: `No grades or corses registered for subject ${validatedSubjectParam.data}.`,
        });
      }
      const data = grades.map((g) => ({
        grade: g.grade,
        corse: `${subject.find((s) => s.id === g.subjectId)?.name} ${subject.find((s) => s.id === g.subjectId)?.level}`,
      }));

      res.status(200).json(data);
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json(error.message);
    }
    res.status(500).json("Error unknown");
  }
});

export default router;
