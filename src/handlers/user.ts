import { RequestHandler } from "express";
import { IUserHandler } from ".";
import { IErrorDto } from "../dto/error";
import { ICreateUserDto, IUserDto } from "../dto/user";
import { IUserRepository, UserCreationError } from "../repositories";
import { hashPassword } from "../utils/bcrypt";

export default class UserHandler implements IUserHandler {
  private repo: IUserRepository;

  constructor(repo: IUserRepository) {
    this.repo = repo;
  }

  public registration: RequestHandler<
    {},
    IUserDto | IErrorDto,
    ICreateUserDto
  > = async (req, res) => {
    const { name, username, password: plainPassword } = req.body;

    if (typeof name !== "string" || name.length === 0)
      return res.status(400).json({ message: "name is invalid" });
    if (typeof username !== "string" || username.length === 0)
      return res.status(400).json({ message: "username is invalid" });
    if (typeof plainPassword !== "string" || plainPassword.length < 5)
      return res.status(400).json({ message: "password is invalid" });

    try {
      const {
        id: registeredId,
        name: registeredName,
        registeredAt,
        username: registeredUsername,
      } = await this.repo.create({
        name,
        username,
        password: hashPassword(plainPassword),
      });

      return res
        .status(201)
        .json({
          id: registeredId,
          name: registeredName,
          registeredAt: `${registeredAt}`,
          username: registeredUsername,
        })
        .end();
    } catch (error) {
      if (error instanceof UserCreationError) {
        return res.status(500).json({
          message: `${error.column} is invalid`,
        });
      }
      return res.status(500).json({
        message: `Internal Server Error`,
      });
    }
  };
}
