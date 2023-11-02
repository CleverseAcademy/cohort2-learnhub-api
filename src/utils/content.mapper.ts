import { IContentDto } from "../dto/content";
import { IContent } from "../repositories";

export default ({
  User: { registeredAt, ...otherUserInfo },
  ...content
}: IContent): IContentDto => ({
  ...content,
  postedBy: {
    ...otherUserInfo,
    registeredAt: registeredAt.toISOString(),
  },
});
