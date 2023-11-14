import { RequestHandler } from "express";
import { JsonWebTokenError, JwtPayload, verify } from "jsonwebtoken";
import { JWT_SECRET, getAuthToken } from "../const";
import { IBlacklistRepository } from "../repositories";

export interface AuthStatus {
  user: { id: string };
}

export default class JWTMiddleware {
  private blacklistRepo: IBlacklistRepository;
  constructor(userRepo: IBlacklistRepository) {
    this.blacklistRepo = userRepo;
  }

  auth: RequestHandler<unknown, unknown, unknown, unknown, AuthStatus> = async (
    req,
    res,
    next
  ) => {
    try {
      const authHeader = req.header("Authorization");

      if (!authHeader) throw new TypeError("Authorization header is missing");

      const token = getAuthToken(authHeader);

      const isBlacklisted = await this.blacklistRepo.isAlreadyBlacklisted(
        token
      );
      if (isBlacklisted)
        throw new JsonWebTokenError(`Token: ${token} is blacklisted`);

      const { id } = verify(token, JWT_SECRET) as JwtPayload;

      res.locals = {
        user: {
          id,
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
