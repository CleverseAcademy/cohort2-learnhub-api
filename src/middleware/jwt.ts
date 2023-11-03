import { RequestHandler } from "express";
import { JsonWebTokenError, JwtPayload, verify } from "jsonwebtoken";
import { JWT_SECRET } from "../const";
import { IUserRepository } from "../repositories";
import { verifyPassword } from "../utils/bcrypt";

export interface AuthStatus {
  user: { id: string; username: string };
}

export default class JWTMiddleware {
  private repo: IUserRepository;

  constructor(repo: IUserRepository) {
    this.repo = repo;
  }

  auth: RequestHandler<unknown, unknown, unknown, unknown, AuthStatus> = async (
    req,
    res,
    next
  ) => {
    try {
      const token = req.header("Authorization")!.replace("Bearer ", "").trim();

      const { id, username, jti } = verify(token, JWT_SECRET) as JwtPayload;

      const { password, lastLogin } = await this.repo.findByUsername(username);

      if (!verifyPassword(`${+lastLogin}${password}`, atob(jti!)))
        throw new JsonWebTokenError("jti property is invalid");

      res.locals = {
        user: {
          id,
          username,
        },
      };

      return next();
    } catch (error) {
      console.error(error);

      if (error instanceof TypeError)
        return res.status(401).send("Authorization header is expected").end();
      if (error instanceof JsonWebTokenError)
        return res.status(403).send("Token is invalid").end();

      return res.status(500).send("Internal Server Error").end();
    }
  };
}
