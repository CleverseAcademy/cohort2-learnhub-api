import { IContentDto } from "../dto/content";
import { IContent } from "../repositories";

const mapToDto = ({
  User: { registeredAt, ...userInfo },
  createdAt,
  updatedAt,
  ...contentInfo
}: IContent): IContentDto => ({
  ...contentInfo,
  postedBy: {
    ...userInfo,
    registeredAt: registeredAt.toISOString(),
  },
  createdAt: createdAt.toISOString(),
  updatedAt: updatedAt.toISOString(),
});

export default mapToDto;
