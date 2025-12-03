import express from "express";
import cors from "cors";
import studentRoute from "./src/routes/studentRoutes.js";
import adminStudentsRoutes from "./src/routes/adminRoutes/students.js";
import adminGradesChangeRoutes from "./src/routes/adminRoutes/changeGrades.js";
import adminGradesViewRoutes from "./src/routes/adminRoutes/viewGrades.js";
import type { CorsOptions } from "cors";
import verifyIdToken from "./middleware/authMiddleware.js";
//import outdatedStudentRoute from "./src/routes/outdatedRoutes/gradesByStudentId.js";
//import { PrismaClient } from "./src/generated/prisma-client/client.ts";

//const prisma = new PrismaClient();
const corsOptions: CorsOptions = {
  origin: [
    "http://localhost:5173",
    "https://school-grade-management-system-v542.vercel.app",
  ], //works for default react localhosting
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
const PORT = 5001;
const app = express();

app.use(express.json());
app.use(cors(corsOptions));

app.use("/student", verifyIdToken, studentRoute);
app.use("/admin/students", verifyIdToken, adminStudentsRoutes);
app.use("/admin/grades", verifyIdToken, adminGradesChangeRoutes);
app.use("/admin/grades", verifyIdToken, adminGradesViewRoutes);
//app.use("/student", outdatedStudentRoute);

app.get("/", (req, res) => {
  res.send("Welcome to the Grade System API!");
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running http://localhost:${PORT}`);
  });
}

export default app;
