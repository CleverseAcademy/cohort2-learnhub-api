import { Content, User } from "@prisma/client";
import { ICreateUserDto } from "../dto/user";

export interface IUser {
  id: string;
  username: string;
  name: string;
  registeredAt: Date;
}

export interface ICreateContent
  extends Omit<Content, "ownerId" | "id" | "createdAt" | "updatedAt"> {}

export interface IContent extends Content {
  User: IUser;
}

// export interface IUserExtended
//   extends Pick<User, "id" | "name" | "username" | "registeredAt"> {}

export interface IUserRepository {
  create(user: ICreateUserDto): Promise<IUser>;
  findByUsername(username: string): Promise<User>;
  findById(id: string): Promise<IUser>;
}

export interface IContentRepository {
  create(ownerId: string, content: ICreateContent): Promise<IContent>;
  getAll(): Promise<IContent[]>;
  getById(id: number): Promise<IContent>;
}
