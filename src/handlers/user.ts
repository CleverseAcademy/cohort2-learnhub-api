import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { RequestHandler } from "express";
import { sign } from "jsonwebtoken";
import { IUserHandler } from ".";
import {
  JWT_SECRET,
  REQUIRED_RECORD_NOT_FOUND,
  UNIQUE_CONSTRAINT_VIOLATION,
} from "../const";
import { ICredentialDto, ILoginDto } from "../dto/auth";
import { IErrorDto } from "../dto/error";
import { ICreateUserDto, IUserDto } from "../dto/user";
import { AuthStatus } from "../middleware/jwt";
import { IUserRepository } from "../repositories";
import { hashPassword, verifyPassword } from "../utils/bcrypt";
import mapToDto from "../utils/user.mapper";

export default class UserHandler implements IUserHandler {
  private repo: IUserRepository;

  constructor(repo: IUserRepository) {
    this.repo = repo;
  }
  public selfcheck: RequestHandler<
    {},
    IUserDto | IErrorDto,
    unknown,
    unknown,
    AuthStatus
  > = async (req, res) => {
    try {
      const userInfo = await this.repo.findById(res.locals.user.id);

      return res.status(200).json(mapToDto(userInfo)).end();
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .send({
          message: "Internal Server Error",
        })
        .end();
    }
  };

  public login: RequestHandler<{}, ICredentialDto | IErrorDto, ILoginDto> =
    async (req, res) => {
      const { username, password: plainPassword } = req.body;
      try {
        const { password, id } = await this.repo.findByUsername(username);

        if (!verifyPassword(plainPassword, password))
          throw new Error("Invalid username or password");

        const accessToken = sign({ id }, JWT_SECRET, {
          algorithm: "HS512",
          expiresIn: "12h",
          issuer: "learnhub-api",
          subject: "user-credential",
        });

        return res
          .status(200)
          .json({
            accessToken,
          })
          .end();
      } catch (error) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" })
          .end();
      }
    };

  public registration: RequestHandler<
    {},
    IUserDto | IErrorDto,
    ICreateUserDto
  > = async (req, res) => {
    const { name, username, password: plainPassword } = req.body;

    if (typeof name !== "string" || name.length === 0)
      return res.status(400).json({ message: "name is invalid" }).end();
    if (typeof username !== "string" || username.length === 0)
      return res.status(400).json({ message: "username is invalid" }).end();
    if (typeof plainPassword !== "string" || plainPassword.length < 5)
      return res.status(400).json({ message: "password is invalid" }).end();

    try {
      const created = await this.repo.create({
        name,
        username,
        password: hashPassword(plainPassword),
      });

      return res.status(201).json(mapToDto(created)).end();
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === UNIQUE_CONSTRAINT_VIOLATION
      )
        return res
          .status(400)
          .json({
            message: `name is invalid`,
          })
          .end();

      return res
        .status(500)
        .json({
          message: `Internal Server Error`,
        })
        .end();
    }
  };

  public getInfoByUsername: RequestHandler<
    { username: string },
    IUserDto | IErrorDto
  > = async (req, res) => {
    const { username } = req.params;
    try {
      const userInfo = await this.repo.findByUsername(username);

      return res.status(200).json(mapToDto(userInfo)).end();
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === REQUIRED_RECORD_NOT_FOUND
      )
        return res.status(404).json({ message: `User not found` }).end();

      return res.status(500).json({ message: `Internal Server Error` }).end();
    }
  };
}
