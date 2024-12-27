import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connect from "./config/dbCOnfig";

//  Routes
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import attendanceRoutes from "./routes/attendance.routes";
import sessionRoutes from "./routes/session.routes";

import { verifyToken } from "./middlewares/auth.middleware";

dotenv.config();

const app = express();
connect();

const allowedOrigins = [
    'http://localhost:3000',      
    'http://192.168.0.106:3000', 
  ];
// Middleware
app.use(cors(
  {
    origin:'*',
    credentials: true,
  }
));
app.options('*', cors())
app.use(express.json());

// Authentication Routes
app.use("/api/auth", authRoutes);

// Admin Routes
app.use("/api/admin", verifyToken, adminRoutes);

// Attendance Routes
app.use("/api/attendance", verifyToken, attendanceRoutes);

// Session Routes
app.use("/api/session", verifyToken, sessionRoutes);

// Start the Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
