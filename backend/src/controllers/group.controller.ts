import { Request, Response } from 'express';
import Group from '../models/Group.model';
import User from '../models/User.model'; 
import {jwtDecode} from "jwt-decode";
/**
 * Create a new group.
 * 
 * @param req - The HTTP request object containing group details in the body.
 * @param res - The HTTP response object to send back the result.
 * @returns A JSON response indicating success or failure.
 */
export const createGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({ error: "Name is required" });
      return;
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Authorization token is missing or invalid" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwtDecode<{ id: string }>(token); 

    const createdBy = decoded.id; 

    const newGroup = new Group({ name, description, createdBy });
    await newGroup.save();

    res.status(201).json({ message: "Group created successfully", group: newGroup });
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ error: "Internal server error" });
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

/**
 * Add a user to a group.
 * 
 * @param req - The HTTP request object containing `groupId` and `userId` in the body.
 * @param res - The HTTP response object to send back the result.
 * @returns A JSON response indicating success or failure.
 */
export const addUserToGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { groupId, userId } = req.body;

    if (!groupId || !userId) {
      res.status(400).json({ error: 'Group ID and User ID are required' });
      return;
    }

    const group = await Group.findById(groupId);
    if (!group) {
      res.status(404).json({ error: 'Group not found' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    group.members.push(userId);
    await group.save();

    res.status(200).json({ message: 'User added to group successfully', group });
  } catch (error) {
    console.error('Error adding user to group:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
