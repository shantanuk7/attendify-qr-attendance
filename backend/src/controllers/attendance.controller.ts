import { Request, Response } from "express";
import Attendance from "../models/Attendance.model";
import Session from "../models/Session.model";
import User from "../models/User.model";
import { tuple } from "zod";

/**
 * Mark Attendance
 *
 * Marks the attendance for a user by validating the session QR code and user eligibility.
 *
 * @route   POST /api/attendance/mark
 * @access  User
 */
export const markAttendance = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { qrCode, userId } = req.body;

    if (!qrCode || !userId) {
      res.status(400).json({ message: "QR code and userId are required." });
      return;
    }

    const session = await Session.findOne({ qrCode });
    if (!session) {
      res.status(404).json({ message: "Invalid QR code." });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    const existingAttendance = await Attendance.findOne({
      sessionId: session._id,
      userId: user._id,
    });
    if (existingAttendance) {
      res
        .status(400)
        .json({ message: "Attendance already marked for this session." });
      return;
    }

    // Record the attendance
    const attendance = new Attendance({
      sessionId: session._id,
      userId: user._id,
    });

    await attendance.save();
    res.status(201).json({ message: "Attendance marked successfully." });
    return;
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
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
export const getUserAttendance = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({ message: "UserId is required." });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const attendanceRecords = await Attendance.find({ userId })
      .populate("sessionId", "qrCode date")
      .exec();

    res.status(200).json({
      message: "Attendance records fetched successfully.",
      data: attendanceRecords,
    });
    return;
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
