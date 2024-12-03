import { Request, Response } from "express";
import connect from "../config/dbCOnfig";
import UserModel from "../models/User.model";
import bcryptjs from "bcryptjs";


connect();

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  try {
   
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(409).send({
        error: true,
        message: "User already exists",
      });
      return;
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

  
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).send({
      error: false,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).send({
      error: true,
      message: "An error occurred during signup",
    });
  }
};
