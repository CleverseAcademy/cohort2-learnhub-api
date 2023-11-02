import { RequestHandler } from "express";
import { ICredentialDto, ILoginDto } from "../dto/auth";
import { IContentDto, ICreateContentDto } from "../dto/content";
import { IErrorDto } from "../dto/error";
import { ICreateUserDto, IUserDto } from "../dto/user";
import { AuthStatus } from "../middleware/jwt";

export interface IUserHandler {
  registration: RequestHandler<{}, IUserDto | IErrorDto, ICreateUserDto>;
  login: RequestHandler<{}, ICredentialDto | IErrorDto, ILoginDto>;
  getPersonalInfo: RequestHandler<
    {},
    IUserDto | IErrorDto,
    unknown,
    unknown,
    AuthStatus
  >;
}

export interface IContentHandler {
  create: RequestHandler<
    {},
    IContentDto | IErrorDto,
    ICreateContentDto,
    undefined,
    AuthStatus
  >;
  getAll: RequestHandler<{}, { data: IContentDto[] }>;
  getById: RequestHandler<{ id: string }, IContentDto | IErrorDto>;
}
