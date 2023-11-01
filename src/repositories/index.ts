import { ICreateUserDto } from "../dto/user";

export interface IUser {
  id: string;
  username: string;
  name: string;
  registeredAt: Date;
}

type CreationErrorType = "UNIQUE";

export class UserCreationError extends Error {
  constructor(
    public readonly type: CreationErrorType,
    public readonly column: string
  ) {
    super();
  }
}

// export interface IUserExtended
//   extends Pick<User, "id" | "name" | "username" | "registeredAt"> {}

export interface IUserRepository {
  create(user: ICreateUserDto): Promise<IUser>;
}
