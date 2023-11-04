import { createHash } from "crypto";

export const b64sha256 = (data: string): string => {
  const hash = createHash("sha256");

  hash.update(data);

  return hash.digest("base64");
};
