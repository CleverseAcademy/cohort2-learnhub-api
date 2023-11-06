import { RequestHandler } from "express";
import { ICredentialDto, ILoginDto } from "../dto/auth";
import {
  IContentDto,
  IContentsDto,
  ICreateContentDto,
  IUpdateContentDto,
} from "../dto/content";
import { IErrorDto } from "../dto/error";
import { ICreateUserDto, IUserDto } from "../dto/user";
import { AuthStatus } from "../middleware/jwt";

export interface IUserHandler {
  registration: RequestHandler<{}, IUserDto | IErrorDto, ICreateUserDto>;
  login: RequestHandler<{}, ICredentialDto | IErrorDto, ILoginDto>;
  logout: RequestHandler<{}, IErrorDto, undefined, undefined, AuthStatus>;
  getPersonalInfo: RequestHandler<
    {},
    IUserDto | IErrorDto,
    unknown,
    unknown,
    AuthStatus
  >;
  getByUsername: RequestHandler<{ username: string }, IUserDto | IErrorDto>;
}

export interface ID {
  id: string;
}

export interface IContentHandler {
  create: RequestHandler<
    {},
    IContentDto | IErrorDto,
    ICreateContentDto,
    undefined,
    AuthStatus
  >;
  getAll: RequestHandler<{}, IContentsDto>;
  getById: RequestHandler<ID, IContentDto | IErrorDto>;
  deleteById: RequestHandler<
    ID,
    IContentDto | IErrorDto,
    undefined,
    undefined,
    AuthStatus
  >;
  updateById: RequestHandler<
    ID,
    IContentDto | IErrorDto,
    IUpdateContentDto,
    undefined,
    AuthStatus
  >;
}
