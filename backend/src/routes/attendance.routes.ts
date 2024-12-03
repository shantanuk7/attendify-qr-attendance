import express from 'express';
import { markAttendance, getAttendance } from '../controllers/attendance.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/mark', verifyToken, markAttendance);
router.get('/:sessionId', verifyToken, getAttendance);

export default router;
