import axios from "axios";
import { OEmbedError, OEmbedResponse } from "../dto/oembed";

export interface VideoMetadata {
  authorName: string;
  authorUrl: string;
  thumbnailUrl: string;
  title: string;
}

const isError = (data: OEmbedResponse | OEmbedError): data is OEmbedError =>
  Object.keys(data).includes("error");

export default async (videoUrl: string): Promise<VideoMetadata> => {
  const response = await axios.get<OEmbedResponse | OEmbedError>(
    `https://noembed.com/embed?url=${videoUrl}`
  );

  const oembedData = response.data;
  if (isError(oembedData)) throw new URIError("Invalid video link");

  const { author_name, author_url, thumbnail_url, title } = oembedData;

  return {
    authorName: author_name,
    authorUrl: author_url,
    thumbnailUrl: thumbnail_url,
    title,
  };
};
