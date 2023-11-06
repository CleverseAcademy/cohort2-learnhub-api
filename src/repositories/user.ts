import { PrismaClient, User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { IBlacklist, IUser, IUserRepository } from ".";
import { DEFAULT_USER_SELECT } from "../const";
import { ICreateUserDto } from "../dto/user";

export default class UserRepository implements IUserRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public async create(user: ICreateUserDto): Promise<IUser> {
    return await this.prisma.user.create({
      data: user,
      select: DEFAULT_USER_SELECT,
    });
  }

  public async findByUsername(username: string): Promise<User> {
    return await this.prisma.user.findUniqueOrThrow({
      where: { username },
    });
  }

  public async findById(id: string): Promise<IUser> {
    return await this.prisma.user.findUniqueOrThrow({
      select: DEFAULT_USER_SELECT,
      where: { id },
    });
  }

  public async addToBlacklist(token: string, exp?: Date): Promise<IBlacklist> {
    return await this.prisma.blacklist.create({
      data: { token, exp },
    });
  }

  public async isAlreadyBlacklisted(token: string): Promise<boolean> {
    try {
      await this.prisma.blacklist.findUniqueOrThrow({
        where: { token },
      });

      return true;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2025"
      )
        return false;

      console.error(error);
      throw error;
    }
  }
}
