import express from "express";
import cors from "cors";
import studentRoutes from "./src/routes/studentRoutes.ts";
import type { CorsOptions } from "cors";

const corsOptions: CorsOptions = {
  origin: ["http://localhost:5173"], //works for default react localhosting
};
const PORT = 3000;
const app = express();

app.use(express.json());
app.use(cors(corsOptions));

app.use("/student", studentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
