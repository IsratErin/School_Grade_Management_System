import "dotenv/config";
import { Router } from "express";
import { PrismaClient } from "../../generated/prisma-client/client.ts";
import { z } from "zod";
import { postGradeSchema } from "../../validators/valdation.js";

const prisma = new PrismaClient();
const router = Router();

//post grades by personNr
router.post("/:personNr", async (req, res) => {
  const personNr = parseInt(req.params.personNr);
  const validatedPersonNr = z.number().safeParse(personNr);
  if (!validatedPersonNr.success) {
    return res.status(422).json({
      error: validatedPersonNr.error,
    });
  }
  try {
    //this step could be skipped if we can use the storage in a good way
    const student = await prisma.student.findUnique({
      //might need to do some validations here
      where: { personNr: validatedPersonNr.data },
      select: { id: true },
    });
    const subject = await prisma.subject.findFirst({
      where: { name: req.body.name, level: req.body.level },
      select: { id: true },
    });

    const grade = {
      studentId: student.id,
      grade: req.body.grade,
      year: req.body.year,
      subjectId: subject.id,
    };
    const validatedGrade = postGradeSchema.safeParse(grade);
    if (!validatedGrade.success) {
      return res.status(422).json({
        error: validatedGrade.error,
      });
    }
    const postedGrade = await prisma.grade.create({
      data: validatedGrade.data,
    });

    res.status(200).json(postedGrade);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json(error.message);
    }
    res.status(500).json("Error unknown");
  } finally {
    await prisma.$disconnect();
  }
});
//update grades by gradeId -- this needs to be better routed towards what we get from the frontend
router.put("/:gradeId", async (req, res) => {
  const gradeId = parseInt(req.params.gradeId);
  const validatedGradeId = z.number().safeParse(gradeId);
  if (!validatedGradeId.success) {
    return res.status(422).json({
      error: validatedGradeId.error,
    });
  }
  try {
    //might need to do some validations here
    const validatedGrade = z
      .enum(["A", "B", "C", "D", "E", "F"])
      .safeParse(req.body.grade.toUpperCase());
    if (!validatedGrade.success) {
      return res.status(422).json({
        error: validatedGrade.error,
      });
    }
    const updatedGrade = await prisma.grade.update({
      where: { id: validatedGradeId.data },
      data: { grade: validatedGrade.data },
    });
    res
      .status(200)
      .json({ message: "Grade updated successfully", updatedGrade });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json(error.message);
    }
    res.status(500).json("Error unknown");
  } finally {
    await prisma.$disconnect(); //we also want to reload the page here
  }
});

export default router;
