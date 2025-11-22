import "dotenv/config";
import { Router } from "express";
import { PrismaClient } from "../../generated/prisma-client/client.ts";
import { z } from "zod";
import { subjectSchema, yearSchema } from "../../validators/valdation.js";

const prisma = new PrismaClient();
const router = Router();

//get courses
router.get("/", async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany();
    if (!subjects) {
      res.status(404).json("Courses not found.");
    }
    const validatedSubjects = z.array(subjectSchema).safeParse(subjects);
    if (!validatedSubjects.success) {
      return res.status(500).json({
        message: "Invalid response from server.",
        error: validatedStudent.error,
      });
    }
    const courses = subjects.map((s) => `${s.name} ${s.level}`);
    res.status(200).json(courses);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json(error.message);
    }
    res.status(500).json("Error unknown");
  }
});

// get students and grades by course and year
router.get("/:course/:year", async (req, res) => {
  const paramsSchema = z.object({
    course: z.string().regex(/^[a-z]+[a-c]$/),
    year: yearSchema,
  });
  const validatedParams = paramsSchema.safeParse({
    course: req.params.course.toLowerCase(),
    year: parseInt(req.params.year),
  });
  if (!validatedParams.success) {
    return res.status(422).json({
      error: validatedParams.error,
    });
  }
  try {
    const subjectId = await prisma.subject.findFirst({
      where: {
        name: {
          equals: validatedParams.data.course.slice(0, -1),
          mode: "insensitive",
        },
        level: {
          equals: validatedParams.data.course.slice(-1),
          mode: "insensitive",
        },
      },
      select: { id: true },
    });
    const grades = await prisma.grade.findMany({
      where: { subjectId: subjectId.id },
      select: { grade: true, studentId: true, updatedAt: true },
    });

    const studentIds = grades.map((s) => s.studentId);
    const students = await prisma.student.findMany({
      where: { id: { in: studentIds }, year: validatedParams.data.year },
      select: { firstName: true, lastName: true, id: true, year: true },
    });
    const data = students.map((s) => ({
      student: `${s.firstName} ${s.lastName}`,
      grade: grades.find((g) => g.studentId === s.id).grade,
      date: grades.find((g) => g.studentId === s.id).updatedAt,
      //year: s.year,
    }));
    res.status(200).json(data);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json(error.message);
    }
    res.status(500).json("Error unknown");
  }
});

export default router;
