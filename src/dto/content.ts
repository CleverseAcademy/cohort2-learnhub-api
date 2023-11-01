import { Content } from "@prisma/client";
import { IUserDto } from "./user";

export interface ICreateContentDto {
  videoUrl: string;
  comment: string;
  rating: number;
}

export interface IContentDto extends Omit<Content, "ownerId" | "id"> {
  postedBy: IUserDto;
}
