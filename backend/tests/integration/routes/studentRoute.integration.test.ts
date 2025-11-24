import { describe, expect, beforeEach, test, jest } from "@jest/globals";
import supertest from "supertest";
import express from "express";
import studentRoute from "../../../src/routes/studentRoutes.js";
import { PrismaClient } from "../../../src/generated/prisma-client/client.js";

const app = express();
app.use(express.json());
app.use("/students", studentRoute);
const request = supertest(app);
const prisma = new PrismaClient();

describe("Student Route Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Should return 200 , student object , grades array
  test("GET /students/:email returns full student profile", async () => {
    const email = "tina.nilsson2@school.com";
    const res = await request.get(`/students/${email}`);
    expect(res.status).toBe(200);
    expect(res.body.student).toBeDefined();
    expect(res.body.grades).toBeInstanceOf(Array);
    expect(res.body.student.email).toBe(email);
  });

  // Student object includes required fields
  test("student object contains all required properties", async () => {
    const res = await request.get(`/students/tina.nilsson2@school.com`);
    const student = res.body.student;
    expect(student).toHaveProperty("id");
    expect(student).toHaveProperty("firstName");
    expect(student).toHaveProperty("lastName");
    expect(student).toHaveProperty("personNr");
    expect(student).toHaveProperty("year");
    expect(student).toHaveProperty("email");
  });

  //ONLY will pass if the Seeded dummy data in the database has this specific student, will fail otherwise
  test("student information matches with required values", async () => {
    const res = await request.get(`/students/tina.nilsson2@school.com`);
    const student = res.body.student;

    // Fetch the same student directly from the database for comparison
    const dbStudent = await prisma.student.findUnique({
      where: { email: "tina.nilsson2@school.com" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        personNr: true,
        year: true,
        phone: true,
        email: true,
        adress: true,
      },
    });
    const studentData = {
      id: 6,
      firstName: "Tina",
      lastName: "Nilsson",
      personNr: "060314-7771",
      year: 1,
      phone: "0799999999",
      email: "tina.nilsson2@school.com",
      adress: "New Address 123, Stockholm",
    };
    expect(student).toEqual(studentData);
    expect(studentData).toEqual(dbStudent);
    expect(student.id).toBe(dbStudent?.id);
    expect(student.firstName).toBe(dbStudent?.firstName);
    expect(student.lastName).toBe(dbStudent?.lastName);
  });

  // Grades array returns each subject group with correct keys
  test("grades array contains subject entries with required fields", async () => {
    const res = await request.get(`/students/tina.nilsson2@school.com`);
    const grade = res.body.grades[0];
    expect(grade).toHaveProperty("grade");
    expect(grade).toHaveProperty("year");
    expect(grade).toHaveProperty("subject");
    expect(grade).toHaveProperty("level");
  });

  //Should return 404 for non-existent student
  test("GET /students/:email returns 404 when student not found", async () => {
    const res = await request.get(`/students/unknown.person@school.com`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBeDefined();
    expect(res.body.message).toBe("Student not found");
  });
});
