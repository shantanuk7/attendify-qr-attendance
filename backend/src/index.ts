import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import attendanceRoutes from "./routes/auth.routes";
import authRoutes from "./routes/auth.routes";
import connect from "./config/dbCOnfig";
import admintRoutes from './routes/admin.routes'
import { verifyToken } from "./middlewares/auth.middleware";
dotenv.config();

const app = express();
connect();
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
//Admin Routes
app.use("/api/admin",verifyToken,admintRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
