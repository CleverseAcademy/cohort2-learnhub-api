import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { RequestHandler } from "express";
import { IContentHandler } from ".";
import { IContentDto, IContentsDto, ICreateContentDto } from "../dto/content";
import { IErrorDto } from "../dto/error";
import { AuthStatus } from "../middleware/jwt";
import { IContentRepository } from "../repositories";
import mapToDto from "../utils/content.mapper";
import oembedVideo from "../utils/oembed";

export default class ContentHandler implements IContentHandler {
  private repo: IContentRepository;
  constructor(repo: IContentRepository) {
    this.repo = repo;
  }

  getAll: RequestHandler<{}, IContentsDto> = async (req, res) => {
    const contents = await this.repo.getAll();

    const contentListDto = contents.map<IContentDto>(mapToDto);

    return res.status(200).json({ data: contentListDto }).end();
  };

  create: RequestHandler<
    {},
    IContentDto | IErrorDto,
    ICreateContentDto,
    undefined,
    AuthStatus
  > = async (req, res) => {
    const { comment, rating, videoUrl } = req.body;

    if (rating < 0 || rating > 5)
      return res.status(400).json({
        message: "rating is out of range",
      });

    try {
      const { authorName, authorUrl, thumbnailUrl, title } = await oembedVideo(
        videoUrl
      );

      const data = await this.repo.create(res.locals.user.id, {
        comment,
        rating,
        videoUrl,
        creatorName: authorName,
        creatorUrl: authorUrl,
        thumbnailUrl: thumbnailUrl,
        videoTitle: title,
      });

      return res.status(201).json(mapToDto(data)).end();
    } catch (error) {
      console.error(error);

      if (error instanceof URIError)
        return res.status(400).json({ message: error.message }).end();

      return res.status(500).json({ message: "Internal Server Error" }).end();
    }
  };

  getById: RequestHandler<{ id: string }, IContentDto | IErrorDto> = async (
    req,
    res
  ) => {
    const { id } = req.params;
    const numericId = Number(id);

    if (isNaN(numericId))
      return res
        .status(400)
        .json({
          message: "id is invalid",
        })
        .end();

    const content = await this.repo.getById(numericId);

    return res.status(200).json(mapToDto(content)).end();
  };

  deleteById: RequestHandler<
    { id: string },
    IContentDto | IErrorDto,
    undefined,
    undefined,
    AuthStatus
  > = async (req, res) => {
    try {
      const { id } = req.params;

      const numericId = Number(id);

      if (isNaN(numericId)) throw new TypeError("Id is not number");

      const {
        User: { id: ownerId },
      } = await this.repo.getById(numericId);

      if (ownerId !== res.locals.user.id)
        throw new Error("Requested content is forbidden");

      const deletedContent = await this.repo.deleteById(numericId);

      return res.status(200).json(mapToDto(deletedContent)).end();
    } catch (error) {
      console.log(error);

      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2025"
      )
        return res.status(410).json({ message: "Content not found" }).end();

      if (error instanceof TypeError)
        return res.status(400).json({ message: error.message }).end();

      if (error instanceof Error)
        return res
          .status(403)
          .json({ message: `${error.message}` })
          .end();

      return res.status(500).send({ message: "Internal Server Error" }).end();
    }
  };
}
