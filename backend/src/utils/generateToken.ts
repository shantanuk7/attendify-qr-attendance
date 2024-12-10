import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET_KEY: string | undefined = process.env.JWT_SECRET;
console.log("JWT" + JWT_SECRET_KEY);
if (!JWT_SECRET_KEY) {
  console.error("JWT_SECRET is missing. Please set it in your environment.");
  process.exit(1);
}

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

/**
 * Generate JWT Token
 * @param id - User's id
 * @param email - User's email
 * @param role - User's role (admin, user, etc.)
 * @returns - Signed JWT token
 */
const generateToken = (id: string, email: string, role: string): string => {
  const payload: TokenPayload = {
    id,
    email,
    role,
  };

  const options = { expiresIn: "1h" };

  try {
    const token = jwt.sign(payload, JWT_SECRET_KEY!, options);
    return token;
  } catch (err: any) {
    console.error("Error generating token:", err.message);
    throw new Error("Could not generate token.");
  }
};

export default generateToken;
