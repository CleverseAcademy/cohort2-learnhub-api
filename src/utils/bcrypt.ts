import { compareSync, genSaltSync, hashSync } from "bcryptjs";
import { DEFAULT_BCRYPT_NUMBER_OF_ROUNDS } from "../const";

export const hashPassword = (
  plaintext: string,
  round: number = DEFAULT_BCRYPT_NUMBER_OF_ROUNDS
): string => {
  const salt = genSaltSync(round);

  return hashSync(plaintext, salt);
};

export const verifyPassword = (plaintext: string, hashVal: string): boolean =>
  compareSync(plaintext, hashVal);
