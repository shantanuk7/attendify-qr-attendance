import { Request,Response } from "express";

export const signup = async (req:Request,res:Response) : Promise<void> =>{
    const {username,email,password} = req.body
    
}