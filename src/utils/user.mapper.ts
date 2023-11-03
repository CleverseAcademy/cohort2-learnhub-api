import { IUserDto } from "../dto/user";
import { IUser } from "../repositories";

export default ({ registeredAt, ...others }: IUser): IUserDto => ({
  ...others,
  registeredAt: registeredAt.toISOString(),
});
