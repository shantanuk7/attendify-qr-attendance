import { Request, Response } from 'express';
import Session from '../models/Session.model'; // Assuming your session model file name
import mongoose from 'mongoose';

/**
 * @desc    Create a new session with a QR code
 * @route   POST /api/admin/create-session
 * @access  Admin
 */
export const createSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { qrCode, date } = req.body;

    if (!qrCode) {
      res.status(400).json({ error: 'QR code is required.' });
      return;
    }

    // Create new session
    const session = new Session({
      qrCode,
      date: date || new Date(),
    });

    await session.save();

    res.status(201).json({
      message: 'Session created successfully.',
      session,
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session.' });
  }
};

/**
 * @desc    Get all sessions
 * @route   GET /api/admin/get-sessions
 * @access  Admin
 */
export const getSessions = async (req: Request, res: Response): Promise<void> => {
  try {
    const sessions = await Session.find();

    res.status(200).json({
      message: 'Sessions fetched successfully.',
      sessions,
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions.' });
  }
};
