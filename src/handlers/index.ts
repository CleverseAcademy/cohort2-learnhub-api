import { RequestHandler } from "express";
import { ICredentialDto, ILoginDto } from "../dto/auth";
import {
  IContentDto,
  ICreateContentDto,
  IUpdateContentDto,
} from "../dto/content";
import { IErrorDto } from "../dto/error";
import { ICreateUserDto, IUserDto } from "../dto/user";
import { AuthStatus } from "../middleware/jwt";

export interface IUserHandler {
  registration: RequestHandler<{}, IUserDto | IErrorDto, ICreateUserDto>;
  login: RequestHandler<{}, ICredentialDto | IErrorDto, ILoginDto>;
  selfcheck: RequestHandler<
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
  updateById: RequestHandler<
    { id: string },
    IContentDto | IErrorDto,
    IUpdateContentDto,
    undefined,
    AuthStatus
  >;
  deleteById: RequestHandler<
    { id: string },
    IContentDto | IErrorDto,
    undefined,
    undefined,
    AuthStatus
  >;
}
