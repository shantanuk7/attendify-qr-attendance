import jwt from "jsonwebtoken";

const generateToken = (username: string, email: string, id: string) => {
  const jwtSecretKey = process.env.JWT_SECRET;
  const data = {
    time: Date().toString(),
    username: username,
    email: email,
    id: id,
  };
  const token = jwt.sign(data, jwtSecretKey!);
  return token;
};

export default generateToken;
