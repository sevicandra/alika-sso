import bcrypt from "bcrypt";

const saltRounds = 10;
const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

const syncHashPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
};

const verifyPassword = async (password: string, hashed: string) => {
  const match = await bcrypt.compare(password, hashed);
  return match;
};

export { hashPassword, verifyPassword, syncHashPassword };
