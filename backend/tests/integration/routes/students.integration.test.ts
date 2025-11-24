import { describe, expect, beforeEach, test, jest } from "@jest/globals";
import supertest from "supertest";
import express from "express";
import studentsRoute from "../../../src/routes/adminRoutes/students.js";
import { PrismaClient } from "../../../src/generated/prisma-client/client.js";

const app = express();
app.use(express.json());
app.use("/admin/students", studentsRoute);
const request = supertest(app);
const prisma = new PrismaClient();

describe("Students Admin Route Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Should return 200 and array of all students
  test("GET /admin/students returns all students", async () => {
    const res = await request.get("/admin/students");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // Each student object should contain required properties
  test("each student contains all required properties", async () => {
    const res = await request.get("/admin/students");
    const students = res.body;

    students.forEach((student: any) => {
      expect(student).toHaveProperty("id");
      expect(student).toHaveProperty("firstName");
      expect(student).toHaveProperty("lastName");
      expect(student).toHaveProperty("personNr");
      expect(student).toHaveProperty("year");
      expect(student).toHaveProperty("phone");
      expect(student).toHaveProperty("email");
      expect(student).toHaveProperty("adress");
    });
  });

  // Verify specific student data matches database
  test("student data matches database records", async () => {
    const res = await request.get("/admin/students");
    const apiStudent = res.body.find(
      (s: any) => s.email === "diana.lind0@school.com"
    );

    const dbStudent = await prisma.student.findUnique({
      where: { email: "diana.lind0@school.com" },
    });

    expect(apiStudent).toBeDefined();
    expect(dbStudent).toBeDefined();
    expect(apiStudent.id).toBe(dbStudent?.id);
    expect(apiStudent.firstName).toBe(dbStudent?.firstName);
    expect(apiStudent.lastName).toBe(dbStudent?.lastName);
    expect(apiStudent.personNr).toBe(dbStudent?.personNr);
    expect(apiStudent.year).toBe(dbStudent?.year);
    expect(apiStudent.email).toBe(dbStudent?.email);
  });

  // PUT - Update student successfully
  test("PUT /admin/students/:personNr updates student successfully", async () => {
    const personNr = "101201-9343"; // Diana Lind0's personNr
    const updateData = {
      phone: "0799999999",
      adress: "New Address 123, Stockholm",
    };

    // original DB state
    const originalStudent = await prisma.student.findUnique({
      where: { personNr },
    });

    expect(originalStudent).toBeDefined();

    const res = await request
      .put(`/admin/students/${personNr}`)
      .send(updateData);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Student updated successfully");

    // Only check updated fields
    expect(res.body.updatedStudent.phone).toBe(updateData.phone);
    expect(res.body.updatedStudent.adress).toBe(updateData.adress);

    // Verify DB is actually updated
    const updatedDbStudent = await prisma.student.findUnique({
      where: { personNr },
    });

    expect(updatedDbStudent?.phone).toBe(updateData.phone);
    expect(updatedDbStudent?.adress).toBe(updateData.adress);

    //Restore original values
    await prisma.student.update({
      where: { personNr },
      data: {
        phone: originalStudent!.phone,
        adress: originalStudent!.adress,
      },
    });
  });
});
