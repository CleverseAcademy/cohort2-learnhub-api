import { PrismaClient } from "@prisma/client";
import express from "express";
import { RedisClientType, createClient } from "redis";
import { REDIS_URL } from "./const";
import { IContentHandler } from "./handlers";
import ContentHandler from "./handlers/content";
import UserHandler from "./handlers/user";
import JWTMiddleware from "./middleware/jwt";
import { IContentRepository } from "./repositories";
import BlacklistRepository from "./repositories/blacklist";
import ContentRepository from "./repositories/content";
import UserRepository from "./repositories/user";

const PORT = Number(process.env.PORT || 8888);
const app = express();
const clnt = new PrismaClient();
const redisClnt: RedisClientType = createClient({
  url: REDIS_URL,
});

clnt
  .$connect()
  .then(() => redisClnt.connect())
  .catch((err) => {
    console.error("Error", err);
  });

const blacklistRepo = new BlacklistRepository(redisClnt);

const userRepo = new UserRepository(clnt);
const contentRepo: IContentRepository = new ContentRepository(clnt);

const userHandler = new UserHandler(userRepo, blacklistRepo);
const contentHandler: IContentHandler = new ContentHandler(contentRepo);

const jwtMiddleware = new JWTMiddleware(blacklistRepo);

app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).send("Welcome to LearnHub").end();
});

const userRouter = express.Router();

app.use("/user", userRouter);

userRouter.post("/", userHandler.registration);
userRouter.get("/:username", userHandler.getInfoByUsername);

const authRouter = express.Router();

app.use("/auth", authRouter);

authRouter.post("/login", userHandler.login);
authRouter.get("/logout", jwtMiddleware.auth, userHandler.logout);
authRouter.get("/me", jwtMiddleware.auth, userHandler.getPersonalInfo);

const contentRouter = express.Router();

app.use("/content", contentRouter);

contentRouter.get("/", contentHandler.getAll);
contentRouter.get("/:id", contentHandler.getById);
contentRouter.post("/", jwtMiddleware.auth, contentHandler.create);
contentRouter.patch("/:id", jwtMiddleware.auth, contentHandler.updateById);
contentRouter.delete("/:id", jwtMiddleware.auth, contentHandler.deleteById);

app.listen(PORT, () => {
  console.log(`LearnHub API v+0.0.5 is up at ${PORT}`);
});
