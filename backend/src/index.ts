import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import attendanceRoutes from './routes/attendance.routes';

dotenv.config();

const app = express();

// Middleware
// app.use(cors());
app.use(express.json());

// Routes
app.use('/api/attendance', attendanceRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || '')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
