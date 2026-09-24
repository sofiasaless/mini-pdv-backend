import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
  const hash = await bcrypt.hash(password, 10);
  return hash;
};

export const comparePassword = async (
  password: string,
  passwordToCompare: string,
) => {
  const result = await bcrypt.compare(password, passwordToCompare);
  return result;
};
