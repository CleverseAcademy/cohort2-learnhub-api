import { PrismaClient, User } from "@prisma/client";
import { IUser, IUserRepository } from ".";
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

  public async updateLastLogin(id: string, ts?: Date): Promise<User> {
    return await this.prisma.user.update({
      data: {
        lastLogin: ts ?? new Date(),
      },
      where: { id },
    });
  }

  public async getFullInfoById(id: string): Promise<User> {
    return await this.prisma.user.findUniqueOrThrow({
      where: { id },
    });
  }
}
