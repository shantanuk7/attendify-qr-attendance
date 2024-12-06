import {Router} from 'express';
import { getUserAttendance, markAttendance } from '../controllers/attendance.controller';


const router = Router();

/**
 * Mark Attendance
 * @route   POST /api/attendance/mark
 */
router.post('/mark', markAttendance);

/**
 * Get Attendance for a Particular User
 * @route   GET /api/attendance/user/:userId
 */
router.get('/user/:userId', getUserAttendance);

export default router;
