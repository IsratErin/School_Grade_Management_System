import { describe, expect, beforeAll, afterAll, test } from "@jest/globals";
import supertest from "supertest";
import express from "express";
import studentRoute from "../../../src/routes/studentRoutes.js";
import { PrismaClient } from "../../../src/generated/prisma-client/client.js";
import { checkForDuplicateGrades } from "../../../src/routes/studentRoutes.js";

const app = express();
app.use(express.json());
app.use("/students", studentRoute);
const request = supertest(app);
const prisma = new PrismaClient();

describe("Student Route Integration Tests", () => {
  let testStudent: any;

  beforeAll(async () => {
    // A test student for all tests to use
    testStudent = await prisma.student.upsert({
      where: { email: "tina.nilsson2@school.com" },
      update: {},
      create: {
        firstName: "Tina",
        lastName: "Nilsson",
        email: "tina.nilsson2@school.com",
        personNr: "060314-7771",
        year: 1,
        phone: "0788985638",
        adress: "Parkvägen 42, Stockholm",
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("GET /students/:email returns full student profile", async () => {
    const email = "tina.nilsson2@school.com";
    const res = await request.get(`/students/${email}`);

    expect(res.status).toBe(200);
    expect(res.body.student).toBeDefined();
    expect(res.body.grades).toBeInstanceOf(Array);
    expect(res.body.student.email).toBe(email);
  });

  test("student object contains all required properties", async () => {
    const res = await request.get(`/students/tina.nilsson2@school.com`);
    const student = res.body.student;

    expect(student).toBeDefined();
    expect(student).toHaveProperty("id");
    expect(student).toHaveProperty("firstName");
    expect(student).toHaveProperty("lastName");
    expect(student).toHaveProperty("personNr");
    expect(student).toHaveProperty("year");
    expect(student).toHaveProperty("email");
  });

  test("student information matches database", async () => {
    const res = await request.get(`/students/tina.nilsson2@school.com`);
    const student = res.body.student;

    const dbStudent = await prisma.student.findUnique({
      where: { email: "tina.nilsson2@school.com" },
    });

    expect(student).toBeDefined();
    expect(dbStudent).toBeDefined();
    expect(student.id).toBe(dbStudent?.id);
    expect(student.firstName).toBe(dbStudent?.firstName);
    expect(student.lastName).toBe(dbStudent?.lastName);
    expect(student.email).toBe(dbStudent?.email);
  });

  test("grades array structure is valid", async () => {
    const res = await request.get(`/students/tina.nilsson2@school.com`);

    expect(res.body.grades).toBeDefined();
    expect(Array.isArray(res.body.grades)).toBe(true);

    if (res.body.grades.length > 0) {
      const grade = res.body.grades[0];
      expect(grade).toHaveProperty("grade");
      expect(grade).toHaveProperty("year");
      expect(grade).toHaveProperty("subject");
      expect(grade).toHaveProperty("level");
    }
  });

  test("GET /students/:email returns 404 when student not found", async () => {
    const res = await request.get(`/students/unknown.person@school.com`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Student not found");
  });
});

test("Throw error if a student have duplicate grades", () => {
  expect(() =>
    checkForDuplicateGrades(
      [
        {
          id: 280,
          studentId: 12,
          grade: "D",
          year: 1,
          subjectId: 22,
          createdAt: new Date("2025-11-21T23:57:02.934Z"),
          updatedAt: new Date("2025-11-21T23:57:02.934Z"),
        },
        {
          id: 281,
          studentId: 12,
          grade: null,
          year: 2,
          subjectId: 23,
          createdAt: new Date("2025-11-21T23:57:02.991Z"),
          updatedAt: new Date("2025-11-21T23:57:02.991Z"),
        },
        {
          id: 282,
          studentId: 12,
          grade: null,
          year: 3,
          subjectId: 24,
          createdAt: new Date("2025-11-21T23:57:03.044Z"),
          updatedAt: new Date("2025-11-21T23:57:03.044Z"),
        },
        {
          id: 282,
          studentId: 12,
          grade: null,
          year: 3,
          subjectId: 24,
          createdAt: new Date("2025-11-21T23:57:03.044Z"),
          updatedAt: new Date("2025-11-21T23:57:03.044Z"),
        },
      ],
      "Laura Croft"
    )
  ).toThrowError(
    "Duplicate grade detected for student Laura Croft, subjectId=24"
  );
});
