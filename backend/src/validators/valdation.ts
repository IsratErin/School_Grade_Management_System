import { string, z } from "zod";

export const studentSchema = z.object({
  id: z.number().positive(),
  firstName: z
    .string()
    .min(2, { message: "Name need to be at least 2 characters long" })
    .max(30, { message: "Name cannot be longer then 30 letters." })
    .regex(
      /^[\p{L} -]+$/u,
      "Invalid format, only letters, hyphen and space allowed in the name"
    ),
  lastName: z
    .string()
    .min(2, { message: "Name need to be at least 2 characters long" })
    .max(60, { message: "Name cannot be longer then 60 letters." })
    .regex(/^[\p{L} -]+$/u, {
      message:
        "Invalid format, only letters, hyphen and space allowed in the name",
    }),
  personNr: z.number(), //should maybe be z.string().regex(/^\d{6}-\d{4}$/, "Invalid format, format must be DDDDD-XXXX where D and X are digits")
  year: z.number().min(1).max(9).optional().nullable(),
  phone: z.number().optional().nullable(), //maybe regex here as well? /^\d{8}$/ for an 8 digit phonenumber, maybe take into account that you can add a +?
  adress: z.string().optional().nullable(), //how do we want this input, should everything be in one line that we store or do we format it in some way?
  createdAt: z
    .date()
    .max(new Date(), { message: "Date cannot be in the future" }),
  updatedAt: z
    .date()
    .max(new Date(), { message: "Date cannot be in the future" }),
});

export const gradeSchema = z.object({
  id: z.number().positive(),
  studentId: z.number().positive(),
  grade: z.enum(["A", "B", "C", "D", "E", "F"]),
  year: z.number().min(1).max(9).optional().nullable(),
  subjectId: z.number().positive(),
  createdAt: z
    .date()
    .max(new Date(), { message: "Date cannot be in the future" }),
  updatedAt: z
    .date()
    .max(new Date(), { message: "Date cannot be in the future" }),
});

export const subjectSchema = z.object({
  id: z.number().positive(),
  name: z
    .string()
    .min(2, { message: "Subject name need to be at least 2 characters long" })
    .max(60, { message: "Subject name cannot be longer then 60 letters." })
    .regex(
      /^[\p{L} -]+$/u,
      "Invalid format, only letters, hyphen and space allowed in the name"
    ),
  level: z
    .string()
    .toUpperCase()
    .length(1)
    .regex(/^[A-Z]+$/),
  createdAt: z
    .date()
    .max(new Date(), { message: "Date cannot be in the future" }),
  updatedAt: z
    .date()
    .max(new Date(), { message: "Date cannot be in the future" }),
});
