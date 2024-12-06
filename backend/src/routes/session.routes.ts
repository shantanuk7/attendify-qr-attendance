import {Router} from "express";
import { createSession, getSessions } from "../controllers/session.controller";

const router = Router();
/**
 * Session Management Routes
 *
 * These routes allow the creation and retrieval of session data.
 */

// Create a new session
// @route   POST /api/admin/create-session
// @desc    Generate a new session with a QR code
// @access  Admin Only
router.post('/create-session', createSession);

// Get a list of all sessions
// @route   GET /api/admin/get-sessions
// @desc    Retrieve all sessions from the database
// @access  Admin Only
router.get('/get-sessions', getSessions);


export default router