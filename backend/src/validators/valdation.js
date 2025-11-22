import { coerce, email, z } from "zod";

const yearSchema = z.number().min(1).max(3).optional().nullable();
const personNrSchema = z
  .string()
  .regex(
    /^\d{6}-\d{4}$/,
    "Invalid format, format must be DDDDD-XXXX where D are birth date and X are identifying digits"
  );
const firstNameSchema = z
  .string()
  .min(2, { message: "Name need to be at least 2 characters long" })
  .max(30, { message: "Name cannot be longer then 30 letters." })
  .regex(
    /^[\p{L} -]+$/u,
    "Invalid format, only letters, hyphen and space allowed in the name"
  );
const lastNameSchema = z
  .string()
  .min(2, { message: "Name need to be at least 2 characters long" })
  .max(60, { message: "Name cannot be longer then 60 letters." })
  .regex(/^[\p{L} -]+$/u, {
    message:
      "Invalid format, only letters, hyphen and space allowed in the name",
  });
const dateSchema = z.coerce.date();

export const studentSchema = z.object({
  id: z.number().positive(),
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  personNr: personNrSchema,
  year: yearSchema,
  phone: z.string().optional().nullable(),
  email: z.email(),
  adress: z.string().optional().nullable(),
});

export const updateStudentSchema = z.object({
  firstName: firstNameSchema.optional(),
  lastName: lastNameSchema.optional(),
  year: yearSchema,
  phone: z.string().optional().nullable(),
  adress: z.string().optional().nullable(),
});

export const gradeSchema = z.object({
  id: z.number().positive(),
  studentId: z.number().positive(),
  grade: z.enum(["A", "B", "C", "D", "E", "F"]),
  year: yearSchema,
  subjectId: z.number().positive(),
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

export const postGradeSchema = z.object({
  studentId: z.number().positive(),
  grade: z.enum(["A", "B", "C", "D", "E", "F"]),
  year: yearSchema,
  subjectId: z.number().positive(),
});

export const subjectSchema = z.object({
  id: z.number().positive(),
  name: lastNameSchema,
  level: z
    .string()
    .toUpperCase()
    .length(1)
    .regex(/^[A-Z]+$/),
  createdAt: dateSchema,
  updatedAt: dateSchema,
});
