import { Request, Response } from 'express';
import Session from '../models/Session.model'; 
import UserModel from '../models/User.model';

import { v4 as uuidv4 } from 'uuid';
import GroupModel from '../models/Group.model';

/**
 * @desc    Create a new session
 * @route   POST /api/admin/create-session
 * @access  Admin
 */
export const createSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { expiryTime, groupId } = req.body;
    const createdByEmail = req.user?.email;

    if (!expiryTime || !groupId || !createdByEmail) {
      res.status(400).json({ error: 'expiryTime, groupId, and createdBy are required.' });
      return;
    }

    const user = await UserModel.findOne({ email: createdByEmail });
    if (!user) {
      res.status(400).json({ error: 'Admin user not found.' });
      return;
    }
    const group = await GroupModel.findOne({ _id: groupId, createdBy: user._id });
    if (!group) {
      res.status(403).json({ error: 'You are not authorized to create a session for this group.' });
      return;
    }

    const qrCode = uuidv4();

    const session = new Session({
      groupId,
      expiryTime: new Date(expiryTime),
      createdBy: user._id,
      qrCode,
    });

    await session.save();

    res.status(201).json({
      message: 'Session created successfully.',
      session: session._id,
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
    const createdByEmail = req.user?.email;

    if (!createdByEmail) {
      res.status(400).json({ error: 'Admin email is required.' });
      return;
    }
    const admin = await UserModel.findOne({ email: createdByEmail });
    if (!admin) {
      res.status(404).json({ error: 'Admin not found.' });
      return;
    }

    const sessions = await Session.find({ createdBy: admin._id })
      .populate('createdBy', 'username email')
      .populate({
        path: 'groupId', 
        select: 'name description members', 
        populate: {
          path: 'members',  
          model: 'User',
          select: 'username email',
        },
      });

    if (!sessions.length) {
      res.status(404).json({ message: 'No sessions found for this admin.' });
      return;
    }

    res.status(200).json({
      message: 'Sessions fetched successfully.',
      sessions,
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions.' });
  }
};