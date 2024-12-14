import {Router} from 'express';
import { getSessionAttendees, getUserAttendance, groupWiseAttendance, markAttendance } from '../controllers/attendance.controller';


const router = Router();

/**
 * Mark Attendance
 * @route   POST /api/attendance/mark
 */
router.post('/mark', markAttendance);

/**
 * Get Attendance for a Session
 * @route   GET /api/attendance/:sessionID
 */
router.get('/:sessionId', getSessionAttendees);
/**
 * Get Attendance for a Particular User
 * @route   GET /api/attendance/user/:userId
 */
router.get('/user/:userId', getUserAttendance);


router.get('/group-wise-data/:groupId',groupWiseAttendance)
export default router;
