import { Request, Response } from 'express';
import Group from '../models/Group.model';

/**
 * Create a new group.
 * 
 * @param req - The HTTP request object containing group details in the body.
 * @param res - The HTTP response object to send back the result.
 * @returns A JSON response indicating success or failure.
 */
export const createGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, createdBy } = req.body;

    // Validate required fields
    if (!name || !createdBy) {
      res.status(400).json({ error: 'Name and createdBy fields are required' });
      return;
    }

    // Create and save the new group
    const newGroup = new Group({ name, description, createdBy });
    await newGroup.save();

    res.status(201).json({ message: 'Group created successfully', group: newGroup });
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Retrieve all groups.
 * 
 * @param req - The HTTP request object.
 * @param res - The HTTP response object to send back the groups.
 * @returns A JSON response with a list of groups or an error message.
 */
export const getGroups = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch all groups from the database
    const groups = await Group.find().populate('createdBy', 'username email');

    res.status(200).json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
