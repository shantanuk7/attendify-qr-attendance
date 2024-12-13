import { Request, Response } from "express";
import Session from "../models/Session.model";
import { jwtDecode } from "jwt-decode";
import mongoose from "mongoose";

/**
 * Mark Attendance
 *
 * Marks the attendance for a user by validating the session QR code and user eligibility.
 *
 * @route   POST /api/attendance/mark
 * @access  User
 */
export const markAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      res.status(400).json({ error: 'Session ID is required.' });
      return;
    }

    const authHeader = req.headers.authorization!;
    const token = authHeader.split(" ")[1];
    
    const decodedToken = jwtDecode<{ id: string }>(token);
    const userId = decodedToken.id;


    const userObjectId = new mongoose.Types.ObjectId(userId);

    const session = await Session.findById(sessionId).populate({
      path: 'groupId',
      populate: {
        path: 'members',
        model: 'User',
        select: 'username email',
      }
    });

    if (!session) {
      res.status(404).json({ error: 'Session not found.' });
      return;
    }

    const group = session.groupId as any;
    if (!group || !group.members || group.members.length === 0) {
      res.status(400).json({ error: 'Group or group members not found.' });
      return;
    }

    const userExistsInGroup = group.members.some((user: any) => user._id.equals(userObjectId));
    if (!userExistsInGroup) {
      res.status(403).json({ error: 'User is not part of this group.' });
      return;
    }

    const currentTime = new Date();
    if (session.expiryTime && currentTime > session.expiryTime) {
      res.status(403).json({ error: 'Attendance marking has expired for this session.' });
      return;
    }

    if (session.attendances.includes(userObjectId)) {
      res.status(400).json({ error: 'Attendance already marked for this user.' });
      return;
    }

    session.attendances.push(userObjectId);
    await session.save();

    res.status(200).json({
      message: 'Attendance marked successfully.',
      expiryTime: session.expiryTime,
    });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ error: 'Failed to mark attendance.' });
  }
};

/**
 * Get Attendance for session
 *
 * Fetches all attendance records for a session
 *
 * @route   GET /api/attendance/:sessionId
 * @access  Admin
 */
export const getSessionAttendees = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId).populate({
      path: 'attendances',
      select: 'username email' 
    });

    if (!session) {
      res.status(404).json({ error: 'Session not found.' });
      return;
    }

    res.status(200).json({
      attendances: session.attendances,
    });
  } catch (error) {
    console.error('Error fetching attendees:', error);
    res.status(500).json({ error: 'Failed to fetch attendees.' });
  }
};


/**
 * Get Attendance for a Particular User
 *
 * Fetches all attendance records for a specific user.
 *
 * @route   GET /api/attendance/user/:userId
 * @access  User
 */
/**
 * Get Attendance for a Particular User
 *
 * Fetches all sessions that a particular user has attended.
 *
 * @route   GET /api/attendance/user/:userId
 * @access  User
 */
/**
 * Get Attendance for a Particular User
 * 
 * Fetches all sessions that a particular user has attended.
 *
 * @route   GET /api/attendance/user/:userId
 * @access  User
 */
export const getUserAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const sessions = await Session.find({ attendees: userId })
      .populate({
        path: 'groupId',
        select: 'name description',  
      })
      .populate({
        path: 'attendees',
        select: 'username email',  
      });

    if (sessions.length === 0) {
      res.status(404).json({ error: 'No sessions found for this user.' });
      return;
    }

    res.status(200).json({
      sessions,
    });
  } catch (error) {
    console.error('Error fetching user attendance:', error);
    res.status(500).json({ error: 'Failed to fetch user attendance.' });
  }
};
