import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import UserModel from "../models/User.model";
import generateToken from "../utils/generateToken";
import hashedPassword from "../utils/hashPassword";

/**
 * Sign Up Controller - Only Admins can signup and add users.
 * @param req - Express request object
 * @param res - Express response object
 */
export const signup = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password, role } = req.body;

  try {
    const existingAdmin = await UserModel.findOne({ email });

    if (existingAdmin) {
      res.status(403).json({ error: true, message: "Usere Already Exisit" });
      return;
    }
    console.log("Passwod" + password +" " + typeof(password))
    const pass = await hashedPassword(password);
    console.log(pass)
    const newAdmin = new UserModel({
      username,
      email,
      password: pass,
      role: "admin",
    });

    await newAdmin.save();

    const token = generateToken(newAdmin.id, newAdmin.email, newAdmin.role);

    res.status(201).json({
      error: false,
      message: "Admin registered successfully",
      token,
      role: "admin",
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

/**
 * Sign In Controller - Only existing users added by admin can login.
 * @param req - Express request object
 * @param res - Express response object
 */
export const signin = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(401).json({ error: true, message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ error: true, message: "Invalid credentials" });
      return;
    }

    const token = generateToken(user.id, user.email, user.role);
    if (user.role == "admin") {
      res.status(200).json({
        error: false,
        message: "User signed in successfully",
        token,
        role: "admin",
      });
      return;
    }
    res.status(200).json({
      error: false,
      message: "User signed in successfully",
      token,
      role: "user",
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};
