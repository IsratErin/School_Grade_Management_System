import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma-client/client.ts";
import { GradeValue } from "../src/generated/prisma-client/enums.ts";

const prisma = new PrismaClient();

async function seedGrades() {
  try {
    const levelsByYear = ["A", "B", "C"];
    const students = await prisma.student.findMany();
    const subjects = await prisma.subject.findMany();

    for (const student of students) {
      // Loop through all years up to the student's current year
      for (let yr = 1; yr <= student.year!; yr++) {
        const level = levelsByYear[yr - 1];
        const levelSubjects = subjects.filter((s) => s.level === level);

        for (const subject of levelSubjects) {
          // Random grade
          const randomGrade =
            Object.values(GradeValue)[
              Math.floor(Math.random() * Object.values(GradeValue).length)
            ];

          await prisma.grade.create({
            data: {
              studentId: student.id,
              subjectId: subject.id,
              grade: randomGrade,
              year: yr,
            },
          });
        }
      }
    }

    console.log("Grades seeded successfully!");
  } catch (err) {
    console.error("Error seeding grades:", err);
  } finally {
    await prisma.$disconnect();
  }
}

seedGrades();
