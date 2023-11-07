import { IUserDto } from "../dto/user";
import { IUser } from "../repositories";

export default ({ registeredAt, id, name, username }: IUser): IUserDto => ({
  id,
  name,
  username,
  registeredAt: registeredAt.toISOString(),
});
