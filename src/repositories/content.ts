import { PrismaClient } from "@prisma/client";
import { IContent, IContentRepository, ICreateContent } from ".";
import { DEFAULT_USER_SELECT } from "../const";

export default class ContentRepository implements IContentRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  getAll(): Promise<IContent[]> {
    return this.prisma.content.findMany({
      include: {
        User: {
          select: DEFAULT_USER_SELECT,
        },
      },
    });
  }

  getById(id: number): Promise<IContent> {
    return this.prisma.content.findUniqueOrThrow({
      where: { id },
      include: INCLUDE_OWNERS,
    });
  }

  create(ownerId: string, content: ICreateContent): Promise<IContent> {
    return this.prisma.content.create({
      data: {
        ...content,
        User: {
          connect: { id: ownerId },
        },
      },
      include: {
        User: {
          select: DEFAULT_USER_SELECT,
        },
      },
    });
  }
}
