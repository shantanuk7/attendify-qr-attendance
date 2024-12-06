import bcryptjs from "bcryptjs";

const hashedPassword = async (password: string) : Promise<string> => {
  const salt = await bcryptjs.genSalt(10);
  return await bcryptjs.hash(password, salt);
 
};

export default hashedPassword