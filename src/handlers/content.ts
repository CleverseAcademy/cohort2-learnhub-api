import { RequestHandler } from "express";
import { IContentHandler } from ".";
import {
  IContentDto,
  ICreateContentDto,
  IUpdateContentDto,
} from "../dto/content";
import { IErrorDto } from "../dto/error";
import { AuthStatus } from "../middleware/jwt";
import { IContentRepository } from "../repositories";
import mapper from "../utils/content.mapper";
import { getOEmbedInfo } from "../utils/oembed";

export default class ContentHandler implements IContentHandler {
  private repo: IContentRepository;
  constructor(repo: IContentRepository) {
    this.repo = repo;
  }

  getAll: RequestHandler<{}, { data: IContentDto[] }> = async (req, res) => {
    const contents = await this.repo.getAll();

    const mappedToDto = contents.map<IContentDto>(mapper);

    return res.status(200).json({ data: mappedToDto }).end();
  };

  getById: RequestHandler<{ id: string }, IContentDto | IErrorDto> = async (
    req,
    res
  ) => {
    const { id } = req.params;

    const numericId = Number(id);
    if (isNaN(numericId))
      return res.status(400).json({ message: "id is invalid" }).end();

    const content = await this.repo.getById(numericId);
    return res.status(200).json(mapper(content)).end();
  };

  updateById: RequestHandler<
    { id: string },
    IContentDto | IErrorDto,
    IUpdateContentDto,
    undefined,
    AuthStatus
  > = async (req, res) => {
    const { id } = req.params;
    const { comment, rating } = req.body;

    const numericId = Number(id);

    if (isNaN(numericId))
      return res.status(400).json({ message: "id is invalid" }).end();

    const ownerId = await this.repo.getOwnerId(numericId);

    if (ownerId !== res.locals.user.id)
      return res
        .status(403)
        .json({ message: "You're not the owner of this content" })
        .end();

    const content = await this.repo.updateById(numericId, { comment, rating });
    return res.status(200).json(mapper(content)).end();
  };

  create: RequestHandler<
    {},
    IContentDto | IErrorDto,
    ICreateContentDto,
    undefined,
    AuthStatus
  > = async (req, res) => {
    const { rating, videoUrl, comment } = req.body;

    if (rating > 5 || rating < 0)
      return res
        .status(400)
        .json({ message: "rating is out of range 0-5" })
        .end();

    const { author_name, author_url, thumbnail_url, title } =
      await getOEmbedInfo(videoUrl);

    const content = await this.repo.create(res.locals.user.id, {
      rating,
      videoUrl,
      comment,
      creatorName: author_name,
      creatorUrl: author_url,
      thumbnailUrl: thumbnail_url,
      videoTitle: title,
    });

    return res.status(201).json(mapper(content)).end();
  };
}
