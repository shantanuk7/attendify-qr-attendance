import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import attendanceRoutes from "./routes/attendance.routes";
import authRoutes from "./routes/auth.routes";
import connect from "./config/dbCOnfig";

dotenv.config();

const app = express();
connect();
// Middleware
// app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
