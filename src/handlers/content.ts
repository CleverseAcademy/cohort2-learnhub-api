import { RequestHandler } from "express";
import { IContentHandler } from ".";
import { IContentDto, ICreateContentDto } from "../dto/content";
import { IErrorDto } from "../dto/error";
import { AuthStatus } from "../middleware/jwt";
import { IContentRepository } from "../repositories";
import { getOEmbedInfo } from "../utils/oembed";

export default class ContentHandler implements IContentHandler {
  private repo: IContentRepository;
  constructor(repo: IContentRepository) {
    this.repo = repo;
  }
  create: RequestHandler<
    {},
    IContentDto | IErrorDto,
    ICreateContentDto,
    undefined,
    AuthStatus
  > = async (req, res) => {
    const { rating, videoUrl, comment } = req.body;

    if (rating > 5 || rating < 0)
      return res.status(400).json({ message: "rating is out of range 0-5" })
        .send;

    const { author_name, author_url, thumbnail_url, title } =
      await getOEmbedInfo(videoUrl);

    const {
      User: { registeredAt, ...userData },
      ...contentData
    } = await this.repo.create(res.locals.user.id, {
      rating,
      videoUrl,
      comment,
      creatorName: author_name,
      creatorUrl: author_url,
      thumbnailUrl: thumbnail_url,
      videoTitle: title,
    });

    return res
      .status(201)
      .json({
        ...contentData,
        postedBy: {
          ...userData,
          registeredAt: registeredAt.toISOString(),
        },
      })
      .end();
  };
}
