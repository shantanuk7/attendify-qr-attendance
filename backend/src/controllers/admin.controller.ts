import { Request, Response } from "express";
import UserModel from "../models/User.model";
import hashedPassword from "../utils/hashPassword";

/**
 * Add a new user (Admin only).
 * @param req - Express request object containing user details in the body.
 * @param res - Express response object to send the status and result.
 */
export const addUser = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(409).json({ error: true, message: "User already exists" });
      return;
    }
    const pass = await hashedPassword(password)
    const newUser = new UserModel({
      username,
      email,
      password: pass,
      role: "user", 
    });

    await newUser.save();

    res.status(201).json({
      error: false,
      message: "User added successfully",
    });
  } catch (error) {
    console.error("Add user error:", error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

/**
 * Get all users (Admin only).
 * @param req - Express request object.
 * @param res - Express response object to send the list of users.
 */
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await UserModel.find().select("-password"); // Exclude passwords
    res.status(200).json({
      error: false,
      data: users,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

/**
 * Get a specific user by ID (Admin only).
 * @param req - Express request object containing user ID in params.
 * @param res - Express response object to send the user data.
 */
export const getUser = async (req: Request, res: Response): Promise<void> => {
  const { userEmail } = req.params;
  try {
    const user = await UserModel.findOne({email:userEmail}).select("-password");
    if (!user) {
      res.status(404).json({ error: true, message: "User not found" });
      return;
    }

    res.status(200).json({
      error: false,
      data: user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

/**
 * Update a user's details (Admin only).
 * @param req - Express request object containing user ID in params and updates in body.
 * @param res - Express response object to send the updated user data.
 */
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { userEmail } = req.params;
  const updates = req.body;

  try {
    const user = await UserModel.findOneAndUpdate(
      {email:userEmail},
      { $set: updates },
      { new: true }
    ).select("-password");

    if (!user) {
      res.status(404).json({ error: true, message: "User not found" });
      return;
    }

    res.status(200).json({
      error: false,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

/**
 * Delete a user by ID (Admin only).
 * @param req - Express request object containing user ID in params.
 * @param res - Express response object to send the deletion status.
 */
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { userEmail } = req.params;

  try {
    const user = await UserModel.findOneAndDelete({email:userEmail});
    if (!user) {
      res.status(404).json({ error: true, message: "User not found" });
      return;
    }

    res.status(200).json({
      error: false,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};
