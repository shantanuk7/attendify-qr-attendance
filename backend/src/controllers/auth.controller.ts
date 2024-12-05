import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import UserModel from "../models/User.model";
import generateToken from "../utils/generateToken";

/**
 * Sign Up Controller
 * @param req - Express request object
 * @param res - Express response object
 */
export const signup = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password, role } = req.body;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(409).json({ error: true, message: "User already exists" });
      return;
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await newUser.save();

    // Generate a JWT token
    const token = generateToken(newUser.id, newUser.email, newUser.role);

    res.status(201).json({
      error: false,
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

/**
 * Sign In Controller
 * @param req - Express request object
 * @param res - Express response object
 */
export const signin = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      res
        .status(404)
        .json({ error: true, message: "Invalid email or password" });
      return;
    }

    // Compare passwords
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      res
        .status(401)
        .json({ error: true, message: "Invalid email or password" });
      return;
    }

    // Generate a JWT token
    const token = generateToken(user.id, user.email, user.role);

    res.status(200).json({
      error: false,
      message: "User signed in successfully",
      token,
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};
