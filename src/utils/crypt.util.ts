import bcrypt from "bcrypt";

const saltRounds = 10;
const hash = async (plaintText: string) => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(plaintText, salt);
  return hash;
};

const syncHash = (plaintText: string) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(plaintText, salt);
};

const verify = async (plaintText: string, hashed: string): Promise<boolean> => {
  const match = await bcrypt.compare(plaintText, hashed);
  return match;
};

export { hash, syncHash, verify };
