import "dotenv/config";
import { Router } from "express";
import { PrismaClient } from "../../generated/prisma-client/client.ts";
import { z } from "zod";
import {
  studentSchema,
  updateStudentSchema,
  personNrSchema,
} from "../../validators/valdation.js";

const prisma = new PrismaClient();
const router = Router();

//get all students
router.get("/", async (req, res) => {
  try {
    const students = await prisma.student.findMany();
    if (!students) {
      return res.json({ message: "No students registered." });
    }
    const validatedStudent = z.array(studentSchema).safeParse(students);
    if (!validatedStudent.success) {
      res.status(500).json({
        message: "Invalid data response from server.",
        error: validatedStudent.error,
      });
    }
    res.status(200).json(validatedStudent.data);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json(error.message);
    }
    res.status(500).json("Error unknown");
  }
});

//update student by personnummer
router.put("/:personNr", async (req, res) => {
  try {
    const personNr = req.params.personNr;
    const validatedPersonNr = personNrSchema.safeParse(personNr);
    if (!validatedPersonNr.success) {
      return res.status(422).json({
        error: validatedPersonNr.error,
      });
    }
    const validatedUpdateStudent = updateStudentSchema.safeParse(req.body);
    if (!validatedUpdateStudent.success) {
      return res.status(422).json({
        error: validatedUpdateStudent.error,
      });
    }
    const updatedStudent = await prisma.student.update({
      where: { personNr: validatedPersonNr.data },
      data: validatedUpdateStudent.data,
    });
    res
      .status(200)
      .json({ message: "Student updated successfully", updatedStudent });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json(error.message);
    }
    res.status(500).json("Error unknown");
  } finally {
    await prisma.$disconnect();
  }
});

//delete student by prsonNr
router.delete("/:personNr", async (req, res) => {
  try {
    const personNr = req.params.personNr;
    const validatedPersonNr = personNrSchema.safeParse(personNr);
    if (!validatedPersonNr.success) {
      return res.status(422).json({
        error: validatedPersonNr.error,
      });
    }
    await prisma.student.delete({
      where: { personNr: validatedPersonNr.data },
    });
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json(error.message);
    }
    res.status(500).json("Error unknown");
  } finally {
    await prisma.$disconnect();
  }
});

export default router;
