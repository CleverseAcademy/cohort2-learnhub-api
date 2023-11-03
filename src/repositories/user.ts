import { Prisma, PrismaClient, User } from "@prisma/client";
import { IUser, IUserRepository } from ".";
import { ICreateUserDto } from "../dto/user";

export const DEFAULT_USER_FIELDS: Prisma.UserSelect = {
  id: true,
  name: true,
  username: true,
  registeredAt: true,
};

export default class UserRepository implements IUserRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public async create(user: ICreateUserDto): Promise<IUser> {
    return await this.prisma.user.create({
      data: user,
      select: DEFAULT_USER_FIELDS,
    });
  }

  public async findByUsername(username: string): Promise<User> {
    return await this.prisma.user.findUniqueOrThrow({
      where: { username },
    });
  }

  public async findById(id: string): Promise<IUser> {
    return await this.prisma.user.findUniqueOrThrow({
      select: DEFAULT_USER_FIELDS,
      where: { id },
    });
  }

  public async updateLastLogin(id: string, ts: Date): Promise<IUser> {
    return await this.prisma.user.update({
      data: { lastLogin: ts },
      select: DEFAULT_USER_FIELDS,
      where: { id },
    });
  }
}
