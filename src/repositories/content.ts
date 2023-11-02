import { Prisma, PrismaClient } from "@prisma/client";
import { IContent, IContentRepository, ICreateContent } from ".";
import { DEFAULT_USER_FIELDS } from "./user";

const INCLUDE_OWNERS: Prisma.ContentInclude = {
  User: {
    select: DEFAULT_USER_FIELDS,
  },
};

export default class ContentRepository implements IContentRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  getAll(): Promise<IContent[]> {
    return this.prisma.content.findMany({
      include: INCLUDE_OWNERS,
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
      include: INCLUDE_OWNERS,
    });
  }
}
