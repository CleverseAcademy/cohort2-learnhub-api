import { RequestHandler } from "express";
import { API_VERSION } from "../const";

export default class VersionMiddleware {
  constructor() {}

  version: RequestHandler = (req, res, next) => {
    res.setHeader("X-Version", API_VERSION)
    return next()
  }
}